import type { ArtworkCredit } from "@/lib/artwork-credits";

export function ArtworkCredits({ credits }: { credits: ArtworkCredit[] }) {
  return (
    <section className="mt-10">
      <h2
        id="artwork"
        className="text-[14px] font-semibold tracking-tight scroll-mt-24"
      >
        Artwork
      </h2>
      <ul className="mt-3 flex flex-col gap-3">
        {credits.map((credit) => (
          <li key={credit.url} className="text-[13px] leading-relaxed">
            <a
              href={credit.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline decoration-neutral-300 underline-offset-2 transition-colors hover:decoration-neutral-500 dark:decoration-neutral-700 dark:hover:decoration-neutral-500"
            >
              {credit.title}
            </a>
            <span className="block text-neutral-500 dark:text-neutral-400">
              {[credit.artist, credit.date, credit.museum, credit.license]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
