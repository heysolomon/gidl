"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, FileText } from "lucide-react";

export function CopyPageMenu({
  markdownPath,
  markdownUrl,
  registryUrl,
}: {
  markdownPath: string;
  markdownUrl: string;
  registryUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function copyPage() {
    const res = await fetch(markdownPath);
    const text = await res.text();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const prompt = `Read from ${markdownUrl} so I can ask questions about it.`;
  const aiLinks = [
    {
      label: "Open in ChatGPT",
      href: `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
    },
    {
      label: "Open in Claude",
      href: `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    },
    {
      label: "Open in v0",
      href: `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryUrl)}`,
    },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border pl-3 pr-2 py-1.5 text-[12.5px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Copy page
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white dark:bg-neutral-900 shadow-elevation-md py-1"
        >
          <button
            role="menuitem"
            onClick={copyPage}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[12.5px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy page as Markdown"}
          </button>
          <a
            role="menuitem"
            href={markdownUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <FileText className="w-3.5 h-3.5" />
            View as Markdown
          </a>
          <div className="my-1 h-px bg-border" />
          {aiLinks.map((link) => (
            <a
              key={link.label}
              role="menuitem"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
