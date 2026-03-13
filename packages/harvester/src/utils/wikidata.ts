import { fetchJSON } from "./web";

const WIKIDATA_API = "https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&limit=1&search=";

/**
 * Look up a Wikidata QID for a given entity name.
 */
export async function lookupWikidataQid(name: string): Promise<string | undefined> {
    try {
        const data = await fetchJSON(WIKIDATA_API + encodeURIComponent(name));
        if (data.search && data.search.length > 0) {
            return data.search[0].id; // e.g. "Q11880318"
        }
    } catch (err) {
        console.warn(`  ⚠️ Wikidata lookup failed for "${name}":`, err instanceof Error ? err.message : err);
    }
    return undefined;
}
