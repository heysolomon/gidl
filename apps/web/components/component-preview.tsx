"use client";

import { useState, type ReactNode, type ComponentProps } from "react";
import { RotateCcw } from "lucide-react";

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
      className={`relative flex min-h-[350px] w-full items-center justify-center p-10 ${className}`}
    >
      <button
        onClick={() => setKey((k) => k + 1)}
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
        aria-label="Reload preview"
        title="Reload preview"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <div key={key} className="flex w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
