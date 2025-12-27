"use client";

import { useEffect } from "react";
import { useECharts } from "@/hooks/use-echarts";
import { useTimelineData } from "@/hooks/use-timeline-data";
import * as echarts from "echarts";

export function TimelineChart() {
  const { containerRef, chartInstance } = useECharts();
  const { cumulativeStats } = useTimelineData();

  useEffect(() => {
    if (!chartInstance.current || cumulativeStats.length === 0) return;

    const years = cumulativeStats.map((s) => s.year);
    const marriageData = cumulativeStats.map((s) => s.cumulativeMarriage);
    const civilData = cumulativeStats.map((s) => s.cumulativeCivil);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: function (params: any) {
          const year = params[0].axisValue;
          let result = `<div style="font-weight: bold; margin-bottom: 6px;">${year} 年</div>`;

          params.forEach((param: any) => {
            result += `
              <div style="display: flex; align-items: center; margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 8px;"></span>
                <span style="flex: 1;">${param.seriesName}:</span>
                <span style="font-weight: bold; margin-left: 12px;">${param.value}</span>
              </div>
            `;
          });

          return result;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 12,
        textStyle: {
          color: "#333",
        },
      },
      legend: {
        data: ["同性婚姻合法化", "民事结合"],
        top: 10,
        textStyle: {
          fontSize: 14,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "8%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: years,
        axisLabel: {
          fontSize: 12,
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "累计国家/地区数",
        nameTextStyle: {
          fontSize: 12,
          color: "#666",
          padding: [0, 0, 0, 0],
        },
        axisLabel: {
          fontSize: 12,
          color: "#666",
        },
        splitLine: {
          lineStyle: {
            color: "#eee",
          },
        },
      },
      series: [
        {
          name: "同性婚姻合法化",
          type: "line",
          smooth: true,
          data: marriageData,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#FF6B6B" },
              { offset: 0.5, color: "#FFD93D" },
              { offset: 1, color: "#6BCF7F" },
            ]),
          },
          itemStyle: {
            color: "#FF6B6B",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(255, 107, 107, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(255, 107, 107, 0.05)",
              },
            ]),
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: "民事结合",
          type: "line",
          smooth: true,
          data: civilData,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#4ECDC4" },
              { offset: 0.5, color: "#6C63FF" },
              { offset: 1, color: "#A685E2" },
            ]),
          },
          itemStyle: {
            color: "#4ECDC4",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(78, 205, 196, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(78, 205, 196, 0.05)",
              },
            ]),
          },
          emphasis: {
            focus: "series",
          },
        },
      ],
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 100,
          height: 25,
          bottom: 10,
          borderColor: "#ddd",
          textStyle: {
            color: "#666",
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [chartInstance, cumulativeStats]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] md:h-[600px]"
      style={{ minHeight: "400px" }}
    />
  );
}

