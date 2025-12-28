import { useMemo } from "react";
import {
  getTimelineData,
  type TimelineEvent,
  type TimelineStats,
  type CumulativeStats,
  type TimelineDataResult,
} from "@/services/timelineService";

// Re-export types for backward compatibility
export type { TimelineEvent, TimelineStats, CumulativeStats };

/**
 * Hook to get processed timeline data
 * Delegates data processing to timelineService
 */
export function useTimelineData(): TimelineDataResult {
  return useMemo(() => {
    return getTimelineData();
  }, []);
}

