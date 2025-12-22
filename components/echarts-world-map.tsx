"use client";

import { useEffect, useState, useCallback } from "react";
import * as echarts from "echarts";
import worldGeoJSON from "@/data/worldEN.json";
import regionGeoJSON from "@/data/regionEN.json";
import { useECharts } from "@/hooks/use-echarts";
import { useSameSexMapData } from "@/hooks/use-same-sex-map-data";
import {
  createWorldMapOption,
  createRegionMapOption,
  MAP_CONFIG,
} from "@/lib/world-map-config";
import { Button } from "@/components/ui/button";

interface EChartsWorldMapProps {
  className?: string;
}

// Build country name to ISO code mapping from worldGeoJSON
const COUNTRY_NAME_TO_CODE = new Map<string, string>(
  worldGeoJSON.features.map((feature) => [
    feature.properties.name,
    feature.properties.id,
  ])
);

// Available region maps
const AVAILABLE_REGIONS = new Set(Object.keys(regionGeoJSON));

type MapLevel = "world" | "region";

interface MapState {
  level: MapLevel;
  selectedCountry: string | null;
  selectedCountryCode: string | null;
}

/**
 * World map component visualizing same-sex marriage legal status by country
 * Supports drilling down into country regions on click
 * Uses ECharts for rendering with custom data processing and styling
 */
export function EChartsWorldMap({ className = "" }: EChartsWorldMapProps) {
  const mapData = useSameSexMapData();
  const { containerRef, chartInstance } = useECharts();

  const [mapState, setMapState] = useState<MapState>({
    level: "world",
    selectedCountry: null,
    selectedCountryCode: null,
  });

  // Handle map click to drill down to region
  const handleMapClick = useCallback(
    (params: echarts.ECElementEvent) => {
      if (mapState.level === "region") return; // Already at region level

      const countryName = params.name as string;
      const countryCode = COUNTRY_NAME_TO_CODE.get(countryName);

      if (!countryCode || !AVAILABLE_REGIONS.has(countryCode)) {
        // No region data available for this country
        return;
      }

      setMapState({
        level: "region",
        selectedCountry: countryName,
        selectedCountryCode: countryCode,
      });
    },
    [mapState.level]
  );

  // Handle back to world map
  const handleBackToWorld = useCallback(() => {
    setMapState({
      level: "world",
      selectedCountry: null,
      selectedCountryCode: null,
    });
  }, []);

  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart) return;

    // Register world map GeoJSON
    // Type assertion via unknown needed as worldGeoJSON structure doesn't fully match ECharts type definitions
    echarts.registerMap(
      "world",
      worldGeoJSON as unknown as Parameters<typeof echarts.registerMap>[1]
    );

    if (mapState.level === "world") {
      // Show world map
      const option = createWorldMapOption(mapData);
      chart.setOption(option, true);

      // Add click event listener
      chart.off("click");
      chart.on("click", handleMapClick);
    } else if (mapState.level === "region" && mapState.selectedCountryCode) {
      // Show region map
      const regionData =
        regionGeoJSON[
          mapState.selectedCountryCode as keyof typeof regionGeoJSON
        ];

      if (regionData) {
        echarts.registerMap(
          mapState.selectedCountryCode,
          regionData as unknown as Parameters<typeof echarts.registerMap>[1]
        );

        const option = createRegionMapOption(
          mapState.selectedCountryCode,
          mapState.selectedCountry || "",
          mapData
        );
        chart.setOption(option, true);

        // Remove click handler at region level
        chart.off("click");
      }
    }
  }, [mapData, chartInstance, mapState, handleMapClick]);

  return (
    <div className="relative">
      {mapState.level === "region" && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-4 py-2 border border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToWorld}
            className="gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to World
          </Button>
          <span className="text-sm font-medium text-gray-700">
            {mapState.selectedCountry}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full ${className}`}
        style={{ height: `${MAP_CONFIG.height}px` }}
      />
    </div>
  );
}
