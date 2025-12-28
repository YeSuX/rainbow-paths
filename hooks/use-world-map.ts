import { useState, useCallback, useEffect, MutableRefObject } from "react";
import * as echarts from "echarts";
import worldGeoJSON from "@/data/worldEN.json";
import regionGeoJSON from "@/data/regionEN.json";
import { MapDataResult } from "@/services/mapDataService";
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
 * @param onCountryClick - Callback when a country is clicked at world level
 * @param onRegionClick - Callback when a region is clicked at region level
 * @returns Map state and control functions
 */
export function useWorldMap(
  chartInstance: MutableRefObject<echarts.ECharts | null>,
  mapData: MapDataResult,
  isMobile: boolean,
  onCountryClick?: (countryCode: string, countryName: string) => void,
  onRegionClick?: (countryCode: string, countryName: string, regionName: string) => void
) {
  const [mapState, setMapState] = useState<MapState>({
    level: "world",
    selectedCountry: null,
    selectedCountryCode: null,
  });

  // Get responsive configuration
  const mapConfig = getResponsiveMapConfig(isMobile);

  // Handle map click - trigger dialog instead of direct drill-down
  const handleMapClick = useCallback(
    (params: echarts.ECElementEvent) => {
      if (mapState.level === "region") {
        // At region level - trigger region dialog
        const regionName = params.name as string;
        if (onRegionClick && mapState.selectedCountryCode && mapState.selectedCountry) {
          onRegionClick(mapState.selectedCountryCode, mapState.selectedCountry, regionName);
        }
        return;
      }

      // At world level - trigger country dialog
      const countryName = params.name as string;
      const countryCode = COUNTRY_NAME_TO_CODE.get(countryName);

      if (!countryCode) return;

      if (onCountryClick) {
        onCountryClick(countryCode, countryName);
      }
    },
    [mapState.level, mapState.selectedCountry, mapState.selectedCountryCode, onCountryClick, onRegionClick]
  );

  // Drill down to region level (called from dialog)
  const drillDownToRegion = useCallback(
    (countryCode: string, countryName: string) => {
      // Check if both geo data and region data are available
      const hasGeoData = AVAILABLE_REGIONS.has(countryCode);
      const hasRegionData = mapData.regionsByCountry.has(countryCode);

      if (!hasGeoData || !hasRegionData) {
        return;
      }

      setMapState({
        level: "region",
        selectedCountry: countryName,
        selectedCountryCode: countryCode,
      });
    },
    [mapData.regionsByCountry]
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

        // Add click handler at region level for region dialogs
        chart.off("click");
        chart.on("click", handleMapClick);
      }
    }
  }, [mapData, chartInstance, mapState, handleMapClick, mapConfig]);

  return {
    mapState,
    handleBackToWorld,
    drillDownToRegion,
    mapConfig,
  };
}

