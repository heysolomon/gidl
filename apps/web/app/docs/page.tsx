import { getAllRegistryItems } from "@/lib/registry";
import { JsonLd } from "@/components/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

export const metadata = {
  title: "Welcome",
  description: "Why gidl exists and how it came to be.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsOverviewPage() {
  const items = getAllRegistryItems();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Welcome",
    description: "Why gidl exists and how it came to be.",
    url: `${SITE_URL}/docs`,
    hasPart: items.map((item) => ({
      "@type": "SoftwareSourceCode",
      name: item.title,
      description: item.description,
      url: `${SITE_URL}/docs/components/${item.name}`,
    })),
  };

  return (
    <main className="pb-24">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="text-[24px] font-bold tracking-tight">
          Glad you found my work
        </h1>
        <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          <p>Not gonna lie, I didn&apos;t plan to build a library.</p>
          <p>
            I just wanted a{" "}
            <a
              href="https://playground.solomonakuson.com/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              playground
            </a>
            . Somewhere to recreate animations I kept seeing on X, poke at
            products I loved, and rebuild little pieces of them just to see if I
            could.
          </p>
          <p>
            So I built one. Dropped the pieces in. Figured a few people might
            poke around and tell me what sucked.
          </p>
          <p>
            Then I posted a couple of components on X. One of them, the Collins
            Carousel, had lots of impressions.
          </p>
          <p>
            Someone even asked where to grab it. I wasn&apos;t even expecting
            that.
          </p>
          <p>
            It&apos;s sitting in the showcase on the home page now. That made
            this feel less like my thing and more like something worth actually
            building out, something other people could use.
          </p>
          <p>
            So here we are. What started as a playground for myself is turning
            into a component library you can use in your own projects.
          </p>
          <p>Not just poke around in it. Actually ship with it.</p>
          <p>
            If you&apos;ve been rocking with this, a follow on{" "}
            <a
              href="https://x.com/heysolomon"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              X
            </a>{" "}
            means a lot.
          </p>
          <p>More coming.</p>
        </div>
        <p
          className="mt-6 text-[20px] text-neutral-700 dark:text-neutral-300"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          with love, Solomon :)
        </p>
      </div>
    </main>
  );
}
