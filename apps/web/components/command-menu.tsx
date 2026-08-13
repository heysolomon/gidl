"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";

interface NavItem {
  name: string;
  title: string;
}

export function CommandMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function select(name: string) {
    setOpen(false);
    router.push(`/docs/components/${name}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 text-[12.5px] text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-full pl-3 pr-2 py-1.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search components…</span>
        <kbd className="ml-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-900 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search components"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        >
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <Command
            className="relative w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-elevation-md overflow-hidden"
            shouldFilter
          >
            <Command.Input
              autoFocus
              placeholder="Search components…"
              className="command-menu-input w-full px-4 py-3 text-[13px] bg-transparent outline-none border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-[12.5px] text-neutral-400 dark:text-neutral-600">
                No components found.
              </Command.Empty>
              {items.map((item) => (
                <Command.Item
                  key={item.name}
                  value={item.title}
                  onSelect={() => select(item.name)}
                  className="px-2 py-2 rounded-md text-[13px] text-neutral-700 dark:text-neutral-300 cursor-pointer data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800 data-[selected=true]:text-neutral-900 dark:data-[selected=true]:text-neutral-100"
                >
                  {item.title}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </div>
      )}
    </>
  );
}
