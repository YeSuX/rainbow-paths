import { useMemo } from "react";
import {
  getStatsData,
  type StatsData,
  type SummaryTypeStats,
  type MechanismStats,
} from "@/services/statsService";

// Re-export types for backward compatibility
export type { StatsData, SummaryTypeStats, MechanismStats };

/**
 * Hook to get processed statistics data
 * Delegates data processing to statsService
 */
export function useStatsData(): StatsData {
  return useMemo(() => {
    return getStatsData();
  }, []);
}

