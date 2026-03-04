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
});
