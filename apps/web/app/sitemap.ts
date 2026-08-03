import type { MetadataRoute } from "next";
import { collections } from "@/lib/gallery";

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

  const collectionRoutes: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${SITE_URL}/docs/${collection.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const componentRoutes: MetadataRoute.Sitemap = collections.flatMap(
    (collection) =>
      collection.components.map((name) => ({
        url: `${SITE_URL}/docs/${collection.slug}/${name}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }))
  );

  return [...staticRoutes, ...collectionRoutes, ...componentRoutes];
}
