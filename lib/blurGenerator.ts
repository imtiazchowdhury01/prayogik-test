/* 
size: 4 (default) - Very blurry
size: 8 - Less blurry
size: 16 - Moderate blur
size: 32 - Light blur
size: 64 - Very light blur
size: 128 - Minimal blur
*/
import { getPlaiceholder } from "plaiceholder";

// Configuration for fetch timeout (single attempt only)
const FETCH_CONFIG = {
  timeout: 30000, // 30 seconds
};

// Check if URL is a PNG file
function isPngFile(imageUrl: string): boolean {
  const url = imageUrl.toLowerCase();
  return (
    url.includes(".png") || url.includes("format=png") || url.includes("f=png")
  );
}

// Server-side blur generation with improved error handling
export async function generateBlurDataURL(
  imageUrl: string
): Promise<string | null> {
  if (!imageUrl) return null;

  // For PNG files, always return static blur image
  if (isPngFile(imageUrl)) {
    console.log(`PNG detected ${imageUrl}`);
    return getFallbackBlurDataURL();
  }

  try {
    const buffer = await fetchImageSingleAttempt(imageUrl);
    if (!buffer) {
      // console.warn(`Failed to fetch image: ${imageUrl}`);
      return getFallbackBlurDataURL();
    }

    const { base64 } = await getPlaiceholder(Buffer.from(buffer), {
      size: 64, // Higher size = less blur (default: 4)
      format: ["webp"], // Format preference
    });

    return base64;
  } catch (error) {
    // console.error("Error generating blur data for", imageUrl, ":", error);
    return getFallbackBlurDataURL();
  }
}

// Fetch with timeout - single attempt only
async function fetchImageSingleAttempt(
  imageUrl: string
): Promise<ArrayBuffer | null> {
  try {
    // console.log(`Fetching image (single attempt): ${imageUrl}`);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      FETCH_CONFIG.timeout
    );

    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BlurGenerator/1.0)",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();
    return buffer;
  } catch (error) {
    console.error(`Failed to fetch ${imageUrl}:`, error);
    return null;
  }
}

// Fallback blur placeholder (teal combination blur)
function getFallbackBlurDataURL(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9ImJsdXIiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyIi8+CiAgICA8L2ZpbHRlcj4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idGVhbEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwODA4MCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIzNSUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxNEI4QTYiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iNjUlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjBEMUMxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1RkRERkQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3RlYWxHcmFkaWVudCkiIGZpbHRlcj0idXJsKCNibHVyKSIgLz4KPC9zdmc+";
}

// Generate blur data for multiple images with concurrency control
export async function generateMultipleBlurDataURLs(
  imageUrls: string[],
  concurrency: number = 3 // Limit concurrent requests
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};

  // Process images in batches to avoid overwhelming the server
  for (let i = 0; i < imageUrls.length; i += concurrency) {
    const batch = imageUrls.slice(i, i + concurrency);

    const batchPromises = batch.map(async (url) => {
      const blur = await generateBlurDataURL(url);
      return [url, blur] as const;
    });

    const batchResults = await Promise.all(batchPromises);

    // Add batch results to the main results object
    for (const [url, blur] of batchResults) {
      results[url] = blur;
    }
  }

  return results;
}
