"use client";

import { useState } from "react";
import { Button, Badge } from "@gidl/ui";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx gidl init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText("https://gidl.dev");
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  return (
    <section className="pb-12 sm:pt-32 sm:pb-20 px-6 relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
      {/* Decorative Frame with Diagonal Stripes and Intersecting Lines */}

      {/* Left Stripe Panel with inner vertical line - Light Mode */}
      <div
        className="absolute top-0 bottom-0 left-0 dark:hidden hidden sm:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        {/* Inner vertical line */}
        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-200" />
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 6px)`,
          }}
        />
      </div>

      {/* Left Stripe Panel with inner vertical line - Dark Mode */}
      <div
        className="absolute top-0 bottom-0 left-0 hidden sm:dark:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)`,
          }}
        />
        {/* Inner vertical line */}
        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-800" />
      </div>

      {/* Right Stripe Panel with inner vertical line - Light Mode */}
      <div
        className="absolute top-0 bottom-0 right-0 dark:hidden hidden sm:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 6px)`,
          }}
        />
        {/* Inner vertical line */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-200" />
      </div>

      {/* Right Stripe Panel with inner vertical line - Dark Mode */}
      <div
        className="absolute top-0 bottom-0 right-0 hidden sm:dark:block"
        style={{
          width: "calc((100vw - min(100vw - 3rem, 72rem)) / 2)",
        }}
      >
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)`,
          }}
        />
        {/* Inner vertical line */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-800" />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="border-dashed border-b border-neutral-200 dark:border-neutral-800 py-10">
          {/* Badge */}
          <Badge
            variant="border"
            className="mb-8 text-[11px] sm:text-xs font-semibold font-mono tracking-wide uppercase"
          >
            Now available
          </Badge>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white leading-[1.1]">
            Scaffold with purpose.
            <br className="hidden sm:block" /> Govern with ease.
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Gidl is the architectural engine for Next.js. Move from vibe coding
            to production-grade governance in seconds.
          </p>

          {/* CLI Command Copy Field */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-4 bg-neutral-100 dark:bg-neutral-900 rounded-full px-6 sm:px-8 py-2 border border-neutral-200 dark:border-neutral-800">
              <code className="text-sm sm:text-base text-neutral-900 dark:text-white font-mono">
                npx gidl init
              </code>
              <button
                onClick={copyCommand}
                className="p-1.5 rounded-full cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                aria-label="Copy command"
              >
                {copied ? (
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                ) : (
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <a
            href="#"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Read the docs →
          </a>
        </div>

        {/* Product Window Mockup */}
        <div className="mt-12 mb-8 px-4 sm:px-8 lg:px-12">
          {/* Browser Window Frame */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900/50">
            {/* Browser Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              {/* URL Bar */}
              <div className="flex-1 ml-4">
                <button
                  onClick={copyUrl}
                  className="bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono max-w-xs mx-auto cursor-pointer transition-colors flex items-center gap-2"
                >
                  {urlCopied ? (
                    <>
                      <svg
                        className="w-3 h-3 text-green-600 dark:text-green-400"
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
                      Copied!
                    </>
                  ) : (
                    "gidl.dev"
                  )}
                </button>
              </div>
              <div className="w-[52px]" /> {/* Spacer for symmetry */}
            </div>
            {/* Browser Window Content */}
            <div className="aspect-video bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
              <p className="text-neutral-400 dark:text-neutral-600 text-sm font-mono">
                Terminal demo
              </p>
            </div>
          </div>
        </div>

        {/* Supported Tools Strip */}
        <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-10 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-6">
            Works with your favorite tools
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
              </svg>
              <span className="text-sm font-medium">Next.js</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.677.111a6.38 6.38 0 0 1 1.457.405v2.059c-.482-.274-1.002-.446-1.56-.517-.558-.071-1.12-.107-1.685-.107-.64 0-1.125.107-1.456.32-.332.213-.498.549-.498 1.008 0 .32.12.587.36.8.24.213.693.4 1.357.56l.78.18c1.014.234 1.747.593 2.201 1.078.454.485.681 1.111.681 1.88 0 .32-.043.618-.128.895-.085.276-.214.534-.387.772-.173.238-.395.453-.665.644-.27.19-.601.351-.993.483-.392.132-.85.23-1.374.293-.524.064-1.12.096-1.786.096-.604 0-1.175-.032-1.712-.096a8.18 8.18 0 0 1-1.479-.32v-2.18c.558.32 1.138.555 1.74.7.602.145 1.206.218 1.81.218.64 0 1.146-.107 1.518-.32.372-.213.558-.533.558-.96 0-.107-.013-.208-.04-.304a.772.772 0 0 0-.128-.256.917.917 0 0 0-.225-.214 1.682 1.682 0 0 0-.341-.182 3.322 3.322 0 0 0-.476-.16 9.304 9.304 0 0 0-.617-.141l-.78-.16c-.976-.213-1.703-.558-2.181-1.033-.478-.476-.717-1.094-.717-1.854 0-.64.165-1.186.494-1.638.33-.452.785-.798 1.366-1.04.58-.24 1.256-.36 2.027-.36zm-11.925.12h5.534v1.65H9.073v6.99H6.563z" />
              </svg>
              <span className="text-sm font-medium">TypeScript</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
              </svg>
              <span className="text-sm font-medium">Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.052 3.5954-.0664.1262-.2017.2324-.3532.2677-.0522.0124-.098.0148-.4953.0148h-.438l-.1226-.0788a.459.459 0 0 1-.1627-.1783l-.0518-.109.0052-4.704.0074-4.7054.0729-.0926c.0388-.049.1162-.1118.1727-.1413.0932-.0479.1298-.0525.5198-.0525.4565 0 .5346.0196.6563.1571.0344.0387 1.3378 1.9996 2.8954 4.3624l4.7344 7.1706 1.9004 2.8795.0961-.0633c.9065-.5932 1.848-1.4378 2.4662-2.2134 1.3816-1.7344 2.2423-3.8426 2.4809-6.0869.096-.659.108-.8538.108-1.7476s-.012-1.0884-.108-1.7476c-.652-4.506-3.8591-8.2919-8.2087-9.6945-.7688-.2487-1.5769-.419-2.4997-.5253-.1714-.0182-.9702-.0376-1.1455-.0282zm4.1282 7.2177c.338 0 .4007.0052.4761.0483.1184.0673.2152.1997.2381.3252.0122.0671.0168 1.3536.0141 4.2583l-.0053 4.1693-.7386-1.1346-.7399-1.1345v-3.0605c0-1.9773.0094-3.0889.0234-3.1524.0206-.0919.0642-.1745.1181-.2229.0872-.0773.1214-.0848.4888-.0848z" />
              </svg>
              <span className="text-sm font-medium">Vercel</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 14.771L12 24l9.596-5.242L23.32 3.984 11.999.001zm7.064 18.31h-2.638l-1.422-3.503H8.996l-1.422 3.504h-2.64L12 2.65z" />
              </svg>
              <span className="text-sm font-medium">ESLint</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 0C5.373 0 0 5.373 0 12.001 0 18.629 5.373 24 12.001 24 18.629 24 24 18.629 24 12.001 24 5.373 18.629 0 12.001 0zm-.016 6.378c3.105 0 5.625 2.52 5.625 5.625s-2.52 5.625-5.625 5.625-5.625-2.52-5.625-5.625 2.52-5.625 5.625-5.625z" />
              </svg>
              <span className="text-sm font-medium">Prettier</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
