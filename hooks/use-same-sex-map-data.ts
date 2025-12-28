import { useMemo } from "react";
import {
  getMapData,
  STATUS_CATEGORIES,
  type StatusCategory,
  type StatusType,
  type DetailedData,
  type RegionData,
  type MapDataResult,
} from "@/services/mapDataService";

// Re-export types for backward compatibility
export type {
  StatusCategory,
  StatusType,
  DetailedData,
  RegionData,
  MapDataResult,
};

export { STATUS_CATEGORIES };

/**
 * Hook to get processed map data for visualization
 * Delegates data processing to mapDataService
 */
export function useSameSexMapData(): MapDataResult {
  return useMemo(() => {
    return getMapData();
  }, []);
}

