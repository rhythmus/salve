# Salve: Universal Greeting and Cultural Awareness Engine

Salve Project                                                 W. Soudan
Internet-Draft                                             Salve Project
Category: Standards Track                                 5 March 2026
Version: 1.0.0-draft

## Abstract

This document specifies the Salve Universal Greeting and Cultural
Awareness Engine ("Salve").  Salve is a modular, data-driven,
calendar-aware, multi-tradition greeting system designed to generate
culturally and temporally appropriate greetings.

This specification defines the functional requirements, architectural
boundaries, data pack system, calendar plugin framework, event
resolution model, rendering and localization model, memory and
suppression model, distribution model, name-day resolution system,
command-line interface (CLI) tooling, and developer transparency
mechanisms of the Salve system.

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
12. Event Resolution Model
13. Rendering and Localization Model
14. Memory and Suppression Model
15. Data Pack Architecture
16. Pack Distribution and Registry
17. Loader and Integrity Model
18. Name-Day Subsystem Specification
19. Name Normalization and Fuzzy Resolution
20. CLI Tooling Specification
21. Demo and Developer Mode Requirements
22. Advanced Architecture (v1)
23. Extensibility Model
24. Performance Requirements
25. Internationalization Considerations
26. Security Considerations
27. Future Considerations
28. References
29. Author's Address

## 1.  Introduction

Salve provides culturally intelligent greetings based on time,
location, tradition, and user identity.  The system operates
deterministically and does not depend on external Application
Programming Interfaces (APIs) for core functionality.  All greeting
data and calendar computations are local, ensuring offline capability,
privacy, and reproducibility.

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

## 4.  System Overview

Salve consists of the following major subsystems:

   -  Core Engine
   -  Calendar Plugin Layer
   -  Data Pack Layer
   -  Loader Layer
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

## 6.  Functional Requirements

### 6.1.  Greeting Generation

The system MUST generate exactly one primary greeting per invocation.
Additional "extras" (e.g., affinity reminders) MAY be returned as
secondary items.

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
   -  Plugin Interfaces:  Calendar plugins and name transforms.
   -  Data Packs:  Greeting lexicons, event definitions, and
      address formatting rules.
   -  Loader Abstraction:  Pack discovery, fetching, caching, and
      integrity verification.
   -  Distribution Layer:  npm modules and/or static JSON served from
      a Content Delivery Network (CDN).

No layer SHALL directly depend on implementation details of another
layer beyond defined TypeScript interfaces.

## 9.  Monorepo Organization

The repository SHALL include the following packages:

   -  @salve/core:  Resolution engine, scoring, normalization.
   -  @salve/types:  Shared TypeScript interfaces and type
      definitions.
   -  @salve/registry:  Pack and event registry, loader.
   -  @salve/calendars-*:  Calendar plugin packages (Gregorian,
      Pascha, Hijri, etc.).
   -  @salve/pack-*:  Locale-specific data packs.
   -  @salve/demo:  Reference demo application.
   -  @salve/devtools:  Developer tools overlay.
   -  @salve/cli:  Command-line interface.

Each package SHALL be independently versioned and publishable.

## 10.  Core Engine Specification

The Core Engine MUST:

   -  Accept runtime context including date, timezone, locale, user
      profile, cultural affiliations, and interaction parameters.
   -  Query all loaded packs using a locale fallback chain (see
      Section 22.3).
   -  Resolve active events from registered calendar plugins.
   -  Enumerate candidate greeting rules matching the current
      context.
   -  Score candidates using a deterministic ScoreTuple (see
      Section 22.5).
   -  Resolve address formatting using locale-specific honorific
      packs.
   -  Apply style rendering through the style engine fallback chain.
   -  Compose and return a structured GreetingResult.

The Core Engine SHALL NOT embed large cultural datasets.

## 11.  Calendar Plugin Framework

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

## 12.  Event Resolution Model

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

## 13.  Rendering and Localization Model

Rendering MUST:

   -  Use BCP 47 [BCP47] language codes for all locale identification.
   -  Support script variants (e.g., Latin transliteration alongside
      native script).
   -  Support formal, informal, and neutral register forms.
   -  Inject parameters into greeting templates (e.g., {name},
      {title}).
   -  Apply locale-specific punctuation rules (e.g., comma placement
      between greeting and address).

The system SHOULD use CLDR-compatible Intl APIs (Intl.DateTimeFormat,
Intl.PluralRules) for date and number formatting where available.

## 14.  Memory and Suppression Model

The engine MUST support:

   -  Event-level suppression keys (e.g., "birthday:1990-04-12:2026",
      "holiday:de:unity_day:2026-10-03").
   -  Time-bound suppression with configurable expiration policies.
   -  First-visit detection for one-time greetings.

Memory MUST be pluggable.  The engine defines a GreetingMemory
interface; consumers provide the storage implementation (e.g.,
localStorage, in-memory, or database-backed).

## 15.  Data Pack Architecture

### 15.1.  Single Source of Truth

All greeting data MUST be maintained as canonical JSON files in the
repository's "data/packs/" directory.  These files constitute the
single source of truth from which all downstream artifacts --
TypeScript packs, published npm modules, and remote JSON
distributions -- are generated.

Each JSON pack file SHALL correspond to exactly one BCP 47 locale
identifier (e.g., "de-DE.json", "el-GR.json", "ar.json").

### 15.2.  Pack Structure

A GreetingPack MUST include:

   -  "locale":  A BCP 47 locale identifier (REQUIRED).
   -  "greetings":  A non-empty array of greeting entries (REQUIRED).

A GreetingPack MAY include:

   -  "extends":  A parent locale identifier for inheritance
      (e.g., "de" for "de-AT").

Each greeting entry MUST include:

   -  "id":  A stable unique identifier within the pack
      (e.g., "de_morning").
   -  "text":  The greeting phrase in the locale's native script.

Each greeting entry MAY include:

   -  "eventRef":  A reference to a CelebrationEvent identifier.
   -  "expectedResponse":  Call-response pair text (e.g., Paschal
      greeting and response).
   -  "formality":  A constraint ("informal", "formal", or "neutral").
   -  "phase":  A session phase constraint ("open" or "close").
   -  "role":  An interaction role ("initiator" or "responder").
   -  "relationship":  An array of applicable relationship contexts
      ("stranger", "acquaintance", "friend", "family", "superior",
      or "subordinate").
   -  "setting":  An array of applicable interaction settings
      ("direct_address", "group_address", "public_announcement",
      "chat_message", "email_opening", or "email_closing").

### 15.3.  JSON Schema Validation

A JSON Schema (Draft 2020-12) [JSON-SCHEMA] SHALL be maintained at
"data/greeting-pack.schema.json".  All pack files MUST reference this
schema via the "$schema" property and MUST validate against it.

The schema enforces structural constraints including identifier
patterns, string length minimums, and enumeration values.  This allows
contributors to validate edits without running TypeScript.

### 15.4.  Generator Pipeline

A generator script ("scripts/generate-demo-packs.ts") SHALL read all
"data/packs/*.json" files, validate each against the schema, and emit
a TypeScript module ("packs.generated.ts") that exports typed
GreetingPack arrays.

The generator MUST:

   -  Parse and validate each JSON file.
   -  Fail with a descriptive error on malformed input.
   -  Produce type-safe output importing from @salve/types.

### 15.5.  Distribution Constraints

Packs MUST NOT contain executable code when distributed as remote
JSON.  Pack files MAY include additional metadata (saint registry,
alias partitions) as separate JSON files following the same
validation model.

## 16.  Pack Distribution and Registry

A Pack Registry MUST:

   -  Provide pack metadata including locale, version, and event
      coverage summary.
   -  Include version identifiers and integrity hashes.
   -  Include download Uniform Resource Identifiers (URIs) for
      remote packs.
   -  Declare dependencies on other packs (e.g., "el-GR" depends
      on "el").

Integrity verification SHOULD be supported for remote pack loading.

## 17.  Loader and Integrity Model

The loader MUST:

   -  Support statically bundled packs (npm modules).
   -  Support remotely fetched JSON packs.
   -  Optionally verify integrity via content hashes.
   -  Support caching of fetched packs.

Remote pack loading MUST NOT execute arbitrary code.  All remote data
MUST be treated as untrusted input and validated against the pack
schema before registration.

## 18.  Name-Day Subsystem Specification

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

## 19.  Name Normalization and Fuzzy Resolution

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

## 20.  CLI Tooling Specification

The Salve CLI (@salve/cli) provides a command-line interface for
project initialization, pack management, and resolution debugging.

### 20.1.  Core Commands

   -  "salve init":  Initializes a "salve.config.json" file in the
      project root, declaring the active packs and output directory.
   -  "salve add <pack>":  Registers a new pack (local or remote) in
      the project configuration.
   -  "salve resolve":  Interactive or argument-based tool to test the
      engine's resolution logic against specific contexts.

### 20.2.  Configuration

The CLI reads from "salve.config.json", which MUST specify:

   -  "packs":  An array of pack identifiers or file paths.
   -  "outDir":  The target directory for bundled artifacts.

## 21.  Demo and Developer Mode Requirements

### 21.1.  Developer Tools Overlay

The Developer Tools SHALL be provided as a pluggable UI component
(SalveDevTools) that can be mounted into any web-based application.

#### 21.1.1.  Context Mocking

The tools MUST allow overriding the following context parameters:

   -  System time ("now"):  For simulating seasonal and temporal
      greetings.
   -  Formality:  For testing social context shifts.

#### 21.1.2.  Diagnostics

The tools MUST expose a "Resolution Trace" containing:

   -  Selected Event ID and domain.
   -  Scoring breakdown (all six ScoreTuple fields).
   -  Lexicon template selection.
   -  Complete resolved context object.

### 21.2.  Demo Application

The demo application (@salve/demo) serves as the reference
implementation for the Salve ecosystem.  It MUST utilize the real
@salve/core engine and registered calendar plugins to demonstrate
production-grade integration.  Greeting data in the demo MUST be
sourced from the canonical JSON packs in "data/packs/" via the
generator pipeline (see Section 15.4).

## 22.  Advanced Architecture (v1)

### 22.1.  Greeting Ontology

Greeting rules MUST declare a speech-act type ("act"), a structural
output form ("form"), and a rhetorical style ("style").

The ontology defines the following values:

   Acts:  salutation, valediction, welcome, congratulation,
      observance, acclamation, address_only, checkin, acknowledge.

   Forms:  greeting_only, address_only, salutation, email_opening,
      email_closing.

   Styles:  neutral, formal, ceremonial, liturgical, poetic, playful,
      archaic, bureaucratic, minimal.

### 22.2.  Context Model (SalveContextV1)

The v1 context MUST be structured into six sections:

   1.  "env":  Temporal and locale environment (now, locale, timeZone,
       region, outputLocale).
   2.  "interaction":  Interaction frame (phase, setting, role,
       relationship, formality, style).
   3.  "person":  Person being addressed (given names, surname,
       preferred name, gender, titles, birthday, name-day config).
   4.  "memberships":  Declared identities -- strong affiliations
       (traditions, subcultures).
   5.  "affinities":  Declared interests -- weak associations
       (locales of interest, tags).
   6.  "policy":  Engine behavior constraints (allowed domains, extras
       toggle, gender inference, repetition windows).

### 22.3.  Context Normalization Algorithm (SCNA)

The SCNA MUST convert partial developer input into a fully resolved
NormalizedContext through the following sequential steps:

   1.  Parse and validate BCP 47 locale.
   2.  Derive region from locale if not explicitly provided.
   3.  Resolve timezone from region or use UTC as default.
   4.  Compute day period (morning, midday, afternoon, evening,
       night) from the current hour.
   5.  Build locale fallback chain (e.g., "nl-BE" produces
       ["nl-BE", "nl", "root"]).
   6.  Apply safe defaults for missing interaction parameters.
   7.  Normalize memberships and affinities arrays.
   8.  Apply policy defaults.

### 22.4.  Event Namespace Registry

Events MUST follow the deterministic pattern:

      salve.event.<domain>.<region?>.<event_name>

The registry MUST support alias resolution and domain-based filtering.
Supported domains are: bank, civil, religious, personal, seasonal,
protocol, affinity, and custom.

### 22.5.  Deterministic Scoring (ScoreTuple)

Candidate greeting rules MUST be scored using a six-field
lexicographic tuple:

      (domainRank, eventRank, packPrecedence, rulePriority,
       localeMatchScore, stableTieBreak)

Comparison proceeds left to right.  The candidate with the highest
tuple wins.  The stableTieBreak field (pack ID + rule ID,
lexicographically ordered) ensures deterministic output when all
other fields are equal.

### 22.6.  Style Engine

Style rendering MUST use a family tree for fallback resolution.  For
example, a request for "ceremonial" style falls back through
"formal" to "neutral" if no ceremonial template is registered.

Style packs MAY provide template overrides for specific rule IDs,
allowing fine-grained control over greeting text for each rhetorical
register.

## 23.  Extensibility Model

Salve MUST allow the following extension points:

   -  Third-party pack creation using the documented JSON schema.
   -  Additional calendar plugins implementing the CalendarPlugin
      interface.
   -  Additional tradition registries and event providers.
   -  Custom suppression policies implementing the GreetingMemory
      interface.
   -  Name transformation plugins (e.g., Greek vocative case) via
      the TransformPlugin interface.

## 24.  Performance Requirements

   -  The core package MUST remain minimal in size when no packs are
      loaded.
   -  Alias datasets MUST be partitionable to avoid loading unused
      name mappings.
   -  Lazy loading of remote packs MUST be supported.
   -  Caching of fetched packs SHOULD be implemented to avoid
      redundant network requests.

## 25.  Internationalization Considerations

Salve is inherently an internationalization system.  The following
considerations apply:

   -  All locale identifiers MUST conform to BCP 47 [BCP47].
   -  Greeting text is stored in native script and MAY include
      transliterated variants.
   -  The engine uses CLDR-compatible Intl APIs for date and number
      formatting where available.
   -  Right-to-left (RTL) script rendering is the responsibility of
      the consuming application; Salve provides text content only.

## 26.  Security Considerations

   -  Remote packs MUST support integrity validation via content
      hashes before registration.
   -  Remote code execution MUST NOT be permitted.  Packs are
      declarative JSON and MUST NOT contain executable code.
   -  All remote data MUST be treated as untrusted input and
      validated against the JSON schema before use.
   -  Personal data in user profiles (names, birthdays) is processed
      locally and is never transmitted to external services by the
      engine itself.

## 27.  Future Considerations

Potential extensions include:

   -  Hebrew calendar support.
   -  Buddhist calendar support.
   -  Advanced phonetic name matching (Double Metaphone, Beider-Morse).
   -  Server-side pack optimization tools.
   -  Binary pack compression formats.
   -  Gender inference from given names (low-confidence hint model,
      opt-in only).

## 28.  References

### 28.1.  Normative References

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

### 28.2.  Informative References

   [CLDR]     Unicode Consortium, "Unicode Common Locale Data
              Repository (CLDR)", <https://cldr.unicode.org/>.

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

## Author's Address

   Wouter Soudan
   Salve Project

   Email: wouter@salve.dev
