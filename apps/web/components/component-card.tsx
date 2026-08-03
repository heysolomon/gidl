import Link from "next/link";
import type { ReactNode } from "react";

interface ComponentCardProps {
  href: string;
  title: string;
  preview: ReactNode;
  badge?: string;
}

export function ComponentCard({
  href,
  title,
  preview,
  badge,
}: ComponentCardProps) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] rounded-2xl bg-neutral-50 dark:bg-neutral-900 overflow-hidden hover:brightness-[0.97] dark:hover:brightness-110 transition-[filter]"
    >
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="pointer-events-none scale-[0.7] origin-center transition-transform duration-300 group-hover:scale-[0.75]">
          {preview}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-mono uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}
