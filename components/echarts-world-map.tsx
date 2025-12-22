"use client";

import { useEffect } from "react";
import * as echarts from "echarts";
import worldGeoJSON from "@/data/worldEN.json";
import { useECharts } from "@/hooks/use-echarts";
import { useSameSexMapData } from "@/hooks/use-same-sex-map-data";
import { createWorldMapOption, MAP_CONFIG } from "@/lib/world-map-config";

interface EChartsWorldMapProps {
  className?: string;
}

/**
 * World map component visualizing same-sex marriage legal status by country
 * Uses ECharts for rendering with custom data processing and styling
 */
export function EChartsWorldMap({ className = "" }: EChartsWorldMapProps) {
  const mapData = useSameSexMapData();
  const { containerRef, chartInstance } = useECharts();

  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart) return;

    // Register world map GeoJSON
    // Type assertion via unknown needed as worldGeoJSON structure doesn't fully match ECharts type definitions
    echarts.registerMap(
      "world",
      worldGeoJSON as unknown as Parameters<typeof echarts.registerMap>[1]
    );

    // Apply map configuration
    const option = createWorldMapOption(mapData);
    chart.setOption(option);
  }, [mapData, chartInstance]);

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ height: `${MAP_CONFIG.height}px` }}
    />
  );
}
