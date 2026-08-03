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

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(`${RAW_BASE}/registry.json`);
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
 * The gidl monorepo keeps registry components under packages/ui and shared
 * client-side libs under apps/web/lib — this re-roots both into a plain
 * components/ui + lib layout for a standalone project.
 */
export function resolveTargetPath(
  sourcePath: string,
  componentsPath: string
): string {
  const componentsPrefix = "packages/ui/src/registry/components/";
  const libPrefix = "apps/web/lib/";

  if (sourcePath.startsWith(componentsPrefix)) {
    const basename = sourcePath.slice(componentsPrefix.length);
    return `${componentsPath}/${basename}`;
  }

  if (sourcePath.startsWith(libPrefix)) {
    const rest = sourcePath.slice(libPrefix.length);
    return `lib/${rest}`;
  }

  return `${componentsPath}/${sourcePath.split("/").pop()}`;
}
