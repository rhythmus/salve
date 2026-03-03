import { SpecialtyCalendarPlugin } from "../src";
import { GreetingContext } from "@salve/core";

describe("SpecialtyCalendarPlugin", () => {
    let plugin: SpecialtyCalendarPlugin;

    beforeEach(() => {
        plugin = new SpecialtyCalendarPlugin();
    });

    test("should resolve Spring Start (March 20th)", () => {
        const march20 = new Date(2026, 2, 20);
        const events = plugin.resolveEvents(march20, {} as GreetingContext);
        expect(events.some(e => e.id === "spring-start")).toBe(true);
    });

    test("should resolve Personal Birthday from context metadata", () => {
        const today = new Date(2026, 5, 15);
        const context = {
            now: today,
            locale: "en-US",
            metadata: { birthday: "1990-06-15" }
        } as any;

        const events = plugin.resolveEvents(today, context);
        expect(events.some(e => e.id === "birthday")).toBe(true);
        expect(events.find(e => e.id === "birthday")?.domain).toBe("personal");
    });

    test("should resolve Full Moon approximation", () => {
        // Approx full moon date (calculated from epoch in code)
        const fullMoon = new Date(2026, 0, 3, 12, 0);
        const events = plugin.resolveEvents(fullMoon, {} as GreetingContext);
        expect(events.some(e => e.id === "full-moon")).toBe(true);
    });
});
