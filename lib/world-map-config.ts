import * as echarts from "echarts";
import { STATUS_CATEGORIES, CountryData } from "@/hooks/use-same-sex-map-data";

// Map display constants
export const MAP_CONFIG = {
  height: 600,
  zoom: 1.2,
  center: [0, 20] as [number, number],
  backgroundColor: "transparent",
  defaultAreaColor: "#f9fafb",
  borderColor: "#d1d5db",
  borderWidth: 0.5,
  emphasisAreaColor: "#fef3c7",
  emphasisBorderColor: "#f59e0b",
  emphasisBorderWidth: 1.5,
} as const;

// Tooltip styles
const TOOLTIP_STYLES = {
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  borderColor: "#e5e7eb",
  borderWidth: 1,
  textColor: "#1f2937",
  noDataColor: "#9ca3af",
} as const;

/**
 * Generate tooltip formatter function
 */
export function createTooltipFormatter() {
  return (params: echarts.TooltipComponentFormatterCallbackParams) => {
    // Handle single item
    if (!Array.isArray(params) && params.data) {
      const data = params.data as CountryData;
      if (data.status) {
        return `
          <div style="padding: 4px 8px;">
            <strong style="font-size: 14px;">${params.name}</strong>
            <br/>
            <span style="font-size: 12px; color: #6b7280;">
              ${data.status}
            </span>
          </div>
        `;
      }
    }

    // Handle no data case
    const name = Array.isArray(params) ? params[0]?.name : params.name;
    return `
      <div style="padding: 4px 8px;">
        <strong style="font-size: 14px;">${name || "Unknown"}</strong>
        <br/>
        <span style="font-size: 12px; color: ${TOOLTIP_STYLES.noDataColor};">
          No data
        </span>
      </div>
    `;
  };
}

/**
 * Generate visual map pieces from status categories
 */
export function createVisualMapPieces() {
  return Object.entries(STATUS_CATEGORIES).map(([key, category]) => ({
    value: category.value,
    label: key,
    color: category.color,
  }));
}

/**
 * Generate complete ECharts option for world map
 */
export function createWorldMapOption(
  mapData: CountryData[]
): echarts.EChartsOption {
  return {
    backgroundColor: MAP_CONFIG.backgroundColor,
    tooltip: {
      trigger: "item",
      formatter: createTooltipFormatter(),
      backgroundColor: TOOLTIP_STYLES.backgroundColor,
      borderColor: TOOLTIP_STYLES.borderColor,
      borderWidth: TOOLTIP_STYLES.borderWidth,
      textStyle: {
        color: TOOLTIP_STYLES.textColor,
      },
    },
    visualMap: {
      type: "piecewise",
      pieces: createVisualMapPieces(),
      left: "left",
      bottom: "bottom",
      orient: "vertical",
      textStyle: {
        color: "#374151",
        fontSize: 12,
      },
      itemWidth: 20,
      itemHeight: 14,
    },
    geo: {
      map: "world",
      roam: false,
      zoom: MAP_CONFIG.zoom,
      center: MAP_CONFIG.center,
      itemStyle: {
        areaColor: MAP_CONFIG.defaultAreaColor,
        borderColor: MAP_CONFIG.borderColor,
        borderWidth: MAP_CONFIG.borderWidth,
      },
      emphasis: {
        itemStyle: {
          areaColor: MAP_CONFIG.emphasisAreaColor,
          borderColor: MAP_CONFIG.emphasisBorderColor,
          borderWidth: MAP_CONFIG.emphasisBorderWidth,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.1)",
        },
        label: {
          show: false,
        },
      },
      label: {
        show: false,
      },
    },
    series: [
      {
        type: "map",
        map: "world",
        geoIndex: 0,
        data: [],
        emphasis: {
          label: {
            show: false,
          },
        },
      },
    ],
  };
}

