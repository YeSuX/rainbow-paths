"use client";

import { useState } from "react";
import { useTimelineData, TimelineEvent } from "@/hooks/use-timeline-data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TimelineEventsList() {
  const { timelineEvents } = useTimelineData();
  const [filterType, setFilterType] = useState<"all" | "marriage" | "civil">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );

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

  // 获取概览文本（前100个字符）
  const getPreview = (text: string) => {
    if (!text) return "暂无详细说明";
    const cleanText = text.replace(/\*\*/g, "").replace(/\*/g, "");
    return cleanText.length > 100
      ? cleanText.substring(0, 100) + "..."
      : cleanText;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs sm:text-sm text-gray-600">筛选类型:</span>
          <Select
            value={filterType}
            onValueChange={(value) =>
              setFilterType(value as "all" | "marriage" | "civil")
            }
          >
            <SelectTrigger className="w-[140px] sm:w-[180px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="marriage">同性婚姻</SelectItem>
              <SelectItem value="civil">民事结合</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs sm:text-sm text-gray-600">排序:</span>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="w-[140px] sm:w-[180px] h-9 text-sm">
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
      <div className="space-y-6 sm:space-y-8">
        {eventsByYear.map(
          ({ year, events }) =>
            events.length > 0 && (
              <div key={year} className="relative">
                {/* Year Badge */}
                <div className="sticky top-16 sm:top-20 z-10 mb-3 sm:mb-4">
                  <Badge className="bg-gray-900 text-white text-base sm:text-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md">
                    {year} 年
                  </Badge>
                </div>

                {/* Events List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {events.map((event, idx) => (
                    <div
                      key={`${event.year}-${event.country}-${event.type}-${idx}`}
                      className="bg-white rounded-md sm:rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer active:scale-[0.98] min-h-[44px]"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">
                            {event.countryCode
                              ? String.fromCodePoint(
                                  ...event.countryCode
                                    .toUpperCase()
                                    .split("")
                                    .map((char) => 127397 + char.charCodeAt(0))
                                )
                              : "🏳️"}
                          </span>
                          <div>
                            {event.country}
                            {event.subjurisdiction && (
                              <span className="text-xs font-normal text-gray-500 block">
                                {event.subjurisdiction}
                              </span>
                            )}
                          </div>
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getTypeColor(event.type)}`}
                          >
                            {event.type === "marriage"
                              ? "同性婚姻"
                              : "民事结合"}
                          </Badge>
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
                        {/* 事件概览 */}
                        <p className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2 line-clamp-2">
                          {getPreview(event.explanation)}
                        </p>
                        <div className="text-xs text-blue-600 hover:text-blue-700 mt-1.5 sm:mt-2">
                          点击查看详情 →
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

      {/* 详情对话框 */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col w-[95vw] sm:w-full">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <span className="text-2xl sm:text-3xl">
                {selectedEvent?.countryCode
                  ? String.fromCodePoint(
                      ...selectedEvent.countryCode
                        .toUpperCase()
                        .split("")
                        .map((char) => 127397 + char.charCodeAt(0))
                    )
                  : "🏳️"}
              </span>
              <div>
                {selectedEvent?.country}
                {selectedEvent?.subjurisdiction && (
                  <span className="text-sm font-normal text-gray-500 block">
                    {selectedEvent.subjurisdiction}
                  </span>
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              <Badge
                variant="outline"
                className={`${getTypeColor(selectedEvent?.type || "marriage")}`}
              >
                {selectedEvent?.type === "marriage" ? "同性婚姻" : "民事结合"}
              </Badge>
              <Badge
                variant="outline"
                className={`${getMechanismColor(
                  selectedEvent?.mechanism || ""
                )}`}
              >
                {selectedEvent?.mechanism === "Legislative"
                  ? "立法"
                  : selectedEvent?.mechanism === "Judicial"
                  ? "司法"
                  : selectedEvent?.mechanism === "Executive"
                  ? "行政"
                  : selectedEvent?.mechanism}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {selectedEvent?.year} 年生效
              </Badge>
              {selectedEvent?.criticalDate2 && (
                <Badge variant="outline" className="bg-gray-100">
                  {selectedEvent.criticalDate2} 年修订
                </Badge>
              )}
              {selectedEvent?.repealDate1 && (
                <Badge variant="outline" className="bg-red-100 text-red-700">
                  {selectedEvent.repealDate1} 年废止
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-3 sm:mt-4 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6 pr-2 sm:pr-4 pb-4">
              {/* 详细说明 */}
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">
                  详细说明
                </h4>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedEvent?.explanation || "暂无详细说明"}
                </div>
              </div>

              {/* 关键日期 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">关键日期</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">生效日期</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedEvent?.year} 年
                    </div>
                  </div>
                  {selectedEvent?.criticalDate2 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">
                        第二关键日期
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedEvent.criticalDate2} 年
                      </div>
                    </div>
                  )}
                  {selectedEvent?.repealDate1 && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs text-red-600 mb-1">废止日期</div>
                      <div className="text-lg font-semibold text-red-700">
                        {selectedEvent.repealDate1} 年
                      </div>
                    </div>
                  )}
                  {selectedEvent?.repealDate2 && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs text-red-600 mb-1">
                        第二废止日期
                      </div>
                      <div className="text-lg font-semibold text-red-700">
                        {selectedEvent.repealDate2} 年
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 法律来源 */}
              {selectedEvent?.sources && selectedEvent.sources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    法律来源文件 ({selectedEvent.sources.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.sources.slice(0, 5).map((source) => (
                      <div
                        key={source.id}
                        className="bg-gray-50 rounded-lg p-3 text-sm"
                      >
                        <div className="font-medium text-gray-900 mb-1">
                          {source.original_official_filename ||
                            source.original_filename}
                        </div>
                        {source.original_language && (
                          <div className="text-xs text-gray-500">
                            语言: {source.original_language.name}
                          </div>
                        )}
                        {source.enacted && (
                          <div className="text-xs text-gray-500">
                            生效时间: {source.enacted}
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedEvent.sources.length > 5 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        还有 {selectedEvent.sources.length - 5} 个文件未显示
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 总体状态 */}
              {selectedEvent?.summaryType && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">总体状态</h4>
                  <Badge className="text-sm px-3 py-1">
                    {selectedEvent.summaryType}
                  </Badge>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
