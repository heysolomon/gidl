import { StripePanels } from "../stripe-panels";

export function EndorsedBy() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-neutral-900 dark:text-white leading-relaxed mb-10">
          "I've spent a decade building design systems and architecture. Gidl is
          exactly what I would have built to keep my teams <em>aligned</em> and
          my codebases <em>clean</em>."
        </blockquote>
        <div className="flex items-center justify-end gap-4">
          <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-600" />
          <div className="text-right">
            <span className="text-sm text-neutral-900 dark:text-white font-medium">
              Michael Torres,
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 italic ml-1">
              Senior Staff Engineer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
