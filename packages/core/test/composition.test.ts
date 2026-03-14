import { CompositionEngine } from "../src/composition";

describe("CompositionEngine", () => {
    let engine: CompositionEngine;

    beforeEach(() => {
        engine = new CompositionEngine();
    });

    // ── Basic composition ──────────────────────────────────────

    test("should compose greeting and address with comma separator", () => {
        const result = engine.compose({
            greeting: "Guten Morgen",
            address: "Herr Professor Dr. Müller",
        }, "de");

        expect(result.text).toBe("Guten Morgen, Herr Professor Dr. Müller");
    });

    test("should return greeting only when no address", () => {
        const result = engine.compose({ greeting: "Hello" }, "en");
        expect(result.text).toBe("Hello");
    });

    test("should return address only when no greeting", () => {
        const result = engine.compose({ address: "Mr. Smith" }, "en");
        expect(result.text).toBe("Mr. Smith");
    });

    test("should return empty string when both are missing", () => {
        const result = engine.compose({}, "en");
        expect(result.text).toBe("");
    });

    // ── Terminal punctuation: move_to_end ───────────────────────

    test("should move exclamation mark to end of composed string", () => {
        const result = engine.compose({
            greeting: "Γεια σας!",
            address: "Κύριε Παπαδόπουλε",
        }, "el");

        expect(result.text).toBe("Γεια σας, Κύριε Παπαδόπουλε!");
    });

    test("should move question mark to end", () => {
        const result = engine.compose({
            greeting: "How are you?",
            address: "Dr. Smith",
        }, "en");

        expect(result.text).toBe("How are you, Dr. Smith?");
    });

    test("should handle multiple punctuation marks", () => {
        const result = engine.compose({
            greeting: "Welcome!",
            address: "Alice",
        }, "en");

        expect(result.text).toBe("Welcome, Alice!");
    });

    // ── Terminal punctuation: preserve ──────────────────────────

    test("should preserve terminal punctuation with space separator", () => {
        const result = engine.compose({
            greeting: "Welcome!",
            address: "Alice",
            renderPolicy: { terminalPunctuation: "preserve" },
        }, "en");

        expect(result.text).toBe("Welcome! Alice");
    });

    // ── Terminal punctuation: strip ────────────────────────────

    test("should strip terminal punctuation", () => {
        const result = engine.compose({
            greeting: "Γεια σας!",
            address: "Κύριε Παπαδόπουλε",
            renderPolicy: { terminalPunctuation: "strip" },
        }, "el");

        expect(result.text).toBe("Γεια σας, Κύριε Παπαδόπουλε");
    });

    // ── Separator policies ─────────────────────────────────────

    test("should use space separator", () => {
        const result = engine.compose({
            greeting: "Dear",
            address: "Mr. Smith",
            renderPolicy: { separator: "space" },
        }, "en");

        expect(result.text).toBe("Dear Mr. Smith");
    });

    test("should use no separator", () => {
        const result = engine.compose({
            greeting: "Dear",
            address: "Mr. Smith",
            renderPolicy: { separator: "none" },
        }, "en");

        expect(result.text).toBe("DearMr. Smith");
    });

    test("should use newline separator", () => {
        const result = engine.compose({
            greeting: "Dear Sir",
            address: "Mr. Smith",
            renderPolicy: { separator: "newline" },
        }, "en");

        expect(result.text).toBe("Dear Sir\nMr. Smith");
    });

    // ── Capitalization ─────────────────────────────────────────

    test("should lowercase address when policy says so", () => {
        const result = engine.compose({
            greeting: "Hello",
            address: "Dr. Smith",
            renderPolicy: { capitalization: "lowercase_address" },
        }, "en");

        expect(result.text).toBe("Hello, dr. smith");
    });

    test("should preserve capitalization by default", () => {
        const result = engine.compose({
            greeting: "Hello",
            address: "Dr. Smith",
        }, "en");

        expect(result.text).toBe("Hello, Dr. Smith");
    });

    // ── Custom template ────────────────────────────────────────

    test("should apply custom template", () => {
        const result = engine.compose({
            greeting: "Good morning!",
            address: "Professor Müller",
            renderPolicy: {
                customTemplate: "{greeting}, {address}{punctuation}",
            },
        }, "de");

        expect(result.text).toBe("Good morning, Professor Müller!");
    });

    test("should support {greetingRaw} token in custom template", () => {
        const result = engine.compose({
            greeting: "Welcome!",
            address: "Dr. Smith",
            renderPolicy: {
                customTemplate: "{greetingRaw} — {address}",
            },
        }, "en");

        expect(result.text).toBe("Welcome! — Dr. Smith");
    });

    // ── Address-only output forms ──────────────────────────────

    test("should append comma for letterhead address-only", () => {
        const result = engine.compose({
            address: "Geachte heer Müller",
            renderPolicy: { outputForm: "letterhead" },
        }, "nl");

        expect(result.text).toBe("Geachte heer Müller,");
    });

    test("should append comma for email_opening address-only", () => {
        const result = engine.compose({
            address: "Dear Mr. Smith",
            renderPolicy: { outputForm: "email_opening" },
        }, "en");

        expect(result.text).toBe("Dear Mr. Smith,");
    });

    // ── Policy tracing ─────────────────────────────────────────

    test("should include applied policy in result", () => {
        const result = engine.compose({
            greeting: "Hello",
            address: "Mr. Smith",
        }, "en");

        expect(result.appliedPolicy).toBeDefined();
        expect(result.appliedPolicy.separator).toBe("comma");
        expect(result.appliedPolicy.terminalPunctuation).toBe("move_to_end");
    });
});
