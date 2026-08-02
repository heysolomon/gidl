"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  PanInfo,
  MotionValue,
} from "motion/react";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  createContext,
  useContext,
} from "react";
import {
  CarouselProps,
  TickerContextValue,
  TickerItemContextValue,
  CarouselContextValue,
} from "./types";

// Contexts
const TickerContext = createContext<TickerContextValue | null>(null);
const TickerItemContext = createContext<TickerItemContextValue | null>(null);
const CarouselContext = createContext<CarouselContextValue | null>(null);

// Internal context for sharing raw offset across items
interface InternalCarouselContext {
  rawOffset: MotionValue<number>;
  springOffset: MotionValue<number>;
  containerWidth: number;
  itemWidths: number[];
  gap: number;
  layout?: "row" | "stack";
}
const InternalCarouselContext = createContext<InternalCarouselContext | null>(
  null
);

function CarouselItemWrapper({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const internalContext = useContext(InternalCarouselContext);
  if (!internalContext) return <>{children}</>;

  const { springOffset, containerWidth, itemWidths, gap, layout } =
    internalContext;

  // Calculate this item's position
  const itemStart = useMemo(() => {
    let pos = 0;
    for (let i = 0; i < index; i++) {
      pos += (itemWidths[i] || 0) + gap;
    }
    return pos;
  }, [index, itemWidths, gap]);

  const itemWidth = itemWidths[index] || 0;
  const itemCenter = itemStart + itemWidth / 2;
  const viewportCenter = containerWidth / 2;

  // Total length of all items
  const totalItemLength = useMemo(() => {
    return itemWidths.reduce(
      (sum, w, i) => sum + w + (i < itemWidths.length - 1 ? gap : 0),
      0
    );
  }, [itemWidths, gap]);

  // offset: The item's center position relative to viewport center
  // When offset = 0, the item is centered
  // When offset > 0, the item is to the right of center
  // When offset < 0, the item is to the left of center
  const offset = useTransform(springOffset, (scrollValue) => {
    // scrollValue is negative when scrolling right (viewing later items)
    // Item's current position = itemCenter + scrollValue
    // Offset from viewport center = itemCenter + scrollValue - viewportCenter
    return itemCenter + scrollValue - viewportCenter;
  });

  const itemContext: TickerItemContextValue = useMemo(
    () => ({
      offset,
      props: {
        style: {
          position: "relative" as const,
          flexShrink: 0,
          ...(layout === "stack" && { gridArea: "stack" }),
        },
        "data-index": index,
      },
      start: itemStart,
      end: itemStart + itemWidth,
      itemIndex: index,
    }),
    [offset, index, itemStart, itemWidth, layout]
  );

  const tickerContext: TickerContextValue = useMemo(
    () => ({
      renderedOffset: springOffset,
      totalItemLength,
      itemCount: itemWidths.length,
    }),
    [springOffset, totalItemLength, itemWidths.length]
  );

  return (
    <TickerContext.Provider value={tickerContext}>
      <TickerItemContext.Provider value={itemContext}>
        {children}
      </TickerItemContext.Provider>
    </TickerContext.Provider>
  );
}

export function Carousel({
  items,
  loop = true,
  overflow = false,
  gap = 16,
  itemSize = "auto",
  safeMargin = 0,
  dragElastic = 0.2,
  dragSensitivity = 1,
  momentumMultiplier = 0.8,
  springConfig = { stiffness: 300, damping: 30, mass: 0.8 },
  axis = "x",
  layout = "row",
  className,
  children,
}: CarouselProps) {
  const containerRef = useRef<HTMLUListElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Main offset motion value - this tracks the current scroll position
  const rawOffset = useMotionValue(0);
  const springOffset = useSpring(rawOffset, springConfig);

  // Calculate total width of all items
  const totalItemLength = useMemo(() => {
    return itemWidths.reduce(
      (sum, w, i) => sum + w + (i < itemWidths.length - 1 ? gap : 0),
      0
    );
  }, [itemWidths, gap]);

  // Calculate item centers for snapping
  const itemCenters = useMemo(() => {
    const centers: number[] = [];
    let pos = 0;
    for (let i = 0; i < itemWidths.length; i++) {
      const width = itemWidths[i] ?? 0;
      centers.push(pos + width / 2);
      pos += width + gap;
    }
    return centers;
  }, [itemWidths, gap]);

  // Measure items after mount
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    setContainerWidth(container.offsetWidth);

    const measureItems = () => {
      const widths: number[] = [];
      const itemElements = container.querySelectorAll(":scope > li");
      itemElements.forEach((element) => {
        widths.push((element as HTMLElement).offsetWidth);
      });
      setItemWidths(widths);
    };

    // Initial measurement
    measureItems();

    // Re-measure on resize
    const observer = new ResizeObserver(() => {
      setContainerWidth(container.offsetWidth);
      measureItems();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [items.length]);

  // Calculate drag limits (for non-looping carousels)
  const maxOffset = 0;
  const minOffset = useMemo(() => {
    if (itemWidths.length === 0) return 0;
    // The minimum offset positions the last item's center at viewport center
    const lastItemCenter = itemCenters[itemCenters.length - 1] || 0;
    const firstItemCenter = itemCenters[0] || 0;
    return -(lastItemCenter - firstItemCenter);
  }, [itemCenters]);

  // Pagination
  const totalPages = items.length;
  const isNextActive = loop || currentPage < totalPages - 1;
  const isPrevActive = loop || currentPage > 0;

  // Snap to nearest item
  const snapToNearest = useCallback(
    (velocity: number = 0) => {
      if (itemCenters.length === 0 || containerWidth === 0) return;

      const currentValue = rawOffset.get();
      const viewportCenter = containerWidth / 2;

      // Find the item whose center is closest to viewport center
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      itemCenters.forEach((itemCenter, index) => {
        // Where this item's center would be relative to viewport center
        const itemCurrentPos = itemCenter + currentValue - viewportCenter;

        // Factor in velocity - if moving fast, bias toward the direction of movement
        const velocityBias = velocity * momentumMultiplier;
        const adjustedDistance = Math.abs(itemCurrentPos + velocityBias);

        if (adjustedDistance < nearestDistance) {
          nearestDistance = adjustedDistance;
          nearestIndex = index;
        }
      });

      // Clamp to valid range when not looping
      if (!loop) {
        nearestIndex = Math.max(0, Math.min(nearestIndex, items.length - 1));
      }

      // Calculate target offset to center this item
      const targetItemCenter = itemCenters[nearestIndex] ?? 0;
      const targetOffset = -(targetItemCenter - viewportCenter);

      // Clamp target offset when not looping
      const clampedOffset = loop
        ? targetOffset
        : Math.max(minOffset, Math.min(maxOffset, targetOffset));

      rawOffset.set(clampedOffset);
      setCurrentPage(nearestIndex);
    },
    [
      itemCenters,
      containerWidth,
      rawOffset,
      loop,
      items.length,
      minOffset,
      maxOffset,
      momentumMultiplier,
    ]
  );

  const gotoPage = useCallback(
    (page: number) => {
      if (itemCenters.length === 0 || containerWidth === 0) return;

      let targetPage = page;
      if (loop) {
        targetPage = ((page % totalPages) + totalPages) % totalPages;
      } else {
        targetPage = Math.max(0, Math.min(page, totalPages - 1));
      }

      const targetItemCenter = itemCenters[targetPage];
      if (targetItemCenter !== undefined) {
        const viewportCenter = containerWidth / 2;
        const targetOffset = -(targetItemCenter - viewportCenter);
        rawOffset.set(targetOffset);
        setCurrentPage(targetPage);
      }
    },
    [itemCenters, loop, totalPages, containerWidth, rawOffset]
  );

  const nextPage = useCallback(
    () => gotoPage(currentPage + 1),
    [currentPage, gotoPage]
  );
  const prevPage = useCallback(
    () => gotoPage(currentPage - 1),
    [currentPage, gotoPage]
  );

  // Handle pan gesture - update offset without moving container
  const handlePan = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      const delta =
        (axis === "x" ? info.delta.x : info.delta.y) * dragSensitivity;
      const currentValue = rawOffset.get() + delta;

      if (!loop) {
        // Apply rubber band effect at edges
        if (currentValue > maxOffset) {
          const overdrag = currentValue - maxOffset;
          rawOffset.set(maxOffset + overdrag * 0.3); // Keeping 0.3 factor for rubber brand feel, separate from dragElastic
        } else if (currentValue < minOffset) {
          const overdrag = minOffset - currentValue;
          rawOffset.set(minOffset - overdrag * 0.3);
        } else {
          rawOffset.set(currentValue);
        }
      } else {
        rawOffset.set(currentValue);
      }
    },
    [axis, rawOffset, loop, maxOffset, minOffset, dragSensitivity]
  );

  // Handle pan end - snap to nearest item
  const handlePanEnd = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      const velocity = axis === "x" ? info.velocity.x : info.velocity.y;
      snapToNearest(velocity);
    },
    [axis, snapToNearest]
  );

  // Internal context for item wrappers
  const internalContext = useMemo(
    () => ({
      rawOffset,
      springOffset,
      containerWidth,
      itemWidths,
      gap,
      layout,
    }),
    [rawOffset, springOffset, containerWidth, itemWidths, gap, layout]
  );

  // Carousel context value
  const carouselContextValue: CarouselContextValue = useMemo(
    () => ({
      renderedOffset: springOffset,
      totalItemLength,
      itemCount: items.length,
      nextPage,
      prevPage,
      gotoPage,
      currentPage,
      totalPages,
      isNextActive,
      isPrevActive,
    }),
    [
      springOffset,
      totalItemLength,
      items.length,
      nextPage,
      prevPage,
      gotoPage,
      currentPage,
      totalPages,
      isNextActive,
      isPrevActive,
    ]
  );

  return (
    <CarouselContext.Provider value={carouselContextValue}>
      <InternalCarouselContext.Provider value={internalContext}>
        <motion.ul
          ref={containerRef}
          className={className}
          style={{
            display: layout === "stack" ? "grid" : "flex",
            ...(layout === "stack"
              ? {
                  gridTemplateAreas: "'stack'",
                  placeItems: "center",
                }
              : {
                  flexDirection: axis === "x" ? "row" : "column",
                  gap: `${gap}px`,
                }),
            listStyle: "none",
            margin: 0,
            padding: 0,
            overflow: overflow ? "visible" : "hidden",
            touchAction: "pan-y",
            userSelect: "none",
          }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          {items.map((item, index) => (
            <CarouselItemWrapper key={index} index={index}>
              {item}
            </CarouselItemWrapper>
          ))}
        </motion.ul>
        {children}
      </InternalCarouselContext.Provider>
    </CarouselContext.Provider>
  );
}

// Export hooks
export function useTicker(): TickerContextValue {
  const context = useContext(TickerContext);
  if (!context) {
    throw new Error("useTicker must be used within a Carousel");
  }
  return context;
}

export function useTickerItem(): TickerItemContextValue {
  const context = useContext(TickerItemContext);
  if (!context) {
    throw new Error("useTickerItem must be used within a Carousel item");
  }
  return context;
}

export function useCarousel(): CarouselContextValue {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel");
  }
  return context;
}
