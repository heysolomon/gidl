import type { ReactNode } from "react";

export function Pill({
  children,
  variant = "new",
}: {
  children: ReactNode;
  variant?: "new" | "draft";
}) {
  const styles =
    variant === "new"
      ? "bg-accent-harvest-orange/10 text-accent-harvest-orange dark:bg-accent-harvest-orange/15"
      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${styles}`}
    >
      {children}
    </span>
  );
}
