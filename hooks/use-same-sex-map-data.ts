import { useMemo } from "react";
import sameSexData from "@/data/same-sex.json";

export interface StatusCategory {
  value: number;
  color: string;
  name: string;
}

export const STATUS_CATEGORIES = {
  "Marriage & Civil Union": {
    value: 5,
    color: "#10b981",
    name: "婚姻 & 民事结合",
  },
  Marriage: {
    value: 4,
    color: "#3b82f6",
    name: "婚姻",
  },
  "Civil Union Only": {
    value: 3,
    color: "#8b5cf6",
    name: "仅民事结合",
  },
  Varies: {
    value: 2,
    color: "#f59e0b",
    name: "因地区而异",
  },
  No: {
    value: 1,
    color: "#e5e7eb",
    name: "否",
  },
  Unclear: {
    value: 0,
    color: "#e5e7eb",
    name: "不明确",
  },
} as const;

export type StatusType = keyof typeof STATUS_CATEGORIES;

export interface DetailedData {
  name: string;
  value: number;
  status: string;
  itemStyle: {
    areaColor: string;
  };
  // Extended fields for tooltip
  marriageType?: string;
  marriageExplan?: string;
  marriageCriticalDate?: number | null;
  civilType?: string;
  civilExplan?: string;
  civilCriticalDate?: number | null;
  civilMechanism?: string;
  summaryType?: string;
}

export interface RegionData extends DetailedData {
  regionId: string;
  regionSlug: string;
}

export interface MapDataResult {
  countries: DetailedData[];
  regionsByCountry: Map<string, RegionData[]>;
}

/**
 * Hook to process same-sex marriage data for map visualization
 * Separates country-level and region-level data
 * Transforms raw JSON data into ECharts-compatible format with detailed info
 */
export function useSameSexMapData(): MapDataResult {
  return useMemo(() => {
    const countryMap = new Map<string, DetailedData>();
    const regionsByCountry = new Map<string, RegionData[]>();

    sameSexData.forEach((item) => {
      const countryName = item.motherEntry?.jurisdiction?.name;
      const countryCode = item.motherEntry?.jurisdiction?.a2_code;
      const summaryStatus = item.summary_type?.name;
      const subjurisdiction = item.motherEntry?.subjurisdiction;

      if (!countryName || !summaryStatus) return;

      const category = STATUS_CATEGORIES[summaryStatus as StatusType];
      if (!category) return;

      const detailedInfo: DetailedData = {
        name: countryName,
        value: category.value,
        status: category.name,
        itemStyle: {
          areaColor: category.color,
        },
        marriageType: item.marriage_type?.name,
        marriageExplan: item.marriage_explan || undefined,
        marriageCriticalDate: item.marriage_critical_date_1,
        civilType: item.civil_type?.name,
        civilExplan: item.civil_explan || undefined,
        civilCriticalDate: item.civil_critical_date_1,
        civilMechanism: item.civil_mechanism?.name,
        summaryType: summaryStatus,
      };

      // Country-level data (no subjurisdiction)
      if (!subjurisdiction) {
        countryMap.set(countryName, detailedInfo);
      } else if (countryCode) {
        // Region-level data (only if countryCode is available)
        const regionData: RegionData = {
          ...detailedInfo,
          name: subjurisdiction.name,
          regionId: subjurisdiction.id,
          regionSlug: subjurisdiction.slug,
        };

        if (!regionsByCountry.has(countryCode)) {
          regionsByCountry.set(countryCode, []);
        }
        regionsByCountry.get(countryCode)!.push(regionData);

        // Mark country as "Varies" if it has regional differences
        if (!countryMap.has(countryName)) {
          const variesCategory = STATUS_CATEGORIES["Varies"];
          countryMap.set(countryName, {
            name: countryName,
            value: variesCategory.value,
            status: variesCategory.name,
            itemStyle: {
              areaColor: variesCategory.color,
            },
            summaryType: "Varies",
          });
        }
      }
    });

    return {
      countries: Array.from(countryMap.values()),
      regionsByCountry,
    };
  }, []);
}

