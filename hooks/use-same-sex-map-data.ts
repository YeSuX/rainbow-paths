import { useMemo } from "react";
import sameSexData from "@/data/same-sex.json";
import {
  getCountryName,
  getMechanismName,
  getTranslatedField,
  getSubjurisdictionName,
  getStatusName,
} from "@/lib/translations";

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
  name: string; // English name for ECharts matching
  nameCN: string; // Chinese name for display
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
      const countryNameEn = item.motherEntry?.jurisdiction?.name;
      const countryName = countryNameEn ? getCountryName(countryNameEn) : "";
      const countryCode = item.motherEntry?.jurisdiction?.a2_code;
      const summaryStatus = item.summary_type?.name;
      const subjurisdiction = item.motherEntry?.subjurisdiction;

      if (!countryNameEn || !summaryStatus) return;

      const category = STATUS_CATEGORIES[summaryStatus as StatusType];
      if (!category) return;

      const marriageTypeEn = item.marriage_type?.name;
      const civilTypeEn = item.civil_type?.name;
      const civilMechanismEn = item.civil_mechanism?.name;

      const detailedInfo: DetailedData = {
        name: countryNameEn, // Keep English name for ECharts matching
        nameCN: countryName, // Chinese name for display
        value: category.value,
        status: category.name,
        itemStyle: {
          areaColor: category.color,
        },
        marriageType: marriageTypeEn ? getStatusName(marriageTypeEn) : undefined,
        marriageExplan: getTranslatedField(item, "marriage_explan") || undefined,
        marriageCriticalDate: item.marriage_critical_date_1,
        civilType: civilTypeEn ? getStatusName(civilTypeEn) : undefined,
        civilExplan: getTranslatedField(item, "civil_explan") || undefined,
        civilCriticalDate: item.civil_critical_date_1,
        civilMechanism: civilMechanismEn
          ? getMechanismName(civilMechanismEn)
          : undefined,
        summaryType: getStatusName(summaryStatus),
      };

      // Country-level data (no subjurisdiction)
      if (!subjurisdiction) {
        countryMap.set(countryNameEn, detailedInfo);
      } else if (countryCode) {
        // Region-level data (only if countryCode is available)
        const subjurisdictionNameCN = getSubjurisdictionName(subjurisdiction);
        const regionData: RegionData = {
          ...detailedInfo,
          name: subjurisdiction.name, // Keep English name for ECharts matching
          nameCN: subjurisdictionNameCN || subjurisdiction.name, // Chinese name for display
          regionId: subjurisdiction.id,
          regionSlug: subjurisdiction.slug,
        };

        if (!regionsByCountry.has(countryCode)) {
          regionsByCountry.set(countryCode, []);
        }
        regionsByCountry.get(countryCode)!.push(regionData);

        // Mark country as "Varies" if it has regional differences
        if (!countryMap.has(countryNameEn)) {
          const variesCategory = STATUS_CATEGORIES["Varies"];
          countryMap.set(countryNameEn, {
            name: countryNameEn, // Keep English name for ECharts matching
            nameCN: countryName, // Chinese name for display
            value: variesCategory.value,
            status: variesCategory.name,
            itemStyle: {
              areaColor: variesCategory.color,
            },
            summaryType: getStatusName("Varies"),
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

