"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
};

const INITIAL_ITEMS: SidebarItem[] = [
  { id: "1", label: "Canvas 1" },
  { id: "2", label: "Canvas 2" },
  { id: "3", label: "Canvas 3" },
  { id: "4", label: "Canvas 4" },
  { id: "5", label: "Canvas 5" },
];

export function SidebarList() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [activeId, setActiveId] = useState<string | null>(
    INITIAL_ITEMS[0]?.id ?? null
  );
  const [collapsed, setCollapsed] = useState(false);

  const handleAdd = () => {
    const newItem: SidebarItem = {
      id: `${Date.now()}`,
      label: `Canvas ${items.length + 1}`,
    };
    setItems((prev) => [...prev, newItem]);
    setActiveId(newItem.id);
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      className="w-[360px] overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
    >
      <div className="flex items-center justify-end gap-1 p-3 pb-1">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Add canvas"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.nav
            key="nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="flex flex-col gap-0.5 px-3 pb-3"
          >
            {items.map((item) => {
              const isActive = item.id === activeId;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  onClick={() => setActiveId(item.id)}
                  className="relative z-0 rounded-xl px-4 py-3 text-left text-[15px] transition-colors hover:bg-muted/60"
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-list-active"
                      className="absolute inset-0 -z-10 rounded-xl bg-muted"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span
                    className={cn(
                      isActive
                        ? "font-semibold text-foreground"
                        : "font-normal text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
