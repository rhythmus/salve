import {
    CalendarPlugin,
    GreetingContext,
    CelebrationEvent,
    NameDayEntry,
    SaintDefinition,
    NameDayCelebration
} from "@salve/types";

export class NameDayResolver implements CalendarPlugin {
    public id = "nameday-plugin";

    private entries: NameDayEntry[] = [];
    private saints: Map<string, SaintDefinition> = new Map();

    /**
     * Register saints and their aliases
     */
    public registerSaints(saints: SaintDefinition[]): void {
        for (const saint of saints) {
            this.saints.set(saint.qid, saint);
        }
    }

    /**
     * Register name-day calendar entries
     */
    public registerNameDays(entries: NameDayEntry[]): void {
        this.entries.push(...entries);
    }

    /**
     * Resolve name-day events for the given date and user
     */
    public resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] {
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const dayEntries = this.entries.filter(e => e.month === month && e.day === day);
        if (dayEntries.length === 0) return [];

        const events: CelebrationEvent[] = [];
        const userFirstName = context.profile?.firstName;

        if (!userFirstName) return [];

        for (const entry of dayEntries) {
            for (const qid of entry.saintQids) {
                const saint = this.saints.get(qid);
                if (!saint) continue;

                if (this.isNameMatch(userFirstName, saint.aliases)) {
                    events.push({
                        id: `nameday.${qid}`,
                        domain: "personal",
                        tradition: saint.traditions[0], // Primary tradition
                        priority: 800, // Personal domain, high priority
                        saintQid: saint.qid,
                        targetName: userFirstName,
                        metadata: {
                            saintName: saint.canonicalName
                        }
                    } as NameDayCelebration);
                }
            }
        }

        return events;
    }

    /**
     * Fuzzy matching for names (diacritic insensitive)
     */
    private isNameMatch(name: string, aliases: string[]): boolean {
        const normalizedInput = this.normalize(name);
        return aliases.some(alias => this.normalize(alias) === normalizedInput);
    }

    private normalize(str: string): string {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .trim();
    }
}
