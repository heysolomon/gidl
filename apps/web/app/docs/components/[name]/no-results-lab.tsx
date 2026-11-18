"use client";

import { useState } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { NO_RESULTS_PHYSICS, NoResults } from "@gidl/ui";

const D = NO_RESULTS_PHYSICS;

/** Development only: tunes No Results' physics live, and drops it again. */
export function NoResultsLab() {
  const [run, setRun] = useState(0);
  const [seed, setSeed] = useState<number | undefined>(undefined);

  const dials = useDialKit(
    "No Results physics",
    {
      fall: {
        gravity: [D.gravity, 0.2, 2, 0.05],
        startSpeed: [D.startSpeed, 0, 12, 0.5],
        spread: [D.spread, 0, 4, 0.1],
      },
      contact: {
        friction: [D.friction, 0, 1, 0.01],
        staticFriction: [D.staticFriction, 0, 1, 0.01],
        bounce: [D.bounce, 0, 0.8, 0.01],
        airFriction: [D.airFriction, 0, 0.06, 0.001],
      },
      spin: {
        spinResistance: [D.spinResistance, 1, 10, 0.5],
        righting: D.righting,
        wakeFloating: D.wakeFloating,
      },
      repeatSameFall: false,
      dropAgain: { type: "action" as const },
    },
    {
      id: "no-results-physics",
      onAction: () => {
        setRun((value) => value + 1);
      },
    }
  );

  // A fixed seed only while "repeat same fall" is on, so changes can be compared
  // on the same fall. Off, every drop is a new random one.
  const fixed = dials.repeatSameFall;
  if (fixed && seed === undefined) setSeed(Math.random() * 10000);
  if (!fixed && seed !== undefined) setSeed(undefined);

  return (
    <>
      <div className="h-110 w-full">
        <NoResults
          key={run}
          seed={fixed ? seed : undefined}
          physics={{
            gravity: dials.fall.gravity,
            startSpeed: dials.fall.startSpeed,
            spread: dials.fall.spread,
            friction: dials.contact.friction,
            staticFriction: dials.contact.staticFriction,
            bounce: dials.contact.bounce,
            airFriction: dials.contact.airFriction,
            spinResistance: dials.spin.spinResistance,
            righting: dials.spin.righting,
            wakeFloating: dials.spin.wakeFloating,
          }}
        />
      </div>
      <DialRoot position="top-left" />
    </>
  );
}
