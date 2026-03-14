import * as fs from "fs";
import * as path from "path";
import { discoverAllYAML } from "./lib/discover-packs";
const yaml = require("js-yaml");
const Ajv = require("ajv/dist/2020");
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

interface GreetingEntry {
    id?: string;
    text: string | string[];
    eventRef?: string;
    timeOfDay?: string | string[];
    audience?: string;
    audienceSize?: string;
    locale?: string | string[];
    expectedResponse?: string;
    formality?: "informal" | "highly informal" | "formal" | "hyperformal" | "neutral";
    phase?: string | string[];
    role?: "initiator" | "responder";
    relationship?: string[];
    setting?: string[];
    professions?: string[];
    notes?: string;
    sources?: string | string[];
    [key: string]: any;
}

interface GreetingPack {
    locale: string;
    extends?: string;
    sources?: string | string[];
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
    emoji?: string;
    timeOfDay?: string | string[];
    audienceSize?: string;
    locale?: string | string[];
    expectedResponse?: string;
    formality?: "informal" | "highly informal" | "formal" | "hyperformal" | "neutral";
    phase?: string | string[];
    role?: "initiator" | "responder";
    relationship?: string[];
    setting?: string[];
    professions?: string[];
    notes?: string;
    sources?: string | string[];
    transliterations?: Record<string, string>;
}

interface NormalizedGreetingPack {
    locale: string;
    extends?: string;
    sources?: string | string[];
    greetings: NormalizedGreetingEntry[];
}

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "data", "packs");
const OUTPUT_FILE = path.join(ROOT, "packages", "demo", "src", "packs.generated.ts");
const SCHEMAS_DIR = path.join(ROOT, "data", "schemas");

const schemas = {
    lexicon: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "lexicon.schema.json"), "utf8")),
    events: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "event-registry.schema.json"), "utf8")),
    regions: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "region-registry.schema.json"), "utf8")),
    locales: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "locale-registry.schema.json"), "utf8")),
};

const validators = {
    lexicon: ajv.compile(schemas.lexicon),
    events: ajv.compile(schemas.events),
    regions: ajv.compile(schemas.regions),
    locales: ajv.compile(schemas.locales),
};

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
    const filePaths = discoverAllYAML(PACKS_DIR);
    const rawPacksByLocale = new Map<string, { extends?: string, sources?: string | string[], greetings: GreetingEntry[] }>();
    let allRegions: RegionDefinition[] = [];

    for (const filePath of filePaths) {
        const file = path.basename(filePath);
        if (file.includes(".address.") || file.includes(".protocol.") || file.includes(".nameday-")) continue;

        const raw = fs.readFileSync(filePath, "utf-8");
        const isRegions = file.includes(".regions.") || file.includes(".locales.");
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

        // ── Schema Validation ───────────────────────────────────────
        let validator;
        if (file.includes(".greetings.")) validator = validators.lexicon;
        else if (file.includes(".events.")) validator = validators.events;
        else if (file.includes(".regions.")) validator = validators.regions;
        else if (file.includes(".locales.")) validator = validators.locales;

        if (validator && !validator(parsed)) {
            console.error(`❌ Validation failed for ${file}:`);
            console.error(ajv.errorsText(validator.errors));
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
            // ── Path A: events with per-event nested greetings ──────────
            // e.g. international.secular.events.yaml:
            //   events:
            //     - label: International Women's Day
            //       greetings:
            //         - text: 'Χρόνια Πολλά!'
            //           locale: el-GR
            if (parsed && Array.isArray(parsed.events)) {
                let count = 0;
                for (const event of parsed.events) {
                    if (!Array.isArray(event.greetings)) continue; // skip events without greetings
                    for (const g of event.greetings) {
                        g.locale = g.locale || parsed.locale;
                        if (!g.locale) {
                            console.error(`❌ Event greeting for "${event.label}" in ${file} missing "locale"`);
                            process.exit(1);
                        }
                        // Carry over emoji from event if not explicitly set on greeting
                        if (event.emoji && !g.emoji) {
                            g.emoji = event.emoji;
                        }
                        // Carry over or generate eventRef
                        if (!g.eventRef) {
                            if (event.id) {
                                g.eventRef = event.id;
                            } else if (event.label) {
                                const labelStr = typeof event.label === "string" ? event.label : (event.label.en || Object.values(event.label)[0] as string);
                                g.eventRef = `salve.event.civil.un.${slugify(labelStr)}`;
                            }
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
                        count++;
                    }
                }
                if (count > 0) {
                    console.log(`  ✓ ${file} — ${count} event-nested greetings`);
                }
            }

            // ── Path B: top-level greetings array ───────────────────────
            // e.g. christian.events.yaml:
            //   greetings:
            //     - text: 'Χριστός Ανέστη!'
            //       locale: el-GR
            if (parsed && Array.isArray(parsed.greetings)) {
                for (const g of parsed.greetings) {
                    g.locale = g.locale || parsed.locale;
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
            existing = { extends: packData.extends, sources: packData.sources, greetings: [] };
            rawPacksByLocale.set(packData.locale, existing);
        } else {
            if (packData.extends && !existing.extends) existing.extends = packData.extends;
            if (packData.sources && !existing.sources) existing.sources = packData.sources;
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

                // Auto-generate ID if missing
                if (!id) {
                    const textSlug = slugify(text);
                    if (textSlug && textSlug.length > 1) {
                        id = textSlug;
                    } else if (g.eventRef) {
                        // Use event name (e.g., "salve.event.temporal.morning" -> "morning")
                        id = slugify(g.eventRef.split(".").pop() || "");
                    } else if (g.notes) {
                        // Try to extract from notes (e.g., "Greek: Hello" -> "hello")
                        const noteStr = Array.isArray(g.notes) ? g.notes.join(" ") : g.notes;
                        const noteSlug = slugify(noteStr.replace(/^[^:]+:\s*/, ""));
                        id = noteSlug || "item";
                    } else {
                        id = "item";
                    }
                }

                // Handle array expansion
                if (texts.length > 1) {
                    id = `${id}_${index + 1}`;
                }

                // Ensure ID starts with a safe prefix based on locale
                const currentLocale = (g.locale && !Array.isArray(g.locale)) ? g.locale : locale;
                const prefix = currentLocale.replace(/-/g, "_").toLowerCase() + "_";

                if (!id.startsWith(prefix)) {
                    id = prefix + id;
                }

                // Final collision check
                let finalId = id;
                let counter = 1;
                while (seenIds.has(finalId)) {
                    finalId = `${id}_${counter++}`;
                }
                id = finalId;
                seenIds.add(id);

                // Collect transliterations
                const transliterations: Record<string, string> = {};
                const knownKeys = ["id", "text", "eventRef", "emoji", "timeOfDay", "audience", "audienceSize", "locale", "expectedResponse", "formality", "phase", "role", "relationship", "setting", "professions", "notes", "sources", "WikiData", "date", "metadata"];

                Object.keys(g).forEach(key => {
                    if (!knownKeys.includes(key) && /^[a-z]{2,3}(-[A-Z]{2})?(-[A-Za-z0-9]+)*$/.test(key)) {
                        transliterations[key] = Array.isArray(g[key]) ? g[key].join(" ") : g[key];
                    }
                });

                normalizedGreetings.push({
                    ...g,
                    id,
                    text,
                    locale: g.locale || locale,
                    sources: g.sources || data.sources,
                    audienceSize: g.audience || g.audienceSize,
                    transliterations: Object.keys(transliterations).length > 0 ? transliterations : undefined,
                } as NormalizedGreetingEntry);
            });
        }

        normalizedPacks.push({
            locale,
            extends: data.extends,
            sources: data.sources,
            greetings: normalizedGreetings
        });
    }

    return { packs: normalizedPacks, regions: allRegions };
}

function escapeString(s: any): string {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function greetingToTS(g: NormalizedGreetingEntry, indent: string): string {
    const lines: string[] = [];
    lines.push(`${indent}{`);
    lines.push(`${indent}  id: "${escapeString(g.id)}",`);
    lines.push(`${indent}  text: "${escapeString(g.text)}",`);
    if (g.eventRef) lines.push(`${indent}  eventRef: "${escapeString(g.eventRef)}",`);
    if (g.emoji) lines.push(`${indent}  emoji: "${escapeString(g.emoji)}",`);
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
    if (g.phase) {
        const val = Array.isArray(g.phase) ? `[${g.phase.map(p => `"${p}"`).join(", ")}]` : `"${g.phase}"`;
        lines.push(`${indent}  phase: ${val},`);
    }
    if (g.role) lines.push(`${indent}  role: "${g.role}",`);
    if (g.relationship) {
        const val = Array.isArray(g.relationship) ? g.relationship : [g.relationship];
        lines.push(`${indent}  relationship: [${val.map(r => `"${r}"`).join(", ")}],`);
    }
    if (g.setting) {
        const val = Array.isArray(g.setting) ? g.setting : [g.setting];
        lines.push(`${indent}  setting: [${val.map(s => `"${s}"`).join(", ")}],`);
    }
    if (g.professions) {
        const val = Array.isArray(g.professions) ? g.professions : [g.professions];
        lines.push(`${indent}  professions: [${val.map(p => `"${p}"`).join(", ")}],`);
    }
    if (g.notes) {
        const val = Array.isArray(g.notes) ? `[${g.notes.map(n => `"${escapeString(n)}"`).join(", ")}]` : `"${escapeString(g.notes)}"`;
        lines.push(`${indent}  notes: ${val},`);
    }
    if (g.sources) {
        const val = Array.isArray(g.sources) ? `[${g.sources.map(s => `"${escapeString(s)}"`).join(", ")}]` : `"${escapeString(g.sources)}"`;
        lines.push(`${indent}  sources: ${val},`);
    }
    const metaKeys = ["WikiData", "date", "metadata"].filter(k => (g as any)[k] !== undefined);
    if (metaKeys.length > 0) {
        lines.push(`${indent}  // @ts-ignore - bypass cached strict type checks`);
        lines.push(`${indent}  metadata: {`);
        metaKeys.forEach(mk => {
            const v = (g as any)[mk];
            lines.push(`${indent}    "${mk}": ${JSON.stringify(v)},`);
        });
        lines.push(`${indent}  },`);
    }
    if (g.transliterations) {
        lines.push(`${indent}  transliterations: {`);
        Object.entries(g.transliterations).forEach(([lang, text]) => {
            lines.push(`${indent}    "${lang}": "${escapeString(text)}",`);
        });
        lines.push(`${indent}  },`);
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
    lines.push('import type { GreetingPack } from "@salve/types";');
    lines.push("");
    lines.push("export const DEMO_PACKS: GreetingPack[] = [");

    for (const pack of packs) {
        lines.push("  {");
        lines.push(`    locale: "${escapeString(pack.locale)}",`);
        if (pack.extends) lines.push(`    extends: "${escapeString(pack.extends)}",`);
        if (pack.sources) {
            const val = Array.isArray(pack.sources) ? `[${pack.sources.map(s => `"${escapeString(s)}"`).join(", ")}]` : `"${escapeString(pack.sources)}"`;
            lines.push(`    sources: ${val},`);
        }
        lines.push("    greetings: [");
        for (const g of pack.greetings) {
            lines.push(greetingToTS(g, "      "));
        }
        lines.push("    ],");
        lines.push("  },");
    }

    lines.push("];");
    lines.push("");
    lines.push("export const DEMO_REGIONS = [");
    regions.forEach(r => {
        lines.push(JSON.stringify(r, null, 2).split('\n').map((line, i) => i === 0 ? `  ${line}` : `  ${line}`).join('\n') + ",");
    });
    lines.push("];");
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
