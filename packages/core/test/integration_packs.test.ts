import { SalveEngine, GreetingContext } from "../src";
import { globalHonorifics } from "../../pack-global-addresses/src";

describe("SalveEngine Integration with Global Address Packs", () => {
    let engine: SalveEngine;

    beforeEach(() => {
        engine = new SalveEngine();
        globalHonorifics.forEach(pack => engine.registerHonorifics(pack));

        engine.registerPack({
            locale: "en",
            greetings: [{ id: "hello", text: "Hello" }]
        });

        engine.registerPack({
            locale: "el",
            greetings: [{ id: "yasas", text: "Γεια σας" }]
        });
    });

    test("should resolve English formal address using global pack", async () => {
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

        const result = await engine.resolve(context);
        expect(result.address).toBe("Mr. Doe");
        expect(result.salutation).toBe("Hello, Mr. Doe");
    });

    test("should resolve Greek formal address using global pack with vocative names", async () => {
        const context: GreetingContext = {
            now: new Date(),
            locale: "el-GR",
            formality: "formal",
            profile: {
                firstName: "Γιώργος",
                lastName: "Παπαδόπουλος",
                gender: "male"
            }
        };

        const result = await engine.resolve(context);
        expect(result.address).toBe("Κύριε Παπαδόπουλε");
        expect(result.salutation).toBe("Γεια σας, Κύριε Παπαδόπουλε");
    });
});
