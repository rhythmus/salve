import { CalendarPlugin, SalveEvent, SalveContextV1, EventDomainV1 } from "./types";

export interface FixedDateEventDefinition {
    id: string;
    month: number;
    day: number;
    kind: EventDomainV1;
    label?: string;
    emoji?: string;
    precedence?: number;
}

/**
 * A simple calendar plugin for fixed-date events (e.g. UN observances)
 */
export class FixedDateCalendarPlugin implements CalendarPlugin {
    public id = "fixed-date";
    private events: FixedDateEventDefinition[] = [];

    constructor(id: string = "fixed-date") {
        this.id = id;
    }

    public registerEvent(event: FixedDateEventDefinition): void {
        this.events.push(event);
    }

    public registerEvents(events: FixedDateEventDefinition[]): void {
        this.events.push(...events);
    }

    /**
     * V1-compatible celebrations
     */
    public getCelebrations(now: Date): any[] {
        const month = now.getUTCMonth() + 1; // 1-12
        const day = now.getUTCDate();

        return this.events
            .filter(e => e.month === month && e.day === day)
            .map(e => ({
                id: e.id,
                domain: e.kind, // Bridge to legacy 'domain' expected by resolveV1
                kind: e.kind,
                start: now.toISOString(),
                end: now.toISOString(),
                label: e.label,
                emoji: e.emoji,
                priority: e.precedence, // Legacy priority bridge
                precedence: e.precedence // V1 precedence
            }));
    }

    /**
     * Core-compatible resolveEvents (engine calls this)
     */
    public resolveEvents(now: Date, context: any): any[] | Promise<any[]> {
        return this.getCelebrations(now);
    }
}
