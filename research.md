# Rainbow Paths 项目深度研究报告

> 撰写时间：2026-03-20
> 仓库路径：`/Users/suxiong/code-space/rainbow-paths`

---

## 1. 项目概述

**Rainbow Paths** 是一个纯公益的全球 LGBTQ+ 婚姻平权政策可视化平台，目标是让婚姻平权信息变得透明、易获取。项目 slogan 为"爱的地图，温暖前行"。

核心功能：

- **交互式世界地图**：基于 ECharts，按颜色展示各国同性婚姻/民事结合的法律状态，支持国家→省/州级下钻
- **平权时间线**：累积折线图 + 事件列表，追踪全球婚姻平权立法历程
- **统计分析面板**：按状态分类和立法机制分维度统计
- **数据故事 + 视频**：嵌入 Bilibili 视频，展示真实故事

项目为**单页应用**（只有 `/` 一个路由），通过垂直滚动 5 个 Section 呈现所有内容。

---

## 2. 技术栈

| 类别     | 技术                                        | 版本           |
| -------- | ------------------------------------------- | -------------- |
| 框架     | Next.js (App Router)                        | 16.0.7         |
| UI 库    | React                                       | 19.2.0         |
| 语言     | TypeScript                                  | ^5             |
| CSS      | Tailwind CSS v4 + tw-animate-css            | ^4             |
| 组件库   | shadcn/ui (new-york style) + Radix UI       | 最新           |
| 图表     | ECharts 6 (地图 + 时间线)                   | ^6.0.0         |
| 图表备选 | Recharts (已安装但仅用于 shadcn chart 组件) | 2.15.4         |
| 动画     | motion (Framer Motion)                      | ^12.23.25      |
| 图标     | lucide-react                                | ^0.555.0       |
| 包管理   | Bun                                         | -              |
| 部署     | Cloudflare Pages (static export)            | wrangler.jsonc |
| 代码规范 | ESLint + eslint-config-next                 | ^9             |

### 关键配置决策

- **`output: 'export'`**：Next.js 静态导出模式，生成纯静态 HTML/JS/CSS 到 `out/` 目录
- **`images.unoptimized: true`**：因静态导出不支持 Next.js 图片优化 API
- **Tailwind v4**：通过 `@tailwindcss/postcss` PostCSS 插件驱动，无独立 `tailwind.config.*` 文件——所有主题配置在 `globals.css` 的 `@theme inline` 块中
- **Cloudflare Workers 静态部署**：`wrangler.jsonc` 将 `./out` 目录作为静态资产部署

---

## 3. 项目结构

```
rainbow-paths/
├── app/                          # Next.js App Router（单页）
│   ├── layout.tsx               # 根布局：Navbar + Footer 包裹
│   ├── page.tsx                 # 首页：5 个 Section 垂直排列
│   └── globals.css              # 全局样式 + Tailwind v4 主题定义
├── components/
│   ├── home/                    # 首页各区块组件
│   │   ├── hero-section.tsx     # 顶部英雄区
│   │   ├── map-section.tsx      # 地图区包装
│   │   ├── timeline-section.tsx # 时间线区（Tabs: 图表/列表）
│   │   ├── stats-section.tsx    # 统计分析区
│   │   ├── data-section.tsx     # 数据故事 + Bilibili 视频
│   │   └── section-intro.tsx    # 时间线区的说明性 Alert
│   ├── ui/                      # 54 个 shadcn/ui 组件
│   ├── navbar.tsx               # 全局导航栏（滚动变透明→白色）
│   ├── footer.tsx               # 页脚
│   ├── echarts-world-map.tsx    # ECharts 世界地图（核心）
│   ├── map-data-dialog.tsx      # 国家/地区详情弹窗
│   ├── timeline-chart.tsx       # ECharts 时间线折线图
│   ├── timeline-events-list.tsx # 时间线事件列表 + 筛选 + 详情弹窗
│   └── timeline-stats.tsx       # 时间线统计卡片
├── hooks/                       # 自定义 React Hooks
│   ├── use-echarts.ts           # ECharts 实例生命周期管理
│   ├── use-world-map.ts         # 世界地图状态 + 交互（含下钻）
│   ├── use-map-dialog.ts        # 地图弹窗状态管理
│   ├── use-same-sex-map-data.ts # 地图数据 Hook（委托 mapDataService）
│   ├── use-timeline-data.ts     # 时间线数据 Hook（委托 timelineService）
│   ├── use-timeline-events-filter.ts # 事件列表筛选/排序/分组
│   ├── use-stats-data.ts        # 统计数据 Hook（委托 statsService）
│   ├── use-navbar-scroll.ts     # 导航栏滚动状态
│   └── use-mobile.ts            # 移动端断点检测
├── services/                    # 业务逻辑服务层（纯函数）
│   ├── mapDataService.ts        # 地图数据处理 + 状态分类
│   ├── timelineService.ts       # 时间线事件提取 + 统计
│   ├── chartConfigService.ts    # ECharts 时间线图配置生成
│   ├── dialogDataService.ts     # 弹窗数据查询
│   ├── statsService.ts          # 统计数据处理
│   └── uiHelperService.ts       # UI 工具（颜色、翻译、emoji）
├── lib/                         # 通用工具
│   ├── utils.ts                 # cn() 工具函数
│   ├── translations.ts          # 中英翻译（国名、机制、状态等）
│   └── world-map-config.ts      # ECharts 地图配置 + Tooltip 生成
├── data/                        # 数据文件
│   ├── same-sex.json            # 核心数据集（~58,870 行 JSON）
│   ├── country-names-zh.json    # 国家名中英对照（~200 个国家）
│   ├── worldEN.json             # 世界 GeoJSON（~16,447 行）
│   └── same-sex-fields-documentation.md  # 数据字段文档
├── doc/
│   ├── 项目书.md                # 产品设计 + 设计系统完整文档（~1,229 行）
│   └── 首页设计书-精简版.md      # 首页设计规范（~597 行）
├── public/                      # 静态资源（3 个 SVG 图标）
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json              # shadcn/ui 配置
├── wrangler.jsonc               # Cloudflare 部署配置
└── bun.lock
```

---

## 4. 架构设计

### 4.1 分层架构

项目采用清晰的三层分离：

```
[Components] → [Hooks] → [Services]
     ↑              ↑          ↑
   UI 渲染      状态管理    纯数据处理
```

- **Services 层**（`services/`）：纯函数，不依赖 React，负责从 `same-sex.json` 原始数据加工成各场景所需的结构化数据
- **Hooks 层**（`hooks/`）：通过 `useMemo` 封装 Services 调用，管理 UI 交互状态（筛选、弹窗、滚动等）
- **Components 层**（`components/`）：纯 UI 渲染，消费 Hooks 提供的数据和状态

这种分层使得数据处理逻辑可独立测试，UI 组件保持轻量。

### 4.2 数据流

```
same-sex.json (静态 JSON ~58K 行)
      │
      ├── mapDataService.processMapData()
      │       → countries: DetailedData[]
      │       → regionsByCountry: Map<string, RegionData[]>
      │
      ├── timelineService.processTimelineData()
      │       → timelineEvents: TimelineEvent[]
      │       → yearlyStats / cumulativeStats
      │
      └── statsService.processStatsData()
              → summaryTypeStats / mechanismStats / totalCountries
```

所有数据处理在客户端运行，通过 `useMemo` 缓存避免重复计算。这是一个无后端的纯前端应用，所有数据在构建时静态打包。

### 4.3 地图交互模型

```
世界地图 (level: "world")
    │
    │  点击国家
    ▼
国家详情弹窗 (MapDataDialog)
    │
    │  如果该国有省/州级数据 → "进入国家内部" 按钮
    ▼
省/州级地图 (level: "region")  ←── "返回世界" 按钮
    │
    │  点击省/州
    ▼
省/州详情弹窗
```

关键组件协作：

- `useWorldMap`：管理 `MapState`（level + selectedCountry），处理地图点击事件，注册 GeoJSON，切换 ECharts option
- `useMapDialog`：管理弹窗开关和数据获取
- `EChartsWorldMap`：组合以上两个 Hook，渲染地图容器 + 弹窗

---

## 5. 核心数据模型

### 5.1 same-sex.json 结构

每条记录代表一个国家或国家的子辖区的同性伴侣法律状态，关键字段：

| 字段                                     | 说明                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `id`                                     | 唯一标识                                                                                           |
| `motherEntry.jurisdiction.name`          | 国家英文名                                                                                         |
| `motherEntry.jurisdiction.a2_code`       | ISO 两字母国家码                                                                                   |
| `motherEntry.subjurisdiction`            | 子辖区（省/州），`null` 表示国家级                                                                 |
| `summary_type.name`                      | 综合状态：`Marriage & Civil Union` / `Marriage` / `Civil Union Only` / `Varies` / `No` / `Unclear` |
| `marriage_type.name`                     | 同性婚姻类型（`Yes` / `No`）                                                                       |
| `marriage_critical_date_1`               | 婚姻合法化关键日期（Unix 时间戳秒）                                                                |
| `marriage_mechanism.name`                | 立法机制（`Legislative` / `Judicial` / `Executive`）                                               |
| `marriage_explan` / `marriage_explan_zh` | 英/中文详细说明                                                                                    |
| `civil_type.name`                        | 民事结合类型                                                                                       |
| `civil_critical_date_1`                  | 民事结合关键日期                                                                                   |
| `civil_mechanism.name`                   | 民事结合立法机制                                                                                   |
| `civil_repeal_date_1`                    | 废止日期（如已被婚姻法取代）                                                                       |
| `motherEntry.sources`                    | 法律来源文件列表                                                                                   |

### 5.2 状态分类系统

```typescript
STATUS_CATEGORIES = {
  "Marriage & Civil Union": {
    value: 5,
    color: "#10b981",
    name: "婚姻 & 民事结合",
  },
  Marriage: { value: 4, color: "#3b82f6", name: "婚姻" },
  "Civil Union Only": { value: 3, color: "#8b5cf6", name: "仅民事结合" },
  Varies: { value: 2, color: "#f59e0b", name: "因地区而异" },
  No: { value: 1, color: "#e5e7eb", name: "否" },
  Unclear: { value: 0, color: "#e5e7eb", name: "不明确" },
};
```

`value` 用于 ECharts `visualMap` 分段着色，`color` 直接用于 `itemStyle.areaColor`。

### 5.3 GeoJSON

- `worldEN.json`：世界各国边界 GeoJSON FeatureCollection，`properties.name` 用于与 `same-sex.json` 的 `jurisdiction.name` 匹配，`properties.id` 为 ISO 国家码
- `regionEN.json`：**代码中引用但文件不存在**——这是一个已知缺失，会导致构建失败

---

## 6. 设计系统

### 6.1 视觉风格：Notion 风

项目全面采用 Notion 风格的设计语言：

- **背景色**：纯白 `#FFFFFF` + 米白 `#F7F6F3` / `#F1F0ED` 交替使用
- **文字色**：棕灰主色 `#37352F` + 副色 `#787774` + 三级色 `#9B9A97`（比纯黑更柔和）
- **边框色**：微妙灰 `#E3E2E0` / `#F1F0ED`
- **阴影**：`shadow-notion: 0 1px 3px rgba(0,0,0,0.03)` / `shadow-notion-hover: 0 2px 8px rgba(0,0,0,0.06)`
- **圆角**：统一 `0.5rem`（8px）

### 6.2 彩虹色系

作为 LGBTQ+ 主题项目，定义了完整的彩虹色板：

| Token              | 值        | 用途                  |
| ------------------ | --------- | --------------------- |
| `--rainbow-red`    | `#EB5757` | Hero 标题 L           |
| `--rainbow-orange` | `#F2994A` | Hero 标题 G、图表     |
| `--rainbow-yellow` | `#F2C94C` | Hero 标题 T、图表     |
| `--rainbow-green`  | `#6FCF97` | 同性婚姻系列色        |
| `--rainbow-blue`   | `#56CCF2` | Hero 标题 B、统计卡片 |
| `--rainbow-purple` | `#BB6BD9` | 民事结合系列色        |

每种颜色还有低饱和度背景版本（`--bg-red` 到 `--bg-purple`），用于标签和 Badge。

### 6.3 深色模式

CSS 变量定义了完整的深色模式（`.dark` class），背景 `#191919`、文字 `#E3E2E0`，但**目前没有切换深色模式的 UI 入口**（没有引入 `next-themes` 的 ThemeProvider，尽管 `next-themes` 已安装）。

### 6.4 响应式设计

- 移动端（< 768px）和桌面端两套配置，通过 `useIsMobile()` Hook 检测
- ECharts 地图在移动端高度 350px、桌面端 600px，禁用拖拽
- 移动端隐藏 dataZoom slider、旋转 X 轴标签
- 导航栏在移动端显示汉堡菜单 Sheet
- 统计区在移动端使用 Card 布局，桌面端使用 Table 布局

---

## 7. 页面结构详解

### 7.1 导航栏 (Navbar)

- 固定在顶部，高度 64px
- 初始透明背景，滚动超过 10px 后切换为 `bg-white/90 + backdrop-blur-lg + shadow + rounded-2xl`
- 入场动画：从 `y: -64, opacity: 0` 过渡到 `y: 0, opacity: 1`（Framer Motion）
- 品牌名："在世界之中"（带🌈 emoji）
- 桌面端：GitHub 链接按钮；移动端：Sheet 侧边栏

### 7.2 Hero Section

- 左右两栏布局（移动端上下）
- 左侧：标题"全球 LGBTQ+ 权益地图"（每个字母用彩虹色）、副标题、分隔线、描述文字、Badge 标签
- 右侧：Unsplash 矢量插画（远程加载）

### 7.3 Map Section

- 浅灰背景 `bg-[#F7F6F3]`
- 标题 + 副标题 + ECharts 世界地图（白色卡片容器）
- 地图交互：hover 高亮 → click 弹出国家详情 → 可下钻到省/州级

### 7.4 Timeline Section

- 白色背景
- 包含一个说明性 `SectionIntro`（Alert 组件，蓝色调，介绍民事结合和同性婚姻的法律背景）
- **两个 Tab**：
  - 📊 趋势图表：ECharts 双折线图（累积同性婚姻 + 累积民事结合），彩虹渐变线条，下方有 dataZoom 滑块
  - 📋 事件列表：可筛选（全部/婚姻/民事结合）、可排序（时间正序/倒序）、按年份分组的卡片网格
- 趋势图表下方有 3 个统计卡片（婚姻合法化国家数、民事结合国家数、首个合法化年份）

### 7.5 Stats Section

- 浅灰背景
- **两个 Tab**：
  - 按状态分类：进度条 + 百分比 + 可展开的国家列表
  - 按立法模式：表格/卡片（Legislative/Judicial/Executive）显示婚姻/民事结合/总计

### 7.6 Data Section

- 白色背景
- 上半部分："数据背后的故事"卡片 + 3 个功能特性网格（法律进展/医疗权益/婚姻平权）
- 下半部分："故事分享"卡片 + 6 个 Bilibili 视频 iframe（16:9 比例），展示真实 LGBTQ+ 故事

### 7.7 Footer

- 简洁页脚：版权信息 "© 2026 Cooper Studio" + "Made with ❤️ for equality and love"

---

## 8. Hooks 详解

| Hook                      | 职责                 | 关键细节                                                                                   |
| ------------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| `useECharts`              | ECharts 实例生命周期 | init → resize（150ms debounce）→ dispose；返回 containerRef + chartInstance ref + isMobile |
| `useWorldMap`             | 地图状态机           | 管理 world/region 两级切换、GeoJSON 注册、click 事件分发、option 更新                      |
| `useMapDialog`            | 弹窗状态             | open/close + dialogData，关闭时 300ms 延迟清除数据（等待退出动画）                         |
| `useSameSexMapData`       | 地图数据             | `useMemo` 包裹 `getMapData()`，返回 countries + regionsByCountry                           |
| `useTimelineData`         | 时间线数据           | `useMemo` 包裹 `getTimelineData()`，返回事件 + 统计                                        |
| `useTimelineEventsFilter` | 事件筛选             | filterType / sortOrder 状态 + 派生的 filteredEvents / eventsByYear                         |
| `useStatsData`            | 统计数据             | `useMemo` 包裹 `getStatsData()`                                                            |
| `useNavbarScroll`         | 滚动检测             | `window.scrollY > threshold` 的 boolean                                                    |
| `useIsMobile`             | 断点检测             | `matchMedia` 监听 767px                                                                    |

---

## 9. Services 详解

### 9.1 mapDataService

- **输入**：`same-sex.json` 原始数据
- **输出**：`MapDataResult { countries, regionsByCountry }`
- **核心逻辑**：
  - 遍历每条记录，区分国家级（无 `subjurisdiction`）和省/州级
  - 国家级直接按 `summary_type.name` 分类着色
  - 省/州级存入 `regionsByCountry` Map，并将国家标记为 "Varies"
  - 翻译所有字段为中文（国名、状态、机制、说明文本）

### 9.2 timelineService

- **输入**：`same-sex.json`
- **输出**：`TimelineDataResult { timelineEvents, yearlyStats, cumulativeStats }`
- **核心逻辑**：
  - 提取 `marriage_type.name === "Yes"` 且有 `marriage_critical_date_1` 的记录 → marriage 事件
  - 提取 `civil_type.name === "Yes"` 且有 `civil_critical_date_1` 的记录 → civil 事件
  - 按年份排序，计算每年新增 + 累积数量
  - 去重逻辑：同一国家同一类型只计一次（`country_type` 组合去重）
  - 只包含有中文名（在 `country-names-zh.json` 中存在）的国家

### 9.3 chartConfigService

- 生成 ECharts 时间线折线图的完整 option
- 双系列：同性婚姻合法化（绿→蓝→紫渐变线条）+ 民事结合（紫→橙→黄渐变线条）
- 面积填充（半透明渐变）
- dataZoom：桌面端显示 slider，移动端隐藏
- Tooltip：自定义 HTML 格式化

### 9.4 dialogDataService

- `getCountryDialogData()`：根据国家码查找国家数据，标记是否可下钻
- `getRegionDialogData()`：根据国家码 + 地区名查找地区数据
- `formatDate()`：Unix 时间戳秒 → `YYYY-MM-DD`
- `getStatusLabel()`：状态码翻译

### 9.5 statsService

- 按 `summary_type` 统计各类别国家数和占比
- 按 `marriage_mechanism` / `civil_mechanism` 统计各立法机制使用情况
- 只处理国家级数据（排除子辖区，避免重复计数）
- 提供 UI 辅助函数（颜色 class、图标 emoji）

### 9.6 uiHelperService

- Badge 颜色映射（机制类型、事件类型）
- 文本预览（截断 + 清理 markdown 标记）
- 国家码 → 国旗 emoji 转换
- 机制/事件类型中文翻译

---

## 10. 国际化 / 翻译系统

翻译采用**静态映射**方式（非 i18n 框架），实现在 `lib/translations.ts`：

- `getCountryName()`：英文国名 → 中文（来自 `country-names-zh.json`，约 200 个国家）
- `getMechanismName()`：`Legislative` → "立法"，`Judicial` → "司法"，等
- `getStatusName()`：`Yes` → "是"，`Marriage & Civil Union` → "婚姻 & 民事结合"，等
- `getTopicName()`：`CIVIL UNION` → "民事结合"，等
- `getTranslatedField()`：优先使用 `*_zh` 后缀字段，否则回退到英文并尝试翻译

UI 界面文本全部硬编码为中文。

---

## 11. ECharts 地图配置

`lib/world-map-config.ts` 定义了完整的地图渲染配置：

### Tooltip 格式化

- 自定义 HTML 格式的 tooltip，显示国名、整体状态、婚姻信息、民事结合信息
- 长文本截断（移动端 80 字符、桌面端 120 字符）
- XSS 防护：`escapeHtml()` 转义特殊字符
- 中文显示优先

### 视觉映射

- 6 级分段着色（`visualMap: piecewise`），对应 `STATUS_CATEGORIES` 的 6 种状态
- 图例位于左下角

### 地图交互

- hover 高亮：浅黄背景 `#FBF3DB` + 黄色边框 `#F2C94C`
- 默认无 label，hover 时国家级不显示 label，region 级显示
- 禁用拖拽（`roam: false`）
- region 地图 zoom 放大 1.25 倍

---

## 12. 已知问题与技术债务

### 12.1 缺失文件

- **`data/regionEN.json`**：`hooks/use-world-map.ts` 第 4 行 `import regionGeoJSON from "@/data/regionEN.json"` 引用，但文件不存在。这会导致构建失败或运行时错误。

### 12.2 未使用的导入

- `components/footer.tsx`：导入了 `Link`、`Button`、`Separator` 但均未使用
- `components/navbar.tsx`：导入了 `Info` 但未使用

### 12.3 深色模式未启用

- `globals.css` 定义了完整的 `.dark` CSS 变量
- `package.json` 安装了 `next-themes`
- 但 `layout.tsx` 没有引入 `ThemeProvider`，也没有切换深色模式的 UI
- 组件中大量硬编码的颜色值（如 `text-[#37352F]`、`bg-white`）会导致深色模式不生效

### 12.4 硬编码颜色

大量组件使用 Notion 风格的硬编码 hex 值而非 CSS 变量，例如：

- `text-[#37352F]` 而非 `text-foreground`
- `bg-[#F7F6F3]` 而非 `bg-secondary`
- `border-[#E3E2E0]` 而非 `border-border`

这与 `globals.css` 中定义的语义化变量不一致，影响主题切换能力。

### 12.5 翻译重复

翻译映射在多处重复定义：

- `lib/translations.ts` 和 `services/statsService.ts` 都有 `getMechanismName()`
- `services/uiHelperService.ts` 也有 `translateMechanism()`
- 状态名翻译散落在多个文件中

### 12.6 性能考量

- `same-sex.json`（~58K 行）在客户端完整解析处理，但通过 `useMemo` 缓存减轻了重复计算的影响
- `worldEN.json`（~16K 行）直接 import 打入 bundle
- 无代码分割或懒加载策略（所有 Section 同时渲染）
- ECharts 完整引入而非按需引入

### 12.7 未使用的依赖

- `mapbox-gl`：已安装但代码中未使用（地图用的是 ECharts）
- `react-hook-form` + `@hookform/resolvers` + `zod`：表单相关，但没有表单功能
- `date-fns`：已安装但 `dialogDataService.ts` 中日期格式化使用的是原生 `Date.toISOString()`
- `recharts`：仅在 shadcn `chart.tsx` 组件中引用，实际图表全部用 ECharts

---

## 13. 组件关系图

```
app/layout.tsx
├── Navbar (fixed, z-40)
│   └── Sheet (mobile menu)
├── app/page.tsx
│   ├── HeroSection
│   │   ├── Badge × 2
│   │   └── Image (Unsplash)
│   ├── MapSection
│   │   └── EChartsWorldMap
│   │       ├── useECharts (instance lifecycle)
│   │       ├── useSameSexMapData → mapDataService
│   │       ├── useWorldMap (state machine)
│   │       │   └── world-map-config (ECharts options)
│   │       ├── useMapDialog (dialog state)
│   │       └── MapDataDialog
│   │           └── dialogDataService
│   ├── TimelineSection
│   │   ├── SectionIntro (Alert)
│   │   └── Tabs
│   │       ├── TimelineChart
│   │       │   ├── useECharts
│   │       │   ├── useTimelineData → timelineService
│   │       │   └── chartConfigService (ECharts options)
│   │       ├── TimelineStats
│   │       │   └── useTimelineData → timelineService
│   │       └── TimelineEventsList
│   │           ├── useTimelineData → timelineService
│   │           ├── useTimelineEventsFilter
│   │           ├── uiHelperService
│   │           └── Dialog (event detail)
│   ├── StatsSection
│   │   ├── useStatsData → statsService
│   │   └── Tabs (summary / mechanism)
│   └── DataSection
│       └── iframe × 6 (Bilibili)
└── Footer
```

---

## 14. 构建与部署

### 开发

```bash
bun install
bun dev        # http://localhost:3000
```

### 生产构建

```bash
bun run build  # → ./out/ (静态 HTML)
bun start      # 本地预览
```

### Cloudflare Pages 部署

```bash
npx wrangler pages deploy ./out
```

`wrangler.jsonc` 配置了 `compatibility_date: "2026-01-01"`。

---

## 15. 总结

Rainbow Paths 是一个结构清晰、设计精致的单页数据可视化应用。它的核心价值在于将复杂的全球 LGBTQ+ 法律数据转化为直观的交互式地图和时间线视图。

**架构亮点**：

- Services → Hooks → Components 三层分离，关注点分明
- 数据处理纯函数化，便于测试和维护
- ECharts 配置模块化，地图 Tooltip 自定义程度高

**主要改进空间**：

- 修复 `regionEN.json` 缺失导致的构建问题
- 统一使用 CSS 变量替代硬编码颜色，为深色模式做准备
- 合并分散的翻译逻辑到统一模块
- 引入代码分割和懒加载优化性能
- 清理未使用的依赖以减小 bundle 体积
