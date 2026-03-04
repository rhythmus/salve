import { SaintDefinition, NameDayEntry } from "@salve/types";
import * as recurringData from "./data/recurring_namedays.json";

// Mapping Greek dates/celebrations to WikiData QIDs where possible
// Note: This is a manual seed mapping for the most common ones.
const EL_ST_MAPPING: Record<string, string> = {
    "01/01": "Q43425", // St. Basil
    "07/01": "Q43474", // St. John the Baptist
    "23/04": "Q43431", // St. George
    "21/05": "Q43437", // St. Constantine & Helen
    "29/06": "Q42023", // St. Peter & Paul
    "20/07": "Q133564", // St. Elias
    "15/08": "Q43429", // Dormition of Mary
    "26/10": "Q43534", // St. Demetrius
    "08/11": "Q312670", // Archangels Michael & Gabriel
    "30/11": "Q42493", // St. Andrew
    "06/12": "Q43107", // St. Nicholas
    "25/12": "Q345",   // Jesus (Christmas) - used for names like Emmanouil
    "27/12": "Q162908", // St. Stephen
};

/**
 * Greek Saint Definitions
 */
export const greekSaints: SaintDefinition[] = [
    {
        qid: "Q43425",
        canonicalName: "Basil of Caesarea",
        traditions: ["orthodox"],
        aliases: ["Βασίλειος", "Βασίλης", "Βάσω", "Vasilis", "Vaso"]
    },
    {
        qid: "Q43474",
        canonicalName: "John the Baptist",
        traditions: ["orthodox"],
        aliases: ["Ιωάννης", "Γιάννης", "Γιαννούλα", "Yiannis", "John"]
    },
    {
        qid: "Q43431",
        canonicalName: "George",
        traditions: ["orthodox"],
        aliases: ["Γεώργιος", "Γιώργος", "Γεωργία", "Georgios", "George"]
    },
    {
        qid: "Q43437",
        canonicalName: "Constantine the Great",
        traditions: ["orthodox"],
        aliases: ["Κωνσταντίνος", "Κώστας", "Κωστής", "Ντίνος", "Constantine", "Kostas"]
    },
    {
        qid: "Q43534",
        canonicalName: "Demetrius of Thessaloniki",
        traditions: ["orthodox"],
        aliases: ["Δημήτριος", "Δημήτρης", "Μήτσος", "Δήμητρα", "Dimitris", "Dimitra"]
    },
    {
        qid: "Q43107",
        canonicalName: "Nicholas",
        traditions: ["orthodox"],
        aliases: ["Νικόλαος", "Νίκος", "Νικολέτα", "Nikos", "Nicholas"]
    }
];

/**
 * Get name-day entries for Greek locale
 */
export function getGreekNameDayEntries(): NameDayEntry[] {
    const entries: NameDayEntry[] = [];
    const data = (recurringData as any).data || [];

    for (const item of data) {
        const dateStr = item.date.replace(/\\/g, "");
        const qid = EL_ST_MAPPING[dateStr];
        if (qid) {
            const [day, month] = dateStr.split("/").map(Number);
            entries.push({ month, day, saintQids: [qid] });
        }
    }

    return entries;
}
