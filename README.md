# gidl

A design system configuration tool for shadcn/ui projects, built with the comprehensive gidl design system.

## 🏗️ Project Structure

This is a monorepo powered by [Turborepo](https://turbo.build/repo) and [pnpm workspaces](https://pnpm.io/workspaces).

```
gidl/
├── apps/
│   └── web/                    # Landing page (Next.js 16 + App Router + Turbopack)
├── packages/
│   ├── ui/                     # Shared UI components & design system
│   │   └── src/
│   │       ├── components/     # React components
│   │       └── styles/         # Design system CSS (Tailwind v4)
│   └── config/                 # Shared configurations
│       ├── tailwind.config.ts  # Base Tailwind config
│       └── tsconfig.json       # Base TypeScript config
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── turbo.json                  # Turborepo configuration
```

## 🎨 Design System

The **gidl Design System** is fully implemented using Tailwind CSS v4's new `@theme` inline directive syntax. It includes:

### Core Features

- **Complete Color Palette** - Light & dark mode support with CSS custom properties
- **Variable Fonts** - OpenType font variation settings ('opsz', 'wght')
- **Typography Scale** - Carefully crafted font sizes, weights, and line heights
- **Custom Shadows** - Elevation system with material glass effects
- **Animations** - Keyframe animations with custom easing functions
- **Component Styles** - Pre-built styles for badges, buttons, quotes, links, and more
- **Responsive Design** - Mobile-first approach with breakpoint system
- **Dark Mode** - Class-based theme switching with runtime CSS custom properties

### Design Tokens

All design tokens are defined in [`packages/ui/src/styles/design-system.css`](./packages/ui/src/styles/design-system.css) using the `@theme` directive:

- **Colors**: Neutrals, grays, silver, indigo, orange, amber, red, rose, and map pins
- **Typography**: Font families, sizes (xs to 5xl), weights, line heights, letter spacing
- **Spacing**: 0 to 32rem scale (following 4px base unit)
- **Shadows**: elevation-sm, elevation-md, fancy, fancyDark, dark, border
- **Border Radius**: sm, default, md, lg, xl, 2xl, full
- **Timing Functions**: in-expo, out-expo, spring
- **Animations**: spin-slow, scale, fadeIn, shake, bannerFadeIn
- **Container**: Max-width and responsive padding

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

### Installation

1. **Install dependencies**:

```bash
pnpm install
```

2. **Run the development server**:

```bash
pnpm dev
```

This will start:

- Web app at [http://localhost:3000](http://localhost:3000)
- Hot reload enabled across all packages
- Turborepo's TUI for monitoring tasks

3. **Open your browser** and navigate to `http://localhost:3000` to see the design system demo.

### Available Scripts

```bash
# Development
pnpm dev          # Start all apps in development mode

# Build
pnpm build        # Build all apps and packages

# Lint
pnpm lint         # Run ESLint across all workspaces

# Type Check
pnpm type-check   # Run TypeScript type checking

# Clean
pnpm clean        # Remove all node_modules and build artifacts

# Format
pnpm format       # Format code with Prettier
```

## 📦 Packages

### `@gidl/ui`

Shared UI component library with the complete gidl design system.

**Exports:**

- `ThemeProvider` - React context provider for theme management
- `ThemeToggle` - Theme switcher component
- `Badge`, `LiveBadge` - Badge components with variants
- `Button`, `IconButton` - Button components
- `Quote` - Blockquote component
- Design system CSS via `@gidl/ui/styles`

**Usage:**

```tsx
import { Badge, Button, ThemeProvider } from "@gidl/ui";
import "@gidl/ui/styles";

function App() {
  return (
    <ThemeProvider>
      <Badge variant="featured">New</Badge>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}
```

### `@gidl/config`

Shared configuration files for Tailwind CSS and TypeScript.

**Exports:**

- `tailwind.config.ts` - Base Tailwind configuration
- `tsconfig.json` - Base TypeScript configuration

## 🎯 Design System Features

### Color System

The design system includes:

- **Light Mode**: Gray-50 background, neutral-800 text, white surfaces
- **Dark Mode**: Neutral-950 background, silver text, neutral-900 surfaces
- **Accent Colors**: Indigo (primary), orange, amber, red, rose
- **Semantic Colors**: Info, success, warning, error
- **CSS Custom Properties**: Runtime theme switching

### Typography

Variable font implementation with OpenType axes:

```css
/* Base text */
font-variation-settings:
  "opsz" 15,
  "wght" 450;

/* Headings */
font-variation-settings:
  "opsz" 24,
  "wght" 650;

/* Meta text */
font-variation-settings:
  "opsz" 14,
  "wght" 400;
```

### Material Glass Effect

Pre-built utility class for glassmorphism:

```tsx
<div className="material-glass">
  {/* Content with backdrop blur and translucent background */}
</div>
```

### Responsive Breakpoints

```
sm:  640px   - Tablet portrait
md:  768px   - Tablet landscape
lg:  1024px  - Desktop
xl:  1280px  - Large desktop
2xl: 1536px  - Extra large desktop
```

## 🔧 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Monorepo**: [Turborepo](https://turbo.build/repo)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **React**: React 19

## 📁 Adding New Apps

To add a new app to the monorepo:

1. **Create a new directory** in `apps/`:

```bash
mkdir apps/my-new-app
```

2. **Initialize the app** (e.g., with Next.js):

```bash
cd apps/my-new-app
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir
```

3. **Update `package.json`** to use workspace dependencies:

```json
{
  "dependencies": {
    "@gidl/ui": "workspace:*"
  },
  "devDependencies": {
    "@gidl/config": "workspace:*"
  }
}
```

4. **Import the design system** in your app:

```tsx
// app/layout.tsx
import "@gidl/ui/styles";
import { ThemeProvider } from "@gidl/ui";
```

5. **Update `tailwind.config.ts`** to include the UI package:

```ts
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
};
```

6. **Run the development server**:

```bash
pnpm dev
```

## 🎨 Customizing the Design System

All design tokens are centralized in [`packages/ui/src/styles/design-system.css`](./packages/ui/src/styles/design-system.css).

### Changing Colors

Edit the `@theme` block:

```css
@theme {
  --color-indigo-500: #your-color;
}
```

### Adding Custom Shadows

Define new shadow tokens:

```css
@theme {
  --shadow-custom: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Creating New Animations

Add keyframes and reference them:

```css
@keyframes customAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@theme {
  --animate-custom: customAnimation 0.3s ease-out;
}
```

## 📚 Documentation

- [Design System Specification](./DESIGN_SYSTEM.md) - Complete design system documentation
- [Tailwind v4 Documentation](https://tailwindcss.com/docs/v4-beta) - New @theme syntax
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook) - Monorepo best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

Design system based on the **gidl Design System** by Solomon Akuson.

---

Built with ❤️ using Next.js 15, Tailwind CSS v4, and Turborepo.
