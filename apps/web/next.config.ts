import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gidl/ui"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.midjourney.com" },
      { hostname: "i.pinimg.com" },
    ],
  },
};

export default nextConfig;
