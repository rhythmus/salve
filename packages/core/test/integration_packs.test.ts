import { SalveEngine, GreetingContext } from "../src";
import { globalHonorifics } from "../../pack-global-addresses/src";

describe("SalveEngine Integration with Global Address Packs", () => {
    let engine: SalveEngine;

    beforeEach(() => {
        engine = new SalveEngine();
        // Register all global honorifics
        globalHonorifics.forEach(pack => engine.registerHonorifics(pack));

        // Register a dummy greeting pack for English
        engine.registerPack({
            locale: "en",
            greetings: [{ id: "hello", text: "Hello" }]
        });

        // Register a dummy greeting pack for Greek
        engine.registerPack({
            locale: "el",
            greetings: [{ id: "yasas", text: "Γεια σας" }]
        });
    });

    test("should resolve English formal address using global pack", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "en-US",
            formality: "formal",
            profile: {
                firstName: "John",
                lastName: "Doe",
                gender: "male"
            }
        };

        const result = engine.resolve(context);
        expect(result.address).toBe("Mr. Doe");
        expect(result.salutation).toBe("Hello, Mr. Doe");
    });

    test("should resolve Greek formal address using global pack with vocative names", () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "el-GR",
            formality: "formal",
            profile: {
                firstName: "Γιώργος", // Giorgos
                lastName: "Παπαδόπουλος", // Papadopoulos
                gender: "male"
            }
        };

        const result = engine.resolve(context);
        // "Κύριε" is set in greekHonorifics.titles.male
        // Name transforms for Greek are registered in SalveEngine constructor
        expect(result.address).toBe("Κύριε Παπαδόπουλε");
        expect(result.salutation).toBe("Γεια σας, Κύριε Παπαδόπουλε");
    });
});
