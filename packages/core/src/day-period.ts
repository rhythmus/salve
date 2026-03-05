/**
 * SALVE Day Period Resolution
 *
 * Maps hour-of-day to a DayPeriod for greeting selection.
 * Locale packs may override these ranges in the future.
 */

import { DayPeriod } from "./types";

/**
 * Default day-period boundaries (24h format).
 *
 * | Period    | Hours  |
 * |-----------|--------|
 * | night     | 00–04  |
 * | morning   | 05–10  |
 * | midday    | 11–13  |
 * | afternoon | 14–17  |
 * | evening   | 18–21  |
 * | night     | 22–23  |
 */
export function resolveDayPeriod(hour: number): DayPeriod {
    if (hour < 0 || hour > 23) {
        throw new RangeError(`Hour must be 0–23, got ${hour}`);
    }
    if (hour < 5) return "night";
    if (hour < 11) return "morning";
    if (hour < 14) return "midday";
    if (hour < 18) return "afternoon";
    if (hour < 22) return "evening";
    return "night";
}
