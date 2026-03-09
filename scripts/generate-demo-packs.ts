import * as fs from "fs";
import * as path from "path";
const yaml = require("js-yaml");

interface GreetingEntry {
    id?: string;
    text: string | string[];
    eventRef?: string;
    timeOfDay?: string | string[];
    audienceSize?: string;
    locale?: string | string[];
    expectedResponse?: string;
    formality?: "informal" | "highly informal" | "formal" | "hyperformal" | "neutral";
    phase?: "open" | "close";
    role?: "initiator" | "responder";
    relationship?: string[];
    setting?: string[];
    notes?: string;
    sources?: string | string[];
}

interface GreetingPack {
    locale: string;
    extends?: string;
    greetings: GreetingEntry[];
}

interface RegionDefinition {
    id: string;
    locale: string;
    polygon: [number, number][];
    priority?: number;
    name?: string;
}

interface RegionsFile {
    regions: RegionDefinition[];
}

// Internal version after expansion and ID generation
interface NormalizedGreetingEntry {
    id: string;
    text: string;
    eventRef?: string;
    timeOfDay?: string | string[];
    audienceSize?: string;
    locale?: string | string[];
    expectedResponse?: string;
    formality?: "informal" | "highly informal" | "formal" | "hyperformal" | "neutral";
    phase?: "open" | "close";
    role?: "initiator" | "responder";
    relationship?: string[];
    setting?: string[];
    notes?: string;
    sources?: string | string[];
}

interface NormalizedGreetingPack {
    locale: string;
    extends?: string;
    greetings: NormalizedGreetingEntry[];
}

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "data", "packs");
const OUTPUT_FILE = path.join(ROOT, "packages", "demo", "src", "packs.generated.ts");

/**
 * Generates a stable ID from text if missing.
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove diacritics
        .replace(/[^a-z0-9]+/g, "_")    // replace non-alphanumeric with _
        .replace(/^_+|_+$/g, "")        // trim _
        .substring(0, 32);              // cap length
}

function loadData(): { packs: NormalizedGreetingPack[], regions: RegionDefinition[] } {
    const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith(".json") || f.endsWith(".yaml")).sort();
    const rawPacksByLocale = new Map<string, { extends?: string, greetings: GreetingEntry[] }>();
    let allRegions: RegionDefinition[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(PACKS_DIR, file), "utf-8");
        const isRegions = file.includes(".regions.");
        const isEvents = file.includes(".events.");

        let parsed: any;
        try {
            if (file.endsWith(".json")) {
                parsed = JSON.parse(raw);
            } else {
                parsed = yaml.load(raw);
            }
        } catch (e) {
            console.error(`❌ Failed to parse ${file}: ${(e as Error).message}`);
            process.exit(1);
        }

        if (isRegions) {
            if (parsed && Array.isArray(parsed.regions)) {
                allRegions = allRegions.concat(parsed.regions);
                console.log(`  ✓ ${file} — ${parsed.regions.length} regions`);
            }
            continue;
        }

        if (isEvents) {
            if (parsed && Array.isArray(parsed.greetings)) {
                for (const g of parsed.greetings) {
                    if (!g.locale) {
                        console.error(`❌ Event greeting in ${file} missing "locale"`);
                        process.exit(1);
                    }
                    const locales = Array.isArray(g.locale) ? g.locale : [g.locale];
                    for (const loc of locales) {
                        let pack = rawPacksByLocale.get(loc);
                        if (!pack) {
                            pack = { greetings: [] };
                            rawPacksByLocale.set(loc, pack);
                        }
                        pack.greetings.push(g);
                    }
                }
                console.log(`  ✓ ${file} — ${parsed.greetings.length} event-centric greetings`);
            }
            continue;
        }

        const packData = parsed as GreetingPack;
        if (!packData.locale || !Array.isArray(packData.greetings)) {
            console.error(`❌ Invalid pack ${file}: must have "locale" and "greetings" array`);
            process.exit(1);
        }

        let existing = rawPacksByLocale.get(packData.locale);
        if (!existing) {
            existing = { extends: packData.extends, greetings: [] };
            rawPacksByLocale.set(packData.locale, existing);
        } else if (packData.extends && !existing.extends) {
            existing.extends = packData.extends;
        }

        existing.greetings = existing.greetings.concat(packData.greetings);
        console.log(`  ✓ ${file} — ${packData.greetings.length} greetings (${packData.locale})`);
    }

    // Pass 2: Normalize everything
    const normalizedPacks: NormalizedGreetingPack[] = [];

    for (const [locale, data] of rawPacksByLocale) {
        const normalizedGreetings: NormalizedGreetingEntry[] = [];
        const seenIds = new Set<string>();

        for (const g of data.greetings) {
            const texts = Array.isArray(g.text) ? g.text : [g.text];

            texts.forEach((text, index) => {
                let id = g.id;

                // Auto-generate ID if missing or if expanding an array
                if (!id || texts.length > 1) {
                    const baseId = id || slugify(text);
                    id = texts.length > 1 ? `${baseId}_${index + 1}` : baseId;
                }

                // Ensure ID starts with a safe prefix based on locale (pack or entry level)
                const currentLocale = g.locale || locale;
                const firstLocale = Array.isArray(currentLocale) ? currentLocale[0] : currentLocale;
                const prefix = firstLocale.replace(/-/g, "_").toLowerCase() + "_";

                if (!id.startsWith(prefix)) {
                    id = prefix + id;
                }

                if (seenIds.has(id)) {
                    id = `${id}_${Math.random().toString(36).substr(2, 5)}`;
                }
                seenIds.add(id);

                normalizedGreetings.push({
                    ...g,
                    id,
                    text
                } as NormalizedGreetingEntry);
            });
        }

        normalizedPacks.push({
            locale,
            extends: data.extends,
            greetings: normalizedGreetings
        });
    }

    return { packs: normalizedPacks, regions: allRegions };
}

function escapeString(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function greetingToTS(g: NormalizedGreetingEntry, indent: string): string {
    const lines: string[] = [];
    lines.push(`${indent}{`);
    lines.push(`${indent}  id: "${escapeString(g.id)}",`);
    lines.push(`${indent}  text: "${escapeString(g.text)}",`);
    if (g.eventRef) lines.push(`${indent}  eventRef: "${escapeString(g.eventRef)}",`);
    if (g.timeOfDay) {
        const val = Array.isArray(g.timeOfDay) ? `[${g.timeOfDay.map(t => `"${t}"`).join(", ")}]` : `"${g.timeOfDay}"`;
        lines.push(`${indent}  timeOfDay: ${val},`);
    }
    if (g.audienceSize) lines.push(`${indent}  audienceSize: "${escapeString(g.audienceSize)}",`);
    if (g.locale) {
        const val = Array.isArray(g.locale) ? `[${g.locale.map(l => `"${l}"`).join(", ")}]` : `"${g.locale}"`;
        lines.push(`${indent}  locale: ${val},`);
    }
    if (g.expectedResponse) lines.push(`${indent}  expectedResponse: "${escapeString(g.expectedResponse)}",`);
    if (g.formality) lines.push(`${indent}  formality: "${g.formality}" as const,`);
    if (g.phase) lines.push(`${indent}  phase: "${g.phase}",`);
    if (g.role) lines.push(`${indent}  role: "${g.role}",`);
    if (g.relationship) lines.push(`${indent}  relationship: [${g.relationship.map(r => `"${r}"`).join(", ")}],`);
    if (g.setting) lines.push(`${indent}  setting: [${g.setting.map(s => `"${s}"`).join(", ")}],`);
    if (g.notes) lines.push(`${indent}  notes: "${escapeString(g.notes)}",`);
    if (g.sources) {
        const val = Array.isArray(g.sources) ? `[${g.sources.map(s => `"${escapeString(s)}"`).join(", ")}]` : `"${escapeString(g.sources)}"`;
        lines.push(`${indent}  sources: ${val},`);
    }
    lines.push(`${indent}},`);
    return lines.join("\n");
}

function generate(packs: NormalizedGreetingPack[], regions: RegionDefinition[]): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" * AUTO-GENERATED — Do not edit manually.");
    lines.push(" * Generated from data/packs/*.{greetings,regions}.{json,yaml} by scripts/generate-demo-packs.ts");
    lines.push(` * Generated at: ${new Date().toISOString()}`);
    lines.push(" */");
    lines.push("");
    lines.push('import type { GreetingPack, RegionDefinition } from "@salve/types";');
    lines.push("");
    lines.push("export const DEMO_PACKS: GreetingPack[] = [");

    for (const pack of packs) {
        lines.push("  {");
        lines.push(`    locale: "${escapeString(pack.locale)}",`);
        if (pack.extends) lines.push(`    extends: "${escapeString(pack.extends)}",`);
        lines.push("    greetings: [");
        for (const g of pack.greetings) {
            lines.push(greetingToTS(g, "      "));
        }
        lines.push("    ],");
        lines.push("  },");
    }

    lines.push("];");
    lines.push("");
    lines.push("export const DEMO_REGIONS: RegionDefinition[] = " + JSON.stringify(regions, null, 2) + ";");
    lines.push("");
    return lines.join("\n");
}

// ─── Main ────────────────────────────────────────────────────────────
console.log("📦 Generating demo packs and regions from data/packs/...\n");

const { packs, regions } = loadData();

if (packs.length === 0) {
    console.error("❌ No pack files found in data/packs/");
    process.exit(1);
}

const output = generate(packs, regions);
fs.writeFileSync(OUTPUT_FILE, output, "utf-8");

console.log(`\n✅ Generated ${OUTPUT_FILE}`);
console.log(`   ${packs.length} locale packs, ${packs.reduce((n, p) => n + p.greetings.length, 0)} total greetings`);
console.log(`   ${regions.length} total geographic regions`);
