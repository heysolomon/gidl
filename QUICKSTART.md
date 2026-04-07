# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

This will start the web app at [http://localhost:3000](http://localhost:3000)

### 3. View the Design System

Open your browser and navigate to `http://localhost:3000` to see the complete design system showcase including:

- **Typography** - All font scales with variable font settings
- **Colors** - Complete neutral and accent color palettes
- **Components** - Badges, buttons, quotes with all variants
- **Shadows & Effects** - Material glass, elevation shadows
- **Dark Mode Toggle** - Click the theme toggle in the top-right corner

---

## 📦 Project Structure

```
gidl/
├── apps/
│   └── web/                         # Landing page app
│       ├── app/
│       │   ├── layout.tsx           # Root layout with ThemeProvider
│       │   ├── page.tsx             # Design system showcase page
│       │   └── globals.css          # Imports design system CSS
│       └── package.json
│
├── packages/
│   ├── ui/                          # Design system package
│   │   ├── src/
│   │   │   ├── components/          # React components
│   │   │   │   ├── badge.tsx        # Badge & LiveBadge
│   │   │   │   ├── button.tsx       # Button & IconButton
│   │   │   │   ├── quote.tsx        # Quote component
│   │   │   │   ├── theme-provider.tsx  # Theme context
│   │   │   │   └── theme-toggle.tsx    # Theme switcher
│   │   │   ├── styles/
│   │   │   │   └── design-system.css   # Complete gidl design system
│   │   │   └── index.ts             # Package exports
│   │   └── package.json
│   │
│   └── config/                      # Shared configs
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── package.json                     # Root package.json
├── pnpm-workspace.yaml              # Workspace configuration
└── turbo.json                       # Turborepo pipeline
```

---

## 🎨 Using the Design System

### Import Components

```tsx
import { Badge, Button, Quote, ThemeToggle } from "@gidl/ui";
import "@gidl/ui/styles";

function MyApp() {
  return (
    <>
      <ThemeToggle />
      <Badge variant="featured">New</Badge>
      <Button variant="primary">Click me</Button>
    </>
  );
}
```

### Using Design Tokens

All design tokens are available as Tailwind classes:

```tsx
// Colors
<div className="bg-neutral-900 text-silver" />

// Custom shadows
<div className="shadow-elevation-md" />
<div className="shadow-fancy dark:shadow-fancy-dark" />

// Material glass effect
<div className="material-glass" />

// Font variations
<p className="font-var-base" />
<h1 className="font-var-heading" />

// Typography scale
<p className="text-base leading-relaxed sm:leading-golden" />
```

### CSS Custom Properties

Runtime theme values are available as CSS variables:

```tsx
<div className="bg-[var(--color-bg-page)]" />
<div className="text-[var(--color-text-primary)]" />
<div className="border-[var(--color-border-default)]" />
```

---

## 🌓 Dark Mode

The design system includes full dark mode support:

```tsx
import { ThemeProvider, useTheme } from "@gidl/ui";

// Wrap your app
function App() {
  return (
    <ThemeProvider>
      <YourContent />
    </ThemeProvider>
  );
}

// Use the theme hook
function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

---

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start all apps in dev mode with hot reload
pnpm build        # Build all apps and packages
pnpm start        # Start production server (after build)

# Code Quality
pnpm lint         # Run ESLint across all packages
pnpm type-check   # Run TypeScript type checking
pnpm format       # Format code with Prettier

# Cleanup
pnpm clean        # Remove node_modules and build artifacts
```

---

## 📝 Adding a New Page

1. Create a new file in `apps/web/app/`:

```tsx
// apps/web/app/about/page.tsx
import { Badge } from "@gidl/ui";

export default function AboutPage() {
  return (
    <div className="container-custom">
      <h1 className="text-4xl font-var-heading">About</h1>
      <Badge variant="featured">New Page</Badge>
    </div>
  );
}
```

2. Navigate to `http://localhost:3000/about`

---

## 🎯 Adding a New Component

1. Create component in `packages/ui/src/components/`:

```tsx
// packages/ui/src/components/card.tsx
import React from "react";

export interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated";
}

export function Card({ children, variant = "default" }: CardProps) {
  const variantClasses = {
    default: "bg-[var(--color-bg-surface)]",
    elevated: "material-glass",
  };

  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
```

2. Export it in `packages/ui/src/index.ts`:

```tsx
export { Card } from "./components/card";
export type { CardProps } from "./components/card";
```

3. Use it in your app:

```tsx
import { Card } from "@gidl/ui";

<Card variant="elevated">
  <h2>My Card</h2>
</Card>;
```

---

## 🎨 Customizing Design Tokens

Edit [`packages/ui/src/styles/design-system.css`](./packages/ui/src/styles/design-system.css):

```css
@theme {
  /* Change primary color */
  --color-indigo-500: #your-color;

  /* Add custom shadow */
  --shadow-custom: 0px 4px 12px rgba(0, 0, 0, 0.15);

  /* Modify spacing */
  --spacing-custom: 3.5rem;
}
```

Changes will hot-reload automatically!

---

## 🔍 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Clear Next.js cache

```bash
rm -rf apps/web/.next
pnpm dev
```

### Reinstall dependencies

```bash
pnpm clean
pnpm install
```

---

## 📚 Next Steps

1. **Explore the demo** - Check out all components at `http://localhost:3000`
2. **Read the docs** - See [README.md](./README.md) for detailed documentation
3. **View design specs** - See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete design tokens
4. **Build your app** - Start creating your own pages and components!

---

**Happy coding! 🎉**
