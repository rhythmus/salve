import { NameDayResolver } from "../src";
import { GreetingContext, SaintDefinition, NameDayEntry } from "@salve/types";

describe("NameDayResolver", () => {
    let resolver: NameDayResolver;

    const stNicholas: SaintDefinition = {
        qid: "Q43107",
        canonicalName: "Nicholas",
        traditions: ["catholic", "orthodox"],
        aliases: ["Nicholas", "Nikolaos", "Νικόλαος", "Niko", "Klaus"]
    };

    const stGeorge: SaintDefinition = {
        qid: "Q43431",
        canonicalName: "George",
        traditions: ["orthodox"],
        aliases: ["George", "Georgios", "Γιώργος"]
    };

    beforeEach(() => {
        resolver = new NameDayResolver();
        resolver.registerSaints([stNicholas, stGeorge]);

        const entries: NameDayEntry[] = [
            { month: 12, day: 6, saintQids: ["Q43107"] },
            { month: 4, day: 23, saintQids: ["Q43431"] }
        ];
        resolver.registerNameDays(entries);
    });

    test("should resolve name-day for exact match", () => {
        const now = new Date(2024, 11, 6); // Dec 6
        const context: GreetingContext = {
            now,
            locale: "en-US",
            profile: { firstName: "Nicholas" }
        };

        const events = resolver.resolveEvents(now, context);
        expect(events.length).toBe(1);
        expect(events[0].id).toBe("nameday.Q43107");
        expect(events[0].domain).toBe("personal");
    });

    test("should resolve name-day for alias match", () => {
        const now = new Date(2024, 11, 6); // Dec 6
        const context: GreetingContext = {
            now,
            locale: "en-US",
            profile: { firstName: "Niko" }
        };

        const events = resolver.resolveEvents(now, context);
        expect(events.length).toBe(1);
        expect(events[0].id).toBe("nameday.Q43107");
    });

    test("should resolve name-day for Greek alias", () => {
        const now = new Date(2024, 3, 23); // April 23
        const context: GreetingContext = {
            now,
            locale: "el-GR",
            profile: { firstName: "Γιώργος" }
        };

        const events = resolver.resolveEvents(now, context);
        expect(events.length).toBe(1);
        expect(events[0].id).toBe("nameday.Q43431");
    });

    test("should handle fuzzy matching (diacritics and case)", () => {
        const now = new Date(2024, 11, 6); // Dec 6
        const context: GreetingContext = {
            now,
            locale: "de-DE",
            profile: { firstName: "nikolaos" } // Lowercase
        };

        const events = resolver.resolveEvents(now, context);
        expect(events.length).toBe(1);
    });

    test("should not resolve if name does not match", () => {
        const now = new Date(2024, 11, 6); // Dec 6
        const context: GreetingContext = {
            now,
            locale: "en-US",
            profile: { firstName: "Peter" }
        };

        const events = resolver.resolveEvents(now, context);
        expect(events.length).toBe(0);
    });

    test("should not resolve if date does not match", () => {
        const now = new Date(2024, 11, 7); // Dec 7
        const context: GreetingContext = {
            now,
            locale: "en-US",
            profile: { firstName: "Nicholas" }
        };

        const events = resolver.resolveEvents(now, context);
        expect(events.length).toBe(0);
    });
});
