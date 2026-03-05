import { resolveDayPeriod } from "../src/day-period";

describe("resolveDayPeriod", () => {
    test("0–4 should be night", () => {
        expect(resolveDayPeriod(0)).toBe("night");
        expect(resolveDayPeriod(2)).toBe("night");
        expect(resolveDayPeriod(4)).toBe("night");
    });

    test("5–10 should be morning", () => {
        expect(resolveDayPeriod(5)).toBe("morning");
        expect(resolveDayPeriod(7)).toBe("morning");
        expect(resolveDayPeriod(10)).toBe("morning");
    });

    test("11–13 should be midday", () => {
        expect(resolveDayPeriod(11)).toBe("midday");
        expect(resolveDayPeriod(12)).toBe("midday");
        expect(resolveDayPeriod(13)).toBe("midday");
    });

    test("14–17 should be afternoon", () => {
        expect(resolveDayPeriod(14)).toBe("afternoon");
        expect(resolveDayPeriod(15)).toBe("afternoon");
        expect(resolveDayPeriod(17)).toBe("afternoon");
    });

    test("18–21 should be evening", () => {
        expect(resolveDayPeriod(18)).toBe("evening");
        expect(resolveDayPeriod(20)).toBe("evening");
        expect(resolveDayPeriod(21)).toBe("evening");
    });

    test("22–23 should be night", () => {
        expect(resolveDayPeriod(22)).toBe("night");
        expect(resolveDayPeriod(23)).toBe("night");
    });

    test("invalid hours should throw", () => {
        expect(() => resolveDayPeriod(-1)).toThrow(RangeError);
        expect(() => resolveDayPeriod(24)).toThrow(RangeError);
    });
});
