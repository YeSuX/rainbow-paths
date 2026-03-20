"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
  type UpdateEventType,
  type UpdateEventStatus,
} from "@/services/updatesService";

interface UpdatesFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  selectedStatuses: string[];
  toggleStatus: (status: string) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

export function UpdatesFilters({
  search,
  setSearch,
  selectedTypes,
  toggleType,
  selectedStatuses,
  toggleStatus,
  hasFilters,
  clearFilters,
}: UpdatesFiltersProps) {
  return (
    <div
      className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm
                    border-b border-[#E3E2E0] py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6"
    >
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9A97]" />
        <Input
          placeholder="搜索国家或关键词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 bg-[#F7F6F3] border-[#E3E2E0] focus:bg-white transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-[#9B9A97] hover:text-[#37352F]" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center overflow-x-auto">
        <span className="text-xs text-[#9B9A97] shrink-0">类型:</span>
        {(Object.entries(EVENT_TYPE_CONFIG) as [UpdateEventType, (typeof EVENT_TYPE_CONFIG)[UpdateEventType]][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => toggleType(key)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all shrink-0
                ${
                  selectedTypes.includes(key)
                    ? config.color + " border-transparent font-medium"
                    : "bg-white text-[#787774] border-[#E3E2E0] hover:border-[#D0CFCD]"
                }`}
            >
              {config.label}
            </button>
          )
        )}

        <span className="text-[#E3E2E0] mx-1 hidden sm:inline">|</span>

        <span className="text-xs text-[#9B9A97] shrink-0">状态:</span>
        {(Object.entries(EVENT_STATUS_CONFIG) as [UpdateEventStatus, (typeof EVENT_STATUS_CONFIG)[UpdateEventStatus]][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => toggleStatus(key)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all shrink-0
                ${
                  selectedStatuses.includes(key)
                    ? config.color + " border-transparent font-medium"
                    : "bg-white text-[#787774] border-[#E3E2E0] hover:border-[#D0CFCD]"
                }`}
            >
              {config.emoji} {config.label}
            </button>
          )
        )}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-[#787774] h-7 ml-1"
          >
            清除筛选
          </Button>
        )}
      </div>
    </div>
  );
}
