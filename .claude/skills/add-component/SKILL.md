---
name: add-component
description: Scaffold a new animated component into the gidl registry — source file, registry.json entry, draft metadata, package export, and docs preview wiring. Use whenever the user wants to add, create, or build a new component for the gidl library/registry.
---

# Adding a component to the gidl registry

Follow these steps in order. This is the exact workflow used for every existing
registry component (`animated-tabs`, `collins-carousel`, `flip-cards`,
`agentation-toolbar`, `sidebar-list`) — don't invent a different structure.

## 1. Write the component

Source goes in `packages/ui/src/registry/components/<name>.tsx`. Add a
`<name>.module.css` alongside it if it needs styles beyond Tailwind utilities
(see `agentation-toolbar.module.css` for the pattern).

Import conventions that matter for portability once someone installs this
outside the monorepo:

- Use `@/lib/utils` for `cn`, never a relative path like `../../lib/utils` —
  shadcn's CLI rewrites `@/...` aliases to match the consumer's own
  `components.json`, but it does NOT rewrite relative paths, and a relative
  path assumes a specific install depth that won't hold once the file is
  copied elsewhere. (This was a real bug fixed in `animated-tabs.tsx` and
  `flip-cards.tsx` — don't reintroduce it.)
- Same goes for any shared lib/action file: reference it via its `@/...`
  alias, not a relative path.
- If you need a raw Radix primitive that a shared `@/components/ui/<x>`
  wrapper doesn't expose (e.g. `TabsPrimitive.Trigger` for a custom ref),
  import it directly from its own `@radix-ui/react-*` package — see step 2 for
  why that package then MUST be declared explicitly.

## 2. Register it in `registry.json` (repo root)

Add an item to the `items` array:

```json
{
  "name": "component-name",
  "type": "registry:block",
  "title": "Component Name",
  "description": "One sentence. Use [text](url) markdown links for credit/inspiration sources.",
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    {
      "path": "packages/ui/src/registry/components/component-name.tsx",
      "type": "registry:component"
    }
  ]
}
```

**Before moving on, grep the component's own imports and cross-check every
external npm package against `dependencies`:**

```bash
grep -n '^import' packages/ui/src/registry/components/<name>.tsx
```

Declare every npm package imported (`motion`, `lucide-react`,
`@radix-ui/react-*`, etc.) — including ones you might assume arrive
transitively through a `registryDependencies` entry. That assumption is
exactly what broke `animated-tabs`: it relied on the `tabs`
registryDependency to pull in `@radix-ui/react-tabs`, but the official shadcn
`tabs` component now uses a different unified `radix-ui` package internally,
so the raw import silently had nothing installing it. `dependencies` is what
the installer (`shadcn add` and `use-gidl add`) actually reads — don't rely on
inference.

Use `registryDependencies` only for official shadcn primitives (e.g.
`"tabs"`) that the component imports pre-built, styled wrapper components
from (`@/components/ui/tabs`), not for raw Radix packages.

If the component needs shared supporting files (a server action, a lib
module), add them as additional `registry:lib` entries in `files`, pointing
at their real location (e.g. `apps/web/actions/...`, `apps/web/lib/...`).

## 3. Add draft metadata in `registry-meta.json` (repo root)

```json
"component-name": { "order": <next number>, "published": false, "isNew": true }
```

`published: false` means: visible at `/docs/components/<name>` in local dev
only, excluded from the public `/r/*.json` build output. This is the normal
starting state — don't publish immediately.

## 4. Export it

Add to `packages/ui/src/index.ts`:

```ts
export { ComponentName } from "./registry/components/component-name";
```

(Match the existing export style in that file — some components are default
exports re-exported with `as`, most newer ones are named exports.)

## 5. Wire up the docs preview

Add to `apps/web/lib/registry-components.tsx`:

```ts
import { ComponentName, /* ...existing imports */ } from "@gidl/ui";

export const registryComponents: Record<string, ComponentType> = {
  // ...existing entries
  "component-name": ComponentName,
};
```

## 6. Verify

```bash
pnpm --filter @gidl/ui type-check
pnpm --filter web type-check
pnpm dev   # from repo root
```

Visit `http://localhost:3000/docs/components/<name>` and confirm it renders
(check both light/dark mode if it has theme-aware styling). A "Draft" pill
should show next to the title.

## 7. Publishing

When it's ready to ship, flip `registry-meta.json`'s entry to
`"published": true`, then rebuild the public registry:

```bash
node scripts/build-registry.mjs
```

Confirm the new item appears in `apps/web/public/r/` and the build's summary
line count increases (`Built N public registry item(s)`). Optionally add it
to the README's components table.
