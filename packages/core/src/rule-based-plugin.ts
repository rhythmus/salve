import { CalendarPlugin, CelebrationEvent, EventCategory } from "./types";

export interface RuleBasedEvent {
    id: string;
    date: string; // e.g., "1 January", "pascha:1", "09:sun:3", "01:06:next:monday"
    category: EventCategory;
    label?: string | Record<string, string | string[]>;
    emoji?: string;
    requiredRegions?: string[];
    requiredProfessions?: string[];
    WikiData?: string;
}

export class RuleBasedCalendarPlugin implements CalendarPlugin {
    public id = "rule-based";
    private events: RuleBasedEvent[] = [];

    public registerEvent(event: RuleBasedEvent): void {
        this.events.push(event);
    }

    public registerEvents(events: RuleBasedEvent[]): void {
        this.events.push(...events);
    }

    public resolveEvents(now: Date, context: any): CelebrationEvent[] {
        const results: CelebrationEvent[] = [];

        for (const e of this.events) {
            if (this.matches(e.date, now)) {
                results.push({
                    id: e.id,
                    category: e.category,
                    emoji: e.emoji,
                    requiredRegions: e.requiredRegions,
                    requiredProfessions: e.requiredProfessions,
                    wikiDataId: e.WikiData
                });
            }
        }

        return results;
    }

    private matches(rule: string, date: Date): boolean {
        const day = date.getDate();
        const month = date.getMonth() + 1; // 1-12
        const weekday = date.getDay(); // 0-6

        // 1. Static: "1 January"
        const staticMatch = rule.match(/^(\d+)\s+([A-Za-z]+)$/);
        if (staticMatch) {
            const rDay = parseInt(staticMatch[1], 10);
            const rMonthStr = staticMatch[2].toLowerCase();
            const months = ["january", "february", "march", "april", "may", "june",
                "july", "august", "september", "october", "november", "december"];
            const rMonth = months.indexOf(rMonthStr) + 1;
            return rDay === day && rMonth === month;
        }

        // 2. Pascha: "pascha:1"
        if (rule.startsWith('pascha:')) {
            const offset = parseInt(rule.split(':')[1], 10);
            const easter = this.getWesternEaster(date.getFullYear());
            const target = new Date(easter);
            target.setDate(easter.getDate() + offset);
            return this.isSameDay(date, target);
        }

        // 3. Nth Weekday: "09:sun:3"
        const nthMatch = rule.match(/^(\d{2}):([a-z]{3}):(\d)$/);
        if (nthMatch) {
            const rMonth = parseInt(nthMatch[1], 10);
            const rWeekdayStr = nthMatch[2];
            const rN = parseInt(nthMatch[3], 10);

            const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            const rWeekday = weekdays.indexOf(rWeekdayStr);

            if (month !== rMonth || weekday !== rWeekday) return false;
            const n = Math.ceil(day / 7);
            return n === rN;
        }

        // 4. Next Weekday: "01:06:next:monday" (Verloren Maandag)
        const nextMatch = rule.match(/^(\d{2}):(\d{2}):next:([a-z]+)$/);
        if (nextMatch) {
            const rMonth = parseInt(nextMatch[1], 10);
            const rDay = parseInt(nextMatch[2], 10);
            const rWeekdayStr = nextMatch[3].substring(0, 3).toLowerCase();

            const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            const targetWeekday = weekdays.indexOf(rWeekdayStr);

            // Find the first occurrence of targetWeekday strictly after MM:DD
            const baseDate = new Date(date.getFullYear(), rMonth - 1, rDay);
            const targetDate = new Date(baseDate);
            let daysToAdd = (targetWeekday - baseDate.getDay() + 7) % 7;
            if (daysToAdd === 0) daysToAdd = 7; // Must be strictly AFTER
            targetDate.setDate(baseDate.getDate() + daysToAdd);

            return this.isSameDay(date, targetDate);
        }

        return false;
    }

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

    private isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
}
