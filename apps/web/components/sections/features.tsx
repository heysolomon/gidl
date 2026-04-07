import { StripePanels } from "../stripe-panels";

export function Features() {
  return (
    <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 relative z-10">
        {/* Feature 1 - Scaffolding */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col items-start text-left">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-4">
            Scaffolding
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
            From industry blueprint to code in seconds.
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Stop wasting hours on configuration glue. Gidl dynamically composes
            your project based on your domain—Fintech, SaaS, or E-commerce.
          </p>
        </div>

        {/* Feature 2 - Governance */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col items-start text-left">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-4">
            Governance
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
            Real-time health for your codebase.
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Architecture shouldn't just be a README file. Our AST-powered linter
            actively enforces server/client boundaries and feature isolation
            automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
