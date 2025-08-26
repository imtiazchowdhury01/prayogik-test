// Bengali datetime formatter utility
export function formatLiveCourseTime(isoString: string): string {
  const date = new Date(isoString);

  // Bengali day names
  const bengaliDays = [
    "রবিবার", // Sunday
    "সোমবার", // Monday
    "মঙ্গলবার", // Tuesday
    "বুধবার", // Wednesday
    "বৃহস্পতিবার", // Thursday
    "শুক্রবার", // Friday
    "শনিবার", // Saturday
  ];

  // Bengali month names
  const bengaliMonths = [
    "জানুয়ারি", // January
    "ফেব্রুয়ারি", // February
    "মার্চ", // March
    "এপ্রিল", // April
    "মে", // May
    "জুন", // June
    "জুলাই", // July
    "আগস্ট", // August
    "সেপ্টেম্বর", // September
    "অক্টোবর", // October
    "নভেম্বর", // November
    "ডিসেম্বর", // December
  ];

  // Bengali numbers
  const bengaliNumbers: { [key: string]: string } = {
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

  // Convert number to Bengali
  function toBengaliNumber(num: number): string {
    return num.toString().replace(/[0-9]/g, (digit) => bengaliNumbers[digit]);
  }

  // Get components
  const dayName = bengaliDays[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const monthName = bengaliMonths[date.getMonth()];
  const hour = date.getHours();

  // Determine time period and format hour
  let timeText: string;
  if (hour === 0) {
    timeText = "রাত ১২টা";
  } else if (hour < 6) {
    timeText = `রাত ${toBengaliNumber(hour)}টা`;
  } else if (hour < 12) {
    timeText = `সকাল ${toBengaliNumber(hour)}টা`;
  } else if (hour === 12) {
    timeText = "দুপুর ১২টা";
  } else if (hour < 18) {
    timeText = `দুপুর ${toBengaliNumber(hour - 12)}টা`;
  } else if (hour < 21) {
    timeText = `সন্ধ্যা ${toBengaliNumber(hour - 12)}টা`;
  } else {
    timeText = `রাত ${toBengaliNumber(hour - 12)}টা`;
  }

  // Handle minutes if not zero
  const minutes = date.getMinutes();
  if (minutes > 0) {
    timeText += ` ${toBengaliNumber(minutes)}`;
  }

  return `${dayName}, ${day} ${monthName}, ${timeText}`;
}

// Example usage:
// const formatted = formatLiveCourseTime('2025-08-18T07:00:00.000Z');
// console.log(formatted); // Output: সোমবার, ১৮ আগস্ট, সকাল ৭টা
