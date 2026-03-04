import { SalveEngine, GreetingContext } from "../src";

describe("Vocabulary & Punctuation (M4.2)", () => {
    let engine: SalveEngine;

    beforeEach(() => {
        engine = new SalveEngine();

        engine.registerHonorifics({
            locale: "el",
            titles: { male: "Κύριε", female: "Κυρία", unspecified: "Κ." },
            formats: {
                formal: "{honorific} {lastName}",
                informal: "{firstName}",
                standard: "{firstName} {lastName}"
            }
        });

        engine.registerPack({
            locale: "el",
            greetings: [
                { id: "hello", text: "Γεια σου" },
                { id: "goodmorn", text: "Καλημέρα" }
            ]
        });

        engine.registerPack({
            locale: "en",
            greetings: [
                { id: "hi", text: "Hi" },
                { id: "welcome", text: "Welcome!" }
            ]
        });
    });

    test("should apply Greek vocative to first name", async () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "el-GR",
            formality: "informal",
            profile: {
                firstName: "Γιώργος",
                gender: "male"
            }
        };

        const result = await engine.resolve(context);
        expect(result.address).toBe("Γιώργο");
        expect(result.salutation).toBe("Γεια σου, Γιώργο");
    });

    test("should apply Greek vocative to last name in formal address", async () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "el-GR",
            formality: "formal",
            profile: {
                lastName: "Παπαδόπουλος",
                gender: "male"
            }
        };

        const result = await engine.resolve(context);
        expect(result.address).toBe("Κύριε Παπαδόπουλε");
    });

    test("should handle punctuation correctly (greedy comma)", async () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "en-US",
            formality: "informal",
            profile: { firstName: "Alice" }
        };

        const result1 = await engine.resolve(context);
        expect(result1.salutation).toBe("Hi, Alice");

        engine.registerPack({
            locale: "en",
            greetings: [{ id: "welcome", text: "Welcome!" }]
        });

        const result2 = await engine.resolve(context);
        expect(result2.salutation).toBe("Welcome! Alice");
    });
});
