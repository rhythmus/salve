import { createCommand } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export const initCommand = createCommand("init")
    .description("Initialize a new Salve project configuration")
    .action(async () => {
        const configPath = path.join(process.cwd(), "salve.config.json");

        if (await fs.pathExists(configPath)) {
            console.log(chalk.yellow("salve.config.json already exists."));
            return;
        }

        const defaultConfig = {
            locale: "en-US",
            packs: [],
            plugins: ["@salve/calendars-gregorian"]
        };

        await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
        console.log(chalk.green("Created salve.config.json"));

        // Create basic directory structure
        await fs.ensureDir(path.join(process.cwd(), "packs"));
        console.log(chalk.blue("Created packs/ directory"));
    });
