"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import styles from "./note.module.css";

const SETTLE = { type: "spring", stiffness: 420, damping: 24 } as const;
// Paper on a desk: it slides a little after you let go, then friction stops it.
const SLIDE = { power: 0.12, timeConstant: 160 };
const LIFT = { scale: 1.04, rotate: 1.5 };

type Bounds = { top: number; right: number; bottom: number; left: number };

// Whatever was touched last sits on top, the same way it would on a desk.
let topLayer = 10;

export function Sticker({
  className,
  style,
  children,
}: {
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);
  const [layer, setLayer] = useState<number>();
  const [bounds, setBounds] = useState<Bounds>();

  return (
    <motion.div
      drag
      dragConstraints={bounds}
      dragElastic={0.12}
      dragMomentum={!reduceMotion}
      dragTransition={SLIDE}
      whileTap={reduceMotion ? undefined : LIFT}
      whileDrag={reduceMotion ? undefined : LIFT}
      transition={SETTLE}
      // Bounds come from the page's size now, not when the note first loaded.
      onPointerDown={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const page = document.documentElement;
        const left = box.left + window.scrollX;
        const top = box.top + window.scrollY;
        dragged.current = false;
        setLayer(++topLayer);
        setBounds({
          top: y.get() - top,
          right: x.get() + page.scrollWidth - left - box.width,
          bottom: y.get() + page.scrollHeight - top - box.height,
          left: x.get() - left,
        });
      }}
      onDragStart={() => {
        dragged.current = true;
      }}
      // Dragging by a link shouldn't follow it when the pointer lets go.
      onClickCapture={(event) => {
        if (!dragged.current) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      style={{ ...style, x, y, zIndex: layer }}
      className={`${styles.sticker} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Intro animations run once. Coming back to the page later shouldn't make anyone
// sit through the writing again, though a full reload starts it fresh.
let played = false;

export function NoteIntro() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (played) root.dataset.noteSeen = "";
    // On a timer so React's double mount in development doesn't count as a visit.
    const timer = setTimeout(() => {
      played = true;
    }, 1000);

    return () => {
      clearTimeout(timer);
      delete root.dataset.noteSeen;
    };
  }, []);

  return null;
}
