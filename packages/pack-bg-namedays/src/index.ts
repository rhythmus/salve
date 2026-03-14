import { getAllNameDays } from "bg-name-days";
import type { SaintDefinition, NameDayEntry } from "@salve/types";
import { saints } from "./saints.generated";
import { fixedEntries } from "./calendar.generated";

export const bulgarianSaints: SaintDefinition[] = saints;

const BG_HOLIDAY_QIDS: Record<string, string> = {};
for (const entry of fixedEntries) {
    for (const qid of entry.saintQids) {
        const saint = saints.find(s => s.qid === qid);
        if (saint) {
            BG_HOLIDAY_QIDS[saint.canonicalName] = qid;
        }
    }
}

const BG_LABEL_QIDS: Record<string, string> = {
    "Ivanovden": "Q43474",
    "Yordanovden (Bogoyavlenie)": "Q132001",
    "Nikulden": "Q43107",
    "Georgiovden": "Q43431",
    "Dimitrovden": "Q43534",
    "Petrovden": "Q42023",
    "Gergyovden": "Q43431",
    "Stefanovden": "Q162908",
};

export function getBulgarianNameDayEntries(year: number = new Date().getFullYear()): NameDayEntry[] {
    let all: any[];
    try {
        all = getAllNameDays(year);
    } catch {
        return fixedEntries;
    }

    const byDate: Record<string, string[]> = {};

    for (const item of all) {
        const qid = BG_LABEL_QIDS[item.holiday] || BG_LABEL_QIDS[item.holidayLatin];
        if (qid) {
            const dateKey = `${item.month}-${item.day}`;
            if (!byDate[dateKey]) byDate[dateKey] = [];
            if (!byDate[dateKey].includes(qid)) {
                byDate[dateKey].push(qid);
            }
        }
    }

    const entries: NameDayEntry[] = [];
    for (const [dateKey, qids] of Object.entries(byDate)) {
        const [month, day] = dateKey.split("-").map(Number);
        entries.push({ month, day, saintQids: qids });
    }

    return entries;
}

export { saints, fixedEntries };
