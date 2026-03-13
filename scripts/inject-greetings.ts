/**
 * inject-greetings.ts
 * ───────────────────
 * Injects high-quality localized greetings into international.secular.events.yaml.
 * Uses official event names from WikiData and idiomatic patterns.
 */

import * as fs from "fs";
import * as path from "path";

const YAML_PATH = path.resolve(__dirname, "../data/packs/international.secular.events.yaml");
const LABELS_JSON_PATH = path.resolve(__dirname, "../data/wikidata_labels.json");

// ─── Pattern Definitions ─────────────────────────────────────────────
// More idiomatic patterns for target languages
const PATTERNS: Record<string, string> = {
    en: "Happy {name}!",
    nl: "Fijne {name}!",
    fr: "Joyeuse {name} !",
    de: "Alles Gute zum {name}!",
    el: "Καλή {name}!",
    es: "¡Feliz {name}!",
    it: "Buona {name}!",
    pt: "Feliz {name}!",
    ru: "{name}!",             // In Russian, simply naming the holiday is often the most natural professional greeting
    pl: "{name}!",             // Similar to Russian for professional contexts to avoid complex declension issues
    ar: "{name} مبارك!",
    zh: "{name}快乐！"
};

// ─── Injection Logic ─────────────────────────────────────────────────
function main() {
    let wikiLabels: Record<string, Record<string, string>> = {};
    if (fs.existsSync(LABELS_JSON_PATH)) {
        wikiLabels = JSON.parse(fs.readFileSync(LABELS_JSON_PATH, "utf-8"));
    } else {
        console.error(`❌ Missing WikiData labels at ${LABELS_JSON_PATH}. Run fetch-wikidata-labels.ts first.`);
        process.exit(1);
    }

    const raw = fs.readFileSync(YAML_PATH, "utf-8");
    const lines = raw.split("\n");
    const result: string[] = [];
    let i = 0;

    console.log(`🚀 Starting mass injection using WikiData-localized labels...`);

    let injectedEvents = 0;
    let totalGreetings = 0;

    while (i < lines.length) {
        const line = lines[i];
        const labelMatch = line.match(/^\s+-\s+label:\s*'?(.+?)'?\s*$/);

        if (labelMatch) {
            let eventQid: string | null = null;
            let j = i + 1;
            let hasExistingGreetings = false;

            // Look ahead for WikiData QID and check for existing greetings
            while (j < lines.length && !lines[j].match(/^\s+-\s+label:/)) {
                const qidMatch = lines[j].match(/^\s+WikiData:\s*(\w+)/);
                if (qidMatch) eventQid = qidMatch[1];
                if (lines[j].trim() === "greetings:") hasExistingGreetings = true;
                j++;
            }

            if (eventQid && !hasExistingGreetings) {
                // Add event properties first
                result.push(line);
                i++;
                while (i < lines.length && !lines[i].match(/^\s+-\s+label:/) && lines[i].trim() !== "" && !lines[i].match(/^\s+#/)) {
                    result.push(lines[i]);
                    i++;
                }

                // Inject greetings
                result.push("    greetings:");
                const localizedLabels = wikiLabels[eventQid];

                if (localizedLabels) {
                    const languages = Object.keys(PATTERNS);
                    for (const lang of languages) {
                        let localizedName = localizedLabels[lang];

                        // Fallback logic: 
                        // For Chinese, try Hans if exact zh is missing (simplified is usually zh or zh-hans)
                        if (lang === "zh" && !localizedName) localizedName = localizedLabels["zh-hans"] || localizedLabels["zh-cn"];

                        // If we have a localized name, inject the greeting
                        if (localizedName) {
                            const text = PATTERNS[lang].replace("{name}", localizedName);
                            result.push(`      - text: '${escapeYaml(text)}'`);

                            const localeMap: Record<string, string> = {
                                nl: "nl",
                                fr: "fr",
                                de: "de-DE",
                                en: "en-GB",
                                el: "el-GR",
                                es: "es",
                                it: "it",
                                pt: "pt",
                                ru: "ru",
                                pl: "pl",
                                ar: "ar",
                                zh: "zh-CN"
                            };
                            result.push(`        locale: ${localeMap[lang] || lang}`);
                            result.push(`        sources: wikidata-localized-label`);
                            totalGreetings++;
                        }
                    }
                }
                injectedEvents++;
                continue;
            }
        }
        result.push(line);
        i++;
    }

    fs.writeFileSync(YAML_PATH, result.join("\n"), "utf-8");
    console.log(`✅ Injected ${totalGreetings} greetings across ${injectedEvents} events.`);
}

function escapeYaml(s: string): string {
    return s.replace(/'/g, "''");
}

main();
