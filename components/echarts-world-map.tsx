"use client";

import { useECharts } from "@/hooks/use-echarts";
import { useSameSexMapData } from "@/hooks/use-same-sex-map-data";
import { useWorldMap } from "@/hooks/use-world-map";
import { useMapDialog } from "@/hooks/use-map-dialog";
import { Button } from "@/components/ui/button";
import { MapDataDialog } from "@/components/map-data-dialog";

interface EChartsWorldMapProps {
  className?: string;
}

/**
 * World map component visualizing same-sex marriage legal status by country
 * Supports drilling down into country regions on click
 * Displays detailed data dialog for countries and regions
 * Uses ECharts for rendering with custom data processing and styling
 */
export function EChartsWorldMap({ className = "" }: EChartsWorldMapProps) {
  const mapData = useSameSexMapData();
  const { containerRef, chartInstance, isMobile } = useECharts();

  // Dialog state management
  const {
    isOpen,
    dialogData,
    openCountryDialog,
    openRegionDialog,
    closeDialog,
  } = useMapDialog(mapData);

  // Map state and interactions
  const { mapState, handleBackToWorld, drillDownToRegion, mapConfig } =
    useWorldMap(
      chartInstance,
      mapData,
      isMobile,
      openCountryDialog,
      openRegionDialog
    );

  return (
    <>
      <div className="relative">
        {mapState.level === "region" && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-notion-hover px-3 py-2 sm:px-4 border border-[#E3E2E0]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToWorld}
              className="gap-1 h-10 min-w-[44px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="hidden sm:inline">Back to World</span>
              <span className="sm:hidden">返回</span>
            </Button>
            <span className="text-xs sm:text-sm font-medium text-[#37352F] hidden sm:inline">
              {mapState.selectedCountry}
            </span>
          </div>
        )}
        <div
          ref={containerRef}
          className={`w-full ${className}`}
          style={{ height: `${mapConfig.height}px` }}
        />
      </div>

      {/* Data Dialog */}
      <MapDataDialog
        isOpen={isOpen}
        onClose={closeDialog}
        dialogData={dialogData}
        onDrillDown={drillDownToRegion}
      />
    </>
  );
}
