/**
 * Date standardization utilities for Salve
 */

/** 
 * Convert formats like "January 4" or "March 8" to "4 January" or "8 March"
 * for consistent Salve internal date storage in YAML.
 */
export function normalizeDateToSalve(raw: string): string {
    const trimmed = raw.trim();
    // Already in "4 January" format?
    if (/^\d/.test(trimmed)) return trimmed;

    // "January 4" -> "4 January"
    const m = trimmed.match(/^([A-Za-z]+)\s+(\d+)$/);
    if (m) {
        return `${parseInt(m[2], 10)} ${m[1]}`;
    }

    return trimmed; // fallback
}
