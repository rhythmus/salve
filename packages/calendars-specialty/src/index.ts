import {
    CalendarPlugin,
    CelebrationEvent,
    GreetingContext
} from "@salve/core";

export class SpecialtyCalendarPlugin implements CalendarPlugin {
    public id = "specialty";

    public resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] {
        const events: CelebrationEvent[] = [];

        // 1. Resolve Seasons (Fixed day approximations)
        const seasonalEvent = this.getSeasonalEvent(now);
        if (seasonalEvent) {
            events.push(seasonalEvent);
        }

        // 2. Resolve Personal Events from Context
        // Example: context metadata or profile can carry specific dates
        const personalEvents = this.getPersonalEvents(now, context);
        events.push(...personalEvents);

        // 3. Resolve Astronomical Events (Simplified full-moon approximation)
        if (this.isFullMoon(now)) {
            events.push({ id: "full-moon", domain: "temporal" });
        }

        return events;
    }

    private getSeasonalEvent(d: Date): CelebrationEvent | null {
        const month = d.getMonth() + 1;
        const day = d.getDate();

        // Northern Hemisphere approximations
        if (month === 3 && day === 20) return { id: "spring-start", domain: "civil" };
        if (month === 6 && day === 21) return { id: "summer-start", domain: "civil" };
        if (month === 9 && day === 22) return { id: "autumn-start", domain: "civil" };
        if (month === 12 && day === 21) return { id: "winter-start", domain: "civil" };

        return null;
    }

    private getPersonalEvents(now: Date, context: GreetingContext): CelebrationEvent[] {
        const events: CelebrationEvent[] = [];

        // Check for birthday in profile
        // Assuming profile or metadata might have a birthday field in the future
        // For now, we look for a specific key in 'metadata' if passed in context
        const metadata = (context as any).metadata;
        if (metadata && metadata.birthday) {
            const bday = new Date(metadata.birthday);
            if (bday.getMonth() === now.getMonth() && bday.getDate() === now.getDate()) {
                events.push({ id: "birthday", domain: "personal" });
            }
        }

        return events;
    }

    /**
     * Extremely simplified full moon approximation
     * In a real app, this would use a more precise astronomical library
     */
    private isFullMoon(date: Date): boolean {
        const knownFullMoon = new Date(2023, 0, 7, 0, 8); // Jan 7, 2023
        const synodicMonth = 29.530588853;
        const diff = (date.getTime() - knownFullMoon.getTime()) / (1000 * 60 * 60 * 24);
        const cyclePos = (diff / synodicMonth) % 1;
        return cyclePos < 0.03 || cyclePos > 0.97;
    }
}
