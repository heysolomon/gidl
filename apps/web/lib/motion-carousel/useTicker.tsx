"use client";

import { useTickerContext } from "./context";

export function useTicker() {
    return useTickerContext();
}
