import { useMemo } from "react";
import sameSexData from "@/data/same-sex.json";

interface TimelineEvent {
  year: number;
  country: string;
  countryCode: string;
  type: "marriage" | "civil";
  mechanism: string;
  count: number; // 该年该类型的事件总数
}

interface TimelineStats {
  year: number;
  marriageCount: number;
  civilCount: number;
  totalCount: number;
}

/**
 * Hook to process same-sex union timeline data
 * Extracts critical dates for marriage and civil unions
 */
export function useTimelineData() {
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    sameSexData.forEach((entry: any) => {
      const countryName = entry.motherEntry.jurisdiction.name;
      const countryCode = entry.motherEntry.jurisdiction.a2_code;

      // Process marriage critical dates
      if (
        entry.marriage_type?.name === "Yes" &&
        entry.marriage_critical_date_1
      ) {
        events.push({
          year: entry.marriage_critical_date_1,
          country: countryName,
          countryCode,
          type: "marriage",
          mechanism: entry.marriage_mechanism?.name || "Unknown",
          count: 0, // Will be calculated later
        });
      }

      // Process civil union critical dates
      if (entry.civil_type?.name === "Yes" && entry.civil_critical_date_1) {
        events.push({
          year: entry.civil_critical_date_1,
          country: countryName,
          countryCode,
          type: "civil",
          mechanism: entry.civil_mechanism?.name || "Unknown",
          count: 0,
        });
      }
    });

    // Sort by year
    events.sort((a, b) => a.year - b.year);

    // Calculate cumulative counts by year and type
    const yearTypeCounts = new Map<string, number>();
    events.forEach((event) => {
      const key = `${event.year}-${event.type}`;
      const count = (yearTypeCounts.get(key) || 0) + 1;
      yearTypeCounts.set(key, count);
      event.count = count;
    });

    return events;
  }, []);

  // Generate statistics by year
  const yearlyStats = useMemo(() => {
    const statsMap = new Map<number, TimelineStats>();

    timelineEvents.forEach((event) => {
      if (!statsMap.has(event.year)) {
        statsMap.set(event.year, {
          year: event.year,
          marriageCount: 0,
          civilCount: 0,
          totalCount: 0,
        });
      }

      const stats = statsMap.get(event.year)!;
      if (event.type === "marriage") {
        stats.marriageCount++;
      } else {
        stats.civilCount++;
      }
      stats.totalCount++;
    });

    return Array.from(statsMap.values()).sort((a, b) => a.year - b.year);
  }, [timelineEvents]);

  // Calculate cumulative stats
  const cumulativeStats = useMemo(() => {
    let marriageTotal = 0;
    let civilTotal = 0;

    return yearlyStats.map((stats) => {
      marriageTotal += stats.marriageCount;
      civilTotal += stats.civilCount;

      return {
        year: stats.year,
        marriageCount: stats.marriageCount,
        civilCount: stats.civilCount,
        totalCount: stats.totalCount,
        cumulativeMarriage: marriageTotal,
        cumulativeCivil: civilTotal,
        cumulativeTotal: marriageTotal + civilTotal,
      };
    });
  }, [yearlyStats]);

  return {
    timelineEvents,
    yearlyStats,
    cumulativeStats,
  };
}

