import { AddressPack } from "@salve/types";

export const englishAddressPack: AddressPack = {
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
        { system: "academic", code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
    ],
    collectiveFormulas: [
        { id: "en-formal-group", formality: "formal", text: "Ladies and Gentlemen", audienceKind: "group" },
        { id: "en-formal-public", formality: "formal", text: "Dear All", audienceKind: "public" },
        { id: "en-informal-group", formality: "informal", text: "Everyone", audienceKind: "group" },
        { id: "en-formal-institution", formality: "formal", text: "Dear Members", audienceKind: "institution" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: false,
    },
};

export const germanAddressPack: AddressPack = {
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
        { system: "academic", code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor", gender: "male" },
        { system: "academic", code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professorin", gender: "female" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
        { system: "academic", code: "dr_mult", rank: 2, postalForm: "Dr. Dr.", correspondenceForm: "Dr. Dr." },
    ],
    collectiveFormulas: [
        { id: "de-formal-group", formality: "formal", text: "Sehr geehrte Damen und Herren", audienceKind: "group" },
        { id: "de-formal-public", formality: "formal", text: "Sehr geehrte Damen und Herren", audienceKind: "public" },
        { id: "de-informal-group", formality: "informal", text: "Liebe Alle", audienceKind: "group" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
};

export const frenchAddressPack: AddressPack = {
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
        { system: "academic", code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeur", gender: "male" },
        { system: "academic", code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeure", gender: "female" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteur", gender: "male" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteure", gender: "female" },
    ],
    collectiveFormulas: [
        { id: "fr-formal-group", formality: "formal", text: "Mesdames, Messieurs", audienceKind: "group" },
        { id: "fr-formal-public", formality: "formal", text: "Mesdames et Messieurs", audienceKind: "public" },
        { id: "fr-informal-group", formality: "informal", text: "Chers amis", audienceKind: "group" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: false,
    },
};

export const dutchAddressPack: AddressPack = {
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
        { system: "academic", code: "prof", rank: 1, postalForm: "prof.", correspondenceForm: "professor", gender: "male" },
        { system: "academic", code: "prof", rank: 1, postalForm: "prof.", correspondenceForm: "professor", gender: "female" },
        { system: "academic", code: "dr", rank: 2, postalForm: "dr.", correspondenceForm: "dr." },
        { system: "academic", code: "mr", rank: 3, postalForm: "mr.", correspondenceForm: "mr.", gender: "male" },
        { system: "academic", code: "ir", rank: 4, postalForm: "ir.", correspondenceForm: "ir." },
        { system: "academic", code: "ing", rank: 5, postalForm: "ing.", correspondenceForm: "ing." },
        { system: "academic", code: "drs", rank: 6, postalForm: "drs.", correspondenceForm: "drs." },
    ],
    collectiveFormulas: [
        { id: "nl-formal-group", formality: "formal", text: "Geachte dames en heren", audienceKind: "group" },
        { id: "nl-formal-public", formality: "formal", text: "Geachte dames en heren", audienceKind: "public" },
        { id: "nl-informal-group", formality: "informal", text: "Beste allen", audienceKind: "group" },
        { id: "nl-informal-pair", formality: "informal", text: "Beste", audienceKind: "pair" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
};

export const greekAddressPack: AddressPack = {
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
        { system: "academic", code: "prof", rank: 1, postalForm: "Καθ.", correspondenceForm: "Καθηγητά", gender: "male" },
        { system: "academic", code: "prof", rank: 1, postalForm: "Καθ.", correspondenceForm: "Καθηγήτρια", gender: "female" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Δρ.", correspondenceForm: "Δρ." },
    ],
    collectiveFormulas: [
        { id: "el-formal-group", formality: "formal", text: "Κυρίες και Κύριοι", audienceKind: "group" },
        { id: "el-informal-group", formality: "informal", text: "Αγαπητοί φίλοι", audienceKind: "group" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: false,
    },
};

export const globalAddressPacks: AddressPack[] = [
    englishAddressPack,
    germanAddressPack,
    frenchAddressPack,
    dutchAddressPack,
    greekAddressPack,
];
