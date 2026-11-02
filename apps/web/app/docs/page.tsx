import Image from "next/image";
import { getDocsNavItems } from "@/lib/registry-meta";
import { artworkCredits } from "@/lib/artwork-credits";
import { JsonLd } from "@/components/json-ld";
import { createInk } from "./note-ink";
import { NoteIntro, Sticker } from "./note-sticker";
import styles from "./note.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

export const metadata = {
  title: "Welcome",
  description: "Why gidl exists and how it came to be.",
  alternates: {
    canonical: "/docs",
  },
};

// The sheet lands first, and the words start soaking in before it has fully
// settled, so the two read as one arrival rather than a queue.
const INK_STARTS_AT = 180;

const NOTE_ART = [
  artworkCredits["animated-tabs"]?.[0],
  artworkCredits["collins-carousel"]?.[0],
  artworkCredits["flip-cards"]?.[2],
].filter((credit) => credit !== undefined);

export default function DocsOverviewPage() {
  const items = getDocsNavItems();
  const ink = createInk(INK_STARTS_AT);

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
        <article className={styles.note}>
          <div className={styles.band} aria-hidden />
          <div className={styles.sheet} aria-hidden />
          <div className={styles.writing}>
            <h1 className={styles.title}>
              {ink.write("Glad you found my work")}
              <svg
                className={styles.titleLine}
                viewBox="0 0 400 10"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  className={styles.drawn}
                  style={ink.at()}
                  pathLength={1}
                  d="M2 6c58-4 118-5 176-3 66 2 132 1 220-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </h1>
            {ink.rest()}

            <figure
              className={`${styles.float} ${styles.placed} ${styles.print} ${styles.wide}`}
              style={ink.at(120)}
            >
              <span className={styles.tape} aria-hidden />
              <Image
                src="/art/yokkaichi-mie-river.jpg"
                alt="Hiroshige's woodblock print of a windswept river crossing at Yokkaichi"
                width={200}
                height={133}
              />
            </figure>

            <p>
              {ink.write("Not gonna lie, I didn't plan to build a library.")}
            </p>
            {ink.rest()}
            <p>
              {ink.write(
                "I just wanted a playground. Somewhere to recreate animations I kept seeing on X, poke at products I loved, and rebuild little pieces of them just to see if I could."
              )}
            </p>
            {ink.rest()}
            <p>
              {ink.write(
                "So I built one. Dropped the pieces in. Figured a few people might poke around and tell me what sucked."
              )}
            </p>
            {ink.rest()}

            <figure
              className={`${styles.float} ${styles.placed} ${styles.print} ${styles.tall}`}
              style={ink.at()}
            >
              <svg
                className={styles.clip}
                viewBox="0 0 22 62"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 16v32a6 6 0 0 0 12 0V10a8 8 0 0 0-16 0v38"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className={styles.arrow}
                viewBox="0 0 70 44"
                fill="none"
                aria-hidden
              >
                <path
                  className={styles.drawn}
                  style={ink.at(420)}
                  pathLength={1}
                  d="M66 6C44 2 22 12 8 36M8 36l-3-11M8 36l11-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Image
                src="/art/flowers-in-a-glass.jpg"
                alt="Bosschaert's painting of a bouquet in a glass vase"
                width={124}
                height={148}
              />
              <figcaption className={styles.caption}>
                from the Carousel
              </figcaption>
            </figure>

            <p>
              {ink.write(
                "Then I posted a couple of components on X. One of them, the "
              )}
              <span className={styles.together}>
                <span className={styles.circled}>
                  {ink.write("Collins Carousel")}
                  <svg
                    className={styles.circle}
                    viewBox="0 0 200 40"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      className={styles.drawn}
                      style={ink.at(60)}
                      pathLength={1}
                      d="M30 8C70 1 150 1 186 12c18 8 6 20-30 24-48 5-118 4-144-8C-6 18 18 5 62 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                {ink.write(",")}
              </span>{" "}
              {ink.write("had lots of impressions.")}
            </p>
            {ink.rest()}
            <p>
              {ink.write(
                "Someone even asked where to grab it. I wasn't even expecting that."
              )}
            </p>
            {ink.rest()}
            <p>
              {ink.write(
                "That made this feel less like my thing and more like something worth actually building out, something other people could use."
              )}
            </p>
            {ink.rest()}
            <p>
              {ink.write(
                "So here we are. What started as a playground for myself is turning into a component library you can use in your own projects."
              )}
            </p>
            {ink.rest()}

            <div className={`${styles.float} ${styles.vellumStack}`}>
              <Sticker
                className={`${styles.placed} ${styles.vellumPrint}`}
                style={ink.at()}
              >
                <Image
                  src="/art/iznik-wall-tile.jpg"
                  alt="An Iznik wall tile with blue tulips and carnations"
                  width={114}
                  height={152}
                  draggable={false}
                />
              </Sticker>
              <Sticker
                className={`${styles.placed} ${styles.vellum}`}
                style={ink.at(160)}
              >
                <p>Not just poke around in it. Actually ship with it.</p>
              </Sticker>
            </div>

            <Sticker
              className={`${styles.float} ${styles.placed} ${styles.sticky}`}
              style={ink.at(320)}
            >
              <p>
                If you&apos;ve been rocking with this, a follow on{" "}
                <a
                  href="https://x.com/heysolomon"
                  target="_blank"
                  rel="noreferrer"
                  draggable={false}
                >
                  X
                </a>{" "}
                means a lot.
              </p>
            </Sticker>

            <p>
              {ink.write(
                "I'm already working on a couple new components to add in. This is just the start."
              )}
            </p>
            {ink.rest()}
            <p className={styles.signature}>
              {ink.sign("with love, Solomon :)")}
            </p>
          </div>
        </article>

        <p className="mx-auto mt-8 max-w-155 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
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
