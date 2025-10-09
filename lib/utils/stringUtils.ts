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
