import { SalveEngine, GreetingContext } from "../src";

describe("Vocabulary & Punctuation (M4.2)", () => {
    let engine: SalveEngine;

    beforeEach(() => {
        engine = new SalveEngine();

        // Greek Honorifics
        engine.registerHonorifics({
            locale: "el",
            titles: { male: "Κύριε", female: "Κυρία", unspecified: "Κ." },
            formats: {
                formal: "{honorific} {lastName}",
                informal: "{firstName}",
                standard: "{firstName} {lastName}"
            }
        });

        // Greek Greeting Pack
        engine.registerPack({
            locale: "el",
            greetings: [
                { id: "hello", text: "Γεια σου" },
                { id: "goodmorn", text: "Καλημέρα" }
            ]
        });

        // English Pack for comparative punctuation
        engine.registerPack({
            locale: "en",
            greetings: [
                { id: "hi", text: "Hi" },
                { id: "welcome", text: "Welcome!" }
            ]
        });
    });

    test("should apply Greek vocative to first name", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "el-GR",
            formality: "informal",
            profile: {
                firstName: "Γιώργος", // Giorgos
                gender: "male"
            }
        };

        const result = engine.resolve(context);
        // Vocative of Γιώργος is Γιώργο
        expect(result.address).toBe("Γιώργο");
        expect(result.salutation).toBe("Γεια σου, Γιώργο");
    });

    test("should apply Greek vocative to last name in formal address", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "el-GR",
            formality: "formal",
            profile: {
                lastName: "Παπαδόπουλος", // Papadopoulos
                gender: "male"
            }
        };

        const result = engine.resolve(context);
        // Vocative of Παπαδόπουλος is Παπαδόπουλε
        // Format: Κύριε Παπαδόπουλε
        expect(result.address).toBe("Κύριε Παπαδόπουλε");
    });

    test("should handle punctuation correctly (greedy comma)", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "en-US",
            formality: "informal",
            profile: { firstName: "Alice" }
        };

        const result1 = engine.resolve(context);
        expect(result1.salutation).toBe("Hi, Alice");

        // Case with trailing punctuation in template
        engine.registerPack({
            locale: "en",
            greetings: [{ id: "welcome", text: "Welcome!" }]
        });

        const result2 = engine.resolve(context);
        expect(result2.salutation).toBe("Welcome! Alice");
    });
});
