import { createCommand } from "commander";
import { SalveEngine } from "@salve/core";
import { SalveRegistry, SalveLoader } from "@salve/registry";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export const resolveCommand = createCommand("resolve")
    .description("Simulate a greeting resolution")
    .option("-l, --locale <locale>", "Locale to use", "en-US")
    .option("-n, --name <name>", "First name")
    .option("-s, --surname <surname>", "Last name")
    .option("-g, --gender <gender>", "Gender (male, female, nonBinary)")
    .option("-f, --formality <formality>", "Formality (formal, informal)", "formal")
    .option("-d, --date <date>", "ISO date string to simulate")
    .option("--policy-inference", "Allow gender inference", false)
    .action(async (options) => {
        const configPath = path.join(process.cwd(), "salve.config.json");
        const registry = new SalveRegistry();
        const loader = new SalveLoader(registry);

        if (await fs.pathExists(configPath)) {
            const config = await fs.readJson(configPath);
            console.log(chalk.gray(`Loading packs from salve.config.json...`));

            for (const packPath of config.packs) {
                try {
                    // Attempt to require the pack (assuming it's installed or relative)
                    // In a real CLI we'd handle dynamic imports or relative path resolution better
                    const pack = require(path.isAbsolute(packPath) ? packPath : path.join(process.cwd(), "node_modules", packPath));
                    loader.load([pack.default || pack]);
                } catch (e) {
                    console.warn(chalk.yellow(`Could not load pack: ${packPath}`));
                }
            }
        }

        const engine = new SalveEngine({ registry });

        const context = {
            now: options.date ? new Date(options.date) : new Date(),
            locale: options.locale,
            interaction: {
                formality: options.formality,
            },
            person: {
                givenNames: options.name ? [options.name] : undefined,
                surname: options.surname,
                gender: options.gender
            },
            policy: {
                allowGenderInference: options.policyInference
            }
        };

        try {
            console.log(chalk.gray("Resolving greeting..."));
            const result = await engine.resolve(context);

            console.log("\n" + chalk.bold("Result:"));
            console.log(chalk.cyan(result.salutation));
            console.log(chalk.gray(`Address: ${result.address}`));

            if (result.metadata.eventId) {
                console.log(chalk.gray(`\nEvent: ${result.metadata.eventId} (${result.metadata.domain})`));
            }
        } catch (e) {
            console.error(chalk.red("Resolution failed:"), e);
        }
    });
