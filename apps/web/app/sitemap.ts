import type { MetadataRoute } from "next";
import { getDocsNavItems } from "@/lib/registry-meta";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/docs`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = getDocsNavItems().map(
    (item) => ({
      url: `${SITE_URL}/docs/components/${item.name}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [...staticRoutes, ...componentRoutes];
}
