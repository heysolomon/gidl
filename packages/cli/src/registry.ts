export interface RegistryFile {
  path: string;
  type: "registry:component" | "registry:lib" | string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  dependencies?: string[];
  files: RegistryFile[];
}

export interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const RAW_BASE = "https://raw.githubusercontent.com/heysolomon/gidl/main";
// The registry *index* is fetched from the live, published endpoint rather
// than raw.githubusercontent.com/.../registry.json — that file is the full
// source of truth including unpublished drafts, while gidl.dev/r/registry.json
// is the build output with drafts already filtered out (see
// scripts/build-registry.mjs). Individual file contents below still come
// from GitHub, since only published items' source files are ever referenced.
const REGISTRY_INDEX_URL = "https://gidl.dev/r/registry.json";

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(REGISTRY_INDEX_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry.json (status ${res.status})`);
  }
  return res.json() as Promise<Registry>;
}

export function findItem(
  registry: Registry,
  name: string
): RegistryItem | undefined {
  return registry.items.find((item) => item.name === name);
}

export async function fetchFileContent(path: string): Promise<string> {
  const res = await fetch(`${RAW_BASE}/${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path} (status ${res.status})`);
  }
  return res.text();
}

/**
 * Maps a monorepo-relative source path to a path in the consumer's project.
 * The gidl monorepo keeps registry components under packages/ui, shared
 * client-side libs under apps/web/lib, and server actions under
 * apps/web/actions — this re-roots all three into a plain
 * components/ui + lib + actions layout for a standalone project.
 *
 * lib/ and actions/ are NOT rewritten to follow `componentsPath` — component
 * source imports them via the fixed `@/lib/...` / `@/actions/...` aliases
 * (this CLI copies file content verbatim, it doesn't rewrite imports like
 * shadcn's CLI does), so they must land exactly where those aliases resolve.
 */
export function resolveTargetPath(
  sourcePath: string,
  componentsPath: string
): string {
  const componentsPrefix = "packages/ui/src/registry/components/";
  const libPrefix = "apps/web/lib/";
  const actionsPrefix = "apps/web/actions/";

  if (sourcePath.startsWith(componentsPrefix)) {
    const basename = sourcePath.slice(componentsPrefix.length);
    return `${componentsPath}/${basename}`;
  }

  if (sourcePath.startsWith(libPrefix)) {
    const rest = sourcePath.slice(libPrefix.length);
    return `lib/${rest}`;
  }

  if (sourcePath.startsWith(actionsPrefix)) {
    const rest = sourcePath.slice(actionsPrefix.length);
    return `actions/${rest}`;
  }

  return `${componentsPath}/${sourcePath.split("/").pop()}`;
}
