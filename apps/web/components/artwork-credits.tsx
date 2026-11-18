"use client";

import { useState } from "react";
import type { ArtworkCredit } from "@/lib/artwork-credits";

// Longer lists show this many and fold the rest behind a button. A list only
// one or two longer than this shows in full, since a button for one more line
// isn't worth it.
const VISIBLE = 4;
const FOLD_FROM = VISIBLE + 2;

export function ArtworkCredits({ credits }: { credits: ArtworkCredit[] }) {
  const [open, setOpen] = useState(false);
  const folds = credits.length >= FOLD_FROM;

  return (
    <section className="mt-10">
      <h2
        id="artwork"
        className="text-[14px] font-semibold tracking-tight scroll-mt-24"
      >
        Artwork
      </h2>
      <ul id="artwork-list" className="mt-3 flex flex-col gap-3">
        {credits.map((credit, index) => (
          <li
            key={credit.url}
            // Folded credits stay in the page, so every work is still credited
            // in its HTML.
            hidden={folds && !open && index >= VISIBLE}
            className="text-[13px] leading-relaxed"
          >
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
      {folds && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls="artwork-list"
          onClick={() => setOpen((value) => !value)}
          className="mt-3 cursor-pointer text-[13px] font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-foreground hover:decoration-neutral-500 dark:text-neutral-400 dark:decoration-neutral-700"
        >
          {open ? "Show fewer" : `Show all ${credits.length} artworks`}
        </button>
      )}
    </section>
  );
}
