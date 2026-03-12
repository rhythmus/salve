import {
    CalendarPlugin,
    TransformPlugin,
    SaintDefinition,
    NameDayEntry,
    HonorificPack,
    EventRegistryEntry,
    EventDomainV1,
    GreetingRule
} from "@salve/types";

/**
 * Registry for Salve plugins (executable logic)
 */
export class PluginRegistry {
    private calendars = new Map<string, CalendarPlugin>();
    private transforms = new Map<string, TransformPlugin>();

    registerCalendar(id: string, plugin: CalendarPlugin): void {
        this.calendars.set(id, plugin);
    }

    getCalendar(id: string): CalendarPlugin | undefined {
        return this.calendars.get(id);
    }

    registerTransform(id: string, plugin: TransformPlugin): void {
        this.transforms.set(id, plugin);
    }

    getTransformsByLocale(locale: string): TransformPlugin[] {
        return Array.from(this.transforms.values()).filter(t => t.locales.includes(locale));
    }

    getAllCalendars(): CalendarPlugin[] {
        return Array.from(this.calendars.values());
    }
}

/**
 * Registry for Salve data packs (pure data)
 */
export class PackRegistry {
    private honorifics: HonorificPack[] = [];
    private saints: SaintDefinition[] = [];
    private nameDays: NameDayEntry[] = [];

    registerHonorifics(pack: HonorificPack): void {
        this.honorifics.push(pack);
    }

    getHonorificsByLocale(locale: string): HonorificPack[] {
        return this.honorifics.filter(p => p.locale === locale);
    }

    getAllHonorifics(): HonorificPack[] {
        return this.honorifics;
    }

    registerSaints(saints: SaintDefinition[]): void {
        this.saints.push(...saints);
    }

    getSaints(): SaintDefinition[] {
        return this.saints;
    }

    registerNameDays(entries: NameDayEntry[]): void {
        this.nameDays.push(...entries);
    }

    getNameDays(): NameDayEntry[] {
        return this.nameDays;
    }
}

// ═══════════════════════════════════════════════════════════════════
// Milestone 9 — Event Namespace Registry & Greeting Rule Registry
// ═══════════════════════════════════════════════════════════════════

/**
 * Global Event Namespace Registry.
 * Provides stable, collision-free event identifiers following the pattern:
 *   salve.event.<domain>.<region?>.<event_name>
 */
export class EventRegistry {
    private events = new Map<string, EventRegistryEntry>();
    private aliases = new Map<string, string>(); // alias → canonical id

    /** Register a canonical event */
    registerEvent(entry: EventRegistryEntry): void {
        this.events.set(entry.id, entry);
        if (entry.aliases) {
            for (const alias of entry.aliases) {
                this.aliases.set(alias, entry.id);
            }
        }
    }

    /** Register multiple events at once */
    registerEvents(entries: EventRegistryEntry[]): void {
        for (const entry of entries) {
            this.registerEvent(entry);
        }
    }

    /** Resolve an alias to its canonical event id */
    resolveAlias(alias: string): string | undefined {
        return this.aliases.get(alias);
    }

    /** Resolve an id, checking aliases if direct lookup fails */
    resolveId(id: string): string {
        if (this.events.has(id)) return id;
        return this.aliases.get(id) ?? id;
    }

    /** Get a specific event entry */
    getEvent(id: string): EventRegistryEntry | undefined {
        const canonical = this.resolveId(id);
        return this.events.get(canonical);
    }

    /** Get all events for a given domain */
    getEventsByDomain(domain: EventDomainV1): EventRegistryEntry[] {
        return Array.from(this.events.values()).filter(e => e.domain === domain);
    }

    /** Get all registered events */
    getAllEvents(): EventRegistryEntry[] {
        return Array.from(this.events.values());
    }
}

/**
 * Registry for ontology-aware greeting rules (v1).
 * Rules are stored per-pack, retrievable by locale chain.
 */
export class GreetingRuleRegistry {
    /** packId → rules */
    private packs = new Map<string, { locale: string; precedence: number; rules: GreetingRule[] }>();

    /** Register rules from a pack */
    registerRules(packId: string, locale: string, rules: GreetingRule[], precedence: number = 0): void {
        this.packs.set(packId, { locale, precedence, rules });
    }

    /** Retrieve all rules matching any locale in the fallback chain, ordered by pack precedence */
    getRulesByLocaleChain(localeChain: string[]): Array<{ packId: string; precedence: number; rule: GreetingRule }> {
        const result: Array<{ packId: string; precedence: number; rule: GreetingRule }> = [];

        for (const [packId, pack] of this.packs) {
            // Match if the pack locale appears anywhere in the chain
            if (localeChain.includes(pack.locale) || pack.locale === "root") {
                for (const rule of pack.rules) {
                    result.push({ packId, precedence: pack.precedence, rule });
                }
            }
        }

        return result;
    }

    /** Get metadata for a specific pack */
    getPackInfo(packId: string): { locale: string; precedence: number } | undefined {
        const pack = this.packs.get(packId);
        if (!pack) return undefined;
        return { locale: pack.locale, precedence: pack.precedence };
    }
}

/**
 * Default event entries for the SALVE Event Namespace.
 */
export const SEED_EVENTS: EventRegistryEntry[] = [
    { id: "salve.event.bank.be.labour_day", domain: "bank", country: "BE", description: "Dag van de Arbeid", scope: "local", emoji: "⚒️" },
    { id: "salve.event.bank.fr.bastille_day", domain: "bank", country: "FR", description: "National Day of France (14 July)", scope: "local", aliases: ["national_day_france"], emoji: "🇫🇷" },
    { id: "salve.event.bank.us.independence_day", domain: "bank", country: "US", description: "Independence Day (4 July)", scope: "local", emoji: "🇺🇸" },
    { id: "salve.event.bank.de.tag_der_deutschen_einheit", domain: "bank", country: "DE", description: "Tag der Deutschen Einheit (3 October)", scope: "local", emoji: "🇩🇪" },
    { id: "salve.event.religious.christian.christmas", domain: "religious", description: "Christmas (25 December)", scope: "global", emoji: "🎄" },
    { id: "salve.event.religious.orthodox.easter", domain: "religious", description: "Orthodox Easter (moveable feast)", scope: "global", emoji: "🥚" },
    { id: "salve.event.religious.islam.eid_al_fitr", domain: "religious", description: "Eid al-Fitr", scope: "global", emoji: "🌙" },
    { id: "salve.event.religious.islam.eid_al_adha", domain: "religious", description: "Eid al-Adha", scope: "global", emoji: "🕋" },
    { id: "salve.event.personal.nameday", domain: "personal", description: "Personal name day celebration", scope: "global", emoji: "🎉" },
    { id: "salve.event.personal.birthday", domain: "personal", description: "Personal birthday", scope: "global", emoji: "🎂" },
    { id: "salve.event.personal.anniversary", domain: "personal", description: "Personal anniversary", scope: "global", emoji: "🥂" },
    { id: "salve.event.civil.eu.day_of_europe", domain: "civil", description: "Day of Europe (9 May)", scope: "regional", emoji: "🇪🇺" },
    { id: "salve.event.civil.un.human_rights_day", domain: "civil", description: "Human Rights Day (10 December)", scope: "global", emoji: "⚖️" },
    { id: "salve.event.seasonal.holiday_season", domain: "seasonal", description: "Holiday season (Dec 20 – Jan 5)", scope: "global", emoji: "❄️" },
];

/**
 * Top-level Salve Registry
 */
export class SalveRegistry {
    public readonly plugins = new PluginRegistry();
    public readonly packs = new PackRegistry();
    public readonly events = new EventRegistry();
    public readonly greetingRules = new GreetingRuleRegistry();

    constructor() {
        // Seed the event namespace with defaults
        this.events.registerEvents(SEED_EVENTS);
    }
}

/**
 * Global Salve Loader for automatic discovery and initialization
 */
export class SalveLoader {
    constructor(private registry: SalveRegistry) { }

    /**
     * Load a collection of components into the registry
     */
    load(components: any[]): void {
        for (const comp of components) {
            this.processComponent(comp);
        }
    }

    private processComponent(comp: any): void {
        // Very basic discovery logic based on signature/properties
        if (comp.id && comp.getCelebrations) {
            this.registry.plugins.registerCalendar(comp.id, comp);
        } else if (comp.id && comp.transform && comp.locales) {
            this.registry.plugins.registerTransform(comp.id, comp);
        } else if (comp.locale && comp.honorifics) {
            this.registry.packs.registerHonorifics(comp);
        } else if (Array.isArray(comp) && comp.length > 0) {
            // Check first element to guess type
            const first = comp[0];
            if (first.qid && first.canonicalName) {
                this.registry.packs.registerSaints(comp);
            } else if (first.month && first.day && first.saintQids) {
                this.registry.packs.registerNameDays(comp);
            }
        }
    }
}

