import { notFound } from "next/navigation";
import { getRegistryItem, getComponentFiles } from "@/lib/registry";
import {
  getDocsNavItem,
  getDocsNavItems,
  isRegistryItemVisible,
} from "@/lib/registry-meta";
import { registryComponents } from "@/lib/registry-components";
import { ComponentPreview } from "@/components/component-preview";
import { PreviewCodeTabs } from "@/components/preview-code-tabs";
import { CodeBlock } from "@/components/code-block";
import { CopyLine } from "@/components/copy-line";
import { CopyPageMenu } from "@/components/copy-page-menu";
import { JsonLd } from "@/components/json-ld";
import { DocsToc } from "@/components/docs-toc";
import { Pill } from "@/components/pill";
import { renderDescriptionWithLinks } from "@/lib/render-markdown-links";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";
// "View as Markdown" and "Open in v0" should point at whatever origin is actually
// serving the page (localhost in dev), not always the production domain.
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://gidl.dev"
    : "http://localhost:3000");

export function generateStaticParams() {
  return getDocsNavItems().map((item) => ({ name: item.name }));
}

export async function generateMetadata(props: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await props.params;
  const item = getRegistryItem(name);
  if (!item || !isRegistryItemVisible(name)) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: {
      canonical: `/docs/components/${name}`,
    },
    openGraph: {
      title: item.title,
      description: item.description,
      images: [`/api/og?title=${encodeURIComponent(item.title)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [`/api/og?title=${encodeURIComponent(item.title)}`],
    },
  };
}

export default async function ComponentPage(props: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await props.params;
  const item = getRegistryItem(name);
  if (!item || !isRegistryItemVisible(name)) notFound();

  const navItem = getDocsNavItem(item);
  const Live = registryComponents[name];
  const files = await getComponentFiles(name);

  const pageUrl = `${SITE_URL}/docs/components/${name}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        name: item.title,
        description: item.description.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
        url: pageUrl,
        codeRepository: `https://github.com/heysolomon/gidl/blob/main/${item.files[0]?.path ?? ""}`,
        programmingLanguage: "TypeScript",
        author: { "@id": `${SITE_URL}/#person` },
        license: "https://github.com/heysolomon/gidl/blob/main/LICENSE",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Docs",
            item: `${SITE_URL}/docs`,
          },
          { "@type": "ListItem", position: 2, name: item.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="pb-24">
      <JsonLd data={jsonLd} />

      <div className="relative">
        <div className="min-w-0 max-w-3xl mx-auto w-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold tracking-tight">{item.title}</h1>
              {navItem.isNew && <Pill variant="new">New</Pill>}
              {!navItem.published && <Pill variant="draft">Draft</Pill>}
            </div>
            <CopyPageMenu
              markdownPath={`/docs/components/${item.name}/markdown`}
              markdownUrl={`${APP_ORIGIN}/docs/components/${item.name}/markdown`}
              registryUrl={`${APP_ORIGIN}/r/${item.name}.json`}
            />
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xl">
            {renderDescriptionWithLinks(item.description)}
          </p>

          <div className="mt-8">
            <h2 id="installation" className="text-[14px] font-semibold tracking-tight scroll-mt-24">
              Installation
            </h2>
            <div className="mt-3">
              <CopyLine text={`npx use-gidl add ${item.name}`} />
            </div>
          </div>

          <div className="mt-10">
            <PreviewCodeTabs
              preview={
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-border">
                  <ComponentPreview className="min-h-[440px]">
                    {Live ? <Live /> : null}
                  </ComponentPreview>
                </div>
              }
              code={files ? <CodeBlock files={files} /> : null}
            />
          </div>
        </div>

        <div className="hidden xl:block absolute right-0 top-0 w-[200px]">
          <DocsToc
            headings={[{ id: "installation", text: "Installation", level: 2 }]}
          />
        </div>
      </div>
    </main>
  );
}
