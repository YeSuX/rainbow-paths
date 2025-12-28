"use client";

import { useTimelineData } from "@/hooks/use-timeline-data";
import { calculateTimelineStatsByType } from "@/services/timelineService";

export function TimelineStats() {
  const { timelineEvents } = useTimelineData();

  // Calculate statistics using service
  const marriageStats = calculateTimelineStatsByType(
    timelineEvents,
    "marriage"
  );
  const civilStats = calculateTimelineStatsByType(timelineEvents, "civil");

  const marriageCount = marriageStats.count;
  const civilCount = civilStats.count;
  const firstMarriageYear = marriageStats.firstYear;
  const firstMarriageCountry = marriageStats.firstCountry;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-white rounded-md sm:rounded-lg border border-[#E3E2E0] p-5 sm:p-6 text-center hover:shadow-notion-hover transition-all duration-200">
        <div className="text-2xl sm:text-3xl font-bold text-[#6FCF97] mb-2">
          {marriageCount}
        </div>
        <div className="text-xs sm:text-sm text-[#787774]">
          同性婚姻合法化的国家/地区
        </div>
      </div>
      <div className="bg-white rounded-md sm:rounded-lg border border-[#E3E2E0] p-5 sm:p-6 text-center hover:shadow-notion-hover transition-all duration-200">
        <div className="text-2xl sm:text-3xl font-bold text-[#BB6BD9] mb-2">
          {civilCount}
        </div>
        <div className="text-xs sm:text-sm text-[#787774]">
          民事结合认可的国家/地区
        </div>
      </div>
      <div className="bg-white rounded-md sm:rounded-lg border border-[#E3E2E0] p-5 sm:p-6 text-center hover:shadow-notion-hover transition-all duration-200">
        <div className="text-2xl sm:text-3xl font-bold text-[#56CCF2] mb-2">
          {firstMarriageYear}
        </div>
        <div className="text-xs sm:text-sm text-[#787774]">
          首个同性婚姻合法化（{firstMarriageCountry}）
        </div>
      </div>
    </div>
  );
}
