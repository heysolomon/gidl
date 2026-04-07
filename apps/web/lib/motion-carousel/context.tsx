"use client";

import { createContext, useContext } from "react";
import {
    CarouselContextValue,
    TickerContextValue,
    TickerItemContextValue,
} from "./types";

export const TickerContext = createContext<TickerContextValue | null>(null);
export const TickerItemContext = createContext<TickerItemContextValue | null>(
    null
);
export const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useTickerContext() {
    const context = useContext(TickerContext);
    if (!context) {
        throw new Error("useTicker must be used within a Carousel");
    }
    return context;
}

export function useTickerItemContext() {
    const context = useContext(TickerItemContext);
    if (!context) {
        throw new Error("useTickerItem must be used within a Carousel item");
    }
    return context;
}

export function useCarouselContext() {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a Carousel");
    }
    return context;
}
