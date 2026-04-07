"use client";

import Link from "next/link";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { GidlLogo } from "@/components/logo";
import { AnimatedTabs } from "@gidl/ui";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <GidlLogo size={16} />
          <span className="text-[14px] font-semibold tracking-tight">gidl</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="w-[14px] h-[14px] hidden dark:block" />
            <Moon className="w-[14px] h-[14px] block dark:hidden" />
          </button>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <XIcon className="w-[14px] h-[14px]" />
          </a>
          <a
            href="https://github.com/heysolomon/gidl"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <GitHubIcon className="w-[14px] h-[14px]" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center text-center px-6 pt-20 pb-8 max-w-xl mx-auto">
        <h1 className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight">
          Copy-paste motion
          <br />
          primitives for React
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-[420px]">
          A collection of animated UI components built with Motion.
          <br />
          Copy. Paste. Customize. Ship faster.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/docs"
            className="flex items-center gap-1 text-[13px] font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            Explore Docs <ArrowRight className="w-3 h-3" />
          </Link>
          <a
            href="https://github.com/heysolomon/gidl"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[12px] font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3.5 py-1.5 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <GitHubIcon className="w-3 h-3" /> Star on GitHub
          </a>
        </div>

      </main>

      {/* Component Preview */}
      <section className="flex justify-center px-6 pb-24 pt-8">
        <div className="w-full max-w-2xl bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center min-h-[340px]">
          <AnimatedTabs />
        </div>
      </section>
    </div>
  );
}
