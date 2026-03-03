import {
    CalendarPlugin,
    CelebrationEvent,
    GreetingContext,
    EventDomain
} from "@salve/core";

export interface GregorianRule {
    id: string;
    domain: EventDomain;
    match: (now: Date) => boolean;
}

export class GregorianCalendarPlugin implements CalendarPlugin {
    public id = "gregorian";

    private rules: GregorianRule[] = [
        // 1. Fixed Dates
        {
            id: "new-year-day",
            domain: "civil",
            match: (d) => d.getMonth() === 0 && d.getDate() === 1
        },
        {
            id: "new-year-eve",
            domain: "civil",
            match: (d) => d.getMonth() === 11 && d.getDate() === 31
        },
        {
            id: "valentines-day",
            domain: "civil",
            match: (d) => d.getMonth() === 1 && d.getDate() === 14
        },

        // 2. Temporal Slots
        {
            id: "morning",
            domain: "temporal",
            match: (d) => d.getHours() >= 5 && d.getHours() < 12
        },
        {
            id: "afternoon",
            domain: "temporal",
            match: (d) => d.getHours() >= 12 && d.getHours() < 18
        },
        {
            id: "evening",
            domain: "temporal",
            match: (d) => d.getHours() >= 18 && d.getHours() < 22
        },
        {
            id: "night",
            domain: "temporal",
            match: (d) => d.getHours() >= 22 || d.getHours() < 5
        },
        {
            id: "midday",
            domain: "temporal",
            match: (d) => d.getHours() >= 11 && d.getHours() <= 13
        }
    ];

    /**
     * Resolve events for the given date/time
     */
    public resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] {
        const events: CelebrationEvent[] = [];

        for (const rule of this.rules) {
            if (rule.match(now)) {
                events.push({
                    id: rule.id,
                    domain: rule.domain
                });
            }
        }

        return events;
    }

    /**
     * Add a custom fixed date rule
     */
    public addFixedDate(id: string, month: number, day: number, domain: EventDomain = "civil"): void {
        this.rules.push({
            id,
            domain,
            match: (d) => d.getMonth() === (month - 1) && d.getDate() === day
        });
    }

    /**
     * Add an Nth-weekday rule (e.g., 4th Thursday of Nov)
     */
    public addNthWeekday(
        id: string,
        month: number,
        weekday: number,
        occurrence: number,
        domain: EventDomain = "civil"
    ): void {
        this.rules.push({
            id,
            domain,
            match: (d) => {
                if (d.getMonth() !== (month - 1)) return false;
                if (d.getDay() !== weekday) return false;

                const date = d.getDate();
                const n = Math.ceil(date / 7);
                return n === occurrence;
            }
        });
    }
}
