"use client";

import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";

const options = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

// Accepts ThemeSwitchProps (ComponentProps<'div'>) from fumadocs but renders custom UI
export function DocsThemeSwitch(_props: ComponentProps<"div">) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-[68px] rounded-full" />;

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-neutral-100 p-0.5 dark:bg-neutral-800">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = resolvedTheme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            aria-label={option.label}
            title={option.label}
            className="relative flex h-7 w-8 items-center justify-center"
          >
            {isActive && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-neutral-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              className={`relative z-10 h-3.5 w-3.5 transition-colors ${
                isActive
                  ? "text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-400 dark:text-neutral-500"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
