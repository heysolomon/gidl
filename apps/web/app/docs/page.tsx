import { collections } from "@/lib/gallery";
import { ComponentCard } from "@/components/component-card";
import { NodeArt } from "@/components/node-art";

export const metadata = {
  title: "Docs",
  description: "Browse components by collection.",
};

export default function DocsOverviewPage() {
  return (
    <main className="px-6 pt-12 pb-24 max-w-5xl mx-auto">
      <div className="max-w-2xl mb-10">
        <h1 className="text-[24px] font-bold tracking-tight">Collections</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Browse by collection, then copy the install command for any component:{" "}
          <code className="font-mono whitespace-nowrap">
            npx use-gidl add &lt;name&gt;
          </code>
          .
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {collections.map((collection) => (
          <ComponentCard
            key={collection.slug}
            href={`/docs/${collection.slug}`}
            title={collection.title}
            preview={<NodeArt seed={collection.slug} className="w-28 h-auto" />}
            badge={`${collection.components.length}`}
          />
        ))}
      </div>
    </main>
  );
}
