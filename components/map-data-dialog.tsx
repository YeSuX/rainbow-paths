"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DialogData } from "@/services/dialogDataService";
import { formatDate, getStatusLabel } from "@/services/dialogDataService";

interface MapDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogData: DialogData | null;
  onDrillDown?: (countryCode: string, countryName: string) => void;
}

/**
 * Dialog component to display detailed data for countries and regions
 * Shows marriage and civil union information with drill-down option for countries
 */
export function MapDataDialog({
  isOpen,
  onClose,
  dialogData,
  onDrillDown,
}: MapDataDialogProps) {
  if (!dialogData) return null;

  const handleDrillDown = () => {
    if (dialogData.type === "country" && dialogData.canDrillDown && onDrillDown) {
      onDrillDown(dialogData.countryCode, dialogData.name);
      onClose();
    }
  };

  const isCountry = dialogData.type === "country";
  const title = isCountry
    ? dialogData.nameCN || dialogData.name
    : `${dialogData.nameCN || dialogData.name} (${dialogData.countryName})`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            {title}
            <Badge variant="outline" className="ml-2">
              {getStatusLabel(dialogData.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {isCountry ? "国家/地区详细信息" : "省/州详细信息"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Marriage Information */}
          {dialogData.marriageType && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#37352F]">
                同性婚姻
              </h3>
              <div className="bg-[#F7F6F3] rounded-lg p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm text-[#787774]">状态：</span>
                  <span className="text-sm font-medium text-[#37352F] text-right flex-1">
                    {dialogData.marriageType}
                  </span>
                </div>
                {dialogData.marriageExplan && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-[#787774]">说明：</span>
                    <span className="text-sm text-[#37352F] text-right flex-1">
                      {dialogData.marriageExplan}
                    </span>
                  </div>
                )}
                {dialogData.marriageCriticalDate && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-[#787774]">关键日期：</span>
                    <span className="text-sm text-[#37352F] text-right flex-1">
                      {formatDate(dialogData.marriageCriticalDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Civil Union Information */}
          {dialogData.civilType && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#37352F]">
                民事结合/伴侣关系
              </h3>
              <div className="bg-[#F7F6F3] rounded-lg p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm text-[#787774]">状态：</span>
                  <span className="text-sm font-medium text-[#37352F] text-right flex-1">
                    {dialogData.civilType}
                  </span>
                </div>
                {dialogData.civilExplan && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-[#787774]">说明：</span>
                    <span className="text-sm text-[#37352F] text-right flex-1">
                      {dialogData.civilExplan}
                    </span>
                  </div>
                )}
                {dialogData.civilMechanism && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-[#787774]">机制：</span>
                    <span className="text-sm text-[#37352F] text-right flex-1">
                      {dialogData.civilMechanism}
                    </span>
                  </div>
                )}
                {dialogData.civilCriticalDate && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-[#787774]">关键日期：</span>
                    <span className="text-sm text-[#37352F] text-right flex-1">
                      {formatDate(dialogData.civilCriticalDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info for Regions */}
          {!isCountry && dialogData.type === "region" && (
            <>
              <Separator />
              <div className="text-xs text-[#787774] space-y-1">
                <div className="flex justify-between">
                  <span>Region ID:</span>
                  <span className="font-mono">{dialogData.regionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Slug:</span>
                  <span className="font-mono">{dialogData.regionSlug}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {isCountry && dialogData.canDrillDown && (
            <Button
              onClick={handleDrillDown}
              className="flex-1 bg-[#2383E2] hover:bg-[#1a6bc4]"
            >
              进入国家内部
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="outline"
            className={isCountry && dialogData.canDrillDown ? "flex-1" : "w-full"}
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

