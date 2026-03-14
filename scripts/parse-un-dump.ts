/**
 * parse-un-dump.ts
 * ────────────────
 * Parses the official UN observances text dump (UN-observances.txt)
 * and generates data/packs/events/shared/international.secular.events.yaml.
 *
 * Merges existing WikiData IDs from the current YAML file when labels match.
 *
 * Usage:
 *   npx ts-node scripts/parse-un-dump.ts
 */

import * as fs from "fs";
import * as path from "path";
const yaml = require("js-yaml");

const DUMP_PATH = path.resolve(__dirname, "../data/UN-observances.txt");
const YAML_PATH = path.resolve(__dirname, "../data/packs/events/shared/international.secular.events.yaml");

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const MONTH_ABBR: Record<string, string> = {
    Jan: "January", Feb: "February", Mar: "March", Apr: "April",
    May: "May", Jun: "June", Jul: "July", Aug: "August",
    Sep: "September", Oct: "October", Nov: "November", Dec: "December"
};

interface UNEvent {
    label: string;
    date: string;
    "UN-resolution"?: string;
    "UN-agency"?: string;
    duration?: string;
    WikiData?: string;
}

// ─── Parse the dump ──────────────────────────────────────────────────
function parseDump(text: string): UNEvent[] {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const events: UNEvent[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip month headers
        if (MONTHS.includes(line)) {
            i++;
            continue;
        }

        // This line should be an event name; the next line should be a date
        const nameLine = line;
        const dateLine = lines[i + 1];

        if (!dateLine) {
            i++;
            continue;
        }

        // Validate the date line: should match "DD Mon" pattern like "04 Jan", "01 Feb"
        const dateMatch = dateLine.match(/^(\d{2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/);
        if (!dateMatch) {
            // Not a date — might be a continuation or irregularity, skip
            i++;
            continue;
        }

        const day = parseInt(dateMatch[1], 10);
        const monthFull = MONTH_ABBR[dateMatch[2]];
        const salveDate = `${day} ${monthFull}`;

        // Extract the label (event name without resolution/agency brackets)
        let label = nameLine;
        let resolution: string | undefined;
        let agency: string | undefined;

        // Extract UN agency in square brackets: [WHO], [FAO], [UNESCO], etc.
        const agencyMatch = label.match(/\s*\[([A-Z]+)\]\s*/);
        if (agencyMatch) {
            agency = agencyMatch[1];
            label = label.replace(agencyMatch[0], " ").trim();
        }

        // Extract resolution in parentheses at the end.
        // Handles nested parens like (A/RES/2142 (XXI)) or (A/RES/S-10/2 (p. 102))
        // Strategy: find the last balanced (...) at the end of the string
        if (label.endsWith(")")) {
            let depth = 0;
            let start = -1;
            for (let j = label.length - 1; j >= 0; j--) {
                if (label[j] === ")") depth++;
                if (label[j] === "(") depth--;
                if (depth === 0) {
                    start = j;
                    break;
                }
            }
            if (start > 0) {
                resolution = label.substring(start + 1, label.length - 1).trim();
                label = label.substring(0, start).trim();
            }
        }

        // Detect week-type events
        let duration: string | undefined;
        if (/\bweek\b/i.test(label)) {
            duration = "week";
        }

        events.push({
            label,
            date: salveDate,
            ...(resolution ? { "UN-resolution": resolution } : {}),
            ...(agency ? { "UN-agency": agency } : {}),
            ...(duration ? { duration } : {}),
        });

        i += 2; // Skip name + date
    }

    return events;
}

// ─── Merge WikiData IDs from existing YAML ───────────────────────────
function mergeWikidata(events: UNEvent[], existingYamlPath: string): void {
    if (!fs.existsSync(existingYamlPath)) return;

    const existing: any = yaml.load(fs.readFileSync(existingYamlPath, "utf-8"));
    if (!existing || !Array.isArray(existing.events)) return;

    // Build a lookup by normalized label
    const wikiLookup = new Map<string, string>();
    for (const ev of existing.events) {
        if (ev.WikiData && ev.label) {
            wikiLookup.set(ev.label.toLowerCase().trim(), ev.WikiData);
        }
    }

    let merged = 0;
    for (const ev of events) {
        const key = ev.label.toLowerCase().trim();
        const qid = wikiLookup.get(key);
        if (qid) {
            ev.WikiData = qid;
            merged++;
        }
    }
    console.log(`  🔗 Merged ${merged} existing WikiData IDs`);
}

// ─── Main ────────────────────────────────────────────────────────────
const dumpText = fs.readFileSync(DUMP_PATH, "utf-8");
const events = parseDump(dumpText);

console.log(`📋 Parsed ${events.length} events from UN dump`);

// Merge existing Wikidata IDs
mergeWikidata(events, YAML_PATH);

// Build output
const output = {
    tradition: ["international", "secular"],
    events: events.map(ev => {
        const entry: any = { label: ev.label, date: ev.date };
        if (ev["UN-resolution"]) entry["UN-resolution"] = ev["UN-resolution"];
        if (ev["UN-agency"]) entry["UN-agency"] = ev["UN-agency"];
        if (ev.duration) entry.duration = ev.duration;
        if (ev.WikiData) entry.WikiData = ev.WikiData;
        return entry;
    }),
};

let yamlStr = yaml.dump(output, {
    lineWidth: -1,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
});

// ─── Post-process: insert month-heading comments ─────────────────────
// Insert a YAML comment before the first event of each month.
const yamlLines = yamlStr.split("\n");
const result: string[] = [];
let currentMonth = "";

for (const line of yamlLines) {
    // Detect "date: <day> <Month>" lines
    const dateMatch = line.match(/^\s+date:\s+\d+\s+(\w+)\s*$/);
    if (dateMatch) {
        const month = dateMatch[1];
        if (MONTHS.includes(month) && month !== currentMonth) {
            currentMonth = month;
            // Insert the comment before the preceding "- label:" line.
            // Walk back to find the "  - label:" line we just pushed.
            let insertIdx = result.length - 1;
            while (insertIdx >= 0 && !result[insertIdx].match(/^\s+-\s+label:/)) {
                insertIdx--;
            }
            if (insertIdx >= 0) {
                const pad = "─".repeat(Math.max(0, 60 - month.length));
                const comment = `    # ─── ${month} ${pad}`;
                result.splice(insertIdx, 0, "", comment);
            }
        }
    }
    result.push(line);
}

yamlStr = result.join("\n");

fs.writeFileSync(YAML_PATH, yamlStr, "utf-8");
console.log(`\n📦 Written ${events.length} events to ${YAML_PATH}`);
