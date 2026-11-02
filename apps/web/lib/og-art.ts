export interface OgArt {
  /** File name in public/art. */
  file: string;
  /** Short handwritten credit. The full one is on the component's docs page. */
  caption: string;
}

const HIROSHIGE: OgArt = {
  file: "yokkaichi-mie-river.jpg",
  caption: "Hiroshige, c. 1833",
};

const OG_ART: Record<string, OgArt> = {
  "animated-tabs": {
    file: "kiso-mountains-in-snow.jpg",
    caption: "Hiroshige, 1857",
  },
  "collins-carousel": {
    file: "flowers-in-a-glass.jpg",
    caption: "Bosschaert, 1606",
  },
  "expanding-gallery": {
    file: "low-tide-at-pourville.jpg",
    caption: "Monet, 1882",
  },
  "flip-cards": {
    file: "saz-leaf-tile.jpg",
    caption: "Iznik tile, 1500s",
  },
};

// Components with no artwork of their own share the piece on the docs welcome
// note, where it's credited in full.
export const getOgArt = (name: string | null) =>
  (name && OG_ART[name]) || HIROSHIGE;
