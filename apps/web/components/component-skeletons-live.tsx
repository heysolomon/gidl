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
import Matter from "matter-js";
import { Bar } from "@/components/skeleton-primitives";
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
      <div className="w-full">
        <div className="flex flex-col gap-1.5 px-3 pt-1 pb-2.5">
          <Bar tone="soft" className="h-1 w-10" />
          <Bar className={cn("transition-[width] duration-300", panel.title)} />
          <Bar
            tone="soft"
            className={cn("transition-[width] duration-300", panel.line)}
          />
        </div>
        <div className="h-16 rounded-[14px] bg-(--sk-fill)" />
      </div>
    </div>
  );
}

// --- Agentation Toolbar ---

// Pause and Close are the bright controls on the real toolbar. Settings is the
// sixth control, and opens the panel.
const TOOLBAR_SLOTS = [
  { tone: "strong" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "soft" },
  { tone: "soft", settings: true },
  { tone: "strong", divider: true },
] as const;

// The settings panel's switch rows, with label lengths that vary like the real ones.
const SETTINGS_ROWS = ["w-14", "w-10", "w-16", "w-12", "w-[52px]"];

// Rest: the open toolbar, as you'd see it in use. Hover: Settings is pressed and
// its panel rises above the toolbar, right-aligned, the way the real one opens:
// fade, 8px rise, scale from 0.95 and unblur over 0.2s, closing in 0.1s.
export function AgentationToolbarSkeleton() {
  const { ref, step } = useCardWalk(1);
  const open = step > 0;

  return (
    <div
      ref={ref}
      className="relative flex h-[168px] w-56 shrink-0 flex-col justify-end"
    >
      <div
        style={{
          transition: open
            ? "opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease"
            : "opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease",
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scale(1)"
            : "translateY(8px) scale(0.95)",
          filter: open ? "blur(0)" : "blur(5px)",
          transformOrigin: "bottom right",
        }}
        className="absolute right-1 bottom-11 flex w-[150px] flex-col gap-2.5 rounded-2xl bg-(--sk-fill) p-3"
      >
        <Bar className="w-12" />
        {SETTINGS_ROWS.map((width) => (
          <div key={width} className="flex items-center justify-between">
            <Bar tone="soft" className={width} />
            <span className="h-2.5 w-5 rounded-full bg-(--sk-soft)" />
          </div>
        ))}
      </div>
      <div className="flex h-9 w-full items-center justify-center rounded-full bg-(--sk-fill)">
        <div className="flex shrink-0 items-center gap-1">
          {TOOLBAR_SLOTS.map((slot, i) => (
            <div key={i} className="flex items-center gap-1">
              {"divider" in slot && (
                <span className="mx-0.5 h-2.5 w-px bg-(--sk-strong)" />
              )}
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full transition-colors duration-150 ease-out",
                  "settings" in slot && open && "bg-(--sk-soft)"
                )}
              >
                <Bar tone={slot.tone} className="w-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Expanding Gallery ---

// Same authored layout as the real gallery, scaled to the card. The strip's
// travel is worked out from the docs preview's width, where the gallery shows
// more of the strip than this card has room for.
const VIEW_WIDTH = 540;
const PREVIEW_WIDTH = 766;
const VIEW_HEIGHT = 235;
const EXPANDED_WIDTH = 283;
const COLLAPSED_WIDTH = 152;
const GAP = 17;
const INSET = 34;
const RADIUS = 30;
const GALLERY_SPRING = { stiffness: 70, damping: 17 };

const cqw = (px: number) => `${(px / VIEW_WIDTH) * 100}cqw`;

const CARD_COUNT = 5;
const LAST_INDEX = CARD_COUNT - 1;
const CONTENT_WIDTH =
  INSET * 2 + EXPANDED_WIDTH + LAST_INDEX * (COLLAPSED_WIDTH + GAP);
const OVERFLOW = Math.max(0, CONTENT_WIDTH - PREVIEW_WIDTH);

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

// A stand-in for a photo: a flat tile, like the Expanding Gallery cards. These
// overlap, so a ring in the card's own background keeps each edge readable.
function ImageCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-(--sk-fill) ring-1 ring-background",
        className
      )}
    />
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
      className="relative h-[168px] w-56 shrink-0 overflow-hidden rounded-2xl border border-border"
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

// --- No Results ---

// The real component's physics, scaled from its 64px tiles to these 14px ones.
// Gravity and starting speed scale with size, so the fall takes the same time.
const NR_TILE = 14;
const NR_SCALE = NR_TILE / 64;
const NR_COUNT = 19;
const NR_COLUMNS = 5;
const NR_PITCH = NR_TILE * 0.85;
const NR_STEP = 1000 / 60;
const NR_MAX_LEAN = 0.7;
const NR_LEAN_CUSHION = 0.004;

function nrScatter(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function nrStartPose(index: number, centerX: number, centerY: number) {
  const rows = Math.ceil(NR_COUNT / NR_COLUMNS);
  const row = Math.floor(index / NR_COLUMNS);
  const inRow = Math.min(NR_COLUMNS, NR_COUNT - row * NR_COLUMNS);
  const offset = (index % NR_COLUMNS) - (inRow - 1) / 2;
  const brick = row % 2 ? NR_PITCH / 2 : 0;
  return {
    row,
    offset,
    x:
      centerX +
      offset * NR_PITCH -
      brick +
      NR_PITCH / 4 +
      nrScatter(index + 1) * NR_TILE * 0.06,
    y:
      centerY +
      (row - (rows - 1) / 2) * NR_PITCH +
      nrScatter(index + 7) * NR_TILE * 0.06,
    angle: nrScatter(index + 13) * 0.2,
  };
}

const nrTransform = (x: number, y: number, angle: number) =>
  `translate(${x - NR_TILE / 2}px, ${y - NR_TILE / 2}px) rotate(${angle}rad)`;

// Hover: the cluster of art tiles drops from the suggestions and piles up on
// the floor, on the real component's physics. At rest the card shows the empty
// state alone, and leaving fades the pile out.
export function NoResultsSkeleton() {
  const { ref, step } = useCardWalk(1);
  const floorRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  // The message steps aside while the tiles are thrown, as in the real one.
  const [messageShown, setMessageShown] = useState(true);
  const message = cn(
    "transition-[opacity,translate] ease-out",
    messageShown
      ? "duration-250 opacity-100"
      : "translate-y-1 opacity-0 duration-150"
  );

  // At rest the hidden tiles wait in the starting cluster, once the fade-out
  // has finished, so a hover never moves them from somewhere else first.
  useEffect(() => {
    const box = floorRef.current;
    const chips = chipsRef.current;
    if (step !== 0 || !box || !chips) return;
    const park = () =>
      tileRefs.current.forEach((element, index) => {
        if (!element) return;
        const pose = nrStartPose(
          index,
          box.clientWidth / 2,
          chips.offsetTop / 2 + chips.offsetHeight / 2
        );
        element.style.transform = nrTransform(pose.x, pose.y, pose.angle);
      });
    const timer = setTimeout(
      park,
      tileRefs.current[0]?.style.transform ? 220 : 0
    );
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const box = floorRef.current;
    const chips = chipsRef.current;
    if (step === 0 || !box || !chips) return;

    const { Engine, Bodies, Body, Composite } = Matter;
    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 0.8 * NR_SCALE;

    const width = box.clientWidth;
    const height = box.clientHeight;
    const centerX = width / 2;
    const centerY = chips.offsetTop / 2 + chips.offsetHeight / 2;
    const wall = { isStatic: true, friction: 0.6 };
    const walls = [
      Bodies.rectangle(width / 2, height + 25, width * 3, 50, wall),
      Bodies.rectangle(-25, height / 2, 50, height * 4, wall),
      Bodies.rectangle(width + 25, height / 2, 50, height * 4, wall),
    ];

    const realInertia = new Map<Matter.Body, number>();
    const bodies = Array.from({ length: NR_COUNT }, (_, index) => {
      const pose = nrStartPose(index, centerX, centerY);
      const body = Bodies.rectangle(pose.x, pose.y, NR_TILE, NR_TILE, {
        chamfer: { radius: NR_TILE * 0.1 },
        angle: pose.angle,
        restitution: 0.02,
        friction: 0.1,
        frictionStatic: 0.3,
        frictionAir: 0.012,
      });
      realInertia.set(body, body.inertia);
      Body.setInertia(body, body.inertia * 6);
      Body.setVelocity(body, {
        x: (pose.offset * 1.5 + nrScatter(index + 21) * 0.6) * NR_SCALE,
        y: 4.5 * NR_SCALE * (0.55 + pose.row * 0.3),
      });
      Body.setAngularVelocity(body, nrScatter(index + 29) * 0.02);
      return body;
    });
    Composite.add(engine.world, [...walls, ...bodies]);

    const draw = () => {
      bodies.forEach((body, index) => {
        const element = tileRefs.current[index];
        if (!element) return;
        const { x, y } = body.position;
        element.style.transform = nrTransform(x, y, body.angle);
      });
    };

    // The real component's settling: a tile asleep at a tilt on the floor,
    // with nothing on the side it would fall toward, is woken with its real
    // weight and nudged back upright, or flat if it's past 57°.
    const floor = walls[0]!;
    const held = (body: Matter.Body) => {
      const onFloor = Matter.Collision.collides(body, floor);
      if (!onFloor?.collided) return true;
      const points = onFloor.supports.filter(Boolean);
      const contactX =
        points.reduce((sum, point) => sum + point.x, 0) / points.length;
      const tipsRight = body.position.x > contactX;
      return bodies.some((other) => {
        if (other === body) return false;
        const hit = Matter.Collision.collides(body, other);
        return (
          hit?.collided &&
          hit.supports
            .filter(Boolean)
            .some((point) =>
              tipsRight
                ? point.x > body.position.x - 2 * NR_SCALE
                : point.x < body.position.x + 2 * NR_SCALE
            )
        );
      });
    };
    const wakeLoose = () => {
      const loose = bodies.filter((body) => {
        const turn =
          ((body.angle % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
        return (
          body.isSleeping &&
          Math.min(turn, Math.PI / 2 - turn) >= 0.05 &&
          !held(body)
        );
      });
      loose.forEach((body) => {
        Matter.Sleeping.set(body, false);
        Body.setInertia(body, realInertia.get(body) ?? body.inertia);
        const nearCorner = Math.abs(body.angle) > Math.PI / 4 - 0.12;
        const target =
          Math.abs(body.angle) < 1
            ? 0
            : Math.round(body.angle / (Math.PI / 2)) * (Math.PI / 2);
        Body.setAngularVelocity(
          body,
          Math.sign(target - body.angle) *
            (target === 0 && nearCorner ? 0.03 : 0.01)
        );
      });
      return loose.length > 0;
    };
    const messageBottom = chips.offsetTop + chips.offsetHeight;
    let messageBack = false;
    setMessageShown(false);
    const backBy = setTimeout(() => {
      messageBack = true;
      setMessageShown(true);
    }, 900);

    let frame = 0;
    let last = 0;
    let carry = 0;
    const tick = (now: number) => {
      carry += Math.min(now - (last || now), 100);
      last = now;
      while (carry >= NR_STEP) {
        Engine.update(engine, NR_STEP);
        for (const body of bodies) {
          if (
            Math.abs(body.angle) > NR_MAX_LEAN &&
            body.angle * body.angularVelocity > 0
          ) {
            Body.setAngularVelocity(
              body,
              body.angularVelocity - Math.sign(body.angle) * NR_LEAN_CUSHION
            );
          }
        }
        carry -= NR_STEP;
      }
      draw();
      // The message comes back once every tile has fallen past it.
      if (
        !messageBack &&
        bodies.every((body) => body.bounds.min.y > messageBottom)
      ) {
        messageBack = true;
        setMessageShown(true);
      }
      const woke = wakeLoose();
      frame =
        !woke && bodies.every((body) => body.isSleeping)
          ? 0
          : requestAnimationFrame(tick);
    };
    // A hover that returns mid fade-out would show the tiles jump from the
    // pile to the cluster, so they restart from transparent and fade back in.
    tileRefs.current.forEach((element) => {
      if (!element) return;
      element.style.transition = "none";
      element.style.opacity = "0";
    });
    draw();
    void box.offsetHeight;
    tileRefs.current.forEach((element) => {
      if (!element) return;
      element.style.transition = "";
      element.style.opacity = "";
    });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(backBy);
      Engine.clear(engine);
      setMessageShown(true);
    };
  }, [step]);

  return (
    // Runs to the panel's bottom edge, which is the floor the tiles land on.
    <div ref={ref} className="-mb-6 h-[196px] w-52 shrink-0">
      <div
        ref={floorRef}
        className="relative flex size-full flex-col items-center pt-3"
      >
        <Bar className={cn("w-16", message)} />
        <Bar tone="soft" className={cn("mt-1.5 w-24", message)} />
        <div
          ref={chipsRef}
          className={cn("mt-3 grid grid-cols-3 gap-1", message)}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="h-3 w-9 rounded-full bg-(--sk-fill)" />
          ))}
        </div>
        {Array.from({ length: NR_COUNT }, (_, index) => (
          <div
            key={index}
            ref={(element) => {
              tileRefs.current[index] = element;
            }}
            style={{ width: NR_TILE, height: NR_TILE }}
            className={cn(
              "absolute top-0 left-0 rounded-[3px] bg-(--sk-fill) ring-1 ring-background transition-opacity duration-200 ease-out",
              step === 0 && "opacity-0"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// --- Icon Picker ---

const IP_COLUMNS = 12;
const IP_ROWS = 6;
const IP_SWATCHES = 10;
// The real picker's timing: a 280ms ease-in-out fade, 16ms later a row and 4ms a column.
const IP_FADE_MS = 280;
const IP_ROW_MS = 16;
const IP_COLUMN_MS = 4;
const IP_EASE = "cubic-bezier(0.45, 0, 0.25, 1)";

// Hover: the selection moves to another swatch and the new shade wipes down
// the icon grid, as the real one's colour does. It's
// the one skeleton that changes shade across many elements, because that sweep
// is the whole component; it stays inside the gray ramp.
export function IconPickerSkeleton() {
  const { ref, step } = useCardWalk(1);
  const active = step === 0 ? 0 : 6;

  return (
    <div ref={ref} className="w-48 shrink-0 rounded-xl bg-(--sk-fill) p-2.5">
      <div className="flex items-center gap-1.5">
        <span className="size-3.5 rounded-[4px] bg-(--sk-soft)" />
        <Bar className="w-14" />
      </div>
      <div className="isolate mt-2.5 flex items-center justify-between">
        {Array.from({ length: IP_SWATCHES }, (_, index) => (
          // The real swatch's selection: the front circle shrinks to open a
          // gap and a larger one behind it fades in as a halo, over 0.2s.
          <span
            key={index}
            className={cn(
              "relative size-3 rounded-full bg-(--sk-fill)",
              "before:absolute before:inset-0 before:rounded-full before:bg-(--sk-soft) before:transition-[scale,opacity] before:duration-200",
              "after:absolute after:inset-0 after:-z-1 after:scale-125 after:rounded-full after:bg-(--sk-soft) after:opacity-0 after:transition-[scale,opacity] after:duration-200",
              index === active && "before:scale-75 after:opacity-100"
            )}
          />
        ))}
      </div>
      <div className="mt-2.5 h-px bg-background" />
      <div className="mt-2.5 grid grid-cols-12 gap-y-1.5">
        {Array.from({ length: IP_COLUMNS * IP_ROWS }, (_, index) => {
          const row = Math.floor(index / IP_COLUMNS);
          const column = index % IP_COLUMNS;
          return (
            <span
              key={index}
              style={{
                transitionDuration: `${IP_FADE_MS}ms`,
                transitionTimingFunction: IP_EASE,
                transitionDelay: `${row * IP_ROW_MS + column * IP_COLUMN_MS}ms`,
              }}
              className={cn(
                "mx-auto size-[7px] rounded-[2px] transition-colors",
                step === 0 ? "bg-(--sk-soft)" : "bg-(--sk-active)"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
