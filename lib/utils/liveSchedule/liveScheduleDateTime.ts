// lib/utils/bengaliDateTime.ts

// Bengali full day names with "বার" suffix
export const BENGALI_DAY_SHORT: Record<string, string> = {
  MONDAY: "সোমবার",
  TUESDAY: "মঙ্গলবার",
  WEDNESDAY: "বুধবার",
  THURSDAY: "বৃহস্পতিবার",
  FRIDAY: "শুক্রবার",
  SATURDAY: "শনিবার",
  SUNDAY: "রবিবার",
};

// Bengali number mapping
const BENGALI_NUMBERS: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

/**
 * Convert English numbers to Bengali numbers
 * @param num - The number to convert
 * @returns Bengali number string
 */
export const toBengaliNumber = (num: number): string =>
  num.toString().replace(/[0-9]/g, (d) => BENGALI_NUMBERS[d]);

/**
 * Convert English number string to Bengali numbers
 * @param numStr - The number string to convert
 * @returns Bengali number string
 */
export const toBengaliNumberString = (numStr: string): string =>
  numStr.replace(/[0-9]/g, (d) => BENGALI_NUMBERS[d]);

/**
 * Format time (HH:mm) to Bengali like "রাত ৯:০০"
 * @param dateString - ISO date string or date object
 * @returns Formatted Bengali time string
 */
export function formatBanglaTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const hour = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Determine time period
  let period = "";
  let h = hour;

  if (hour === 0) {
    period = "রাত";
    h = 12;
  } else if (hour < 6) {
    period = "রাত";
  } else if (hour < 12) {
    period = "সকাল";
  } else if (hour === 12) {
    period = "দুপুর";
  } else if (hour < 18) {
    period = "দুপুর";
    h = hour - 12;
  } else if (hour < 21) {
    period = "সন্ধ্যা";
    h = hour - 12;
  } else {
    period = "রাত";
    h = hour - 12;
  }

  const hourText = toBengaliNumber(h);
  const minText = minutes > 0 ? `:${toBengaliNumber(minutes)}` : ":০০";

  return `${period} ${hourText}${minText}`;
}

/**
 * Get unique Bengali day names from schedules
 * @param schedules - Array of schedule objects with dayOfWeek property
 * @returns Array of unique Bengali day names
 */
export function getUniqueBengaliDays(schedules: any[]): string[] {
  return Array.from(
    new Set(schedules.map((s: any) => BENGALI_DAY_SHORT[s.dayOfWeek]))
  ).filter(Boolean);
}

/**
 * Format multiple days into a readable Bengali string
 * @param days - Array of Bengali day names
 * @returns Formatted string with proper conjunctions
 */
export function formatBengaliDaysList(days: string[]): string {
  if (days.length === 0) return "";
  if (days.length === 1) return days[0];

  return days.length > 1
    ? days.slice(0, -1).join(", ") + " ও " + days.slice(-1)
    : days.join("");
}
