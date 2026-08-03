import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gidl",
    short_name: "Gidl",
    description: "Beautiful animation primitives for engineers and designers.",
    start_url: "/",
    display: "standalone",
    background_color: "#010101",
    theme_color: "#010101",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
