# Same-Sex Union Data Fields Documentation

## 数据概述

本文档详细说明了同性伴侣法律认可数据集（`same-sex.json`）中所有字段的含义、用途和取值范围。该数据集记录了全球各国家/地区关于同性婚姻和同性民事结合的法律状态。

---

## 数据结构

数据为 JSON 数组格式，每个条目代表一个国家或子区域的同性伴侣法律认可情况。

---

## 字段详细说明

### 顶层字段

#### `id`
- **类型**: `string`
- **含义**: 条目的唯一标识符
- **示例**: `"20200"`, `"20331"`, `"20332"`
- **用途**: 用于数据库索引和关联查询

#### `__typename`
- **类型**: `string`
- **含义**: GraphQL 类型名称标识
- **固定值**: `"EntrySsu"` (Entry Same-Sex Union)
- **用途**: GraphQL 查询类型标识，表明这是同性结合条目

---

### `motherEntry` - 主条目信息对象

包含条目的核心元数据、管辖区域和来源信息。

#### `motherEntry.entry_type_id`
- **类型**: `string`
- **含义**: 条目类型标识符
- **固定值**: `"A1-15"`
- **用途**: 标识数据条目属于"同性伴侣法律认可"类别

#### `motherEntry.topics`
- **类型**: `array<Topic>`
- **含义**: 该条目相关的主题标签数组
- **用途**: 用于数据分类、筛选和搜索

**Topic 对象结构**:
```json
{
  "id": "string",           // 主题唯一ID
  "name": "string",         // 主题名称
  "section": number,        // 所属章节编号
  "__typename": "Topic"
}
```

**常见主题值**:
| id | name | 中文含义 | section |
|----|------|----------|---------|
| 25 | CIVIL UNION | 民事结合 | 1 |
| 92 | MARRIAGE | 婚姻 | 0 |
| 122 | SAME SEX COUPLE | 同性伴侣 | 0 |

#### `motherEntry.jurisdiction`
- **类型**: `object`
- **含义**: 主管辖区域（国家级）信息
- **用途**: 标识法律适用的国家范围

**Jurisdiction 对象结构**:
```json
{
  "id": "string",              // 联合国国家代码（如 "UN-086"）
  "name": "string",            // 国家名称（如 "Japan"）
  "un_member": boolean,        // 是否为联合国成员国
  "a2_code": "string",         // ISO 3166-1 alpha-2 两字母国家代码（如 "JP"）
  "regions": [                 // 所属地理/政治区域ID列表
    {
      "id": "string",
      "__typename": "Region"
    }
  ],
  "__typename": "Jurisdiction"
}
```

**字段说明**:
- `id`: 采用 UN-XXX 格式的联合国国家编码
- `name`: 国家官方英文名称
- `un_member`: 是否为联合国会员国
- `a2_code`: 国际标准的两字母国家代码（ISO 3166-1 alpha-2）
- `regions`: 该国所属的地理区域、政治联盟等分类ID数组（如亚洲、欧盟等）

#### `motherEntry.subjurisdiction`
- **类型**: `object | null`
- **含义**: 子管辖区域（省/州/县级）信息
- **用途**: 当法律在国家的特定地区实施时使用
- **为 null 时**: 表示该条目适用于整个国家

**Subjurisdiction 对象结构**:
```json
{
  "id": "string",                  // 子区域代码（如 "JP-23" 代表日本爱知县）
  "name": "string",                // 子区域名称（如 "Aichi"）
  "slug": "string",                // URL友好标识符（如 "aichi"）
  "label_longitude": number,       // 地图标签经度坐标
  "label_latitude": number,        // 地图标签纬度坐标
  "label_font_size": number,       // 地图显示字体大小
  "__typename": "Subjurisdiction"
}
```

**字段说明**:
- `id`: 采用 ISO 3166-2 标准（国家代码-地区代码）
- `slug`: 用于生成 URL 路径的标准化标识符
- `label_longitude/latitude`: 用于在地图上精确显示区域标签位置
- `label_font_size`: 根据区域大小和重要性调整地图上的标签字体

#### `motherEntry.footnotes`
- **类型**: `array`
- **含义**: 脚注数组
- **用途**: 存储额外的说明性信息或特殊情况说明
- **目前状态**: 大多数条目为空数组 `[]`

#### `motherEntry.sources`
- **类型**: `array<Source>`
- **含义**: 法律依据来源文件信息数组
- **用途**: 提供法律条文、官方文件等原始资料索引

**Source 对象结构**:
```json
{
  "id": "string",                           // 来源文件唯一ID
  "order": number,                          // 排序顺序
  "section": number,                        // 所属章节
  "original_official_filename": string | null,  // 官方原始文件名
  "original_filename": "string",            // 存储的原始文件名
  "translated_filename": string | null,     // 翻译版文件名
  "enacted": string | null,                 // 生效日期
  "original_official_language": object | null,  // 官方语言
  "original_official_language2": object | null, // 第二官方语言
  "original_language": {                    // 文件原始语言
    "name": "string",                       // 语言名称（如 "Japanese"）
    "id": "string",                         // 语言ID
    "__typename": "Language"
  },
  "original_language2": object | null,      // 第二原始语言
  "__typename": "Source"
}
```

**示例**:
```json
{
  "id": "511283",
  "order": 1,
  "section": 1,
  "original_filename": "AR - LEG - Law 26.618 on Marriage Equality (2010) - (es).pdf",
  "original_language": {
    "name": "Spanish",
    "id": "41"
  }
}
```

#### `motherEntry.__typename`
- **类型**: `string`
- **固定值**: `"Entry"`
- **用途**: GraphQL 类型标识

---

### `summary_type` - 总体状态类型

#### 字段说明
- **类型**: `object`
- **含义**: 该区域同性伴侣关系认可的总体状况分类
- **用途**: 提供快速概览，便于数据筛选和统计

**对象结构**:
```json
{
  "name": "string",                    // 状态名称
  "id": "string",                      // 状态ID
  "__typename": "EntrySsuSummaryType"
}
```

**可能的取值**:
| id | name | 中文含义 | 说明 |
|----|------|----------|------|
| 2 | Marriage & Civil Union | 婚姻与民事结合 | 同时支持同性婚姻和民事结合 |
| 3 | Marriage Only | 仅婚姻 | 仅支持同性婚姻 |
| 4 | Civil Union Only | 仅民事结合 | 仅支持民事结合 |
| 8 | No | 不支持 | 不支持任何形式的同性伴侣关系认可 |

---

### Marriage 相关字段 - 同性婚姻

#### `marriage_type`
- **类型**: `object`
- **含义**: 同性婚姻的合法化状态

**对象结构**:
```json
{
  "name": "string",                    // "Yes" 或 "No"
  "id": "string",                      // "1" (Yes) 或 "6" (No)
  "__typename": "EntrySsuMarriageType"
}
```

**取值说明**:
- `id: "1", name: "Yes"` - 同性婚姻合法
- `id: "6", name: "No"` - 同性婚姻不合法

#### `marriage_mechanism`
- **类型**: `object | null`
- **含义**: 同性婚姻合法化的实现机制
- **为 null 时**: 表示同性婚姻不合法

**对象结构**:
```json
{
  "name": "string",                              // 机制名称
  "id": "string",                                // 机制ID
  "__typename": "LegalFrameworkDecrimMechanism"
}
```

**可能的取值**:
| id | name | 中文含义 | 说明 |
|----|------|----------|------|
| 2 | Legislative | 立法 | 通过立法机关制定法律 |
| 3 | Judicial | 司法 | 通过法院判决确立 |
| 1 | Executive | 行政 | 通过行政命令或政府政策 |

#### `marriage_critical_date_1`
- **类型**: `number | null`
- **含义**: 同性婚姻相关的第一个关键年份
- **通常表示**: 同性婚姻合法化生效年份
- **示例**: `2010` 表示 2010 年生效

#### `marriage_critical_date_2`
- **类型**: `number | null`
- **含义**: 同性婚姻相关的第二个关键年份
- **用途**: 记录重大修订、扩展或其他重要里程碑年份

#### `marriage_explan`
- **类型**: `string`
- **含义**: 同性婚姻法律状况的详细说明
- **内容**: 
  - 具体法律条文引用
  - 法律实施细节
  - 历史演变过程
  - 特殊规定或限制
- **格式**: 支持 Markdown 格式（如斜体、粗体）

**示例**:
```text
Law on Marriage Equality (*Law 26,618*) (2010) is the federal law that amended 
the Civil Code to provide for same-sex marriage nationwide. Article 172 reads...
```

---

### Civil Union 相关字段 - 民事结合

#### `civil_type`
- **类型**: `object`
- **含义**: 同性民事结合的合法化状态

**对象结构**:
```json
{
  "name": "string",                    // "Yes" 或 "No"
  "id": "string",                      // "1" (Yes) 或 "6" (No)
  "__typename": "EntrySsuCivilType"
}
```

#### `civil_mechanism`
- **类型**: `object | null`
- **含义**: 民事结合合法化的实现机制
- **结构与取值**: 与 `marriage_mechanism` 相同

**常见取值**:
- `Legislative` (立法)
- `Executive` (行政) - 在日本地方政府常用
- `Judicial` (司法)

#### `civil_critical_date_1`
- **类型**: `number | null`
- **含义**: 民事结合生效的第一个关键年份
- **示例**: 
  - 日本爱知县: `2024`
  - 日本秋田县: `2022`

#### `civil_critical_date_2`
- **类型**: `number | null`
- **含义**: 民事结合相关的第二个关键年份
- **用途**: 记录制度修订、扩展或其他重要变更年份
- **示例**: 阿根廷为 `2015`（全国性民事结合法生效）

#### `civil_repeal_date_1`
- **类型**: `number | null`
- **含义**: 民事结合制度第一次废止或撤销的年份
- **为 null**: 表示制度仍然有效
- **有值情况**: 当民事结合被更高级别制度（如婚姻）取代或被取消时

#### `civil_repeal_date_2`
- **类型**: `number | null`
- **含义**: 第二次废止或相关变更年份
- **用途**: 记录复杂的法律变更历史

#### `civil_explan`
- **类型**: `string`
- **含义**: 民事结合法律状况的详细说明
- **内容包括**:
  - 法律或政策名称（英文和原文）
  - 实施机构（如市政府、县政府）
  - 制度的正式名称
  - 制度提供的权益和保障
  - 与其他地区的差异
  - 历史演变

**示例 - 日本爱知县**:
```text
Aichi Prefecture enacted the Family-ship Oath System (ファミリーシップ宣誓制度) 
in April 2024. This system explicitly includes children of same-sex couples in 
its recognition framework, granting certain rights such as school-related matters...
```

**示例 - 日本秋田县**:
```text
Akita Prefecture introduced the Partnership Affidavit Certification System 
(パートナーシップ宣誓認証制度) in April 2022, recognizing same-sex partnerships...
```

---

## 数据使用场景

### 1. 地图可视化
- 使用 `jurisdiction` 和 `subjurisdiction` 的地理坐标
- 根据 `summary_type` 对地区进行颜色编码
- 使用 `label_font_size` 调整标签显示

### 2. 时间线分析
- 利用 `*_critical_date_1/2` 绘制法律进展时间线
- 比较不同国家/地区的立法时间

### 3. 法律研究
- 查询 `sources` 获取原始法律文件
- 阅读 `*_explan` 了解具体法律内容
- 分析 `*_mechanism` 研究不同的立法路径

### 4. 统计分析
- 按 `regions` 分组统计各大洲/区域情况
- 按 `summary_type` 分类统计全球覆盖率
- 按 `*_mechanism` 分析立法模式分布

---

## 数据质量说明

### 完整性
- ✅ 所有条目都包含 `id`, `__typename`, `motherEntry` 等核心字段
- ⚠️  `subjurisdiction` 仅在国家内部法律不统一时存在
- ⚠️  `sources` 在部分条目中可能为空数组

### 时效性
- 数据包含历史和当前法律状态
- `*_critical_date` 字段记录关键时间点
- `*_repeal_date` 字段标记已废止的法律

### 多语言
- 主要字段使用英文
- `*_explan` 字段中可能包含原文法律名称（使用斜体标注）
- `sources` 包含多语言法律文件索引

---

## 特殊案例说明

### 案例1: 国家级法律统一
```json
{
  "id": "20206",
  "motherEntry": {
    "jurisdiction": { "name": "Argentina", "a2_code": "AR" },
    "subjurisdiction": null  // 全国统一法律
  },
  "summary_type": { "name": "Marriage & Civil Union" },
  "marriage_type": { "name": "Yes" },
  "marriage_critical_date_1": 2010,  // 全国同性婚姻生效
  "civil_type": { "name": "Yes" },
  "civil_critical_date_1": 2002,
  "civil_critical_date_2": 2015  // 全国民事结合生效
}
```

### 案例2: 地区级法律差异
```json
{
  "id": "20331",
  "motherEntry": {
    "jurisdiction": { "name": "Japan", "a2_code": "JP" },
    "subjurisdiction": { "name": "Aichi" }  // 仅适用于爱知县
  },
  "marriage_type": { "name": "No" },  // 日本国家层面不支持同性婚姻
  "civil_type": { "name": "Yes" },    // 但爱知县支持民事结合
  "civil_mechanism": { "name": "Executive" },  // 通过地方政府行政令
  "civil_critical_date_1": 2024
}
```

### 案例3: 完全不支持
```json
{
  "id": "20200",
  "motherEntry": {
    "jurisdiction": { "name": "Afghanistan", "a2_code": "AF" }
  },
  "summary_type": { "name": "No" },
  "marriage_type": { "name": "No" },
  "marriage_mechanism": null,
  "civil_type": { "name": "No" },
  "civil_mechanism": null,
  "marriage_explan": "",
  "civil_explan": ""
}
```

---

## 技术规范

### GraphQL Schema
数据遵循 GraphQL 类型系统：
- 每个对象都包含 `__typename` 用于类型识别
- 支持嵌套查询和关联查询
- 符合 GraphQL 规范的可空性定义

### 数据格式
- **编码**: UTF-8
- **格式**: JSON
- **结构**: 数组，每个元素为独立的条目对象
- **日期**: 使用年份（number 类型）而非完整日期字符串

### 命名规范
- 字段名使用 snake_case（如 `entry_type_id`）
- 类型名使用 PascalCase（如 `EntrySsuMarriageType`）
- 枚举值使用 UPPER_CASE（如 `CIVIL UNION`）

---

## 版本历史

*本文档版本*: 1.0  
*数据版本*: 未指定  
*最后更新*: 2025-12-27

---

## 参考资源

### 相关标准
- **ISO 3166-1**: 国家代码标准
- **ISO 3166-2**: 国家地区代码标准
- **UN M49**: 联合国国家/地区代码
- **GraphQL**: 查询语言规范

### 数据来源
数据基于官方法律文件、政府公告和权威法律数据库整理而成。详细来源见各条目的 `sources` 字段。

---

## 附录: 字段快速索引

| 字段路径 | 类型 | 说明 |
|---------|------|------|
| `id` | string | 条目ID |
| `__typename` | string | GraphQL类型: "EntrySsu" |
| `motherEntry.entry_type_id` | string | 固定值: "A1-15" |
| `motherEntry.topics` | array | 主题标签数组 |
| `motherEntry.jurisdiction` | object | 国家信息 |
| `motherEntry.subjurisdiction` | object\|null | 省/州/县信息 |
| `motherEntry.footnotes` | array | 脚注 |
| `motherEntry.sources` | array | 法律来源文件 |
| `summary_type` | object | 总体状态类型 |
| `marriage_type` | object | 同性婚姻合法性 |
| `marriage_mechanism` | object\|null | 婚姻实现机制 |
| `marriage_critical_date_1` | number\|null | 婚姻关键年份1 |
| `marriage_critical_date_2` | number\|null | 婚姻关键年份2 |
| `marriage_explan` | string | 婚姻详细说明 |
| `civil_type` | object | 民事结合合法性 |
| `civil_mechanism` | object\|null | 民事结合实现机制 |
| `civil_critical_date_1` | number\|null | 民事结合关键年份1 |
| `civil_critical_date_2` | number\|null | 民事结合关键年份2 |
| `civil_repeal_date_1` | number\|null | 民事结合废止年份1 |
| `civil_repeal_date_2` | number\|null | 民事结合废止年份2 |
| `civil_explan` | string | 民事结合详细说明 |

---

*此文档旨在帮助开发者和研究者理解和使用同性伴侣法律认可数据集。如有疑问或需要补充，请联系数据维护团队。*

