"use client";

import { useEffect, useRef } from "react";
import type { UpdatesStats } from "@/services/updatesService";

interface UpdatesHeroProps {
  stats: UpdatesStats;
}

function CountUp({ target, duration = 800 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === 0) return;

    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>0</span>;
}

const STAT_ITEMS = [
  { key: "total" as const, label: "条动态", emoji: "🌈", color: "text-[#6FCF97]" },
  { key: "thisMonth" as const, label: "本月新增", emoji: "🆕", color: "text-[#56CCF2]" },
  { key: "milestones" as const, label: "里程碑", emoji: "⭐", color: "text-[#BB6BD9]" },
];

export function UpdatesHero({ stats }: UpdatesHeroProps) {
  return (
    <section className="bg-[#F7F6F3] px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#37352F] mb-3">
          📰 最新动态
        </h1>
        <p className="text-sm sm:text-base text-[#787774] mb-8 sm:mb-10">
          追踪全球婚姻平权的每一步进展
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {STAT_ITEMS.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-lg border border-[#E3E2E0] p-4 sm:p-5
                         hover:shadow-notion-hover transition-all duration-200"
            >
              <div className={`text-2xl sm:text-3xl font-bold ${item.color} mb-1`}>
                <CountUp target={stats[item.key]} />
              </div>
              <div className="text-xs sm:text-sm text-[#787774]">
                {item.emoji} {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
