import type { RegistryFileContent, RegistryItem } from "@/lib/registry";

export function buildComponentMarkdown(
  item: RegistryItem,
  files: RegistryFileContent[] | null
): string {
  const lines: string[] = [
    `# ${item.title}`,
    "",
    item.description,
    "",
    "## Installation",
    "",
    "```bash",
    `npx use-gidl add ${item.name}`,
    "```",
    "",
  ];

  if (files?.length) {
    lines.push("## Code", "");
    for (const file of files) {
      lines.push(`### ${file.path}`, "", "```tsx", file.content.trimEnd(), "```", "");
    }
  }

  return lines.join("\n");
}
