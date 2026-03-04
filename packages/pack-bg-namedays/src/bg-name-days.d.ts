declare module "bg-name-days" {
    export interface NameDayResult {
        name: string;
        month: number;
        day: number;
        holiday: string;
        holidayLatin: string;
        tradition: string;
        variants: string[];
        isMoveable: boolean;
    }

    export function getAllNameDays(year?: number): NameDayResult[];
    export function getNameDay(name: string, year?: number): NameDayResult | NameDayResult[] | null;
    export function getNamesByDate(date: string | Date, year?: number): string[];
}
