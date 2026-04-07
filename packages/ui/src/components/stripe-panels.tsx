export function StripePanels() {
  return (
    <>
      {/* Left Stripe Panel - Light Mode */}
      <div
        className="absolute top-0 bottom-0 left-0 dark:hidden hidden sm:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-200" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 6px)`,
          }}
        />
      </div>

      {/* Left Stripe Panel - Dark Mode */}
      <div
        className="absolute top-0 bottom-0 left-0 hidden sm:dark:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)`,
          }}
        />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-800" />
      </div>

      {/* Right Stripe Panel - Light Mode */}
      <div
        className="absolute top-0 bottom-0 right-0 dark:hidden hidden sm:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 6px)`,
          }}
        />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-200" />
      </div>

      {/* Right Stripe Panel - Dark Mode */}
      <div
        className="absolute top-0 bottom-0 right-0 hidden sm:dark:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)`,
          }}
        />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-800" />
      </div>
    </>
  );
}
