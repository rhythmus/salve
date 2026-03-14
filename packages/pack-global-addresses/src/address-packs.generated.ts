/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated from data/packs/*.address.yaml by scripts/generate-address-packs.ts
 * Generated at: 2026-03-14T13:23:33.047Z
 */

import type { AddressPack } from "@salve/types";

export const germanAddressPack: AddressPack =
{
    locale: "de",
    sources: ["https://de.wikipedia.org/wiki/Anrede"],
    honorifics: {
        male: "Herr",
        female: "Frau",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "Herrn {postalTitleStack} {surname}",
        letterhead: "Sehr geehrter {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {correspondenceTitleStack} {surname}",
        email_opening: "Sehr geehrte/r {honorific} {correspondenceTitleStack} {surname},",
        informal: "{firstName}",
    },
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professorin", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
        { system: "academic" as const, code: "dr_mult", rank: 2, postalForm: "Dr. Dr.", correspondenceForm: "Dr. Dr." },
    ],
    collectiveFormulas: [
        { id: "de-formal-group", formality: "formal" as const, text: "Sehr geehrte Damen und Herren", audienceKind: "group" as const },
        { id: "de-formal-public", formality: "formal" as const, text: "Sehr geehrte Damen und Herren", audienceKind: "public" as const },
        { id: "de-informal-group", formality: "informal" as const, text: "Liebe Alle", audienceKind: "group" as const },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
}
;

export const greekAddressPack: AddressPack =
{
    locale: "el",
    honorifics: {
        male: "Κύριε",
        female: "Κυρία",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "{honorific} {postalTitleStack} {surname}",
        letterhead: "Αξιότιμε {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {surname}",
        email_opening: "Αγαπητέ {honorific} {surname},",
        informal: "{firstName}",
    },
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Καθ.", correspondenceForm: "Καθηγητά", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Καθ.", correspondenceForm: "Καθηγήτρια", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Δρ.", correspondenceForm: "Δρ." },
    ],
    collectiveFormulas: [
        { id: "el-formal-group", formality: "formal" as const, text: "Κυρίες και Κύριοι", audienceKind: "group" as const },
        { id: "el-informal-group", formality: "informal" as const, text: "Αγαπητοί φίλοι", audienceKind: "group" as const },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: false,
    },
}
;

export const englishAddressPack: AddressPack =
{
    locale: "en",
    sources: ["https://en.wikipedia.org/wiki/Style_(form_of_address)"],
    honorifics: {
        male: "Mr.",
        female: "Ms.",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "{honorific} {postalTitleStack} {surname}",
        letterhead: "Dear {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {surname}",
        email_opening: "Dear {honorific} {surname},",
        informal: "{firstName}",
    },
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor" },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
    ],
    collectiveFormulas: [
        { id: "en-formal-group", formality: "formal" as const, text: "Ladies and Gentlemen", audienceKind: "group" as const },
        { id: "en-formal-public", formality: "formal" as const, text: "Dear All", audienceKind: "public" as const },
        { id: "en-informal-group", formality: "informal" as const, text: "Everyone", audienceKind: "group" as const },
        { id: "en-formal-institution", formality: "formal" as const, text: "Dear Members", audienceKind: "institution" as const },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: false,
    },
}
;

export const frenchAddressPack: AddressPack =
{
    locale: "fr",
    sources: ["https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique"],
    honorifics: {
        male: "Monsieur",
        female: "Madame",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "{honorific} {postalTitleStack} {surname}",
        letterhead: "Cher {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {surname}",
        email_opening: "Cher {honorific} {surname},",
        informal: "{firstName}",
    },
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeur", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeure", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteur", gender: "male" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteure", gender: "female" as const },
    ],
    collectiveFormulas: [
        { id: "fr-formal-group", formality: "formal" as const, text: "Mesdames, Messieurs", audienceKind: "group" as const },
        { id: "fr-formal-public", formality: "formal" as const, text: "Mesdames et Messieurs", audienceKind: "public" as const },
        { id: "fr-informal-group", formality: "informal" as const, text: "Chers amis", audienceKind: "group" as const },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: false,
    },
}
;

export const dutchAddressPack: AddressPack =
{
    locale: "nl",
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    honorifics: {
        male: "de heer",
        female: "mevrouw",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        postal: "De heer/Mevrouw {postalTitleStack} {surname}",
        letterhead: "Geachte {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {correspondenceTitleStack} {surname}",
        email_opening: "Geachte {honorific} {surname},",
        email_closing: "Met vriendelijke groet,",
        informal: "Beste {firstName}",
    },
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "prof.", correspondenceForm: "professor", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "prof.", correspondenceForm: "professor", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "dr.", correspondenceForm: "dr." },
        { system: "academic" as const, code: "mr", rank: 3, postalForm: "mr.", correspondenceForm: "mr.", gender: "male" as const },
        { system: "academic" as const, code: "ir", rank: 4, postalForm: "ir.", correspondenceForm: "ir." },
        { system: "academic" as const, code: "ing", rank: 5, postalForm: "ing.", correspondenceForm: "ing." },
        { system: "academic" as const, code: "drs", rank: 6, postalForm: "drs.", correspondenceForm: "drs." },
    ],
    collectiveFormulas: [
        { id: "nl-formal-group", formality: "formal" as const, text: "Geachte dames en heren", audienceKind: "group" as const },
        { id: "nl-formal-public", formality: "formal" as const, text: "Geachte dames en heren", audienceKind: "public" as const },
        { id: "nl-informal-group", formality: "informal" as const, text: "Beste allen", audienceKind: "group" as const },
        { id: "nl-informal-pair", formality: "informal" as const, text: "Beste", audienceKind: "pair" as const },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
}
;

export const globalAddressPacks: AddressPack[] = [
    germanAddressPack,
    greekAddressPack,
    englishAddressPack,
    frenchAddressPack,
    dutchAddressPack,
];
