"use client";

import { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import worldGeoJSON from "@/data/worldEN.json";
import sameSexData from "@/data/same-sex.json";

interface EChartsWorldMapProps {
  className?: string;
}

// Legal status categories with priority (higher = more progressive)
const STATUS_CATEGORIES = {
  "Marriage & Civil Union": {
    value: 5,
    color: "#10b981",
    name: "婚姻 & 民事结合",
  }, // Green 500
  Marriage: { value: 4, color: "#3b82f6", name: "婚姻" }, // Blue 500
  "Civil Union Only": { value: 3, color: "#8b5cf6", name: "仅民事结合" }, // Purple 500
  Varies: { value: 2, color: "#f59e0b", name: "因地区而异" }, // Amber 500
  No: { value: 1, color: "#e5e7eb", name: "否" }, // Gray 200
  Unclear: { value: 0, color: "#e5e7eb", name: "不明确" },
} as const;

type StatusType = keyof typeof STATUS_CATEGORIES;

interface CountryData {
  name: string;
  value: number;
  status: string;
  itemStyle: {
    areaColor: string;
  };
}

export function EChartsWorldMap({ className = "" }: EChartsWorldMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // Process same-sex marriage data
  const mapData = useMemo(() => {
    const dataMap = new Map<string, CountryData>();

    const set = new Set();
    sameSexData.forEach((item) => {
      const countryName = item.motherEntry?.jurisdiction?.name;
      const summaryStatus = item.summary_type?.name;

      if (!countryName || !summaryStatus) return;

      set.add(summaryStatus);

      const category =
        STATUS_CATEGORIES[summaryStatus as keyof typeof STATUS_CATEGORIES];

      dataMap.set(countryName, {
        name: countryName,
        value: category.value,
        status: category.name,
        itemStyle: {
          areaColor: category.color,
        },
      });
    });

    console.log(set);

    return Array.from(dataMap.values());
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Register world map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    echarts.registerMap("world", worldGeoJSON as any);

    // Initialize chart
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Configure chart options
    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const param =
            params as echarts.TooltipComponentFormatterCallbackParams;
          if (!Array.isArray(param) && param.data) {
            const data = param.data as CountryData;
            if (data.status) {
              return `
                <div style="padding: 4px 8px;">
                  <strong style="font-size: 14px;">${param.name}</strong>
                  <br/>
                  <span style="font-size: 12px; color: #6b7280;">
                    ${data.status}
                  </span>
                </div>
              `;
            }
          }
          const name = Array.isArray(param) ? param[0]?.name : param.name;
          return `
            <div style="padding: 4px 8px;">
              <strong style="font-size: 14px;">${name || "Unknown"}</strong>
              <br/>
              <span style="font-size: 12px; color: #9ca3af;">
                No data
              </span>
            </div>
          `;
        },
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: {
          color: "#1f2937",
        },
      },
      visualMap: {
        type: "piecewise",
        pieces: [
          {
            value: 5,
            label: "Marriage & Civil Union",
            color: "#10b981",
          },
          { value: 4, label: "Marriage", color: "#3b82f6" },
          { value: 3, label: "Civil Union Only", color: "#8b5cf6" },
          { value: 2, label: "Varies", color: "#f59e0b" },
          { value: 1, label: "No", color: "#e5e7eb" },
          { value: 0, label: "Unclear", color: "#e5e7eb" },
        ],
        left: "left",
        bottom: "bottom",
        orient: "vertical",
        textStyle: {
          color: "#374151",
          fontSize: 12,
        },
        itemWidth: 20,
        itemHeight: 14,
      },
      geo: {
        map: "world",
        roam: false,
        zoom: 1.2,
        center: [0, 20],
        itemStyle: {
          areaColor: "#f9fafb",
          borderColor: "#d1d5db",
          borderWidth: 0.5,
        },
        emphasis: {
          itemStyle: {
            areaColor: "#fef3c7",
            borderColor: "#f59e0b",
            borderWidth: 1.5,
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.1)",
          },
          label: {
            show: false,
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
          data: mapData,
          emphasis: {
            label: {
              show: false,
            },
          },
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
  }, [mapData]);

  return (
    <div
      ref={chartRef}
      className={`w-full ${className}`}
      style={{ height: "600px" }}
    />
  );
}
