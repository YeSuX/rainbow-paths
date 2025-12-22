import * as echarts from "echarts";
import { STATUS_CATEGORIES, DetailedData, RegionData } from "@/hooks/use-same-sex-map-data";

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
 * Escape HTML special characters to prevent XSS and rendering issues
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Generate tooltip formatter function with detailed information
 */
export function createTooltipFormatter() {
  return (params: echarts.TooltipComponentFormatterCallbackParams) => {
    // Handle single item
    if (!Array.isArray(params) && params.data) {
      const data = params.data as DetailedData | RegionData;
      if (data.status) {
        const safeName = escapeHtml(params.name as string);
        const safeStatus = escapeHtml(data.status);

        let content = `
          <div style="
            padding: 8px 12px; 
            min-width: 220px; 
            max-width: 350px; 
            box-sizing: border-box;
          ">
            <strong style="font-size: 15px; color: #111827; display: block; margin-bottom: 8px;">
              ${safeName}
            </strong>
            <div style="font-size: 13px; color: #374151; margin-bottom: 6px;">
              <strong>整体状态：</strong>${safeStatus}
            </div>
        `;

        // Marriage info
        if (data.marriageType) {
          const safeMarriageType = escapeHtml(data.marriageType);
          content += `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 6px; margin-top: 6px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                <strong>婚姻：</strong>${safeMarriageType}
                ${data.marriageCriticalDate ? ` (${data.marriageCriticalDate})` : ''}
              </div>
          `;
          if (data.marriageExplan) {
            const shortExplan = data.marriageExplan.length > 120
              ? data.marriageExplan.substring(0, 120) + '...'
              : data.marriageExplan;
            const safeExplan = escapeHtml(shortExplan);
            content += `
              <div style="
                font-size: 11px; 
                color: #9ca3af; 
                line-height: 1.5; 
                max-width: 100%; 
                word-wrap: break-word; 
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
              ">
                ${safeExplan}
              </div>
            `;
          }
          content += `</div>`;
        }

        // Civil union info
        if (data.civilType) {
          const safeCivilType = escapeHtml(data.civilType);
          const safeCivilMechanism = data.civilMechanism ? escapeHtml(data.civilMechanism) : '';
          content += `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 6px; margin-top: 6px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                <strong>民事结合：</strong>${safeCivilType}
                ${data.civilCriticalDate ? ` (${data.civilCriticalDate})` : ''}
                ${data.civilMechanism ? ` - ${safeCivilMechanism}` : ''}
              </div>
          `;
          if (data.civilExplan) {
            const shortExplan = data.civilExplan.length > 120
              ? data.civilExplan.substring(0, 120) + '...'
              : data.civilExplan;
            const safeExplan = escapeHtml(shortExplan);
            content += `
              <div style="
                font-size: 11px; 
                color: #9ca3af; 
                line-height: 1.5; 
                max-width: 100%; 
                word-wrap: break-word; 
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
              ">
                ${safeExplan}
              </div>
            `;
          }
          content += `</div>`;
        }

        content += `</div>`;
        return content;
      }
    }

    // Handle no data case
    const name = Array.isArray(params) ? params[0]?.name : params.name;
    const safeName = name ? escapeHtml(name as string) : "Unknown";
    return `
      <div style="padding: 8px 12px;">
        <strong style="font-size: 14px;">${safeName}</strong>
        <br/>
        <span style="font-size: 12px; color: ${TOOLTIP_STYLES.noDataColor};">
          暂无数据
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
  mapData: DetailedData[]
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
      confine: true,
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
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
        data: mapData,
        emphasis: {
          label: {
            show: false,
          },
        },
      },
    ],
  };
}

/**
 * Generate complete ECharts option for region map
 * @param countryCode - ISO country code for the region map
 * @param regionData - Region-level data with detailed information
 */
export function createRegionMapOption(
  countryCode: string,
  regionData: RegionData[]
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
      confine: true,
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
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
      map: countryCode,
      roam: true,
      zoom: 1.2,
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
          show: true,
          color: "#374151",
          fontSize: 12,
        },
      },
      label: {
        show: false,
      },
    },
    series: [
      {
        type: "map",
        map: countryCode,
        geoIndex: 0,
        data: regionData,
        emphasis: {
          label: {
            show: true,
          },
        },
      },
    ],
  };
}

