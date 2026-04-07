import { StripePanels } from "../stripe-panels";

export function Governance() {
  return (
    <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-8 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-6">
            Governance
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
            Architecture that enforces itself.
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
            AST-powered rules that run on every commit. Server/client
            boundaries, feature isolation, and import
            restrictions—automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Rules List with Sketch Feel */}
          <div className="space-y-3">
            {[
              {
                rule: "server-client-boundary",
                desc: "Prevent client components from importing server-only code",
                status: "pass",
              },
              {
                rule: "feature-isolation",
                desc: "Features cannot import from other features directly",
                status: "pass",
              },
              {
                rule: "no-circular-deps",
                desc: "Detect and block circular dependency chains",
                status: "pass",
              },
              {
                rule: "shared-only-imports",
                desc: "Cross-feature code must live in /shared",
                status: "warn",
              },
            ].map((item) => (
              <div
                key={item.rule}
                className="relative p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      item.status === "pass"
                        ? "bg-neutral-900 dark:bg-white"
                        : "border border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    {item.status === "pass" ? (
                      <svg
                        className="w-3 h-3 text-white dark:text-neutral-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold">
                        !
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono text-neutral-900 dark:text-white">
                      {item.rule}
                    </code>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Code Preview - Polished */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 dark:bg-neutral-950 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-neutral-400 font-mono ml-2">
                  gidl.config.ts
                </span>
              </div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <pre className="text-neutral-300">
                <span className="text-purple-400">export default</span> {"{"}
              </pre>
              <pre className="text-neutral-300 pl-4">
                <span className="text-blue-400">rules</span>: {"{"}
              </pre>
              <pre className="text-neutral-300 pl-8">
                <span className="text-green-400">"server-client-boundary"</span>
                : <span className="text-amber-400">"error"</span>,
              </pre>
              <pre className="text-neutral-300 pl-8">
                <span className="text-green-400">"feature-isolation"</span>:{" "}
                <span className="text-amber-400">"error"</span>,
              </pre>
              <pre className="text-neutral-300 pl-8">
                <span className="text-green-400">"no-circular-deps"</span>:{" "}
                <span className="text-amber-400">"error"</span>,
              </pre>
              <pre className="text-neutral-300 pl-8">
                <span className="text-green-400">"shared-only-imports"</span>:{" "}
                <span className="text-amber-400">"warn"</span>
              </pre>
              <pre className="text-neutral-300 pl-4">{"}"},</pre>
              <pre className="text-neutral-300 pl-4">
                <span className="text-blue-400">features</span>: [
              </pre>
              <pre className="text-neutral-300 pl-8">
                <span className="text-green-400">"auth"</span>,{" "}
                <span className="text-green-400">"billing"</span>,{" "}
                <span className="text-green-400">"dashboard"</span>
              </pre>
              <pre className="text-neutral-300 pl-4">]</pre>
              <pre className="text-neutral-300">{"}"}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
