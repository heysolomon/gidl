#!/usr/bin/env node
// Builds the public shadcn registry JSON files, excluding draft (unpublished)
// components — registry.json itself stays the full source of truth (used
// locally for the dev-only docs preview of drafts), but nothing unpublished
// should ever be installable via `npx shadcn add` or reachable at /r/*.json.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = "apps/web/public/r";

const registry = JSON.parse(
  readFileSync(path.join(ROOT, "registry.json"), "utf-8")
);
const meta = JSON.parse(
  readFileSync(path.join(ROOT, "registry-meta.json"), "utf-8")
);

const publicItems = registry.items.filter(
  (item) => meta[item.name]?.published !== false
);
const draftCount = registry.items.length - publicItems.length;

const tmpDir = mkdtempSync(path.join(tmpdir(), "gidl-registry-"));
const tmpRegistryPath = path.join(tmpDir, "registry.json");

try {
  writeFileSync(
    tmpRegistryPath,
    JSON.stringify({ ...registry, items: publicItems }, null, 2)
  );

  execFileSync(
    "npx",
    ["shadcn@latest", "build", tmpRegistryPath, "--cwd", ROOT, "--output", OUTPUT_DIR],
    { stdio: "inherit" }
  );
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

console.log(
  `Built ${publicItems.length} public registry item(s)` +
    (draftCount > 0 ? ` (excluded ${draftCount} draft).` : ".")
);
