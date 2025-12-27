"use client";

import { useTimelineData } from "@/hooks/use-timeline-data";

export function TimelineStats() {
  const { timelineEvents } = useTimelineData();

  // Calculate statistics
  const marriageCount = new Set(
    timelineEvents
      .filter((e) => e.type === "marriage")
      .map((e) => e.country)
  ).size;

  const civilCount = new Set(
    timelineEvents.filter((e) => e.type === "civil").map((e) => e.country)
  ).size;

  // Find the first marriage event
  const firstMarriageEvent = timelineEvents
    .filter((e) => e.type === "marriage")
    .sort((a, b) => a.year - b.year)[0];

  const firstMarriageYear = firstMarriageEvent?.year || 2001;
  const firstMarriageCountry = firstMarriageEvent?.country || "荷兰";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-[#E3E2E0] p-6 text-center hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200">
        <div className="text-3xl font-bold text-[#6FCF97] mb-2">
          {marriageCount}
        </div>
        <div className="text-sm text-[#787774]">
          同性婚姻合法化的国家/地区
        </div>
      </div>
      <div className="bg-white rounded-lg border border-[#E3E2E0] p-6 text-center hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200">
        <div className="text-3xl font-bold text-[#BB6BD9] mb-2">
          {civilCount}
        </div>
        <div className="text-sm text-[#787774]">
          民事结合认可的国家/地区
        </div>
      </div>
      <div className="bg-white rounded-lg border border-[#E3E2E0] p-6 text-center hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200">
        <div className="text-3xl font-bold text-[#56CCF2] mb-2">
          {firstMarriageYear}
        </div>
        <div className="text-sm text-[#787774]">
          首个同性婚姻合法化（{firstMarriageCountry}）
        </div>
      </div>
    </div>
  );
}

