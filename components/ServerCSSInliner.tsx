import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export default function ServerCSSInliner() {
  if (process.env.NODE_ENV !== "production") return null;

  try {
    const cssDir = join(process.cwd(), ".next/static/css");
    if (!existsSync(cssDir)) return null;

    const files = readdirSync(cssDir).filter((f) => f.endsWith(".css"));

    let inlineCSS = "";
    let preloadLinks = "";

    files.forEach((file) => {
      const filePath = join(cssDir, file);
      const size = statSync(filePath).size;
      const content = readFileSync(filePath, "utf8");

      if (size <= 20 * 1024) {
        // ✅ Inline critical/small CSS
        inlineCSS += `<style>${content}</style>\n`;
      } else {
        // ✅ Preload + async-load large CSS
        preloadLinks += `
          <link rel="preload" href="/_next/static/css/${file}" as="style" />
          <link rel="stylesheet" href="/_next/static/css/${file}" media="print" onload="this.media='all'" />
          <noscript><link rel="stylesheet" href="/_next/static/css/${file}" /></noscript>
        `;
      }
    });

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: inlineCSS + preloadLinks,
        }}
      />
    );
  } catch (err) {
    console.error("Failed to inline CSS:", err);
    return null;
  }
}