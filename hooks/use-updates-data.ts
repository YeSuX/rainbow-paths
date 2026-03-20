import { useMemo } from "react";
import { getUpdates, getUpdatesStats } from "@/services/updatesService";

export function useUpdatesData() {
  return useMemo(() => {
    const events = getUpdates();
    const stats = getUpdatesStats(events);
    return { events, stats };
  }, []);
}
