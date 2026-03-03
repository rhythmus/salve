import { PaschaCalendarPlugin } from "../src";
import { GreetingContext } from "@salve/core";

describe("PaschaCalendarPlugin", () => {
    let plugin: PaschaCalendarPlugin;
    const mockContext = {} as GreetingContext;

    beforeEach(() => {
        plugin = new PaschaCalendarPlugin();
    });

    test("should resolve Western Easter 2026 (April 5th)", () => {
        const easter26 = new Date(2026, 3, 5);
        const events = plugin.resolveEvents(easter26, mockContext);
        expect(events.some(e => e.id === "easter")).toBe(true);
    });

    test("should resolve Western Good Friday 2026 (April 3rd)", () => {
        const friday26 = new Date(2026, 3, 3);
        const events = plugin.resolveEvents(friday26, mockContext);
        expect(events.some(e => e.id === "good-friday")).toBe(true);
    });

    test("should resolve Orthodox Easter 2026 (April 12th)", () => {
        const orthodox26 = new Date(2026, 3, 12);
        const events = plugin.resolveEvents(orthodox26, mockContext);
        expect(events.some(e => e.id === "orthodox-easter")).toBe(true);
    });
});
