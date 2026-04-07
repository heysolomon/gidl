# Contributing to gidl

First off, thank you for considering contributing to gidl! It's people like you that make gidl such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

This project is a monorepo built with [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/).

### Prerequisites
* Node.js >= 20.0.0
* pnpm >= 9.0.0

### Local Development

1. Fork the repository and clone it locally.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

### Making a Pull Request

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
2. Make your changes in the appropriate package under `apps/` or `packages/`.
3. Ensure your code satisfies the linting and formatting rules:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm format
   ```
4. Commit your changes using Conventional Commits guidelines (this repo uses `commitlint`):
   ```bash
   git commit -m "feat(ui): add awesome feature to badge component"
   ```
5. Push your branch and open a Pull Request!

## Project Structure
- `apps/web`: The Next.js 15 landing page/documentation site.
- `packages/ui`: The core React component library and Tailwind v4 design system.
- `packages/config`: Shared configurations across the monorepo.

Thank you for contributing!
