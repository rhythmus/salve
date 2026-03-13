/**
 * Web fetching utilities
 */
export async function fetchText(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
}

export async function fetchJSON(url: string): Promise<any> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
}

/** Rate limiting helper */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
