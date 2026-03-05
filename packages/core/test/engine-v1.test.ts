import { SalveEngine } from "../src/engine";
import { SalveContextV1, GreetingRule, CalendarPlugin, CelebrationEvent } from "../src/types";
import { SalveRegistry } from "@salve/registry";

describe("SalveEngine.resolveV1", () => {
    let engine: SalveEngine;

    const mockPlugin: CalendarPlugin = {
        id: "test-gregorian",
        resolveEvents: (now: Date) => {
            const events: CelebrationEvent[] = [{ id: "default-day", domain: "temporal" }];
            if (now.getMonth() === 11 && now.getDate() === 25) {
                events.push({ id: "salve.event.religious.christian.christmas", domain: "religious", tradition: "christian" });
            }
            return events;
        },
    };

    const neutralMorningRule: GreetingRule = {
        id: "morning-greeting",
        act: "salutation",
        form: "salutation",
        style: "neutral",
        priority: 10,
        template: "Good morning",
        when: { dayPeriod: "morning", phase: "opening" },
    };

    const neutralFallbackRule: GreetingRule = {
        id: "baseline-hello",
        act: "salutation",
        form: "salutation",
        style: "neutral",
        priority: 1,
        template: "Hello",
    };

    const christmasRule: GreetingRule = {
        id: "christmas-greeting",
        act: "congratulation",
        form: "salutation",
        style: "neutral",
        priority: 15,
        template: "Merry Christmas",
        when: { eventRef: "salve.event.religious.christian.christmas", affiliationsAny: ["christian"] },
    };

    const ceremonialChristmasRule: GreetingRule = {
        id: "christmas-greeting-ceremonial",
        act: "congratulation",
        form: "salutation",
        style: "ceremonial",
        priority: 15,
        template: "A most blessed Christmas to you",
        when: { eventRef: "salve.event.religious.christian.christmas", affiliationsAny: ["christian"] },
    };

    beforeEach(() => {
        const registry = new SalveRegistry();
        engine = new SalveEngine({ registry });
        engine.registerPlugin(mockPlugin);
        engine.registerGreetingRules("pack-en", "en", [
            neutralMorningRule,
            neutralFallbackRule,
            christmasRule,
            ceremonialChristmasRule,
        ], 10);
    });

    test("should produce structured SalveOutputV1", async () => {
        const input: SalveContextV1 = {
            env: { now: new Date("2026-06-15T08:00:00Z"), locale: "en", timeZone: "UTC" },
            interaction: { phase: "opening" },
        };

        const result = await engine.resolveV1(input);

        expect(result.primary).toBeDefined();
        expect(result.primary.text).toBe("Good morning");
        expect(result.primary.act).toBe("salutation");
        expect(result.primary.ruleId).toBe("morning-greeting");
        expect(result.trace).toBeDefined();
    });

    test("should fall back to baseline when no day period matches", async () => {
        const input: SalveContextV1 = {
            env: { now: new Date("2026-06-15T15:00:00Z"), locale: "en", timeZone: "UTC" },
            interaction: { phase: "opening" },
        };

        const result = await engine.resolveV1(input);

        expect(result.primary.text).toBe("Hello");
        expect(result.primary.ruleId).toBe("baseline-hello");
    });

    test("should produce emergency fallback when no rules registered for locale", async () => {
        const emptyEngine = new SalveEngine({ registry: new SalveRegistry() });

        const result = await emptyEngine.resolveV1({
            env: { now: new Date(), locale: "xx-XX" },
        });

        expect(result.primary.text).toBe("Hello");
        expect(result.primary.ruleId).toBe("fallback");
    });

    test("Christmas greeting requires christian tradition", async () => {
        const input: SalveContextV1 = {
            env: { now: new Date("2026-12-25T10:00:00Z"), locale: "en" },
            memberships: { traditions: ["christian"] },
            policy: { allowDomains: ["bank", "civil", "personal", "temporal", "cultural_baseline", "seasonal", "religious"] },
        };

        const result = await engine.resolveV1(input);

        expect(result.primary.text).toBe("Merry Christmas");
        expect(result.primary.act).toBe("congratulation");
    });

    test("religious events are blocked without explicit traditions in safe mode", async () => {
        const input: SalveContextV1 = {
            env: { now: new Date("2026-12-25T10:00:00Z"), locale: "en" },
            // No memberships — religious events should be filtered out by default policy
        };

        const result = await engine.resolveV1(input);

        // Should NOT be "Merry Christmas" — should fall back
        expect(result.primary.text).not.toBe("Merry Christmas");
    });

    test("trace includes candidate information", async () => {
        const input: SalveContextV1 = {
            env: { now: new Date("2026-06-15T08:00:00Z"), locale: "en" },
            interaction: { phase: "opening" },
        };

        const result = await engine.resolveV1(input);

        expect(result.trace?.candidates).toBeDefined();
        expect(result.trace!.candidates.length).toBeGreaterThan(0);
    });
});
