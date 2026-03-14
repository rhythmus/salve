import { greekSaints, getGreekNameDayEntries, getGreekMovableEntries, saints, fixedEntries, movableEntries } from "../src";

describe("Greek Name-Day Pack", () => {
    test("should have saint definitions with QIDs", () => {
        const george = greekSaints.find(s => s.qid === "Q43431");
        expect(george).toBeDefined();
        expect(george?.canonicalName).toBe("George");
    });

    test("should generate entries from JSON data", () => {
        const entries = getGreekNameDayEntries();
        expect(entries.length).toBeGreaterThan(0);

        const jan1 = entries.find(e => e.month === 1 && e.day === 1);
        expect(jan1).toBeDefined();
        expect(jan1?.saintQids).toContain("Q43425");

        const dec6 = entries.find(e => e.month === 12 && e.day === 6);
        expect(dec6).toBeDefined();
        expect(dec6?.saintQids).toContain("Q43107");
    });

    test("generated saints should have the expected count", () => {
        expect(saints.length).toBe(13);
    });

    test("every fixed calendar entry should reference a known saint", () => {
        const knownQids = new Set(saints.map(s => s.qid));
        for (const entry of fixedEntries) {
            for (const qid of entry.saintQids) {
                expect(knownQids.has(qid)).toBe(true);
            }
        }
    });

    test("generated saints should carry richer alias sets from recurring data", () => {
        const basil = saints.find(s => s.qid === "Q43425");
        expect(basil).toBeDefined();
        expect(basil!.aliases.length).toBeGreaterThan(5);
        expect(basil!.aliases).toContain("Βασίλειος");
        expect(basil!.aliases).toContain("Βασιλική");
    });

    test("movable entries should include Pascha-relative data", () => {
        const entries = getGreekMovableEntries();
        expect(entries.length).toBeGreaterThan(0);

        const pascha = entries.find(e => e.offset === 0);
        expect(pascha).toBeDefined();
        expect(pascha!.names).toContain("Αναστάσιος");
        expect(pascha!.names).toContain("Πασχάλης");
    });

    test("movable entries should all be relative to pascha", () => {
        for (const entry of movableEntries) {
            expect(entry.relativeTo).toBe("pascha");
        }
    });

    test("legacy exports should match generated data", () => {
        expect(greekSaints).toBe(saints);
        expect(getGreekNameDayEntries()).toBe(fixedEntries);
    });
});
