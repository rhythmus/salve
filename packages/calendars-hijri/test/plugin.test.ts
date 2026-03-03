import { HijriCalendarPlugin } from "../src";
import { GreetingContext } from "@salve/core";

describe("HijriCalendarPlugin", () => {
    let plugin: HijriCalendarPlugin;
    const mockContext = {} as GreetingContext;

    beforeEach(() => {
        plugin = new HijriCalendarPlugin();
    });

    test("should resolve Ramadan Start 2026 (Approx. March 20th)", () => {
        const ramadan26 = new Date(2026, 2, 20); // 1447-09-01 approx
        const events = plugin.resolveEvents(ramadan26, mockContext);
        expect(events.some(e => e.id === "ramadan-start")).toBe(true);
    });

    test("should resolve Eid al-Fitr 2026 (Approx. April 19th)", () => {
        const eidFitr26 = new Date(2026, 3, 19); // 1447-10-01 approx
        const events = plugin.resolveEvents(eidFitr26, mockContext);
        expect(events.some(e => e.id === "eid-al-fitr")).toBe(true);
    });
});
