"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

type GalleryItem = {
  src: string;
  alt: string;
};

const ITEMS: GalleryItem[] = [
  { src: "/carousel/prism-table-lamp.png", alt: "Prism table lamp" },
  { src: "/carousel/zenith-kettle.png", alt: "Zenith kettle" },
  { src: "/carousel/studio-mic-arm.png", alt: "Studio mic arm" },
  { src: "/carousel/monitor-stand.png", alt: "Vertex monitor stand" },
];

// Layout is authored at this size, then expressed in cqw so the whole gallery
// scales with its container without measuring anything in JS.
const VIEW_WIDTH = 540;
const VIEW_HEIGHT = 235;
const EXPANDED_WIDTH = 283;
const COLLAPSED_WIDTH = 152;
const GAP = 17;
const INSET = 34;
const RADIUS = 30;

const SPRING = { stiffness: 70, damping: 17 };

const cqw = (px: number) => `${(px / VIEW_WIDTH) * 100}cqw`;

function GalleryCard({
  item,
  index,
  isActive,
  position,
  onActivate,
  onPointerMove,
}: {
  item: GalleryItem;
  index: number;
  isActive: boolean;
  position: MotionValue<number>;
  onActivate: () => void;
  onPointerMove: (event: PointerEvent) => void;
}) {
  // Cards share one continuous position, so whatever one card gains its
  // neighbor gives up — the strip's total width never changes mid-transition.
  const width = useTransform(position, (p) => {
    const expansion = Math.max(0, 1 - Math.abs(p - index));
    return cqw(
      COLLAPSED_WIDTH + (EXPANDED_WIDTH - COLLAPSED_WIDTH) * expansion
    );
  });

  return (
    <motion.li style={{ width }} className="h-full shrink-0">
      <button
        type="button"
        aria-label={item.alt}
        aria-current={isActive ? "true" : undefined}
        onPointerMove={onPointerMove}
        onFocus={onActivate}
        onClick={onActivate}
        style={{ borderRadius: cqw(RADIUS) }}
        className="relative block size-full cursor-pointer overflow-hidden bg-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900 dark:bg-neutral-800 dark:focus-visible:ring-neutral-100"
      >
        {/* Sized to the expanded card, not this one, so resizing the card
            crops the image around its center instead of rescaling it. */}
        <img
          src={item.src}
          alt=""
          draggable={false}
          style={{ width: cqw(EXPANDED_WIDTH) }}
          className="absolute left-1/2 top-0 h-full max-w-none -translate-x-1/2 select-none object-cover"
        />
      </button>
    </motion.li>
  );
}

export function ExpandingGallery({
  items = ITEMS,
  className,
}: {
  items?: GalleryItem[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const position = useSpring(0, SPRING);
  const lastPointer = useRef({ x: NaN, y: NaN });

  const lastIndex = items.length - 1;
  const contentWidth =
    INSET * 2 + EXPANDED_WIDTH + lastIndex * (COLLAPSED_WIDTH + GAP);
  const overflow = Math.max(0, contentWidth - VIEW_WIDTH);

  // The first card rests at the start of the strip, the last at the end, and
  // everything between is spaced evenly across that travel.
  const x = useTransform(position, (p) =>
    lastIndex > 0 ? cqw(-(p / lastIndex) * overflow) : "0cqw"
  );

  const activate = (index: number) => {
    setActiveIndex(index);
    if (reduceMotion) position.jump(index);
    else position.set(index);
  };

  // Not onPointerEnter: the strip slides under a resting pointer, which would
  // fire enter on the next card and walk the gallery on its own. Only a pointer
  // that actually moved counts as choosing a card.
  const handlePointerMove = (event: PointerEvent, index: number) => {
    if (event.pointerType !== "mouse") return;
    const { x, y } = lastPointer.current;
    if (event.clientX === x && event.clientY === y) return;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    activate(index);
  };

  return (
    <div
      style={{
        containerType: "inline-size",
        aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}`,
      }}
      className={cn("w-full max-w-135 overflow-hidden", className)}
    >
      <motion.ul
        style={{ x, gap: cqw(GAP), paddingInline: cqw(INSET) }}
        className="flex h-full w-max"
      >
        {items.map((item, index) => (
          <GalleryCard
            key={item.src}
            item={item}
            index={index}
            isActive={index === activeIndex}
            position={position}
            onActivate={() => activate(index)}
            onPointerMove={(event) => handlePointerMove(event, index)}
          />
        ))}
      </motion.ul>
    </div>
  );
}
