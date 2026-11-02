import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gidl/ui"],
  reactStrictMode: true,
  // The OG route picks its artwork by name at runtime, so the trace can't see it.
  outputFileTracingIncludes: {
    "/api/og": ["./public/art/**/*", "./public/og/**/*"],
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.midjourney.com" },
      { hostname: "i.pinimg.com" },
    ],
  },
};

export default nextConfig;
