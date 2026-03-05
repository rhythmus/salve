/**
 * SALVE Locale Fallback Chain
 *
 * Produces a BCP-47 fallback sequence ending in "root".
 * Example: "nl-BE" → ["nl-BE", "nl", "root"]
 */

/**
 * Build a locale fallback chain from a BCP-47 locale string.
 */
export function buildLocaleChain(locale: string): string[] {
    const chain: string[] = [locale];
    const parts = locale.split("-");

    // Progressively strip subtags from right to left
    while (parts.length > 1) {
        parts.pop();
        chain.push(parts.join("-"));
    }

    // Only add "root" sentinel if not already the last entry
    if (chain[chain.length - 1] !== "root") {
        chain.push("root");
    }

    return chain;
}
