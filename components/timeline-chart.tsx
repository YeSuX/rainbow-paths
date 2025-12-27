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
          let result = `<div style="font-weight: 600; margin-bottom: 6px; color: #37352F;">${year} 年</div>`;

          params.forEach((param: any) => {
            result += `
              <div style="display: flex; align-items: center; margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 8px;"></span>
                <span style="flex: 1; color: #787774;">${param.seriesName}:</span>
                <span style="font-weight: 600; margin-left: 12px; color: #37352F;">${param.value}</span>
              </div>
            `;
          });

          return result;
        },
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderColor: "#E3E2E0",
        borderWidth: 1,
        padding: 12,
        textStyle: {
          color: "#37352F",
        },
        extraCssText:
          "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); border-radius: 8px;",
      },
      legend: {
        data: ["同性婚姻合法化", "民事结合"],
        top: 10,
        textStyle: {
          fontSize: 14,
          color: "#37352F",
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
          color: "#787774",
        },
        axisLine: {
          lineStyle: {
            color: "#E3E2E0",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "累计国家/地区数",
        nameTextStyle: {
          fontSize: 12,
          color: "#787774",
          padding: [0, 0, 0, 0],
        },
        axisLabel: {
          fontSize: 12,
          color: "#787774",
        },
        splitLine: {
          lineStyle: {
            color: "#F1F0ED",
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
              { offset: 0, color: "#6FCF97" }, // 彩虹绿
              { offset: 0.5, color: "#56CCF2" }, // 彩虹蓝
              { offset: 1, color: "#BB6BD9" }, // 彩虹紫
            ]),
          },
          itemStyle: {
            color: "#6FCF97",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(111, 207, 151, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(111, 207, 151, 0.05)",
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
              { offset: 0, color: "#BB6BD9" }, // 彩虹紫
              { offset: 0.5, color: "#F2994A" }, // 彩虹橙
              { offset: 1, color: "#F2C94C" }, // 彩虹黄
            ]),
          },
          itemStyle: {
            color: "#BB6BD9",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(187, 107, 217, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(187, 107, 217, 0.05)",
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
          borderColor: "#E3E2E0",
          fillerColor: "rgba(111, 207, 151, 0.2)",
          borderRadius: 4,
          textStyle: {
            color: "#787774",
          },
          handleStyle: {
            color: "#6FCF97",
            borderColor: "#6FCF97",
          },
          moveHandleStyle: {
            color: "#56CCF2",
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
