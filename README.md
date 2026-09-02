# gidl

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-cc00ff.svg)](https://turbo.build/)

Animated UI components, recreated from inspiration found around the web and rebuilt as a [shadcn/ui](https://ui.shadcn.com) registry — copy them into your own project with a single command, no npm dependency to manage.

**[gidl.dev](https://gidl.dev)** · [Browse components](https://gidl.dev/docs)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheysolomon%2Fgidl)

## Install a component

Every component is installed straight into your own codebase via the [shadcn CLI](https://ui.shadcn.com/docs/cli) — you own the code, and its npm dependencies (Motion, Radix primitives, etc.) are installed automatically alongside it.

```bash
npx shadcn@latest add https://gidl.dev/r/animated-tabs.json
```

### Available components

| Component                                                             | Install                                                          |
| --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Animated Tabs](https://gidl.dev/docs/components/animated-tabs)       | `npx shadcn@latest add https://gidl.dev/r/animated-tabs.json`    |
| [Collins Carousel](https://gidl.dev/docs/components/collins-carousel) | `npx shadcn@latest add https://gidl.dev/r/collins-carousel.json` |
| [Flip Cards](https://gidl.dev/docs/components/flip-cards)             | `npx shadcn@latest add https://gidl.dev/r/flip-cards.json`       |

More components ship regularly — see [gidl.dev/docs](https://gidl.dev/docs) for the full, current list.

## Project structure

This is a monorepo powered by [Turborepo](https://turbo.build/repo) and [pnpm workspaces](https://pnpm.io/workspaces).

```
gidl/
├── apps/
│   └── web/                        # gidl.dev — docs site + the registry HTTP endpoints
│       ├── app/docs/                   # Component docs pages
│       └── public/r/                   # Built registry JSON, served at gidl.dev/r/*.json
├── packages/
│   ├── ui/
│   │   └── src/
│   │       ├── registry/components/    # Source for every installable component
│   │       ├── components/             # Internal building blocks for the docs site
│   │       └── styles/                 # gidl's own design system (used by apps/web)
│   └── config/                     # Shared Tailwind & TypeScript config
├── registry.json                   # Registry source of truth (shadcn schema)
├── registry-meta.json              # Docs ordering + published/draft status per item
├── scripts/build-registry.mjs      # Builds registry.json → apps/web/public/r/*.json
└── turbo.json
```

## Local development

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

### Setup

```bash
pnpm install
pnpm dev
```

This starts the docs site at [http://localhost:3000](http://localhost:3000) with hot reload across all packages.

### Available scripts

```bash
pnpm dev            # Start the docs site in development mode
pnpm build          # Build the registry JSON, then build all apps/packages
pnpm registry:build  # Build apps/web/public/r/*.json from registry.json
pnpm lint            # Run ESLint across all workspaces
pnpm type-check      # Run TypeScript type checking
pnpm format          # Format code with Prettier
pnpm clean           # Remove all node_modules and build artifacts
```

## Adding a new component to the registry

1. Add the component's source to `packages/ui/src/registry/components/`.
2. Register it as an item in `registry.json` (name, title, description, `dependencies` for every npm package it imports, `registryDependencies` for any official shadcn primitives it needs, and its `files`).
3. Add an entry to `registry-meta.json` — set `published: false` while it's still a draft; drafts render at `/docs/components/<name>` in development only, and are excluded from the public `/r/*.json` output.
4. Export it from `packages/ui/src/index.ts`, and add it to the preview map in `apps/web/lib/registry-components.tsx`.
5. Run `pnpm registry:build` to regenerate the public registry JSON.

Flip `published: true` in `registry-meta.json` once it's ready to ship.

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Motion](https://motion.dev/)
- **Component distribution**: [shadcn](https://ui.shadcn.com) registry format
- **Monorepo**: [Turborepo](https://turbo.build/repo) + [pnpm](https://pnpm.io/)
- **React**: React 19

## Customizing gidl's own design system

The docs site's look (colors, typography, shadows, animations) is defined in [`packages/ui/src/styles/design-system.css`](./packages/ui/src/styles/design-system.css) using Tailwind v4's `@theme` directive. This only affects gidl.dev itself — it isn't shipped as part of any installed component.

## Contributing

Contributions are welcome! Please review our [Contributing Guidelines](CONTRIBUTING.md) to get started, and ensure that you follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

Built by [Solomon Akuson](https://www.solomonakuson.com).
