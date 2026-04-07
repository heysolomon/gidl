#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import https from "https";

const program = new Command();

program
  .name("gidl")
  .description("Gidl - Minimalist Animation Components")
  .version("0.1.0");

async function fetchComponent(componentName: string) {
  const url = `https://raw.githubusercontent.com/heysolomon/gidl/main/packages/ui/src/registry/components/${componentName}.tsx`;

  return new Promise<string>((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Component ${componentName} not found (Status: ${res.statusCode})`));
          return;
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", reject);
  });
}

program
  .command("add <component>")
  .description("Add a component to your project")
  .option("-p, --path <path>", "Path to add the component", "./components/ui")
  .action(async (component, options) => {
    console.log(chalk.bold("\n✨ Gidl - Adding component...\n"));

    try {
      console.log(chalk.gray(`Fetching component: ${component}...`));
      
      const content = await fetchComponent(component);
      const targetDir = path.resolve(process.cwd(), options.path);
      const targetFile = path.join(targetDir, `${component}.tsx`);

      await fs.ensureDir(targetDir);
      await fs.writeFile(targetFile, content, "utf-8");

      console.log(chalk.green(`\n✓ Successfully added ${chalk.bold(component)} to ${options.path}\n`));
      console.log(chalk.blue("Don't forget to install motion: npm install motion"));
    } catch (error: any) {
      console.error(chalk.red("\n❌ Error:"), error.message);
      process.exit(1);
    }
  });

program.parse();
