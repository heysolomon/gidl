import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// The skeleton mini-card: a flat tile in the shared ramp from globals.css, with
// no border, like the Expanding Gallery cards.
export function Surface({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative flex flex-col rounded-2xl bg-(--sk-fill)",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Bar({
  tone = "strong",
  className,
}: {
  tone?: "strong" | "soft";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-1.5 rounded-full",
        tone === "strong" && "bg-(--sk-strong)",
        tone === "soft" && "bg-(--sk-soft)",
        className
      )}
    />
  );
}
