import dynamic from "next/dynamic";
import { getDocsNavItems } from "@/lib/registry-meta";
import { artworkCredits } from "@/lib/artwork-credits";
import { JsonLd } from "@/components/json-ld";
import { NoteIntro } from "./note-sticker";
import { NOTE_DEFAULTS, WelcomeNote } from "./welcome-note";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Welcome",
  description: "Why gidl exists and how it came to be.",
  alternates: {
    canonical: "/docs",
  },
};

// Loaded on demand so DialKit and its styles stay out of the production page.
const NoteLab = dynamic(() => import("./note-lab").then((mod) => mod.NoteLab));

const NOTE_ART = [
  artworkCredits["animated-tabs"]?.[0],
  artworkCredits["collins-carousel"]?.[0],
  artworkCredits["flip-cards"]?.[2],
].filter((credit) => credit !== undefined);

export default function DocsOverviewPage() {
  const items = getDocsNavItems();

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
        <NoteIntro />
        {process.env.NODE_ENV === "development" ? (
          <NoteLab />
        ) : (
          <WelcomeNote options={NOTE_DEFAULTS} />
        )}

        <p className="mx-auto mt-20 max-w-155 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Art on this note:{" "}
          {NOTE_ART.map((credit, index) => (
            <span key={credit.url}>
              {index > 0 && " · "}
              <a
                href={credit.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                {credit.title}
              </a>
              , {credit.artist}, {credit.museum}, {credit.license}
            </span>
          ))}
        </p>
      </div>
    </main>
  );
}
