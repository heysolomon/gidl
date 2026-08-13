"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeFile {
  path: string;
  html: string;
  content: string;
}

export function CodeBlockClient({ files }: { files: CodeFile[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = files[activeIndex] ?? files[0];

  const handleCopy = async () => {
    if (!active) return;
    await navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted px-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {files.map((file, index) => (
            <button
              key={file.path}
              onClick={() => setActiveIndex(index)}
              className={`px-2.5 py-2 text-[12px] whitespace-nowrap font-mono transition-colors cursor-pointer ${
                index === activeIndex
                  ? "text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {file.path.split("/").pop()}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 cursor-pointer p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <div className="max-h-[440px] overflow-y-auto no-scrollbar scroll-fade-y">
        <div
          className="scroll-fade-x text-[12.5px] leading-relaxed overflow-x-auto [&_pre]:p-4 [&_pre]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: active?.html ?? "" }}
        />
      </div>
    </div>
  );
}
