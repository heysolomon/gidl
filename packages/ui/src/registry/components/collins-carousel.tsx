"use client";

import { Carousel, useTicker, useTickerItem } from "@/lib/motion-carousel";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useRef } from "react";
import { PlaceholderImage } from "next-image-placeholder/react";
import { getPlaceholderAction } from "@/actions/get-location-data";

function CarouselItem({
  item,
  count,
}: {
  item: { src: string; title: string };
  count: number;
}) {
  const { offset, props, start, end, itemIndex } = useTickerItem();
  const { renderedOffset, totalItemLength } = useTicker();
  const itemWidth = end - start;
  const draggingBeyond = useRef({ start: false, end: false });

  const isFirst = itemIndex === 0;
  const isLast = itemIndex === count - 1;

  const getKeyframes = (
    type: "rotateY" | "x" | "textOpacity"
  ): { in: number[]; out: string[] } => {
    const w = itemWidth;
    if (type === "rotateY") {
      if (isFirst)
        return {
          in: [-w, -w / 2, 0, w],
          out: ["40deg", "25deg", "0deg", "-15deg"],
        };
      if (isLast)
        return {
          in: [-w, 0, w / 2, w],
          out: ["15deg", "0deg", "-25deg", "-40deg"],
        };
      return {
        in: [-w, -w / 2, 0, w / 2, w],
        out: ["40deg", "25deg", "0deg", "-25deg", "-40deg"],
      };
    }
    if (type === "x") {
      if (isFirst)
        return { in: [w, 0, -w / 2, -w], out: ["30%", "0%", "-45.5%", "-30%"] };
      if (isLast)
        return { in: [w, w / 2, 0, -w], out: ["30%", "45.5%", "0%", "-30%"] };
      return {
        in: [w, w / 2, 0, -w / 2, -w],
        out: ["30%", "45.5%", "0%", "-45.5%", "-30%"],
      };
    }
    // textOpacity
    if (isFirst)
      return { in: [-w, -w / 4, 0, w], out: ["0%", "0%", "100%", "0%"] };
    if (isLast)
      return { in: [-w, 0, w / 4, w], out: ["0%", "100%", "0%", "0%"] };
    return {
      in: [-w, -w / 4, 0, w / 4, w],
      out: ["0%", "0%", "100%", "0%", "0%"],
    };
  };

  const rotateYKF = getKeyframes("rotateY");
  const xKF = getKeyframes("x");
  const textOpacityKF = getKeyframes("textOpacity");

  const rotateY = useTransform(offset, rotateYKF.in, rotateYKF.out);
  const x = useTransform(offset, xKF.in, xKF.out);
  const textOpacity = useTransform(offset, textOpacityKF.in, textOpacityKF.out);

  const z = useTransform(offset, (value) => {
    const { start: beyondStart, end: beyondEnd } = draggingBeyond.current;
    if (beyondStart) return Math.abs(start / itemWidth) * -(itemWidth * 0.55);
    if (beyondEnd)
      return (
        Math.abs((end - totalItemLength) / itemWidth) * -(itemWidth * 0.55)
      );
    return Math.abs(value / itemWidth) * -(itemWidth * 0.55);
  });



  const edgeX = useTransform(renderedOffset, (r) => {
    const { start: beyondStart, end: beyondEnd } = draggingBeyond.current;
    if (beyondStart) return Math.abs((r / 50) * (count + itemIndex * 2));
    if (beyondEnd) {
      const diff = Math.abs(r) - Math.abs(totalItemLength - itemWidth);
      return -(diff / 50) * (count * 3 - itemIndex * 2 - 2);
    }
    return 0;
  });

  const opacity = useTransform(offset, (value) => {
    const { start: beyondStart, end: beyondEnd } = draggingBeyond.current;
    if (beyondStart) return itemIndex <= 1 ? 1 : 0;
    if (beyondEnd) return itemIndex >= count - 2 ? 1 : 0;
    if (value > end + itemWidth / 2 || value < -end - itemWidth / 2) return 0;
    return 1;
  });

  const zIndex = useTransform(offset, (value) =>
    Math.max(0, Math.round(1000 - Math.abs(value)))
  );

  useMotionValueEvent(renderedOffset, "change", (r) => {
    draggingBeyond.current = {
      start: r > 0,
      end: Math.abs(totalItemLength - itemWidth) < Math.abs(r),
    };
  });

  return (
    <motion.li {...props} style={{ ...props.style, zIndex }} className="w-full h-full">
      <motion.div
        style={{
          x: edgeX,
        }}
        className="size-full"
      >
        <motion.div className="size-full">
          <motion.div
            style={{
              transformPerspective: itemWidth * 2,
              transformStyle: "preserve-3d",
              x,
              z,
              rotateY,
              opacity,
            }}
            className="flex flex-col justify-center will-change-transform"
          >
            <div className="relative aspect-[3/4] h-full w-full overflow-hidden rounded-xl md:rounded-2xl">
              <PlaceholderImage
                src={item.src}
                action={getPlaceholderAction}
                alt={item.title}
                fill
                fallback={
                  <div className="absolute inset-0 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800 md:rounded-2xl" />
                }
                className="pointer-events-none object-cover"
                style={{
                  userSelect: "none",
                  // @ts-ignore
                  WebkitUserDrag: "none",
                }}
              />
            </div>
            <motion.div
              style={{ opacity: textOpacity }}
              className="mt-6 text-center font-sans md:mt-8"
            >
              {item.title}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.li>
  );
}

export default function CollinsCarousel() {
  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <Carousel
        className="w-[85vw] max-w-[320px] cursor-grab active:cursor-grabbing"
        items={ITEMS.map((item, index) => (
          <CarouselItem key={index} item={item} count={ITEMS.length} />
        ))}
        loop={false}
        layout="stack"
        overflow
        gap={0}
        itemSize="manual"
        safeMargin={200}
        dragElastic={0.5}
        dragSensitivity={1}
        momentumMultiplier={0.1}
        springConfig={{ stiffness: 100, damping: 20, mass: 1.2 }}
      />
    </div>
  );
}

const ITEMS = [
  {
    src: "/carousel/precision-stylus.png",
    title: "Precision Stylus",
  },
  {
    src: "/carousel/zenith-kettle.png",
    title: "Zenith Kettle",
  },
  {
    src: "/carousel/prism-table-lamp.png",
    title: "Prism Table Lamp",
  },
  {
    src: "/carousel/studio-mic-arm.png",
    title: "Studio Mic Arm",
  },
  {
    src: "/carousel/monitor-stand.png",
    title: "Vertex Monitor Stand",
  },
];
