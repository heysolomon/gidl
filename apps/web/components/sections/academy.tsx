import { StripePanels } from "../stripe-panels";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlashIcon,
  CommandLineIcon,
  LayersIcon,
} from "@hugeicons/core-free-icons";

export function Academy() {
  return (
    <section className="py-24 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-6xl mx-auto mb-16 relative z-10 px-4 sm:px-8 lg:px-12">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-6">
          Get started
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
          From zero to production in minutes.
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Comprehensive documentation and guides to help you scaffold, govern,
          and ship faster.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4 sm:px-8 lg:px-12">
        {/* Quick Start */}
        <a href="#" className="group block">
          <div className="flex items-center gap-2 mb-4 text-neutral-400 dark:text-neutral-500">
            <HugeiconsIcon icon={FlashIcon} className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Quick start
            </span>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:underline decoration-1 underline-offset-4">
            5-minute setup guide
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Install, init, and ship your first project.
          </p>
        </a>

        {/* CLI Reference */}
        <a href="#" className="group block">
          <div className="flex items-center gap-2 mb-4 text-neutral-400 dark:text-neutral-500">
            <HugeiconsIcon icon={CommandLineIcon} className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              CLI Reference
            </span>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:underline decoration-1 underline-offset-4">
            Commands & options
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Every command, flag, and configuration option.
          </p>
        </a>

        {/* Blueprints */}
        <a href="#" className="group block">
          <div className="flex items-center gap-2 mb-4 text-neutral-400 dark:text-neutral-500">
            <HugeiconsIcon icon={LayersIcon} className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Blueprints
            </span>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:underline decoration-1 underline-offset-4">
            Industry templates
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            SaaS, E-commerce, Fintech, and more.
          </p>
        </a>
      </div>
    </section>
  );
}
