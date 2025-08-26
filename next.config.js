/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  transpilePackages: [],

  experimental: {
    optimizePackageImports: ["plaiceholder"],
    optimizeCss: true,
  },

  // CRITICAL: Enhanced images configuration - THIS IS THE KEY FIX
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
    minimumCacheTTL: 86400,
    formats: ["image/avif", "image/webp"], // AVIF first for 30% better compression
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",

    // THESE ARE THE CRITICAL ADDITIONS:
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750],
    // quality: 75, // Optimal quality/size balance
  },

  webpack: (config, { buildId, dev, isServer }) => {
    config.module.rules.push({
      test: /\.html$/,
      use: {
        loader: "html-loader",
      },
    });

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
    };

    config.plugins.push(
      new webpack.EnvironmentPlugin({
        BUILD_ID: buildId,
        NODE_ENV: process.env.NODE_ENV,
      })
    );

    // if (!dev) {
    //   config.optimization.splitChunks = {
    //     chunks: "all",
    //     maxSize: 244 * 1024,
    //   };

    //   config.optimization.minimizer.forEach((plugin) => {
    //     if (plugin.constructor.name === "TerserPlugin") {
    //       plugin.options.terserOptions = {
    //         ...plugin.options.terserOptions,
    //         compress: {
    //           ...plugin.options.terserOptions?.compress,
    //           drop_console: true,
    //         },
    //       };
    //     }
    //   });
    // }

    return config;
  },
};

module.exports = nextConfig;
