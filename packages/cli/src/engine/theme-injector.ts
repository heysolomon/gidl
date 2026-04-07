import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
    foreground?: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    full?: string;
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
    xl?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: {
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
  };
}

export type TailwindVersion = "v3" | "v4";

interface ThemeInjectorOptions {
  tailwindVersion: TailwindVersion;
  configPath?: string;
  tokens?: DesignTokens;
  outputDir?: string;
}

const defaultTokens: DesignTokens = {
  colors: {
    primary: "#171717",
    secondary: "#737373",
    accent: "#3b82f6",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
    xl: "4rem",
  },
};

/**
 * Generate Tailwind v4 @theme block CSS
 */
function generateV4Theme(tokens: DesignTokens): string {
  const lines: string[] = ["@theme {"];

  // Colors
  lines.push("  /* Colors */");
  for (const [key, value] of Object.entries(tokens.colors)) {
    lines.push(`  --color-${key}: ${value};`);
  }

  // Radius
  lines.push("");
  lines.push("  /* Border Radius */");
  for (const [key, value] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }

  // Spacing
  lines.push("");
  lines.push("  /* Spacing */");
  for (const [key, value] of Object.entries(tokens.spacing)) {
    lines.push(`  --spacing-${key}: ${value};`);
  }

  // Typography
  if (tokens.typography) {
    lines.push("");
    lines.push("  /* Typography */");
    if (tokens.typography.fontFamily) {
      lines.push(`  --font-sans: ${tokens.typography.fontFamily};`);
    }
    if (tokens.typography.fontSize) {
      for (const [key, value] of Object.entries(tokens.typography.fontSize)) {
        lines.push(`  --text-${key}: ${value};`);
      }
    }
  }

  lines.push("}");
  return lines.join("\n");
}

/**
 * Generate Tailwind v3 config object
 */
function generateV3Config(tokens: DesignTokens): string {
  const config = {
    theme: {
      extend: {
        colors: tokens.colors,
        borderRadius: tokens.radius,
        spacing: tokens.spacing,
        ...(tokens.typography?.fontFamily && {
          fontFamily: { sans: [tokens.typography.fontFamily] },
        }),
        ...(tokens.typography?.fontSize && {
          fontSize: tokens.typography.fontSize,
        }),
      },
    },
  };

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: ${JSON.stringify(config.theme.extend, null, 6).replace(/"/g, "'")},
  },
  plugins: [],
};
`;
}

/**
 * Inject theme into appropriate file based on Tailwind version
 */
export async function injectTheme(
  options: ThemeInjectorOptions
): Promise<void> {
  const {
    tailwindVersion,
    configPath,
    tokens: providedTokens,
    outputDir = process.cwd(),
  } = options;

  // Load tokens from file or use provided/default
  let tokens: DesignTokens = defaultTokens;

  if (configPath) {
    const configFile = await fs.readFile(configPath, "utf-8");
    tokens = { ...defaultTokens, ...JSON.parse(configFile) };
  } else if (providedTokens) {
    tokens = { ...defaultTokens, ...providedTokens };
  }

  if (tailwindVersion === "v4") {
    await injectV4Theme(tokens, outputDir);
  } else {
    await injectV3Config(tokens, outputDir);
  }
}

/**
 * Inject @theme block into globals.css for Tailwind v4
 */
async function injectV4Theme(
  tokens: DesignTokens,
  outputDir: string
): Promise<void> {
  const cssPath = path.join(outputDir, "app", "globals.css");
  const themeBlock = generateV4Theme(tokens);

  let cssContent = "";

  if (await fs.pathExists(cssPath)) {
    cssContent = await fs.readFile(cssPath, "utf-8");

    // Replace existing @theme block or append
    const themeRegex = /@theme\s*\{[\s\S]*?\}/;
    if (themeRegex.test(cssContent)) {
      cssContent = cssContent.replace(themeRegex, themeBlock);
      console.log(chalk.gray("  Updated existing @theme block"));
    } else {
      // Insert after @import statements
      const importMatch = cssContent.match(/(@import[^;]+;[\s]*)+/);
      if (importMatch) {
        const insertIndex = importMatch.index! + importMatch[0].length;
        cssContent =
          cssContent.slice(0, insertIndex) +
          "\n" +
          themeBlock +
          "\n" +
          cssContent.slice(insertIndex);
      } else {
        cssContent = themeBlock + "\n\n" + cssContent;
      }
      console.log(chalk.gray("  Added @theme block to globals.css"));
    }
  } else {
    // Create new file
    cssContent = `@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);

${themeBlock}
`;
    await fs.ensureDir(path.dirname(cssPath));
    console.log(chalk.gray("  Created new globals.css with @theme block"));
  }

  await fs.writeFile(cssPath, cssContent);
  console.log(chalk.green(`  ✓ Wrote ${cssPath}`));
}

/**
 * Write Tailwind v3 config file
 */
async function injectV3Config(
  tokens: DesignTokens,
  outputDir: string
): Promise<void> {
  const configPath = path.join(outputDir, "tailwind.config.js");
  const configContent = generateV3Config(tokens);

  await fs.writeFile(configPath, configContent);
  console.log(chalk.green(`  ✓ Wrote ${configPath}`));
}
