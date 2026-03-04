/**
 * SALVE Core Engine
 */

import {
    GreetingContext,
    GreetingResult,
    GreetingPack,
    CalendarPlugin,
    CelebrationEvent,
    GreetingLexiconEntry,
    GreetingMemory,
    HonorificPack,
    AddressProfile
} from "./types";
import { calculateEventScore, isAffiliated } from "./scoring";
import { AddressResolver, TransformHook } from "./address";
import { SalveRegistry, SalveLoader } from "@salve/registry";

export interface SalveOptions {
    registry?: SalveRegistry;
    memory?: GreetingMemory;
}

const DEFAULT_CONTEXT_VALUES = {
    affiliations: ["civil", "secular"],
    relationship: "stranger" as const,
    formality: "formal" as const,
    suppressions: []
};

// @ts-ignore - tiny JS lib without types
import { getVocativeName } from "@desquared/greek-vocative-name";

export class SalveEngine {
    private packs: Map<string, GreetingPack> = new Map();
    private memory?: GreetingMemory;
    private addressResolver: AddressResolver;
    private registry: SalveRegistry;
    private loader: SalveLoader;

    constructor(options: SalveOptions = {}) {
        this.registry = options.registry || new SalveRegistry();
        this.memory = options.memory;
        this.loader = new SalveLoader(this.registry);
        this.addressResolver = new AddressResolver(this.registry.packs.getAllHonorifics());
        this.registerDefaultTransforms();
    }

    private registerDefaultTransforms(): void {
        // Greek Vocative (M4.2)
        this.addressResolver.registerTransform("el", (val, key) => {
            if (key === "firstName" || key === "lastName") {
                try {
                    // getVocativeName is the export from the library
                    return getVocativeName(val);
                } catch (e) {
                    return val;
                }
            }
            return val;
        });
    }

    /**
     * Use the loader to discover and register components
     */
    public use(components: any[]): void {
        this.loader.load(components);

        // Synchronize settings (e.g., register honorifics in resolver)
        for (const hp of this.registry.packs.getHonorificsByLocale("")) { // This search needs improvement but Loader handles it
            // Loader currently just puts them in registry. We need to sync with AddressResolver.
        }
    }

    /**
     * Register a calendar plugin for date resolution
     */
    public registerPlugin(plugin: CalendarPlugin): void {
        this.registry.plugins.registerCalendar(plugin.id, plugin);
    }

    /**
     * Register a greeting pack for a specific locale
     */
    public registerPack(pack: GreetingPack): void {
        this.packs.set(pack.locale, pack);
    }

    /**
     * Register a localized honorific pack
     */
    public registerHonorifics(pack: HonorificPack): void {
        this.registry.packs.registerHonorifics(pack);
        this.addressResolver.registerHonorifics(pack);
    }

    /**
     * Register a localized transform hook
     */
    public registerTransform(locale: string, hook: TransformHook): void {
        this.registry.plugins.registerTransform(`${locale}-hook-${Date.now()}`, {
            id: locale,
            locales: [locale],
            transform: hook
        });
        this.addressResolver.registerTransform(locale, hook);
    }

    /**
     * Resolve the primary greeting for the given context
     */
    public async resolve(partialContext: GreetingContext): Promise<GreetingResult> {
        const context: GreetingContext = {
            ...DEFAULT_CONTEXT_VALUES,
            ...partialContext
        };

        const trace: string[] = [];
        const activeEvents: CelebrationEvent[] = [];

        // 1. Collect events from all plugins
        const calendars = this.registry.plugins.getAllCalendars();
        for (const plugin of calendars) {
            const events = await plugin.resolveEvents(context.now, context);
            activeEvents.push(...events);
            trace.push(`Plugin [${plugin.id}] provided ${events.length} events.`);
        }

        // 2. Filter by user affiliations and suppressions
        const userAffiliations = context.affiliations ?? [];
        const filteredEvents: CelebrationEvent[] = activeEvents.filter(e => {
            const affiliated = isAffiliated(e, userAffiliations);
            const suppressed = context.suppressions?.includes(e.id) ?? false;
            return affiliated && !suppressed;
        });

        trace.push(`Filtered to ${filteredEvents.length} applicable events.`);

        // 3. Find the best event (Maximal Cultural Specificity)
        let bestEvent: CelebrationEvent | null = null;
        let highestScore = -1;

        for (const event of filteredEvents) {
            const score = calculateEventScore(event);
            if (score > highestScore) {
                highestScore = score;
                bestEvent = event;
            }
        }

        if (bestEvent) {
            trace.push(`Selected best event: ${bestEvent.id} (Score: ${highestScore})`);
        }

        // 4. Select the lexicon entry from packs
        const pack = this.getPack(context.locale);
        if (!pack) {
            return this.generateFallback(context, trace);
        }

        const candidate = this.selectGreeting(pack, bestEvent, context, trace);

        // 5. Record in memory to prevent repetition
        if (this.memory && candidate.id !== "err") {
            const memoryKey = `g:${pack.locale}:${candidate.id}`;
            this.memory.record(memoryKey, 3600 * 1000); // Default 1h TTL
            trace.push(`Recorded greeting [${candidate.id}] in memory.`);
        }

        const address = this.resolveAddress(context);

        // 5. Construct the result
        // Improvement (M4.2): Localized concatenation and punctuation
        let salutation = candidate.text;
        if (address) {
            // Check if greeting already ends with punctuation
            const endsWithPunct = /[.!?]$/.test(salutation);
            const separator = endsWithPunct ? " " : ", ";
            salutation = `${salutation}${separator}${address}`;
        }

        const result = {
            greeting: candidate.text,
            address: address,
            salutation: salutation,
            expectedResponse: candidate.expectedResponse,
            metadata: {
                eventId: bestEvent?.id,
                domain: bestEvent?.domain,
                locale: context.locale,
                score: highestScore,
                trace: trace
            }
        };
        return result;
    }

    private selectGreeting(
        pack: GreetingPack,
        event: CelebrationEvent | null,
        context: GreetingContext,
        trace: string[]
    ): GreetingLexiconEntry {
        // Filter lexicon by event, phase, role, formality, etc.
        const candidates = pack.greetings.filter(g => {
            const eventMatch = event ? g.eventRef === event.id : !g.eventRef;
            const phaseMatch = !g.phase || g.phase === context.phase;
            const roleMatch = !g.role || g.role === context.role;
            const formalityMatch = !g.formality || g.formality === context.formality;

            // Anti-repetition check
            const isRemembered = this.memory?.has(`g:${pack.locale}:${g.id}`) ?? false;

            return eventMatch && phaseMatch && roleMatch && formalityMatch && !isRemembered;
        });

        if (candidates.length > 0) {
            trace.push(`Found ${candidates.length} candidates in pack [${pack.locale}].`);
            return candidates[0]; // TODO: Add secondary sorting within candidates
        }

        trace.push(`No exact matches in pack [${pack.locale}]. Falling back.`);
        // Fallback to generic greeting within the pack if event-specific fails
        return pack.greetings.find(g => !g.eventRef) || { id: "err", text: "Hello" };
    }

    private resolveAddress(context: GreetingContext): string {
        return this.addressResolver.resolve(context);
    }

    private getPack(locale: string): GreetingPack | null {
        const result = this.packs.has(locale) ? this.packs.get(locale)! : null;
        if (!result) {
            const base = locale.split("-")[0];
            const fallback = this.packs.get(base) || null;
            // console.log(`[SALVE_PACK] locale=${locale}, fallback=${fallback?.locale}`);
            return fallback;
        }
        return result;
    }

    private generateFallback(context: GreetingContext, trace: string[], event: CelebrationEvent | null = null): GreetingResult {
        trace.push("No locale pack found. Returning emergency fallback.");
        const address = this.resolveAddress(context);
        return {
            greeting: "Hello",
            address: address,
            salutation: `Hello, ${address}`.replace(/,\s*$/, ""),
            metadata: {
                eventId: event?.id || "emergency-fallback",
                domain: event?.domain || "cultural_baseline",
                locale: context.locale,
                score: 0,
                trace: trace
            }
        };
    }
}
