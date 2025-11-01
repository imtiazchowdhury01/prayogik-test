export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";

  // Add space before each uppercase letter, then capitalize the first letter and lowercase the rest
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
    .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
};

export function formatCurrency(amount: string | number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const generateUsername = (name: string) => {
  const randomNumber = Math.floor(Math.random() * 10000); // Random number between 0-9999
  const usernameBase = name.toLowerCase().replace(/\s+/g, ""); // Remove spaces and make lowercase
  return `${usernameBase}${randomNumber}`;
};

export const toSlug = (str: string): string => {
  return str
    .normalize("NFD") // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .replace(/&/g, "and") // Replace & with 'and'
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumerics with hyphen
    .replace(/-{2,}/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
};

export const isEnglish = (str: string): boolean =>
  /^[a-zA-Z0-9\s.,!?'"()\-+/:;@#$%&*=_~`^[\]{}|\\<>]*$/.test(str);

export const formatDateToBangla = (date: Date) => {
  return date.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


 export function getConsistentBangladeshTime(eventDate: Date | string) {
    const dateObj =
      typeof eventDate === "string" ? new Date(eventDate) : eventDate;
    if (!dateObj) {
      return "Invalid date"; // or any fallback string
    }
    // Create date formatter for Bangladesh timezone
    const timeFormatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    // Get the hour in Bangladesh timezone for period determination
    const bangladeshHour = parseInt(
      dateObj?.toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        hour12: false,
      })
    );

    const bangladeshMinute = parseInt(
      dateObj.toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        minute: "2-digit",
      })
    );

    let period = "";
    if (bangladeshHour >= 4 && bangladeshHour < 12) {
      period = "সকাল";
    } else if (bangladeshHour >= 12 && bangladeshHour < 16) {
      period = "দুপুর";
    } else if (bangladeshHour >= 16 && bangladeshHour < 19) {
      period = "বিকেল";
    } else {
      period = "রাত";
    }

    // Convert to 12-hour format
    let displayHour = bangladeshHour % 12;
    if (displayHour === 0) displayHour = 12;

    // Format numbers in Bangla
    const numberFormatter = new Intl.NumberFormat("bn-BD");
    const hourText = numberFormatter.format(displayHour);
    const minuteText =
      bangladeshMinute > 0
        ? `:${numberFormatter.format(bangladeshMinute).padStart(2, "০")}`
        : "";

    const timeString = `${period} ${hourText}${minuteText} টা`;
    const dateString = dateFormatter.format(dateObj);

    return { timeString, dateString };
  }

