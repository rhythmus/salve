/**
 * SALVE Deterministic Scoring & Priority Logic
 */

import { CelebrationEvent, EventDomainV1, ScoreTuple, GreetingRule, NormalizedContext, SalveEvent } from "./types";

/**
 * Domain-based base weights.
 * Higher number = Higher Priority.
 *
 * Hierarchy: Personal > Religious > Civil > Cultural Baseline > Temporal
 */
export const DOMAIN_WEIGHTS: Record<string, number> = {
    personal: 1000,
    religious: 500,
    civil: 300,
    official: 400,
    observance: 200,
    cultural_baseline: 100,
    temporal: 50,
};

/**
 * Calculate the score for a specific event based on its domain and
 * optional custom priority overrides.
 */
export function calculateEventScore(event: CelebrationEvent): number {
    const domainKey = event.domain ?? event.category ?? "";
    const baseWeight = DOMAIN_WEIGHTS[domainKey] ?? 0;
    const priorityBonus = event.priority ?? 0;

    return baseWeight + priorityBonus;
}

/**
 * Validates if an affiliation matches the required tradition
 */
export function isAffiliated(event: CelebrationEvent, userAffiliations: string[]): boolean {
    if (!event.tradition) return true;
    return userAffiliations.includes(event.tradition);
}

// ═══════════════════════════════════════════════════════════════════
// Milestone 9 — Deterministic Score Tuple System (v1)
// ═══════════════════════════════════════════════════════════════════

/**
 * Expanded domain rank for the v1 event taxonomy.
 * Higher number = higher priority.
 */
export const DOMAIN_RANK_V1: Record<string, number> = {
    protocol: 9000,
    religious: 8000,
    personal: 7000,
    bank: 6500,
    civil: 6000,
    official: 6000,
    seasonal: 5000,
    observance: 3000,
    affinity: 2000,
    temporal: 1000,
    cultural_baseline: 500,
    custom: 400,
};

/**
 * Compute a deterministic ScoreTuple for a greeting rule
 * given the current context and matched event.
 */
export function computeScoreTuple(
    rule: GreetingRule,
    packId: string,
    packPrecedence: number,
    event: SalveEvent | null,
    localeChain: string[],
    ruleLocale: string
): ScoreTuple {
    const domainKey = event?.kind ?? event?.category ?? "";
    const domainRank = event ? (DOMAIN_RANK_V1[domainKey] ?? 0) : 0;

    // Event rank from event precedence
    const eventRank = event?.precedence ?? 0;

    // Locale match: exact = 10, base = 5, root = 1
    let localeMatchScore = 0;
    const localeIndex = localeChain.indexOf(ruleLocale);
    if (localeIndex === 0) {
        localeMatchScore = 10; // exact match
    } else if (localeIndex > 0 && ruleLocale !== "root") {
        localeMatchScore = 5; // base match
    } else if (ruleLocale === "root") {
        localeMatchScore = 1;
    }

    // Stable tie-break: lexicographic packId + ruleId
    const stableTieBreak = `${packId}::${rule.id}`;

    return {
        domainRank,
        eventRank,
        packPrecedence,
        rulePriority: rule.priority,
        localeMatchScore,
        stableTieBreak,
    };
}

/**
 * Lexicographic comparison of two ScoreTuples.
 * Returns negative if a < b, positive if a > b, zero if equal.
 * Higher-scoring tuple wins (a > b means a is preferred).
 */
export function compareScoreTuples(a: ScoreTuple, b: ScoreTuple): number {
    // Compare each field in priority order (highest priority first)
    if (a.domainRank !== b.domainRank) return a.domainRank - b.domainRank;
    if (a.eventRank !== b.eventRank) return a.eventRank - b.eventRank;
    if (a.packPrecedence !== b.packPrecedence) return a.packPrecedence - b.packPrecedence;
    if (a.rulePriority !== b.rulePriority) return a.rulePriority - b.rulePriority;
    if (a.localeMatchScore !== b.localeMatchScore) return a.localeMatchScore - b.localeMatchScore;

    const aTie = a.stableTieBreak ?? "";
    const bTie = b.stableTieBreak ?? "";
    return aTie < bTie ? 1 : aTie > bTie ? -1 : 0;
}

