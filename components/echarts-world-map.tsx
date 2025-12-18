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

  // Extract all unique years from the data
  const allYears = useMemo(() => {
    const yearsSet = new Set<number>();

    sameSexData.forEach((item) => {
      [
        item.marriage_critical_date_1,
        item.marriage_critical_date_2,
        item.civil_critical_date_1,
        item.civil_critical_date_2,
        item.civil_repeal_date_1,
        item.civil_repeal_date_2,
      ].forEach((date) => {
        if (typeof date === "number" && date > 1900 && date <= 2030) {
          yearsSet.add(date);
        }
      });
    });

    // Add current year if not present
    const currentYear = new Date().getFullYear();
    yearsSet.add(currentYear);

    // Convert to sorted array
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, []);

  // Calculate country status at a specific year
  const getStatusAtYear = (
    item: (typeof sameSexData)[0],
    year: number
  ): StatusType => {
    const marriageDate1 = item.marriage_critical_date_1;
    const marriageDate2 = item.marriage_critical_date_2;
    const civilDate1 = item.civil_critical_date_1;
    const civilDate2 = item.civil_critical_date_2;
    const civilRepealDate1 = item.civil_repeal_date_1;

    // Check marriage status
    const hasMarriage =
      (marriageDate1 && year >= marriageDate1) ||
      (marriageDate2 && year >= marriageDate2);

    // Check civil union status (not repealed)
    const hasCivil =
      ((civilDate1 && year >= civilDate1) ||
        (civilDate2 && year >= civilDate2)) &&
      (!civilRepealDate1 || year < civilRepealDate1);

    // Determine status based on combination
    if (hasMarriage && hasCivil) {
      return "Marriage & Civil Union";
    } else if (hasMarriage) {
      return "Marriage";
    } else if (hasCivil) {
      return "Civil Union Only";
    } else if (
      item.summary_type?.name === "Varies" &&
      (marriageDate1 || civilDate1)
    ) {
      // If status varies and some dates exist, check if we're past any date
      const anyDate = Math.min(
        ...[marriageDate1, marriageDate2, civilDate1, civilDate2].filter(
          (d): d is number => typeof d === "number"
        )
      );
      if (year >= anyDate) {
        return "Varies";
      }
    }

    return "No";
  };

  // Process timeline data: for each year, calculate each country's status
  const timelineData = useMemo(() => {
    return allYears.map((year) => {
      const dataMap = new Map<string, CountryData>();

      sameSexData.forEach((item) => {
        const countryName = item.motherEntry?.jurisdiction?.name;
        if (!countryName) return;

        const status = getStatusAtYear(item, year);
        const category = STATUS_CATEGORIES[status];

        dataMap.set(countryName, {
          name: countryName,
          value: category.value,
          status: category.name,
          itemStyle: {
            areaColor: category.color,
          },
        });
      });

      return {
        year,
        data: Array.from(dataMap.values()),
      };
    });
  }, [allYears]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Register world map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    echarts.registerMap("world", worldGeoJSON as any);

    // Initialize chart
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Configure chart options with timeline
    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      timeline: {
        axisType: "category",
        data: timelineData.map((item) => item.year.toString()),
        autoPlay: false,
        playInterval: 2000,
        currentIndex: timelineData.length - 1, // Default to latest year
        loop: false,
        controlStyle: {
          showPlayBtn: true,
          showPrevBtn: true,
          showNextBtn: true,
        },
        label: {
          formatter: "{value}",
          color: "#374151",
        },
        lineStyle: {
          color: "#d1d5db",
        },
        itemStyle: {
          color: "#3b82f6",
        },
        checkpointStyle: {
          color: "#3b82f6",
          borderColor: "#1d4ed8",
        },
        left: "10%",
        right: "10%",
        bottom: 10,
      },
      baseOption: {
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
          bottom: 80,
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
      },
      options: timelineData.map((yearData) => ({
        title: {
          text: `Year: ${yearData.year}`,
          left: "center",
          top: 10,
          textStyle: {
            color: "#1f2937",
            fontSize: 18,
            fontWeight: "bold",
          },
        },
        series: [
          {
            type: "map",
            map: "world",
            geoIndex: 0,
            data: yearData.data,
            emphasis: {
              label: {
                show: false,
              },
            },
          },
        ],
      })),
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
  }, [timelineData]);

  return (
    <div
      ref={chartRef}
      className={`w-full ${className}`}
      style={{ height: "600px" }}
    />
  );
}
