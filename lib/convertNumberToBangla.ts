export function convertNumberToBangla(input: number | string): string {
  const banglaNumeralMap = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const inputStr = input?.toString() || "0";

  // Split input into integer and decimal parts
  let [integerPart, decimalPart] = inputStr.split(".");

  // Add commas to the integer part
  const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Convert digits to Bangla
  const convertedInteger = integerWithCommas
    .split("")
    .map((char) => (/\d/.test(char) ? banglaNumeralMap[parseInt(char)] : char))
    .join("");

  // If there's a decimal part, convert it as well
  let convertedDecimal = "";
  if (decimalPart) {
    convertedDecimal =
      "." +
      decimalPart
        .split("")
        .map((char) =>
          /\d/.test(char) ? banglaNumeralMap[parseInt(char)] : char
        )
        .join("");
  }

  return convertedInteger + convertedDecimal;
}

export function getPlainTextFromHtml(htmlString: string, maxLength = 100) {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    // Server-side fallback: use regex to strip HTML tags
    const stripped = htmlString.replace(/<[^>]*>/g, '');
    const decoded = stripped
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    const cleanedText = decoded.replace(/\s+/g, " ").trim();
    
    if (cleanedText.length <= maxLength) {
      return cleanedText;
    }

    const truncated = cleanedText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  }

  // Client-side: use DOM parsing
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const plainText = tempDiv.textContent || tempDiv.innerText || "";
  const cleanedText = plainText.replace(/\s+/g, " ").trim();

  if (cleanedText.length <= maxLength) {
    return cleanedText;
  }

  const truncated = cleanedText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

// format duration to Bangla HH:MM:SS (hour showwn if greater than 0)
export function formatDurationToBanglaHMS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const banglaMinutes = convertNumberToBangla(minutes);
    const banglaSeconds = convertNumberToBangla(remainingSeconds);

    if (hours > 0) {
      const banglaHours = convertNumberToBangla(hours);
      return `${banglaHours}:${banglaMinutes}:${banglaSeconds}`;
    } else {
      return `${banglaMinutes}:${banglaSeconds}`;
    }
  }
