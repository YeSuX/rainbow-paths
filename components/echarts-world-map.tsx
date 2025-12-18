"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import worldGeoJSON from "@/data/worldEN.json";

interface EChartsWorldMapProps {
  className?: string;
}

export function EChartsWorldMap({ className = "" }: EChartsWorldMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Register world map
    echarts.registerMap("world", worldGeoJSON as any);

    // Initialize chart
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Configure chart options
    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          return `<strong>${params.name}</strong>`;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: {
          color: "#1f2937",
          fontSize: 12,
        },
      },
      geo: {
        map: "world",
        roam: false,
        zoom: 1.2,
        center: [0, 20],
        itemStyle: {
          areaColor: "#f3f4f6",
          borderColor: "#e5e7eb",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: "#dbeafe",
            borderColor: "#3b82f6",
            borderWidth: 1.5,
          },
        },
        label: {
          show: false,
        },
      },
      series: [
        {
          type: "map",
          map: "world",
          geoIndex: 0,
          data: [],
        },
      ],
    };

    chart.setOption(option);

    // Handle resize
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className={`w-full ${className}`}
      style={{ height: "600px" }}
    />
  );
}
