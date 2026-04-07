import { StripePanels } from "../stripe-panels";

export function JoinPros() {
  return (
    <section className="py-24 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center relative z-10">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-6">
          Built for teams
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
          Used by 6,000+ designers & developers
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          From solo founders to enterprise teams. One toolkit that bridges the
          gap between design and engineering.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Tabs Mockup */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800 flex-nowrap">
            <button className="px-4 sm:px-6 py-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm text-sm font-semibold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 whitespace-nowrap">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Designers
            </button>
            <button className="px-4 sm:px-6 py-2 rounded-full text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Developers
            </button>
            <button className="px-4 sm:px-6 py-2 rounded-full text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Teams
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Check List */}
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">
              For designers
            </h3>
            <ul className="space-y-6">
              {[
                "Ship designs that developers can actually implement",
                "Build 10× faster with production-ready components",
                "Stay in sync with the latest shadcn/ui updates",
                "Focus on user experience, not component maintenance",
                "Export clean code directly from Figma",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400"
                >
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-white mt-0.5 flex-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial Card */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 sm:p-10 border border-neutral-200 dark:border-neutral-800">
            <blockquote className="text-lg sm:text-xl font-serif text-neutral-900 dark:text-white leading-relaxed mb-8">
              "We switched to Gidl and cut our design-to-dev handoff time in{" "}
              <em>half</em>. The code output is clean and matches our codebase
              perfectly."
            </blockquote>
            <div className="flex items-center justify-end gap-4">
              <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-600" />
              <div className="text-right">
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  Sarah Chen,
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 italic ml-1">
                  Design Lead @ Acme
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
