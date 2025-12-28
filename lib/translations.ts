import countryNamesZh from "@/data/country-names-zh.json";

/**
 * 翻译工具函数
 */

// 类型定义
type CountryNamesMap = Record<string, string>;

const countryMap = countryNamesZh as CountryNamesMap;

/**
 * 获取国家中文名称，如果没有则返回英文名称
 */
export function getCountryName(englishName: string, returnEnglish: boolean = false): string {

    if (returnEnglish) {
        return countryMap[englishName] || '';
    }
    return countryMap[englishName] || englishName;
}

/**
 * 机制类型中英文映射
 */
const mechanismMap: Record<string, string> = {
    Legislative: "立法",
    Judicial: "司法",
    Executive: "行政",
    Constitutional: "宪法",
    "Constitutional Amendment": "宪法修正",
    Referendum: "公民投票",
    Unknown: "未知",
};

/**
 * 获取机制类型的中文名称
 */
export function getMechanismName(englishName: string): string {
    return mechanismMap[englishName] || englishName;
}

/**
 * 状态类型中英文映射
 */
const statusMap: Record<string, string> = {
    Yes: "是",
    No: "否",
    Varies: "因地区而异",
    "Marriage & Civil Union": "婚姻 & 民事结合",
    Marriage: "婚姻",
    "Civil Union Only": "仅民事结合",
    Unclear: "不明确",
    "Same-sex marriage": "同性婚姻",
    "Civil union": "民事结合",
};

/**
 * 获取状态的中文名称
 */
export function getStatusName(englishName: string): string {
    return statusMap[englishName] || englishName;
}

/**
 * 主题类型中英文映射
 */
const topicMap: Record<string, string> = {
    "CIVIL UNION": "民事结合",
    MARRIAGE: "婚姻",
    "SAME SEX COUPLE": "同性伴侣",
};

/**
 * 获取主题的中文名称
 */
export function getTopicName(englishName: string): string {
    return topicMap[englishName] || englishName;
}

/**
 * 从 JSON 数据中提取翻译字段
 * 优先使用 _zh 后缀的字段，如果不存在则使用英文字段
 */
export function getTranslatedField(
    data: any,
    fieldName: string,
    subField?: string
): string {
    if (!data) return "";

    // 如果是嵌套字段（如 marriage_type.name）
    if (subField) {
        const obj = data[fieldName];
        if (!obj) return "";

        // 优先检查中文字段
        const zhField = `${subField}_zh`;
        if (obj[zhField]) return obj[zhField];

        // 否则返回英文并尝试翻译
        const enValue = obj[subField];
        if (fieldName.includes("mechanism")) {
            return getMechanismName(enValue);
        }
        if (fieldName.includes("type")) {
            return getStatusName(enValue);
        }
        return enValue || "";
    }

    // 单层字段（如 marriage_explan）
    const zhField = `${fieldName}_zh`;
    if (data[zhField]) return data[zhField];

    return data[fieldName] || "";
}

/**
 * 获取子辖区的中文名称
 * 优先使用 name_zh 字段
 */
export function getSubjurisdictionName(subjurisdiction: any): string | null {
    if (!subjurisdiction) return null;
    return subjurisdiction.name_zh || subjurisdiction.name || null;
}

