import sameSexData from "@/data/same-sex.json";
import { getCountryName } from "@/lib/translations";

/**
 * Summary type statistics structure
 */
export interface SummaryTypeStats {
  name: string;
  count: number;
  percentage: number;
  countries: string[];
}

/**
 * Mechanism statistics structure
 */
export interface MechanismStats {
  name: string;
  marriageCount: number;
  civilCount: number;
  totalCount: number;
  countries: string[];
}

/**
 * Complete statistics data
 */
export interface StatsData {
  summaryTypeStats: SummaryTypeStats[];
  mechanismStats: MechanismStats[];
  totalCountries: number;
}

/**
 * Raw data item from same-sex.json
 */
interface RawDataItem {
  motherEntry: {
    jurisdiction: {
      name: string;
    };
    subjurisdiction?: any;
  };
  summary_type?: {
    name: string;
  };
  marriage_mechanism?: {
    name: string;
  };
  civil_mechanism?: {
    name: string;
  };
}

/**
 * Process same-sex data for statistical analysis
 * Analyzes data by summary types and legal mechanisms
 * 
 * @param rawData - Raw data array from same-sex.json
 * @returns Statistics including summary types and mechanisms
 */
export function processStatsData(rawData: RawDataItem[]): StatsData {
  // Track unique countries to avoid double counting
  const processedCountries = new Set<string>();

  // Summary type statistics
  const summaryTypeMap = new Map<string, Set<string>>();

  // Mechanism statistics
  const mechanismMap = new Map<
    string,
    {
      marriage: Set<string>;
      civil: Set<string>;
    }
  >();

  rawData.forEach((item) => {
    const countryNameEn = item.motherEntry?.jurisdiction?.name;
    const subjurisdiction = item.motherEntry?.subjurisdiction;

    // Only process country-level data to avoid double counting
    if (!countryNameEn || subjurisdiction) return;

    const countryName = getCountryName(countryNameEn);
    const summaryType = item.summary_type?.name;
    const marriageMechanism = item.marriage_mechanism?.name;
    const civilMechanism = item.civil_mechanism?.name;

    // Track processed countries
    processedCountries.add(countryNameEn);

    // Process summary type statistics
    if (summaryType) {
      if (!summaryTypeMap.has(summaryType)) {
        summaryTypeMap.set(summaryType, new Set());
      }
      summaryTypeMap.get(summaryType)!.add(countryName);
    }

    // Process mechanism statistics
    if (marriageMechanism) {
      if (!mechanismMap.has(marriageMechanism)) {
        mechanismMap.set(marriageMechanism, {
          marriage: new Set(),
          civil: new Set(),
        });
      }
      mechanismMap.get(marriageMechanism)!.marriage.add(countryName);
    }

    if (civilMechanism) {
      if (!mechanismMap.has(civilMechanism)) {
        mechanismMap.set(civilMechanism, {
          marriage: new Set(),
          civil: new Set(),
        });
      }
      mechanismMap.get(civilMechanism)!.civil.add(countryName);
    }
  });

  const totalCountries = processedCountries.size;

  // Convert summary type map to array
  const summaryTypeStats: SummaryTypeStats[] = Array.from(
    summaryTypeMap.entries()
  )
    .map(([name, countries]) => ({
      name,
      count: countries.size,
      percentage: (countries.size / totalCountries) * 100,
      countries: Array.from(countries).sort(),
    }))
    .sort((a, b) => b.count - a.count);

  // Convert mechanism map to array
  const mechanismStats: MechanismStats[] = Array.from(mechanismMap.entries())
    .map(([name, data]) => {
      const allCountries = new Set([...data.marriage, ...data.civil]);
      return {
        name,
        marriageCount: data.marriage.size,
        civilCount: data.civil.size,
        totalCount: allCountries.size,
        countries: Array.from(allCountries).sort(),
      };
    })
    .sort((a, b) => b.totalCount - a.totalCount);

  return {
    summaryTypeStats,
    mechanismStats,
    totalCountries,
  };
}

/**
 * Get statistics from default data source
 */
export function getStatsData(): StatsData {
  return processStatsData(sameSexData as RawDataItem[]);
}

/**
 * Get Chinese name for summary type
 */
export function getSummaryTypeName(name: string): string {
  const names: Record<string, string> = {
    "Marriage & Civil Union": "婚姻 & 民事结合",
    "Marriage Only": "仅婚姻",
    Marriage: "婚姻",
    "Civil Union Only": "仅民事结合",
    No: "不支持",
    Varies: "因地区而异",
  };
  return names[name] || name;
}

/**
 * Get badge color for summary type
 */
export function getSummaryTypeColor(name: string): string {
  const colors: Record<string, string> = {
    "Marriage & Civil Union": "bg-[#DBEDDB] text-[#2d6a3e]",
    "Marriage Only": "bg-[#D3E5EF] text-[#1e5a7d]",
    Marriage: "bg-[#D3E5EF] text-[#1e5a7d]",
    "Civil Union Only": "bg-[#E8DEEE] text-[#6d3a7f]",
    No: "bg-[#F7F6F3] text-[#787774]",
    Varies: "bg-[#FBF3DB] text-[#7d6a2d]",
  };
  return colors[name] || "bg-[#F7F6F3] text-[#787774]";
}

/**
 * Get progress bar color for summary type
 */
export function getSummaryTypeBarColor(name: string): string {
  const colors: Record<string, string> = {
    "Marriage & Civil Union": "bg-[#6FCF97]",
    "Marriage Only": "bg-[#56CCF2]",
    Marriage: "bg-[#56CCF2]",
    "Civil Union Only": "bg-[#BB6BD9]",
    No: "bg-[#9B9A97]",
    Varies: "bg-[#F2C94C]",
  };
  return colors[name] || "bg-[#9B9A97]";
}

/**
 * Get Chinese name for mechanism type
 */
export function getMechanismName(name: string): string {
  const names: Record<string, string> = {
    Legislative: "立法",
    Judicial: "司法",
    Executive: "行政",
  };
  return names[name] || name;
}

/**
 * Get icon for mechanism type
 */
export function getMechanismIcon(name: string): string {
  const icons: Record<string, string> = {
    Legislative: "📜",
    Judicial: "⚖️",
    Executive: "🏛️",
  };
  return icons[name] || "📋";
}

