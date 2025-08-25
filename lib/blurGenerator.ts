/* 
size: 4 (default) - Very blurry
size: 8 - Less blurry
size: 16 - Moderate blur
size: 32 - Light blur
size: 64 - Very light blur
size: 128 - Minimal blur
*/

import { getPlaiceholder } from "plaiceholder";

// Server-side blur generation (no caching needed since it runs once per request)
export async function generateBlurDataURL(imageUrl: string): Promise<string | null> {
  if (!imageUrl) return null;
  
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.warn(`Failed to fetch image for blur generation: ${res.status} ${res.statusText}`);
      return getFallbackBlurDataURL();
    }
    
    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer), {
      size: 64, // Higher size = less blur (default: 4)
      format: ['webp'], // Format preference
    });
    
    return base64;
  } catch (error) {
    console.error('Error generating blur data:', error);
    return getFallbackBlurDataURL();
  }
}

// Fallback blur placeholder (simple gray blur)
function getFallbackBlurDataURL(): string {
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
}

// Generate blur data for multiple images in parallel
export async function generateMultipleBlurDataURLs(imageUrls: string[]): Promise<Record<string, string | null>> {
  const blurPromises = imageUrls.map(async (url) => {
    const blur = await generateBlurDataURL(url);
    return [url, blur] as const;
  });
  
  const results = await Promise.all(blurPromises);
  return Object.fromEntries(results);
}