import { ProtocolPack } from "@salve/types";

/**
 * Academic protocol pack for German-speaking contexts.
 *
 * German academic conventions require explicit title stacking:
 * "Herr Professor Doktor" in correspondence, "Prof. Dr." on envelopes.
 * Professor suppresses Doctor in the title stack when both are present
 * in many German letter-writing guides, but the postal form retains both.
 *
 * Source: https://de.wikipedia.org/wiki/Anrede
 */
export const protocolAcademicDe: ProtocolPack = {
    id: "protocol-academic-de",
    locale: "de",
    requiredSubculture: "academic",
    domain: "academic",
    sources: ["https://de.wikipedia.org/wiki/Anrede"],
    titles: [
        { system: "academic", code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor", gender: "male" },
        { system: "academic", code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professorin", gender: "female" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
        { system: "academic", code: "dr_habil", rank: 2, postalForm: "Dr. habil.", correspondenceForm: "Dr. habil." },
        { system: "academic", code: "pd", rank: 3, postalForm: "PD Dr.", correspondenceForm: "Privatdozent Dr." },
    ],
    rules: [
        {
            id: "de-academic-postal-formal",
            priority: 10,
            template: "Herrn {postalTitleStack} {surname}",
            when: {
                locale: "de",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
            },
        },
        {
            id: "de-academic-letterhead-formal-male",
            priority: 10,
            template: "Sehr geehrter Herr {correspondenceTitleStack} {surname},",
            when: {
                locale: "de",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                titleSystem: "academic",
            },
        },
        {
            id: "de-academic-salutation-formal",
            priority: 10,
            template: "Herr {correspondenceTitleStack} {surname}",
            when: {
                locale: "de",
                formality: ["formal", "hyperformal"],
                outputForm: "salutation",
                titleSystem: "academic",
            },
        },
    ],
    notes: "German academic protocol: Herr/Frau + highest academic title + surname. Professor absorbs Doctor in many style guides.",
};

/**
 * Academic protocol pack for Dutch-speaking contexts.
 *
 * Dutch academic titulature uses specific predicates based on degree:
 * - Weledelgeleerde (dr., mr.)
 * - Hooggeleerde (prof. dr.)
 * - Zeergeleerde (dr.)
 *
 * Source: https://nl.wikipedia.org/wiki/Aanspreekvorm
 */
export const protocolAcademicNl: ProtocolPack = {
    id: "protocol-academic-nl",
    locale: "nl",
    requiredSubculture: "academic",
    domain: "academic",
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    titles: [
        { system: "academic", code: "prof", rank: 1, postalForm: "prof. dr.", correspondenceForm: "professor" },
        { system: "academic", code: "dr", rank: 2, postalForm: "dr.", correspondenceForm: "dr." },
        { system: "academic", code: "mr", rank: 3, postalForm: "mr.", correspondenceForm: "mr." },
        { system: "academic", code: "ir", rank: 4, postalForm: "ir.", correspondenceForm: "ir." },
        { system: "academic", code: "ing", rank: 5, postalForm: "ing.", correspondenceForm: "ing." },
        { system: "academic", code: "drs", rank: 6, postalForm: "drs.", correspondenceForm: "drs." },
    ],
    rules: [
        {
            id: "nl-academic-postal-prof",
            priority: 15,
            template: "De hooggeleerde heer/vrouwe {postalTitleStack} {surname}",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
                officeRole: "professor",
            },
        },
        {
            id: "nl-academic-postal-dr",
            priority: 10,
            template: "De weledelgeleerde heer/vrouwe {postalTitleStack} {surname}",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
            },
        },
        {
            id: "nl-academic-letterhead-prof",
            priority: 15,
            template: "Hooggeleerde Heer {surname},",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                titleSystem: "academic",
                officeRole: "professor",
            },
            notes: "Female form: Hooggeleerde Vrouwe",
        },
        {
            id: "nl-academic-letterhead-dr",
            priority: 10,
            template: "Weledelgeleerde Heer {surname},",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                titleSystem: "academic",
            },
            notes: "Female form: Weledelgeleerde Vrouwe",
        },
        {
            id: "nl-academic-salutation",
            priority: 10,
            template: "{honorific} {correspondenceTitleStack} {surname}",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "salutation",
                titleSystem: "academic",
            },
        },
    ],
    notes: "Dutch academic protocol: uses predicates (Hooggeleerde, Weledelgeleerde, Zeergeleerde) based on degree level.",
};

/**
 * Academic protocol pack for French-speaking contexts.
 *
 * Source: https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique
 */
export const protocolAcademicFr: ProtocolPack = {
    id: "protocol-academic-fr",
    locale: "fr",
    requiredSubculture: "academic",
    domain: "academic",
    sources: ["https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique"],
    titles: [
        { system: "academic", code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeur", gender: "male" },
        { system: "academic", code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeure", gender: "female" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteur", gender: "male" },
        { system: "academic", code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteure", gender: "female" },
    ],
    rules: [
        {
            id: "fr-academic-postal-formal",
            priority: 10,
            template: "{honorific} le {correspondenceTitleStack} {surname}",
            when: {
                locale: "fr",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
            },
        },
        {
            id: "fr-academic-letterhead-formal",
            priority: 10,
            template: "Cher {honorific} le {correspondenceTitleStack} {surname},",
            when: {
                locale: "fr",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                titleSystem: "academic",
            },
        },
    ],
    notes: "French academic protocol: Monsieur/Madame le/la Professeur/Docteur.",
};

/**
 * Judicial protocol pack for Dutch-speaking contexts.
 *
 * Source: https://nl.wikipedia.org/wiki/Aanspreekvorm
 */
export const protocolJudicialNl: ProtocolPack = {
    id: "protocol-judicial-nl",
    locale: "nl",
    requiredSubculture: "judicial",
    domain: "judicial",
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    titles: [
        { system: "judicial", code: "judge", rank: 1, postalForm: "mr.", correspondenceForm: "rechter" },
        { system: "judicial", code: "prosecutor", rank: 2, postalForm: "mr.", correspondenceForm: "officier van justitie" },
        { system: "judicial", code: "advocate", rank: 3, postalForm: "mr.", correspondenceForm: "mr." },
    ],
    rules: [
        {
            id: "nl-judicial-letterhead-judge",
            priority: 15,
            template: "Edelachtbare Heer/Vrouwe,",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                officeRole: "judge",
            },
        },
        {
            id: "nl-judicial-postal-judge",
            priority: 15,
            template: "De edelachtbare heer/vrouwe {postalTitleStack} {surname}",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                officeRole: "judge",
            },
        },
    ],
    notes: "Dutch judicial protocol: Edelachtbare for judges, Weledelgestrenge for advocates.",
};

/**
 * Diplomatic protocol pack for multi-locale use.
 *
 * Source: https://en.wikipedia.org/wiki/Style_(form_of_address)
 */
export const protocolDiplomaticEn: ProtocolPack = {
    id: "protocol-diplomatic-en",
    locale: "en",
    requiredSubculture: "diplomatic",
    domain: "diplomatic",
    sources: ["https://en.wikipedia.org/wiki/Style_(form_of_address)"],
    titles: [
        { system: "diplomatic", code: "ambassador", rank: 1, postalForm: "H.E.", correspondenceForm: "His/Her Excellency" },
        { system: "diplomatic", code: "consul", rank: 2, postalForm: "Hon.", correspondenceForm: "The Honourable" },
    ],
    rules: [
        {
            id: "en-diplomatic-letterhead-ambassador",
            priority: 20,
            template: "Your Excellency,",
            when: {
                locale: "en",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                officeRole: "ambassador",
            },
        },
        {
            id: "en-diplomatic-postal-ambassador",
            priority: 20,
            template: "H.E. {honorific} {surname}",
            when: {
                locale: "en",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                officeRole: "ambassador",
            },
        },
    ],
    notes: "English diplomatic protocol: Your Excellency for ambassadors.",
};

export const globalProtocolPacks: ProtocolPack[] = [
    protocolAcademicDe,
    protocolAcademicNl,
    protocolAcademicFr,
    protocolJudicialNl,
    protocolDiplomaticEn,
];
