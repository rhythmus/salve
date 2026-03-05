/**
 * generate-demo-packs.ts
 *
 * Reads canonical JSON greeting packs from data/packs/ and generates
 * packages/demo/src/packs.generated.ts — the TypeScript source consumed
 * by the demo application.
 *
 * Usage:  npx ts-node scripts/generate-demo-packs.ts
 */

import * as fs from "fs";
import * as path from "path";

interface GreetingEntry {
    id: string;
    text: string;
    eventRef?: string;
    expectedResponse?: string;
    formality?: "informal" | "formal" | "neutral";
    phase?: "open" | "close";
    role?: "initiator" | "responder";
    relationship?: string[];
    setting?: string[];
}

interface GreetingPack {
    locale: string;
    extends?: string;
    greetings: GreetingEntry[];
}

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "data", "packs");
const OUTPUT_FILE = path.join(ROOT, "packages", "demo", "src", "packs.generated.ts");

function loadPacks(): GreetingPack[] {
    const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith(".json")).sort();
    const packs: GreetingPack[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(PACKS_DIR, file), "utf-8");
        let parsed: any;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.error(`❌ Failed to parse ${file}: ${(e as Error).message}`);
            process.exit(1);
        }

        // Basic validation
        if (!parsed.locale || !Array.isArray(parsed.greetings) || parsed.greetings.length === 0) {
            console.error(`❌ Invalid pack ${file}: must have "locale" and non-empty "greetings" array`);
            process.exit(1);
        }

        for (const g of parsed.greetings) {
            if (!g.id || !g.text) {
                console.error(`❌ Invalid greeting in ${file}: must have "id" and "text"`);
                process.exit(1);
            }
        }

        // Strip $schema before emitting
        const { $schema, ...pack } = parsed;
        packs.push(pack as GreetingPack);
        console.log(`  ✓ ${file} — ${parsed.greetings.length} greetings (${parsed.locale})`);
    }

    return packs;
}

function escapeString(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function greetingToTS(g: GreetingEntry, indent: string): string {
    const lines: string[] = [];
    lines.push(`${indent}{`);
    lines.push(`${indent}  id: "${escapeString(g.id)}",`);
    lines.push(`${indent}  text: "${escapeString(g.text)}",`);
    if (g.eventRef) lines.push(`${indent}  eventRef: "${escapeString(g.eventRef)}",`);
    if (g.expectedResponse) lines.push(`${indent}  expectedResponse: "${escapeString(g.expectedResponse)}",`);
    if (g.formality) lines.push(`${indent}  formality: "${g.formality}" as const,`);
    if (g.phase) lines.push(`${indent}  phase: "${g.phase}",`);
    if (g.role) lines.push(`${indent}  role: "${g.role}",`);
    if (g.relationship) lines.push(`${indent}  relationship: [${g.relationship.map(r => `"${r}"`).join(", ")}],`);
    if (g.setting) lines.push(`${indent}  setting: [${g.setting.map(s => `"${s}"`).join(", ")}],`);
    lines.push(`${indent}},`);
    return lines.join("\n");
}

function generate(packs: GreetingPack[]): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" * AUTO-GENERATED — Do not edit manually.");
    lines.push(" * Generated from data/packs/*.json by scripts/generate-demo-packs.ts");
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
        lines.push("    greetings: [");
        for (const g of pack.greetings) {
            lines.push(greetingToTS(g, "      "));
        }
        lines.push("    ],");
        lines.push("  },");
    }

    lines.push("];");
    lines.push("");
    return lines.join("\n");
}

// ─── Main ────────────────────────────────────────────────────────────
console.log("📦 Generating demo packs from data/packs/...\n");

const packs = loadPacks();

if (packs.length === 0) {
    console.error("❌ No pack files found in data/packs/");
    process.exit(1);
}

const output = generate(packs);
fs.writeFileSync(OUTPUT_FILE, output, "utf-8");

console.log(`\n✅ Generated ${OUTPUT_FILE}`);
console.log(`   ${packs.length} locale packs, ${packs.reduce((n, p) => n + p.greetings.length, 0)} total greetings`);
