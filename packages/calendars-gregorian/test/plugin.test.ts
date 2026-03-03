import { GregorianCalendarPlugin } from "../src";
import { GreetingContext } from "@salve/core";

describe("GregorianCalendarPlugin", () => {
    let plugin: GregorianCalendarPlugin;
    const mockContext = {} as GreetingContext;

    beforeEach(() => {
        plugin = new GregorianCalendarPlugin();
    });

    test("should resolve fixed dates (New Year)", () => {
        const jan1 = new Date(2026, 0, 1, 10, 0);
        const events = plugin.resolveEvents(jan1, mockContext);

        expect(events.some(e => e.id === "new-year-day")).toBe(true);
        expect(events.some(e => e.id === "morning")).toBe(true);
    });

    test("should resolve temporal slots (Night)", () => {
        const night = new Date(2026, 0, 1, 23, 0);
        const events = plugin.resolveEvents(night, mockContext);

        expect(events.some(e => e.id === "night")).toBe(true);
    });

    test("should resolve nth-weekday rules (Thanksgiving - 4th Thursday of Nov)", () => {
        plugin.addNthWeekday("thanksgiving", 11, 4, 4); // Nov, Thursday (4), 4th

        const thursNov26 = new Date(2026, 10, 26); // 2026-11-26 is a Thursday
        const events = plugin.resolveEvents(thursNov26, mockContext);

        expect(events.some(e => e.id === "thanksgiving")).toBe(true);
    });

    test("should resolve midday overlapping slots", () => {
        const noon = new Date(2026, 0, 1, 12, 0);
        const events = plugin.resolveEvents(noon, mockContext);

        expect(events.some(e => e.id === "midday")).toBe(true);
        expect(events.some(e => e.id === "afternoon")).toBe(true);
    });
});
