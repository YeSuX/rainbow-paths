"use client";

import { useEffect } from "react";
import { useECharts } from "@/hooks/use-echarts";
import { useTimelineData } from "@/hooks/use-timeline-data";
import { createTimelineChartOption } from "@/services/chartConfigService";

export function TimelineChart() {
  const { containerRef, chartInstance, isMobile } = useECharts();
  const { cumulativeStats } = useTimelineData();

  useEffect(() => {
    if (!chartInstance.current || cumulativeStats.length === 0) return;

    const option = createTimelineChartOption(cumulativeStats, isMobile);
    chartInstance.current.setOption(option);
  }, [chartInstance, cumulativeStats, isMobile]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] md:h-[600px]"
      style={{ minHeight: "400px" }}
    />
  );
}
