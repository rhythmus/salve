import { SalveRegistry, SalveLoader } from "../src";

describe("Salve Registry & Loader", () => {
    let registry: SalveRegistry;
    let loader: SalveLoader;

    beforeEach(() => {
        registry = new SalveRegistry();
        loader = new SalveLoader(registry);
    });

    test("should register and retrieve calendar plugins", () => {
        const mockCalendar: any = { id: "test-cal", getCelebrations: jest.fn() };
        registry.plugins.registerCalendar("test-cal", mockCalendar);
        expect(registry.plugins.getCalendar("test-cal")).toBe(mockCalendar);
    });

    test("should register and retrieve data packs via loader", () => {
        const mockHonorifics: any = { locale: "en", honorifics: [] };
        const mockSaints: any = [{ qid: "Q1", canonicalName: "Saint One", traditions: [], aliases: [] }];

        loader.load([mockHonorifics, mockSaints]);

        expect(registry.packs.getHonorificsByLocale("en")[0]).toBe(mockHonorifics);
        expect(registry.packs.getSaints().length).toBe(1);
    });

    test("should filter transforms by locale", () => {
        const t1: any = { id: "t1", locales: ["el"], transform: jest.fn() };
        const t2: any = { id: "t2", locales: ["en"], transform: jest.fn() };

        registry.plugins.registerTransform("t1", t1);
        registry.plugins.registerTransform("t2", t2);

        const elTransforms = registry.plugins.getTransformsByLocale("el");
        expect(elTransforms).toHaveLength(1);
        expect(elTransforms[0].id).toBe("t1");
    });

    test("should auto-wire saints to a registered nameday plugin", () => {
        const mockPlugin: any = {
            id: "nameday-plugin",
            registerSaints: jest.fn(),
            registerNameDays: jest.fn(),
            resolveEvents: jest.fn().mockReturnValue([]),
        };
        registry.plugins.registerCalendar("nameday-plugin", mockPlugin);

        const saints = [
            { qid: "Q43431", canonicalName: "George", traditions: ["orthodox"], aliases: ["Γιώργος"] },
        ];
        loader.load([saints]);

        expect(mockPlugin.registerSaints).toHaveBeenCalledWith(saints);
        expect(registry.packs.getSaints().length).toBe(1);
    });

    test("should auto-wire nameday entries to a registered nameday plugin", () => {
        const mockPlugin: any = {
            id: "nameday-plugin",
            registerSaints: jest.fn(),
            registerNameDays: jest.fn(),
            resolveEvents: jest.fn().mockReturnValue([]),
        };
        registry.plugins.registerCalendar("nameday-plugin", mockPlugin);

        const entries = [
            { month: 4, day: 23, saintQids: ["Q43431"] },
        ];
        loader.load([entries]);

        expect(mockPlugin.registerNameDays).toHaveBeenCalledWith(entries);
        expect(registry.packs.getNameDays().length).toBe(1);
    });

    test("should still register data when no nameday plugin is present", () => {
        const saints = [
            { qid: "Q43107", canonicalName: "Nicholas", traditions: ["orthodox"], aliases: ["Νίκος"] },
        ];
        const entries = [
            { month: 12, day: 6, saintQids: ["Q43107"] },
        ];

        loader.load([saints, entries]);

        expect(registry.packs.getSaints().length).toBe(1);
        expect(registry.packs.getNameDays().length).toBe(1);
    });
});
