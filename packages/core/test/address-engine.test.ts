import { AddressEngine, AddressResolveContext } from "../src/address-engine";
import {
    AddressPack,
    AddressAudience,
    ProtocolPack,
    AddressRecipient,
} from "../src/types";

const nlPack: AddressPack = {
    locale: "nl",
    honorifics: {
        male: "de heer",
        female: "mevrouw",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "De heer/Mevrouw {postalTitleStack} {surname}",
        letterhead: "Geachte {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {correspondenceTitleStack} {surname}",
        email_opening: "Geachte {honorific} {surname},",
        informal: "Beste {firstName}",
    },
    titles: [
        { system: "academic", code: "prof", rank: 1, postalForm: "prof. dr.", correspondenceForm: "professor" },
        { system: "academic", code: "dr", rank: 2, postalForm: "dr.", correspondenceForm: "dr." },
    ],
    collectiveFormulas: [
        { id: "nl-formal-group", formality: "formal", text: "Geachte dames en heren", audienceKind: "group" },
        { id: "nl-informal-group", formality: "informal", text: "Beste allen", audienceKind: "group" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
};

const dePack: AddressPack = {
    locale: "de",
    honorifics: {
        male: "Herr",
        female: "Frau",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "Herrn {postalTitleStack} {surname}",
        letterhead: "Sehr geehrter {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {correspondenceTitleStack} {surname}",
        informal: "{firstName}",
    },
    titles: [
        { system: "academic", code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor", gender: "male" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
    ],
    collectiveFormulas: [
        { id: "de-formal-group", formality: "formal", text: "Sehr geehrte Damen und Herren", audienceKind: "group" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
};

const academicNl: ProtocolPack = {
    id: "protocol-academic-nl",
    locale: "nl",
    requiredSubculture: "academic",
    domain: "academic",
    titles: [
        { system: "academic", code: "prof", rank: 1, postalForm: "prof. dr.", correspondenceForm: "professor" },
        { system: "academic", code: "dr", rank: 2, postalForm: "dr.", correspondenceForm: "dr." },
    ],
    rules: [
        {
            id: "nl-academic-letterhead-prof",
            priority: 15,
            template: "Hooggeleerde Heer {surname},",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                officeRole: "professor",
            },
        },
        {
            id: "nl-academic-postal-dr",
            priority: 10,
            template: "De weledelgeleerde heer/vrouwe {postalTitleStack} {surname}",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
            },
        },
    ],
};

describe("AddressEngine", () => {
    let engine: AddressEngine;

    beforeEach(() => {
        engine = new AddressEngine();
        engine.registerAddressPack(nlPack);
        engine.registerAddressPack(dePack);
    });

    // ── Single person: formal ──────────────────────────────────

    test("should resolve formal Dutch address with dr. title", () => {
        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                givenNames: ["Jan"],
                surname: "Müller",
                gender: "male",
                titles: [{ system: "academic", code: "dr", display: "dr." }],
            }],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "formal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toBe("de heer dr. Müller");
        expect(result.usedTitleCodes).toContain("dr");
    });

    test("should resolve formal German postal address", () => {
        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                surname: "Schmidt",
                gender: "male",
                titles: [
                    { system: "academic", code: "prof", display: "Prof.", gender: "male" },
                    { system: "academic", code: "dr", display: "Dr." },
                ],
            }],
        };

        const result = engine.resolve(audience, {
            locale: "de",
            formality: "formal",
            addressMode: "direct",
            outputForm: "postal",
        });

        expect(result.text).toBe("Herrn Prof. Schmidt");
        expect(result.outputForm).toBe("postal");
        expect(result.trace.length).toBeGreaterThan(0);
    });

    // ── Title suppression ──────────────────────────────────────

    test("should suppress doctor when professor is present (German)", () => {
        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                surname: "Weber",
                gender: "male",
                titles: [
                    { system: "academic", code: "prof", display: "Prof.", gender: "male" },
                    { system: "academic", code: "dr", display: "Dr." },
                ],
            }],
        };

        const result = engine.resolve(audience, {
            locale: "de",
            formality: "formal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).not.toContain("Dr.");
        expect(result.text).toContain("Professor");
    });

    test("should drop titles in informal context", () => {
        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                givenNames: ["Pieter"],
                surname: "De Vries",
                gender: "male",
                titles: [{ system: "academic", code: "dr", display: "dr." }],
            }],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "informal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toBe("Beste Pieter");
        expect(result.usedTitleCodes).toHaveLength(0);
    });

    // ── Group address ──────────────────────────────────────────

    test("should resolve formal group address (Dutch)", () => {
        const audience: AddressAudience = {
            kind: "group",
            recipients: [],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "formal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toBe("Geachte dames en heren");
        expect(result.audienceKind).toBe("group");
    });

    test("should resolve informal group address (Dutch)", () => {
        const audience: AddressAudience = {
            kind: "group",
            recipients: [],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "informal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toBe("Beste allen");
    });

    test("should use collective label when provided", () => {
        const audience: AddressAudience = {
            kind: "institution",
            recipients: [],
            collectiveLabel: "Dear Members of the Board",
        };

        const result = engine.resolve(audience, {
            locale: "en",
            formality: "formal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toBe("Dear Members of the Board");
    });

    // ── Protocol pack gating ───────────────────────────────────

    test("should NOT use protocol rules when subculture addressing is disabled", () => {
        engine.registerProtocolPack(academicNl);

        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                surname: "Jansen",
                gender: "male",
                officeRole: "professor",
                titles: [{ system: "academic", code: "prof", display: "prof." }],
            }],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "formal",
            addressMode: "direct",
            outputForm: "letterhead",
            allowSubcultureAddressing: false,
        });

        expect(result.text).not.toContain("Hooggeleerde");
        expect(result.usedRuleIds).not.toContain("nl-academic-letterhead-prof");
    });

    test("should use protocol rules when subculture addressing is enabled", () => {
        engine.registerProtocolPack(academicNl);

        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                surname: "Jansen",
                gender: "male",
                officeRole: "professor",
                titles: [{ system: "academic", code: "prof", display: "prof." }],
            }],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "formal",
            addressMode: "direct",
            outputForm: "letterhead",
            allowSubcultureAddressing: true,
            subcultures: ["academic"],
        });

        expect(result.text).toBe("Hooggeleerde Heer Jansen,");
        expect(result.usedRuleIds).toContain("nl-academic-letterhead-prof");
    });

    // ── Safe degradation ───────────────────────────────────────

    test("should degrade to empty when surname is missing in formal context", () => {
        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                givenNames: ["Maria"],
                gender: "female",
            }],
        };

        const result = engine.resolve(audience, {
            locale: "nl",
            formality: "formal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toBe("");
    });

    test("should fall back to fallback address when no pack is registered", () => {
        const audience: AddressAudience = {
            kind: "single",
            recipients: [{
                givenNames: ["Yuki"],
                surname: "Tanaka",
                gender: "female",
            }],
        };

        const result = engine.resolve(audience, {
            locale: "ja",
            formality: "formal",
            addressMode: "direct",
            outputForm: "salutation",
        });

        expect(result.text).toContain("Tanaka");
    });

    // ── Postal vs letterhead distinction ────────────────────────

    test("should produce different postal and letterhead for same Dutch recipient", () => {
        const recipient: AddressRecipient = {
            givenNames: ["Pieter"],
            surname: "De Jong",
            gender: "male",
            titles: [{ system: "academic", code: "dr", display: "dr." }],
        };

        const audience: AddressAudience = { kind: "single", recipients: [recipient] };
        const baseCtx: AddressResolveContext = {
            locale: "nl",
            formality: "formal",
            addressMode: "direct",
            outputForm: "postal",
        };

        const postal = engine.resolve(audience, { ...baseCtx, outputForm: "postal" });
        const letterhead = engine.resolve(audience, { ...baseCtx, outputForm: "letterhead" });

        expect(postal.text).not.toBe(letterhead.text);
        expect(postal.outputForm).toBe("postal");
        expect(letterhead.outputForm).toBe("letterhead");
    });
});
