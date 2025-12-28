import { useState, useMemo } from "react";
import {
  TimelineEvent,
  filterEventsByType,
  groupEventsByYear,
} from "@/services/timelineService";

/**
 * Hook to manage timeline events filtering and grouping state
 * Provides filter controls and processed event data for display
 * 
 * @param events - Timeline events to filter
 * @returns Filter state, grouped events, and control functions
 */
export function useTimelineEventsFilter(events: TimelineEvent[]) {
  const [filterType, setFilterType] = useState<"all" | "marriage" | "civil">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );

  // Filter events by type
  const filteredEvents = useMemo(() => {
    return filterEventsByType(events, filterType);
  }, [events, filterType]);

  // Group events by year
  const eventsByYear = useMemo(() => {
    return groupEventsByYear(filteredEvents, sortOrder);
  }, [filteredEvents, sortOrder]);

  return {
    filterType,
    setFilterType,
    sortOrder,
    setSortOrder,
    selectedEvent,
    setSelectedEvent,
    filteredEvents,
    eventsByYear,
  };
}

