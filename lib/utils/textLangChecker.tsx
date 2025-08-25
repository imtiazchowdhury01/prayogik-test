export function textLangChecker(text: string) {
  if (!text) return;
  const bengaliRegex = /[\u0980-\u09FF]+/g;
  const englishRegex = /[A-Za-z0-9]+/g;

  const segments = [];
  let i = 0;

  while (i < text?.length) {
    const bengaliMatch = text.slice(i).match(bengaliRegex);
    const englishMatch = text.slice(i).match(englishRegex);

    if (bengaliMatch && text.startsWith(bengaliMatch[0], i)) {
      segments.push({ text: bengaliMatch[0], lang: "bn" });
      i += bengaliMatch[0].length;
    } else if (englishMatch && text.startsWith(englishMatch[0], i)) {
      segments.push({ text: englishMatch[0], lang: "en" });
      i += englishMatch[0].length;
    } else {
      // Push any other characters as they are
      segments.push({ text: text[i], lang: "other" });
      i++;
    }
  }

  // Wrap each segment in a <span> with the appropriate font class
  return segments.map((segment, index) => (
    <span
      key={index}
      className={`${segment.lang === "en" && "font-secondary"}`}
    >
      {segment.text}
    </span>
  ));
}
