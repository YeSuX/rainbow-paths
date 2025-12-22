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

export interface CountryData {
  name: string;
  value: number;
  status: string;
  itemStyle: {
    areaColor: string;
  };
}

/**
 * Hook to process same-sex marriage data for map visualization
 * Transforms raw JSON data into ECharts-compatible format
 */
export function useSameSexMapData() {
  return useMemo(() => {
    const dataMap = new Map<string, CountryData>();

    sameSexData.forEach((item) => {
      const countryName = item.motherEntry?.jurisdiction?.name;
      const summaryStatus = item.summary_type?.name;

      if (!countryName || !summaryStatus) return;

      const category = STATUS_CATEGORIES[summaryStatus as StatusType];

      // Skip if status category not found
      if (!category) return;

      dataMap.set(countryName, {
        name: countryName,
        value: category.value,
        status: category.name,
        itemStyle: {
          areaColor: category.color,
        },
      });
    });

    return Array.from(dataMap.values());
  }, []);
}

