import { useEffect, useRef, MutableRefObject } from "react";
import * as echarts from "echarts";
import { useIsMobile } from "./use-mobile";

interface UseEChartsOptions {
    onInit?: (chart: echarts.ECharts, isMobile: boolean) => void;
    onResize?: (chart: echarts.ECharts, isMobile: boolean) => void;
}

/**
 * Generic hook for managing ECharts instance lifecycle
 * Handles initialization, resize events, and cleanup with mobile detection
 */
export function useECharts(options?: UseEChartsOptions) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);
    const isMobile = useIsMobile();
    const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize chart instance
        const chart = echarts.init(containerRef.current);
        chartInstanceRef.current = chart;

        // Call custom initialization callback
        options?.onInit?.(chart, isMobile);

        // Debounced resize handler
        const handleResize = () => {
            const currentChart = chartInstanceRef.current;
            if (!currentChart) return;

            // Clear existing timer
            if (resizeTimerRef.current) {
                clearTimeout(resizeTimerRef.current);
            }

            // Debounce resize to improve performance
            resizeTimerRef.current = setTimeout(() => {
                currentChart.resize();
                // Call custom resize callback if provided
                if (options?.onResize) {
                    const currentIsMobile = window.innerWidth < 768;
                    options.onResize(currentChart, currentIsMobile);
                }
            }, 150);
        };

        // Handle window resize
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimerRef.current) {
                clearTimeout(resizeTimerRef.current);
            }
            chart.dispose();
            chartInstanceRef.current = null;
        };
    }, [isMobile, options]);

    return {
        containerRef,
        chartInstance: chartInstanceRef as MutableRefObject<echarts.ECharts | null>,
        isMobile,
    };
}

