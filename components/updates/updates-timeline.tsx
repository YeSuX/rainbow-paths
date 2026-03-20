"use client";

import { UpdateCard } from "./update-card";
import { UpdateDetailDialog } from "./update-detail-dialog";
import { useState } from "react";
import type { UpdateEvent, MonthGroup } from "@/services/updatesService";

interface UpdatesTimelineProps {
  groups: MonthGroup[];
  totalFiltered: number;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function UpdatesTimeline({
  groups,
  totalFiltered,
  hasFilters,
  onClearFilters,
}: UpdatesTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<UpdateEvent | null>(null);

  const allEvents = groups.flatMap((g) => g.events);
  const currentIndex = selectedEvent
    ? allEvents.findIndex((e) => e.id === selectedEvent.id)
    : -1;

  const goNext = () => {
    if (currentIndex < allEvents.length - 1) {
      setSelectedEvent(allEvents[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setSelectedEvent(allEvents[currentIndex - 1]);
    }
  };

  if (totalFiltered === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-[#37352F] mb-2">没有找到匹配的事件</h3>
        <p className="text-sm text-[#787774] mb-4">正在等待更多好消息... 试试调整筛选条件？</p>
        {hasFilters && (
          <button onClick={onClearFilters} className="text-sm text-[#56CCF2] hover:underline">
            清除所有筛选
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-16">
        {groups.map((group) => (
          <div key={group.key}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[#6FCF97] via-[#56CCF2] to-[#BB6BD9] opacity-30" />
              <span className="text-sm font-medium text-[#787774] whitespace-nowrap">
                {group.label}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#6FCF97] via-[#56CCF2] to-[#BB6BD9] opacity-30" />
            </div>

            <div className="space-y-3">
              {group.events.map((event, idx) => (
                <UpdateCard
                  key={event.id}
                  event={event}
                  index={idx}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <UpdateDetailDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onPrev={currentIndex > 0 ? goPrev : undefined}
        onNext={currentIndex < allEvents.length - 1 ? goNext : undefined}
      />
    </>
  );
}
