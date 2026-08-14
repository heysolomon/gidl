import { getComponentFiles, getRegistryItem } from "@/lib/registry";
import { isRegistryItemVisible } from "@/lib/registry-meta";
import { buildComponentMarkdown } from "@/lib/docs-markdown";

export async function GET(
  _request: Request,
  props: { params: Promise<{ name: string }> }
) {
  const { name } = await props.params;
  const item = getRegistryItem(name);
  if (!item || !isRegistryItemVisible(name)) {
    return new Response("Not found", { status: 404 });
  }

  const files = await getComponentFiles(name);
  const markdown = buildComponentMarkdown(item, files);

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
