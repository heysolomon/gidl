"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5">
      <code className="text-[12.5px] font-mono text-neutral-900 dark:text-neutral-100">
        {text}
      </code>
      <button
        onClick={handleCopy}
        className="shrink-0 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
