// /*
// size: 4 (default) - Very blurry
// size: 8 - Less blurry
// size: 16 - Moderate blur
// size: 32 - Light blur
// size: 64 - Very light blur
// size: 128 - Minimal blur
// */

// import { getPlaiceholder } from "plaiceholder";

// // Server-side blur generation (no caching needed since it runs once per request)
// export async function generateBlurDataURL(imageUrl: string): Promise<string | null> {
//   if (!imageUrl) return null;

//   try {
//     const res = await fetch(imageUrl);
//     if (!res.ok) {
//       console.warn(`Failed to fetch image for blur generation: ${res.status} ${res.statusText}`);
//       return getFallbackBlurDataURL();
//     }

//     const buffer = await res.arrayBuffer();
//     const { base64 } = await getPlaiceholder(Buffer.from(buffer), {
//       size: 64, // Higher size = less blur (default: 4)
//       format: ['webp'], // Format preference
//     });

//     return base64;
//   } catch (error) {
//     console.error('Error generating blur data:', error);
//     return getFallbackBlurDataURL();
//   }
// }

// // Fallback blur placeholder (simple gray blur)
// function getFallbackBlurDataURL(): string {
//   return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
// }

// // Generate blur data for multiple images in parallel
// export async function generateMultipleBlurDataURLs(imageUrls: string[]): Promise<Record<string, string | null>> {
//   const blurPromises = imageUrls.map(async (url) => {
//     const blur = await generateBlurDataURL(url);
//     return [url, blur] as const;
//   });

//   const results = await Promise.all(blurPromises);
//   return Object.fromEntries(results);
// }

/* 
size: 4 (default) - Very blurry
size: 8 - Less blurry
size: 16 - Moderate blur
size: 32 - Light blur
size: 64 - Very light blur
size: 128 - Minimal blur
*/
import { getPlaiceholder } from "plaiceholder";

// Configuration for fetch timeout and retry logic
const FETCH_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 2,
  retryDelay: 1000, // 1 second
};

// Server-side blur generation with improved error handling
export async function generateBlurDataURL(
  imageUrl: string
): Promise<string | null> {
  if (!imageUrl) return null;

  try {
    const buffer = await fetchImageWithRetry(imageUrl);
    if (!buffer) {
      console.warn(`Failed to fetch image after retries: ${imageUrl}`);
      return getFallbackBlurDataURL();
    }

    const { base64 } = await getPlaiceholder(Buffer.from(buffer), {
      size: 64, // Higher size = less blur (default: 4)
      format: ["webp"], // Format preference
    });

    return base64;
  } catch (error) {
    console.error("Error generating blur data for", imageUrl, ":", error);
    return getFallbackBlurDataURL();
  }
}

// Fetch with timeout and retry logic
async function fetchImageWithRetry(
  imageUrl: string
): Promise<ArrayBuffer | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= FETCH_CONFIG.retries + 1; attempt++) {
    try {
      // console.log(`Fetching image (attempt ${attempt}): ${imageUrl}`);

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
      // console.log(
      //   `Successfully fetched image: ${imageUrl} (${buffer.byteLength} bytes)`
      // );
      return buffer;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed for ${imageUrl}:`, error);

      // Don't retry on the last attempt
      if (attempt <= FETCH_CONFIG.retries) {
        // console.log(`Retrying in ${FETCH_CONFIG.retryDelay}ms...`);
        await new Promise((resolve) =>
          setTimeout(resolve, FETCH_CONFIG.retryDelay)
        );
      }
    }
  }

  console.error(`All attempts failed for ${imageUrl}:`, lastError);
  return null;
}

// Fallback blur placeholder (simple gray blur)
function getFallbackBlurDataURL(): string {
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
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

    // console.log(
    //   `Processed batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(
    //     imageUrls.length / concurrency
    //   )}`
    // );
  }

  return results;
}

// Alternative: Generate blur with local file fallback
export async function generateBlurDataURLWithFallback(
  imageUrl: string,
  localFallbackPath?: string
): Promise<string | null> {
  // Try the original URL first
  let result = await generateBlurDataURL(imageUrl);
  if (result) return result;

  // If we have a local fallback, try that
  if (localFallbackPath) {
    try {
      const fs = await import("fs/promises");
      const buffer = await fs.readFile(localFallbackPath);
      const { base64 } = await getPlaiceholder(buffer, {
        size: 64,
        format: ["webp"],
      });
      return base64;
    } catch (error) {
      console.warn("Local fallback also failed:", error);
    }
  }

  return getFallbackBlurDataURL();
}

// Utility to validate if URL is accessible before processing
export async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for validation

    const res = await fetch(imageUrl, {
      method: "HEAD", // Only check headers, don't download
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}
