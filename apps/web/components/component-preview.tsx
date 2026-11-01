"use client";

import { useState, type ReactNode, type ComponentProps } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
}

export function ComponentPreview({
  children,
  className = "",
}: ComponentPreviewProps) {
  const [key, setKey] = useState(0);
  return (
    <div
      className={cn(
        "relative isolate flex min-h-[350px] w-full items-stretch justify-center p-10",
        className
      )}
    >
      <button
        onClick={() => setKey((k) => k + 1)}
        className="group absolute right-3 top-3 z-10 cursor-pointer text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        aria-label="Reload preview"
        title="Reload preview"
      >
        <RotateCcw
          key={key}
          className={`h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:rotate-[15deg] ${
            key > 0 ? "spin-ccw-once" : ""
          }`}
        />
      </button>
      {/* relative + stretch: absolutely-positioned preview content (e.g.
          sidebar-list's collapsible panel) anchors to this box instead of
          the outer padded box, so it stays inset by the outer's padding
          rather than sitting flush against its padding-box edge. */}
      <div
        key={key}
        className="relative flex w-full items-center justify-center"
      >
        {children}
      </div>
    </div>
  );
}
