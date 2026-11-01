import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// The skeleton mini-card: flat, in the shared ramp from globals.css.
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
        "relative flex flex-col rounded-2xl border border-border bg-(--sk-fill)",
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
