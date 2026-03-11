import {
    CalendarPlugin,
    CelebrationEvent,
    GreetingContext
} from "@salve/core";

export class PaschaCalendarPlugin implements CalendarPlugin {
    public id = "pascha";

    /**
     * Resolve events for the given date
     */
    public resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] {
        const events: CelebrationEvent[] = [];
        const year = now.getFullYear();

        // 1. Check Western Easter
        const westernEaster = this.getWesternEaster(year);
        if (this.isSameDay(now, westernEaster)) {
            events.push({ id: "easter", domain: "religious", tradition: "christian" });
        }

        // Good Friday (Western)
        const westernGoodFriday = new Date(westernEaster);
        westernGoodFriday.setDate(westernEaster.getDate() - 2);
        if (this.isSameDay(now, westernGoodFriday)) {
            events.push({ id: "good-friday", domain: "religious", tradition: "christian" });
        }

        // 2. Check Orthodox Easter
        const orthodoxEaster = this.getOrthodoxEaster(year);
        if (this.isSameDay(now, orthodoxEaster)) {
            events.push({ id: "orthodox-easter", domain: "religious", tradition: "orthodox" });
        }

        // Orthodox Good Friday (-2 days)
        const orthodoxGoodFriday = new Date(orthodoxEaster);
        orthodoxGoodFriday.setDate(orthodoxEaster.getDate() - 2);
        if (this.isSameDay(now, orthodoxGoodFriday)) {
            events.push({ id: "orthodox-good-friday", domain: "religious", tradition: "orthodox" });
        }

        // Orthodox Easter Monday (+1 day)
        const orthodoxEasterMonday = new Date(orthodoxEaster);
        orthodoxEasterMonday.setDate(orthodoxEaster.getDate() + 1);
        if (this.isSameDay(now, orthodoxEasterMonday)) {
            events.push({ id: "orthodox-easter-monday", domain: "religious", tradition: "orthodox" });
        }

        // Clean Monday (Orthodox Lent start, -48 days)
        const cleanMonday = new Date(orthodoxEaster);
        cleanMonday.setDate(orthodoxEaster.getDate() - 48);
        if (this.isSameDay(now, cleanMonday)) {
            events.push({ id: "orthodox-clean-monday", domain: "religious", tradition: "orthodox" });
        }

        // Holy Spirit Monday (Pentecost Monday, +50 days)
        const holySpiritMonday = new Date(orthodoxEaster);
        holySpiritMonday.setDate(orthodoxEaster.getDate() + 50);
        if (this.isSameDay(now, holySpiritMonday)) {
            events.push({ id: "orthodox-holy-spirit-monday", domain: "religious", tradition: "orthodox" });
        }

        return events;
    }

    /**
     * Meeus/Jones/Butcher algorithm for Western Easter
     */
    private getWesternEaster(year: number): Date {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    /**
     * Orthodox Easter calculation (Julian calendar converted to Gregorian)
     */
    private getOrthodoxEaster(year: number): Date {
        const a = year % 19;
        const b = year % 4;
        const c = year % 7;
        const d = (19 * a + 15) % 30;
        const e = (2 * b + 4 * c + 6 * d + 6) % 7;
        // Calculate Julian Easter as offset from March 22
        const date = new Date(year, 2, 22 + d + e);
        // Convert from Julian to Gregorian (13 days difference for 1900-2099)
        date.setDate(date.getDate() + 13);
        return date;
    }

    private isSameDay(d1: Date, d2: Date): boolean {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }
}
