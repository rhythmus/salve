import * as fs from "fs";
import * as path from "path";

/**
 * Recursively discover YAML (and optionally JSON) pack files under a
 * root directory whose basenames contain a given category marker.
 *
 * The marker is matched as ".{category}." inside the filename, which
 * works for every current Salve naming convention:
 *
 *   nl.greetings.yaml           → category "greetings"
 *   international.secular.events.yaml → category "events"
 *   nl.protocol.academic.yaml   → category "protocol"
 *   el-GR.nameday-saints.yaml   → category "nameday-saints"
 */
export function discoverPacks(rootDir: string, category: string): string[] {
    const marker = `.${category}.`;
    const results: string[] = [];

    function walk(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.name.startsWith(".")) continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (
                entry.isFile() &&
                entry.name.endsWith(".yaml") &&
                entry.name.includes(marker)
            ) {
                results.push(fullPath);
            }
        }
    }

    walk(rootDir);
    return results.sort();
}

/**
 * Recursively discover all YAML and JSON files under a root directory.
 * Used by generators that process multiple pack families in a single pass.
 */
export function discoverAllYAML(rootDir: string): string[] {
    const results: string[] = [];

    function walk(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.name.startsWith(".")) continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (
                entry.isFile() &&
                (entry.name.endsWith(".yaml") || entry.name.endsWith(".json"))
            ) {
                results.push(fullPath);
            }
        }
    }

    walk(rootDir);
    return results.sort();
}
