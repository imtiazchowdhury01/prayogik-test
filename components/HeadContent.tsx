export default function HeadContent() {
  return (
    <>
      {/* Google Search Console */}
      <meta
        name="google-site-verification"
        content={process.env.NEXT_PUBLIC_GOOGLE_META_TAG_CONTENT}
      />

      {/* Resource hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* Preload custom font */}
      <link
        rel="preload"
        href="/fonts/noto-serif-bengali.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
}
