import { normalizeContext } from "../src/normalize";
import { SalveContextV1 } from "../src/types";

describe("normalizeContext (SCNA)", () => {
    const baseInput: SalveContextV1 = {
        env: { now: new Date("2026-06-15T09:30:00Z"), locale: "nl" },
    };

    test("minimal input should produce a fully populated NormalizedContext", () => {
        const ctx = normalizeContext(baseInput);

        expect(ctx.env.locale).toBe("nl");
        expect(ctx.env.region).toBe("NL");
        expect(ctx.env.outputLocale).toBe("nl");
        expect(ctx.env.timeZone).toBe("Europe/Amsterdam");
        expect(ctx.env.dayPeriod).toBeDefined();
        expect(ctx.localeChain).toEqual(["nl", "root"]);
    });

    test("region derivation from full BCP-47 locale", () => {
        const ctx = normalizeContext({
            env: { now: new Date(), locale: "nl-BE" },
        });
        expect(ctx.env.region).toBe("BE");
        expect(ctx.localeChain).toEqual(["nl-BE", "nl", "root"]);
    });

    test("region derivation from language-only locale", () => {
        const ctx = normalizeContext({
            env: { now: new Date(), locale: "el" },
        });
        expect(ctx.env.region).toBe("GR");
    });

    test("memberships and affinities default to empty arrays", () => {
        const ctx = normalizeContext(baseInput);

        expect(ctx.memberships.traditions).toEqual([]);
        expect(ctx.memberships.subcultures).toEqual([]);
        expect(ctx.affinities.locales).toEqual([]);
        expect(ctx.affinities.tags).toEqual([]);
    });

    test("memberships are lowercased", () => {
        const ctx = normalizeContext({
            ...baseInput,
            memberships: { traditions: ["Orthodox", "CATHOLIC"] },
        });

        expect(ctx.memberships.traditions).toEqual(["orthodox", "catholic"]);
    });

    test("person name trimming", () => {
        const ctx = normalizeContext({
            ...baseInput,
            person: {
                givenNames: ["  Wouter  ", ""],
                surname: "  Soudan ",
            },
        });

        expect(ctx.person?.givenNames).toEqual(["Wouter"]);
        expect(ctx.person?.surname).toBe("Soudan");
        expect(ctx.person?.preferredName).toBe("Wouter");
    });

    test("null person stays null", () => {
        const ctx = normalizeContext(baseInput);
        expect(ctx.person).toBeNull();
    });

    test("interaction defaults to opening/ui/initiator/stranger/neutral", () => {
        const ctx = normalizeContext(baseInput);

        expect(ctx.interaction.phase).toBe("opening");
        expect(ctx.interaction.setting).toBe("ui");
        expect(ctx.interaction.role).toBe("initiator");
        expect(ctx.interaction.relationship).toBe("stranger");
        expect(ctx.interaction.formality).toBe("neutral");
        expect(ctx.interaction.style).toBe("neutral");
    });

    test("explicit interaction values override defaults", () => {
        const ctx = normalizeContext({
            ...baseInput,
            interaction: { phase: "closing", formality: "formal", style: "ceremonial" },
        });

        expect(ctx.interaction.phase).toBe("closing");
        expect(ctx.interaction.formality).toBe("formal");
        expect(ctx.interaction.style).toBe("ceremonial");
        // Others still default
        expect(ctx.interaction.setting).toBe("ui");
    });

    test("policy defaults are safe", () => {
        const ctx = normalizeContext(baseInput);

        expect(ctx.policy.requireExplicitTraditionsForReligious).toBe(true);
        expect(ctx.policy.allowGenderInference).toBe(false);
        expect(ctx.policy.allowExtras).toBe(false);
        expect(ctx.policy.allowSubcultureAddressing).toBe(false);
    });

    test("output locale defaults to input locale", () => {
        const ctx = normalizeContext(baseInput);
        expect(ctx.env.outputLocale).toBe(ctx.env.locale);
    });

    test("explicit output locale is respected", () => {
        const ctx = normalizeContext({
            env: { now: new Date(), locale: "nl-BE", outputLocale: "fr-BE" },
        });
        expect(ctx.env.outputLocale).toBe("fr-BE");
    });
});
