export function generateSlug(text: string): string {
  if (!text) return "";

  // First, check if the text contains Bangla characters
  const containsBangla = /[\u0980-\u09FF]/.test(text);

  if (containsBangla) {
    // For Bangla text, encode the entire string for URL safety
    // Replace spaces with hyphens and remove unsafe URL characters
    return encodeURIComponent(
      text
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\u0980-\u09FF\w\s-]/g, "") // Keep Bangla unicode range and basic Latin
    );
  } else {
    // Original Latin character handling
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
}

export function unslugify(slug: string): string {
  if (!slug) return "";

  // Check if this is a URI-encoded Bangla slug
  if (/%E0%A6/.test(slug) || /%E0%A7/.test(slug)) {
    // Decode the URI-encoded Bangla text
    return decodeURIComponent(slug).replace(/-/g, " ");
  }

  // For regular Latin slugs, use the original logic
  return slug
    .split("-")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(" ");
}

// Helper function to detect if text contains Bangla characters
export function containsBanglaText(text: string): boolean {
  // Bangla Unicode range: \u0980-\u09FF
  return /[\u0980-\u09FF]/.test(text);
}

export const slugToReadable = (slug: string) => {
  return slug ? slug.replace(/-/g, " ") : "";
};
