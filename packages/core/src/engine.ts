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
    HonorificPack
} from "./types";
import { calculateEventScore, isAffiliated } from "./scoring";
import { AddressResolver } from "./address";

export class SalveEngine {
    private plugins: CalendarPlugin[] = [];
    private packs: Map<string, GreetingPack> = new Map();
    private memory?: GreetingMemory;
    private addressResolver: AddressResolver;

    constructor(memory?: GreetingMemory) {
        this.memory = memory;
        this.addressResolver = new AddressResolver();
    }

    /**
     * Register a calendar plugin for date resolution
     */
    public registerPlugin(plugin: CalendarPlugin): void {
        this.plugins.push(plugin);
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
        this.addressResolver.registerHonorifics(pack);
    }

    /**
     * Resolve the primary greeting for the given context
     */
    public resolve(context: GreetingContext): GreetingResult {
        const trace: string[] = [];
        const activeEvents: CelebrationEvent[] = [];

        // 1. Collect events from all plugins
        for (const plugin of this.plugins) {
            const events = plugin.resolveEvents(context.now, context);
            activeEvents.push(...events);
            trace.push(`Plugin [${plugin.id}] provided ${events.length} events.`);
        }

        // 2. Filter by user affiliations and suppressions
        const userAffiliations = context.affiliations ?? [];
        const filteredEvents = activeEvents.filter(e => {
            const affiliated = isAffiliated(e, userAffiliations);
            const suppressed = context.suppressions?.includes(e.id);
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
        return {
            greeting: candidate.text,
            address: address,
            salutation: `${candidate.text}${address}`,
            expectedResponse: candidate.expectedResponse,
            metadata: {
                eventId: bestEvent?.id,
                domain: bestEvent?.domain,
                locale: context.locale,
                score: highestScore,
                trace: trace
            }
        };
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
            const phaseMatch = !context.phase || g.phase === context.phase;
            const roleMatch = !context.role || g.role === context.role;
            const formalityMatch = !context.formality || g.formality === context.formality;

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
        if (this.packs.has(locale)) return this.packs.get(locale)!;
        const base = locale.split("-")[0];
        return this.packs.get(base) || null;
    }

    private generateFallback(context: GreetingContext, trace: string[]): GreetingResult {
        trace.push("No locale pack found. Returning emergency fallback.");
        const address = this.resolveAddress(context);
        return {
            greeting: "Hello",
            address: address,
            salutation: `Hello, ${address}`.replace(/,\s*$/, ""),
            metadata: {
                locale: context.locale,
                score: 0,
                trace: trace
            }
        };
    }
}
