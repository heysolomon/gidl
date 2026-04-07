import { Button } from "@gidl/ui";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      {/* Left vertical line - Light Mode */}
      <div
        className="absolute top-0 bottom-0 left-0 dark:hidden hidden sm:block pointer-events-none"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-200" />
      </div>

      {/* Left vertical line - Dark Mode */}
      <div
        className="absolute top-0 bottom-0 left-0 hidden sm:dark:block pointer-events-none"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-800" />
      </div>

      {/* Right vertical line - Light Mode */}
      <div
        className="absolute top-0 bottom-0 right-0 dark:hidden hidden sm:block pointer-events-none"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-200" />
      </div>

      {/* Right vertical line - Dark Mode */}
      <div
        className="absolute top-0 bottom-0 right-0 hidden sm:dark:block pointer-events-none"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-800" />
      </div>

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
        >
          G<span className="italic">i</span>dl.
        </a>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-8">
          <a
            href="#"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Changelog
          </a>
          <a
            href="#"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button className="h-9 px-4 text-sm rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
            Get started
          </Button>
        </div>
      </div>
    </nav>
  );
}
