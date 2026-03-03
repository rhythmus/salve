/**
 * SALVE Engine Unit Tests
 */

import { SalveEngine } from "../src/engine";
import {
    GreetingContext,
    CelebrationEvent,
    GreetingPack,
    CalendarPlugin
} from "../src/types";

describe("SalveEngine", () => {
    let engine: SalveEngine;

    const mockPlugin: CalendarPlugin = {
        id: "test-plugin",
        resolveEvents: (now: Date) => {
            // Mocking a religious event for a specific date
            if (now.getMonth() === 3 && now.getDate() === 5) {
                return [{ id: "easter", domain: "religious", tradition: "christian" }];
            }
            return [{ id: "default-day", domain: "temporal" }];
        }
    };

    const mockPack: GreetingPack = {
        locale: "en-US",
        greetings: [
            { id: "generic-hi", text: "Hello", phase: "open" },
            { id: "easter-hi", text: "Happy Easter", eventRef: "easter", phase: "open" }
        ]
    };

    beforeEach(() => {
        engine = new SalveEngine();
        engine.registerPlugin(mockPlugin);
        engine.registerPack(mockPack);
    });

    test("should resolve the most specific greeting (Maximal Cultural Specificity)", () => {
        const context: GreetingContext = {
            now: new Date(2026, 3, 5), // April 5th (Easter in mock)
            locale: "en-US",
            affiliations: ["christian"],
            phase: "open"
        };

        const result = engine.resolve(context);

        expect(result.greeting).toBe("Happy Easter");
        expect(result.metadata.eventId).toBe("easter");
        expect(result.metadata.domain).toBe("religious");
    });

    test("should fallback to temporal greeting when no religious event matches affiliations", () => {
        const context: GreetingContext = {
            now: new Date(2026, 3, 5),
            locale: "en-US",
            affiliations: ["non-christian"], // Different affiliation
            phase: "open"
        };

        const result = engine.resolve(context);

        expect(result.greeting).toBe("Hello");
        expect(result.metadata.eventId).toBe("default-day");
        expect(result.metadata.domain).toBe("temporal");
    });

    test("should handle formal address resolution", () => {
        const context: GreetingContext = {
            now: new Date(2026, 0, 1),
            locale: "en-US",
            formality: "formal",
            profile: {
                lastName: "Smith",
                gender: "male",
                academicTitles: ["Dr."]
            }
        };

        const result = engine.resolve(context);

        expect(result.greeting).toBe("Hello");
        expect(result.address).toBeUndefined(); // Address is part of salutation in current impl
        expect(result.salutation).toBe("Hello, Dr. Smith");
    });

    test("should handle suppression", () => {
        const context: GreetingContext = {
            now: new Date(2026, 3, 5),
            locale: "en-US",
            affiliations: ["christian"],
            suppressions: ["easter"] // Suppress the specific event
        };

        const result = engine.resolve(context);

        expect(result.greeting).toBe("Hello");
        expect(result.metadata.eventId).toBe("default-day");
    });
});
