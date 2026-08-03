import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { collections, getCollection } from "@/lib/gallery";
import { getRegistryItem } from "@/lib/registry";
import { ComponentCard } from "@/components/component-card";
import { NodeArt } from "@/components/node-art";

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: slug } = await props.params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return { title: collection.title, description: collection.description };
}

export default async function CollectionPage(props: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: slug } = await props.params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <main className="px-6 pt-12 pb-24 max-w-5xl mx-auto">
      <Link
        href="/docs"
        className="inline-flex items-center gap-1 text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-6"
      >
        <ArrowLeft className="w-3 h-3" /> Collections
      </Link>
      <div className="max-w-xl mb-10">
        <h1 className="text-[24px] font-bold tracking-tight">
          {collection.title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {collection.description}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {collection.components.map((name) => {
          const item = getRegistryItem(name);
          if (!item) return null;
          return (
            <ComponentCard
              key={name}
              href={`/docs/${collection.slug}/${name}`}
              title={item.title}
              preview={<NodeArt seed={name} className="w-28 h-auto" />}
            />
          );
        })}
      </div>
    </main>
  );
}
