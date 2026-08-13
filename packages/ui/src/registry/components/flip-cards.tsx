"use client";

import { cn } from "../../lib/utils";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "motion/react";
import { useRef, useState } from "react";
import { PlaceholderImage } from "next-image-placeholder/react";
import { getPlaceholderAction } from "@/actions/get-location-data";

type ImgItem = { id: number; url: string };

const CARD_IMAGES: ImgItem[] = [
  {
    id: 1,
    url: "https://i.pinimg.com/736x/57/41/48/574148dab4a394849534eae05fe5628b.jpg",
  },
  {
    id: 2,
    url: "https://i.pinimg.com/736x/85/f3/61/85f361f859cd06b55e5d14fe09e4b9f8.jpg",
  },
  {
    id: 3,
    url: "https://i.pinimg.com/736x/4f/62/d2/4f62d2bc39cb6092fe4dedb978c285c5.jpg",
  },
  {
    id: 4,
    url: "https://i.pinimg.com/1200x/54/9e/0e/549e0e7ad7e492ba4766f0bbdfe5e0c8.jpg",
  },
  {
    id: 5,
    url: "https://i.pinimg.com/736x/5b/6d/ee/5b6dee0124a9ccb6e890357521648104.jpg",
  },
  {
    id: 6,
    url: "https://i.pinimg.com/736x/fd/ab/cb/fdabcb91d2df70207bb8740029cb8a18.jpg",
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
        "absolute top-1/2 left-1/2 -translate-1/2 w-[150px] h-[250px] md:w-[300px] md:h-[400px]",
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
        alt={`Card ${card.id}`}
        fill
        fallback={
          <div className="absolute inset-0 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
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
