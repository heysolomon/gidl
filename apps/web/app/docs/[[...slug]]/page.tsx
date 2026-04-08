import { source } from "@/lib/source";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";

function renderDescriptionWithLinks(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 transition-opacity hover:opacity-70"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length === 0 ? text : nodes;
}

function getFlatPages(tree: PageTree.Root): Array<{ name: ReactNode; url: string }> {
  const pages: Array<{ name: ReactNode; url: string }> = [];
  function traverse(node: PageTree.Node) {
    if (node.type === "folder") {
      if (node.index) traverse(node.index);
      node.children.forEach(traverse);
    } else if (node.type === "page" && !node.external) {
      pages.push({ name: node.name, url: node.url });
    }
  }
  tree.children.forEach(traverse);
  return pages;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  const flatPages = getFlatPages(source.pageTree as PageTree.Root);
  const currentIdx = flatPages.findIndex((p) => p.url === page.url);
  const footerItems = {
    previous: currentIdx > 0 ? flatPages[currentIdx - 1] : undefined,
    next:
      currentIdx < flatPages.length - 1 ? flatPages[currentIdx + 1] : undefined,
  };

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{ items: footerItems }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && (
        <DocsDescription>
          {renderDescriptionWithLinks(page.data.description)}
        </DocsDescription>
      )}
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      images: [`/api/og?title=${encodeURIComponent(page.data.title)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [`/api/og?title=${encodeURIComponent(page.data.title)}`],
    },
  };
}
