/**
 * UI Helper Service
 * Provides pure utility functions for UI components
 * Color mapping, text processing, and formatting
 */

/**
 * Get badge color class for mechanism type
 */
export function getMechanismColor(mechanism: string): string {
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
}

/**
 * Get badge color class for event type
 */
export function getTypeColor(type: string): string {
  return type === "marriage"
    ? "bg-pink-100 text-pink-700 border-pink-200"
    : "bg-indigo-100 text-indigo-700 border-indigo-200";
}

/**
 * Get preview text (first N characters)
 * Removes markdown formatting and truncates
 */
export function getPreview(text: string, maxLength: number = 100): string {
  if (!text) return "暂无详细说明";
  const cleanText = text.replace(/\*\*/g, "").replace(/\*/g, "");
  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + "..."
    : cleanText;
}

/**
 * Convert country code to flag emoji
 */
export function getCountryFlagEmoji(countryCode: string | null): string {
  if (!countryCode) return "🏳️";
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0))
  );
}

/**
 * Translate mechanism name to Chinese
 */
export function translateMechanism(mechanism: string): string {
  switch (mechanism) {
    case "Legislative":
      return "立法";
    case "Judicial":
      return "司法";
    case "Executive":
      return "行政";
    default:
      return mechanism;
  }
}

/**
 * Translate event type to Chinese
 */
export function translateEventType(type: string): string {
  return type === "marriage" ? "同性婚姻" : "民事结合";
}

