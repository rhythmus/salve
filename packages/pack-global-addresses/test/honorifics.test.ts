import { englishHonorifics, germanHonorifics, greekHonorifics } from "../src";

describe("Global Address Packs", () => {
    test("English honorifics should have correct titles and formal format", () => {
        expect(englishHonorifics.locale).toBe("en");
        expect(englishHonorifics.titles.male).toBe("Mr.");
        expect(englishHonorifics.formats.formal).toBe("{fullHonorific} {lastName}");
    });

    test("German honorifics should have correct titles and formal format", () => {
        expect(germanHonorifics.locale).toBe("de");
        expect(germanHonorifics.titles.male).toBe("Herr");
        expect(germanHonorifics.formats.formal).toBe("{fullHonorific} {lastName}");
    });

    test("Greek honorifics should have vocative titles", () => {
        expect(greekHonorifics.locale).toBe("el");
        expect(greekHonorifics.titles.male).toBe("Κύριε"); // Vocative
        expect(greekHonorifics.titles.female).toBe("Κυρία");
        expect(greekHonorifics.formats.formal).toBe("{fullHonorific} {lastName}");
    });
});
