# 最新动态页面设计方案

> Rainbow Paths · `/updates` 路由

---

## 1. 产品定位

首页是"看全景"，这个页面是"追进展"。

用户画像：已经了解 Rainbow Paths 的回访用户，想知道"最近又有哪些好消息"。他们关心的是**变化**——哪个国家刚通过了新法律、哪个地区在推进立法、有什么值得关注的动向。

### 核心体验目标

| 目标 | 含义 |
|------|------|
| **好用** | 快速获取关键信息，支持筛选和搜索，一目了然 |
| **好看** | 延续 Notion 风格，但注入更多"活力"和"进展感" |
| **好玩** | 动态的视觉反馈、情绪化的 emoji 表达、让好消息"被庆祝" |

---

## 2. 数据设计

### 2.1 事件数据结构

新建 `data/updates.json`，与 `same-sex.json` 独立存储。这是一个手动维护的 JSON 文件，每次有新事件时追加一条记录。

```typescript
// types/update.ts
export interface UpdateEvent {
  id: string;                         // 唯一标识，如 "2026-03-greece-marriage"
  date: string;                       // ISO 日期 "2026-03-15"
  country: string;                    // 英文国名，用于匹配翻译和国旗
  countryCode: string;                // ISO 两字母码，如 "GR"
  region?: string;                    // 可选：子辖区
  type: "marriage" | "civil" | "legislation" | "court" | "other";
  status: "enacted" | "pending" | "rejected" | "proposed";
  title: string;                      // 中文标题（一句话）
  summary: string;                    // 中文摘要（2-3 句话）
  content?: string;                   // 可选：详细正文（Markdown）
  sources?: Array<{                   // 来源链接
    title: string;
    url: string;
  }>;
  tags?: string[];                    // 可选标签，如 ["里程碑", "亚洲首例"]
  impact?: "high" | "medium" | "low"; // 影响力等级
}
```

### 2.2 示例数据

```json
[
  {
    "id": "2026-03-thailand-marriage",
    "date": "2026-01-22",
    "country": "Thailand",
    "countryCode": "TH",
    "type": "marriage",
    "status": "enacted",
    "title": "泰国成为东南亚首个同性婚姻合法化国家",
    "summary": "泰国《婚姻平权法》于 2026 年 1 月 22 日正式生效，成为东南亚地区首个实现同性婚姻合法化的国家。该法案赋予同性伴侣与异性伴侣完全相同的法律权利。",
    "sources": [
      { "title": "Reuters 报道", "url": "https://reuters.com/..." }
    ],
    "tags": ["里程碑", "东南亚首例"],
    "impact": "high"
  },
  {
    "id": "2026-02-japan-court",
    "date": "2026-02-14",
    "country": "Japan",
    "countryCode": "JP",
    "type": "court",
    "status": "pending",
    "title": "日本最高法院受理同性婚姻违宪案",
    "summary": "日本最高法院于情人节当日宣布正式受理多对同性伴侣提起的婚姻平权诉讼案，预计将于年内做出裁决。",
    "sources": [],
    "tags": ["司法进展"],
    "impact": "high"
  },
  {
    "id": "2026-01-czech-civil",
    "date": "2026-01-10",
    "country": "Czech Republic",
    "countryCode": "CZ",
    "type": "legislation",
    "status": "proposed",
    "title": "捷克议会再次提交婚姻平权法案",
    "summary": "捷克众议院议员提交新版婚姻平权法案，将同性伴侣的注册伴侣关系升级为完整婚姻。此前类似法案曾于 2024 年被否决。",
    "sources": [],
    "tags": [],
    "impact": "medium"
  }
]
```

### 2.3 为什么独立存储

- `same-sex.json` 是**法律状态快照**（每个国家一条记录，静态结构复杂），updates 是**事件流**（时间序列，追加增长）
- 更新 updates 不需要理解 same-sex.json 的复杂结构，降低维护门槛
- 未来可以做 RSS / API 对接，数据格式保持简单

---

## 3. 页面架构

### 3.1 路由

```
/updates          → 最新动态列表页
/updates/[id]     → 单条事件详情页（可选，第二阶段）
```

由于项目使用 `output: 'export'` 静态导出，动态路由需要在 `generateStaticParams` 中枚举所有 `id`。**第一阶段先只做列表页**，详情通过弹窗（Dialog）呈现，不新增动态路由。

### 3.2 文件结构

```
app/
  updates/
    page.tsx                    # 页面入口

components/
  updates/
    updates-hero.tsx            # 顶部区域（标题 + 统计）
    updates-filters.tsx         # 筛选栏
    updates-timeline.tsx        # 事件时间线列表
    update-card.tsx             # 单条事件卡片
    update-detail-dialog.tsx    # 事件详情弹窗

hooks/
  use-updates-data.ts           # 数据加载 + 处理
  use-updates-filter.ts         # 筛选 + 搜索状态管理

services/
  updatesService.ts             # 数据处理纯函数

data/
  updates.json                  # 事件数据
```

### 3.3 架构图

```
updates.json
    │
    └── updatesService.ts
            │  parseUpdates()
            │  filterUpdates()
            │  groupByMonth()
            │  getStats()
            │
            ├── use-updates-data.ts (useMemo)
            │
            └── use-updates-filter.ts (状态管理)
                    │
                    └── page.tsx
                        ├── UpdatesHero (统计概览)
                        ├── UpdatesFilters (筛选栏)
                        └── UpdatesTimeline
                            ├── MonthGroup (按月分组)
                            │   ├── UpdateCard × N
                            │   └── ...
                            └── UpdateDetailDialog (弹窗)
```

---

## 4. 页面设计

### 4.1 整体布局

```
┌──────────────────────────────────────────┐
│  Navbar（复用）                           │
├──────────────────────────────────────────┤
│                                          │
│  Hero 区                                 │
│  ┌────────────────────────────────────┐  │
│  │  📰 最新动态                        │  │
│  │  追踪全球婚姻平权最新进展            │  │
│  │                                    │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐       │  │
│  │  │ 12   │ │ 3    │ │ 2    │       │  │
│  │  │ 条动态│ │ 本月新│ │ 里程碑│       │  │
│  │  └──────┘ └──────┘ └──────┘       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  筛选栏                                   │
│  ┌────────────────────────────────────┐  │
│  │ [🔍 搜索国家]  [类型 ▼] [状态 ▼]  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  时间线                                   │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │  ── 2026 年 3 月 ──────────        │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ 🇹🇭 泰国                     │  │  │
│  │  │ 成为东南亚首个...             │  │  │
│  │  │ [婚姻] [已生效] [里程碑]      │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ 🇯🇵 日本                     │  │  │
│  │  │ 最高法院受理...              │  │  │
│  │  │ [司法] [进行中]              │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  ── 2026 年 1 月 ──────────        │  │
│  │  ...                              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Footer（复用）                           │
└──────────────────────────────────────────┘
```

### 4.2 Hero 区

设计理念：**轻量、有活力、传递"进展"感**。不像首页 Hero 那么大，这里更像一个 Dashboard Header。

```
┌──────────────────────────────────────────────┐
│  bg-[#F7F6F3]                                │
│                                              │
│  📰 最新动态                                  │
│  追踪全球婚姻平权的每一步进展                   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    12     │  │     3    │  │     2    │   │
│  │  条动态   │  │  本月新增 │  │  里程碑  │   │
│  │  🌈       │  │  🆕      │  │  ⭐      │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

统计数字从 0 滚动到目标值的 count-up 动画，数字使用彩虹色系：绿、蓝、紫。

### 4.3 筛选栏

Sticky 吸顶，滚动时保持在 Navbar 下方。

```
┌──────────────────────────────────────────────┐
│                                              │
│  [🔍 搜索国家或关键词...]                      │
│                                              │
│  [全部] [婚姻] [民事结合] [立法] [司法]  |  [已生效] [进行中] [已否决]  │
│                                              │
└──────────────────────────────────────────────┘
```

- 搜索框：实时过滤，匹配国家名（中英文）和标题
- 类型筛选：Toggle Group（多选），选中时带彩虹色背景
- 状态筛选：Toggle Group（多选），选中时带状态色背景
- 移动端：搜索框全宽，筛选标签横向可滚动

### 4.4 事件卡片

这是页面的核心组件，设计需要兼顾信息密度和情感表达。

**普通事件卡片**：

```
┌──────────────────────────────────────────────┐
│                                              │
│  🇹🇭  泰国 · Thailand              3月15日   │
│                                              │
│  泰国成为东南亚首个同性婚姻合法化国家          │
│                                              │
│  泰国《婚姻平权法》于 2026 年 1 月 22 日      │
│  正式生效，成为东南亚地区首个实现...           │
│                                              │
│  [婚姻] [已生效]  [里程碑] [东南亚首例]        │
│                                              │
│  📎 1 个来源                    点击查看详情 → │
│                                              │
└──────────────────────────────────────────────┘
```

**里程碑事件（impact: "high"）** 加入特殊视觉处理：

```
┌──────────────────────────────────────────────┐
│  ██████████ 左侧彩虹渐变边框 ██████████████  │
│                                              │
│  ⭐ 里程碑事件                                │
│                                              │
│  🇹🇭  泰国 · Thailand              3月15日   │
│  ...（同上）                                  │
│                                              │
│  🎉 这是全球第 X 个实现婚姻平权的国家/地区     │
│                                              │
└──────────────────────────────────────────────┘
```

### 4.5 "好玩"的设计元素

1. **庆祝动画**：里程碑事件卡片首次出现在视口时，触发一个微妙的 confetti 粒子效果（3-5 个彩虹色圆点从卡片顶部散落）

2. **进度条彩蛋**：Hero 区底部显示一个"全球覆盖率"进度条——"已有 X% 的联合国成员国实现某种形式的伴侣法律认可"，进度条用彩虹渐变填充

3. **国旗动画**：事件卡片 hover 时，国旗 emoji 微微放大并添加一个微小的 bounce 效果

4. **月份分割线**：用彩虹渐变线条代替普通灰色分隔线，从左向右淡入

5. **空状态**：当筛选无结果时，显示一个可爱的"正在等待好消息"空状态插图

### 4.6 详情弹窗

点击卡片打开 Dialog，展示完整信息：

```
┌──────────────────────────────────────────────┐
│                                              │
│  🇹🇭  泰国 · Thailand                  ✕    │
│  ─────────────────────────────────────       │
│                                              │
│  泰国成为东南亚首个同性婚姻合法化国家          │
│                                              │
│  [婚姻] [已生效] [里程碑]                     │
│  📅 2026年3月15日                             │
│                                              │
│  ─────────────────────────────────────       │
│                                              │
│  泰国《婚姻平权法》于 2026 年 1 月...         │
│  （完整正文，支持 Markdown 渲染）              │
│                                              │
│  ─────────────────────────────────────       │
│                                              │
│  📎 来源                                     │
│  · Reuters 报道 ↗                             │
│  · Bangkok Post ↗                            │
│                                              │
│  ─────────────────────────────────────       │
│                                              │
│  [← 上一条]                    [下一条 →]     │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 5. 实现细节

### 5.1 Service 层

```typescript
// services/updatesService.ts

import updatesData from "@/data/updates.json";
import { getCountryName } from "@/lib/translations";
import { getCountryFlagEmoji } from "@/services/uiHelperService";

export interface UpdateEvent {
  id: string;
  date: string;
  country: string;
  countryCode: string;
  region?: string;
  type: "marriage" | "civil" | "legislation" | "court" | "other";
  status: "enacted" | "pending" | "rejected" | "proposed";
  title: string;
  summary: string;
  content?: string;
  sources?: Array<{ title: string; url: string }>;
  tags?: string[];
  impact?: "high" | "medium" | "low";
}

export interface UpdatesStats {
  total: number;
  thisMonth: number;
  milestones: number;
}

export interface MonthGroup {
  key: string;         // "2026-03"
  label: string;       // "2026 年 3 月"
  events: UpdateEvent[];
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
    return d.getFullYear() === now.getFullYear()
      && d.getMonth() === now.getMonth();
  });

  return {
    total: events.length,
    thisMonth: thisMonth.length,
    milestones: events.filter((e) => e.impact === "high").length,
  };
}

export function filterUpdates(
  events: UpdateEvent[],
  opts: {
    search?: string;
    types?: string[];
    statuses?: string[];
  }
): UpdateEvent[] {
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
    .map(([key, events]) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: `${year} 年 ${parseInt(month)} 月`,
        events,
      };
    });
}

// 事件类型中文标签和样式
export const EVENT_TYPE_CONFIG = {
  marriage: { label: "婚姻", color: "bg-[#DBEDDB] text-[#2d6a3e]" },
  civil: { label: "民事结合", color: "bg-[#E8DEEE] text-[#6d3a7f]" },
  legislation: { label: "立法", color: "bg-[#D3E5EF] text-[#1e5a7d]" },
  court: { label: "司法", color: "bg-[#FBF3DB] text-[#7d6a2d]" },
  other: { label: "其他", color: "bg-[#F7F6F3] text-[#787774]" },
} as const;

// 事件状态中文标签和样式
export const EVENT_STATUS_CONFIG = {
  enacted: { label: "已生效", color: "bg-[#6FCF97] text-white", emoji: "✅" },
  pending: { label: "进行中", color: "bg-[#56CCF2] text-white", emoji: "⏳" },
  rejected: { label: "已否决", color: "bg-[#EB5757] text-white", emoji: "❌" },
  proposed: { label: "已提出", color: "bg-[#F2C94C] text-[#37352F]", emoji: "📝" },
} as const;
```

### 5.2 Hooks

```typescript
// hooks/use-updates-data.ts
import { useMemo } from "react";
import { getUpdates, getUpdatesStats } from "@/services/updatesService";

export function useUpdatesData() {
  return useMemo(() => {
    const events = getUpdates();
    const stats = getUpdatesStats(events);
    return { events, stats };
  }, []);
}
```

```typescript
// hooks/use-updates-filter.ts
import { useState, useMemo } from "react";
import {
  UpdateEvent,
  filterUpdates,
  groupByMonth,
} from "@/services/updatesService";

export function useUpdatesFilter(events: UpdateEvent[]) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const filtered = useMemo(
    () => filterUpdates(events, {
      search,
      types: selectedTypes,
      statuses: selectedStatuses,
    }),
    [events, search, selectedTypes, selectedStatuses]
  );

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  return {
    search, setSearch,
    selectedTypes, toggleType,
    selectedStatuses, toggleStatus,
    filtered,
    grouped,
    clearFilters,
    hasFilters: search !== "" || selectedTypes.length > 0 || selectedStatuses.length > 0,
  };
}
```

### 5.3 页面入口

```typescript
// app/updates/page.tsx
import { Metadata } from "next";
import { UpdatesPageClient } from "@/components/updates/updates-page-client";

export const metadata: Metadata = {
  title: "最新动态 - Rainbow Paths",
  description: "追踪全球婚姻平权的最新进展和里程碑事件",
};

export default function UpdatesPage() {
  return <UpdatesPageClient />;
}
```

```typescript
// components/updates/updates-page-client.tsx
"use client";

import { useUpdatesData } from "@/hooks/use-updates-data";
import { useUpdatesFilter } from "@/hooks/use-updates-filter";
import { UpdatesHero } from "./updates-hero";
import { UpdatesFilters } from "./updates-filters";
import { UpdatesTimeline } from "./updates-timeline";

export function UpdatesPageClient() {
  const { events, stats } = useUpdatesData();
  const filter = useUpdatesFilter(events);

  return (
    <div className="pt-16 min-h-screen">
      <UpdatesHero stats={stats} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <UpdatesFilters {...filter} />
        <UpdatesTimeline
          groups={filter.grouped}
          totalFiltered={filter.filtered.length}
          hasFilters={filter.hasFilters}
          onClearFilters={filter.clearFilters}
        />
      </div>
    </div>
  );
}
```

### 5.4 Hero 组件

```typescript
// components/updates/updates-hero.tsx
"use client";

import { useEffect, useRef } from "react";
import type { UpdatesStats } from "@/services/updatesService";

interface UpdatesHeroProps {
  stats: UpdatesStats;
}

function CountUp({ target, duration = 1000 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>0</span>;
}

const STAT_ITEMS = [
  { key: "total", label: "条动态", emoji: "🌈", color: "text-[#6FCF97]" },
  { key: "thisMonth", label: "本月新增", emoji: "🆕", color: "text-[#56CCF2]" },
  { key: "milestones", label: "里程碑", emoji: "⭐", color: "text-[#BB6BD9]" },
] as const;

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
```

### 5.5 筛选组件

```typescript
// components/updates/updates-filters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
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
  search, setSearch,
  selectedTypes, toggleType,
  selectedStatuses, toggleStatus,
  hasFilters, clearFilters,
}: UpdatesFiltersProps) {
  return (
    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm
                    border-b border-[#E3E2E0] py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
      {/* 搜索框 */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9A97]" />
        <Input
          placeholder="搜索国家或关键词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 bg-[#F7F6F3] border-[#E3E2E0]
                     focus:bg-white transition-colors"
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

      {/* 筛选标签 */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-[#9B9A97] mr-1">类型:</span>
        {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => toggleType(key)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all
              ${selectedTypes.includes(key)
                ? config.color + " border-transparent font-medium"
                : "bg-white text-[#787774] border-[#E3E2E0] hover:border-[#D0CFCD]"
              }`}
          >
            {config.label}
          </button>
        ))}

        <span className="text-[#E3E2E0] mx-1">|</span>

        <span className="text-xs text-[#9B9A97] mr-1">状态:</span>
        {Object.entries(EVENT_STATUS_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => toggleStatus(key)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all
              ${selectedStatuses.includes(key)
                ? config.color + " border-transparent font-medium"
                : "bg-white text-[#787774] border-[#E3E2E0] hover:border-[#D0CFCD]"
              }`}
          >
            {config.emoji} {config.label}
          </button>
        ))}

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
```

### 5.6 时间线组件

```typescript
// components/updates/updates-timeline.tsx
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

  // 用于弹窗中的上一条/下一条导航
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
        <h3 className="text-lg font-medium text-[#37352F] mb-2">
          没有找到匹配的事件
        </h3>
        <p className="text-sm text-[#787774] mb-4">
          正在等待更多好消息... 试试调整筛选条件？
        </p>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[#56CCF2] hover:underline"
          >
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
            {/* 月份分割线：彩虹渐变 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[#6FCF97] via-[#56CCF2] to-[#BB6BD9] opacity-30" />
              <span className="text-sm font-medium text-[#787774] whitespace-nowrap">
                {group.label}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#6FCF97] via-[#56CCF2] to-[#BB6BD9] opacity-30" />
            </div>

            {/* 事件卡片列表 */}
            <div className="space-y-3">
              {group.events.map((event) => (
                <UpdateCard
                  key={event.id}
                  event={event}
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
```

### 5.7 事件卡片

```typescript
// components/updates/update-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
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
}

export function UpdateCard({ event, onClick }: UpdateCardProps) {
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
      className={`
        group relative bg-white rounded-lg border p-4 sm:p-5
        cursor-pointer transition-all duration-200
        hover:shadow-notion-hover active:scale-[0.995]
        ${isMilestone
          ? "border-l-[3px] border-l-transparent bg-gradient-to-r from-white to-white"
            + " hover:border-l-[3px]"
            + " [border-image:linear-gradient(to_bottom,#6FCF97,#56CCF2,#BB6BD9)_1]"
            + " border-t-[#E3E2E0] border-r-[#E3E2E0] border-b-[#E3E2E0]"
          : "border-[#E3E2E0] hover:border-[#D0CFCD]"
        }
      `}
    >
      {/* 里程碑标记 */}
      {isMilestone && (
        <div className="text-xs text-[#F2994A] font-medium mb-2 flex items-center gap-1">
          ⭐ 里程碑事件
        </div>
      )}

      {/* 头部：国旗 + 国名 + 日期 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
            {flag}
          </span>
          <div>
            <span className="font-medium text-sm text-[#37352F]">
              {countryNameCN}
            </span>
            <span className="text-xs text-[#9B9A97] ml-1.5">
              {event.country}
            </span>
          </div>
        </div>
        <time className="text-xs text-[#9B9A97]">{dateStr}</time>
      </div>

      {/* 标题 */}
      <h3 className="font-semibold text-[#37352F] text-sm sm:text-base mb-2 leading-snug">
        {event.title}
      </h3>

      {/* 摘要 */}
      <p className="text-xs sm:text-sm text-[#787774] line-clamp-2 mb-3 leading-relaxed">
        {event.summary}
      </p>

      {/* 标签行 */}
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

        <span className="text-xs text-[#56CCF2] opacity-0 group-hover:opacity-100 transition-opacity">
          查看详情 →
        </span>
      </div>

      {/* 来源数量 */}
      {event.sources && event.sources.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[#F1F0ED] text-xs text-[#9B9A97]">
          📎 {event.sources.length} 个来源
        </div>
      )}
    </article>
  );
}
```

### 5.8 详情弹窗

```typescript
// components/updates/update-detail-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { getCountryFlagEmoji } from "@/services/uiHelperService";
import { getCountryName } from "@/lib/translations";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
  type UpdateEvent,
} from "@/services/updatesService";

interface UpdateDetailDialogProps {
  event: UpdateEvent | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function UpdateDetailDialog({
  event,
  onClose,
  onPrev,
  onNext,
}: UpdateDetailDialogProps) {
  if (!event) return null;

  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const statusConfig = EVENT_STATUS_CONFIG[event.status];
  const flag = getCountryFlagEmoji(event.countryCode);
  const countryNameCN = getCountryName(event.country);
  const isMilestone = event.impact === "high";

  const dateStr = new Date(event.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={!!event} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-3xl">{flag}</span>
            <div>
              <span>{countryNameCN}</span>
              <span className="text-sm font-normal text-[#9B9A97] ml-2">
                {event.country}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {event.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 pb-4">
            {/* 标题 */}
            <h2 className="text-lg font-bold text-[#37352F] leading-snug">
              {event.title}
            </h2>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${statusConfig.color}`}>
                {statusConfig.emoji} {statusConfig.label}
              </span>
              {isMilestone && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FDEBD0] text-[#F2994A]">
                  ⭐ 里程碑
                </span>
              )}
              {event.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#FBF3DB] text-[#7d6a2d]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-sm text-[#787774]">📅 {dateStr}</div>

            <Separator />

            {/* 正文 */}
            <div className="text-sm text-[#37352F] leading-relaxed whitespace-pre-wrap">
              {event.content || event.summary}
            </div>

            {/* 来源 */}
            {event.sources && event.sources.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-[#37352F] mb-3">
                    📎 来源
                  </h4>
                  <div className="space-y-2">
                    {event.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#56CCF2]
                                   hover:text-[#1e5a7d] hover:underline transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* 上一条 / 下一条导航 */}
        <div className="flex justify-between pt-4 border-t border-[#E3E2E0]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={!onPrev}
            className="text-[#787774]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一条
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={!onNext}
            className="text-[#787774]"
          >
            下一条
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5.9 导航栏更新

在 `Navbar` 中新增"最新动态"链接：

```typescript
// 在 navbar.tsx 的桌面端导航链接区域，GitHub 链接之前添加：
<Button variant="ghost" size="sm" className="h-10 min-w-[44px]" asChild>
  <Link href="/updates">
    <span>📰</span>
    最新动态
  </Link>
</Button>

// 移动端 Sheet 菜单同理添加
```

---

## 6. 交互动画

### 6.1 卡片入场

利用 CSS `@keyframes` + `animation-delay` 实现交错入场，不需要引入额外动画库：

```css
/* 在 globals.css 中追加 */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.4s ease-out both;
}
```

在 `UpdateCard` 中按索引设置 `animation-delay`：

```typescript
<article
  style={{ animationDelay: `${index * 60}ms` }}
  className="animate-fade-up ..."
>
```

### 6.2 数字滚动动画

已在 5.4 的 `CountUp` 组件中实现，使用 `requestAnimationFrame` + `easeOutCubic` 缓动。

### 6.3 里程碑庆祝效果

用 CSS 实现一个简单的"闪光"效果，不需要重型 confetti 库：

```css
@keyframes milestone-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.milestone-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(111, 207, 151, 0.1) 25%,
    rgba(86, 204, 242, 0.15) 50%,
    rgba(187, 107, 217, 0.1) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: milestone-shimmer 3s ease-in-out infinite;
}
```

在 `UpdateCard` 里程碑卡片上添加一个 `::before` 伪元素或内部 div 使用此效果。

---

## 7. 响应式策略

| 元素 | 桌面端 (≥768px) | 移动端 (<768px) |
|------|-----------------|-----------------|
| Hero 统计卡 | 3 列网格 | 3 列（数字缩小） |
| 搜索框 | 常规宽度 | 全宽 |
| 筛选标签 | 一行排列 | 可横向滚动 |
| 事件卡片 | 内边距 20px | 内边距 16px |
| 详情弹窗 | max-w-2xl | 95vw 全宽 |
| 月份分隔线 | 带彩虹渐变 | 带彩虹渐变（更短） |

---

## 8. 实施步骤

### Phase 1：数据层

> 目标：建立数据基础，确保 Service 和 Hook 层可用。

- [x] **1.1** 创建 `data/updates.json`
  - 定义 3-5 条种子数据（覆盖不同 type / status / impact 组合）
  - 包含至少 1 条 `impact: "high"` 的里程碑事件
  - 包含至少 1 条带 `sources` 和 `tags` 的完整事件
  - 包含至少 1 条 `content` 字段有详细 Markdown 正文的事件
  - 确保日期分布在至少 2 个不同月份（验证按月分组）

- [x] **1.2** 创建 `services/updatesService.ts`
  - 导出 `UpdateEvent` 接口和所有相关类型
  - 实现 `getUpdates()`：读取 JSON，按日期倒序排序
  - 实现 `getUpdatesStats()`：计算 total / thisMonth / milestones
  - 实现 `filterUpdates()`：支持 search（中英文国名 + 标题 + 摘要）、types 多选、statuses 多选
  - 实现 `groupByMonth()`：按月分组，返回 `MonthGroup[]`
  - 导出 `EVENT_TYPE_CONFIG` 和 `EVENT_STATUS_CONFIG` 常量

- [x] **1.3** 创建 `hooks/use-updates-data.ts`
  - 用 `useMemo` 包裹 `getUpdates()` + `getUpdatesStats()`
  - 返回 `{ events, stats }`

- [x] **1.4** 创建 `hooks/use-updates-filter.ts`
  - 管理 `search` / `selectedTypes` / `selectedStatuses` 三个状态
  - 派生 `filtered`（`useMemo` 调用 `filterUpdates`）
  - 派生 `grouped`（`useMemo` 调用 `groupByMonth`）
  - 暴露 `toggleType` / `toggleStatus` / `clearFilters` / `hasFilters`

- [x] **1.5** 验证数据层
  - 在浏览器控制台或临时页面中确认数据加载、筛选、分组逻辑正确
  - 确认中英文国名搜索均能匹配

### Phase 2：页面骨架

> 目标：页面路由可访问，核心布局就位，所有组件能渲染出数据。

- [x] **2.1** 创建路由 `app/updates/page.tsx`
  - 导出 `metadata`（title + description）
  - 渲染 `UpdatesPageClient`（客户端组件）

- [x] **2.2** 创建 `components/updates/updates-page-client.tsx`
  - 组合 `useUpdatesData` + `useUpdatesFilter`
  - 布局：`pt-16 min-h-screen` → `UpdatesHero` → `max-w-4xl` 容器 → `UpdatesFilters` → `UpdatesTimeline`

- [x] **2.3** 实现 `components/updates/updates-hero.tsx`
  - 标题 + 副标题 + 3 个统计卡片
  - 统计数字先用静态渲染（CountUp 动画在 Phase 3 加）
  - 背景色 `bg-[#F7F6F3]`，统计卡片用白色 + Notion 阴影

- [x] **2.4** 实现 `components/updates/updates-filters.tsx`
  - 搜索框（`Input` + `Search` 图标 + 清除按钮）
  - 类型筛选：渲染 `EVENT_TYPE_CONFIG` 为可点击标签
  - 状态筛选：渲染 `EVENT_STATUS_CONFIG` 为可点击标签
  - 选中/未选中视觉状态切换
  - "清除筛选"按钮（仅 `hasFilters` 时显示）
  - `sticky top-16 z-20` 吸顶定位

- [x] **2.5** 实现 `components/updates/update-card.tsx`
  - 国旗 emoji + 中文国名 + 英文国名 + 日期
  - 标题 + 摘要（`line-clamp-2`）
  - 类型标签 + 状态标签 + 自定义 tags
  - 来源数量显示
  - 里程碑事件（`impact: "high"`）的基础视觉区分：左侧彩虹渐变边框 + "⭐ 里程碑事件"标记
  - `onClick` → 传递给父组件

- [x] **2.6** 实现 `components/updates/updates-timeline.tsx`
  - 按月分组渲染：月份分隔线（彩虹渐变）+ `UpdateCard` 列表
  - 管理 `selectedEvent` 状态（控制弹窗）
  - 计算 `allEvents` 扁平列表，支持弹窗中上下翻页
  - 空状态：筛选无结果时显示友好提示 + "清除所有筛选"链接

- [x] **2.7** 实现 `components/updates/update-detail-dialog.tsx`
  - `Dialog` 包裹完整事件信息
  - 头部：国旗 + 国名 + 英文名
  - 标题 + 元信息标签（类型/状态/里程碑/自定义 tags）
  - 日期显示
  - 正文区（`content` 或回退到 `summary`），用 `ScrollArea` 包裹
  - 来源链接列表（外链图标 + 链接文字）
  - 底部导航："← 上一条" / "下一条 →"按钮

- [x] **2.8** 验证页面骨架
  - 访问 `/updates`，确认所有组件正确渲染
  - 测试筛选：搜索、类型多选、状态多选、清除
  - 测试弹窗：打开、关闭、上下翻页
  - 测试空状态：用一个不存在的搜索词确认空状态 UI

### Phase 3：导航集成

> 目标：用户能从首页进入最新动态页面。

- [x] **3.1** 更新 `components/navbar.tsx` — 桌面端
  - 在 GitHub 链接前添加"📰 最新动态" `Link` 到 `/updates`

- [x] **3.2** 更新 `components/navbar.tsx` — 移动端
  - 在 Sheet 菜单中添加"📰 最新动态" `Link` 到 `/updates`
  - 点击后调用 `closeMobileMenu()` 关闭菜单

- [x] **3.3** 验证导航
  - 桌面端和移动端点击链接均能跳转到 `/updates`
  - 当前页面高亮（可选，不阻塞）

### Phase 4：体验增强

> 目标：添加动画和视觉细节，让页面从"能用"变成"好用好看好玩"。

- [x] **4.1** 卡片入场动画
  - 在 `globals.css` 中添加 `@keyframes fade-up` + `.animate-fade-up`
  - `UpdateCard` 添加 `animate-fade-up` class
  - 按索引设置 `animation-delay`（每张卡片间隔 60ms）

- [x] **4.2** 数字滚动动画
  - 实现 `CountUp` 组件（`requestAnimationFrame` + `easeOutCubic`）
  - 在 `UpdatesHero` 中用 `CountUp` 替代静态数字

- [x] **4.3** 里程碑闪光效果
  - 在 `globals.css` 中添加 `@keyframes milestone-shimmer` + `.milestone-shimmer`
  - 在 `UpdateCard` 里程碑卡片中添加闪光背景层

- [x] **4.4** 国旗 hover 动画
  - `UpdateCard` 中国旗 emoji 添加 `group-hover:scale-110 transition-transform`（已在代码片段中包含）

- [x] **4.5** "查看详情 →" hover 淡入
  - 默认 `opacity-0`，`group-hover:opacity-100`（已在代码片段中包含）

- [x] **4.6** 筛选标签过渡动画
  - 选中/取消选中时添加 `transition-all` 平滑颜色过渡

### Phase 5：响应式适配

> 目标：移动端体验流畅、可用。

- [x] **5.1** Hero 区响应式
  - 统计卡片数字 `text-2xl sm:text-3xl`
  - 标题 `text-2xl sm:text-3xl md:text-4xl`

- [x] **5.2** 筛选栏移动端
  - 筛选标签区域添加 `overflow-x-auto` 横向滚动
  - 搜索框全宽
  - 类型/状态标签之间的 `|` 分隔符在移动端隐藏或换行

- [x] **5.3** 事件卡片响应式
  - 内边距 `p-4 sm:p-5`
  - 文字尺寸 `text-xs sm:text-sm`、`text-sm sm:text-base`

- [x] **5.4** 弹窗响应式
  - 宽度 `w-[95vw] sm:w-full max-w-2xl`
  - 最大高度 `max-h-[90vh] sm:max-h-[85vh]`

- [x] **5.5** 移动端全流程测试
  - 在 Chrome DevTools 模拟 iPhone SE / iPhone 14 / iPad 尺寸
  - 确认所有触摸目标 ≥ 44px
  - 确认 sticky 筛选栏不遮挡事件卡片
  - 确认弹窗可正常滚动和关闭

### Phase 6：构建验证与部署

> 目标：确保静态导出正常，可部署。

- [x] **6.1** 运行 `bun run build`
  - 确认 `/updates` 路由被正确导出到 `out/updates/index.html`
  - 确认无 TypeScript 编译错误
  - 确认无 ESLint 错误

- [x] **6.2** 本地预览
  - `bun start` 或 `npx serve out`
  - 访问 `/updates`，完整走一遍所有交互
  - 检查网络请求：确认 `updates.json` 已内联到 JS bundle（非运行时请求）

- [x] **6.3** 性能检查
  - Lighthouse 评分：Performance ≥ 90
  - 首屏无布局偏移（CLS = 0）
  - 交互无卡顿

### Phase 7：可选扩展（未来迭代）

> 非首次上线必需，按需求优先级选做。

- [ ] **7.1** 键盘导航
  - 弹窗中 `←` `→` 箭头键切换上一条/下一条
  - 列表中 `↑` `↓` 箭头键移动焦点

- [ ] **7.2** URL 筛选状态持久化
  - 将 `search` / `types` / `statuses` 同步到 URL query params
  - 页面加载时从 URL 恢复筛选状态
  - 用 `useSearchParams` 或 `nuqs` 库

- [ ] **7.3** 更多统计维度
  - Hero 区添加"按洲统计"下拉或 mini 图表
  - 年度趋势 sparkline 小折线图

- [ ] **7.4** 分享功能
  - 每条事件卡片添加"复制链接"按钮
  - URL 格式：`/updates?event=2026-03-thailand-marriage`
  - 页面加载时自动定位并高亮目标事件

- [ ] **7.5** RSS / Atom 订阅
  - 生成 `public/feed.xml`，让用户通过 RSS 阅读器订阅最新动态

---

## 9. 维护工作流

每次有新事件需要发布：

1. 编辑 `data/updates.json`，在数组头部追加新对象
2. 如果涉及新国家婚姻合法化，同步更新 `data/same-sex.json`
3. `bun run build` → 检查构建产物
4. 部署到 Cloudflare Pages

**建议**：在 `updates.json` 中始终保持按日期倒序排列（最新在前），虽然 service 会排序，但方便人工浏览文件。

---

## 10. 设计检查清单

- [ ] 延续 Notion 风格：米白/棕灰色系、8px 圆角、微妙阴影
- [ ] 彩虹色仅用于强调和情感表达，不过度使用
- [ ] 所有交互元素 ≥ 44px 触摸目标
- [ ] 筛选组件 sticky 吸顶，不遮挡内容
- [ ] 里程碑事件有明显但不刺眼的视觉区分
- [ ] 空状态友好、有引导性
- [ ] 弹窗支持键盘 Esc 关闭
- [ ] 国旗 emoji 渲染一致（各平台差异接受）
- [ ] 3G 网络首屏可用时间 < 3 秒（纯静态 JSON，无 API 请求）
