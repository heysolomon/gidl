import { Button } from "@gidl/ui";
import { StripePanels } from "../stripe-panels";

export function CTA() {
  return (
    <section className="py-32 px-6 bg-white dark:bg-neutral-950 text-center border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight mb-12">
          Start building today
        </h2>
        <div className="flex flex-col items-center">
          <Button className="h-14 px-8 text-lg rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 border-0 mb-8 font-semibold">
            Get started <span className="ml-2">→</span>
          </Button>
          <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
            Free forever · MIT License
          </p>
        </div>
      </div>
    </section>
  );
}
