/**
 * SALVE Deterministic Scoring & Priority Logic
 */

import { EventDomain, CelebrationEvent } from "./types";

/**
 * Domain-based base weights.
 * Higher number = Higher Priority.
 * 
 * Hierarchy: Personal > Religious > Civil > Cultural Baseline > Temporal
 */
export const DOMAIN_WEIGHTS: Record<EventDomain, number> = {
    personal: 1000,
    religious: 500,
    civil: 300,
    cultural_baseline: 100,
    temporal: 50,
};

/**
 * Calculate the score for a specific event based on its domain and 
 * optional custom priority overrides.
 */
export function calculateEventScore(event: CelebrationEvent): number {
    const baseWeight = DOMAIN_WEIGHTS[event.domain] ?? 0;

    // Custom priority overrides are additive to the base weight
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
