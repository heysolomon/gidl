import type { CSSProperties } from "react";
import styles from "./note.module.css";

// The note is too long for anything to pretend it's being written live, so the
// words soak into the paper instead, in a wave that follows reading order. Each
// word starts long before the last one has finished, which keeps the front of the
// wave soft. The pauses are small: they're there for rhythm, not to make you wait.
const WORD_GAP = 4.2;
const REST_AT_COMMA = 10;
const REST_AT_FULL_STOP = 20;
const REST_AT_PARAGRAPH = 28;
// A signature is one continuous stroke, so it's the one thing that gets drawn.
const SIGNATURE_LENGTH = 620;

export function createInk(start: number) {
  let time = start;

  const stamp = (at: number) =>
    ({ "--t": `${Math.round(at)}ms` }) as CSSProperties;

  const write = (text: string) =>
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((part, index) => {
        if (!part.trim()) return " ";

        const style = stamp(time);
        time += WORD_GAP;
        if (/[.!?:]$/.test(part)) time += REST_AT_FULL_STOP;
        else if (part.endsWith(",")) time += REST_AT_COMMA;

        return (
          <span key={index} className={styles.word} style={style}>
            {part}
          </span>
        );
      });

  const sign = (text: string) => {
    const style = {
      ...stamp(time),
      "--d": `${SIGNATURE_LENGTH}ms`,
    } as CSSProperties;
    time += SIGNATURE_LENGTH;
    return (
      <span className={styles.signed} style={style}>
        {text}
      </span>
    );
  };

  return {
    write,
    sign,
    // Renders nothing. It sits between paragraphs so the rests read in order.
    rest: () => {
      time += REST_AT_PARAGRAPH;
      return null;
    },
    /** A style stamp for something that arrives as the wave reaches it. */
    at: (offset = 0) => stamp(time + offset),
  };
}
