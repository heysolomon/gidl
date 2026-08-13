"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function DocsToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-24">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600 mb-3">
          On This Page
        </p>
        <ul className="space-y-2 border-l border-neutral-200 dark:border-neutral-800">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: (heading.level - 2) * 12 + 12 }}>
              <a
                href={`#${heading.id}`}
                className={`block -ml-px border-l pl-3 text-[12.5px] transition-colors ${
                  activeId === heading.id
                    ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
