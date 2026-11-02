import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Link previews are images from /api/og, and X won't fetch an image
      // that robots.txt blocks.
      allow: ["/", "/api/og"],
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
