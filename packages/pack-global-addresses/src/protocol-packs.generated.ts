/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated from data/packs/*.protocol.yaml by scripts/generate-address-packs.ts
 * Generated at: 2026-03-14T15:33:29.698Z
 */

import type { ProtocolPack } from "@salve/types";

export const protocolAcademicDe: ProtocolPack =
{
    id: "protocol-academic-de",
    locale: "de",
    requiredSubculture: "academic",
    domain: "academic" as const,
    sources: ["https://de.wikipedia.org/wiki/Anrede"],
    notes: "German academic protocol: Herr/Frau + highest academic title + surname. Professor absorbs Doctor in many style guides.\n",
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professorin", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
        { system: "academic" as const, code: "dr_habil", rank: 2, postalForm: "Dr. habil.", correspondenceForm: "Dr. habil." },
        { system: "academic" as const, code: "pd", rank: 3, postalForm: "PD Dr.", correspondenceForm: "Privatdozent Dr." },
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
}
;

export const protocolAcademicEl: ProtocolPack =
{
    id: "protocol-academic-el",
    locale: "el",
    requiredSubculture: "academic",
    domain: "academic" as const,
    sources: ["https://preply.com/en/blog/greek-titles/", "https://travelwithlanguages.com/blog/greek-email-letter-writing-guide.html"],
    notes: "Greek academic protocol: Αξιότιμε κύριε / Αξιότιμη κυρία + title (vocative) + surname. Professor and Doctor titles as in baseline address pack; this pack adds domain-specific rules.\n",
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Καθ.", correspondenceForm: "Καθηγητά", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Καθ.", correspondenceForm: "Καθηγήτρια", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Δρ.", correspondenceForm: "Δρ." },
    ],
    rules: [
        {
            id: "el-academic-postal",
            priority: 10,
            template: "Κύριε/Κυρία {postalTitleStack} {surname}",
            when: {
                locale: "el",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
            },
            notes: "Envelope: Κύριε or Κυρία + titles + surname.",
        },
        {
            id: "el-academic-letterhead",
            priority: 10,
            template: "Αξιότιμε κύριε {correspondenceTitleStack} {surname},",
            when: {
                locale: "el",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                titleSystem: "academic",
            },
            notes: "Female: Αξιότιμη κυρία. Title in vocative (Καθηγητά, Καθηγήτρια, Δρ.).",
        },
        {
            id: "el-academic-salutation",
            priority: 10,
            template: "{honorific} {correspondenceTitleStack} {surname}",
            when: {
                locale: "el",
                formality: ["formal", "hyperformal"],
                outputForm: "salutation",
                titleSystem: "academic",
            },
        },
    ],
}
;

export const protocolAcademicEn: ProtocolPack =
{
    id: "protocol-academic-en",
    locale: "en",
    requiredSubculture: "academic",
    domain: "academic" as const,
    sources: ["https://en.wikipedia.org/wiki/Style_(form_of_address)"],
    notes: "English academic protocol: Dear + correspondence title + surname in letterhead; Prof. / Dr. on envelope. Professor typically absorbs Doctor in salutation when both held.\n",
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Prof.", correspondenceForm: "Professor" },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr.", correspondenceForm: "Dr." },
    ],
    rules: [
        {
            id: "en-academic-postal",
            priority: 10,
            template: "{postalTitleStack} {surname}",
            when: {
                locale: "en",
                formality: ["formal", "hyperformal"],
                outputForm: "postal",
                titleSystem: "academic",
            },
            notes: "Envelope: Prof. / Dr. + surname.",
        },
        {
            id: "en-academic-letterhead",
            priority: 10,
            template: "Dear {correspondenceTitleStack} {surname},",
            when: {
                locale: "en",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                titleSystem: "academic",
            },
            notes: "Dear Professor Smith, or Dear Dr. Smith,",
        },
        {
            id: "en-academic-salutation",
            priority: 10,
            template: "{correspondenceTitleStack} {surname}",
            when: {
                locale: "en",
                formality: ["formal", "hyperformal"],
                outputForm: "salutation",
                titleSystem: "academic",
            },
            notes: "Spoken or displayed: Professor Smith / Dr. Smith.",
        },
        {
            id: "en-academic-email-opening",
            priority: 10,
            template: "Dear {correspondenceTitleStack} {surname},",
            when: {
                locale: "en",
                formality: ["formal", "hyperformal"],
                outputForm: "email_opening",
                titleSystem: "academic",
            },
        },
    ],
}
;

export const protocolDiplomaticEn: ProtocolPack =
{
    id: "protocol-diplomatic-en",
    locale: "en",
    requiredSubculture: "diplomatic",
    domain: "diplomatic" as const,
    sources: ["https://en.wikipedia.org/wiki/Style_(form_of_address)"],
    notes: "English diplomatic protocol: Your Excellency for ambassadors.\n",
    titles: [
        { system: "diplomatic" as const, code: "ambassador", rank: 1, postalForm: "H.E.", correspondenceForm: "His/Her Excellency" },
        { system: "diplomatic" as const, code: "consul", rank: 2, postalForm: "Hon.", correspondenceForm: "The Honourable" },
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
}
;

export const protocolAcademicFr: ProtocolPack =
{
    id: "protocol-academic-fr",
    locale: "fr",
    requiredSubculture: "academic",
    domain: "academic" as const,
    sources: ["https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique"],
    notes: "French academic protocol: Monsieur/Madame le/la Professeur/Docteur.\n",
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeur", gender: "male" as const },
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "Pr", correspondenceForm: "Professeure", gender: "female" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteur", gender: "male" as const },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "Dr", correspondenceForm: "Docteure", gender: "female" as const },
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
}
;

export const protocolAcademicNl: ProtocolPack =
{
    id: "protocol-academic-nl",
    locale: "nl",
    requiredSubculture: "academic",
    domain: "academic" as const,
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    notes: "Dutch academic protocol: uses predicates (Hooggeleerde, Weledelgeleerde, Zeergeleerde) based on degree level.\n",
    titles: [
        { system: "academic" as const, code: "prof", rank: 1, postalForm: "prof. dr.", correspondenceForm: "professor" },
        { system: "academic" as const, code: "dr", rank: 2, postalForm: "dr.", correspondenceForm: "dr." },
        { system: "academic" as const, code: "mr", rank: 3, postalForm: "mr.", correspondenceForm: "mr." },
        { system: "academic" as const, code: "ir", rank: 4, postalForm: "ir.", correspondenceForm: "ir." },
        { system: "academic" as const, code: "ing", rank: 5, postalForm: "ing.", correspondenceForm: "ing." },
        { system: "academic" as const, code: "drs", rank: 6, postalForm: "drs.", correspondenceForm: "drs." },
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
}
;

export const protocolJudicialNl: ProtocolPack =
{
    id: "protocol-judicial-nl",
    locale: "nl",
    requiredSubculture: "judicial",
    domain: "judicial" as const,
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    notes: "Dutch judicial protocol: Edelachtbare for judges, Weledelgestrenge for advocates.\n",
    titles: [
        { system: "judicial" as const, code: "judge", rank: 1, postalForm: "mr.", correspondenceForm: "rechter" },
        { system: "judicial" as const, code: "prosecutor", rank: 2, postalForm: "mr.", correspondenceForm: "officier van justitie" },
        { system: "judicial" as const, code: "advocate", rank: 3, postalForm: "mr.", correspondenceForm: "mr." },
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
}
;

export const globalProtocolPacks: ProtocolPack[] = [
    protocolAcademicDe,
    protocolAcademicEl,
    protocolAcademicEn,
    protocolDiplomaticEn,
    protocolAcademicFr,
    protocolAcademicNl,
    protocolJudicialNl,
];
