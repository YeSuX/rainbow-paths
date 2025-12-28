import sameSexData from "@/data/same-sex.json";
import {
  getCountryName,
  getMechanismName,
  getTranslatedField,
  getSubjurisdictionName,
  getStatusName,
} from "@/lib/translations";

/**
 * Timeline event structure
 */
export interface TimelineEvent {
  id: string;
  year: number;
  country: string;
  countryCode: string;
  type: "marriage" | "civil";
  mechanism: string;
  count: number;
  // Detailed information
  explanation: string;
  subjurisdiction: string | null;
  criticalDate2: number | null;
  repealDate1: number | null;
  repealDate2: number | null;
  sources: any[];
  summaryType: string;
}

/**
 * Timeline statistics by year
 */
export interface TimelineStats {
  year: number;
  marriageCount: number;
  civilCount: number;
  totalCount: number;
}

/**
 * Cumulative timeline statistics
 */
export interface CumulativeStats extends TimelineStats {
  cumulativeMarriage: number;
  cumulativeCivil: number;
  cumulativeTotal: number;
}

/**
 * Timeline data result
 */
export interface TimelineDataResult {
  timelineEvents: TimelineEvent[];
  yearlyStats: TimelineStats[];
  cumulativeStats: CumulativeStats[];
}

/**
 * Raw data item from same-sex.json
 */
interface RawDataItem {
  id: string;
  motherEntry: {
    jurisdiction: {
      name: string;
      a2_code: string;
    };
    subjurisdiction?: {
      id: string;
      name: string;
      slug: string;
      name_zh?: string;
    } | null;
    sources?: any[];
  };
  summary_type?: {
    name: string;
  };
  marriage_type?: {
    name: string;
  };
  marriage_mechanism?: {
    name: string;
  };
  marriage_explan?: string;
  marriage_explan_zh?: string;
  marriage_critical_date_1?: number | null;
  marriage_critical_date_2?: number | null;
  civil_type?: {
    name: string;
  };
  civil_mechanism?: {
    name: string;
  };
  civil_explan?: string;
  civil_explan_zh?: string;
  civil_critical_date_1?: number | null;
  civil_critical_date_2?: number | null;
  civil_repeal_date_1?: number | null;
  civil_repeal_date_2?: number | null;
}

/**
 * Process same-sex union timeline data
 * Extracts critical dates for marriage and civil unions
 * 
 * @param rawData - Raw data array from same-sex.json
 * @returns Timeline events with yearly and cumulative statistics
 */
export function processTimelineData(
  rawData: RawDataItem[]
): TimelineDataResult {
  const events: TimelineEvent[] = [];

  rawData.forEach((entry: RawDataItem) => {
    const countryNameEn = entry.motherEntry.jurisdiction.name;
    const countryName = getCountryName(countryNameEn, true);
    const countryCode = entry.motherEntry.jurisdiction.a2_code;
    const subjurisdiction = getSubjurisdictionName(
      entry.motherEntry.subjurisdiction
    );

    // Process marriage critical dates
    if (
      entry.marriage_type?.name === "Yes" &&
      entry.marriage_critical_date_1
    ) {
      const mechanismEn = entry.marriage_mechanism?.name || "Unknown";
      const explanation = getTranslatedField(entry, "marriage_explan");
      const summaryTypeEn = entry.summary_type?.name || "";

      if (!!countryName) {
        events.push({
          id: `${entry.id}-marriage`,
          year: entry.marriage_critical_date_1,
          country: countryName,
          countryCode,
          type: "marriage",
          mechanism: getMechanismName(mechanismEn),
          count: 0,
          explanation: explanation,
          subjurisdiction,
          criticalDate2: entry.marriage_critical_date_2 || null,
          repealDate1: null,
          repealDate2: null,
          sources: entry.motherEntry.sources || [],
          summaryType: getStatusName(summaryTypeEn),
        });
      }
    }

    // Process civil union critical dates
    if (entry.civil_type?.name === "Yes" && entry.civil_critical_date_1) {
      const mechanismEn = entry.civil_mechanism?.name || "Unknown";
      const explanation = getTranslatedField(entry, "civil_explan");
      const summaryTypeEn = entry.summary_type?.name || "";

      if (!!countryName) {
        events.push({
          id: `${entry.id}-civil`,
          year: entry.civil_critical_date_1,
          country: countryName,
          countryCode,
          type: "civil",
          mechanism: getMechanismName(mechanismEn),
          count: 0,
          explanation: explanation,
          subjurisdiction,
          criticalDate2: entry.civil_critical_date_2 || null,
          repealDate1: entry.civil_repeal_date_1 || null,
          repealDate2: entry.civil_repeal_date_2 || null,
          sources: entry.motherEntry.sources || [],
          summaryType: getStatusName(summaryTypeEn),
        });
      }
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

  // Generate yearly statistics
  const yearlyStats = calculateYearlyStats(events);

  // Calculate cumulative statistics
  const cumulativeStats = calculateCumulativeStats(yearlyStats);

  return {
    timelineEvents: events,
    yearlyStats,
    cumulativeStats,
  };
}

/**
 * Calculate yearly statistics from timeline events
 * Deduplicates by country and type
 */
function calculateYearlyStats(events: TimelineEvent[]): TimelineStats[] {
  const statsMap = new Map<number, TimelineStats>();

  // Deduplicate by country and type
  const seen = new Set<string>();
  events.forEach((event) => {
    const key = `${event.country}_${event.type}`;
    if (seen.has(key)) return;
    seen.add(key);

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
}

/**
 * Calculate cumulative statistics from yearly statistics
 */
function calculateCumulativeStats(
  yearlyStats: TimelineStats[]
): CumulativeStats[] {
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
}

/**
 * Get timeline data from default data source
 */
export function getTimelineData(): TimelineDataResult {
  return processTimelineData(sameSexData as RawDataItem[]);
}

/**
 * Filter timeline events by type
 */
export function filterEventsByType(
  events: TimelineEvent[],
  type: "all" | "marriage" | "civil"
): TimelineEvent[] {
  if (type === "all") return events;
  return events.filter((event) => event.type === type);
}

/**
 * Group events by year
 */
export function groupEventsByYear(
  events: TimelineEvent[],
  sortOrder: "asc" | "desc" = "desc"
): Array<{ year: number; events: TimelineEvent[] }> {
  const years = Array.from(new Set(events.map((e) => e.year))).sort((a, b) =>
    sortOrder === "asc" ? a - b : b - a
  );

  return years.map((year) => ({
    year,
    events: events.filter((e) => e.year === year),
  }));
}

/**
 * Calculate timeline statistics for a specific event type
 * Returns unique count and first event info
 */
export function calculateTimelineStatsByType(
  events: TimelineEvent[],
  type: "marriage" | "civil"
): {
  count: number;
  firstYear: number;
  firstCountry: string;
} {
  const filteredEvents = events.filter((e) => e.type === type);
  const uniqueCountries = new Set(filteredEvents.map((e) => e.country));
  const sortedEvents = filteredEvents.sort((a, b) => a.year - b.year);
  const firstEvent = sortedEvents[0];

  return {
    count: uniqueCountries.size,
    firstYear: firstEvent?.year || 0,
    firstCountry: firstEvent?.country || "",
  };
}

