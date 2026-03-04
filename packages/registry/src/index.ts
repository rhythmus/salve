import {
    CalendarPlugin,
    TransformPlugin,
    SaintDefinition,
    NameDayEntry,
    HonorificPack
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

/**
 * Top-level Salve Registry
 */
export class SalveRegistry {
    public readonly plugins = new PluginRegistry();
    public readonly packs = new PackRegistry();
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
