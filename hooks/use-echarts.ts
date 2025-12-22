import { useEffect, useRef, MutableRefObject } from "react";
import * as echarts from "echarts";

interface UseEChartsOptions {
    onInit?: (chart: echarts.ECharts) => void;
}

/**
 * Generic hook for managing ECharts instance lifecycle
 * Handles initialization, resize events, and cleanup
 */
export function useECharts(options?: UseEChartsOptions) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize chart instance
        const chart = echarts.init(containerRef.current);
        chartInstanceRef.current = chart;

        // Call custom initialization callback
        options?.onInit?.(chart);

        // Handle window resize
        const handleResize = () => {
            chart.resize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.dispose();
            chartInstanceRef.current = null;
        };
    }, [options?.onInit]);

    return {
        containerRef,
        chartInstance: chartInstanceRef as MutableRefObject<echarts.ECharts | null>,
    };
}

