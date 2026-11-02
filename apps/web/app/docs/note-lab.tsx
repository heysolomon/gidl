"use client";

import { useState } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { NOTE_DEFAULTS, WelcomeNote, type NoteOptions } from "./welcome-note";

const select = <T extends string>(
  options: { value: T; label: string }[],
  value: T
) => ({ type: "select" as const, options, default: value });

/** Development only: switches between versions of the welcome note live. */
export function NoteLab() {
  const [run, setRun] = useState(0);
  const dials = useDialKit(
    "Welcome note",
    {
      surface: select(
        [
          { value: "card", label: "Card" },
          { value: "plain", label: "No container" },
          { value: "paper", label: "Ruled paper" },
        ],
        NOTE_DEFAULTS.surface
      ),
      text: select(
        [
          { value: "sans", label: "Normal font" },
          { value: "hand", label: "Handwriting" },
        ],
        NOTE_DEFAULTS.type
      ),
      images: select(
        [
          { value: "loose", label: "Stuck in the text" },
          { value: "row", label: "Tidy row at the end" },
          { value: "none", label: "No images" },
        ],
        NOTE_DEFAULTS.images
      ),
      imageText: select(
        [
          { value: "sans", label: "Normal font" },
          { value: "hand", label: "Handwriting" },
        ],
        NOTE_DEFAULTS.imageText
      ),
      penMarks: NOTE_DEFAULTS.marks,
      draggable: NOTE_DEFAULTS.draggable,
      intro: select(
        [
          { value: "soak", label: "Soak in" },
          { value: "rise", label: "Rise and fade" },
          { value: "none", label: "No animation" },
        ],
        NOTE_DEFAULTS.intro
      ),
      replay: { type: "action" as const },
    },
    { id: "welcome-note", onAction: () => setRun((value) => value + 1) }
  );

  const options: NoteOptions = {
    surface: dials.surface as NoteOptions["surface"],
    type: dials.text as NoteOptions["type"],
    images: dials.images as NoteOptions["images"],
    imageText: dials.imageText as NoteOptions["imageText"],
    marks: dials.penMarks,
    draggable: dials.draggable,
    intro: dials.intro as NoteOptions["intro"],
  };

  return (
    <>
      {/* The key restarts the intro, and clears anything dragged out of place. */}
      <WelcomeNote key={`${run}-${options.images}`} options={options} />
      <DialRoot position="top-left" />
    </>
  );
}
