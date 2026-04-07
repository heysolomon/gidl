import { StripePanels } from "../stripe-panels";

export function WhyBuiltThis() {
  return (
    <section className="py-24 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-10">
          The problem
        </p>
        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-neutral-900 dark:text-white leading-relaxed mb-10">
          "Every Next.js project I inherited was a <em>mess</em>. No boundaries.
          No rules. Just vibes. After a decade of fixing the same problems, I
          built the tool I wish existed."
        </blockquote>
        <div className="flex items-center justify-end gap-4">
          <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-600" />
          <div className="text-right">
            <span className="text-sm text-neutral-900 dark:text-white font-medium">
              Solomon Akuson,
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 italic ml-1">
              Founder
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
