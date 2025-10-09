// @ts-nocheck

// TikTok Pixel ID from environment variable
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

// Track a page view
export const pageview = () => {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.page();
  }
};

// Track a custom event
// https://ads.tiktok.com/marketing_api/docs?id=1701890979375106
export const event = (name, options = {}) => {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(name, options);
  }
};
