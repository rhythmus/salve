import type { SaintDefinition, NameDayEntry, MovableNameDayEntry } from "@salve/types";
import { saints } from "./saints.generated";
import { fixedEntries, movableEntries } from "./calendar.generated";

export const greekSaints: SaintDefinition[] = saints;

export function getGreekNameDayEntries(): NameDayEntry[] {
    return fixedEntries;
}

export function getGreekMovableEntries(): MovableNameDayEntry[] {
    return movableEntries;
}

export { saints, fixedEntries, movableEntries };
