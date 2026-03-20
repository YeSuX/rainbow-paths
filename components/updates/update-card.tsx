"use client";

import { getCountryFlagEmoji } from "@/services/uiHelperService";
import { getCountryName } from "@/lib/translations";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
  type UpdateEvent,
} from "@/services/updatesService";

interface UpdateCardProps {
  event: UpdateEvent;
  onClick: () => void;
  index?: number;
}

export function UpdateCard({ event, onClick, index = 0 }: UpdateCardProps) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const statusConfig = EVENT_STATUS_CONFIG[event.status];
  const countryNameCN = getCountryName(event.country);
  const flag = getCountryFlagEmoji(event.countryCode);
  const isMilestone = event.impact === "high";

  const dateStr = new Date(event.date).toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
  });

  return (
    <article
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`
        group relative bg-white rounded-lg border p-4 sm:p-5
        cursor-pointer transition-all duration-200 animate-fade-up
        hover:shadow-notion-hover active:scale-[0.995]
        ${
          isMilestone
            ? "border-l-4 border-l-[#6FCF97] border-t-[#E3E2E0] border-r-[#E3E2E0] border-b-[#E3E2E0]"
            : "border-[#E3E2E0] hover:border-[#D0CFCD]"
        }
      `}
    >
      {isMilestone && (
        <div className="milestone-shimmer absolute inset-0 rounded-lg pointer-events-none" />
      )}
      {isMilestone && (
        <div className="relative text-xs text-[#F2994A] font-medium mb-2 flex items-center gap-1">
          ⭐ 里程碑事件
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
            {flag}
          </span>
          <div>
            <span className="font-medium text-sm text-[#37352F]">{countryNameCN}</span>
            <span className="text-xs text-[#9B9A97] ml-1.5">{event.country}</span>
          </div>
        </div>
        <time className="text-xs text-[#9B9A97]">{dateStr}</time>
      </div>

      <h3 className="font-semibold text-[#37352F] text-sm sm:text-base mb-2 leading-snug">
        {event.title}
      </h3>

      <p className="text-xs sm:text-sm text-[#787774] line-clamp-2 mb-3 leading-relaxed">
        {event.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.color}`}>
            {statusConfig.emoji} {statusConfig.label}
          </span>
          {event.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[#FBF3DB] text-[#7d6a2d]"
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="text-xs text-[#56CCF2] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
          查看详情 →
        </span>
      </div>

      {event.sources && event.sources.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[#F1F0ED] text-xs text-[#9B9A97]">
          📎 {event.sources.length} 个来源
        </div>
      )}
    </article>
  );
}
