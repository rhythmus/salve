import {
    CalendarPlugin,
    GreetingContext,
    CelebrationEvent,
    NameDayEntry,
    SaintDefinition
} from "@salve/types";

export interface RemoteNameDayConfig {
    endpoint: string;
    fetchImpl?: typeof fetch;
}

/**
 * A plugin that resolves name-days by querying a remote REST API.
 */
export class RemoteNameDayPlugin implements CalendarPlugin {
    public readonly id = "nameday-remote";
    private cache = new Map<string, NameDayEntry[]>();

    constructor(private config: RemoteNameDayConfig) { }

    async resolveEvents(now: Date, context: GreetingContext): Promise<CelebrationEvent[]> {
        // Only trigger if specifically requested or for relevant locales
        if (!context.affiliations?.includes("namedays")) {
            // We could also check locale here, but typically the user enables this via affiliations or a flag
            // return []; 
        }

        const month = now.getMonth() + 1;
        const day = now.getDate();
        const locale = context.locale;
        const cacheKey = `${locale}:${month}-${day}`;

        try {
            let entries = this.cache.get(cacheKey);
            if (!entries) {
                entries = await this.fetchEntries(locale, month, day);
                this.cache.set(cacheKey, entries);
            }

            // In a real implementation, we'd match the user's name against the saint aliases.
            // For now, we return the events to be processed by the engine.
            return entries.map(entry => ({
                id: `nameday-${entry.saintQids.join("-")}`,
                domain: "religious" as const,
                tradition: "namedays",
                metadata: {
                    saintQids: entry.saintQids
                }
            }));
        } catch (e) {
            console.warn(`[SALVE] Remote NameDay fetch failed: ${e}`);
            return [];
        }
    }

    private async fetchEntries(locale: string, month: number, day: number): Promise<NameDayEntry[]> {
        const fetchFn = this.config.fetchImpl || fetch;
        const url = `${this.config.endpoint}?locale=${locale}&month=${month}&day=${day}`;

        const response = await fetchFn(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}
