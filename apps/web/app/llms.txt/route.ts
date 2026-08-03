import { collections } from "@/lib/gallery";
import { getRegistryItem } from "@/lib/registry";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

export const dynamic = "force-static";

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export async function GET() {
  const lines: string[] = [
    "# Gidl",
    "",
    "> Animated UI components recreated from inspiration, browsable by collection and installable via CLI.",
    "",
    `Install any component: \`npx use-gidl add <name>\` or \`npx shadcn@latest add heysolomon/gidl/<name>\`.`,
    "",
    "## Docs",
    "",
    `- [Collections overview](${SITE_URL}/docs): Browse all component collections.`,
    "",
  ];

  for (const collection of collections) {
    lines.push(`## ${collection.title}`, "");
    for (const name of collection.components) {
      const item = getRegistryItem(name);
      if (!item) continue;
      const description = stripMarkdownLinks(item.description);
      lines.push(
        `- [${item.title}](${SITE_URL}/docs/${collection.slug}/${name}): ${description}`
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
