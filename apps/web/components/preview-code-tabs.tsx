"use client";

import { useState, type ReactNode } from "react";

export function PreviewCodeTabs({
  preview,
  code,
}: {
  preview: ReactNode;
  code: ReactNode;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div>
      <div className="flex items-center gap-1 mb-3">
        {(["preview", "code"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium capitalize transition-colors ${
              tab === value
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      {tab === "preview" ? preview : code}
    </div>
  );
}
