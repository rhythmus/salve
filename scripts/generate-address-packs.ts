/**
 * Generate typed address pack, protocol pack, and legacy honorific registries
 * from YAML data files in data/packs/.
 *
 * Input:
 *   data/packs/*.address.yaml   → validated against address-pack.schema.json
 *   data/packs/*.protocol.yaml  → validated against protocol-pack.schema.json
 *
 * Output:
 *   packages/pack-global-addresses/src/address-packs.generated.ts
 *   packages/pack-global-addresses/src/protocol-packs.generated.ts
 *   packages/pack-global-addresses/src/honorifics.generated.ts
 */

import * as fs from "fs";
import * as path from "path";
import { discoverPacks } from "./lib/discover-packs";
const yaml = require("js-yaml");
const Ajv = require("ajv/dist/2020");
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "data", "packs");
const SCHEMAS_DIR = path.join(ROOT, "data", "schemas");
const OUTPUT_DIR = path.join(ROOT, "packages", "pack-global-addresses", "src");

const schemas = {
    address: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "address-pack.schema.json"), "utf8")),
    protocol: JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, "protocol-pack.schema.json"), "utf8")),
};

const validators = {
    address: ajv.compile(schemas.address),
    protocol: ajv.compile(schemas.protocol),
};

function escapeString(s: any): string {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function localeToVarName(locale: string): string {
    const map: Record<string, string> = {
        en: "english",
        de: "german",
        fr: "french",
        nl: "dutch",
        el: "greek",
        es: "spanish",
        it: "italian",
        pt: "portuguese",
        ar: "arabic",
        tr: "turkish",
        ru: "russian",
        zh: "chinese",
        ja: "japanese",
        ko: "korean",
        pl: "polish",
        sv: "swedish",
        da: "danish",
        fi: "finnish",
        hu: "hungarian",
        cs: "czech",
        ro: "romanian",
        bg: "bulgarian",
        hr: "croatian",
        sk: "slovak",
        sl: "slovenian",
        et: "estonian",
        lv: "latvian",
        lt: "lithuanian",
        ga: "irish",
        mt: "maltese",
    };
    const base = locale.split("-")[0];
    return map[base] ?? base;
}

function protocolIdToVarName(id: string): string {
    const parts = id.split("-");
    return parts
        .map((p, i) => i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
}

// ── Address pack generation ─────────────────────────────────────

interface AddressPackData {
    locale: string;
    extends?: string;
    sources?: string | string[];
    honorifics: {
        male: string;
        female: string;
        nonBinary?: string;
        unspecified?: string;
    };
    formats: {
        postal: string;
        letterhead: string;
        salutation: string;
        email_opening?: string;
        email_closing?: string;
        informal: string;
    };
    titles?: Array<{
        system: string;
        code: string;
        rank: number;
        postalForm: string;
        correspondenceForm: string;
        postalAbbrev?: string;
        gender?: string;
    }>;
    collectiveFormulas?: Array<{
        id: string;
        formality: string;
        text: string;
        audienceKind?: string;
        gender?: string;
        notes?: string;
    }>;
    titleSuppression?: {
        informalDropsTitles?: boolean;
        professorSuppressesDoctor?: boolean;
    };
}

function renderAddressPack(pack: AddressPackData, indent: string): string {
    const lines: string[] = [];
    lines.push(`${indent}{`);
    lines.push(`${indent}    locale: "${escapeString(pack.locale)}",`);
    if (pack.extends) {
        lines.push(`${indent}    extends: "${escapeString(pack.extends)}",`);
    }
    if (pack.sources) {
        const val = Array.isArray(pack.sources)
            ? `[${pack.sources.map(s => `"${escapeString(s)}"`).join(", ")}]`
            : `"${escapeString(pack.sources)}"`;
        lines.push(`${indent}    sources: ${val},`);
    }

    lines.push(`${indent}    honorifics: {`);
    lines.push(`${indent}        male: "${escapeString(pack.honorifics.male)}",`);
    lines.push(`${indent}        female: "${escapeString(pack.honorifics.female)}",`);
    if (pack.honorifics.nonBinary !== undefined) {
        lines.push(`${indent}        nonBinary: "${escapeString(pack.honorifics.nonBinary)}",`);
    }
    if (pack.honorifics.unspecified !== undefined) {
        lines.push(`${indent}        unspecified: "${escapeString(pack.honorifics.unspecified)}",`);
    }
    lines.push(`${indent}    },`);

    lines.push(`${indent}    formats: {`);
    lines.push(`${indent}        postal: "${escapeString(pack.formats.postal)}",`);
    lines.push(`${indent}        letterhead: "${escapeString(pack.formats.letterhead)}",`);
    lines.push(`${indent}        salutation: "${escapeString(pack.formats.salutation)}",`);
    if (pack.formats.email_opening !== undefined) {
        lines.push(`${indent}        email_opening: "${escapeString(pack.formats.email_opening)}",`);
    }
    if (pack.formats.email_closing !== undefined) {
        lines.push(`${indent}        email_closing: "${escapeString(pack.formats.email_closing)}",`);
    }
    lines.push(`${indent}        informal: "${escapeString(pack.formats.informal)}",`);
    lines.push(`${indent}    },`);

    if (pack.titles && pack.titles.length > 0) {
        lines.push(`${indent}    titles: [`);
        for (const t of pack.titles) {
            const genderPart = t.gender ? `, gender: "${t.gender}" as const` : "";
            const abbrevPart = t.postalAbbrev ? `, postalAbbrev: "${escapeString(t.postalAbbrev)}"` : "";
            lines.push(`${indent}        { system: "${t.system}" as const, code: "${t.code}", rank: ${t.rank}, postalForm: "${escapeString(t.postalForm)}", correspondenceForm: "${escapeString(t.correspondenceForm)}"${abbrevPart}${genderPart} },`);
        }
        lines.push(`${indent}    ],`);
    }

    if (pack.collectiveFormulas && pack.collectiveFormulas.length > 0) {
        lines.push(`${indent}    collectiveFormulas: [`);
        for (const f of pack.collectiveFormulas) {
            const parts = [`id: "${f.id}"`, `formality: "${f.formality}" as const`, `text: "${escapeString(f.text)}"`];
            if (f.audienceKind) parts.push(`audienceKind: "${f.audienceKind}" as const`);
            if (f.gender) parts.push(`gender: "${f.gender}" as const`);
            if (f.notes) parts.push(`notes: "${escapeString(f.notes)}"`);
            lines.push(`${indent}        { ${parts.join(", ")} },`);
        }
        lines.push(`${indent}    ],`);
    }

    if (pack.titleSuppression) {
        lines.push(`${indent}    titleSuppression: {`);
        if (pack.titleSuppression.informalDropsTitles !== undefined) {
            lines.push(`${indent}        informalDropsTitles: ${pack.titleSuppression.informalDropsTitles},`);
        }
        if (pack.titleSuppression.professorSuppressesDoctor !== undefined) {
            lines.push(`${indent}        professorSuppressesDoctor: ${pack.titleSuppression.professorSuppressesDoctor},`);
        }
        lines.push(`${indent}    },`);
    }

    lines.push(`${indent}}`);
    return lines.join("\n");
}

// ── Protocol pack generation ────────────────────────────────────

interface ProtocolPackData {
    id: string;
    locale: string;
    extends?: string;
    requiredSubculture: string;
    domain: string;
    sources?: string | string[];
    notes?: string;
    titles: Array<{
        system: string;
        code: string;
        rank: number;
        postalForm: string;
        correspondenceForm: string;
        postalAbbrev?: string;
        gender?: string;
    }>;
    rules: Array<{
        id: string;
        priority: number;
        template: string;
        when?: Record<string, any>;
        notes?: string;
    }>;
}

function renderWhen(when: Record<string, any>, indent: string): string {
    const lines: string[] = [];
    lines.push(`${indent}when: {`);
    for (const [key, val] of Object.entries(when)) {
        if (Array.isArray(val)) {
            lines.push(`${indent}    ${key}: [${val.map(v => `"${escapeString(v)}"`).join(", ")}],`);
        } else {
            lines.push(`${indent}    ${key}: "${escapeString(val)}",`);
        }
    }
    lines.push(`${indent}},`);
    return lines.join("\n");
}

function renderProtocolPack(pack: ProtocolPackData, indent: string): string {
    const lines: string[] = [];
    lines.push(`${indent}{`);
    lines.push(`${indent}    id: "${escapeString(pack.id)}",`);
    lines.push(`${indent}    locale: "${escapeString(pack.locale)}",`);
    lines.push(`${indent}    requiredSubculture: "${escapeString(pack.requiredSubculture)}",`);
    lines.push(`${indent}    domain: "${escapeString(pack.domain)}" as const,`);
    if (pack.extends) {
        lines.push(`${indent}    extends: "${escapeString(pack.extends)}",`);
    }
    if (pack.sources) {
        const val = Array.isArray(pack.sources)
            ? `[${pack.sources.map(s => `"${escapeString(s)}"`).join(", ")}]`
            : `"${escapeString(pack.sources)}"`;
        lines.push(`${indent}    sources: ${val},`);
    }
    if (pack.notes) {
        lines.push(`${indent}    notes: "${escapeString(pack.notes)}",`);
    }

    lines.push(`${indent}    titles: [`);
    for (const t of pack.titles) {
        const genderPart = t.gender ? `, gender: "${t.gender}" as const` : "";
        const abbrevPart = t.postalAbbrev ? `, postalAbbrev: "${escapeString(t.postalAbbrev)}"` : "";
        lines.push(`${indent}        { system: "${t.system}" as const, code: "${t.code}", rank: ${t.rank}, postalForm: "${escapeString(t.postalForm)}", correspondenceForm: "${escapeString(t.correspondenceForm)}"${abbrevPart}${genderPart} },`);
    }
    lines.push(`${indent}    ],`);

    lines.push(`${indent}    rules: [`);
    for (const r of pack.rules) {
        lines.push(`${indent}        {`);
        lines.push(`${indent}            id: "${escapeString(r.id)}",`);
        lines.push(`${indent}            priority: ${r.priority},`);
        lines.push(`${indent}            template: "${escapeString(r.template)}",`);
        if (r.when) {
            lines.push(renderWhen(r.when, `${indent}            `));
        }
        if (r.notes) {
            lines.push(`${indent}            notes: "${escapeString(r.notes)}",`);
        }
        lines.push(`${indent}        },`);
    }
    lines.push(`${indent}    ],`);

    lines.push(`${indent}}`);
    return lines.join("\n");
}

// ── Main ────────────────────────────────────────────────────────

function loadYAMLFiles<T>(category: string, validator: any): { file: string; data: T }[] {
    const filePaths = discoverPacks(PACKS_DIR, category);

    const results: { file: string; data: T }[] = [];

    for (const filePath of filePaths) {
        const file = path.basename(filePath);
        const raw = fs.readFileSync(filePath, "utf-8");
        let parsed: any;
        try {
            parsed = yaml.load(raw);
        } catch (e) {
            console.error(`  Failed to parse ${file}: ${(e as Error).message}`);
            process.exit(1);
        }

        if (!validator(parsed)) {
            console.error(`  Validation failed for ${file}:`);
            console.error(ajv.errorsText(validator.errors));
            process.exit(1);
        }

        results.push({ file, data: parsed as T });
        console.log(`  ${file}`);
    }

    return results;
}

console.log("\nGenerating address and protocol packs from data/packs/...\n");

console.log("Address packs:");
const addressFiles = loadYAMLFiles<AddressPackData>("address", validators.address);

console.log("\nProtocol packs:");
const protocolFiles = loadYAMLFiles<ProtocolPackData>("protocol", validators.protocol);

if (addressFiles.length === 0) {
    console.error("\nNo address pack files found in data/packs/");
    process.exit(1);
}

// ── Generate address-packs.generated.ts ─────────────────────────

const addressLines: string[] = [];
addressLines.push("/**");
addressLines.push(" * AUTO-GENERATED — Do not edit manually.");
addressLines.push(" * Generated from data/packs/*.address.yaml by scripts/generate-address-packs.ts");
addressLines.push(` * Generated at: ${new Date().toISOString()}`);
addressLines.push(" */");
addressLines.push("");
addressLines.push('import type { AddressPack } from "@salve/types";');
addressLines.push("");

const addressVarNames: string[] = [];

for (const { data } of addressFiles) {
    const varName = `${localeToVarName(data.locale)}AddressPack`;
    addressVarNames.push(varName);
    addressLines.push(`export const ${varName}: AddressPack =`);
    addressLines.push(renderAddressPack(data, ""));
    addressLines.push(";");
    addressLines.push("");
}

addressLines.push(`export const globalAddressPacks: AddressPack[] = [`);
for (const name of addressVarNames) {
    addressLines.push(`    ${name},`);
}
addressLines.push("];");
addressLines.push("");

const addressOutput = path.join(OUTPUT_DIR, "address-packs.generated.ts");
fs.writeFileSync(addressOutput, addressLines.join("\n"), "utf-8");

// ── Generate protocol-packs.generated.ts ────────────────────────

const protocolLines: string[] = [];
protocolLines.push("/**");
protocolLines.push(" * AUTO-GENERATED — Do not edit manually.");
protocolLines.push(" * Generated from data/packs/*.protocol.yaml by scripts/generate-address-packs.ts");
protocolLines.push(` * Generated at: ${new Date().toISOString()}`);
protocolLines.push(" */");
protocolLines.push("");
protocolLines.push('import type { ProtocolPack } from "@salve/types";');
protocolLines.push("");

const protocolVarNames: string[] = [];

for (const { data } of protocolFiles) {
    const varName = protocolIdToVarName(data.id);
    protocolVarNames.push(varName);
    protocolLines.push(`export const ${varName}: ProtocolPack =`);
    protocolLines.push(renderProtocolPack(data, ""));
    protocolLines.push(";");
    protocolLines.push("");
}

protocolLines.push(`export const globalProtocolPacks: ProtocolPack[] = [`);
for (const name of protocolVarNames) {
    protocolLines.push(`    ${name},`);
}
protocolLines.push("];");
protocolLines.push("");

const protocolOutput = path.join(OUTPUT_DIR, "protocol-packs.generated.ts");
fs.writeFileSync(protocolOutput, protocolLines.join("\n"), "utf-8");

// ── Generate honorifics.generated.ts (legacy bridge) ────────────

const honorificsLines: string[] = [];
honorificsLines.push("/**");
honorificsLines.push(" * AUTO-GENERATED — Do not edit manually.");
honorificsLines.push(" * Legacy HonorificPack objects derived from address pack data.");
honorificsLines.push(" * Generated from data/packs/*.address.yaml by scripts/generate-address-packs.ts");
honorificsLines.push(` * Generated at: ${new Date().toISOString()}`);
honorificsLines.push(" */");
honorificsLines.push("");
honorificsLines.push('import type { HonorificPack } from "@salve/types";');
honorificsLines.push("");

const honorificVarNames: string[] = [];

for (const { data } of addressFiles) {
    const varName = `${localeToVarName(data.locale)}Honorifics`;
    honorificVarNames.push(varName);
    honorificsLines.push(`export const ${varName}: HonorificPack = {`);
    honorificsLines.push(`    locale: "${escapeString(data.locale)}",`);
    honorificsLines.push(`    titles: {`);
    honorificsLines.push(`        male: "${escapeString(data.honorifics.male)}",`);
    honorificsLines.push(`        female: "${escapeString(data.honorifics.female)}",`);
    if (data.honorifics.nonBinary !== undefined) {
        honorificsLines.push(`        nonBinary: "${escapeString(data.honorifics.nonBinary)}",`);
    }
    if (data.honorifics.unspecified !== undefined) {
        honorificsLines.push(`        unspecified: "${escapeString(data.honorifics.unspecified)}",`);
    }
    honorificsLines.push(`    },`);
    honorificsLines.push(`    formats: {`);
    honorificsLines.push(`        formal: "{fullHonorific} {lastName}",`);
    honorificsLines.push(`        informal: "{firstName}",`);
    honorificsLines.push(`        standard: "{firstName} {lastName}",`);
    honorificsLines.push(`    },`);
    honorificsLines.push(`};`);
    honorificsLines.push("");
}

honorificsLines.push(`export const globalHonorifics: HonorificPack[] = [`);
for (const name of honorificVarNames) {
    honorificsLines.push(`    ${name},`);
}
honorificsLines.push("];");
honorificsLines.push("");

const honorificsOutput = path.join(OUTPUT_DIR, "honorifics.generated.ts");
fs.writeFileSync(honorificsOutput, honorificsLines.join("\n"), "utf-8");

// ── Summary ─────────────────────────────────────────────────────

console.log(`\nGenerated:`);
console.log(`  ${addressOutput}`);
console.log(`    ${addressFiles.length} address packs: ${addressVarNames.join(", ")}`);
console.log(`  ${protocolOutput}`);
console.log(`    ${protocolFiles.length} protocol packs: ${protocolVarNames.join(", ")}`);
console.log(`  ${honorificsOutput}`);
console.log(`    ${honorificVarNames.length} legacy honorific packs: ${honorificVarNames.join(", ")}`);
