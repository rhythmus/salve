# Salve: Universal Greeting and Cultural Awareness Engine

Salve Project                                                 W. Soudan
Internet-Draft                                            Salve Project
Category: Standards Track                                  5 March 2026
Version: 1.0.0-draft

## Abstract

This document specifies the Salve Universal Greeting and Cultural
Awareness Engine ("Salve").  Salve is a modular, data-driven,
calendar-aware, multi-tradition greeting system designed to generate
culturally and temporally appropriate greetings.

This specification defines the functional requirements, architectural
boundaries, data pack system, calendar plugin framework, event
resolution model, address protocol, rendering and localization model,
memory and suppression model, distribution model, name-day resolution
system, command-line interface (CLI) tooling, and developer
transparency mechanisms of the Salve system.

## Status of This Memo

This document is a Draft Specification for the Salve project.  It is
not an Internet Standards Track document.  It is published for
informational and implementation reference purposes.

## Table of Contents

1.  Introduction
2.  Requirements Language
3.  Terminology and Conventions
4.  System Overview
5.  Design Principles
6.  Functional Requirements
7.  Non-Functional Requirements
8.  Architectural Model
9.  Monorepo Organization
10. Core Engine Specification
11. Calendar Plugin Framework
12. Day Period Resolution
13. Event Resolution Model
14. Address Protocol and Honorific Resolution
15. Rendering and Localization Model
16. Memory and Suppression Model
17. Data Pack Architecture
18. Pack Distribution and Registry
19. Loader and Integrity Model
20. Name-Day Subsystem Specification
21. Name Normalization and Fuzzy Resolution
22. Registry and Loader Architecture
23. CLI Tooling Specification
24. Demo and Developer Mode Requirements
25. Advanced Architecture (v1)
26. Geographic Locale Mapping Subsystem
27. Extensibility Model
28. Performance Requirements
29. Internationalization Considerations
30. Security Considerations
31. Future Considerations
32. References
33. Author's Address

## 1.  Introduction

Standard internationalization (i18n) workflows often result in
"cultural flattening," where generic phrases are translated literally
and cultural nuances are lost.  Salve addresses this problem by
providing culturally intelligent greetings based on time, location,
tradition, and user identity.

The system operates deterministically and does not depend on external
Application Programming Interfaces (APIs) for core functionality.
All greeting data and calendar computations are local, ensuring
offline capability, privacy, and reproducibility.

Salve supports:

   -  Multi-calendar systems (Gregorian, Hijri, Orthodox Pascha,
      Western Easter, Chinese lunisolar, and user-defined calendars).
   -  Multi-language rendering via BCP 47 [BCP47] locale identifiers.
   -  Multi-script output (native, Latin transliteration, simplified,
      and traditional variants).
   -  Multi-tradition resolution (civil, religious, personal, seasonal,
      and protocol events).
   -  Diaspora blending scenarios (multiple cultural affiliations
      resolved simultaneously).

The system is designed to be embedded in any JavaScript or TypeScript
application, whether browser-based, server-side, or command-line.

## 2.  Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in
BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all
capitals, as shown here.

## 3.  Terminology and Conventions

The following terms are used throughout this document:

   Core Engine:  The greeting resolution engine responsible for
      selecting and composing greetings.

   Calendar Plugin:  A module that computes date rules for a specific
      calendar system and emits semantic events.

   Pack:  A cultural dataset module containing greeting lexicon entries,
      event definitions, or address formatting rules for a specific
      locale or tradition.

   GreetingPack:  A structured JavaScript Object Notation (JSON) file
      containing an ordered list of greeting entries for a single
      BCP 47 locale.

   HonorificPack:  A structured dataset containing locale-specific
      honorific titles, gender-keyed address forms, and format
      templates for composing formal and informal address strings.

   Saint Identity:  A stable canonical identifier (WikiData QID) used
      as the pivot for name-day resolution.

   Alias Index:  A normalized name-to-identity mapping dataset used for
      fuzzy name-day matching.

   Manifest:  A registry file describing available packs, their
      versions, and integrity hashes.

   SCNA:  Salve Context Normalization Algorithm.  The pre-processing
      step that converts partial developer input into a fully resolved
      NormalizedContext.

   ScoreTuple:  A six-field lexicographic tuple used for deterministic
      greeting rule selection.

   DayPeriod:  A classification of the current hour into one of five
      named periods: morning, midday, afternoon, evening, or night.

   Membership:  A strong, identity-level cultural affiliation declared
      by the user (e.g., "I am Orthodox").  Memberships gate access
      to tradition-specific events.

   Affinity:  A weak, interest-level cultural association declared by
      the user (e.g., "I have an interest in Japan").  Affinities
      produce supplementary "extra" items, never primary greetings.

   TransformHook:  A function that applies locale-specific linguistic
      transformations to address components (e.g., Greek vocative
      case inflection).

   StylePack:  A dataset providing template overrides for a specific
      rhetorical register, enabling style-based greeting
      transformations.

   Call-Response Pair:  A greeting pattern where the initiator's
      utterance has a culturally prescribed reply (e.g., the Greek
      Paschal greeting "Christos Anesti" and its response "Alithos
      Anesti").

   Protocol Pack:  An opt-in data module containing greetings specific
      to institutional or socio-political subcultures (e.g., military,
      academic, diplomatic).

## 4.  System Overview

Salve consists of the following major subsystems:

   -  Core Engine
   -  Calendar Plugin Layer
   -  Data Pack Layer
   -  Address Protocol Layer
   -  Style Engine
   -  Registry and Loader Layer
   -  Name-Day Subsystem
   -  CLI Tooling
   -  Demo and Developer Mode

The Core Engine MUST remain lightweight and MUST NOT embed large
datasets.  Cultural data is strictly separated into packs that are
loaded on demand.

## 5.  Design Principles

Salve MUST adhere to the following principles:

   1.  Data-Driven Design:  All greeting content resides in
       declarative, schema-validated JSON packs, never in executable
       source code.

   2.  Separation of Concerns:  The resolution engine (logic) is
       strictly separated from greeting data (packs) and calendar
       computation (plugins).

   3.  Calendar-Agnostic Architecture:  The engine operates
       exclusively on Gregorian instants internally.  Non-Gregorian
       calendars are handled by pluggable calculator modules.

   4.  Language-Agnostic Rendering:  The engine does not assume any
       specific human language.  All linguistic content is supplied
       by data packs.

   5.  Offline Capability:  The system MUST function fully offline
       when packs are bundled as npm modules.

   6.  Deterministic Behavior:  The engine MUST produce identical
       outputs for identical inputs.  No randomness is introduced
       at any stage.

   7.  Selective Payload Inclusion:  Applications load only the packs
       relevant to their users.  The core engine ships no cultural
       data itself.

   8.  Explicit Configuration:  Cultural affiliations, traditions,
       and policy constraints MUST be explicitly declared by the
       consuming application; they are never inferred.

   9.  Maximal Cultural Specificity:  The engine MUST default to
       the most specific culturally, temporally, and traditionally
       grounded greeting available.  Generic fallbacks (e.g.,
       "Hello") are used only when no specialized greeting exists
       or when explicitly suppressed by policy.  This principle
       is a deliberate architectural choice to restore cultural
       nuances and ensure that software feels naturally embedded
       in each user's tradition.

   10. Reuse-vs-Build Boundaries:  Following the "Don't Reinvent
       the Wheel" principle, Salve explicitly defines its scope.
       The system delegates locale identifiers, scripts,
       likelySubtags, date/time formatting, and plural rules to
       CLDR, ICU, and the Intl API [CLDR].  Salve builds internally
       only what these standards do not provide: computus and event
       semantics, cultural modeling, greeting lexicon management,
       and anti-repetition logic.

   11. Salutation Layer Decoupling:  The greeting phrase and the
       address form are resolved independently and composed at the
       final stage.  This separation allows the engine to maintain
       correctness in highly regulated address systems (e.g.,
       German, French) without duplicating greeting logic.

   12. Standards-First Compatibility:  Data packs mirror the
       Unicode Common Locale Data Repository (CLDR) [CLDR]
       hierarchical locale model and use BCP 47 [BCP47] identifiers.
       Salve is designed as a complementary layer to existing
       date/time libraries, not a replacement.

## 6.  Functional Requirements

### 6.1.  Greeting Generation

The system MUST generate exactly one primary greeting per invocation.
Additional "extras" (e.g., affinity reminders) MAY be returned as
secondary items alongside the primary greeting.

### 6.2.  Event Resolution

The engine MUST:

   -  Resolve all applicable events for a given date and timezone.
   -  Filter events by the user's declared cultural affiliations.
   -  Apply priority ordering based on event domain and specificity.

### 6.3.  Multi-Tradition Support

The engine MUST support simultaneous activation of multiple
traditions.  For example, a user may declare both "orthodox" and
"civil" affiliations, and the engine MUST resolve events from both
traditions.

### 6.4.  Multi-Calendar Support

The system MUST support:

   -  Gregorian fixed dates and Nth-weekday rules.
   -  Western Easter offset rules.
   -  Orthodox Pascha offset rules.
   -  Hijri (Islamic) calendar dates.
   -  Chinese lunisolar dates.
   -  Solar term calculations.
   -  User birthday and anniversary rules.

### 6.5.  Name-Day Support

The system MUST resolve name-days using canonical saint identifiers
(WikiData QIDs) as the stable pivot between dates and personal names.

### 6.6.  Repetition Suppression

The system MUST support event-level suppression policies.  Once a
greeting has been delivered for a specific event within a configured
window, the engine MUST NOT repeat it until the window expires.

### 6.7.  Address Construction

The system MUST construct locale-appropriate address strings by
combining honorifics, academic titles, and names according to the
locale's formatting conventions and the interaction's formality
level.  See Section 14 for the full specification.

### 6.8.  Call-Response Pairs

The system MUST support greeting patterns that include a culturally
prescribed response.  When a greeting entry carries an
"expectedResponse" field, the engine MUST surface this text to the
consumer alongside the primary greeting.  Examples include:

   -  Greek Paschal: "Χριστός Ανέστη" → "Αληθώς Ανέστη"
   -  Arabic Eid: "عيد مبارك" → "الله أكبر"
   -  Arabic Ramadan: "رمضان كريم" → "الله أكرم"

### 6.9.  Data Schema Compatibility

Greeting data MUST be stored in JSON files whose structure translates
naturally to LDML XML.  Each greeting entry MUST support the
following attributes in addition to the fields listed in
Section 17.2:

   -  "type":  The speech-act category of the greeting.
   -  "phase":  Interaction phase ("encounter" for arrivals, "parting" for
      departures, or "making acquaintance" for introductions).
   -  "role":  Interaction role ("initiator" or "responder").
   -  "relationship":  Applicable social relationship contexts.
   -  "setting":  Applicable interaction settings (e.g., "chat",
      "email", "direct_address").

## 7.  Non-Functional Requirements

### 7.1.  Performance

The core package SHOULD remain under a minimal footprint when no packs
are included.  Greeting resolution SHOULD complete within single-digit
milliseconds for typical configurations.

### 7.2.  Modularity

Each pack MUST be independently publishable as an npm module or
static JSON file.

### 7.3.  Determinism

The engine MUST produce consistent outputs for identical inputs across
all supported runtime environments.

### 7.4.  Offline Operation

The system MUST function fully offline when packs are bundled with the
application.

## 8.  Architectural Model

The architecture SHALL be layered as follows:

   -  Core Engine:  Greeting resolution, scoring, and composition.
   -  Plugin Interfaces:  Calendar plugins, name transforms, and
      style packs.
   -  Data Packs:  Greeting lexicons, event definitions, honorific
      packs, and address formatting rules.
   -  Registry Layer:  Pack registry, event namespace registry,
      greeting rule registry, and component loader.
   -  Loader Abstraction:  Pack discovery, fetching, caching, and
      integrity verification.
   -  Distribution Layer:  npm modules and/or static JSON served from
      a Content Delivery Network (CDN).

No layer SHALL directly depend on implementation details of another
layer beyond defined TypeScript interfaces.

## 9.  Monorepo Organization

The repository SHALL include the following packages:

   -  @salve/core:  Resolution engine, scoring, normalization,
      address resolver, style engine.
   -  @salve/types:  Shared TypeScript interfaces and type
      definitions.
   -  @salve/registry:  Pack registry, event registry, greeting rule
      registry, and component loader.
   -  @salve/loader:  Remote pack fetching, caching, and integrity
      verification.
   -  @salve/calendars-gregorian:  Gregorian calendar plugin (fixed
      dates, Nth-weekday, seasonal transitions).
   -  @salve/calendars-pascha:  Orthodox and Western Easter
      calculations.
   -  @salve/calendars-hijri:  Tabular Islamic calendar conversion.
   -  @salve/calendars-specialty:  Solar terms, personal milestones,
      astronomical events.
   -  @salve/pack-*:  Locale-specific greeting data packs.
   -  @salve/pack-global-addresses:  Base honorific packs for key
      locales.
   -  @salve/pack-el-namedays:  Greek name-day data.
   -  @salve/pack-bg-namedays:  Bulgarian name-day data.
   -  @salve/plugin-nameday:  Local name-day resolution plugin.
   -  @salve/plugin-nameday-remote:  Remote name-day resolution
      plugin.
   -  @salve/demo:  Reference demo application.
   -  @salve/devtools:  Developer tools overlay.
   -  @salve/cli:  Command-line interface.

Each package SHALL be independently versioned and publishable.

## 10.  Core Engine Specification

### 10.1.  Legacy API

The legacy API provides a single asynchronous method:

      resolve(context: GreetingContext): Promise<GreetingResult>

This method accepts a flat context object containing date, locale,
affiliations, formality, and an optional address profile.  When
fields are omitted, the engine applies the following defaults:

   -  affiliations: ["civil", "secular"]
   -  relationship: "stranger"
   -  formality: "formal"
   -  suppressions: []

The legacy API returns a GreetingResult containing:

   -  "greeting":  The greeting phrase.
   -  "address":  The formatted address string.
   -  "salutation":  The composed greeting + address string.
   -  "expectedResponse":  The call-response reply text, if
      applicable.
   -  "metadata":  An object with eventId, domain, locale, score,
      and a trace array for debugging.

### 10.2.  v1 API

The v1 API provides an asynchronous method with structured input
and output:

      resolveV1(input: SalveContextV1): Promise<SalveOutputV1>

This method executes the eight-stage deterministic pipeline
described in Section 25.3.  Its structured output is described in
Section 25.7.

### 10.3.  API Coexistence

Both APIs coexist and share the same engine instance.  The legacy
API uses a simpler internal matching path; the v1 API uses the full
deterministic pipeline with ScoreTuple-based scoring.  Future
versions MAY deprecate the legacy API.  Consumers are RECOMMENDED
to use the v1 API for new integrations.

### 10.4.  Registration Methods

The engine provides the following registration methods:

   -  registerPlugin(plugin):  Register a calendar plugin.
   -  registerPack(pack):  Register a locale-specific greeting
      pack (legacy GreetingPack format).
   -  registerHonorifics(pack):  Register a locale-specific
      honorific pack for address construction.
   -  registerTransform(locale, hook):  Register a linguistic
      transformation hook for a locale (e.g., vocative case).
   -  registerStylePack(pack):  Register a style transformation
      pack for rhetorical rendering.
   -  registerGreetingRules(packId, locale, rules, precedence):
      Register ontology-aware greeting rules for the v1 pipeline.
   -  use(components):  Auto-categorize and register an array of
      mixed components via the SalveLoader.

## 11.  Calendar Plugin Framework

Calendar plugins MUST implement the CalendarPlugin interface:

      interface CalendarPlugin {
          id: string;
          resolveEvents(now: Date, context: GreetingContext):
              CelebrationEvent[] | Promise<CelebrationEvent[]>;
      }

Calendar plugins MUST:

   -  Provide deterministic date resolution.  Given the same date
      and timezone, a plugin MUST always return the same events.
   -  Be pure and side-effect free.
   -  Not embed lexicon data.  Calendar plugins emit semantic events;
      greeting text is supplied by data packs.

Calendar plugins MAY implement any of the following rule types:

   -  Gregorian fixed-date rules.
   -  Easter offset rules (Western computation).
   -  Pascha offset rules (Orthodox computation).
   -  Hijri conversion rules (tabular or Umm al-Qura).
   -  Lunar computation rules (Chinese lunisolar).
   -  Nth-weekday-of-month rules (e.g., Thanksgiving).
   -  Solar term rules.
   -  Personal milestone rules (birthdays, anniversaries).

Each CelebrationEvent emitted by a plugin MUST include:

   -  "id":  A stable string identifier (e.g., "christmas",
      "eid_al_fitr", "birthday").
   -  "domain":  One of "personal", "religious", "civil",
      "temporal", or "cultural_baseline".

Each CelebrationEvent MAY include:

   -  "tradition":  A tradition tag for affiliation filtering
      (e.g., "islam", "orthodox").
   -  "priority":  A numeric priority hint.
   -  "metadata":  Arbitrary key-value data.

### 11.1.  Example: Fixed Holiday Plugin

The following illustrative example shows a minimal calendar plugin
that emits a single civil event on a fixed date:

      class MyTraditionPlugin implements CalendarPlugin {
          id = "my-tradition";
          resolveEvents(now: Date) {
              if (now.getMonth() === 5 && now.getDate() === 15) {
                  return [{ id: "my_special_day", domain: "civil" }];
              }
              return [];
          }
      }

Plugin authors SHOULD follow this pattern: check the date against
the rule, return matching CelebrationEvents, and return an empty
array otherwise.  More complex plugins (e.g., Pascha, Hijri) apply
calendar-specific algorithms but follow the same interface contract.

## 12.  Day Period Resolution

The engine classifies the current local hour into one of five
named day periods.  Day period resolution is a key input to
greeting selection, as most cultures distinguish greetings by
time of day.

### 12.1.  Hour Boundaries

The following fixed boundaries SHALL be used:

   | Hour Range  | DayPeriod   |
   |-------------|-------------|
   | 00:00-04:59 | night       |
   | 05:00-10:59 | morning     |
   | 11:00-13:59 | midday      |
   | 14:00-17:59 | afternoon   |
   | 18:00-21:59 | evening     |
   | 22:00-23:59 | night       |

### 12.2.  Design Rationale

These boundaries are intentionally fixed and NOT locale-dependent.
While cultural perceptions of "morning" and "evening" vary, using
fixed boundaries ensures deterministic behavior and avoids the
complexity of maintaining per-locale boundary tables.  Pack authors
who wish to refine time sensitivity can use the "eventRef" field to
bind greetings to specific calendar-emitted temporal events.

### 12.3.  Local Hour Computation

The local hour MUST be computed using the Intl.DateTimeFormat API
with the resolved timezone from the SCNA (Section 25.3).  If the
Intl API is unavailable, the engine SHALL fall back to the UTC hour.

## 13.  Event Resolution Model

Event resolution MUST proceed in the following order:

   1.  Identify all candidate events active at the given date and
       time from all registered calendar plugins.
   2.  Filter candidates by the user's declared tradition tags
       (e.g., "orthodox", "islam", "civil").
   3.  Filter candidates by jurisdiction (e.g., "de-DE", "el-GR").
   4.  Apply user-specific constraints (e.g., birthday, name-day).
   5.  Sort remaining candidates by domain priority (personal >
       religious > civil > seasonal > temporal > cultural_baseline).
   6.  Apply suppression rules from the memory store.
   7.  Select the highest-priority unsuppressed candidate.

### 13.1.  Domain Priority Hierarchy

The following domain priority order is normative, from highest to
lowest:

   1.  personal (priority ~1000):  Birthdays, name-days,
       anniversaries.
   2.  religious (priority ~500):  Tradition-specific holidays
       (Easter, Eid, Ramadan, etc.).
   3.  civil (priority ~300):  National holidays, bank holidays.
   4.  seasonal (priority ~200):  Equinoxes, solstices.
   5.  temporal (priority ~100):  Time-of-day periods.
   6.  cultural_baseline (priority ~0):  Neutral fallback greetings
       with no event binding.

### 13.2.  Memberships vs. Affinities in Event Filtering

Memberships and affinities serve distinct roles in event filtering:

   Memberships are strong, identity-level affiliations.  When a user
   declares a membership (e.g., traditions: ["orthodox", "islam"]),
   events from those traditions participate in the primary greeting
   resolution.  The policy flag "requireExplicitTraditionsForReligious"
   (default: true) ensures that religious events ONLY fire when the
   user has explicitly declared matching tradition memberships.  This
   prevents culturally inappropriate greetings.

   Affinities are weak, interest-level associations.  When a user
   declares affinities (e.g., locales: ["ja"], tags: ["anime"]),
   these do NOT affect the primary greeting.  Instead, when the
   policy flag "allowExtras" is true, the engine MAY produce
   supplementary "extra" items (see Section 25.7) as informational
   reminders (e.g., "Today is also Setsubun in Japan").

   This separation is a deliberate design choice: a user living in
   Belgium with an interest in Japan should receive a Belgian
   greeting as their primary result, with an optional Japanese
   festival reminder as an extra — never a Japanese greeting as the
   primary output.

## 14.  Address Protocol and Honorific Resolution

The Address Protocol is responsible for constructing locale-appropriate
address strings.  It combines honorifics, academic and professional
titles, and names according to the locale's formatting conventions
and the interaction's formality level.

### 14.1.  HonorificPack Structure

A HonorificPack MUST include:

   -  "locale":  A BCP 47 locale identifier.
   -  "titles":  A gender-keyed object with the following fields:
      -  "male":  Honorific for male-identified persons (e.g., "Mr",
         "Herr", "Κύριε").
      -  "female":  Honorific for female-identified persons (e.g.,
         "Ms", "Frau", "Κυρία").
      -  "nonBinary":  Honorific for nonbinary persons (OPTIONAL;
         e.g., "Mx").
      -  "unspecified":  Default honorific when gender is unknown
         (OPTIONAL).
   -  "formats":  A template object with the following fields:
      -  "formal":  Template for formal address (e.g.,
         "{fullHonorific} {lastName}").
      -  "informal":  Template for informal address (e.g.,
         "{firstName}").
      -  "standard":  Template for standard address (e.g.,
         "{firstName} {lastName}").

### 14.2.  Template Expansion

Address templates use brace-delimited placeholders.  The following
variables are available during expansion:

   -  {firstName}:  The person's first given name.
   -  {lastName}:  The person's surname.
   -  {honorific}:  The gender-resolved base honorific (e.g., "Herr").
   -  {academicTitles}:  Space-joined academic titles (e.g.,
      "Dr. Prof.").
   -  {fullHonorific}:  Concatenation of honorific + academic titles
      (e.g., "Herr Dr.").
   -  {role}:  Professional role, if provided.

After placeholder expansion, the engine MUST collapse multiple
consecutive spaces into one and trim leading/trailing whitespace.

### 14.3.  Formality-Based Format Selection

The engine selects a format template based on the interaction's
formality level:

   -  "formal":  Uses the "formal" template from the HonorificPack.
   -  "informal" or "neutral":  Uses the "informal" template.

### 14.4.  Safety Ladder

To avoid culturally jarring results, the engine implements a "Safety
Ladder" — a set of fallback rules when address data is incomplete:

   1.  Formal context + no surname:  The address block is dropped
       entirely.  An empty string is returned rather than risk
       constructing an incorrect formal address.
   2.  No HonorificPack for the locale:  The engine attempts a base
       locale lookup (e.g., "de" for "de-DE").
   3.  No HonorificPack at any level:  The engine falls back to a
       minimal address using "Mx. {lastName}" for formal contexts
       or "{firstName}" for informal contexts.

### 14.5.  Linguistic Transformation Hooks

The engine supports locale-specific TransformHooks that modify
address components after template expansion but before final
composition.  A TransformHook is a function with the signature:

      (value: string, key: string, profile: AddressProfile) => string

Hooks are registered per locale and are applied to every field
in the address map.  The primary use case is morphological
inflection — for example, converting Greek names to the vocative
case (e.g., "Γεώργιος" → "Γεώργιε") when the greeting requires a
direct-address form.

Hooks are looked up with locale fallback: the engine first checks
for hooks registered to the exact locale (e.g., "el-GR"), then
falls back to the base language (e.g., "el").

### 14.6.  Academic and Professional Titles

When an AddressProfile includes academic or professional titles,
these are concatenated with the honorific in formal address
construction.  For example:

   -  German formal: "Herr" + "Dr." → "Herr Dr. Müller"
   -  English formal: "Prof." + "Dr." → "Prof. Dr. Smith"

The engine constructs a "fullHonorific" variable containing the
combined honorific and academic titles, available as
{fullHonorific} in format templates.

### 14.7.  Title System (SalveTitle)

The v1 API supports a structured title system via the SalveTitle
interface:

   -  "system":  One of "academic", "civil", "religious", "military",
      or "other".
   -  "code":  The title code (e.g., "dr", "prof", "gen").

Title codes are normalized to lowercase during context
normalization.  Title resolution order follows the system hierarchy:
academic titles take precedence, followed by civil, religious, and
military titles.

## 15.  Rendering and Localization Model

Rendering MUST:

   -  Use BCP 47 [BCP47] language codes for all locale identification.
   -  Support script variants (e.g., Latin transliteration alongside
      native script).
   -  Support formal, informal, and neutral register forms.
   -  Inject parameters into greeting templates (e.g., {name},
      {title}).
   -  Apply locale-specific punctuation rules (e.g., comma placement
      between greeting and address).

### 15.3.  Embedded Transliterations (Multi-Script)

To simplify data maintenance for multi-script locales, Salve
supports embedding transliterations directly within a greeting
entry. When a greeting pack entry contains keys that match a
BCP 47 locale pattern (e.g., "el-Latn", "sr-Cyrl"), the generator
collects these into a structured "transliterations" object in the
resulting registry.

This mechanism allows a single rule to govern multiple script
representations of the same greeting, ensuring that formality,
phase, and other metadata remain synchronized across all scripts.

The system SHOULD use CLDR-compatible Intl APIs (Intl.DateTimeFormat,
Intl.PluralRules) for date and number formatting where available.

### 15.1.  Locale Fallback Chain

The engine builds a locale fallback chain by progressively stripping
BCP 47 subtags from right to left.  A "root" sentinel is always
appended as the final fallback token.

Examples:

   -  "nl-BE" → ["nl-BE", "nl", "root"]
   -  "zh-Hant-TW" → ["zh-Hant-TW", "zh-Hant", "zh", "root"]
   -  "en" → ["en", "root"]

Pack lookup uses this chain: the first pack found for any locale in
the chain wins.  This ensures that "de-AT" can inherit from "de" if
no Austria-specific pack is available.

### 15.2.  Punctuation Rules

The engine applies locale-specific punctuation rules when composing
the final salutation string from greeting and address components.
This includes:

   -  Comma placement between greeting and name (e.g., "Guten Morgen,
      Jan" in German vs. "Good morning Jan" in English).
   -  Exclamation mark conventions.
   -  Whitespace conventions.

## 16.  Memory and Suppression Model

The engine MUST support:

   -  Event-level suppression keys (e.g., "birthday:1990-04-12:2026",
      "holiday:de:unity_day:2026-10-03").
   -  Time-bound suppression with configurable expiration policies.
   -  First-visit detection for one-time greetings.

Memory MUST be pluggable.  The engine defines a GreetingMemory
interface:

      interface GreetingMemory {
          has(key: string): boolean;
          record(key: string, ttlMs?: number): void;
          clear(): void;
      }

Consumers provide the storage implementation (e.g., localStorage,
in-memory Map, or database-backed).  The engine core does not bundle
any concrete memory provider.

### 16.1.  Repetition Policy (v1)

The v1 context includes a "policy.repetition" object with:

   -  "windowedGreetings":  Boolean enabling time-windowed repetition
      suppression (default: false).
   -  "maxSameRulePerDays":  Maximum number of days the same greeting
      rule may fire consecutively (default: 3).

## 17.  Data Pack Architecture

### 17.1.  Single Source of Truth

All greeting data MUST be maintained as canonical JSON files in the
repository's "data/packs/" directory.  These files constitute the
single source of truth from which all downstream artifacts —
TypeScript packs, published npm modules, and remote JSON
distributions — are generated.

    -  `[locale].greetings.yaml`:  Contains lexicon and rules for a
       specific language.
    -  `[locale].regions.yaml`:  Contains geographic boundaries for a
       specific area.
    -  `[tradition].events.yaml`:  Contains greetings for shared
       celebrations across multiple locales (e.g., `christian.events.yaml`).

### 17.2.  Pack Structure

A `[locale].greetings.yaml` Pack MUST include:

   -  "locale":  A BCP 47 locale identifier (REQUIRED).
   -  "greetings":  A non-empty array of greeting entries (REQUIRED).


A `[locale].regions.yaml` Pack MUST include:
 
    -  "regions":  An array of RegionDefinitions (REQUIRED).
 
Each Pack MAY include:

    -  "locale":  A BCP 47 locale identifier. If present, it acts as
       the default locale for all greetings in the pack.
    -  "sources":  A string or array of strings providing source 
       information. If present, it acts as the default source for 
       all greetings unless explicitly overridden.

   -  "extends":  A parent locale identifier for inheritance
      (e.g., "de" for "de-AT").

Each greeting entry MUST include:

   -  "id":  A stable unique identifier within the pack
      (e.g., "de_morning").
   -  "text":  The greeting phrase in the locale's native script.

Each greeting entry MAY include:

   -  "eventRef":  A reference to a CelebrationEvent identifier.
   -  "expectedResponse":  The prescribed reply for call-response
      greeting patterns (see Section 6.8).
   -  "formality":  A constraint ("highly informal", "informal", "neutral", "formal", or "hyperformal").
   -  "phase":  An interaction phase constraint ("encounter", "parting", or "making acquaintance").
   -  "role":  An interaction role ("initiator" or "responder").
   -  "relationship":  An array of applicable relationship contexts
      ("stranger", "acquaintance", "friend", "family", "superior",
   -  "setting":  An array of applicable interaction settings
      ("direct_address", "group_address", "public_announcement",
      "chat_message", "email_opening", "email_closing", "ui",
      "chat", "email", or "phone").
   -  "metadata": A free-form key-value dictionary (Record<string, unknown>)
      for storing pack-specific supplementary data (e.g., custom flags,
      WikiData references, or legacy string mappings) not governed by
      core engine constraints.

### 17.3.  JSON Schema Validation

A JSON Schema (Draft 2020-12) [JSON-SCHEMA] SHALL be maintained at
"data/greeting-pack.schema.json".  All pack files MUST reference this
schema via the "$schema" property and MUST validate against it.

The schema enforces structural constraints including identifier
patterns, string length minimums, and enumeration values.  This allows
contributors to validate edits without running TypeScript.

### 17.4.  Generator Pipeline

A generator script ("scripts/generate-demo-packs.ts") SHALL scan the
"data/packs/" directory for both `*.greetings.yaml` and
`*.regions.yaml` files, validate each according to its schema, and
emit a TypeScript module ("packs.generated.ts") that exports bundled
registries for the demo application.

The generator MUST:

   -  Parse and validate each JSON file.
   -  Fail with a descriptive error on malformed input.
   -  Produce type-safe output importing from @salve/types.

### 17.5.  Distribution Constraints

Packs MUST NOT contain executable code when distributed as remote
JSON.  Pack files MAY include additional metadata (saint registry,
alias partitions) as separate JSON files following the same
validation model.

### 17.6.  Pack Authoring Best Practices

Contributors extending Salve's cultural intelligence SHOULD follow
these guidelines when creating new packs:

   -  Template Parameters:  Use "{name}" or "{address}" in greeting
      text when the template requires them.  The engine constructs
      the salutation automatically when an address is resolved.
   -  Formality Axis:  Provide both "formal" and "informal" variants
      of the same greeting where the target culture distinguishes
      register levels.
   -  Script Variants:  If a language uses multiple scripts (e.g.,
      Greek native vs. Latin transliteration), contributors SHOULD
      use embedded transliteration keys (e.g., "el-Latn") directly
      within the greeting entry. This allows the primary "text" to 
      remain the native script while providing alternatives without
      duplicating metadata. See Section 15.3 for technical details.

### 17.7.  Hybrid Event Distribution Model

Salve MUST distinguish between global and regional event greetings
using a hybrid storage model:

   1.  Tradition-Based (Global):  Greetings for cross-cultural
       celebrations (e.g., Christmas, Eid al-Fitr, Lunar New Year)
       MUST be stored in tradition-specific files (e.g.,
       "christian.events.yaml"). These files contain greetings for
       multiple locales sharing the same tradition.

   2.  Locale-Based (Regional):  Greetings for events unique to a
       specific geography or nation (e.g., Greek Independence Day,
       Dutch King's Day) MUST be stored in locale-specific event
       files (e.g., "el-GR.events.yaml").

This separation ensures that common religious or secular lexicon 
is centralized while regional cultural milestones remain 
isolated to their specific locales.

## 18.  Pack Distribution and Registry

A Pack Registry MUST:

   -  Provide pack metadata including locale, version, and event
      coverage summary.
   -  Include version identifiers and integrity hashes.
   -  Include download Uniform Resource Identifiers (URIs) for
      remote packs.
   -  Declare dependencies on other packs (e.g., "el-GR" depends
      on "el").

Integrity verification SHOULD be supported for remote pack loading.

### 18.1.  CDN Hosting Strategies

To optimize load times and reduce the main application bundle,
data packs MAY be hosted on a Content Delivery Network (CDN)
instead of being bundled directly.  The following strategies are
supported:

   -  GitHub Pages:  Commit the "packs/" directory to a "gh-pages"
      branch or the "docs/" folder.  Packs are then accessible via
      <https://{user}.github.io/salve/packs/{locale}/namedays.json>.
   -  unpkg / jsDelivr:  If packs are published to npm, they are
      automatically available via public CDN URLs (e.g.,
      <https://unpkg.com/@salve/pack-el-namedays@latest/dist/data/
      recurring_namedays.json>).
   -  Custom S3/CloudFront:  For enterprise deployments, host JSON
      files on a private S3 bucket fronted by CloudFront.

### 18.2.  Security Recommendations for CDN Distribution

When serving packs from a CDN, implementors MUST consider:

   -  CORS:  The CDN MUST allow requests from the consuming
      application's domain.
   -  Versioning:  Pack URLs SHOULD include a version identifier or
      content hash to prevent caching issues after updates.
   -  Integrity:  Subresource Integrity (SRI) SHOULD be used where
      applicable to verify that fetched content has not been
      tampered with.

## 19.  Loader and Integrity Model

The loader MUST:

   -  Support statically bundled packs (npm modules).
   -  Support remotely fetched JSON packs.
   -  Optionally verify integrity via content hashes.
   -  Support caching of fetched packs.

Remote pack loading MUST NOT execute arbitrary code.  All remote data
MUST be treated as untrusted input and validated against the pack
schema before registration.

## 20.  Name-Day Subsystem Specification

The name-day subsystem MUST:

   -  Use saint identity (WikiData QID) as the canonical pivot
      between dates and personal names.
   -  Separate the alias index from the saint registry to allow
      independent updates and partitioned loading.
   -  Support cross-language name equivalence (e.g., "Georgios",
      "George", and "Giorgos" resolve to the same saint).
   -  Allow partitioned alias loading to minimize payload size.

Onboarding MUST resolve and persist only the minimal saint mappings
relevant to the user's given names.

### 20.1.  Two-Stage Resolution

Name-day resolution proceeds in two stages:

   1.  Date → Saints:  Given a date, query the name-day data pack to
       find which saints are commemorated on that date.
   2.  Saints → Names:  Given the user's given names, query the alias
       index to determine if any of the user's names match a saint
       commemorated today.

If a match is found, the engine emits a "nameday" personal event
with the highest domain priority.

### 20.2.  SaintDefinition Structure

Each saint record MUST include:

   -  "qid":  WikiData QID (e.g., "Q48438").
   -  "canonicalName":  The primary name in a reference language.
   -  "traditions":  Array of tradition tags this saint is recognized
      by (e.g., ["orthodox", "catholic"]).
   -  "aliases":  Array of name variants across languages.

## 21.  Name Normalization and Fuzzy Resolution

Normalization MUST include:

   -  Lowercasing.
   -  Diacritic removal (Unicode NFD decomposition followed by
      combining mark stripping).
   -  Unicode NFC normalization.
   -  Transliteration where applicable (e.g., Greek to Latin).

Resolution SHOULD attempt the following in order:

   1.  Exact normalized match.
   2.  Diacritic-free match.
   3.  Small edit-distance threshold (Levenshtein distance <= 2).
   4.  Optional phonetic matching (e.g., Soundex or Metaphone).

## 22.  Registry and Loader Architecture

The registry layer provides centralized storage and retrieval for all
registered components.  It is implemented as three specialized
registries coordinated by a loader.

### 22.1.  SalveRegistry

The SalveRegistry is the top-level container holding references to
all sub-registries:

   -  "plugins":  Registered calendar plugins.
   -  "packs":  Registered greeting packs (legacy format).
   -  "events":  The EventRegistry (see Section 22.2).
   -  "greetingRules":  The GreetingRuleRegistry (see Section 22.3).

### 22.2.  EventRegistry

The EventRegistry implements the global event namespace.  It
provides the following methods:

   -  registerEvent(entry):  Register a canonical event with optional
      aliases.
   -  registerEvents(entries):  Bulk registration of multiple events.
   -  resolveAlias(alias):  Resolve a short alias to its canonical
      event ID.
   -  resolveId(id):  Resolve an event ID, checking aliases if direct
      lookup fails.
   -  getEvent(id):  Retrieve a specific event entry.
   -  getEventsByDomain(domain):  Retrieve all events for a domain.
   -  getAllEvents():  Retrieve all registered events.

Each EventRegistryEntry MUST include:

   -  "id":  Canonical event ID following the namespace pattern
      (see Section 25.4).
   -  "domain":  An EventDomainV1 value.

Each EventRegistryEntry MAY include:

   -  "country":  ISO 3166-1 country code for regional events.
   -  "description":  Human-readable description.
   -  "scope":  One of "global", "regional", or "local".
   -  "aliases":  Array of short aliases (e.g., ["christmas",
      "xmas"] for "salve.event.religious.christmas").

### 22.3.  GreetingRuleRegistry

The GreetingRuleRegistry stores ontology-aware greeting rules
organized by pack ID and locale.  It provides:

   -  registerRules(packId, locale, rules, precedence):  Register
      rules for a specific pack and locale.
   -  getRulesByLocaleChain(localeChain):  Retrieve all rules
      matching any locale in the fallback chain, ordered by
      precedence.

Rules are returned as tuples of (packId, precedence, rule) to
enable the scoring algorithm to distinguish between packs.

### 22.4.  SalveLoader

The SalveLoader is a helper utility that auto-categorizes raw data
objects or class instances and routes them to the appropriate
registry.  When the engine's "use(components)" method is called,
the loader inspects each component's structural signature:

   -  Objects with a "resolveEvents" method → calendar plugin.
   -  Objects with a "locale" and "greetings" array → greeting pack.
   -  Objects with a "locale" and "titles" object → honorific pack.
   -  Objects with a "style" and "rules" array → style pack.

This enables a single-call registration pattern:

      engine.use([gregPlugin, hijriPlugin, dePack, elPack, honors]);

## 23.  CLI Tooling Specification

The Salve CLI (@salve/cli) provides a command-line interface for
project initialization, pack management, and resolution debugging.

### 23.1.  Core Commands

   -  "salve init":  Initializes a "salve.config.json" file in the
      project root, declaring the active packs and output directory.
   -  "salve add <pack>":  Registers a new pack (local or remote) in
      the project configuration.
   -  "salve resolve":  Interactive or argument-based tool to test the
      engine's resolution logic against specific contexts.

### 23.2.  Configuration

The CLI reads from "salve.config.json", which MUST specify:

   -  "packs":  An array of pack identifiers or file paths.
   -  "outDir":  The target directory for bundled artifacts.

## 24.  Demo and Developer Mode Requirements

### 24.1.  Developer Tools Overlay

The Developer Tools SHALL be provided as a pluggable UI component
(SalveDevTools) that can be mounted into any web-based application.

#### 24.1.1.  Context Mocking

The tools MUST allow overriding the following context parameters:

   -  System time ("now"):  For simulating seasonal and temporal
      greetings.
   -  Formality:  For testing social context shifts.

#### 24.1.2.  Diagnostics

The tools MUST expose a "Resolution Trace" containing:

   -  Selected Event ID and domain.
   -  Scoring breakdown (all six ScoreTuple fields).
   -  Lexicon template selection.
   -  Complete resolved context object.

### 24.2.  Demo Application

The demo application (@salve/demo) serves as the reference
implementation for the Salve ecosystem.  It MUST utilize the real
@salve/core engine and registered calendar plugins to demonstrate
production-grade integration.  Greeting data in the demo MUST be
sourced from the canonical JSON packs in "data/packs/" via the
generator pipeline (see Section 17.4).

## 25.  Advanced Architecture (v1)

### 25.1.  Greeting Ontology

Greeting rules MUST declare a speech-act type ("act"), a structural
output form ("form"), and a rhetorical style ("style").

The ontology defines the following values:

   Acts:  salutation, valediction, welcome, congratulation,
      observance, acclamation, address_only, checkin, acknowledge.

   Forms:  greeting_only, address_only, salutation, email_opening,
      email_closing.

   Styles:  neutral, formal, ceremonial, liturgical, poetic, playful,
      archaic, bureaucratic, minimal.

### 25.2.  Context Model (SalveContextV1)

The v1 context MUST be structured into six sections:

   1.  "env":  Temporal and locale environment.
       -  "now" (Date, REQUIRED):  The reference instant.
       -  "locale" (string, REQUIRED):  BCP 47 locale for pack
          lookup.
       -  "timeZone" (string, OPTIONAL):  IANA timezone; derived
          from region if omitted.
       -  "outputLocale" (string, OPTIONAL):  BCP 47 locale for
          rendering; defaults to "locale".
       -  "region" (string, OPTIONAL):  ISO 3166-1 region code;
          derived from locale if omitted.

   2.  "interaction" (OPTIONAL):  Interaction frame.
       -  "phase":  "encounter", "parting", or "making acquaintance" (default: "encounter").
       -  "setting":  "direct_address", "group_address", "public_announcement",
          "chat_message", "email_opening", "email_closing", "ui", "chat",
          "email", or "phone" (default: "ui").
       -  "role":  "initiator" or "responder" (default: "initiator").
       -  "relationship":  One of "stranger", "acquaintance",
          "friend", "family", "superior", "subordinate", or "intimate"
          (default: "stranger").
       -  "formality":  "highly informal", "informal", "neutral", "formal",
          or "hyperformal" (default: "neutral").
       -  "style":  A GreetingStyle value (default: "neutral").

   3.  "person" (OPTIONAL):  Person being addressed.
       -  "givenNames":  Array of given names.
       -  "surname":  Family name.
       -  "preferredName":  Display name; defaults to first given
          name.
       -  "gender":  "male", "female", "nonbinary", or "unknown".
       -  "genderSource":  "explicit", "inferred", or "unknown".
       -  "titles":  Array of SalveTitle objects (see Section 14.7).
       -  "birthday":  ISO 8601 date string.
       -  "nameday":  Object with "enabled", "locale", and
          "saintIds" fields for name-day configuration.

   4.  "memberships" (OPTIONAL):  Declared identities — strong
       affiliations.
       -  "traditions":  Array of tradition tags (e.g., ["orthodox",
          "civil"]).  These gate access to religious and tradition-
          specific events.
       -  "subcultures":  Array of subculture tags (e.g.,
          ["military", "academic"]).  These gate access to protocol
          pack greetings.

   5.  "affinities" (OPTIONAL):  Declared interests — weak
       associations.
       -  "locales":  Array of BCP 47 locale tags representing
          locales the user has an interest in.
       -  "tags":  Array of freeform interest tags.

   6.  "policy" (OPTIONAL):  Engine behavior constraints.
       -  "allowDomains":  Array of EventDomainV1 values the engine
          is permitted to emit (default: bank, civil, personal,
          temporal, cultural_baseline, seasonal).
       -  "allowExtras":  Boolean enabling affinity reminders
          (default: false).
       -  "allowSubcultureAddressing":  Boolean enabling protocol
          pack greetings (default: false).
       -  "requireExplicitTraditionsForReligious":  Boolean
          requiring explicit tradition memberships for religious
          events (default: true).
       -  "allowGenderInference":  Boolean enabling low-confidence
          gender inference from given names (default: false).
       -  "repetition":  Object with "windowedGreetings" (boolean)
          and "maxSameRulePerDays" (number, default: 3).

### 25.3.  Context Normalization Algorithm (SCNA)

The SCNA MUST convert partial developer input into a fully resolved
NormalizedContext through the following eleven sequential steps:

   Step 1 — Normalize locale:  Parse the BCP 47 locale string.
      Lowercase the language subtag; uppercase the region subtag
      (e.g., "de-de" → "de-DE").

   Step 2 — Derive region:  If "env.region" is provided, uppercase
      it.  Otherwise, extract the region subtag from the locale.
      If the locale has no region subtag, look up a default region
      from a language-to-region table (e.g., "nl" → "NL",
      "el" → "GR", "ar" → "EG").  If no mapping exists, fall back
      to "US".

   Step 3 — Resolve output locale:  If "env.outputLocale" is
      provided, normalize it.  Otherwise, default to the input
      locale.

   Step 4 — Resolve timezone:  If "env.timeZone" is provided, use
      it.  Otherwise, derive the IANA timezone from the region code
      using a region-to-timezone table (e.g., "GR" →
      "Europe/Athens", "DE" → "Europe/Berlin").  If no mapping
      exists, fall back to "UTC".

   Step 5 — Compute day period:  Compute the local hour using the
      resolved timezone (see Section 12.3).  Map the hour to a
      DayPeriod using the boundaries in Section 12.1.

   Step 6 — Build locale fallback chain:  Construct the locale chain
      by progressively stripping subtags (see Section 15.1).

   Step 7 — Apply interaction defaults:  For each interaction field
      not provided by the consumer, apply the default values:
      phase="encounter", setting="ui", role="initiator",
      relationship="stranger", formality="neutral", style="neutral".

   Step 8 — Normalize person:  Trim whitespace from all name fields.
      Remove empty strings from givenNames.  Default preferredName
      to the first given name.  Default gender to "unknown" and
      genderSource to "unknown" if gender was not provided, or
      "explicit" if it was.  Lowercase all title codes.

   Step 9 — Normalize memberships:  Lowercase all tradition and
      subculture strings.  Default both arrays to empty.

   Step 10 — Normalize affinities:  Normalize all affinity locale
      strings via the locale normalizer.  Lowercase all tags.
      Default both arrays to empty.

   Step 11 — Apply policy defaults:  For each policy field not
      provided, apply defaults: allowDomains=[bank, civil, personal,
      temporal, cultural_baseline, seasonal], allowExtras=false,
      allowSubcultureAddressing=false,
      requireExplicitTraditionsForReligious=true,
      allowGenderInference=false, repetition={windowedGreetings:
      false, maxSameRulePerDays: 3}.

The resulting NormalizedContext has no optional fields — all values
are present and validated.

### 25.4.  Event Namespace Registry

Events MUST follow the deterministic pattern:

      salve.event.<domain>.<region?>.<event_name>

The registry MUST support alias resolution and domain-based filtering.
Supported domains are: bank, civil, religious, personal, seasonal,
protocol, affinity, and custom.

### 25.5.  Greeting Rule Matching (GreetingRuleWhen)

Each GreetingRule MAY include a "when" block specifying the conditions
under which it activates.  The matching algorithm applies the
following filters sequentially.  Each filter is applied independently;
if a "when" field is absent, that filter is skipped (i.e., the rule
matches all values for that dimension):

   1.  eventRef:  If present, the rule only matches if a matching
       event is currently active.  The eventRef is resolved through
       the alias system (Section 25.4).

   2.  dayPeriod:  If present, the rule only matches if the
       normalized context's dayPeriod equals this value.

   3.  phase:  If present ("encounter", "parting", or "making acquaintance"), the rule only
       matches if the interaction phase matches.

   4.  setting:  If present (array of "direct_address", "group_address",
       "public_announcement", "chat_message", "email_opening",
       "email_closing", "ui", "chat", "email", or "phone"), the
       rule only matches if the interaction setting is included in
       the array.

   5.  relationship:  If present (array), the rule only matches if
       the interaction relationship is included in the array.

   6.  formality:  If present, the rule only matches if the
       interaction formality matches.

   7.  affiliationsAny:  If present (array of tradition tags), the
       rule only matches if at least one tag appears in the
       context's memberships.traditions.

   8.  subculturesAny:  If present (array of subculture tags), the
       rule only matches if at least one tag appears in the
       context's memberships.subcultures.

All present "when" fields MUST match for the rule to be considered
a candidate (logical AND).  Within array-typed fields (setting,
relationship, affiliationsAny, subculturesAny), any single match
suffices (logical OR).

When no rule's "when" conditions match the current context, the
engine falls back to the nearest ancestor in the locale fallback
chain, or ultimately to a deterministic fallback greeting.

### 25.6.  Deterministic Scoring (ScoreTuple)

Candidate greeting rules MUST be scored using a six-field
lexicographic tuple:

      (domainRank, eventRank, packPrecedence, rulePriority,
       localeMatchScore, stableTieBreak)

   Field descriptions:

   -  domainRank:  Numeric rank derived from the event's domain
      (see Section 13.1).  Higher rank = higher priority.

   -  eventRank:  The event's own precedence value as declared in
      the event registry or calendar plugin output.

   -  packPrecedence:  The pack's declared precedence when registered
      via registerGreetingRules.  Higher precedence = higher priority.

   -  rulePriority:  The rule's own priority field.  Allows pack
      authors to express intra-pack ordering.

   -  localeMatchScore:  A bonus for locale specificity.  An exact
      locale match scores higher than a base-language match.

   -  stableTieBreak:  A deterministic string composed of pack ID +
      rule ID, lexicographically ordered.  Ensures reproducible
      output when all other fields are equal.

Comparison proceeds left to right.  The candidate with the highest
tuple wins.

### 25.7.  Structured Output (SalveOutputV1)

The v1 engine returns a SalveOutputV1 object with the following
structure:

   -  "primary":  The primary greeting result (REQUIRED).
      -  "text":  The composed greeting string including address.
      -  "act":  The speech-act type of the selected rule.
      -  "eventId":  The matched event's ID, if any.
      -  "ruleId":  The selected rule's ID.

   -  "extras":  An array of supplementary items (OPTIONAL, present
      only when policy.allowExtras is true).
      -  "text":  The extra greeting or reminder text.
      -  "eventId":  The associated event ID.
      -  "ruleId":  The associated rule ID.
      -  "kind":  Either "affinity" (interest-based reminder) or
         "info" (informational item).

   -  "trace":  Developer diagnostic data (OPTIONAL, always included
      in the current implementation for transparency).
      -  "candidates":  Array of SalveTraceEntry objects, each
         containing a ruleId and its full ScoreTuple.
      -  "usedEvents":  Array of event IDs that were active during
         resolution.
      -  "normalizedContext":  The fully resolved NormalizedContext
         for debugging.

### 25.8.  v1 Resolution Pipeline

The v1 engine resolves greetings through an eight-stage
deterministic pipeline:

   Stage 1 — Context Normalization:  The input SalveContextV1 is
      processed by the SCNA (Section 25.3) into a NormalizedContext.

   Stage 2 — Locale Fallback Chain:  The locale chain is computed
      during normalization (Section 15.1) and stored in the
      NormalizedContext.

   Stage 3 — Event Collection:  All registered calendar plugins are
      queried with the current date.  Their CelebrationEvents are
      converted to SalveEvents.  Events are then filtered by the
      policy's allowDomains list, the
      requireExplicitTraditionsForReligious flag, and the
      allowSubcultureAddressing flag.

   Stage 4 — Candidate Enumeration:  The GreetingRuleRegistry is
      queried using the locale fallback chain.  Each returned rule is
      tested against the "when" conditions (Section 25.5).  Rules
      that fail any filter are discarded.

   Stage 5 — Deterministic Scoring:  Each surviving candidate is
      scored using the ScoreTuple (Section 25.6).  All candidates
      are collected into a trace array for developer diagnostics.

   Stage 6 — Address Resolution:  The address string is constructed
      using the Address Protocol (Section 14) based on the
      normalized person profile and interaction formality.

   Stage 7 — Style Rendering:  The winning rule's template is
      processed through the Style Engine (Section 25.9).  The
      rendered text is combined with the address.

   Stage 8 — Composition and Output:  The final SalveOutputV1 object
      is assembled with the primary greeting, any extras, and the
      full trace.

### 25.9.  Style Engine

The Style Engine manages rhetorical register transformations using
a family tree model.  Style is NEVER inferred — it is always
explicitly configured in the interaction context or defaults to
"neutral".

#### 25.9.1.  Style Family Tree

Styles are organized in an inheritance hierarchy.  When a requested
style has no matching template, the engine walks up the tree until
a match is found:

                        neutral
                       /   |   \    \     \
                  formal  playful poetic archaic liturgical minimal
                 /      \
          ceremonial  bureaucratic

Concrete fallback chains:

   -  "ceremonial" → ["ceremonial", "formal", "neutral"]
   -  "bureaucratic" → ["bureaucratic", "formal", "neutral"]
   -  "liturgical" → ["liturgical", "neutral"]
   -  "playful" → ["playful", "neutral"]
   -  "poetic" → ["poetic", "neutral"]
   -  "archaic" → ["archaic", "neutral"]
   -  "minimal" → ["minimal", "neutral"]
   -  "formal" → ["formal", "neutral"]
   -  "neutral" → ["neutral"]

#### 25.9.2.  StylePack and StyleTransformRule

A StylePack provides template overrides for a specific rhetorical
register:

   -  "style":  The GreetingStyle this pack provides transforms for.
   -  "rules":  An array of StyleTransformRule objects, each with:
      -  "base":  The rule ID to override.
      -  "locale":  The locale this transform applies to.
      -  "template":  The replacement template string.

#### 25.9.3.  Style Resolution Algorithm

The style engine applies transformations in the following order:

   1.  If the rule's own style matches the requested style, use the
       rule's template as-is.
   2.  Walk the fallback chain.  For each style in the chain, check
       all registered StylePacks for a transform matching the rule
       ID and locale.  If found, use the transform's template.
   3.  If no transform is found at any level, return the rule's
       original template unchanged.

#### 25.9.4.  Style Match Scoring

The ScoreTuple incorporates a style compatibility bonus:

   -  +15 if the rule's style exactly matches the requested style.
   -  +5 if the rule's style is in the same family (i.e., appears
      in the requested style's fallback chain).
   -  0 otherwise.

### 25.10.  Subculture Protocol Packs

Protocol packs are opt-in data modules containing greetings specific
to institutional or socio-political subcultures.  Examples include:

   -  @salve/protocol-military:  Military greetings and forms of
      address.
   -  @salve/protocol-academic:  Academic salutations and titles.
   -  @salve/protocol-diplomatic:  Diplomatic protocol greetings.

Protocol packs are gated by two mechanisms:

   1.  The user's "memberships.subcultures" array must include a
       matching tag.
   2.  The policy flag "allowSubcultureAddressing" must be true.

Both conditions MUST be met for protocol pack rules to participate
in candidate enumeration.

## 26.  Geographic Locale Mapping Subsystem
 
The Geographic Locale Mapping subsystem enables precise greeting
resolution based on the user's physical coordinates.  It resolves
partial locale tags into specific dialectal variants via a
hierarchical polygon-matching model.
 
### 26.1.  LocationResolver
 
The `LocationResolver` is the central component responsible for
coordinate-based resolution.  It MUST:
 
    -  Accept an array of `RegionDefinition` objects.
    -  Implement a point-in-polygon algorithm (Ray Casting).
    -  Support hierarchical resolution via `priority` fields.
 
### 26.2.  Hierarchical Resolution Model
 
When a coordinate falls within multiple overlapping regions, the
engine applies the following resolution rules:
 
    1.  Select all regions containing the coordinate.
    2.  Sort candidates by `priority` (ascending).
    3.  Select the locale from the region with the lowest `priority`.
 
This allows broad macro-regions (e.g., "Dutch-speaking area",
priority 100) to be overridden by micro-regions (e.g., "Aalst",
priority 10).
 
### 26.3.  Integration with SCNA
 
The Salve Context Normalization Algorithm (SCNA) MUST refine the
target locale using the `LocationResolver` before greeting selection
begins.  The refined locale then participates in the standard locale
fallback chain.
 
## 27.  Extensibility Model

Salve MUST allow the following extension points:

   -  Third-party greeting pack creation using the documented JSON
      schema (Section 17.3).
   -  Additional calendar plugins implementing the CalendarPlugin
      interface (Section 11).
   -  Additional honorific packs for new locales.
   -  Additional style packs for custom rhetorical registers.
   -  Subculture protocol packs (Section 25.10).
   -  Additional tradition registries and event providers.
   -  Custom suppression policies implementing the GreetingMemory
      interface (Section 16).
   -  Name transformation plugins (e.g., Greek vocative case) via
      the TransformHook interface (Section 14.5).
   -  Name-day data packs for additional locales.

## 28.  Performance Requirements

   -  The core package MUST remain minimal in size when no packs are
      loaded.
   -  Alias datasets MUST be partitionable to avoid loading unused
      name mappings.
   -  Lazy loading of remote packs MUST be supported.
   -  Caching of fetched packs SHOULD be implemented to avoid
      redundant network requests.

## 29.  Internationalization Considerations

Salve is inherently an internationalization system.  The following
considerations apply:

   -  All locale identifiers MUST conform to BCP 47 [BCP47].
   -  Greeting text is stored in native script and MAY include
      transliterated variants.
   -  The engine uses CLDR-compatible Intl APIs for date and number
      formatting where available.
   -  Right-to-left (RTL) script rendering is the responsibility of
      the consuming application; Salve provides text content only.
   -  The punctuation engine accounts for locale-specific conventions
      such as comma placement and exclamation mark usage.

## 30.  Security Considerations

   -  Remote packs MUST support integrity validation via content
      hashes before registration.
   -  Remote code execution MUST NOT be permitted.  Packs are
      declarative JSON and MUST NOT contain executable code.
   -  All remote data MUST be treated as untrusted input and
      validated against the JSON schema before use.
   -  Personal data in user profiles (names, birthdays, gender) is
      processed locally and is never transmitted to external
      services by the engine itself.
   -  Gender inference (when enabled via policy) produces only
      low-confidence hints and MUST be treated as non-authoritative.
      It MUST be disabled by default.

## 31.  Future Considerations

Potential extensions include:

   -  Hebrew calendar support.
   -  Buddhist calendar support.
   -  Advanced phonetic name matching (Double Metaphone, Beider-Morse).
   -  Server-side pack optimization tools.
   -  Binary pack compression formats.
   -  Gender inference from given names (low-confidence hint model,
      opt-in only).
   -  Affinity Reminders (reminding a user in Belgium of a Japanese
      festival if they have an affinity for Japan).

## 32.  References

### 32.1.  Normative References

   [BCP47]    Phillips, A., Ed. and M. Davis, Ed., "Tags for
              Identifying Languages", BCP 47, RFC 5646,
              September 2009,
              <https://www.rfc-editor.org/info/bcp47>.

   [RFC2119]  Bradner, S., "Key words for use in RFCs to Indicate
              Requirement Levels", BCP 14, RFC 2119, March 1997,
              <https://www.rfc-editor.org/info/rfc2119>.

   [RFC8174]  Leiba, B., "Ambiguity of Uppercase vs Lowercase in
              RFC 2119 Key Words", BCP 14, RFC 8174, May 2017,
              <https://www.rfc-editor.org/info/rfc8174>.

### 32.2.  Informative References

   [BIB]      Soudan, W., "Salve Data Sources Bibliography",
              Salve Project, 2026,
              <data/data-sources.bib>.

   [CLDR]     Unicode Consortium, "Unicode Common Locale Data
              Repository (CLDR)", <https://cldr.unicode.org/>.

   [GREETINGS]
              Soudan, W., "The Universal Ritual of Connection: A
              Global Encyclopedia of Greetings", Salve Project,
              2026,
              <docs/global_greetings_encyclopedia.md>.

   [JSON-SCHEMA]
              Wright, A., Andrews, H., Hutton, B., and G. Dennis,
              "JSON Schema: A Media Type for Describing JSON
              Documents", Work in Progress, Internet-Draft,
              draft-bhutton-json-schema-01, June 2022,
              <https://json-schema.org/draft/2020-12/json-schema-
              core>.

   [RFC7322]  Flanagan, H. and S. Ginoza, "RFC Style Guide",
              RFC 7322, September 2014,
              <https://www.rfc-editor.org/info/rfc7322>.

   [WIKIDATA] Wikimedia Foundation, "Wikidata: A Free and Open
              Knowledge Base", <https://www.wikidata.org/>.

## 33.  Author's Address

   Dr Wouter Soudan
   Salve Project

   Email:   rhythmvs@gmail.com
   GitHub:  https://github.com/rhythmus
   Website: https://wso.art
