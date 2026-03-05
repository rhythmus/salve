import { DOMAIN_RANK_V1, computeScoreTuple, compareScoreTuples } from "../src/scoring";
import { GreetingRule, SalveEvent, ScoreTuple } from "../src/types";

describe("ScoreTuple (v1 scoring)", () => {
    const makeRule = (id: string, priority: number = 10): GreetingRule => ({
        id,
        act: "salutation",
        form: "salutation",
        style: "neutral",
        priority,
        template: "Hello",
    });

    const makeEvent = (kind: string, precedence: number = 0): SalveEvent => ({
        id: `salve.event.${kind}.test`,
        kind: kind as any,
        start: "2026-01-01",
        end: "2026-01-01",
        precedence,
    });

    test("protocol events score higher than bank events", () => {
        expect(DOMAIN_RANK_V1.protocol).toBeGreaterThan(DOMAIN_RANK_V1.bank);
    });

    test("religious events score higher than civil events", () => {
        expect(DOMAIN_RANK_V1.religious).toBeGreaterThan(DOMAIN_RANK_V1.civil);
    });

    test("personal events score higher than bank events", () => {
        expect(DOMAIN_RANK_V1.personal).toBeGreaterThan(DOMAIN_RANK_V1.bank);
    });

    test("computeScoreTuple produces correct domainRank", () => {
        const rule = makeRule("test-rule");
        const event = makeEvent("religious");
        const localeChain = ["nl-BE", "nl", "root"];

        const tuple = computeScoreTuple(rule, "pack-a", 0, event, localeChain, "nl-BE");

        expect(tuple.domainRank).toBe(DOMAIN_RANK_V1.religious);
        expect(tuple.localeMatchScore).toBe(10); // exact match
    });

    test("base locale match scores 5", () => {
        const rule = makeRule("test-rule");
        const localeChain = ["nl-BE", "nl", "root"];

        const tuple = computeScoreTuple(rule, "pack-a", 0, null, localeChain, "nl");

        expect(tuple.localeMatchScore).toBe(5);
    });

    test("root locale match scores 1", () => {
        const rule = makeRule("test-rule");
        const localeChain = ["nl-BE", "nl", "root"];

        const tuple = computeScoreTuple(rule, "pack-a", 0, null, localeChain, "root");

        expect(tuple.localeMatchScore).toBe(1);
    });

    test("compareScoreTuples: higher domainRank wins", () => {
        const a: ScoreTuple = { domainRank: 8000, eventRank: 0, packPrecedence: 0, rulePriority: 10, localeMatchScore: 10, stableTieBreak: "a::1" };
        const b: ScoreTuple = { domainRank: 6000, eventRank: 0, packPrecedence: 0, rulePriority: 10, localeMatchScore: 10, stableTieBreak: "b::1" };

        expect(compareScoreTuples(a, b)).toBeGreaterThan(0); // a wins
    });

    test("compareScoreTuples: same domain, higher rulePriority wins", () => {
        const a: ScoreTuple = { domainRank: 8000, eventRank: 0, packPrecedence: 0, rulePriority: 20, localeMatchScore: 10, stableTieBreak: "a::1" };
        const b: ScoreTuple = { domainRank: 8000, eventRank: 0, packPrecedence: 0, rulePriority: 10, localeMatchScore: 10, stableTieBreak: "b::1" };

        expect(compareScoreTuples(a, b)).toBeGreaterThan(0);
    });

    test("compareScoreTuples is a total ordering (deterministic on tie)", () => {
        const a: ScoreTuple = { domainRank: 8000, eventRank: 0, packPrecedence: 0, rulePriority: 10, localeMatchScore: 10, stableTieBreak: "a::rule1" };
        const b: ScoreTuple = { domainRank: 8000, eventRank: 0, packPrecedence: 0, rulePriority: 10, localeMatchScore: 10, stableTieBreak: "b::rule1" };

        const cmp = compareScoreTuples(a, b);
        expect(cmp).not.toBe(0); // Must not be equal — tie broken by stableTieBreak
    });
});
