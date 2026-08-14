import { getDocsNavItems } from "@/lib/registry-meta";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

export const dynamic = "force-static";

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export async function GET() {
  const lines: string[] = [
    "# Gidl",
    "",
    "> Animated UI components recreated from inspiration, installable via CLI.",
    "",
    `Install any component: \`npx use-gidl add <name>\` or \`npx shadcn@latest add heysolomon/gidl/<name>\`.`,
    "",
    "## Docs",
    "",
    `- [Components overview](${SITE_URL}/docs): Browse all components.`,
    "",
    "## Components",
    "",
  ];

  for (const item of getDocsNavItems()) {
    const description = stripMarkdownLinks(item.description);
    lines.push(
      `- [${item.title}](${SITE_URL}/docs/components/${item.name}): ${description}`
    );
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
