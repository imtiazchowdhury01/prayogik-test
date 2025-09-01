// ---------- Common constants & utilities ---------- //

// Bengali day names
const BENGALI_DAYS = [
  "রবিবার",    // Sunday
  "সোমবার",    // Monday
  "মঙ্গলবার",  // Tuesday
  "বুধবার",    // Wednesday
  "বৃহস্পতিবার", // Thursday
  "শুক্রবার",  // Friday
  "শনিবার",    // Saturday
];

// Bengali month names
const BENGALI_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল",
  "মে", "জুন", "জুলাই", "আগস্ট",
  "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

// Bengali numbers map
const BENGALI_NUMBERS: { [key: string]: string } = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};

// Convert number to Bengali
function toBengaliNumber(num: number): string {
  return num.toString().replace(/[0-9]/g, (digit) => BENGALI_NUMBERS[digit]);
}


// ---------- Formatters ---------- //

// Bengali date formatter utility
export function formatLiveCourseDate(isoString: string): string {
  const date = new Date(isoString);

  const day = toBengaliNumber(date.getDate());
  const monthName = BENGALI_MONTHS[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  return `${day} ${monthName} ${year}`;
}

// Bengali datetime formatter utility
export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);

  const dayName = BENGALI_DAYS[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const monthName = BENGALI_MONTHS[date.getMonth()];
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
    timeText += ` ${toBengaliNumber(minutes)} মিনিট`;
  }

  return `${dayName}, ${day} ${monthName}, ${timeText}`;
}
