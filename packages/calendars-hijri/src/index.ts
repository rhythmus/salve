import {
    CalendarPlugin,
    CelebrationEvent,
    GreetingContext
} from "@salve/core";

/**
 * Tabular Islamic Calendar (Kuwaiti Algorithm approximation)
 * Note: Religious dates may vary by +/- 1 day based on moon sighting.
 */
export class HijriCalendarPlugin implements CalendarPlugin {
    public id = "hijri";

    public resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] {
        const { hDay, hMonth } = this.getHijriDate(now);
        const events: CelebrationEvent[] = [];

        // Eid al-Fitr (1st of Shawwal)
        if (hMonth === 10 && hDay === 1) {
            events.push({ id: "eid-al-fitr", domain: "religious", tradition: "islamic" });
        }

        // Eid al-Adha (10th of Dhu al-Hijjah)
        if (hMonth === 12 && hDay === 10) {
            events.push({ id: "eid-al-adha", domain: "religious", tradition: "islamic" });
        }

        // Ramadan Start (1st of Ramadan)
        if (hMonth === 9 && hDay === 1) {
            events.push({ id: "ramadan-start", domain: "religious", tradition: "islamic" });
        }

        // Islamic New Year (1st of Muharram)
        if (hMonth === 1 && hDay === 1) {
            events.push({ id: "islamic-new-year", domain: "religious", tradition: "islamic" });
        }

        return events;
    }

    /**
     * Simplified Tabular Hijri conversion
     */
    private getHijriDate(date: Date): { hDay: number; hMonth: number; hYear: number } {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        if (month < 2) {
            year -= 1;
            month += 12;
        }

        const a = Math.floor(year / 100);
        const b = 2 - a + Math.floor(a / 4);
        const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524;

        const epoch = 1948439.5;
        const hCycle = 10631;
        const hYearLen = 354.36667;

        const d = jd - epoch;
        const cycle = Math.floor(d / hCycle);
        const dCycle = d % hCycle;

        let hYear = Math.floor(cycle * 30 + dCycle / hYearLen);
        let dYear = Math.floor(dCycle % hYearLen);

        // Month resolution
        const hMonthsLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
        let hMonth = 0;
        let hDay = dYear;

        for (let i = 0; i < 12; i++) {
            const len = hMonthsLengths[i] + (i === 11 && this.isLeapHijri(hYear) ? 1 : 0);
            if (hDay < len) {
                hMonth = i + 1;
                hDay = Math.floor(hDay) + 1;
                break;
            }
            hDay -= len;
        }

        return { hDay, hMonth, hYear };
    }

    private isLeapHijri(year: number): boolean {
        return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(year % 30);
    }
}
