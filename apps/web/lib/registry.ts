import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import registryData from "../../../registry.json";

const REPO_ROOT = path.resolve(process.cwd(), "../..");

export type RegistryFileType = "registry:component" | "registry:lib";

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies: string[];
  dependencies: string[];
  files: { path: string; type: RegistryFileType }[];
}

export interface RegistryFileContent {
  path: string;
  type: RegistryFileType;
  content: string;
}

const items = registryData.items as RegistryItem[];

export function getRegistryItem(name: string): RegistryItem | undefined {
  return items.find((item) => item.name === name);
}

export function getAllRegistryItems(): RegistryItem[] {
  return items;
}

export async function getComponentFiles(
  name: string
): Promise<RegistryFileContent[] | null> {
  const item = getRegistryItem(name);
  if (!item) return null;

  return Promise.all(
    item.files.map(async (file) => ({
      path: file.path,
      type: file.type,
      content: await fs.readFile(path.join(REPO_ROOT, file.path), "utf-8"),
    }))
  );
}
