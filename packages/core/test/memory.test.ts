/**
 * SALVE Engine Memory Unit Tests
 */

import { SalveEngine } from "../src/engine";
import { InMemoryMemory } from "../src/memory";
import {
    GreetingContext,
    GreetingPack,
    CalendarPlugin
} from "../src/types";

describe("SalveEngine Anti-Repetition", () => {
    let engine: SalveEngine;
    let memory: InMemoryMemory;

    const mockPlugin: CalendarPlugin = {
        id: "test-plugin",
        resolveEvents: () => [{ id: "morning", domain: "temporal" }]
    };

    const mockPack: GreetingPack = {
        locale: "de-DE",
        greetings: [
            { id: "hi-1", text: "Guten Morgen", eventRef: "morning" },
            { id: "hi-2", text: "Moin", eventRef: "morning" },
            { id: "fallback", text: "Hallo" }
        ]
    };

    beforeEach(() => {
        memory = new InMemoryMemory();
        engine = new SalveEngine({ memory });
        engine.registerPlugin(mockPlugin);
        engine.registerPack(mockPack);
    });

    test("should rotate through available greetings and avoid repetition", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "de-DE"
        };

        // First call -> hi-1
        const res1 = engine.resolve(context);
        expect(res1.greeting).toBe("Guten Morgen");

        // Second call -> hi-2 (since hi-1 is in memory)
        const res2 = engine.resolve(context);
        expect(res2.greeting).toBe("Moin");

        // Third call -> fallback (since both morning greetings are used)
        const res3 = engine.resolve(context);
        expect(res3.greeting).toBe("Hallo");
    });

    test("should recover greeting after memory is cleared", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "de-DE"
        };

        engine.resolve(context);
        memory.clear();

        const res2 = engine.resolve(context);
        expect(res2.greeting).toBe("Guten Morgen");
    });
});
