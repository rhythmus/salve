import { SalveEngine, HonorificPack, GreetingContext } from "../src";

describe("AddressResolver Integration", () => {
    let engine: SalveEngine;

    const germanHonorifics: HonorificPack = {
        locale: "de",
        titles: {
            male: "Herr",
            female: "Frau",
            nonBinary: "Mx.",
            unspecified: "M."
        },
        formats: {
            formal: "Guten Tag, {fullHonorific} {lastName}",
            informal: "Hallo {firstName}",
            standard: "{firstName} {lastName}"
        }
    };

    const englishHonorifics: HonorificPack = {
        locale: "en",
        titles: {
            male: "Mr.",
            female: "Ms.",
            nonBinary: "Mx.",
            unspecified: "M."
        },
        formats: {
            formal: "Dear {fullHonorific} {lastName}",
            informal: "Hi {firstName}",
            standard: "{firstName} {lastName}"
        }
    };

    beforeEach(() => {
        engine = new SalveEngine();
        engine.registerHonorifics(germanHonorifics);
        engine.registerHonorifics(englishHonorifics);
    });

    test("should resolve German formal address with academic title", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "de-DE",
            formality: "formal",
            profile: {
                firstName: "Max",
                lastName: "Mustermann",
                gender: "male",
                academicTitles: ["Dr."]
            }
        };

        // We need a registered pack to trigger resolution in the engine, 
        // but the engine.resolve() calls resolveAddress().
        // For this test, we can check the engine's internal resolveAddress via resolve call
        // if we have a dummy pack. Let's just test the engine's public resolve output.

        // Register a dummy pack so resolve doesn't fallback to error
        engine.registerPack({
            locale: "de",
            greetings: [{
                id: "generic",
                eventRef: undefined,
                text: "Greeting"
            }]
        });

        const result = engine.resolve(context);
        expect(result.address).toBe("Herr Dr. Mustermann");
    });

    test("should resolve English informal address", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "en-US",
            formality: "informal",
            profile: {
                firstName: "Jane",
                lastName: "Doe",
                gender: "female"
            }
        };

        engine.registerPack({
            locale: "en",
            greetings: [{ id: "hi", text: "Hi" }]
        });

        const result = engine.resolve(context);
        expect(result.address).toBe("Jane");
    });

    test("should fallback gracefully when no honorific pack is registered", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "fr-FR", // No French registered
            formality: "formal",
            profile: {
                firstName: "Jean",
                lastName: "Dupont",
                gender: "male"
            }
        };

        engine.registerPack({
            locale: "fr",
            greetings: [{ id: "bonjour", text: "Bonjour" }]
        });

        const result = engine.resolve(context);
        // Fallback in AddressResolver is "Mx. LastName"
        expect(result.address).toBe("Mx. Dupont");
    });
});
