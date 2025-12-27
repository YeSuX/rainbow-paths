import * as echarts from "echarts";
import { STATUS_CATEGORIES, DetailedData, RegionData } from "@/hooks/use-same-sex-map-data";
import { getCountryName } from "@/lib/translations";

// Map display constants - Notion style
export const MAP_CONFIG = {
  height: 600,
  zoom: 1.2,
  center: [0, 20] as [number, number],
  backgroundColor: "transparent",
  defaultAreaColor: "#F7F6F3", // Notion 米白色
  borderColor: "#E3E2E0", // Notion 边框色
  borderWidth: 0.5,
  emphasisAreaColor: "#FBF3DB", // 彩虹黄色低饱和背景
  emphasisBorderColor: "#F2C94C", // 彩虹黄色
  emphasisBorderWidth: 1.5,
} as const;

// Responsive configuration based on screen size
export interface ResponsiveMapConfig {
  height: number;
  zoom: number;
  tooltipMaxWidth: number;
  tooltipPadding: string;
  tooltipFontSize: {
    title: number;
    content: number;
    detail: number;
  };
  visualMapConfig: {
    itemWidth: number;
    itemHeight: number;
    fontSize: number;
    textGap: number;
  };
  roam: boolean | "scale" | "move";
}

/**
 * Get responsive map configuration based on screen width
 */
export function getResponsiveMapConfig(isMobile: boolean): ResponsiveMapConfig {
  if (isMobile) {
    // Mobile configuration (< 768px)
    return {
      height: 350,
      zoom: 1.0,
      tooltipMaxWidth: 260,
      tooltipPadding: "6px 10px",
      tooltipFontSize: {
        title: 13,
        content: 11,
        detail: 10,
      },
      visualMapConfig: {
        itemWidth: 16,
        itemHeight: 12,
        fontSize: 10,
        textGap: 5,
      },
      roam: true, // Enable zoom and pan on mobile
    };
  } else {
    // Desktop configuration (>= 768px)
    return {
      height: 600,
      zoom: 1.2,
      tooltipMaxWidth: 350,
      tooltipPadding: "8px 12px",
      tooltipFontSize: {
        title: 15,
        content: 13,
        detail: 11,
      },
      visualMapConfig: {
        itemWidth: 20,
        itemHeight: 14,
        fontSize: 12,
        textGap: 8,
      },
      roam: false,
    };
  }
}

// Tooltip styles - Notion style
const TOOLTIP_STYLES = {
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  borderColor: "#E3E2E0", // Notion 边框色
  borderWidth: 1,
  textColor: "#37352F", // Notion 主文字色
  noDataColor: "#9B9A97", // Notion 三级文字色
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
export function createTooltipFormatter(config: ResponsiveMapConfig) {
  return (params: echarts.TooltipComponentFormatterCallbackParams) => {
    // Handle single item
    if (!Array.isArray(params) && params.data) {
      const data = params.data as DetailedData | RegionData;
      if (data.status) {
        // Use Chinese name for display if available, otherwise use English name
        const displayName = data.nameCN || params.name as string;
        const safeName = escapeHtml(displayName);
        const safeStatus = escapeHtml(data.status);

        const minWidth = config.tooltipMaxWidth * 0.7;
        let content = `
          <div style="
            padding: ${config.tooltipPadding}; 
            min-width: ${minWidth}px; 
            max-width: ${config.tooltipMaxWidth}px; 
            box-sizing: border-box;
          ">
            <strong style="font-size: ${config.tooltipFontSize.title}px; color: #37352F; display: block; margin-bottom: 6px;">
              ${safeName}
            </strong>
            <div style="font-size: ${config.tooltipFontSize.content}px; color: #787774; margin-bottom: 4px;">
              <strong>整体状态：</strong>${safeStatus}
            </div>
        `;

        // Marriage info
        if (data.marriageType) {
          const safeMarriageType = escapeHtml(data.marriageType);
          content += `
            <div style="border-top: 1px solid #E3E2E0; padding-top: 4px; margin-top: 4px;">
              <div style="font-size: ${config.tooltipFontSize.content}px; color: #787774; margin-bottom: 3px;">
                <strong>婚姻：</strong>${safeMarriageType}
                ${data.marriageCriticalDate ? ` (${data.marriageCriticalDate})` : ''}
              </div>
          `;
          if (data.marriageExplan) {
            const maxLength = config.tooltipMaxWidth < 300 ? 80 : 120;
            const shortExplan = data.marriageExplan.length > maxLength
              ? data.marriageExplan.substring(0, maxLength) + '...'
              : data.marriageExplan;
            const safeExplan = escapeHtml(shortExplan);
            content += `
              <div style="
                font-size: ${config.tooltipFontSize.detail}px; 
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
            <div style="border-top: 1px solid #E3E2E0; padding-top: 4px; margin-top: 4px;">
              <div style="font-size: ${config.tooltipFontSize.content}px; color: #787774; margin-bottom: 3px;">
                <strong>民事结合：</strong>${safeCivilType}
                ${data.civilCriticalDate ? ` (${data.civilCriticalDate})` : ''}
                ${data.civilMechanism ? ` - ${safeCivilMechanism}` : ''}
              </div>
          `;
          if (data.civilExplan) {
            const maxLength = config.tooltipMaxWidth < 300 ? 80 : 120;
            const shortExplan = data.civilExplan.length > maxLength
              ? data.civilExplan.substring(0, maxLength) + '...'
              : data.civilExplan;
            const safeExplan = escapeHtml(shortExplan);
            content += `
              <div style="
                font-size: ${config.tooltipFontSize.detail}px; 
                color: #9B9A97; 
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
    // Try to translate country name to Chinese for display
    const displayName = name ? getCountryName(name as string) : "未知";
    const safeName = escapeHtml(displayName);
    return `
      <div style="padding: ${config.tooltipPadding};">
        <strong style="font-size: ${config.tooltipFontSize.title}px; color: #37352F;">${safeName}</strong>
        <br/>
        <span style="font-size: ${config.tooltipFontSize.content}px; color: ${TOOLTIP_STYLES.noDataColor};">
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
  return Object.entries(STATUS_CATEGORIES).map(([, category]) => ({
    value: category.value,
    label: category.name,
    color: category.color,
  }));
}

/**
 * Generate complete ECharts option for world map
 */
export function createWorldMapOption(
  mapData: DetailedData[],
  config: ResponsiveMapConfig
): echarts.EChartsOption {
  return {
    backgroundColor: MAP_CONFIG.backgroundColor,
    tooltip: {
      trigger: "item",
      formatter: createTooltipFormatter(config),
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
        fontSize: config.visualMapConfig.fontSize,
      },
      itemWidth: config.visualMapConfig.itemWidth,
      itemHeight: config.visualMapConfig.itemHeight,
      itemGap: config.visualMapConfig.textGap,
    },
    geo: {
      map: "world",
      roam: config.roam,
      zoom: config.zoom,
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
 * @param config - Responsive configuration
 */
export function createRegionMapOption(
  countryCode: string,
  regionData: RegionData[],
  config: ResponsiveMapConfig
): echarts.EChartsOption {
  const regionZoom = config.zoom * 1.25; // Region maps need more zoom
  return {
    backgroundColor: MAP_CONFIG.backgroundColor,
    tooltip: {
      trigger: "item",
      formatter: createTooltipFormatter(config),
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
        fontSize: config.visualMapConfig.fontSize,
      },
      itemWidth: config.visualMapConfig.itemWidth,
      itemHeight: config.visualMapConfig.itemHeight,
      itemGap: config.visualMapConfig.textGap,
    },
    geo: {
      map: countryCode,
      roam: config.roam,
      zoom: regionZoom,
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
        },
        label: {
          show: true,
          color: "#37352F",
          fontSize: config.visualMapConfig.fontSize,
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

