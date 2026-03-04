import { getAllNameDays } from "bg-name-days";
import { SaintDefinition, NameDayEntry } from "@salve/types";

// Mapping Bulgarian holiday names/slugs to WikiData QIDs
const BG_ST_MAPPING: Record<string, string> = {
    "Ivanovden": "Q43474", // St. John the Baptist
    "Yordanovden (Bogoyavlenie)": "Q132001", // Epiphany (Theophany) - associated with Jesus/John
    "Nikulden": "Q43107", // St. Nicholas
    "Georgiovden": "Q43431", // St. George
    "Dimitrovden": "Q43534", // St. Demetrius
    "Petrovden": "Q42023", // St. Peter
    "Gergyovden": "Q43431", // St. George
    "Stefanovden": "Q162908", // St. Stephen
};

/**
 * Bulgarian Saint Definitions
 */
export const bulgarianSaints: SaintDefinition[] = [
    {
        qid: "Q43474",
        canonicalName: "John the Baptist",
        traditions: ["orthodox"],
        aliases: ["Иван", "Иванка", "Ивана", "Йоαννης", "Ivan"]
    },
    {
        qid: "Q43107",
        canonicalName: "Nicholas",
        traditions: ["orthodox", "catholic"],
        aliases: ["Никола", "Николай", "Николина", "Nikola", "Nicholas"]
    },
    {
        qid: "Q43431",
        canonicalName: "George",
        traditions: ["orthodox"],
        aliases: ["Георγι", "Георги", "Гергана", "Georgi", "George"]
    },
    {
        qid: "Q43534",
        canonicalName: "Demetrius of Thessaloniki",
        traditions: ["orthodox"],
        aliases: ["Димитър", "Димитрина", "Dimităr", "Dimitri"]
    }
];

/**
 * Get name-day entries for Bulgarian locale
 */
export function getBulgarianNameDayEntries(year: number = new Date().getFullYear()): NameDayEntry[] {
    const all = getAllNameDays(year);
    const entries: NameDayEntry[] = [];

    // Group by date
    const byDate: Record<string, string[]> = {};

    for (const item of all) {
        const qid = BG_ST_MAPPING[item.holiday] || BG_ST_MAPPING[item.holidayLatin];
        if (qid) {
            const dateKey = `${item.month}-${item.day}`;
            if (!byDate[dateKey]) byDate[dateKey] = [];
            if (!byDate[dateKey].includes(qid)) {
                byDate[dateKey].push(qid);
            }
        }
    }

    for (const [dateKey, qids] of Object.entries(byDate)) {
        const [month, day] = dateKey.split("-").map(Number);
        entries.push({ month, day, saintQids: qids });
    }

    return entries;
}
