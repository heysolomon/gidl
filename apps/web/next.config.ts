import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

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

export default withMDX(nextConfig);
