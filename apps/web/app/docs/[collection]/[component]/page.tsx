import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  collections,
  getCollection,
  getCollectionForComponent,
} from "@/lib/gallery";
import { getRegistryItem, getComponentFiles } from "@/lib/registry";
import { registryComponents } from "@/lib/registry-components";
import { ComponentPreview } from "@/components/component-preview";
import { PreviewCodeTabs } from "@/components/preview-code-tabs";
import { CodeBlock } from "@/components/code-block";
import { CopyLine } from "@/components/copy-line";
import { JsonLd } from "@/components/json-ld";
import { renderDescriptionWithLinks } from "@/lib/render-markdown-links";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

export function generateStaticParams() {
  return collections.flatMap((c) =>
    c.components.map((component) => ({ collection: c.slug, component }))
  );
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string; component: string }>;
}) {
  const { collection, component } = await props.params;
  const item = getRegistryItem(component);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: {
      canonical: `/docs/${collection}/${component}`,
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
  params: Promise<{ collection: string; component: string }>;
}) {
  const { collection: slug, component: name } = await props.params;
  const collection = getCollection(slug);
  const item = getRegistryItem(name);
  const actualCollection = getCollectionForComponent(name);

  if (!collection || !item || actualCollection?.slug !== slug) notFound();

  const Live = registryComponents[name];
  const files = await getComponentFiles(name);

  const pageUrl = `${SITE_URL}/docs/${collection.slug}/${name}`;
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
          {
            "@type": "ListItem",
            position: 2,
            name: collection.title,
            item: `${SITE_URL}/docs/${collection.slug}`,
          },
          { "@type": "ListItem", position: 3, name: item.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="px-6 pt-12 pb-24 max-w-3xl mx-auto">
      <JsonLd data={jsonLd} />
      <Link
        href={`/docs/${collection.slug}`}
        className="inline-flex items-center gap-1 text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4"
      >
        <ArrowLeft className="w-3 h-3" /> {collection.title}
      </Link>

      <h1 className="text-[22px] font-bold tracking-tight">{item.title}</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xl">
        {renderDescriptionWithLinks(item.description)}
      </p>

      <div className="mt-8">
        <h2 className="text-[14px] font-semibold tracking-tight">
          Installation
        </h2>
        <div className="mt-3">
          <CopyLine text={`npx use-gidl add ${item.name}`} />
        </div>
        <ol className="mt-4 space-y-1.5 text-[12.5px] text-neutral-500 dark:text-neutral-400 list-decimal list-inside">
          <li>Install the dependencies listed in the code below.</li>
          <li>Copy and paste the code into your project.</li>
          <li>Update the import paths to match your project setup.</li>
        </ol>
      </div>

      <div className="mt-10">
        <PreviewCodeTabs
          preview={
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden">
              <ComponentPreview className="min-h-[440px]">
                {Live ? <Live /> : null}
              </ComponentPreview>
            </div>
          }
          code={files ? <CodeBlock files={files} /> : null}
        />
      </div>
    </main>
  );
}
