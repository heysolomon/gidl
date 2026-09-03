import "server-only";
import { getAllRegistryItems, type RegistryItem } from "@/lib/registry";
import registryMetaData from "../../../registry-meta.json";

export interface RegistryMeta {
  /** Unpublished components are only visible outside production, and are
   *  excluded from the public registry JSON (see scripts/build-registry.mjs). */
  published: boolean;
  /** Shows a "New" pill next to the component. */
  isNew?: boolean;
}

// Not part of registry.json (that file follows shadcn's public registry schema) —
// this is gidl-only docs metadata layered on top by component name. Kept as a
// plain JSON file (rather than inline here) so scripts/build-registry.mjs can
// read the same source of truth without needing a TS/Next.js runtime.
const registryMeta = registryMetaData as Record<string, RegistryMeta>;

const DEFAULT_META: RegistryMeta = { published: true };

export interface DocsNavItem extends RegistryItem {
  published: boolean;
  isNew: boolean;
}

function withMeta(item: RegistryItem): DocsNavItem {
  const meta = registryMeta[item.name] ?? DEFAULT_META;
  return {
    ...item,
    published: meta.published,
    // "New" only makes sense once something has actually shipped — a draft
    // still in development shows the "Draft" pill instead.
    isNew: meta.published && (meta.isNew ?? false),
  };
}

const isProduction = process.env.NODE_ENV === "production";

/**
 * Registry items meant for the current environment, sorted alphabetically by title.
 * Unpublished (draft) components are excluded outside development.
 */
export function getDocsNavItems(): DocsNavItem[] {
  return getAllRegistryItems()
    .map(withMeta)
    .filter((item) => item.published || !isProduction)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function isRegistryItemVisible(name: string): boolean {
  const meta = registryMeta[name] ?? DEFAULT_META;
  return meta.published || !isProduction;
}

export function getDocsNavItem(item: RegistryItem): DocsNavItem {
  return withMeta(item);
}
