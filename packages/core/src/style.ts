/**
 * SALVE Style Engine
 *
 * Manages rhetorical style families, fallback chains,
 * and style-based greeting transformations.
 *
 * Key principle: style is NEVER inferred — always configured or defaults to "neutral".
 */

import { GreetingStyle, GreetingRule } from "./types";

// ── Style Family Tree ───────────────────────────────────────────

/**
 * Style inheritance / fallback map.
 * Each style maps to its parent style for graceful degradation.
 *
 * Tree:
 *   neutral
 *    ├─ formal
 *    │   ├─ ceremonial
 *    │   └─ bureaucratic
 *    ├─ playful
 *    ├─ poetic
 *    ├─ archaic
 *    ├─ liturgical
 *    └─ minimal
 */
const STYLE_PARENTS: Partial<Record<GreetingStyle, GreetingStyle>> = {
    ceremonial: "formal",
    bureaucratic: "formal",
    formal: "neutral",
    playful: "neutral",
    poetic: "neutral",
    archaic: "neutral",
    liturgical: "neutral",
    minimal: "neutral",
    // "neutral" has no parent — it is the root
};

/**
 * Compute the fallback chain for a given style.
 * E.g. "ceremonial" → ["ceremonial", "formal", "neutral"]
 */
export function getStyleFallbackChain(style: GreetingStyle): GreetingStyle[] {
    const chain: GreetingStyle[] = [style];
    let current = style;

    while (STYLE_PARENTS[current]) {
        current = STYLE_PARENTS[current]!;
        chain.push(current);
    }

    // Always end with neutral if not already there
    if (!chain.includes("neutral")) {
        chain.push("neutral");
    }

    return chain;
}

// ── Style Pack Transform ────────────────────────────────────────

/**
 * A style transformation rule from a pack.style plugin.
 */
export interface StyleTransformRule {
    /** Base greeting rule id to transform */
    base: string;
    /** Locale this transform applies to */
    locale: string;
    /** The styled template replacement */
    template: string;
}

/**
 * A style pack provides transformations for a specific style.
 */
export interface StylePack {
    style: GreetingStyle;
    rules: StyleTransformRule[];
}

/**
 * Apply a style transformation to a greeting rule.
 *
 * Strategy:
 * 1. If a style pack has a transform for the rule's id and locale, use it.
 * 2. If the rule itself already matches the requested style, use as-is.
 * 3. Otherwise, walk the fallback chain and try each style.
 * 4. Final fallback: return the rule template unchanged.
 */
export function applyStyleTransform(
    rule: GreetingRule,
    requestedStyle: GreetingStyle,
    locale: string,
    stylePacks: StylePack[] = []
): string {
    // Check if the rule itself already is in the requested style
    if (rule.style === requestedStyle) {
        return rule.template;
    }

    // Try style packs
    const fallbackChain = getStyleFallbackChain(requestedStyle);

    for (const style of fallbackChain) {
        // Look in style packs for a transform
        for (const pack of stylePacks) {
            if (pack.style === style) {
                const transform = pack.rules.find(
                    r => r.base === rule.id && r.locale === locale
                );
                if (transform) {
                    return transform.template;
                }
            }
        }
    }

    // No transform found — return original template
    return rule.template;
}

/**
 * Score bonus for style matching in the precedence model.
 *
 * +15 if rule supports the exact requested style.
 * +5  if rule supports a style in the same family.
 *  0  otherwise.
 */
export function computeStyleMatchScore(
    ruleStyle: GreetingStyle,
    requestedStyle: GreetingStyle
): number {
    if (ruleStyle === requestedStyle) return 15;

    const chain = getStyleFallbackChain(requestedStyle);
    if (chain.includes(ruleStyle)) return 5;

    return 0;
}
