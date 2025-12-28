import { DetailedData, RegionData, MapDataResult } from "./mapDataService";

/**
 * Dialog data type: country or region
 */
export type DialogType = "country" | "region";

/**
 * Country dialog data with drill-down capability info
 */
export interface CountryDialogData {
  type: "country";
  name: string;
  nameCN: string;
  status: string;
  value: number;
  marriageType?: string;
  marriageExplan?: string;
  marriageCriticalDate?: number | null;
  civilType?: string;
  civilExplan?: string;
  civilCriticalDate?: number | null;
  civilMechanism?: string;
  canDrillDown: boolean; // Whether this country has region data
  countryCode: string;
}

/**
 * Region dialog data
 */
export interface RegionDialogData {
  type: "region";
  name: string;
  nameCN: string;
  status: string;
  value: number;
  marriageType?: string;
  marriageExplan?: string;
  marriageCriticalDate?: number | null;
  civilType?: string;
  civilExplan?: string;
  civilCriticalDate?: number | null;
  civilMechanism?: string;
  regionId: string;
  regionSlug: string;
  countryCode: string;
  countryName: string;
}

/**
 * Union type for dialog data
 */
export type DialogData = CountryDialogData | RegionDialogData;

/**
 * Get country dialog data by country code
 * 
 * @param countryCode - ISO country code (e.g., "US", "CN")
 * @param countryName - Country name for fallback
 * @param mapData - Processed map data
 * @returns Country dialog data or null if not found
 */
export function getCountryDialogData(
  countryCode: string,
  countryName: string,
  mapData: MapDataResult
): CountryDialogData | null {
  const countryData = mapData.countries.find((c) => c.name === countryName);
  
  if (!countryData) {
    return null;
  }

  const hasRegionData = mapData.regionsByCountry.has(countryCode);

  return {
    type: "country",
    name: countryData.name,
    nameCN: countryData.nameCN,
    status: countryData.status,
    value: countryData.value,
    marriageType: countryData.marriageType,
    marriageExplan: countryData.marriageExplan,
    marriageCriticalDate: countryData.marriageCriticalDate,
    civilType: countryData.civilType,
    civilExplan: countryData.civilExplan,
    civilCriticalDate: countryData.civilCriticalDate,
    civilMechanism: countryData.civilMechanism,
    canDrillDown: hasRegionData,
    countryCode,
  };
}

/**
 * Get region dialog data by country code and region name
 * 
 * @param countryCode - ISO country code
 * @param countryName - Country name for context
 * @param regionName - Region name (English)
 * @param mapData - Processed map data
 * @returns Region dialog data or null if not found
 */
export function getRegionDialogData(
  countryCode: string,
  countryName: string,
  regionName: string,
  mapData: MapDataResult
): RegionDialogData | null {
  const regions = mapData.regionsByCountry.get(countryCode);
  
  if (!regions) {
    return null;
  }

  const regionData = regions.find((r) => r.name === regionName);
  
  if (!regionData) {
    return null;
  }

  return {
    type: "region",
    name: regionData.name,
    nameCN: regionData.nameCN,
    status: regionData.status,
    value: regionData.value,
    marriageType: regionData.marriageType,
    marriageExplan: regionData.marriageExplan,
    marriageCriticalDate: regionData.marriageCriticalDate,
    civilType: regionData.civilType,
    civilExplan: regionData.civilExplan,
    civilCriticalDate: regionData.civilCriticalDate,
    civilMechanism: regionData.civilMechanism,
    regionId: regionData.regionId,
    regionSlug: regionData.regionSlug,
    countryCode,
    countryName,
  };
}

/**
 * Format date timestamp to readable string
 * 
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string (YYYY-MM-DD) or empty string
 */
export function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
}

/**
 * Get status display label
 * 
 * @param status - Status code
 * @returns Human-readable status label
 */
export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    legal: "合法",
    illegal: "非法",
    unknown: "未知",
    partial: "部分地区",
  };

  return statusMap[status] || status;
}

