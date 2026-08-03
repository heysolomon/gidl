#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import {
  fetchRegistry,
  findItem,
  fetchFileContent,
  resolveTargetPath,
} from "./registry.js";

const program = new Command();

program
  .name("use-gidl")
  .description("Gidl - Minimalist Animation Components")
  .version("0.1.0");

function detectPackageManager(cwd: string): "pnpm" | "yarn" | "npm" {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function installCommand(
  pm: "pnpm" | "yarn" | "npm",
  packages: string[]
): string {
  if (pm === "pnpm") return `pnpm add ${packages.join(" ")}`;
  if (pm === "yarn") return `yarn add ${packages.join(" ")}`;
  return `npm install ${packages.join(" ")}`;
}

program
  .command("add <component>")
  .description("Add a component to your project")
  .option(
    "-p, --path <path>",
    "Path to add component files to",
    "./components/ui"
  )
  .option("--no-install", "Skip installing npm dependencies")
  .action(async (component, options) => {
    console.log(chalk.bold("\n✨ Gidl - Adding component...\n"));

    try {
      console.log(chalk.gray("Fetching registry..."));
      const registry = await fetchRegistry();
      const item = findItem(registry, component);

      if (!item) {
        const available = registry.items.map((i) => i.name).join(", ");
        throw new Error(
          `Component "${component}" not found. Available components: ${available}`
        );
      }

      console.log(
        chalk.gray(`Fetching ${item.files.length} file(s) for ${item.title}...`)
      );

      for (const file of item.files) {
        const content = await fetchFileContent(file.path);
        const targetPath = resolveTargetPath(file.path, options.path);
        const fullPath = path.resolve(process.cwd(), targetPath);

        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, content, "utf-8");
        console.log(chalk.gray(`  wrote ${targetPath}`));
      }

      console.log(chalk.green(`\n✓ Added ${chalk.bold(item.title)}\n`));

      if (item.dependencies && item.dependencies.length > 0) {
        if (options.install) {
          const pm = detectPackageManager(process.cwd());
          const cmd = installCommand(pm, item.dependencies);
          console.log(
            chalk.gray(
              `Installing dependencies: ${item.dependencies.join(", ")}`
            )
          );
          execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
          console.log(chalk.green("✓ Dependencies installed\n"));
        } else {
          console.log(
            chalk.yellow(
              `Skipped install. Run: npm install ${item.dependencies.join(" ")}\n`
            )
          );
        }
      }

      if (item.registryDependencies && item.registryDependencies.length > 0) {
        console.log(
          chalk.blue(
            `This component also depends on shadcn/ui component(s): ${item.registryDependencies.join(", ")}`
          )
        );
        console.log(
          chalk.gray(
            `  Install with: npx shadcn@latest add ${item.registryDependencies.join(" ")}\n`
          )
        );
      }
    } catch (error: any) {
      console.error(chalk.red("\n❌ Error:"), error.message);
      process.exit(1);
    }
  });

program.parse();
