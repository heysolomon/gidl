"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PanelLeft, Plus } from "lucide-react";
import { Bar, Surface } from "@/components/skeleton-primitives";
import { cn } from "@/lib/utils";

// Wireframe previews for the homepage grid: flat mini-cards and pill bars, all
// in the `--sk-*` neutral ramp from globals.css. Each runs its real component's own
// motion values at wireframe size, walked through on card hover — keep them in
// step with packages/ui/src/registry/components.

/**
 * Walks 0 → `steps` while the surrounding card is hovered (or its link has
 * keyboard focus), one step every `interval` ms starting immediately, and
 * returns to 0 when it isn't. Skeletons hint at the component rather than
 * replay it, so keep `steps` to one gesture. Mouse only, so a tap on touch doesn't start a
 * walk that nothing would end; reduced motion stays on the resting frame.
 */
function useCardWalk(steps: number, interval = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const card = ref.current?.closest<HTMLElement>("[data-slot=card-frame]");
    if (!card || reduceMotion) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let hovered = false;
    let focused = false;

    const walk = (next: number) => {
      setStep(next);
      if (next < steps) timer = setTimeout(() => walk(next + 1), interval);
    };
    const update = (change: () => void) => {
      const wasActive = hovered || focused;
      change();
      const isActive = hovered || focused;
      if (isActive === wasActive) return;
      clearTimeout(timer);
      if (isActive) walk(1);
      else setStep(0);
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") update(() => (hovered = true));
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") update(() => (hovered = false));
    };
    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement).matches(":focus-visible")) {
        update(() => (focused = true));
      }
    };
    const onFocusOut = () => update(() => (focused = false));

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("focusin", onFocusIn);
    card.addEventListener("focusout", onFocusOut);
    return () => {
      clearTimeout(timer);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("focusin", onFocusIn);
      card.removeEventListener("focusout", onFocusOut);
    };
  }, [steps, interval, reduceMotion]);

  return { ref, step };
}

// --- Animated Tabs ---

const TAB_LIST_INSET = 4;
// x + width of each pill. The labels differ in length like the real tabs, so
// the indicator resizes as it travels.
const TABS = [
  { x: 0, width: 50, label: "w-[26px]" },
  { x: 50, width: 54, label: "w-[30px]" },
  { x: 104, width: 48, label: "w-6" },
];

const PANELS = [
  { title: "w-[55%]", line: "w-[85%]" },
  { title: "w-[70%]", line: "w-[70%]" },
];

// Hover: the pill moves one tab on the real indicator spring and the panel's
// contents shift to suit. The panel itself stays put, since the full
// directional swap is the real component's to show.
export function AnimatedTabsSkeleton() {
  const { ref, step } = useCardWalk(1);
  const tab = TABS[step]!;
  const panel = PANELS[step]!;

  return (
    <div ref={ref} className="flex w-44 flex-col items-center gap-2.5">
      <div
        className="relative flex rounded-full bg-(--sk-fill)"
        style={{ padding: TAB_LIST_INSET }}
      >
        <motion.span
          className="absolute top-1 bottom-1 left-1 rounded-full bg-(--sk-soft)"
          initial={false}
          animate={{ x: tab.x, width: tab.width }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        />
        {TABS.map(({ width, label }, i) => (
          <div
            key={i}
            style={{ width }}
            className="relative flex h-6 items-center justify-center"
          >
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors duration-200",
                label,
                i === step ? "bg-(--sk-active)" : "bg-(--sk-soft)"
              )}
            />
          </div>
        ))}
      </div>
      <div className="w-full overflow-hidden rounded-[18px] bg-(--sk-fill)">
        <div className="flex flex-col gap-1.5 p-3 pb-2">
          <Bar tone="soft" className="h-1 w-10" />
          <Bar className={cn("transition-[width] duration-300", panel.title)} />
          <Bar
            tone="soft"
            className={cn("transition-[width] duration-300", panel.line)}
          />
        </div>
        <div className="p-1">
          <div className="h-14 rounded-[14px] bg-(--sk-soft)" />
        </div>
      </div>
    </div>
  );
}

// --- Agentation Toolbar ---

const COLLAPSED_SIZE = 36;
const EXPANDED_TOOLBAR_WIDTH = 224;
const TOOLBAR_EASE = "cubic-bezier(0.19,1,0.22,1)";

// Pause and Close are the bright controls on the real toolbar.
const TOOLBAR_SLOTS = [
  { tone: "strong" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "strong", divider: true },
] as const;

// Hover: opens the way the real toolbar does. The right edge stays put and only
// the left edge travels, over 0.4s. The control row is centered in the growing
// box and materializes over 0.6–0.8s, unclipped once open, and the collapsed
// icon fades in 0.1s. The circle rests at the right so the open pill fits.
export function AgentationToolbarSkeleton() {
  const { ref, step } = useCardWalk(1);
  const expanded = step > 0;

  return (
    <div ref={ref} className="flex h-9 w-56 shrink-0 justify-end">
      <div
        style={{
          width: expanded ? EXPANDED_TOOLBAR_WIDTH : COLLAPSED_SIZE,
          transition: `width 0.4s ${TOOLBAR_EASE}`,
        }}
        className={cn(
          "relative h-full rounded-full bg-(--sk-fill)",
          !expanded && "overflow-hidden"
        )}
      >
        {/* The collapsed icon's three lines. */}
        <div
          style={{ transition: `opacity 0.1s ${TOOLBAR_EASE}` }}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            expanded ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="flex flex-col items-start gap-[3px]">
            <Bar className="h-[3px] w-3.5" />
            <Bar className="h-[3px] w-2.5" />
            <Bar className="h-[3px] w-1.5" />
          </div>
        </div>
        <div
          style={
            {
              transition: `filter 0.8s ${TOOLBAR_EASE}, opacity 0.8s ${TOOLBAR_EASE}, transform 0.6s ${TOOLBAR_EASE}`,
              opacity: expanded ? 1 : 0,
              filter: expanded ? "blur(0)" : "blur(10px)",
              transform: expanded ? "scale(1)" : "scale(0.4)",
            } satisfies CSSProperties
          }
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex shrink-0 items-center gap-1">
            {TOOLBAR_SLOTS.map((slot, i) => (
              <div key={i} className="flex items-center gap-1">
                {"divider" in slot && (
                  <span className="mx-0.5 h-2.5 w-px bg-(--sk-strong)" />
                )}
                <span className="flex size-6 items-center justify-center">
                  <Bar tone={slot.tone} className="w-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Expanding Gallery ---

// Same authored layout as the real gallery, so the proportions and the strip's
// travel match it exactly as the card scales.
const VIEW_WIDTH = 540;
const VIEW_HEIGHT = 235;
const EXPANDED_WIDTH = 283;
const COLLAPSED_WIDTH = 152;
const GAP = 17;
const INSET = 34;
const RADIUS = 30;
const GALLERY_SPRING = { stiffness: 70, damping: 17 };

const cqw = (px: number) => `${(px / VIEW_WIDTH) * 100}cqw`;

const CARD_COUNT = 4;
const LAST_INDEX = CARD_COUNT - 1;
const CONTENT_WIDTH =
  INSET * 2 + EXPANDED_WIDTH + LAST_INDEX * (COLLAPSED_WIDTH + GAP);
const OVERFLOW = Math.max(0, CONTENT_WIDTH - VIEW_WIDTH);

function GalleryCard({
  index,
  position,
}: {
  index: number;
  position: MotionValue<number>;
}) {
  const width = useTransform(position, (p) => {
    const expansion = Math.max(0, 1 - Math.abs(p - index));
    return cqw(
      COLLAPSED_WIDTH + (EXPANDED_WIDTH - COLLAPSED_WIDTH) * expansion
    );
  });

  return (
    <motion.li
      style={{ width, borderRadius: cqw(RADIUS) }}
      className="h-full shrink-0 bg-(--sk-fill)"
    />
  );
}

// Hover: the expansion moves one card along on the real gallery's spring, while
// the strip glides to keep it in view. The strip runs the full width of the
// panel so the card's own edge does the clipping.
export function ExpandingGallerySkeleton() {
  const { ref, step } = useCardWalk(1);
  const position = useSpring(0, GALLERY_SPRING);

  useEffect(() => {
    position.set(step);
  }, [position, step]);

  const x = useTransform(position, (p) => cqw(-(p / LAST_INDEX) * OVERFLOW));

  return (
    <div
      ref={ref}
      style={{
        containerType: "inline-size",
        aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}`,
      }}
      className="-mx-8 w-[calc(100%+4rem)] shrink-0 overflow-hidden"
    >
      <motion.ul
        style={{ x, gap: cqw(GAP), paddingInline: cqw(INSET) }}
        className="flex h-full w-max"
      >
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <GalleryCard key={index} index={index} position={position} />
        ))}
      </motion.ul>
    </div>
  );
}

// A stand-in for a photo. The backing is opaque because these overlap.
function ImageCard({ className }: { className?: string }) {
  return (
    <Surface className={cn("p-1.5 [--radius-2xl:12px]", className)}>
      <div className="flex-1 rounded-lg bg-(--sk-soft)" />
    </Surface>
  );
}

// --- Collins Carousel ---

const CAROUSEL_ITEM_WIDTH = 66;
const CAROUSEL_COUNT = 5;
const CAROUSEL_SPRING = { stiffness: 100, damping: 20, mass: 1.2 };
// The real carousel starts on its first item; starting mid-way keeps the
// wireframe balanced in the card, with a card to advance to on hover.
const CAROUSEL_START = 2;

type CarouselKeyframes = { in: number[]; out: string[] };

// The real carousel's keyframes: cards swing out past their resting spot
// (45.5% at the halfway point) and settle back to 30%.
function carouselKeyframes(isFirst: boolean, isLast: boolean, w: number) {
  const rotateY: CarouselKeyframes = isFirst
    ? { in: [-w, -w / 2, 0, w], out: ["40deg", "25deg", "0deg", "-15deg"] }
    : isLast
      ? { in: [-w, 0, w / 2, w], out: ["15deg", "0deg", "-25deg", "-40deg"] }
      : {
          in: [-w, -w / 2, 0, w / 2, w],
          out: ["40deg", "25deg", "0deg", "-25deg", "-40deg"],
        };
  const x: CarouselKeyframes = isFirst
    ? { in: [w, 0, -w / 2, -w], out: ["30%", "0%", "-45.5%", "-30%"] }
    : isLast
      ? { in: [w, w / 2, 0, -w], out: ["30%", "45.5%", "0%", "-30%"] }
      : {
          in: [w, w / 2, 0, -w / 2, -w],
          out: ["30%", "45.5%", "0%", "-45.5%", "-30%"],
        };
  const title = isFirst
    ? { in: [-w, -w / 4, 0, w], out: [0, 0, 1, 0] }
    : isLast
      ? { in: [-w, 0, w / 4, w], out: [0, 1, 0, 0] }
      : { in: [-w, -w / 4, 0, w / 4, w], out: [0, 0, 1, 0, 0] };
  return { rotateY, x, title };
}

function CarouselCard({
  index,
  position,
}: {
  index: number;
  position: MotionValue<number>;
}) {
  const w = CAROUSEL_ITEM_WIDTH;
  const keyframes = carouselKeyframes(
    index === 0,
    index === CAROUSEL_COUNT - 1,
    w
  );

  const offset = useTransform(position, (p) => (index - p) * w);
  const rotateY = useTransform(
    offset,
    keyframes.rotateY.in,
    keyframes.rotateY.out
  );
  const x = useTransform(offset, keyframes.x.in, keyframes.x.out);
  const titleOpacity = useTransform(
    offset,
    keyframes.title.in,
    keyframes.title.out
  );
  const z = useTransform(offset, (v) => Math.abs(v / w) * -(w * 0.55));
  const zIndex = useTransform(offset, (v) =>
    Math.max(0, Math.round(1000 - Math.abs(v)))
  );

  return (
    <motion.div style={{ zIndex }} className="absolute inset-x-0 top-0">
      <motion.div
        style={{
          transformPerspective: w * 2,
          transformStyle: "preserve-3d",
          x,
          z,
          rotateY,
        }}
        className="will-change-transform"
      >
        <ImageCard className="aspect-[3/4] w-full" />
        <motion.div style={{ opacity: titleOpacity }} className="mt-3">
          <Bar className="mx-auto w-3/4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function CollinsCarouselSkeleton() {
  const { ref, step } = useCardWalk(1);
  const position = useSpring(CAROUSEL_START, CAROUSEL_SPRING);

  useEffect(() => {
    position.set(CAROUSEL_START + step);
  }, [position, step]);

  return (
    <div
      ref={ref}
      style={{ width: CAROUSEL_ITEM_WIDTH }}
      className="relative h-[106px]"
    >
      {Array.from({ length: CAROUSEL_COUNT }, (_, index) => (
        <CarouselCard key={index} index={index} position={position} />
      ))}
    </div>
  );
}

// --- Flip Cards ---

const FLIP_COUNT = 6;
const FLIP_SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
// One unbroken arc, so the card never stops between leaving the deck and
// arriving at the back.
const FLIP_ARC_MS = 800;
const FLIP_ARC_PEAK = 0.45;
// Far enough to clear the top card before dropping behind it, near enough to
// stay inside the narrowest panel.
const FLIP_ARC_REACH = 90;

// Hover: the top card arcs out over the deck and around to the back while the
// rest fan up a step. Like the real deck the new order sticks — the cards are
// identical, so the resting frame looks the same either way.
export function FlipCardsSkeleton() {
  const { ref, step } = useCardWalk(1);
  const [dismissed, setDismissed] = useState(0);
  const [raised, setRaised] = useState(false);
  const arcTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inFlight = useRef(false);

  useEffect(() => {
    // A hover that lands mid-arc is ignored: starting another would strand the
    // flying card halfway round.
    if (step !== 1 || inFlight.current) return;
    inFlight.current = true;
    setDismissed((count) => count + 1);
    setRaised(true);
    arcTimers.current = [
      // Stacking has to be set directly: motion jumps zIndex to its final
      // keyframe instead of holding it, which sends the card behind the deck.
      setTimeout(() => setRaised(false), FLIP_ARC_MS * FLIP_ARC_PEAK),
      setTimeout(() => (inFlight.current = false), FLIP_ARC_MS),
    ];
  }, [step]);

  useEffect(() => () => arcTimers.current.forEach(clearTimeout), []);

  return (
    <div ref={ref} className="relative h-28 w-[84px]">
      {Array.from({ length: FLIP_COUNT }, (_, card) => {
        const index = (card - dismissed + FLIP_COUNT * 1000) % FLIP_COUNT;
        const rotate = -index * 7;
        const leaving = dismissed > 0 && index === FLIP_COUNT - 1;
        return (
          <motion.div
            key={card}
            style={{
              zIndex: leaving && raised ? FLIP_COUNT + 1 : FLIP_COUNT - index,
            }}
            className="absolute inset-0"
            initial={false}
            animate={
              leaving
                ? {
                    x: [0, FLIP_ARC_REACH, 0],
                    y: [0, -6, 0],
                    rotate: [0, 4, rotate],
                  }
                : { x: 0, y: 0, rotate }
            }
            transition={
              leaving
                ? {
                    duration: FLIP_ARC_MS / 1000,
                    times: [0, FLIP_ARC_PEAK, 1],
                    ease: ["easeOut", "easeInOut"],
                  }
                : FLIP_SPRING
            }
          >
            <ImageCard className="size-full" />
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Sidebar List ---

const SIDEBAR_ROWS = 5;
const SIDEBAR_ROW_HEIGHT = 20;
const SIDEBAR_ROW_PITCH = 22;
const SIDEBAR_PILL_SPRING = { stiffness: 380, damping: 39 };
const SIDEBAR_PILL_FADE = { duration: 0.12, ease: "easeOut" } as const;

export function SidebarListSkeleton() {
  const { ref, step } = useCardWalk(2, 650);
  const hoverY = useSpring(SIDEBAR_ROW_PITCH, SIDEBAR_PILL_SPRING);

  useEffect(() => {
    if (step === 2) {
      hoverY.set(SIDEBAR_ROW_PITCH * 2);
      return;
    }
    if (step === 1) return;
    // Holds its row until the fade-out has finished, so it never slides while
    // disappearing.
    const timer = setTimeout(
      () => hoverY.jump(SIDEBAR_ROW_PITCH),
      SIDEBAR_PILL_FADE.duration * 1000 + 40
    );
    return () => clearTimeout(timer);
  }, [step, hoverY]);

  return (
    <div
      ref={ref}
      className="relative h-[168px] w-56 shrink-0 overflow-hidden rounded-2xl border border-border bg-(--sk-soft)"
    >
      <div className="absolute inset-y-1 left-1 w-[148px] rounded-xl bg-(--sk-fill)">
        <div className="flex items-center justify-end gap-1 p-1.5 text-(--sk-active)">
          <span className="flex size-5 shrink-0 items-center justify-center">
            <Plus className="size-3" />
          </span>
          <span className="flex size-5 shrink-0 items-center justify-center">
            <PanelLeft className="size-3" />
          </span>
        </div>
        <div className="relative mx-1">
          <span
            style={{ height: SIDEBAR_ROW_HEIGHT }}
            className="absolute inset-x-0 top-0 rounded-lg bg-(--sk-soft)"
          />
          <motion.span
            initial={false}
            style={{ y: hoverY, height: SIDEBAR_ROW_HEIGHT }}
            animate={{ opacity: step > 0 ? 1 : 0 }}
            transition={SIDEBAR_PILL_FADE}
            className="absolute inset-x-0 top-0 rounded-lg bg-(--sk-soft)"
          />
          {Array.from({ length: SIDEBAR_ROWS }, (_, row) => (
            <div
              key={row}
              style={{
                height: SIDEBAR_ROW_HEIGHT,
                marginTop:
                  row === 0 ? 0 : SIDEBAR_ROW_PITCH - SIDEBAR_ROW_HEIGHT,
              }}
              className="relative flex items-center px-2"
            >
              <Bar className={cn("w-[46%]", row === 0 && "bg-(--sk-active)")} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
