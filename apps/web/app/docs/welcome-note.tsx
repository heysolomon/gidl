"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { createInk } from "./note-ink";
import { Sticker } from "./note-sticker";
import styles from "./note.module.css";

export type NoteOptions = {
  surface: "card" | "plain" | "paper";
  type: "sans" | "hand";
  images: "loose" | "row" | "none";
  imageText: "sans" | "hand";
  marks: boolean;
  draggable: boolean;
  intro: "soak" | "rise" | "none";
};

export const NOTE_DEFAULTS: NoteOptions = {
  surface: "plain",
  type: "sans",
  images: "loose",
  imageText: "sans",
  marks: true,
  draggable: true,
  intro: "soak",
};

// The surface lands first, and the words start before it has fully settled, so
// the two read as one arrival rather than a queue.
const INK_STARTS_AT = 180;

export function WelcomeNote({ options }: { options: NoteOptions }) {
  const { surface, type, images, imageText, marks, draggable, intro } = options;
  const ink = createInk(INK_STARTS_AT);
  const loose = images === "loose";

  const tapedPrint = (style: CSSProperties) => (
    <figure
      className={`${styles.float} ${styles.placed} ${styles.print} ${styles.wide}`}
      style={style}
    >
      <span className={styles.tape} aria-hidden />
      <Image
        src="/art/yokkaichi-mie-river.jpg"
        alt="Hiroshige's woodblock print of a windswept river crossing at Yokkaichi"
        width={200}
        height={133}
      />
    </figure>
  );

  const clippedPrint = (style: CSSProperties, arrowStyle: CSSProperties) => (
    <figure
      className={`${styles.float} ${styles.placed} ${styles.print} ${styles.tall}`}
      style={style}
    >
      <svg className={styles.clip} viewBox="0 0 22 62" fill="none" aria-hidden>
        <path
          d="M7 16v32a6 6 0 0 0 12 0V10a8 8 0 0 0-16 0v38"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {marks && (
        <svg
          className={styles.arrow}
          viewBox="0 0 70 44"
          fill="none"
          aria-hidden
        >
          <path
            className={styles.drawn}
            style={arrowStyle}
            pathLength={1}
            d="M66 6C44 2 22 12 8 36M8 36l-3-11M8 36l11-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <Image
        src="/art/flowers-in-a-glass.jpg"
        alt="Bosschaert's painting of a bouquet in a glass vase"
        width={124}
        height={148}
      />
      <figcaption className={styles.caption}>from the Carousel</figcaption>
    </figure>
  );

  const tileStack = (tile: CSSProperties, vellum: CSSProperties) => (
    <div className={`${styles.float} ${styles.vellumStack}`}>
      <Sticker
        movable={draggable}
        className={`${styles.placed} ${styles.vellumPrint}`}
        style={tile}
      >
        <Image
          src="/art/iznik-wall-tile.jpg"
          alt="An Iznik wall tile with blue tulips and carnations"
          width={114}
          height={152}
          draggable={false}
        />
      </Sticker>
      <Sticker
        movable={draggable}
        className={`${styles.placed} ${styles.vellum}`}
        style={vellum}
      >
        <p>Not just poke around in it. Actually ship with it.</p>
      </Sticker>
    </div>
  );

  const stickyNote = (style: CSSProperties) => (
    <Sticker
      movable={draggable}
      className={`${styles.float} ${styles.placed} ${styles.sticky}`}
      style={style}
    >
      <p>
        If you&apos;ve been rocking with this, a follow on{" "}
        <a
          href="https://x.com/heysolomon"
          target="_blank"
          rel="noreferrer"
          draggable={false}
        >
          X
        </a>{" "}
        means a lot.
      </p>
    </Sticker>
  );

  return (
    <article
      className={styles.note}
      data-surface={surface}
      data-type={type}
      data-image-text={imageText}
      data-intro={intro}
    >
      {surface === "paper" && (
        <>
          <div className={styles.band} aria-hidden />
          <div className={styles.sheet} aria-hidden />
        </>
      )}
      <div className={styles.writing}>
        <header className={styles.head}>
          <h1 className={styles.title}>
            {ink.write("Glad you found my work")}
            {marks && (
              <svg
                className={styles.titleLine}
                viewBox="0 0 400 10"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  className={styles.drawn}
                  style={ink.at()}
                  pathLength={1}
                  d="M2 6c58-4 118-5 176-3 66 2 132 1 220-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </h1>
        </header>
        {ink.rest()}

        <div className={styles.body}>
          {loose && tapedPrint(ink.at(120))}

          <p>{ink.write("Not gonna lie, I didn't plan to build a library.")}</p>
          {ink.rest()}
          <p>
            {ink.write(
              "I just wanted a playground. Somewhere to recreate animations I kept seeing on X, poke at products I loved, and rebuild little pieces of them just to see if I could."
            )}
          </p>
          {ink.rest()}
          <p>
            {ink.write(
              "So I built one. Dropped the pieces in. Figured a few people might poke around and tell me what sucked."
            )}
          </p>
          {ink.rest()}

          {loose && clippedPrint(ink.at(), ink.at(420))}

          <p>
            {ink.write(
              "Then I posted a couple of components on X. One of them, the "
            )}
            <span className={styles.together}>
              <span className={styles.circled}>
                {ink.write("Collins Carousel")}
                {marks && (
                  <svg
                    className={styles.circle}
                    viewBox="0 0 200 40"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      className={styles.drawn}
                      style={ink.at(60)}
                      pathLength={1}
                      d="M30 8C70 1 150 1 186 12c18 8 6 20-30 24-48 5-118 4-144-8C-6 18 18 5 62 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              {ink.write(",")}
            </span>{" "}
            {ink.write("had lots of impressions.")}
          </p>
          {ink.rest()}
          <p>
            {ink.write(
              "Someone even asked where to grab it. I wasn't even expecting that."
            )}
          </p>
          {ink.rest()}
          <p>
            {ink.write(
              "That made this feel less like my thing and more like something worth actually building out, something other people could use."
            )}
          </p>
          {ink.rest()}
          <p>
            {ink.write(
              "So here we are. What started as a playground for myself is turning into a component library you can use in your own projects."
            )}
          </p>
          {ink.rest()}

          {loose && tileStack(ink.at(), ink.at(160))}
          {loose && stickyNote(ink.at(320))}

          {images === "none" && (
            <p>
              {ink.write("Not just poke around in it. Actually ship with it.")}
            </p>
          )}
          <p>
            {ink.write(
              "I'm already working on a couple new components to add in. This is just the start."
            )}
          </p>
          {ink.rest()}
          {images === "none" && (
            <p>
              {ink.write("If you've been rocking with this, a follow on ")}
              <a
                href="https://x.com/heysolomon"
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>{" "}
              {ink.write("means a lot.")}
            </p>
          )}
          <p className={styles.signature}>
            {ink.sign("with love, Solomon :)")}
          </p>

          {images === "row" && (
            <div className={styles.row}>
              {tapedPrint(ink.at())}
              {clippedPrint(ink.at(80), ink.at(420))}
              {tileStack(ink.at(160), ink.at(220))}
              {stickyNote(ink.at(300))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
