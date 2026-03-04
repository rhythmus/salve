import { createCommand } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export const addCommand = createCommand("add")
    .description("Add a Salve pack or plugin to the configuration")
    .argument("<package>", "NPM package name or local path to the pack")
    .action(async (pkg) => {
        const configPath = path.join(process.cwd(), "salve.config.json");

        if (!(await fs.pathExists(configPath))) {
            console.error(chalk.red("Error: salve.config.json not found. Run 'salve init' first."));
            process.exit(1);
        }

        const config = await fs.readJson(configPath);

        // Determine if it's a pack or plugin based on name (naive heuristic)
        if (pkg.includes("pack-") || pkg.includes("locale-")) {
            if (!config.packs.includes(pkg)) {
                config.packs.push(pkg);
                console.log(chalk.green(`Added pack [${pkg}] to config.`));
            } else {
                console.log(chalk.yellow(`Pack [${pkg}] is already registered.`));
            }
        } else {
            if (!config.plugins.includes(pkg)) {
                config.plugins.push(pkg);
                console.log(chalk.green(`Added plugin [${pkg}] to config.`));
            } else {
                console.log(chalk.yellow(`Plugin [${pkg}] is already registered.`));
            }
        }

        await fs.writeJson(configPath, config, { spaces: 2 });
    });
