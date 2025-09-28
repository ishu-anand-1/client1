import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Enables React strict mode (helps catch potential bugs)
  reactStrictMode: true,

  // NOTE: swcMinify is deprecated in Next.js 15 and has been removed.
  // The SWC minifier is now used by default.

  // ✅ Configure allowed image domains
  images: {
    domains: ["example.com", "images.unsplash.com"],
  },

  // ✅ Optional: enable experimental features
  experimental: {
    // FIX: Changed 'serverActions: true' to 'serverActions: {}'
    // to resolve the warning about receiving a boolean instead of an object.
    serverActions: {},
  },

  // ✅ Output standalone build (useful for Docker/production)
  output: "standalone",
};

export default nextConfig;
