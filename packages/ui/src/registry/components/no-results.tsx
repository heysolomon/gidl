"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { Search } from "lucide-react";
import {
  siAirbnb,
  siDiscord,
  siDropbox,
  siDuolingo,
  siFigma,
  siHeadspace,
  siKlarna,
  siLinear,
  siMailchimp,
  siNotion,
  siPerplexity,
  siPinterest,
  siRaycast,
  siShopify,
  siSnapchat,
  siSpotify,
  siTwitch,
  siUber,
  siWise,
} from "simple-icons";
import { cn } from "@/lib/utils";

/** A tile: an app's logo on its icon colour. Logo paths are 24×24 SVG paths. */
type Tile = { name: string; path: string; background: string; color: string };

// App icons, drawn from Simple Icons' logo paths, coloured like each app's icon.
const TILES: Tile[] = [
  {
    name: "Dropbox",
    path: siDropbox.path,
    background: "#0061FF",
    color: "#FFFFFF",
  },
  {
    name: "Pinterest",
    path: siPinterest.path,
    background: "#FFFFFF",
    color: "#E60023",
  },
  { name: "Uber", path: siUber.path, background: "#000000", color: "#FFFFFF" },
  { name: "Wise", path: siWise.path, background: "#9FE870", color: "#163300" },
  {
    name: "Airbnb",
    path: siAirbnb.path,
    background: "#FF385C",
    color: "#FFFFFF",
  },
  {
    name: "Notion",
    path: siNotion.path,
    background: "#FFFFFF",
    color: "#000000",
  },
  {
    name: "Twitch",
    path: siTwitch.path,
    background: "#9146FF",
    color: "#FFFFFF",
  },
  {
    name: "Klarna",
    path: siKlarna.path,
    background: "#FFB3C7",
    color: "#0B051D",
  },
  {
    name: "Mailchimp",
    path: siMailchimp.path,
    background: "#FFE01B",
    color: "#241C15",
  },
  {
    name: "Headspace",
    path: siHeadspace.path,
    background: "#FFFFFF",
    color: "#F47D31",
  },
  {
    name: "Shopify",
    path: siShopify.path,
    background: "#95BF47",
    color: "#FFFFFF",
  },
  {
    name: "Discord",
    path: siDiscord.path,
    background: "#5865F2",
    color: "#FFFFFF",
  },
  {
    name: "Spotify",
    path: siSpotify.path,
    background: "#000000",
    color: "#1ED760",
  },
  {
    name: "Figma",
    path: siFigma.path,
    background: "#1E1E1E",
    color: "#FFFFFF",
  },
  {
    name: "Duolingo",
    path: siDuolingo.path,
    background: "#58CC02",
    color: "#FFFFFF",
  },
  {
    name: "Snapchat",
    path: siSnapchat.path,
    background: "#FFFC00",
    color: "#000000",
  },
  {
    name: "Linear",
    path: siLinear.path,
    background: "#5E6AD2",
    color: "#FFFFFF",
  },
  {
    name: "Raycast",
    path: siRaycast.path,
    background: "#FF6363",
    color: "#FFFFFF",
  },
  {
    name: "Perplexity",
    path: siPerplexity.path,
    background: "#091717",
    color: "#20B8CD",
  },
];

const SUGGESTIONS = [
  "Membership",
  "Gamification",
  "Cards",
  "Checklist",
  "Loyalty",
  "QR Code",
];

// 64px on a full-width page, as in the reference, and smaller in a smaller box
// so the pile keeps the same proportions.
const tileSize = (width: number) =>
  Math.round(Math.min(64, Math.max(44, width * 0.055)));
const RADIUS_RATIO = 0.22;
// The body's corners are tighter than the drawn ones: fully rounded, a tile
// rolls along the floor like a wheel instead of tipping and sliding.
const BODY_RADIUS_RATIO = 0.1;
// Matter's units: gravity 1 is about 1000px/s², and velocity is px per 60fps step.
const GRAVITY = 0.8;
// Tiles start already falling, as in the reference, at about 270px/s.
const START_SPEED = 4.5;
const STEP = 1000 / 60;
const FLOOR_INSET = 3;
// matter-js puts a barely moving body to sleep, and that can freeze a tile part
// way through tipping over, tilted on the floor with nothing holding it up.
// When everything sleeps, a tile tilted past this that touches only the floor
// is woken to finish falling flat.
const LOOSE_TILT = 0.05;
// A safety stop, in case something keeps waking.
const MAX_RUN_MS = 20000;
// The message waits until every tile has fallen past it, so tiles are never
// drawn over the text, and comes in this long after the throw at the latest.
const REVEAL_BY_MS = 900;
// Past this lean (about 40°), a tile turning further has its spin eased off a
// little each step, so it slows and settles instead of rolling onto its side.
// Flipping its spin back instead made tiles see-saw against gravity.
const MAX_LEAN = 0.7;
const LEAN_CUSHION = 0.004;
// The push a tile caught on a corner gets when it's woken, toward its nearest
// flat side. Kept small: just enough to start the tip, as a nudge would.
const WAKE_PUSH = 0.01;
// A tile caught near 45° is nudged back upright, a little harder, rather than
// over onto its side.
const UPRIGHT_BELOW = 1.0;
const CORNER_PUSH = 0.03;
// The cluster the tiles start in: a grid tighter than the tiles, so they
// overlap and the engine pushes them apart. That push is the burst outward at
// the start. Righting keeps it from flipping any.
const COLUMNS = 5;
const PITCH = 0.85;

/** Every value that shapes the fall. All optional on the component. */
export type NoResultsPhysics = {
  /** matter-js units: 1 is about 1000px/s². */
  gravity: number;
  /** Starting fall speed of the top row, in px per 60fps step. Lower rows start faster. */
  startSpeed: number;
  /** How hard the cluster opens outward as it falls. */
  spread: number;
  /** Sliding friction between tiles. Lower lets tiles slide further off the pile. */
  friction: number;
  /** Friction a resting tile must overcome before it starts to slide. */
  staticFriction: number;
  /** Bounciness, from 0 (none) to 1. */
  bounce: number;
  /** Drag through the air, slowing both falling and spinning. */
  airFriction: number;
  /** 1 is a real tile. Higher makes tiles harder to turn, which isn't physical. */
  spinResistance: number;
  /** Nudges tiles tilted past about 40° back upright. Not physical. */
  righting: boolean;
  /** Wakes a tile that fell asleep tilted on the floor with nothing holding it up. */
  wakeFloating: boolean;
};

export const NO_RESULTS_PHYSICS: NoResultsPhysics = {
  gravity: GRAVITY,
  startSpeed: START_SPEED,
  spread: 1.5,
  friction: 0.1,
  staticFriction: 0.3,
  bounce: 0.02,
  airFriction: 0.012,
  spinResistance: 6,
  righting: true,
  wakeFloating: true,
};

// A small hash of a number into -1 to 1. Each fall adds its own random seed, so
// every load lands differently; pass `seed` to the component to repeat one.
function scatter(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

// The cluster starts centred on the message, covering it.
function startPose(
  index: number,
  count: number,
  centerX: number,
  centerY: number,
  tile: number,
  jitter: (n: number) => number
) {
  const rows = Math.ceil(count / COLUMNS);
  const row = Math.floor(index / COLUMNS);
  const inRow = Math.min(COLUMNS, count - row * COLUMNS);
  const column = index % COLUMNS;
  const pitch = tile * PITCH;
  // Alternate rows sit half a tile over, so tiles land on each other's corners
  // and rest at an angle instead of stacking into neat columns.
  const brick = row % 2 ? pitch / 2 : 0;
  const offset = column - (inRow - 1) / 2;
  return {
    offset,
    row,
    x:
      centerX +
      offset * pitch -
      brick +
      pitch / 4 +
      jitter(index + 1) * tile * 0.06,
    y:
      centerY +
      (row - (rows - 1) / 2) * pitch +
      jitter(index + 7) * tile * 0.06,
    angle: jitter(index + 13) * 0.2,
  };
}

export function NoResults({
  title = "No results found",
  description = "Try one of these popular searches instead.",
  suggestions = SUGGESTIONS,
  onSuggestionClick,
  tiles = TILES,
  physics,
  seed,
  className,
}: {
  /** Overrides for any of the physics values. */
  physics?: Partial<NoResultsPhysics>;
  /** Repeat the same fall every time. Leave out for a different fall on every load. */
  seed?: number;
  title?: string;
  description?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  tiles?: Tile[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  // A string, so a new object with the same values doesn't restart the fall.
  const physicsKey = JSON.stringify({ ...NO_RESULTS_PHYSICS, ...physics });
  // The message comes in after the tiles, once they've fallen past it.
  const [shown, setShown] = useState(false);
  const enter = (order: number) => ({
    className: cn(
      "transition-[opacity,transform,filter] duration-250 ease-out motion-reduce:transition-none",
      shown
        ? "translate-y-0 opacity-100 blur-none"
        : "translate-y-1.5 opacity-0 blur-[4px]"
    ),
    style: { transitionDelay: shown ? `${order * 40}ms` : "0ms" },
  });

  useEffect(() => {
    const root = rootRef.current;
    const anchor = anchorRef.current;
    if (!root || !anchor) return;

    const { Engine, Bodies, Body, Composite } = Matter;
    const settings: NoResultsPhysics = JSON.parse(physicsKey);
    const runSeed = seed ?? Math.random() * 10000;
    const jitter = (n: number) => scatter(n + runSeed);
    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = settings.gravity;

    const bounds = () => ({
      width: root.clientWidth,
      height: root.clientHeight,
    });
    const { width, height } = bounds();
    const tile = tileSize(width);
    const rootBox = root.getBoundingClientRect();
    const anchorBox = anchor.getBoundingClientRect();
    const centerX = anchorBox.left - rootBox.left + anchorBox.width / 2;
    const centerY = anchorBox.top - rootBox.top + anchorBox.height / 2;
    const messageBottom = anchorBox.bottom - rootBox.top;

    // The floor and walls sit just outside the box, so tiles land on its edge.
    const wall = { isStatic: true, friction: 0.6 };
    // Resting bodies sink a couple of pixels into what holds them, so the
    // floor and walls sit FLOOR_INSET inside the box's edges to keep tiles in it.
    const floor = Bodies.rectangle(
      width / 2,
      height + 50 - FLOOR_INSET,
      width * 3,
      100,
      wall
    );
    const left = Bodies.rectangle(
      -50 + FLOOR_INSET,
      height / 2,
      100,
      height * 4,
      wall
    );
    const right = Bodies.rectangle(
      width + 50 - FLOOR_INSET,
      height / 2,
      100,
      height * 4,
      wall
    );

    const realInertia = new Map<Matter.Body, number>();
    const bodies = tiles.map((_, index) => {
      const pose = startPose(
        index,
        tiles.length,
        centerX,
        centerY,
        tile,
        jitter
      );
      const body = Bodies.rectangle(pose.x, pose.y, tile, tile, {
        chamfer: { radius: tile * BODY_RADIUS_RATIO },
        angle: pose.angle,
        restitution: settings.bounce,
        // Low, so tiles slide a long way off the pile, as in the reference.
        friction: settings.friction,
        frictionStatic: settings.staticFriction,
        frictionAir: settings.airFriction,
      });
      // Much harder to turn than a real tile, so tiles tip and lean but
      // tumble calmly.
      realInertia.set(body, body.inertia);
      Body.setInertia(body, body.inertia * settings.spinResistance);
      // The cluster opens outward as it falls, as the reference's does.
      // Lower rows start faster, so the cluster loosens on the way down and
      // the top tiles land on a pile that's already settling, not in lockstep.
      Body.setVelocity(body, {
        x: pose.offset * settings.spread + jitter(index + 21) * 0.6,
        y: settings.startSpeed * (0.55 + pose.row * 0.3),
      });
      Body.setAngularVelocity(body, jitter(index + 29) * 0.02);
      return body;
    });
    Composite.add(engine.world, [floor, left, right, ...bodies]);

    const step = () => {
      Engine.update(engine, STEP);
      for (const body of bodies) {
        if (!settings.righting) break;
        const leaningFurther = body.angle * body.angularVelocity > 0;
        if (Math.abs(body.angle) > MAX_LEAN && leaningFurther) {
          Body.setAngularVelocity(
            body,
            body.angularVelocity - Math.sign(body.angle) * LEAN_CUSHION
          );
        }
      }
    };

    const draw = () => {
      bodies.forEach((body, index) => {
        const element = tileRefs.current[index];
        if (!element) return;
        const { x, y } = body.position;
        element.style.width = `${tile}px`;
        element.style.height = `${tile}px`;
        element.style.borderRadius = `${tile * RADIUS_RATIO}px`;
        element.style.transform = `translate(${x - tile / 2}px, ${y - tile / 2}px) rotate(${body.angle}rad)`;
        element.style.visibility = "visible";
      });
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let frame = 0;
    let last = 0;
    let carry = 0;
    let runFor = 0;
    let revealed = false;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      clearTimeout(revealTimer);
      setShown(true);
    };

    const tick = (now: number) => {
      // Fixed steps keep the fall the same speed on 60Hz and 120Hz screens.
      const elapsed = Math.min(now - (last || now), 100);
      carry += elapsed;
      runFor += elapsed;
      last = now;
      while (carry >= STEP) {
        step();
        carry -= STEP;
      }
      draw();
      if (
        !revealed &&
        bodies.every((body) => body.bounds.min.y > messageBottom)
      )
        reveal();
      const woke = wakeLoose();
      const settled = !woke && bodies.every((body) => body.isSleeping);
      if (settled || runFor > MAX_RUN_MS) frame = 0;
      else frame = requestAnimationFrame(tick);
    };

    // Squares look the same every 90°, so tilt is measured from the nearest flat side.
    const tilt = (body: Matter.Body) => {
      const turn = ((body.angle % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
      return Math.min(turn, Math.PI / 2 - turn);
    };

    // A tilted tile on the floor tips toward the side its centre is past the
    // floor contact. It's held only if another tile touches it on that side;
    // a neighbour on the other side doesn't stop it falling.
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
                ? point.x > body.position.x - 2
                : point.x < body.position.x + 2
            )
        );
      });
    };

    // Checks each tile as soon as it falls asleep, not once the whole pile has,
    // so a stuck tile tips flat straight away instead of a second later.
    const wakeLoose = () => {
      if (!settings.wakeFloating) return false;
      const loose = bodies.filter(
        (body) => body.isSleeping && tilt(body) >= LOOSE_TILT && !held(body)
      );
      loose.forEach((body) => {
        Matter.Sleeping.set(body, false);
        // It falls as a real tile would, with its real weight.
        Body.setInertia(body, realInertia.get(body) ?? body.inertia);
        const nearCorner = Math.abs(body.angle) > Math.PI / 4 - 0.12;
        const target =
          Math.abs(body.angle) < UPRIGHT_BELOW
            ? 0
            : Math.round(body.angle / (Math.PI / 2)) * (Math.PI / 2);
        const push = target === 0 && nearCorner ? CORNER_PUSH : WAKE_PUSH;
        Body.setAngularVelocity(body, Math.sign(target - body.angle) * push);
      });
      return loose.length > 0;
    };

    const run = () => {
      if (frame) return;
      last = 0;
      runFor = 0;
      frame = requestAnimationFrame(tick);
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      if (reduceMotion) {
        // Skip the fall and show where the pile ends up, with the message.
        for (let i = 0; i < 1200; i++) {
          step();
          if (i % 60 === 0) wakeLoose();
        }
        draw();
        reveal();
      } else {
        revealTimer = setTimeout(reveal, REVEAL_BY_MS);
        run();
      }
    };

    draw();

    // Fall when the box comes into view, not while nobody can see it.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
      },
      { threshold: 0.4 }
    );
    visibility.observe(root);

    // Keep the floor and walls on the box's edges if it resizes.
    const resize = new ResizeObserver(() => {
      const next = bounds();
      Body.setPosition(floor, {
        x: next.width / 2,
        y: next.height + 50 - FLOOR_INSET,
      });
      Body.setPosition(left, { x: -50 + FLOOR_INSET, y: next.height / 2 });
      Body.setPosition(right, {
        x: next.width + 50 - FLOOR_INSET,
        y: next.height / 2,
      });
      if (!started) return;
      bodies.forEach((body) => Matter.Sleeping.set(body, false));
      if (reduceMotion) {
        for (let i = 0; i < 600; i++) step();
        draw();
      } else {
        run();
      }
    });
    resize.observe(root);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(revealTimer);
      visibility.disconnect();
      resize.disconnect();
      Engine.clear(engine);
    };
  }, [tiles, physicsKey, seed]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex size-full min-h-[24rem] flex-col items-center overflow-hidden px-6 pt-16 text-center",
        className
      )}
    >
      <div ref={anchorRef} className="flex flex-col items-center">
        <p {...enter(0)}>
          <span className="text-base font-semibold text-foreground">
            {title}
          </span>
        </p>
        <p {...enter(1)}>
          <span className="mt-1 block text-sm text-muted-foreground">
            {description}
          </span>
        </p>
        {suggestions.length > 0 && (
          <div
            {...enter(2)}
            className={cn(
              "mt-5 flex max-w-sm flex-wrap justify-center gap-2",
              enter(2).className
            )}
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-foreground/10"
              >
                <Search
                  className="size-3.5 text-muted-foreground"
                  aria-hidden
                />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {tiles.map((tile, index) => (
        <div
          key={tile.name}
          ref={(element) => {
            tileRefs.current[index] = element;
          }}
          aria-hidden
          // Hidden until the first physics frame sizes and places it.
          style={{
            visibility: "hidden",
            background: tile.background,
            color: tile.color,
          }}
          className="pointer-events-none absolute top-0 left-0 flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-black/10 will-change-transform dark:ring-white/10"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-[55%]"
            fill="currentColor"
            aria-hidden
          >
            <path d={tile.path} />
          </svg>
        </div>
      ))}
    </div>
  );
}
