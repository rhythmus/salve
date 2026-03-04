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
            formal: "{fullHonorific} {lastName}",
            informal: "{firstName}",
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
            formal: "{fullHonorific} {lastName}",
            informal: "{firstName}",
            standard: "{firstName} {lastName}"
        }
    };

    beforeEach(() => {
        engine = new SalveEngine();
        engine.registerHonorifics(germanHonorifics);
        engine.registerHonorifics(englishHonorifics);
    });

    test("should resolve German formal address with academic title", async () => {
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

        engine.registerPack({
            locale: "de",
            greetings: [{
                id: "generic",
                text: "Greeting"
            }]
        });

        const result = await engine.resolve(context);
        expect(result.address).toBe("Herr Dr. Mustermann");
    });

    test("should resolve English informal address", async () => {
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

        const result = await engine.resolve(context);
        expect(result.address).toBe("Jane");
    });

    test("should fallback gracefully when no honorific pack is registered", async () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "fr-FR",
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

        const result = await engine.resolve(context);
        expect(result.address).toBe("Mx. Dupont");
    });
});
