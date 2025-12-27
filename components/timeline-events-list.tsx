"use client";

import { useState } from "react";
import { useTimelineData } from "@/hooks/use-timeline-data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimelineEventsList() {
  const { timelineEvents } = useTimelineData();
  const [filterType, setFilterType] = useState<"all" | "marriage" | "civil">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Get unique years
  const years = Array.from(new Set(timelineEvents.map((e) => e.year))).sort(
    (a, b) => (sortOrder === "asc" ? a - b : b - a)
  );

  // Filter events by type
  const filteredEvents = timelineEvents.filter((event) => {
    if (filterType === "all") return true;
    return event.type === filterType;
  });

  // Group events by year
  const eventsByYear = years.map((year) => ({
    year,
    events: filteredEvents.filter((e) => e.year === year),
  }));

  const getMechanismColor = (mechanism: string) => {
    switch (mechanism) {
      case "Legislative":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Judicial":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Executive":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "marriage"
      ? "bg-pink-100 text-pink-700 border-pink-200"
      : "bg-indigo-100 text-indigo-700 border-indigo-200";
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">筛选类型:</span>
          <Select
            value={filterType}
            onValueChange={(value: any) => setFilterType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="marriage">同性婚姻</SelectItem>
              <SelectItem value="civil">民事结合</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">排序:</span>
          <Select
            value={sortOrder}
            onValueChange={(value: any) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">从新到旧</SelectItem>
              <SelectItem value="asc">从旧到新</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-8">
        {eventsByYear.map(
          ({ year, events }) =>
            events.length > 0 && (
              <div key={year} className="relative">
                {/* Year Badge */}
                <div className="sticky top-20 z-10 mb-4">
                  <Badge className="bg-gray-900 text-white text-lg px-4 py-2 shadow-md">
                    {year} 年
                  </Badge>
                </div>

                {/* Events List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event, idx) => (
                    <div
                      key={`${event.year}-${event.country}-${event.type}-${idx}`}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <span className="text-2xl">
                            {event.countryCode
                              ? String.fromCodePoint(
                                  ...event.countryCode
                                    .toUpperCase()
                                    .split("")
                                    .map((char) => 127397 + char.charCodeAt(0))
                                )
                              : "🏳️"}
                          </span>
                          {event.country}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getTypeColor(event.type)}`}
                        >
                          {event.type === "marriage" ? "同性婚姻" : "民事结合"}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getMechanismColor(
                              event.mechanism
                            )}`}
                          >
                            {event.mechanism === "Legislative"
                              ? "立法"
                              : event.mechanism === "Judicial"
                                ? "司法"
                                : event.mechanism === "Executive"
                                  ? "行政"
                                  : event.mechanism}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无符合条件的数据
        </div>
      )}
    </div>
  );
}

