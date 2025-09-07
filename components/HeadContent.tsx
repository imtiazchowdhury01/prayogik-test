export default function HeadContent() {
  return (
    <head>
      {/* Resource hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="preload"
        href="/fonts/noto-serif-bengali.ttf"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </head>
  );
}
