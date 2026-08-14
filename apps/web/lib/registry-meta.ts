import "server-only";
import { getAllRegistryItems, type RegistryItem } from "@/lib/registry";

export interface RegistryMeta {
  /** Controls sidebar/search ordering — lower shows first. */
  order: number;
  /** Unpublished components are only visible outside production. */
  published: boolean;
  /** Shows a "New" pill next to the component. */
  isNew?: boolean;
}

// Not part of registry.json (that file follows shadcn's public registry schema) —
// this is gidl-only docs metadata layered on top by component name.
const registryMeta: Record<string, RegistryMeta> = {
  "animated-tabs": { order: 1, published: true },
  "collins-carousel": { order: 2, published: true },
  "flip-cards": { order: 3, published: true },
  "agentation-toolbar": { order: 4, published: false, isNew: true },
};

const DEFAULT_META: RegistryMeta = { order: 999, published: true };

export interface DocsNavItem extends RegistryItem {
  order: number;
  published: boolean;
  isNew: boolean;
}

function withMeta(item: RegistryItem): DocsNavItem {
  const meta = registryMeta[item.name] ?? DEFAULT_META;
  return {
    ...item,
    order: meta.order,
    published: meta.published,
    // "New" only makes sense once something has actually shipped — a draft
    // still in development shows the "Draft" pill instead.
    isNew: meta.published && (meta.isNew ?? false),
  };
}

const isProduction = process.env.NODE_ENV === "production";

/**
 * Registry items meant for the current environment, sorted by their configured order.
 * Unpublished (draft) components are excluded outside development.
 */
export function getDocsNavItems(): DocsNavItem[] {
  return getAllRegistryItems()
    .map(withMeta)
    .filter((item) => item.published || !isProduction)
    .sort((a, b) => a.order - b.order);
}

export function isRegistryItemVisible(name: string): boolean {
  const meta = registryMeta[name] ?? DEFAULT_META;
  return meta.published || !isProduction;
}

export function getDocsNavItem(item: RegistryItem): DocsNavItem {
  return withMeta(item);
}
