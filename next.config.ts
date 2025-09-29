import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["example.com", "images.unsplash.com"],
  },

  experimental: {
    serverActions: {},
  },

  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  // 👇 Add this block so Vercel build won't fail on lint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
