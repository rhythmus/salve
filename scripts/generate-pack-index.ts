/**
 * Generate a machine-readable pack index from the data/packs/ directory tree.
 *
 * The index records metadata for each YAML source file that can be used
 * by future custom pack builders to assemble minimal, targeted bundles.
 *
 * Output:
 *   data/pack-index.generated.json
 *
 * Each entry includes:
 *   - file:       path relative to data/packs/
 *   - family:     pack category (greetings, events, address, protocol, etc.)
 *   - scopeType:  what the scope token represents (language, locale, country, shared, supranational, tradition)
 *   - selector:   the primary scope identifier (e.g. "nl", "el-GR", "GR", "EU")
 *   - tags:       additional classification labels for filtering
 *   - domain:     protocol domain if applicable (academic, judicial, diplomatic, etc.)
 */

import * as fs from "fs";
import * as path from "path";
import { discoverAllYAML } from "./lib/discover-packs";

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "data", "packs");
const OUTPUT_FILE = path.join(ROOT, "data", "pack-index.generated.json");

interface PackIndexEntry {
    file: string;
    family: string;
    scopeType: string;
    selector: string;
    tags: string[];
    domain?: string;
}

const BCP47_LOCALE = /^[a-z]{2,3}-[A-Z]{2}$/;
const ISO_LANGUAGE = /^[a-z]{2,3}$/;
const ISO_COUNTRY = /^[A-Z]{2}$/;

function classifyFile(relPath: string, basename: string): PackIndexEntry | null {
    let family = "";
    let scopeType = "";
    let selector = "";
    let tags: string[] = [];
    let domain: string | undefined;

    if (basename.includes(".greetings.")) {
        family = "greetings";
        selector = basename.split(".greetings.")[0];
    } else if (basename.includes(".events.")) {
        family = "events";
        selector = basename.split(".events.")[0];
    } else if (basename.includes(".address.")) {
        family = "address";
        selector = basename.split(".address.")[0];
    } else if (basename.includes(".protocol.")) {
        family = "protocol";
        const parts = basename.replace(/\.yaml$/, "").split(".protocol.");
        selector = parts[0];
        domain = parts[1] || undefined;
        if (domain) tags.push(domain);
    } else if (basename.includes(".locales.")) {
        family = "locales";
        selector = basename.split(".locales.")[0];
    } else if (basename.includes(".regions.")) {
        family = "regions";
        selector = basename.split(".regions.")[0];
    } else if (basename.includes(".nameday-saints.")) {
        family = "nameday-saints";
        selector = basename.split(".nameday-saints.")[0];
    } else if (basename.includes(".nameday-calendar.")) {
        family = "nameday-calendar";
        selector = basename.split(".nameday-calendar.")[0];
    } else {
        return null;
    }

    const SUPRANATIONAL_CODES = new Set(["EU"]);

    if (BCP47_LOCALE.test(selector)) {
        scopeType = "locale";
    } else if (SUPRANATIONAL_CODES.has(selector)) {
        scopeType = "supranational";
    } else if (ISO_COUNTRY.test(selector)) {
        scopeType = "country";
    } else if (ISO_LANGUAGE.test(selector)) {
        scopeType = "language";
    } else if (selector.startsWith("international")) {
        scopeType = "shared";
    } else {
        scopeType = "tradition";
    }

    if (family === "events") {
        const dir = path.dirname(relPath);
        if (dir.includes("tradition")) {
            tags.push("tradition");
            if (selector.toLowerCase().includes("christian")) tags.push("religious", "christian");
            if (selector.toLowerCase().includes("orthodox")) tags.push("orthodox");
            if (selector.toLowerCase().includes("muslim")) tags.push("religious", "muslim");
            if (selector === "Chinese") tags.push("cultural");
        } else if (dir.includes("shared")) {
            if (selector.includes("secular")) tags.push("secular");
            if (selector.includes("base")) tags.push("base");
        } else if (dir.includes("country")) {
            tags.push("country");
        } else if (dir.includes("supranational")) {
            tags.push("supranational");
        }
    }

    tags = [...new Set(tags)];

    return { file: relPath, family, scopeType, selector, tags, domain };
}

console.log("Generating pack index from data/packs/...\n");

const allFiles = discoverAllYAML(PACKS_DIR);
const entries: PackIndexEntry[] = [];

for (const fullPath of allFiles) {
    const relPath = path.relative(PACKS_DIR, fullPath);
    const basename = path.basename(fullPath);
    const entry = classifyFile(relPath, basename);
    if (entry) {
        entries.push(entry);
        console.log(`  ${relPath} → ${entry.family}/${entry.scopeType}/${entry.selector}`);
    } else {
        console.warn(`  ⚠  Skipped unrecognized file: ${relPath}`);
    }
}

const index = {
    generatedAt: new Date().toISOString(),
    description: "Machine-readable pack index for selective bundle compilation.",
    packs: entries,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2) + "\n", "utf-8");

console.log(`\nGenerated ${OUTPUT_FILE}`);
console.log(`  ${entries.length} pack entries indexed`);

const families = [...new Set(entries.map(e => e.family))];
const selectors = [...new Set(entries.map(e => e.selector))];
console.log(`  Families: ${families.join(", ")}`);
console.log(`  Selectors: ${selectors.join(", ")}`);
