import { buildLocaleChain } from "../src/locale-chain";

describe("buildLocaleChain", () => {
    test("full locale nl-BE should produce 3-element chain", () => {
        expect(buildLocaleChain("nl-BE")).toEqual(["nl-BE", "nl", "root"]);
    });

    test("base locale el should produce 2-element chain", () => {
        expect(buildLocaleChain("el")).toEqual(["el", "root"]);
    });

    test("extended locale zh-Hant-TW should strip progressively", () => {
        expect(buildLocaleChain("zh-Hant-TW")).toEqual(["zh-Hant-TW", "zh-Hant", "zh", "root"]);
    });

    test("root itself should produce just root", () => {
        expect(buildLocaleChain("root")).toEqual(["root"]);
    });

    test("en-US should produce standard 3-element chain", () => {
        expect(buildLocaleChain("en-US")).toEqual(["en-US", "en", "root"]);
    });
});
