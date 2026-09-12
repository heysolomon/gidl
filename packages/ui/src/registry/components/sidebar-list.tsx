"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PanelLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
};

const ITEMS: SidebarItem[] = [
  { id: "1", label: "Canvas 1" },
  { id: "2", label: "Canvas 2" },
  { id: "3", label: "Canvas 3" },
  { id: "4", label: "Canvas 4" },
  { id: "5", label: "Canvas 5" },
];

type Clip = { top: number; bottom: number };

export function SidebarList() {
  const [activeId, setActiveId] = useState<string | null>(ITEMS[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Insets (px) from the indicator track's own top/bottom edges to a row's
  // rect — measured from the DOM, not a hardcoded row height/gap, so this
  // can't drift out of sync with the actual layout the way pixel constants
  // silently did before.
  const [activeClip, setActiveClip] = useState<Clip | null>(null);
  const [hoverClip, setHoverClip] = useState<Clip | null>(null);
  // A hover session that's just starting has no previous position to slide
  // from — sliding it in from clip-path's default (a zero-size point at the
  // track's center) would look like it's flying in from the middle. This
  // stays false until that first position is painted, and resets every time
  // hover fully stops, so re-entering later snaps again too, not just the
  // very first hover ever.
  const [hoverAnimationEnabled, setHoverAnimationEnabled] = useState(false);

  const rowRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  // Both indicators share the exact same box (left-3 right-3 top-0 bottom-3),
  // so either one works as the reference for measuring that box — this one
  // is always mounted, giving a stable ref to measure against.
  const trackRef = useRef<HTMLSpanElement>(null);

  const measure = (id: string | null): Clip | null => {
    const rowEl = id ? rowRefs.current.get(id) : null;
    const trackEl = trackRef.current;
    if (!rowEl || !trackEl) return null;

    const trackRect = trackEl.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();

    return {
      top: rowRect.top - trackRect.top,
      bottom: trackRect.bottom - rowRect.bottom,
    };
  };

  const showHover = hoveredId !== null && hoveredId !== activeId;

  useLayoutEffect(() => {
    setActiveClip(measure(activeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useLayoutEffect(() => {
    if (hoveredId && hoveredId !== activeId) {
      setHoverClip(measure(hoveredId));

      if (!hoverAnimationEnabled) {
        // Let this position paint with no transition first — this fires both
        // on the very first hover and every time hover resumes after fully
        // stopping — then enable it on the next frame so hover-to-hover
        // moves within the same session animate.
        const raf = requestAnimationFrame(() => setHoverAnimationEnabled(true));
        return () => cancelAnimationFrame(raf);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredId, activeId]);

  useLayoutEffect(() => {
    if (!showHover) {
      setHoverAnimationEnabled(false);
    }
  }, [showHover]);

  const clipStyle = (clip: Clip | null) =>
    clip
      ? { clipPath: `inset(${clip.top}px 0 ${clip.bottom}px 0 round 0.75rem)` }
      : { clipPath: "inset(100%)" };

  return (
    <div className="mr-auto w-90 overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex items-center justify-end gap-1 p-3 pb-1">
        <button
          type="button"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Add canvas"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      <nav className="relative flex flex-col gap-px px-3 pb-3">
        <span
          ref={trackRef}
          aria-hidden
          className="absolute top-0 bottom-3 left-3 right-3 rounded-xl bg-foreground/10 transition-[clip-path] duration-200 ease-out"
          style={clipStyle(activeClip)}
        />
        <span
          aria-hidden
          className={cn(
            "absolute top-0 bottom-3 left-3 right-3 rounded-xl bg-foreground/5",
            showHover ? "opacity-100" : "opacity-0"
          )}
          style={{
            ...clipStyle(hoverClip),
            transition: hoverAnimationEnabled
              ? "clip-path 200ms ease-out, opacity 200ms ease-out"
              : "opacity 200ms ease-out",
          }}
        />

        {ITEMS.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) rowRefs.current.set(item.id, el);
              }}
              type="button"
              onClick={() => setActiveId(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative z-10 flex h-10 items-center rounded-xl px-4 text-left text-sm"
            >
              <span
                className={cn(
                  "font-normal",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
