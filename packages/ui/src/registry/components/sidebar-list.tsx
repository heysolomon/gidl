"use client";

import { useEffect, useRef, useState } from "react";
import { PanelLeft, Plus } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
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

const ROW_HEIGHT = 39;
const ROW_PITCH = 44;
// Distance the toggle stops short of the panel's width, keeping it 24px from
// the panel's right edge when open and 28px from the frame when collapsed.
const TOGGLE_TRAVEL_INSET = 44;

// The slide has a little overshoot, the pills have none.
const SLIDE_SPRING = { stiffness: 180, damping: 19 };
const PILL_SPRING = { stiffness: 380, damping: 39 };
// How long the second of the panel and toggle waits behind the first.
const STAGGER_CLOSE_MS = 40;
const STAGGER_OPEN_MS = 30;

const PANEL_WIDTH_CLASS = "w-[297px] max-w-[calc(100%-1rem)]";

export function SidebarList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const reduceMotion = useReducedMotion();

  // 1 is open and 0 is collapsed. They run past 1 on the way back, which is
  // the overshoot. Two values rather than one because the toggle and panel
  // trade places: the toggle leaves first, and the panel arrives first.
  const panelProgress = useSpring(1, SLIDE_SPRING);
  const toggleProgress = useSpring(1, SLIDE_SPRING);
  const staggerTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(staggerTimer.current), []);

  // Percentages, so the slide follows the panel if the frame squeezes it.
  const panelX = useTransform(
    panelProgress,
    (v) => `calc(${v - 1} * (100% + 0.5rem))`
  );
  const toggleX = useTransform(
    toggleProgress,
    (v) => `calc(${v} * (100% - ${TOGGLE_TRAVEL_INSET}px))`
  );

  const activeY = useSpring(0, PILL_SPRING);
  const hoverY = useSpring(0, PILL_SPRING);
  const showHover = hoveredIndex !== null && hoveredIndex !== activeIndex;

  const moveTo = (value: MotionValue<number>, index: number) => {
    if (reduceMotion) value.jump(index * ROW_PITCH);
    else value.set(index * ROW_PITCH);
  };

  const handleHover = (index: number) => {
    // A hover that's just starting has nowhere to slide from.
    if (showHover) moveTo(hoverY, index);
    else hoverY.jump(index * ROW_PITCH);
    setHoveredIndex(index);
  };

  const handleSelect = (index: number) => {
    moveTo(activeY, index);
    setActiveIndex(index);
  };

  const handleToggle = () => {
    const next = !collapsed;
    const target = next ? 0 : 1;
    setCollapsed(next);

    clearTimeout(staggerTimer.current);
    if (reduceMotion) {
      panelProgress.jump(target);
      toggleProgress.jump(target);
      return;
    }

    // A timer because useSpring has no delay. Setting a spring mid-slide keeps
    // its velocity, so toggling again turns it around rather than restarting.
    const [first, second] = next
      ? [toggleProgress, panelProgress]
      : [panelProgress, toggleProgress];
    first.set(target);
    staggerTimer.current = setTimeout(
      () => second.set(target),
      next ? STAGGER_CLOSE_MS : STAGGER_OPEN_MS
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-muted">
      <motion.div
        initial={false}
        style={{ x: panelX }}
        animate={{
          opacity: collapsed ? 0 : 1,
          filter: collapsed ? "blur(6px)" : "blur(0px)",
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.24, ease: "easeOut", delay: collapsed ? 0 : 0.05 }
        }
        className={cn(
          "absolute inset-y-2 left-2 rounded-3xl bg-background",
          PANEL_WIDTH_CLASS,
          collapsed && "pointer-events-none"
        )}
      >
        <motion.button
          type="button"
          initial={false}
          animate={{
            opacity: collapsed ? 0 : 1,
            filter: collapsed ? "blur(4px)" : "blur(0px)",
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : collapsed
                ? { duration: 0.1, ease: "easeOut" }
                : { duration: 0.2, ease: "easeOut", delay: 0.2 }
          }
          tabIndex={collapsed ? -1 : undefined}
          aria-hidden={collapsed}
          aria-label="Add canvas"
          className="absolute right-[35px] top-2.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <Plus className="size-4" />
        </motion.button>

        <nav
          id="sidebar-list-nav"
          aria-hidden={collapsed}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ rowGap: ROW_PITCH - ROW_HEIGHT }}
          className="absolute inset-x-2 top-12 flex flex-col"
        >
          <motion.span
            aria-hidden
            style={{ y: activeY, height: ROW_HEIGHT }}
            className="absolute inset-x-0 top-0 rounded-2xl bg-foreground/[0.03] dark:bg-foreground/[0.06]"
          />
          <motion.span
            aria-hidden
            initial={false}
            style={{ y: hoverY, height: ROW_HEIGHT }}
            animate={{ opacity: showHover ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.12, ease: "easeOut" }}
            className="absolute inset-x-0 top-0 rounded-2xl bg-foreground/[0.03] dark:bg-foreground/[0.06]"
          />

          {ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              tabIndex={collapsed ? -1 : undefined}
              onClick={() => handleSelect(index)}
              onMouseEnter={() => handleHover(index)}
              style={{ height: ROW_HEIGHT }}
              className="relative z-10 flex cursor-pointer items-center rounded-2xl px-4 text-left text-base"
            >
              <span
                className={cn(
                  "font-normal transition-colors duration-150",
                  index === activeIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Outside the panel so its blur and fade don't touch the toggle, which
          stays sharp the whole way across. Same box as the panel, because the
          toggle's travel is defined by the panel's width. */}
      <motion.div
        style={{ x: toggleX }}
        className={cn(
          "pointer-events-none absolute left-2 top-2",
          PANEL_WIDTH_CLASS
        )}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={!collapsed}
          aria-controls="sidebar-list-nav"
          aria-label="Toggle sidebar"
          className="pointer-events-auto ml-1.5 mt-2.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <PanelLeft className="size-4" />
        </button>
      </motion.div>
    </div>
  );
}
