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
    GreetingMemory
} from "./types";
import { calculateEventScore, isAffiliated } from "./scoring";

export class SalveEngine {
    private plugins: CalendarPlugin[] = [];
    private packs: Map<string, GreetingPack> = new Map();
    private memory?: GreetingMemory;

    constructor(options?: { memory?: GreetingMemory }) {
        this.memory = options?.memory;
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
        const pack = this.packs.get(context.locale);
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
        const profile = context.profile;
        if (!profile) return "";

        // Simplified address logic for initial implementation
        // Future: Use locale-specific address packs (M4.1)
        if (context.formality === "formal") {
            const title = profile.academicTitles?.[0] || (profile.gender === "male" ? "Mr." : "Ms.");
            return `, ${title} ${profile.lastName || ""}`;
        }

        return profile.firstName ? `, ${profile.firstName}` : "";
    }

    private generateFallback(context: GreetingContext, trace: string[]): GreetingResult {
        trace.push("No locale pack found. Returning emergency fallback.");
        return {
            greeting: "Hello",
            salutation: "Hello",
            metadata: {
                locale: context.locale,
                score: 0,
                trace: trace
            }
        };
    }
}
