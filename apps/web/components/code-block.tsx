import { highlightFile } from "@/lib/highlight";
import { CodeBlockClient } from "@/components/code-block-client";
import type { RegistryFileContent } from "@/lib/registry";

export async function CodeBlock({ files }: { files: RegistryFileContent[] }) {
  const highlighted = await Promise.all(
    files.map(async (file) => ({
      path: file.path,
      content: file.content,
      html: await highlightFile(file.path, file.content),
    }))
  );

  return <CodeBlockClient files={highlighted} />;
}
