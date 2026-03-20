import { useState, useMemo } from "react";
import {
  type UpdateEvent,
  filterUpdates,
  groupByMonth,
} from "@/services/updatesService";

export function useUpdatesFilter(events: UpdateEvent[]) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      filterUpdates(events, {
        search,
        types: selectedTypes,
        statuses: selectedStatuses,
      }),
    [events, search, selectedTypes, selectedStatuses]
  );

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  return {
    search,
    setSearch,
    selectedTypes,
    toggleType,
    selectedStatuses,
    toggleStatus,
    filtered,
    grouped,
    clearFilters,
    hasFilters: search !== "" || selectedTypes.length > 0 || selectedStatuses.length > 0,
  };
}
