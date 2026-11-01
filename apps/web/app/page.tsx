import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ComponentGridCard } from "@/components/component-grid-card";
import { getDocsNavItems } from "@/lib/registry-meta";

export default function Home() {
  const items = getDocsNavItems();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <SiteHeader />

      {/* Hero */}
      <main className="flex flex-col items-center text-center px-6 pt-20 pb-14 max-w-xl mx-auto">
        <h1 className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight">
          Animated components
          <br />I recreate from inspiration
        </h1>
        <p className="shimmer shimmer-duration-1200 shimmer-color-current/10 mt-4 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-[420px]">
          found around the web, rebuilt here for you to explore.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/docs"
            className="flex items-center gap-1.5 text-[12px] font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3.5 py-1.5 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Browse Components <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </main>

      {/* Component grid */}
      <section className="component-grid isolate pb-24">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pt-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {items.map((item) => (
            <ComponentGridCard
              key={item.name}
              name={item.name}
              title={item.title}
              description={item.description}
              isNew={item.isNew}
              isDraft={!item.published}
            />
          ))}
        </div>
      </section>

      {/* Peerlist badge */}
      <section className="flex justify-center px-6 pb-16">
        <a
          href="https://peerlist.io/heysolomon/project/gidl"
          target="_blank"
          rel="noreferrer"
          className="inline-block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://peerlist.io/api/v1/projects/embed/PRJHJKNO6EKEPB66MCMELA7AGJ7DN7?showUpvote=true&theme=light"
            alt="Gidl on Peerlist"
            className="h-18 w-auto block dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://peerlist.io/api/v1/projects/embed/PRJHJKNO6EKEPB66MCMELA7AGJ7DN7?showUpvote=true&theme=dark"
            alt="Gidl on Peerlist"
            className="h-18 w-auto hidden dark:block"
          />
        </a>
      </section>
    </div>
  );
}
