import { getStyleFallbackChain, applyStyleTransform, computeStyleMatchScore, StylePack } from "../src/style";
import { GreetingRule } from "../src/types";

describe("Style Engine", () => {
    describe("getStyleFallbackChain", () => {
        test("ceremonial → formal → neutral", () => {
            expect(getStyleFallbackChain("ceremonial")).toEqual(["ceremonial", "formal", "neutral"]);
        });

        test("bureaucratic → formal → neutral", () => {
            expect(getStyleFallbackChain("bureaucratic")).toEqual(["bureaucratic", "formal", "neutral"]);
        });

        test("playful → neutral", () => {
            expect(getStyleFallbackChain("playful")).toEqual(["playful", "neutral"]);
        });

        test("neutral stays as just neutral", () => {
            expect(getStyleFallbackChain("neutral")).toEqual(["neutral"]);
        });

        test("liturgical → neutral", () => {
            expect(getStyleFallbackChain("liturgical")).toEqual(["liturgical", "neutral"]);
        });
    });

    describe("applyStyleTransform", () => {
        const baseRule: GreetingRule = {
            id: "good-morning",
            act: "salutation",
            form: "salutation",
            style: "neutral",
            priority: 10,
            template: "Good morning",
        };

        test("returns base template when style matches", () => {
            const result = applyStyleTransform(baseRule, "neutral", "en");
            expect(result).toBe("Good morning");
        });

        test("returns style pack template when available", () => {
            const stylePacks: StylePack[] = [{
                style: "formal",
                rules: [{ base: "good-morning", locale: "en", template: "A very good morning to you" }],
            }];

            const result = applyStyleTransform(baseRule, "formal", "en", stylePacks);
            expect(result).toBe("A very good morning to you");
        });

        test("walks fallback chain to find transform", () => {
            const stylePacks: StylePack[] = [{
                style: "formal",
                rules: [{ base: "good-morning", locale: "en", template: "Good morning (formal)" }],
            }];

            // Request ceremonial → falls through to formal
            const result = applyStyleTransform(baseRule, "ceremonial", "en", stylePacks);
            expect(result).toBe("Good morning (formal)");
        });

        test("returns original template when no transform found", () => {
            const result = applyStyleTransform(baseRule, "archaic", "en", []);
            expect(result).toBe("Good morning");
        });
    });

    describe("computeStyleMatchScore", () => {
        test("exact match scores 15", () => {
            expect(computeStyleMatchScore("formal", "formal")).toBe(15);
        });

        test("family match scores 5", () => {
            expect(computeStyleMatchScore("formal", "ceremonial")).toBe(5);
        });

        test("no match scores 0", () => {
            expect(computeStyleMatchScore("playful", "liturgical")).toBe(0);
        });
    });
});
