import { useMemo } from "react";
import sameSexData from "@/data/same-sex.json";
import { getCountryName } from "@/lib/translations";

interface SummaryTypeStats {
  name: string;
  count: number;
  percentage: number;
  countries: string[];
}

interface MechanismStats {
  name: string;
  marriageCount: number;
  civilCount: number;
  totalCount: number;
  countries: string[];
}

export interface StatsData {
  summaryTypeStats: SummaryTypeStats[];
  mechanismStats: MechanismStats[];
  totalCountries: number;
}

/**
 * Hook to process same-sex data for statistical analysis
 * Analyzes data by summary types and legal mechanisms
 */
export function useStatsData(): StatsData {
  return useMemo(() => {
    // Track unique countries to avoid double counting
    const processedCountries = new Set<string>();

    // Summary type statistics
    const summaryTypeMap = new Map<string, Set<string>>();

    // Mechanism statistics
    const mechanismMap = new Map<string, {
      marriage: Set<string>;
      civil: Set<string>;
    }>();

    sameSexData.forEach((item) => {
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
    const mechanismStats: MechanismStats[] = Array.from(
      mechanismMap.entries()
    )
      .map(([name, data]) => {
        const allCountries = new Set([
          ...data.marriage,
          ...data.civil,
        ]);
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
  }, []);
}

