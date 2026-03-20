"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { getCountryFlagEmoji } from "@/services/uiHelperService";
import { getCountryName } from "@/lib/translations";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
  type UpdateEvent,
} from "@/services/updatesService";

interface UpdateDetailDialogProps {
  event: UpdateEvent | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function UpdateDetailDialog({
  event,
  onClose,
  onPrev,
  onNext,
}: UpdateDetailDialogProps) {
  if (!event) return null;

  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const statusConfig = EVENT_STATUS_CONFIG[event.status];
  const flag = getCountryFlagEmoji(event.countryCode);
  const countryNameCN = getCountryName(event.country);
  const isMilestone = event.impact === "high";

  const dateStr = new Date(event.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={!!event} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-3xl">{flag}</span>
            <div>
              <span>{countryNameCN}</span>
              <span className="text-sm font-normal text-[#9B9A97] ml-2">{event.country}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">{event.title}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 pb-4">
            <h2 className="text-lg font-bold text-[#37352F] leading-snug">{event.title}</h2>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${statusConfig.color}`}>
                {statusConfig.emoji} {statusConfig.label}
              </span>
              {isMilestone && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FDEBD0] text-[#F2994A]">
                  ⭐ 里程碑
                </span>
              )}
              {event.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#FBF3DB] text-[#7d6a2d]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-sm text-[#787774]">📅 {dateStr}</div>

            <Separator />

            {event.images && event.images.length > 0 && (
              <div className="space-y-3">
                {event.images.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-[#E3E2E0]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={450}
                      className="w-full h-auto"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm text-[#37352F] leading-relaxed whitespace-pre-wrap">
              {event.content || event.summary}
            </div>

            {event.sources && event.sources.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-[#37352F] mb-3">📎 来源</h4>
                  <div className="space-y-2">
                    {event.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#56CCF2]
                                   hover:text-[#1e5a7d] hover:underline transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t border-[#E3E2E0]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={!onPrev}
            className="text-[#787774]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一条
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={!onNext}
            className="text-[#787774]"
          >
            下一条
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
