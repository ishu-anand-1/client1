import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Enables React strict mode (helps catch potential bugs)
  reactStrictMode: true,

  // ✅ Use SWC minifier (faster builds)
  swcMinify: true,

  // ✅ Configure allowed image domains
  images: {
    domains: ["example.com", "images.unsplash.com"],
  },

  // ✅ Optional: enable experimental features
  experimental: {
    serverActions: true,
  },

  // ✅ Output standalone build (useful for Docker/production)
  output: "standalone",
};

export default nextConfig;
