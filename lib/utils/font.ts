import localFont from "next/font/local";

export const localNotoSerifBengali = localFont({
  src: [
    {
      path: "../../public/fonts/noto-serif-bengali.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "block",
  fallback: ["serif"], // Provide fallbacks
  preload: true,
  variable: "--font-noto-serif-bengali",
  adjustFontFallback: false,
  // declarations: [
  //   { prop: "font-optical-sizing", value: "auto" },
  //   { prop: "font-variation-settings", value: '"wdth" 100' },
  // ],
});
