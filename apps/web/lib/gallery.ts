import registry from "../../../registry.json";

export interface GalleryCollection {
  slug: string;
  title: string;
  description: string;
  components: string[];
}

export const collections: GalleryCollection[] = [
  {
    slug: "sliders",
    title: "Sliders",
    description: "Drag-driven carousels and image sliders.",
    components: ["collins-carousel"],
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "Animated tab and segmented-control interactions.",
    components: ["animated-tabs"],
  },
  {
    slug: "cards",
    title: "Cards",
    description: "Flip, hover, and reveal card interactions.",
    components: ["flip-cards"],
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionForComponent(name: string) {
  return collections.find((c) => c.components.includes(name));
}

if (process.env.NODE_ENV !== "production") {
  const registryNames = new Set(registry.items.map((item) => item.name));
  const collectedNames = collections.flatMap((c) => c.components);

  for (const name of collectedNames) {
    if (!registryNames.has(name)) {
      console.warn(
        `[gallery] "${name}" is listed in a collection but missing from registry.json`
      );
    }
  }
  for (const name of registryNames) {
    if (!collectedNames.includes(name)) {
      console.warn(
        `[gallery] "${name}" exists in registry.json but isn't assigned to a collection`
      );
    }
  }
}
