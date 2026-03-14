# Protocol Pack Authoring Guide

This guide explains how to create and contribute address packs and protocol packs for the Salve greeting engine.

## Pack Architecture Overview

Salve separates address data into two layers:

1.  **Baseline Address Packs** (`AddressPack`) contain ordinary civility data for a locale: honorifics like "Mr./Ms.", format patterns for postal and letterhead forms, common academic titles, collective formulas for group addressing, and title-suppression rules.  Every locale should have a baseline pack.  These are always active.

2.  **Protocol Packs** (`ProtocolPack`) contain gated institutional overlays for specific domains: academic, judicial, diplomatic, religious, military, noble, or organizational.  Protocol packs are activated only when the runtime context includes a matching `memberships.subcultures` entry and `policy.allowSubcultureAddressing` is true.


## Baseline Address Pack

A baseline pack lives in `packages/pack-global-addresses/src/address-packs.ts` (or a locale-specific file) and follows the `AddressPack` interface.

### Required Fields

| Field | Description |
|-------|-------------|
| `locale` | BCP 47 locale identifier (e.g., `nl`, `de-AT`). |
| `honorifics` | Gender-keyed honorific forms: `male`, `female`, `nonBinary` (optional), `unspecified` (optional). |
| `formats` | Template patterns for each output form: `postal`, `letterhead`, `salutation`, `informal`.  Optional: `email_opening`, `email_closing`. |

### Optional Fields

| Field | Description |
|-------|-------------|
| `extends` | Parent locale for inheritance (e.g., `de` for `de-AT`). |
| `sources` | Bibliographic or URL references.  See "Source Provenance" below. |
| `titles` | Array of `AddressPackTitle` entries for the locale's baseline civil/academic titles. |
| `collectiveFormulas` | Group address formulas (e.g., "Ladies and Gentlemen"). |
| `titleSuppression` | Rules like `informalDropsTitles` and `professorSuppressesDoctor`. |

### Template Tokens

Templates in `formats` use the following tokens:

| Token | Resolves to |
|-------|-------------|
| `{honorific}` | Gender-keyed honorific (e.g., "Herr", "mevrouw"). |
| `{titleStack}` | Titles formatted for the current output form (postal uses abbreviated, letterhead uses correspondence forms). |
| `{postalTitleStack}` | Titles in abbreviated/postal form. |
| `{correspondenceTitleStack}` | Titles in spelled-out correspondence form. |
| `{surname}` | Recipient's surname. |
| `{firstName}` | Recipient's preferred or first given name. |
| `{fullName}` | All given names + surname. |
| `{officeTitle}` | Office or role title. |
| `{initials}` | Recipient's initials. |
| `{collectiveLabel}` | Explicit collective label if provided. |

### Example

```typescript
export const dutchAddressPack: AddressPack = {
    locale: "nl",
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    honorifics: {
        male: "de heer",
        female: "mevrouw",
        nonBinary: "Mx.",
    },
    formats: {
        postal: "De heer/Mevrouw {postalTitleStack} {surname}",
        letterhead: "Geachte {honorific} {correspondenceTitleStack} {surname},",
        salutation: "{honorific} {correspondenceTitleStack} {surname}",
        informal: "Beste {firstName}",
    },
    titles: [
        { system: "academic", code: "prof", rank: 1,
          postalForm: "prof. dr.", correspondenceForm: "professor" },
        { system: "academic", code: "dr", rank: 2,
          postalForm: "dr.", correspondenceForm: "dr." },
    ],
    collectiveFormulas: [
        { id: "nl-formal-group", formality: "formal",
          text: "Geachte dames en heren", audienceKind: "group" },
    ],
    titleSuppression: {
        informalDropsTitles: true,
        professorSuppressesDoctor: true,
    },
};
```


## Protocol Packs

A protocol pack adds institutional address rules that are only active when explicitly opted into.

### Required Fields

| Field | Description |
|-------|-------------|
| `id` | Unique pack identifier (e.g., `protocol-academic-nl`). |
| `locale` | BCP 47 locale. |
| `requiredSubculture` | The subculture tag that must be present in `memberships.subcultures`. |
| `domain` | The institutional domain: `academic`, `judicial`, `diplomatic`, `religious`, `military`, `noble`, `organizational`, or `other`. |
| `titles` | Array of `AddressPackTitle` entries specific to this domain. |
| `rules` | Array of `AddressRule` entries with templates and matching conditions. |

### Rule Matching

Each `AddressRule` has a `when` clause that controls when it is selected:

| Condition | Description |
|-----------|-------------|
| `locale` | BCP 47 locale(s) this rule applies to. |
| `formality` | Required formality level(s). |
| `outputForm` | Required output form(s): `postal`, `letterhead`, `salutation`, `email_opening`, `email_closing`. |
| `officeRole` | Matches the recipient's `officeRole` field. |
| `titleSystem` | Matches if the recipient has titles from this system. |
| `relationship` | Required relationship context. |
| `audienceKind` | Required audience kind. |
| `addressMode` | `direct` or `reference`. |

Rules are matched by priority (higher wins).  When no protocol rule matches, the baseline address pack's default template is used.

### Example

```typescript
export const protocolAcademicNl: ProtocolPack = {
    id: "protocol-academic-nl",
    locale: "nl",
    requiredSubculture: "academic",
    domain: "academic",
    sources: ["https://nl.wikipedia.org/wiki/Aanspreekvorm"],
    titles: [
        { system: "academic", code: "prof", rank: 1,
          postalForm: "prof. dr.", correspondenceForm: "professor" },
    ],
    rules: [
        {
            id: "nl-academic-letterhead-prof",
            priority: 15,
            template: "Hooggeleerde Heer {surname},",
            when: {
                locale: "nl",
                formality: ["formal", "hyperformal"],
                outputForm: "letterhead",
                officeRole: "professor",
            },
        },
    ],
};
```


## Title Codes

Use canonical lowercase codes for titles to ensure cross-locale consistency.  Standard codes:

| Code | System | Description |
|------|--------|-------------|
| `prof` | academic | Professor |
| `dr` | academic | Doctor (academic doctorate) |
| `mr` | academic | Meester in de Rechten (NL) |
| `ir` | academic | Ingenieur (NL) |
| `ing` | academic | Ingenieur (HBO, NL) |
| `drs` | academic | Doctorandus (NL) |
| `judge` | judicial | Judge / Rechter |
| `prosecutor` | judicial | Prosecutor / Officier van Justitie |
| `advocate` | judicial | Advocate / Advocaat |
| `ambassador` | diplomatic | Ambassador |
| `consul` | diplomatic | Consul |

New codes should follow the pattern `[a-z][a-z0-9_]*`.


## Source Provenance

Every pack MUST include source references.  Add entries to both:

1.  The pack's `sources` field (URL or citation key).
2.  `data/data-sources.bib` in BibTeX format.

Example BibTeX entry:

```bibtex
@online{wikipedia_aanspreekvorm,
  author = {Wikipedia contributors},
  title = {Aanspreekvorm},
  url = {https://nl.wikipedia.org/wiki/Aanspreekvorm},
  organization = {Dutch Wikipedia},
  year = {2026},
  note = {Reference for Dutch-language protocols of addressing.}
}
```


## Schema Validation

Address packs and protocol packs have JSON schemas in `data/schemas/`:

-   `address-pack.schema.json` for baseline address packs.
-   `protocol-pack.schema.json` for institutional protocol packs.

If your pack data is stored as JSON or YAML, validate it against the schema before submitting.


## Roadmap: Baseline vs Gated

| Layer | What belongs here | Examples |
|-------|-------------------|----------|
| **Baseline** (`AddressPack`) | Ordinary written civility.  Active by default. | Mr./Ms., de heer/mevrouw, formal/informal patterns, common academic titles. |
| **Gated Academic** (`ProtocolPack`) | University/research addressing. | Hooggeleerde, Weledelgeleerde, Herr Professor Doktor. |
| **Gated Judicial** (`ProtocolPack`) | Court and legal addressing. | Edelachtbare, Your Honor, Monsieur le Président. |
| **Gated Diplomatic** (`ProtocolPack`) | Embassy and international addressing. | Your Excellency, Excellentie. |
| **Gated Religious** (`ProtocolPack`) | Clerical/liturgical addressing. | Your Eminence, Monseigneur.  Postponed to post-MVP. |
| **Gated Royal/Noble** (`ProtocolPack`) | Sovereign, noble, and court addressing. | Majesteit, Your Royal Highness.  Postponed to post-MVP. |

Do not mix gated institutional data into baseline packs.  This separation keeps the default engine useful and culturally correct without auto-opting users into sensitive or rare status systems.
