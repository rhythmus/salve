import { bulgarianSaints, getBulgarianNameDayEntries } from "../src";

// Mock bg-name-days to avoid ESM issues in Jest
jest.mock("bg-name-days", () => ({
    getAllNameDays: jest.fn(() => [
        {
            name: "Иван",
            month: 1,
            day: 7,
            holiday: "Ивановден",
            holidayLatin: "Ivanovden",
            tradition: "orthodox",
            variants: ["Иванκα"],
            isMoveable: false
        }
    ])
}));

describe("Bulgarian Name-Day Pack (Mocked)", () => {
    test("should have saint definitions with QIDs", () => {
        const john = bulgarianSaints.find(s => s.qid === "Q43474");
        expect(john).toBeDefined();
        expect(john?.canonicalName).toBe("John the Baptist");
    });

    test("should generate entries from bg-name-days", () => {
        const entries = getBulgarianNameDayEntries(2024);
        expect(entries.length).toBeGreaterThan(0);

        // Ivanovden is Jan 7
        const jan7 = entries.find(e => e.month === 1 && e.day === 7);
        expect(jan7).toBeDefined();
        expect(jan7?.saintQids).toContain("Q43474");
    });
});
