import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { Project, SyntaxKind } from "ts-morph";

export interface ScaffoldConfig {
  blueprint: string;
  tailwind: "v3" | "v4";
  stateProvider?: "zustand" | "tanstack" | "none";
  features?: string[];
  projectPath?: string;
}

interface BlueprintDefinition {
  name: string;
  features: string[];
  description: string;
}

const blueprints: Record<string, BlueprintDefinition> = {
  saas: {
    name: "SaaS",
    description: "Multi-tenant auth, billing, dashboard",
    features: ["auth", "billing", "dashboard", "teams"],
  },
  fintech: {
    name: "Fintech",
    description: "KYC, transactions, compliance",
    features: ["auth", "kyc", "transactions", "compliance"],
  },
  ecommerce: {
    name: "E-commerce",
    description: "Catalog, cart, checkout, orders",
    features: ["catalog", "cart", "checkout", "orders"],
  },
  enterprise: {
    name: "Enterprise",
    description: "SSO, audit logs, RBAC",
    features: ["sso", "audit", "rbac", "admin"],
  },
  blog: {
    name: "Blog",
    description: "MDX, categories, tags, RSS feed",
    features: ["posts", "categories", "tags", "rss"],
  },
  portfolio: {
    name: "Portfolio",
    description: "Projects, about, contact, gallery",
    features: ["projects", "about", "contact", "gallery"],
  },
  docs: {
    name: "Documentation",
    description: "Documentation, search, versioning",
    features: ["docs", "search", "navigation", "versioning"],
  },
  landing: {
    name: "Landing Page",
    description: "Hero, features, testimonials, CTA",
    features: ["hero", "features", "testimonials", "cta"],
  },
  dashboard: {
    name: "Dashboard",
    description: "Analytics, charts, data tables",
    features: ["analytics", "charts", "tables", "settings"],
  },
  marketplace: {
    name: "Marketplace",
    description: "Multi-vendor, reviews, payments",
    features: ["vendors", "products", "reviews", "payments"],
  },
};

/**
 * Generate feature module structure
 */
function generateFeatureFiles(featureName: string): Record<string, string> {
  const pascalCase = featureName.charAt(0).toUpperCase() + featureName.slice(1);

  return {
    "index.ts": `// ${pascalCase} feature barrel export
export * from './actions';
export * from './schema';
`,
    "actions.ts": `'use server';

// ${pascalCase} server actions

export async function get${pascalCase}() {
  // TODO: Implement
  return [];
}

export async function create${pascalCase}(data: unknown) {
  // TODO: Implement
  console.log('Creating ${featureName}:', data);
}
`,
    "schema.ts": `import { z } from 'zod';

// ${pascalCase} validation schemas

export const ${featureName}Schema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ${pascalCase} = z.infer<typeof ${featureName}Schema>;
`,
    "components/.gitkeep": "",
  };
}

/**
 * Generate shared utilities
 */
function generateSharedFiles(): Record<string, string> {
  return {
    "shared/utils/cn.ts": `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
    "shared/types/index.ts": `// Shared type definitions

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
`,
  };
}

/**
 * Scaffold project with blueprint
 */
export async function scaffold(config: ScaffoldConfig): Promise<void> {
  const {
    blueprint,
    tailwind,
    stateProvider = "tanstack",
    projectPath = process.cwd(),
  } = config;

  const blueprintDef = blueprints[blueprint];
  if (!blueprintDef) {
    throw new Error(
      `Unknown blueprint: ${blueprint}. Available: ${Object.keys(blueprints).join(", ")}`
    );
  }

  console.log(chalk.blue(`  Scaffolding ${blueprintDef.name} blueprint...`));

  const srcPath = path.join(projectPath, "src");
  const featuresPath = path.join(srcPath, "features");

  // Create feature directories
  for (const feature of blueprintDef.features) {
    console.log(chalk.gray(`  Creating feature: ${feature}`));
    const featurePath = path.join(featuresPath, feature);
    const files = generateFeatureFiles(feature);

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(featurePath, filePath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content);
    }
  }

  // Create shared utilities
  console.log(chalk.gray("  Creating shared utilities..."));
  const sharedFiles = generateSharedFiles();
  for (const [filePath, content] of Object.entries(sharedFiles)) {
    const fullPath = path.join(srcPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content);
  }

  // Inject provider if needed
  if (stateProvider === "tanstack") {
    console.log(chalk.gray("  Injecting TanStack Query provider..."));
    await injectTanStackProvider(projectPath);
  }

  console.log(
    chalk.green(`  ✓ Created ${blueprintDef.features.length} feature modules`)
  );
}

/**
 * Surgically inject TanStack Query provider into layout.tsx
 */
async function injectTanStackProvider(projectPath: string): Promise<void> {
  const layoutPath = path.join(projectPath, "app", "layout.tsx");

  if (!(await fs.pathExists(layoutPath))) {
    console.log(
      chalk.yellow("  ⚠ layout.tsx not found, creating with provider...")
    );
    await createLayoutWithProvider(layoutPath);
    return;
  }

  // Use ts-morph for surgical AST manipulation
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(layoutPath);

  // Check if already has QueryClientProvider
  const hasProvider = sourceFile.getFullText().includes("QueryClientProvider");
  if (hasProvider) {
    console.log(chalk.gray("  TanStack Query provider already present"));
    return;
  }

  // Add imports
  const existingImports = sourceFile.getImportDeclarations();
  const lastImport = existingImports[existingImports.length - 1];

  if (lastImport) {
    lastImport.replaceWithText(`${lastImport.getText()}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();`);
  }

  // Find the body content and wrap with provider
  // This is a simplified approach - in production would need more robust AST manipulation
  let text = sourceFile.getFullText();

  // Wrap children with QueryClientProvider
  text = text.replace(
    /(\{children\})/,
    "<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>"
  );

  sourceFile.replaceWithText(text);
  await sourceFile.save();

  console.log(chalk.green("  ✓ Injected TanStack Query provider"));
}

/**
 * Create layout.tsx with provider if it doesn't exist
 */
async function createLayoutWithProvider(layoutPath: string): Promise<void> {
  const content = `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: 'Gidl Project',
  description: 'Built with Gidl - Architectural Engine for Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
`;

  await fs.ensureDir(path.dirname(layoutPath));
  await fs.writeFile(layoutPath, content);
}
