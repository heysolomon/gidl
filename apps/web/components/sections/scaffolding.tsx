import { StripePanels } from "../stripe-panels";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@gidl/ui";

export function Scaffolding() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
      <StripePanels />
      <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-8 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-6">
            Scaffolding
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
            Pick a blueprint. Ship in minutes.
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
            Industry-specific project structures built by senior engineers.
            Every blueprint enforces best practices from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Blueprint Configuration UI */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Select a blueprint to scaffold your project with pre-configured
                architecture, folder structure, and governance rules.
              </p>
            </div>

            {/* Blueprint Selector */}
            <div className="space-y-3">
              <label className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium">
                Blueprint
              </label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 text-left hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white dark:text-neutral-900"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                          SaaS
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                          Multi-tenant auth, billing, dashboards
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[300px]" align="start">
                    <DropdownMenuLabel>Available Blueprints</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white dark:text-neutral-900"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                            SaaS
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                            Multi-tenant auth, billing, dashboards
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-neutral-900 dark:text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                            E-commerce
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                            Storefront, cart, checkout flow
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-neutral-900 dark:text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                            Internal Tool
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                            Admin panel, CRUD, tables
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Features Toggle */}
            <div className="space-y-4 pt-2">
              <label className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium">
                Include
              </label>

              {/* Auth Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Authentication
                </span>
                <div className="w-10 h-6 bg-neutral-900 dark:bg-white rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-neutral-900 rounded-full shadow-sm" />
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Billing
                </span>
                <div className="w-10 h-6 bg-neutral-900 dark:bg-white rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-neutral-900 rounded-full shadow-sm" />
                </div>
              </div>

              {/* Governance Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Governance rules
                </span>
                <div className="w-10 h-6 bg-neutral-900 dark:bg-white rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-neutral-900 rounded-full shadow-sm" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200 dark:border-neutral-800" />

            {/* Output info */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Creates 12 files across 4 feature directories</span>
            </div>
          </div>

          {/* Right Column: Terminal Output - Polished */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 dark:bg-neutral-950 overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-800/50">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-neutral-400 font-mono ml-2">
                ~/my-project
              </span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <p className="text-white">
                <span className="text-green-400">❯</span> npx gidl init
                --blueprint saas
              </p>
              <div className="mt-4 space-y-1.5 text-neutral-400">
                <p>
                  <span className="text-green-400">✓</span> Scaffolding SaaS
                  blueprint...
                </p>
                <p>
                  <span className="text-green-400">✓</span> Creating{" "}
                  <span className="text-blue-400">/src/features/auth</span>
                </p>
                <p>
                  <span className="text-green-400">✓</span> Creating{" "}
                  <span className="text-blue-400">/src/features/billing</span>
                </p>
                <p>
                  <span className="text-green-400">✓</span> Creating{" "}
                  <span className="text-blue-400">/src/features/dashboard</span>
                </p>
                <p>
                  <span className="text-green-400">✓</span> Configuring
                  server/client boundaries
                </p>
                <p>
                  <span className="text-green-400">✓</span> Installing
                  dependencies...
                </p>
              </div>
              <p className="mt-4 text-green-400 font-semibold">
                ✓ Done in 4.2s
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
