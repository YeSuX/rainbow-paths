import { useMemo } from "react";
import sameSexData from "@/data/same-sex.json";

export interface TimelineEvent {
  id: string;
  year: number;
  country: string;
  countryCode: string;
  type: "marriage" | "civil";
  mechanism: string;
  count: number;
  // 详细信息
  explanation: string;
  subjurisdiction: string | null;
  criticalDate2: number | null;
  repealDate1: number | null;
  repealDate2: number | null;
  sources: any[];
  summaryType: string;
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
      const subjurisdiction = entry.motherEntry.subjurisdiction?.name || null;

      // Process marriage critical dates
      if (
        entry.marriage_type?.name === "Yes" &&
        entry.marriage_critical_date_1
      ) {
        events.push({
          id: `${entry.id}-marriage`,
          year: entry.marriage_critical_date_1,
          country: countryName,
          countryCode,
          type: "marriage",
          mechanism: entry.marriage_mechanism?.name || "Unknown",
          count: 0,
          explanation: entry.marriage_explan || "",
          subjurisdiction,
          criticalDate2: entry.marriage_critical_date_2,
          repealDate1: null,
          repealDate2: null,
          sources: entry.motherEntry.sources || [],
          summaryType: entry.summary_type?.name || "",
        });
      }

      // Process civil union critical dates
      if (entry.civil_type?.name === "Yes" && entry.civil_critical_date_1) {
        events.push({
          id: `${entry.id}-civil`,
          year: entry.civil_critical_date_1,
          country: countryName,
          countryCode,
          type: "civil",
          mechanism: entry.civil_mechanism?.name || "Unknown",
          count: 0,
          explanation: entry.civil_explan || "",
          subjurisdiction,
          criticalDate2: entry.civil_critical_date_2,
          repealDate1: entry.civil_repeal_date_1,
          repealDate2: entry.civil_repeal_date_2,
          sources: entry.motherEntry.sources || [],
          summaryType: entry.summary_type?.name || "",
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

