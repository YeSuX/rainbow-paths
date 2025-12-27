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
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-pink-500 mb-2">
          {marriageCount}
        </div>
        <div className="text-sm text-gray-600">
          同性婚姻合法化的国家/地区
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-purple-500 mb-2">
          {civilCount}
        </div>
        <div className="text-sm text-gray-600">
          民事结合认可的国家/地区
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-blue-500 mb-2">
          {firstMarriageYear}
        </div>
        <div className="text-sm text-gray-600">
          首个同性婚姻合法化（{firstMarriageCountry}）
        </div>
      </div>
    </div>
  );
}

