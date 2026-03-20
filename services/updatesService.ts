import updatesData from "@/data/updates.json";
import { getCountryName } from "@/lib/translations";

export interface UpdateEventSource {
  title: string;
  url: string;
}

export type UpdateEventType = "marriage" | "civil" | "legislation" | "court" | "other";
export type UpdateEventStatus = "enacted" | "pending" | "rejected" | "proposed";
export type UpdateEventImpact = "high" | "medium" | "low";

export interface UpdateEventImage {
  src: string;
  alt: string;
}

export interface UpdateEvent {
  id: string;
  date: string;
  country: string;
  countryCode: string;
  region?: string;
  type: UpdateEventType;
  status: UpdateEventStatus;
  title: string;
  summary: string;
  content?: string;
  sources?: UpdateEventSource[];
  tags?: string[];
  impact?: UpdateEventImpact;
  images?: UpdateEventImage[];
}

export interface UpdatesStats {
  total: number;
  thisMonth: number;
  milestones: number;
}

export interface MonthGroup {
  key: string;
  label: string;
  events: UpdateEvent[];
}

export interface FilterOptions {
  search?: string;
  types?: string[];
  statuses?: string[];
}

export function getUpdates(): UpdateEvent[] {
  return (updatesData as UpdateEvent[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getUpdatesStats(events: UpdateEvent[]): UpdatesStats {
  const now = new Date();
  const thisMonth = events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  return {
    total: events.length,
    thisMonth: thisMonth.length,
    milestones: events.filter((e) => e.impact === "high").length,
  };
}

export function filterUpdates(events: UpdateEvent[], opts: FilterOptions): UpdateEvent[] {
  let filtered = events;

  if (opts.search) {
    const q = opts.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        getCountryName(e.country).toLowerCase().includes(q)
    );
  }

  if (opts.types && opts.types.length > 0) {
    filtered = filtered.filter((e) => opts.types!.includes(e.type));
  }

  if (opts.statuses && opts.statuses.length > 0) {
    filtered = filtered.filter((e) => opts.statuses!.includes(e.status));
  }

  return filtered;
}

export function groupByMonth(events: UpdateEvent[]): MonthGroup[] {
  const groups = new Map<string, UpdateEvent[]>();

  events.forEach((e) => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, evts]) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: `${year} 年 ${parseInt(month)} 月`,
        events: evts,
      };
    });
}

export const EVENT_TYPE_CONFIG: Record<UpdateEventType, { label: string; color: string }> = {
  marriage: { label: "婚姻", color: "bg-[#DBEDDB] text-[#2d6a3e]" },
  civil: { label: "民事结合", color: "bg-[#E8DEEE] text-[#6d3a7f]" },
  legislation: { label: "立法", color: "bg-[#D3E5EF] text-[#1e5a7d]" },
  court: { label: "司法", color: "bg-[#FBF3DB] text-[#7d6a2d]" },
  other: { label: "其他", color: "bg-[#F7F6F3] text-[#787774]" },
};

export const EVENT_STATUS_CONFIG: Record<UpdateEventStatus, { label: string; color: string; emoji: string }> = {
  enacted: { label: "已生效", color: "bg-[#6FCF97] text-white", emoji: "✅" },
  pending: { label: "进行中", color: "bg-[#56CCF2] text-white", emoji: "⏳" },
  rejected: { label: "已否决", color: "bg-[#EB5757] text-white", emoji: "❌" },
  proposed: { label: "已提出", color: "bg-[#F2C94C] text-[#37352F]", emoji: "📝" },
};
