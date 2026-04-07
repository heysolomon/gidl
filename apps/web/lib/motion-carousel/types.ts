import { MotionValue } from "motion/react";
import { CSSProperties, ReactNode } from "react";

export interface CarouselProps {
    items: ReactNode[];
    loop?: boolean;
    overflow?: boolean;
    gap?: number;
    itemSize?: "auto" | "fill" | "manual";
    safeMargin?: number;
    dragElastic?: number;
    dragSensitivity?: number;
    momentumMultiplier?: number;
    springConfig?: { stiffness: number; damping: number; mass: number };
    axis?: "x" | "y";
    layout?: "row" | "stack";
    className?: string;
    children?: ReactNode;
}

export interface TickerContextValue {
    renderedOffset: MotionValue<number>;
    totalItemLength: number;
    itemCount: number;
}

export interface TickerItemContextValue {
    offset: MotionValue<number>;
    props: {
        style: CSSProperties;
        "data-index": number;
    };
    start: number;
    end: number;
    itemIndex: number;
}

export interface CarouselContextValue extends TickerContextValue {
    nextPage: () => void;
    prevPage: () => void;
    gotoPage: (page: number) => void;
    currentPage: number;
    totalPages: number;
    isNextActive: boolean;
    isPrevActive: boolean;
}
