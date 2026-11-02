"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "motion/react";
import { useRef, useState } from "react";
import { PlaceholderImage } from "next-image-placeholder/react";
import { getPlaceholderAction } from "@/actions/get-image-placeholder";

type ImgItem = { id: number; url: string; alt: string };

const CARD_IMAGES: ImgItem[] = [
  {
    id: 1,
    url: "https://www.gidl.dev/art/saz-leaf-tile.jpg",
    alt: "Tile with saz leaves, tulips and hyacinth flowers",
  },
  {
    id: 2,
    url: "https://www.gidl.dev/art/blue-and-white-vase.jpg",
    alt: "Blue-and-white vase",
  },
  {
    id: 3,
    url: "https://www.gidl.dev/art/iznik-wall-tile.jpg",
    alt: "Wall tile",
  },
  {
    id: 4,
    url: "https://www.gidl.dev/art/beaker-vase.jpg",
    alt: "Blue-and-white beaker vase",
  },
  {
    id: 5,
    url: "https://www.gidl.dev/art/iznik-tile-panel.jpg",
    alt: "Tile panel",
  },
  {
    id: 6,
    url: "https://www.gidl.dev/art/bottle-vase.jpg",
    alt: "Blue-and-white bottle vase",
  },
];

export const FlipCard = () => {
  const constraintRef = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState(CARD_IMAGES);

  const handleCardDismiss = () => {
    setCards((prev) => {
      const first = prev[0];
      if (!first) return prev;
      return [...prev.slice(1), first];
    });
  };

  return (
    <div className="relative h-[400px] md:h-[600px]">
      <AnimatePresence initial={false}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={cards.length}
            onDismiss={index === 0 ? handleCardDismiss : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Card = ({
  card,
  index,
  totalCards,
  onDismiss,
}: {
  card: ImgItem;
  index: number;
  totalCards: number;
  onDismiss?: () => void;
}) => {
  const isTopCard = index === 0;
  const rotation = -index * 7;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (onDismiss) {
      onDismiss();
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-1/2 w-[150px] h-[250px] overflow-hidden rounded-xl bg-neutral-200 md:w-[300px] md:h-[400px] dark:bg-neutral-800",
        isTopCard ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      )}
      initial={false}
      style={{
        x,
        y,
        zIndex: totalCards - index,
        touchAction: isTopCard ? "none" : "auto",
      }}
      animate={{
        rotate: rotation,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      drag={isTopCard}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.5}
      dragTransition={{
        bounceStiffness: 700,
        bounceDamping: 40,
      }}
      whileHover={isTopCard ? { scale: 1.03 } : undefined}
      // whileDrag={isTopCard ? { scale: 1.05 } : undefined}
      onDragEnd={isTopCard ? handleDragEnd : undefined}
    >
      <PlaceholderImage
        src={card.url}
        action={getPlaceholderAction}
        alt={card.alt}
        fill
        unoptimized
        fallback={
          <div className="absolute inset-0 animate-pulse bg-neutral-100 dark:bg-neutral-700" />
        }
        className="pointer-events-none rounded-xl object-cover"
        style={{
          userSelect: "none",
          // @ts-ignore
          WebkitUserDrag: "none",
        }}
      />
    </motion.div>
  );
};
