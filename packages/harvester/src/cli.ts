import * as fs from "fs";
import * as path from "path";
import { UnObservancesHarvester } from "./harvesters/UnObservancesHarvester";
import { SalveHarvester, HarvesterOptions } from "./types";
import { stringifyYaml } from "./utils/yaml";

class HarvesterRegistry {
    private harvesters: SalveHarvester[] = [];

    public register(harvester: SalveHarvester) {
        this.harvesters.push(harvester);
    }

    public async run(id: string | "all", options: HarvesterOptions) {
        const targets = id === "all"
            ? this.harvesters
            : this.harvesters.filter(h => h.id === id);

        if (targets.length === 0) {
            console.error(`❌ No harvester found with id "${id}"`);
            return;
        }

        for (const h of targets) {
            console.log(`🚀 Running harvester: ${h.id}`);
            try {
                const data = await h.harvest();
                const yaml = stringifyYaml(data);

                if (options.dryRun) {
                    console.log(`\n--- DRY RUN OUTPUT FOR ${h.id} ---\n`);
                    console.log(yaml);
                } else {
                    // Try to find project root (where .git or package.json is)
                    let root = process.cwd();
                    while (root !== "/" && !fs.existsSync(path.join(root, "package.json"))) {
                        root = path.dirname(root);
                    }
                    // For this specific monorepo, if we are in packages/harvester, we need to go up twice
                    if (root.endsWith("packages/harvester")) {
                        root = path.join(root, "../../");
                    }

                    const fullPath = path.resolve(root, h.defaultOutputPath);
                    const dir = path.dirname(fullPath);
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                    fs.writeFileSync(fullPath, yaml, "utf-8");
                    console.log(`✅ ${h.id} data written to ${fullPath}`);
                }
            } catch (err) {
                console.error(`❌ Harvester ${h.id} failed:`, err instanceof Error ? err.message : err);
            }
        }
    }

    public getIds(): string[] {
        return this.harvesters.map(h => h.id);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes("--dry-run");
    const skipWikidata = args.includes("--no-wikidata");
    const id = args.find(a => !a.startsWith("--")) || "all";

    const registry = new HarvesterRegistry();

    // Register all harvesters
    registry.register(new UnObservancesHarvester({ dryRun, skipWikidata }));

    if (args.includes("--list")) {
        console.log("Available harvesters:", registry.getIds().join(", "));
        return;
    }

    await registry.run(id as any, { dryRun, skipWikidata });
}

main().catch(console.error);
