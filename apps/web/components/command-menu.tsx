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
        aria-label="Search components"
        className="flex size-7 cursor-pointer items-center justify-center gap-2 rounded-full text-[12.5px] text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 sm:size-auto sm:border sm:border-neutral-200 sm:py-1.5 sm:pl-3 sm:pr-2 sm:hover:border-neutral-300 sm:hover:bg-transparent dark:sm:border-neutral-800 dark:sm:hover:border-neutral-700 dark:sm:hover:bg-transparent"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search components…</span>
        <kbd className="ml-1 hidden text-[10px] font-mono sm:inline text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-900 rounded px-1.5 py-0.5">
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
