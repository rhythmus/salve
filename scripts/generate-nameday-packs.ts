/**
 * Generate typed saint definition and calendar registries from YAML data
 * files in data/packs/.
 *
 * Input:
 *   data/packs/*.nameday-saints.yaml    → validated against nameday-saints.schema.json
 *   data/packs/*.nameday-calendar.yaml  → validated against nameday-calendar.schema.json
 *
 * Output (per locale):
 *   packages/pack-{locale}-namedays/src/saints.generated.ts
 *   packages/pack-{locale}-namedays/src/calendar.generated.ts
 */

import * as fs from "fs";
import * as path from "path";
const yaml = require("js-yaml");
const Ajv = require("ajv/dist/2020");
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "data", "packs");
const SCHEMAS_DIR = path.join(ROOT, "data", "schemas");

const schemas = {
    saints: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "nameday-saints.schema.json"), "utf8")),
    calendar: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "nameday-calendar.schema.json"), "utf8")),
};

const validators = {
    saints: ajv.compile(schemas.saints),
    calendar: ajv.compile(schemas.calendar),
};

const LOCALE_TO_PACK: Record<string, string> = {
    "el-GR": "el",
    "bg-BG": "bg",
};

function escapeString(s: any): string {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ── Data types matching the YAML schemas ─────────────────────────

interface SaintData {
    qid: string;
    canonicalName: string;
    traditions: string[];
    aliases: string[];
}

interface SaintsFileData {
    locale: string;
    sources?: string | string[];
    saints: SaintData[];
}

interface CalendarEntryData {
    month?: number;
    day?: number;
    relativeTo?: string;
    offset?: number;
    saintQids?: string[];
    label?: string;
    names?: string[];
}

interface CalendarFileData {
    locale: string;
    sources?: string | string[];
    entries: CalendarEntryData[];
}

// ── YAML loader with validation ──────────────────────────────────

function loadYAMLFiles<T>(suffix: string, validator: any): { file: string; data: T }[] {
    const files = fs.readdirSync(PACKS_DIR)
        .filter(f => f.endsWith(suffix))
        .sort();

    const results: { file: string; data: T }[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(PACKS_DIR, file), "utf-8");
        let parsed: any;
        try {
            parsed = yaml.load(raw);
        } catch (e) {
            console.error(`  ❌ Failed to parse ${file}: ${(e as Error).message}`);
            process.exit(1);
        }

        if (!validator(parsed)) {
            console.error(`  ❌ Validation failed for ${file}:`);
            console.error(ajv.errorsText(validator.errors));
            process.exit(1);
        }

        results.push({ file, data: parsed as T });
        console.log(`  ✅ ${file}`);
    }

    return results;
}

// ── Cross-validation ─────────────────────────────────────────────

function crossValidate(saints: SaintsFileData, calendar: CalendarFileData): void {
    const knownQids = new Set(saints.saints.map(s => s.qid));

    for (const entry of calendar.entries) {
        if (entry.saintQids) {
            for (const qid of entry.saintQids) {
                if (!knownQids.has(qid)) {
                    console.warn(`  ⚠  Calendar references QID ${qid} not found in saints file for locale ${calendar.locale}`);
                }
            }
        }
    }
}

// ── Code generation ──────────────────────────────────────────────

function generateSaintsFile(data: SaintsFileData): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" * AUTO-GENERATED — Do not edit manually.");
    lines.push(" * Generated from data/packs/*.nameday-saints.yaml by scripts/generate-nameday-packs.ts");
    lines.push(` * Generated at: ${new Date().toISOString()}`);
    lines.push(" */");
    lines.push("");
    lines.push('import type { SaintDefinition } from "@salve/types";');
    lines.push("");

    lines.push("export const saints: SaintDefinition[] = [");
    for (const saint of data.saints) {
        lines.push("    {");
        lines.push(`        qid: "${escapeString(saint.qid)}",`);
        lines.push(`        canonicalName: "${escapeString(saint.canonicalName)}",`);
        lines.push(`        traditions: [${saint.traditions.map(t => `"${escapeString(t)}"`).join(", ")}],`);
        lines.push(`        aliases: [`);
        for (let i = 0; i < saint.aliases.length; i += 5) {
            const chunk = saint.aliases.slice(i, i + 5);
            lines.push(`            ${chunk.map(a => `"${escapeString(a)}"`).join(", ")},`);
        }
        lines.push(`        ],`);
        lines.push("    },");
    }
    lines.push("];");
    lines.push("");

    return lines.join("\n");
}

function generateCalendarFile(data: CalendarFileData): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" * AUTO-GENERATED — Do not edit manually.");
    lines.push(" * Generated from data/packs/*.nameday-calendar.yaml by scripts/generate-nameday-packs.ts");
    lines.push(` * Generated at: ${new Date().toISOString()}`);
    lines.push(" */");
    lines.push("");
    lines.push('import type { NameDayEntry, MovableNameDayEntry } from "@salve/types";');
    lines.push("");

    const fixed = data.entries.filter(e => e.month !== undefined && e.day !== undefined);
    const movable = data.entries.filter(e => e.relativeTo !== undefined);

    lines.push("export const fixedEntries: NameDayEntry[] = [");
    for (const entry of fixed) {
        const qids = entry.saintQids
            ? `[${entry.saintQids.map(q => `"${q}"`).join(", ")}]`
            : "[]";
        lines.push(`    { month: ${entry.month}, day: ${entry.day}, saintQids: ${qids} },`);
    }
    lines.push("];");
    lines.push("");

    lines.push("export const movableEntries: MovableNameDayEntry[] = [");
    for (const entry of movable) {
        lines.push("    {");
        lines.push(`        relativeTo: "${entry.relativeTo}" as const,`);
        lines.push(`        offset: ${entry.offset},`);
        if (entry.label) {
            lines.push(`        label: "${escapeString(entry.label)}",`);
        }
        if (entry.saintQids && entry.saintQids.length > 0) {
            lines.push(`        saintQids: [${entry.saintQids.map(q => `"${q}"`).join(", ")}],`);
        }
        if (entry.names && entry.names.length > 0) {
            lines.push(`        names: [`);
            for (let i = 0; i < entry.names.length; i += 5) {
                const chunk = entry.names.slice(i, i + 5);
                lines.push(`            ${chunk.map(n => `"${escapeString(n)}"`).join(", ")},`);
            }
            lines.push(`        ],`);
        }
        lines.push("    },");
    }
    lines.push("];");
    lines.push("");

    return lines.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────

console.log("\nGenerating nameday packs from data/packs/...\n");

console.log("Saints files:");
const saintsFiles = loadYAMLFiles<SaintsFileData>(".nameday-saints.yaml", validators.saints);

console.log("\nCalendar files:");
const calendarFiles = loadYAMLFiles<CalendarFileData>(".nameday-calendar.yaml", validators.calendar);

if (saintsFiles.length === 0) {
    console.error("\nNo nameday-saints files found in data/packs/");
    process.exit(1);
}

const saintsByLocale = new Map<string, SaintsFileData>();
for (const { data } of saintsFiles) {
    saintsByLocale.set(data.locale, data);
}

const calendarByLocale = new Map<string, CalendarFileData>();
for (const { data } of calendarFiles) {
    calendarByLocale.set(data.locale, data);
}

let generated = 0;

for (const [locale, saintsData] of saintsByLocale) {
    const packCode = LOCALE_TO_PACK[locale];
    if (!packCode) {
        console.warn(`  ⚠  No pack mapping for locale ${locale}, skipping`);
        continue;
    }

    const outputDir = path.join(ROOT, "packages", `pack-${packCode}-namedays`, "src");
    if (!fs.existsSync(outputDir)) {
        console.warn(`  ⚠  Output directory ${outputDir} does not exist, skipping`);
        continue;
    }

    const calendarData = calendarByLocale.get(locale);
    if (calendarData) {
        crossValidate(saintsData, calendarData);
    }

    const saintsOutput = path.join(outputDir, "saints.generated.ts");
    fs.writeFileSync(saintsOutput, generateSaintsFile(saintsData), "utf-8");
    console.log(`\n  → ${saintsOutput}`);
    console.log(`    ${saintsData.saints.length} saint definitions`);

    if (calendarData) {
        const calendarOutput = path.join(outputDir, "calendar.generated.ts");
        fs.writeFileSync(calendarOutput, generateCalendarFile(calendarData), "utf-8");
        const fixed = calendarData.entries.filter(e => e.month !== undefined).length;
        const movable = calendarData.entries.filter(e => e.relativeTo !== undefined).length;
        console.log(`  → ${calendarOutput}`);
        console.log(`    ${fixed} fixed entries, ${movable} movable entries`);
    }

    generated++;
}

console.log(`\nDone: generated outputs for ${generated} locale(s).`);
