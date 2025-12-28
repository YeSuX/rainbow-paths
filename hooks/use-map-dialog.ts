import { useState, useCallback } from "react";
import { MapDataResult } from "@/services/mapDataService";
import {
  DialogData,
  getCountryDialogData,
  getRegionDialogData,
} from "@/services/dialogDataService";

/**
 * Hook to manage map data dialog state and interactions
 * Handles opening/closing dialog and fetching appropriate data
 * 
 * @param mapData - Processed map data from mapDataService
 * @returns Dialog state and control functions
 */
export function useMapDialog(mapData: MapDataResult) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);

  /**
   * Open country dialog
   */
  const openCountryDialog = useCallback(
    (countryCode: string, countryName: string) => {
      const data = getCountryDialogData(countryCode, countryName, mapData);
      
      if (data) {
        setDialogData(data);
        setIsOpen(true);
      }
    },
    [mapData]
  );

  /**
   * Open region dialog
   */
  const openRegionDialog = useCallback(
    (countryCode: string, countryName: string, regionName: string) => {
      const data = getRegionDialogData(
        countryCode,
        countryName,
        regionName,
        mapData
      );
      
      if (data) {
        setDialogData(data);
        setIsOpen(true);
      }
    },
    [mapData]
  );

  /**
   * Close dialog
   */
  const closeDialog = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to allow exit animation
    setTimeout(() => setDialogData(null), 300);
  }, []);

  return {
    isOpen,
    dialogData,
    openCountryDialog,
    openRegionDialog,
    closeDialog,
  };
}

