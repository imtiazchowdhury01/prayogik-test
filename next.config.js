/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Enable only when needed for debugging
  transpilePackages: [], // Add problematic ESM packages here if needed
  // serverRuntimeConfig: {
  //   // Server-side configuration
  //   bodyParser: {
  //     sizeLimit: process.env.BODY_PARSER_MAX_LIMIT,
  //   },
  // },
  // Your existing images configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prayogik-files-bucket.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 86400, // 24 hours cache
    formats: ["image/webp"], // Auto-convert to modern formats
  },

  webpack: (config, { buildId, dev, isServer }) => {
    // Your existing HTML loader
    config.module.rules.push({
      test: /\.html$/,
      use: {
        loader: "html-loader",
      },
    });

    // Add SVG handling (recommended addition)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Improved module aliasing
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
    };

    // Environment variables injection
    config.plugins.push(
      new webpack.EnvironmentPlugin({
        BUILD_ID: buildId,
        NODE_ENV: process.env.NODE_ENV,
      })
    );

    // Production-only optimizations
    if (!dev) {
      // Improved chunk splitting
      config.optimization.splitChunks = {
        chunks: "all",
        maxSize: 244 * 1024, // 244KB chunk size
      };

      // Remove console logs in production
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.constructor.name === "TerserPlugin") {
          plugin.options.terserOptions = {
            ...plugin.options.terserOptions,
            compress: {
              ...plugin.options.terserOptions?.compress,
              drop_console: true,
            },
          };
        }
      });
    }

    return config;
  },
};

module.exports = nextConfig;