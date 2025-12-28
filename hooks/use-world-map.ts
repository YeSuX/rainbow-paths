import { useState, useCallback, useEffect, MutableRefObject } from "react";
import * as echarts from "echarts";
import worldGeoJSON from "@/data/worldEN.json";
import regionGeoJSON from "@/data/regionEN.json";
import { MapDataResult, RegionData } from "@/services/mapDataService";
import {
  createWorldMapOption,
  createRegionMapOption,
  getResponsiveMapConfig,
} from "@/lib/world-map-config";

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
 * Hook to manage world map state and interactions
 * Handles map level switching (world/region), click events, and chart updates
 * 
 * @param chartInstance - ECharts instance ref
 * @param mapData - Processed map data from mapDataService
 * @param isMobile - Whether the device is mobile
 * @returns Map state and control functions
 */
export function useWorldMap(
  chartInstance: MutableRefObject<echarts.ECharts | null>,
  mapData: MapDataResult,
  isMobile: boolean
) {
  const [mapState, setMapState] = useState<MapState>({
    level: "world",
    selectedCountry: null,
    selectedCountryCode: null,
  });

  // Get responsive configuration
  const mapConfig = getResponsiveMapConfig(isMobile);

  // Handle map click to drill down to region
  const handleMapClick = useCallback(
    (params: echarts.ECElementEvent) => {
      if (mapState.level === "region") return; // Already at region level

      const countryName = params.name as string;
      const countryCode = COUNTRY_NAME_TO_CODE.get(countryName);

      if (!countryCode) return;

      // Check if both geo data and region data are available
      const hasGeoData = AVAILABLE_REGIONS.has(countryCode);
      const hasRegionData = mapData.regionsByCountry.has(countryCode);

      if (!hasGeoData || !hasRegionData) {
        // No region data available for this country
        return;
      }

      setMapState({
        level: "region",
        selectedCountry: countryName,
        selectedCountryCode: countryCode,
      });
    },
    [mapState.level, mapData.regionsByCountry]
  );

  // Handle back to world map
  const handleBackToWorld = useCallback(() => {
    setMapState({
      level: "world",
      selectedCountry: null,
      selectedCountryCode: null,
    });
  }, []);

  // Update chart when map state or config changes
  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart) return;

    // Register world map GeoJSON
    echarts.registerMap(
      "world",
      worldGeoJSON as unknown as Parameters<typeof echarts.registerMap>[1]
    );

    if (mapState.level === "world") {
      // Show world map
      const option = createWorldMapOption(mapData.countries, mapConfig);
      chart.setOption(option, true);

      // Add click event listener
      chart.off("click");
      chart.on("click", handleMapClick);
    } else if (mapState.level === "region" && mapState.selectedCountryCode) {
      // Show region map
      const regionGeoData =
        regionGeoJSON[
        mapState.selectedCountryCode as keyof typeof regionGeoJSON
        ];

      const regionMapData = mapData.regionsByCountry.get(
        mapState.selectedCountryCode
      );

      if (regionGeoData && regionMapData && regionMapData.length > 0) {
        echarts.registerMap(
          mapState.selectedCountryCode,
          regionGeoData as unknown as Parameters<typeof echarts.registerMap>[1]
        );

        const option = createRegionMapOption(
          mapState.selectedCountryCode,
          regionMapData,
          mapConfig
        );
        chart.setOption(option, true);

        // Remove click handler at region level
        chart.off("click");
      }
    }
  }, [mapData, chartInstance, mapState, handleMapClick, mapConfig]);

  return {
    mapState,
    handleBackToWorld,
    mapConfig,
  };
}

