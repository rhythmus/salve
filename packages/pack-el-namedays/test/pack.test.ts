import { greekSaints, getGreekNameDayEntries } from "../src";

describe("Greek Name-Day Pack", () => {
    test("should have saint definitions with QIDs", () => {
        const george = greekSaints.find(s => s.qid === "Q43431");
        expect(george).toBeDefined();
        expect(george?.canonicalName).toBe("George");
    });

    test("should generate entries from JSON data", () => {
        const entries = getGreekNameDayEntries();
        expect(entries.length).toBeGreaterThan(0);

        // St. Basil is Jan 1
        const jan1 = entries.find(e => e.month === 1 && e.day === 1);
        expect(jan1).toBeDefined();
        expect(jan1?.saintQids).toContain("Q43425");

        // St. Nicholas is Dec 6
        const dec6 = entries.find(e => e.month === 12 && e.day === 6);
        expect(dec6).toBeDefined();
        expect(dec6?.saintQids).toContain("Q43107");
    });
});
