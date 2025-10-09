/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  transpilePackages: [],
  compress: true,

  experimental: {
    optimizePackageImports: [
      "plaiceholder",
      "lucide-react",
      "@headlessui/react",
    ],
    optimizeCss: true,
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Enhanced images configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prayogik-files-bucket.s3.us-east-1.amazonaws.com",
      },
    ],
    minimumCacheTTL: 86400, // 24 hours
    formats: ["image/webp", "image/avif"],
    contentDispositionType: "attachment",
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    loader: "default",
    unoptimized: false,
  },

  // Enhanced security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
    // Remove React DevTools in production
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  webpack: (config, { buildId, dev, isServer }) => {
    // HTML loader
    config.module.rules.push({
      test: /\.html$/,
      use: {
        loader: "html-loader",
        options: {
          minimize: !dev,
        },
      },
    });

    // SVG handling
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Path aliases for App Router (no src directory)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@components": path.resolve(__dirname, "components"),
      "@app": path.resolve(__dirname, "app"),
      "@lib": path.resolve(__dirname, "lib"),
      "@utils": path.resolve(__dirname, "utils"),
      "@styles": path.resolve(__dirname, "styles"),
      "@public": path.resolve(__dirname, "public"),
    };

    // Environment variables
    config.plugins.push(
      new webpack.EnvironmentPlugin({
        BUILD_ID: buildId,
        NODE_ENV: process.env.NODE_ENV,
        BUILD_TIME: new Date().toISOString(),
      })
    );

    // Performance hints
    config.performance = {
      hints: process.env.ANALYZE === "true" ? "warning" : false,
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
