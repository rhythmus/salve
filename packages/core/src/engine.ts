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
    AddressProfile,
    AddressPack,
    AddressAudience,
    AddressRecipient,
    AddressTitleToken,
    ProtocolPack,
    ResolvedAddress,
    SalveContextV1,
    SalveOutputV1,
    SalveOutputV1WithAddress,
    SalvePrimaryOutput,
    SalveExtra,
    SalveTraceEntry,
    SalveRenderPolicy,
    NormalizedContext,
    GreetingRule,
    SalveEvent,
    ScoreTuple,
    EventDomainV1,
} from "./types";
import { calculateEventScore, isAffiliated, computeScoreTuple, compareScoreTuples } from "./scoring";
import { AddressResolver, TransformHook } from "./address";
import { AddressEngine, AddressResolveContext } from "./address-engine";
import { CompositionEngine, CompositionInput } from "./composition";
import { SalveRegistry, SalveLoader } from "@salve/registry";
import { LocationResolver, RegionDefinition } from "./location";
import { normalizeContext } from "./normalize";
import { applyStyleTransform, StylePack, computeStyleMatchScore } from "./style";
import { RuleBasedCalendarPlugin } from "./rule-based-plugin";

export interface SalveOptions {
    registry?: SalveRegistry;
    memory?: GreetingMemory;
    regions?: RegionDefinition[];
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
    private addressEngine: AddressEngine;
    private compositionEngine: CompositionEngine;
    private registry: SalveRegistry;
    private loader: SalveLoader;
    private stylePacks: StylePack[] = [];
    private locationResolver?: LocationResolver;

    constructor(options: SalveOptions = {}) {
        this.registry = options.registry || new SalveRegistry();
        this.memory = options.memory;
        this.loader = new SalveLoader(this.registry);
        this.addressResolver = new AddressResolver(this.registry.packs.getAllHonorifics());
        this.addressEngine = new AddressEngine();
        this.compositionEngine = new CompositionEngine();
        if (options.regions) {
            this.locationResolver = new LocationResolver(options.regions);
        }
        this.registerPlugin(new RuleBasedCalendarPlugin());
        this.registerDefaultTransforms();

        for (const hp of this.registry.packs.getAllHonorifics()) {
            this.addressEngine.importLegacyHonorifics(hp);
        }
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

        // Bridge to v1 registry: convert LexiconEntries to GreetingRules
        const rules: GreetingRule[] = pack.greetings.map(g => ({
            id: g.id,
            act: (g.metadata?.act as any) ?? "salutation",
            form: (g.metadata?.form as any) ?? "greeting_only",
            style: (g.metadata?.style as any) ?? "neutral",
            priority: (g.metadata?.priority as any) ?? 1,
            template: g.text,
            when: {
                eventRef: g.eventRef,
                timeOfDay: g.timeOfDay as any,
                phase: g.phase as any,
                setting: (Array.isArray(g.setting) ? g.setting : (g.setting ? [g.setting] : undefined)) as any,
                relationship: (Array.isArray(g.relationship) ? g.relationship : (g.relationship ? [g.relationship] : undefined)) as any,
                formality: g.formality,
                professionsAny: g.professions,
                audienceSize: g.audienceSize
            }
        }));
        this.registerGreetingRules(`pack_${pack.locale}`, pack.locale, rules, 0);
    }

    /**
     * Register a localized honorific pack
     */
    public registerHonorifics(pack: HonorificPack): void {
        this.registry.packs.registerHonorifics(pack);
        this.addressResolver.registerHonorifics(pack);
        this.addressEngine.importLegacyHonorifics(pack);
    }

    /**
     * Register a v1 address pack for baseline civility data
     */
    public registerAddressPack(pack: AddressPack): void {
        this.registry.packs.registerAddressPack(pack);
        this.addressEngine.registerAddressPack(pack);
    }

    /**
     * Register a gated institutional protocol pack
     */
    public registerProtocolPack(pack: ProtocolPack): void {
        this.registry.packs.registerProtocolPack(pack);
        this.addressEngine.registerProtocolPack(pack);
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
     * Register a style pack for rhetorical rendering
     */
    public registerStylePack(pack: StylePack): void {
        this.stylePacks.push(pack);
    }

    /**
     * Register ontology-aware greeting rules for a locale
     */
    public registerGreetingRules(packId: string, locale: string, rules: GreetingRule[], precedence: number = 0): void {
        this.registry.greetingRules.registerRules(packId, locale, rules, precedence);
    }

    /**
     * Resolve the primary greeting for the given context (legacy API)
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

        const result: GreetingResult = {
            greeting: candidate.text,
            address: address,
            salutation: salutation,
            expectedResponse: candidate.expectedResponse,
            metadata: {
                eventId: bestEvent?.id,
                category: bestEvent?.category ?? bestEvent?.domain,
                domain: (bestEvent?.domain ?? bestEvent?.category) as any,
                locale: context.locale,
                score: highestScore,
                trace: trace
            }
        };
        return result;
    }

    // ═══════════════════════════════════════════════════════════════
    // Milestone 9 — v1 Resolution Pipeline
    // ═══════════════════════════════════════════════════════════════

    /**
     * Register geographic regions for locale resolution
     */
    public registerRegions(regions: RegionDefinition[]): void {
        this.locationResolver = new LocationResolver(regions);
    }

    /**
     * Resolve a greeting using the v1 pipeline.
     *
     * Pipeline stages:
     * 1. Context Normalization
     * 2. Locale Fallback Chain (computed in normalization)
     * 3. Event Collection
     * 4. Candidate Enumeration
     * 5. Deterministic Scoring
     * 6. Address Resolution
     * 7. Style Rendering
     * 8. Composition & Output
     */
    public async resolveV1(input: SalveContextV1): Promise<SalveOutputV1> {
        // ── Stage 1 & 2: Context Normalization ──────────────────
        const ctx = normalizeContext(input, this.locationResolver);
        const traceEntries: SalveTraceEntry[] = [];
        const usedEvents: string[] = [];

        // ── Stage 3: Event Collection ───────────────────────────
        const activeEvents: SalveEvent[] = [];
        const calendars = this.registry.plugins.getAllCalendars();

        for (const plugin of calendars) {
            const legacyEvents = await plugin.resolveEvents(ctx.env.now, {
                now: ctx.env.now,
                locale: ctx.env.locale,
                affiliations: ctx.memberships.traditions,
                phase: ctx.interaction.phase === "encounter" ? "encounter" : "parting",
            });

            for (const le of legacyEvents as any[]) {
                const dateStr = ctx.env.now.toISOString().split("T")[0];
                const mappedKind = this.mapLegacyDomain(le.domain || le.category);
                activeEvents.push({
                    id: le.id,
                    kind: mappedKind,
                    category: le.domain || le.category,
                    start: dateStr,
                    end: dateStr,
                    label: le.id,
                    source: plugin.id,
                    emoji: le.emoji,
                    precedence: le.priority ?? 0,
                    requiredRegions: le.requiredRegions,
                    requiredProfessions: le.requiredProfessions,
                    wikiDataId: le.wikiDataId || le.WikiData,
                });
            }
        }

        // Deduplicate and Merge events by wikiDataId
        const mergedEvents = new Map<string, SalveEvent>();
        const noWikiDataEvents: SalveEvent[] = [];

        for (const e of activeEvents) {
            // Ensure every event has an ID, even if synthetic
            if (!e.id) {
                e.id = e.wikiDataId ? `salve.wiki.${e.wikiDataId}` : `salve.anon.${Math.random().toString(36).substr(2, 9)}`;
            }

            if (!e.wikiDataId) {
                noWikiDataEvents.push(e);
                continue;
            }

            if (!mergedEvents.has(e.wikiDataId)) {
                mergedEvents.set(e.wikiDataId, e);
            } else {
                const existing = mergedEvents.get(e.wikiDataId)!;
                // Merge logic:

                // 1. ID Promotion: prefer 'salve.event.*' over others
                if (!existing.id.startsWith('salve.event.') && e.id.startsWith('salve.event.')) {
                    existing.id = e.id;
                }

                // 2. prefer 'official' category
                if (e.category === 'official') existing.category = 'official';

                // 3. merge requiredRegions (unique values)
                if (e.requiredRegions) {
                    existing.requiredRegions = Array.from(new Set([...(existing.requiredRegions || []), ...e.requiredRegions]));
                }

                // 4. merge requiredProfessions
                if (e.requiredProfessions) {
                    existing.requiredProfessions = Array.from(new Set([...(existing.requiredProfessions || []), ...e.requiredProfessions]));
                }

                // 5. pick emoji if existing doesn't have one
                if (!existing.emoji && e.emoji) existing.emoji = e.emoji;

                // 6. precedence: take max
                existing.precedence = Math.max(existing.precedence || 0, e.precedence || 0);
            }
        }
        const finalActiveEvents = [...noWikiDataEvents, ...mergedEvents.values()];

        const filteredEvents = finalActiveEvents.filter((e: SalveEvent) => {
            const eDomain = (e.kind ?? e.category ?? "cultural_baseline") as EventDomainV1;

            if (!ctx.policy.allowDomains.includes(eDomain)) return false;

            if (eDomain === "religious" && ctx.policy.requireExplicitTraditionsForReligious) {
                if (ctx.memberships.traditions.length === 0) return false;
            }

            if (eDomain === "protocol" && !ctx.policy.allowSubcultureAddressing) return false;

            if (e.requiredRegions && e.requiredRegions.length > 0) {
                const hasMatchingRegion = e.requiredRegions.some((rid: string) => ctx.regions.includes(rid));
                if (!hasMatchingRegion) return false;
            }

            if (e.requiredProfessions && e.requiredProfessions.length > 0) {
                const hasMatchingProfession = e.requiredProfessions.some((p: string) => ctx.memberships.professions.includes(p.toLowerCase()));
                if (!hasMatchingProfession) return false;
            }

            return true;
        });

        for (const e of filteredEvents) {
            usedEvents.push(e.id);
        }

        // ── Stage 4: Candidate Enumeration ──────────────────────
        const allRuleEntries = this.registry.greetingRules.getRulesByLocaleChain(ctx.localeChain);

        type ScoredCandidate = {
            packId: string;
            rule: GreetingRule;
            event: SalveEvent | null;
            tuple: ScoreTuple;
        };

        const candidates: ScoredCandidate[] = [];

        for (const entry of allRuleEntries) {
            const rule = entry.rule;

            // Phase filter
            if (rule.when?.phase) {
                const phases = Array.isArray(rule.when.phase) ? rule.when.phase : [rule.when.phase];
                if (!phases.includes(ctx.interaction.phase)) continue;
            }

            // Day period filter
            if (rule.when?.dayPeriod) {
                if (rule.when.dayPeriod !== ctx.env.dayPeriod) continue;
            }

            // Formality filter
            if (rule.when?.formality) {
                if (rule.when.formality !== ctx.interaction.formality) continue;
            }

            // Setting filter
            if (rule.when?.setting) {
                if (!rule.when.setting.includes(ctx.interaction.setting)) continue;
            }

            // Relationship filter
            if (rule.when?.relationship) {
                if (!rule.when.relationship.includes(ctx.interaction.relationship)) continue;
            }

            // Subculture filter
            if (rule.when?.subculturesAny) {
                const hasMatch = rule.when.subculturesAny.some((sc: string) => ctx.memberships.subcultures.includes(sc));
                if (!hasMatch) continue;
            }

            // Affiliation filter
            if (rule.when?.affiliationsAny) {
                const hasMatch = rule.when.affiliationsAny.some((a: string) => ctx.memberships.traditions.includes(a));
                if (!hasMatch) continue;
            }

            // Profession filter
            if (rule.when?.professionsAny) {
                const hasMatch = rule.when.professionsAny.some((p: string) => ctx.memberships.professions.includes(p));
                if (!hasMatch) continue;
            }

            // Event match
            let matchedEvent: SalveEvent | null = null;
            if (rule.when?.eventRef) {
                const resolvedId = this.registry.events.resolveId(rule.when.eventRef);
                matchedEvent = filteredEvents.find((e: SalveEvent) =>
                    e.id === resolvedId ||
                    e.id === rule.when!.eventRef! ||
                    (e.wikiDataId && e.wikiDataId === rule.when!.eventRef!)
                ) ?? null;
                if (!matchedEvent) continue; // Rule requires event that isn't active
            }

            // Audience Size Filter
            if (rule.when?.audienceSize !== undefined && ctx.interaction.audienceSize !== undefined) {
                if (!this.matchAudienceSize(rule.when.audienceSize, ctx.interaction.audienceSize)) {
                    continue;
                }
            }

            // ── Stage 5: Scoring ────────────────────────────────
            const ruleLocale = allRuleEntries.find(
                (re: { packId: string; precedence: number; rule: GreetingRule }) => re.rule === rule
            )!;
            const packInfo = this.registry.greetingRules.getPackInfo(ruleLocale.packId);
            const ruleLocaleStr = packInfo?.locale ?? ctx.localeChain[ctx.localeChain.length - 1];

            const tuple = computeScoreTuple(
                rule,
                entry.packId,
                entry.precedence,
                matchedEvent,
                ctx.localeChain,
                ruleLocaleStr
            );

            candidates.push({ packId: entry.packId, rule, event: matchedEvent, tuple });
            traceEntries.push({ ruleId: rule.id, tuple });
        }

        // Sort candidates: highest score first
        candidates.sort((a: ScoredCandidate, b: ScoredCandidate) => compareScoreTuples(b.tuple, a.tuple));

        // ── Handle no candidates ────────────────────────────────
        if (candidates.length === 0) {
            return {
                primary: {
                    text: "Hello",
                    act: "salutation",
                    ruleId: "fallback",
                },
                trace: {
                    candidates: traceEntries,
                    usedEvents,
                    normalizedContext: ctx,
                },
            };
        }

        // ── Stage 6: Winner selection ───────────────────────────
        const winner = candidates[0];

        // ── Stage 7: Style Rendering ────────────────────────────
        const renderedText = applyStyleTransform(
            winner.rule,
            ctx.interaction.style,
            ctx.env.outputLocale,
            this.stylePacks
        );

        // ── Stage 8: Composition & Output ───────────────────────
        let primaryText = renderedText;
        if (ctx.policy.showEmojis) {
            const emojis = Array.from(new Set(filteredEvents.map(e => e.emoji).filter(Boolean)));
            if (emojis.length > 0) {
                primaryText = `${emojis.join("")} ${primaryText}`;
            }
        }

        const primary: SalvePrimaryOutput = {
            text: primaryText,
            act: winner.rule.act,
            eventId: winner.event?.id,
            ruleId: winner.rule.id,
        };

        // Collect affinity extras (only if policy allows)
        const extras: SalveExtra[] = [];
        if (ctx.policy.allowExtras) {
            for (const cand of candidates.slice(1)) {
                if (cand.event?.kind === "affinity") {
                    extras.push({
                        text: cand.rule.template,
                        eventId: cand.event.id,
                        ruleId: cand.rule.id,
                        kind: "affinity",
                    });
                }
            }
        }

        // ── Stage 6b: Address Resolution (v1) ───────────────────
        const audience = this.buildAudienceFromContext(ctx);
        let resolvedAddress: ResolvedAddress | undefined;
        let postalAddress: ResolvedAddress | undefined;
        let letterheadAddress: ResolvedAddress | undefined;

        if (audience) {
            const baseAddrCtx: AddressResolveContext = {
                locale: ctx.env.locale,
                formality: ctx.interaction.formality,
                relationship: ctx.interaction.relationship,
                addressMode: "direct",
                outputForm: "salutation",
                allowSubcultureAddressing: ctx.policy.allowSubcultureAddressing,
                subcultures: ctx.memberships.subcultures,
            };

            resolvedAddress = this.addressEngine.resolve(audience, baseAddrCtx);

            postalAddress = this.addressEngine.resolve(audience, {
                ...baseAddrCtx,
                outputForm: "postal",
            });

            letterheadAddress = this.addressEngine.resolve(audience, {
                ...baseAddrCtx,
                outputForm: "letterhead",
            });
        }

        // ── Compose full salutation ─────────────────────────────
        let fullSalutationText: string | undefined;
        if (resolvedAddress?.text) {
            const composed = this.compositionEngine.compose(
                { greeting: primaryText, address: resolvedAddress.text },
                ctx.env.locale,
            );
            fullSalutationText = composed.text;
        }

        const result: SalveOutputV1WithAddress = {
            primary,
            extras: extras.length > 0 ? extras : undefined,
            activeEvents: finalActiveEvents,
            address: resolvedAddress,
            postalAddressText: postalAddress?.text || undefined,
            letterheadAddressText: letterheadAddress?.text || undefined,
            fullSalutationText,
            trace: {
                candidates: traceEntries,
                usedEvents,
                normalizedContext: ctx,
            },
        };

        return result;
    }

    /**
     * Build an AddressAudience from normalized context person data.
     */
    private buildAudienceFromContext(ctx: NormalizedContext): AddressAudience | null {
        if (!ctx.person) return null;

        const recipient: AddressRecipient = {
            givenNames: ctx.person.givenNames,
            surname: ctx.person.surname,
            preferredName: ctx.person.preferredName,
            gender: ctx.person.gender as any,
            genderSource: ctx.person.genderSource,
            titles: ctx.person.titles?.map(t => ({
                system: t.system,
                code: t.code,
                display: t.code,
            })),
        };

        const audienceSize = ctx.interaction.audienceSize;
        let kind: import("./types").AudienceKind = "single";
        if (audienceSize && audienceSize > 1) {
            kind = audienceSize === 2 ? "pair" : "group";
        }

        return {
            kind,
            recipients: [recipient],
        };
    }

    /**
     * Map legacy EventDomain to EventDomainV1
     */
    private mapLegacyDomain(domain: string): EventDomainV1 {
        const map: Record<string, EventDomainV1> = {
            personal: "personal",
            religious: "religious",
            civil: "civil",
            cultural_baseline: "cultural_baseline",
            temporal: "temporal",
            official: "official",
            observance: "observance",
            bank: "bank",
            seasonal: "seasonal",
        };
        return map[domain] ?? "cultural_baseline";
    }

    // ───── Legacy private methods (unchanged) ─────────────────────

    private selectGreeting(
        pack: GreetingPack,
        event: CelebrationEvent | null,
        context: GreetingContext,
        trace: string[]
    ): GreetingLexiconEntry {
        // Resolve timeOfDay from context.now
        const hour = context.now.getHours();
        let currentPeriod: string;
        if (hour >= 5 && hour < 12) currentPeriod = "morning";
        else if (hour >= 12 && hour < 14) currentPeriod = "midday";
        else if (hour >= 14 && hour < 18) currentPeriod = "afternoon";
        else if (hour >= 18 && hour < 22) currentPeriod = "evening";
        else currentPeriod = "night";

        // Filter lexicon by event, phase, role, formality, etc.
        const candidates = pack.greetings.filter(g => {
            const eventMatch = event ? g.eventRef === event.id : !g.eventRef;

            let phaseMatch = true;
            if (g.phase) {
                const phases = Array.isArray(g.phase) ? g.phase : [g.phase];
                phaseMatch = context.phase ? phases.includes(context.phase) : true;
            }

            const roleMatch = !g.role || g.role === context.role;
            const formalityMatch = !g.formality || g.formality === context.formality;

            let relationshipMatch = true;
            if (g.relationship) {
                const rels = Array.isArray(g.relationship) ? g.relationship : [g.relationship];
                relationshipMatch = context.relationship ? rels.includes(context.relationship) : true;
            }

            let settingMatch = true;
            if (g.setting) {
                const settings = Array.isArray(g.setting) ? g.setting : [g.setting];
                settingMatch = context.setting ? settings.includes(context.setting) : true;
            }

            let timeMatch = true;
            if (g.timeOfDay) {
                const times = Array.isArray(g.timeOfDay) ? g.timeOfDay : [g.timeOfDay];
                timeMatch = times.includes(currentPeriod as any);
            }

            let audienceMatch = true;
            if (g.audienceSize !== undefined && (context as any).audienceSize !== undefined) {
                audienceMatch = this.matchAudienceSize(g.audienceSize, (context as any).audienceSize);
            }

            let professionMatch = true;
            if (g.professions && context.profile?.professionalRole) {
                professionMatch = g.professions.includes(context.profile.professionalRole.toLowerCase());
            } else if (g.professions) {
                professionMatch = false; // Rule requires profession but none provided
            }

            // Anti-repetition check
            const isRemembered = this.memory?.has(`g:${pack.locale}:${g.id}`) ?? false;

            return eventMatch && phaseMatch && roleMatch && formalityMatch && relationshipMatch && settingMatch && timeMatch && audienceMatch && !isRemembered;
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
                category: event?.category ?? event?.domain ?? "cultural_baseline",
                domain: (event?.domain ?? event?.category ?? "cultural_baseline") as any,
                locale: context.locale,
                score: 0,
                trace: trace
            }
        };
    }

    /**
     * Evaluates whether a given audience size satisfies an audienceSize constraint string.
     * Supports exact integers (1), exact strings ("1"), minimums (">=1"), and strictly greater (">1").
     */
    private matchAudienceSize(constraint: string | number, actual: number): boolean {
        if (typeof constraint === "number") {
            return actual === constraint;
        }

        const str = constraint.trim();
        if (str.startsWith(">=")) {
            const val = parseInt(str.substring(2).trim(), 10);
            return !isNaN(val) && actual >= val;
        } else if (str.startsWith(">")) {
            const val = parseInt(str.substring(1).trim(), 10);
            return !isNaN(val) && actual > val;
        } else if (str.startsWith("<=")) {
            const val = parseInt(str.substring(2).trim(), 10);
            return !isNaN(val) && actual <= val;
        } else if (str.startsWith("<")) {
            const val = parseInt(str.substring(1).trim(), 10);
            return !isNaN(val) && actual < val;
        } else {
            // exact match fallback
            const val = parseInt(str, 10);
            return !isNaN(val) && actual === val;
        }
    }
}

