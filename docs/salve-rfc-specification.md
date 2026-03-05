# RFC-DRAFT: Salve --- Universal Greeting & Cultural Awareness Engine

Category: Standards Track\
Version: 1.0.0-draft\
Status: Draft Specification\
Date: 2026-03-02T16:12:11.926786 UTC

------------------------------------------------------------------------

# Abstract

This document specifies the Salve Universal Greeting & Cultural
Awareness Engine ("Salve").\
Salve is a modular, data-driven, calendar-aware, multi-tradition
greeting system designed to generate culturally and temporally
appropriate greetings.

This specification defines:

-   Functional requirements
-   Architectural boundaries
-   Distribution model
-   Monorepo organization
-   Pack system
-   Name-day resolution system
-   Calendar plugin framework
-   Loader and integrity model
-   CLI tooling
-   Developer transparency mechanisms

Normative terms such as MUST, SHOULD, MAY, SHALL, MUST NOT, and
RECOMMENDED are used as defined in RFC 2119.

------------------------------------------------------------------------

# Table of Contents

1.  Introduction\
2.  Terminology and Conventions\
3.  System Overview\
4.  Design Principles\
5.  Functional Requirements\
6.  Non-Functional Requirements\
7.  Architectural Model\
8.  Monorepo Organization\
9.  Core Engine Specification\
10. Calendar Plugin Framework\
11. Event Resolution Model\
12. Rendering and Localization Model\
13. Memory and Suppression Model\
14. Data Pack Architecture\
15. Pack Distribution and Registry\
16. Loader and Integrity Model\
17. Name-Day Subsystem Specification\
18. Name Normalization and Fuzzy Resolution\
19. Performance Requirements\
20. Security Considerations\
21. CLI Tooling Specification\
22. Demo & Developer Mode Requirements\
23. Extensibility Model\
24. Compliance Requirements\
25. Future Considerations

------------------------------------------------------------------------

# 1. Introduction

Salve provides culturally intelligent greetings based on time, location,
tradition, and user identity.\
The system MUST operate deterministically and MUST NOT depend on
external APIs for core functionality.

Salve MUST support: - Multi-calendar systems - Multi-language
rendering - Multi-script output - Multi-tradition resolution - Diaspora
blending scenarios

------------------------------------------------------------------------

# 2. Terminology and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", and "MAY" in this document are to
be interpreted as described in RFC 2119.

Definitions:

Core Engine: The greeting resolution engine. Calendar Plugin: Module
that computes date rules. Pack: Cultural dataset module. Saint Identity:
Stable canonical identifier for nameday mapping. Alias Index: Normalized
name-to-identity mapping dataset. Manifest: Registry file describing
available packs.

------------------------------------------------------------------------

# 3. System Overview

Salve consists of the following major subsystems:

-   Core Engine
-   Calendar Plugin Layer
-   Data Pack Layer
-   Loader Layer
-   Name-Day Subsystem
-   CLI Tooling
-   Demo & Developer Mode

The Core Engine MUST remain lightweight and MUST NOT embed large
datasets.

------------------------------------------------------------------------

# 4. Design Principles

Salve MUST adhere to the following principles:

1.  Data-Driven Design
2.  Separation of Concerns
3.  Calendar-Agnostic Architecture
4.  Language-Agnostic Rendering
5.  Offline Capability
6.  Deterministic Behavior
7.  Selective Payload Inclusion
8.  Explicit Configuration

------------------------------------------------------------------------

# 5. Functional Requirements

5.1 Greeting Generation\
The system MUST generate exactly one primary greeting per invocation.

5.2 Event Resolution\
The engine MUST: - Resolve applicable events for a given date. - Filter
events by user affiliations. - Apply priority ordering.

5.3 Multi-Tradition Support\
The engine MUST support simultaneous activation of multiple traditions.

5.4 Multi-Calendar Support\
The system MUST support: - Gregorian - Hijri - Orthodox Pascha - Western
Easter - Chinese lunisolar - Solar terms - Nth weekday rules - User
birthday rules

5.5 Name-Day Support\
The system MUST resolve name-days using canonical saint identifiers.

5.6 Repetition Suppression\
The system MUST support event-level suppression policies.

------------------------------------------------------------------------

# 6. Non-Functional Requirements

6.1 Performance\
The core package SHOULD remain under a minimal footprint when no packs
are included.

6.2 Modularity\
Each pack MUST be independently publishable.

6.3 Determinism\
The engine MUST produce consistent outputs for identical inputs.

6.4 Offline Operation\
The system MUST function fully offline when packs are bundled.

------------------------------------------------------------------------

# 7. Architectural Model

The architecture SHALL be layered:

-   Core Engine
-   Plugin Interfaces
-   Data Packs
-   Loader Abstraction
-   Distribution Layer

No layer SHALL directly depend on implementation details of another
layer beyond defined interfaces.

------------------------------------------------------------------------

# 8. Monorepo Organization

The repository SHALL include:

-   @salve/core
-   @salve/calendars-\*
-   @salve/pack-\*
-   @salve/loader
-   @salve/cli
-   @salve/demo
-   @salve/devtools

Each SHALL be independently versioned.

------------------------------------------------------------------------

# 9. Core Engine Specification

The Core Engine MUST:

-   Accept runtime context (date, timezone, mode, user profile).
-   Query loaded packs.
-   Resolve active events.
-   Apply scoring and suppression.
-   Resolve lexicon.
-   Produce structured result.

The Core Engine SHALL NOT embed large cultural datasets.

------------------------------------------------------------------------

# 10. Calendar Plugin Framework

Calendar plugins MUST:

-   Provide deterministic date resolution.
-   Be pure and side-effect free.
-   Not embed lexicon data.

Calendar plugins MAY implement:

-   Gregorian fixed rules
-   Easter offset rules
-   Hijri conversion rules
-   Lunar computation rules

------------------------------------------------------------------------

# 11. Event Resolution Model

Event resolution MUST:

1.  Identify candidate events.
2.  Filter by tradition tags.
3.  Filter by jurisdiction.
4.  Apply user-specific constraints.
5.  Sort by priority.
6.  Apply suppression rules.
7.  Select highest-priority candidate.

------------------------------------------------------------------------

# 12. Rendering and Localization Model

Rendering MUST:

-   Use BCP-47 language codes.
-   Support script variants.
-   Support formal/informal forms.
-   Inject parameters (name, zodiac, etc.).

The system SHOULD use CLDR-compatible Intl APIs for formatting.

------------------------------------------------------------------------

# 13. Memory and Suppression Model

The engine MUST support:

-   Event-level suppression keys.
-   Time-bound suppression.
-   First-visit detection.
-   Configurable expiration policies.

Memory MUST be pluggable.

------------------------------------------------------------------------

# 14. Data Pack Architecture

Packs MUST include:

-   Metadata
-   Event registry
-   Lexicon entries
-   Optional saint registry
-   Optional alias partitions

Packs MUST NOT contain executable code when distributed as remote JSON.

------------------------------------------------------------------------

# 15. Pack Distribution and Registry

A Pack Registry MUST:

-   Provide pack metadata.
-   Include version and integrity hash.
-   Include download URL.
-   Declare dependencies.

Integrity verification SHOULD be supported.

------------------------------------------------------------------------

# 16. Loader and Integrity Model

The loader MUST:

-   Support static packs.
-   Support remote JSON packs.
-   Optionally verify integrity.
-   Support caching.

Remote pack loading MUST NOT execute arbitrary code.

------------------------------------------------------------------------

# 17. Name-Day Subsystem Specification

The subsystem MUST:

-   Use saint identity as canonical pivot.
-   Separate alias index from saint registry.
-   Support cross-language equivalence.
-   Allow partitioned alias loading.

Onboarding MUST resolve and persist minimal saint mappings.

------------------------------------------------------------------------

# 18. Name Normalization and Fuzzy Resolution

Normalization MUST include:

-   Lowercasing
-   Diacritic removal
-   Unicode normalization
-   Transliteration where necessary

Resolution SHOULD attempt:

1.  Exact normalized match.
2.  Diacritic-free match.
3.  Small edit-distance threshold.
4.  Optional phonetic matching.

------------------------------------------------------------------------

# 19. Performance Requirements

-   Core MUST remain minimal.
-   Alias datasets MUST be partitionable.
-   Lazy loading MUST be supported.
-   Caching SHOULD be implemented.

------------------------------------------------------------------------

# 20. Security Considerations

-   Remote packs MUST support integrity validation.
-   Remote code execution MUST NOT be permitted.
-   All remote data MUST be treated as untrusted input.

------------------------------------------------------------------------

# 21. CLI Tooling Specification

The Salve CLI (`@salve/cli`) provides a command-line interface for project initialization, pack management, and resolution debugging.

## 21.1 Core Commands
- `salve init`: Initializes a `salve.config.json` file in the project root.
- `salve add <pack>`: Registers a new pack (local or remote) in the project configuration.
- `salve resolve`: Interactive or argument-based tool to test the engine's resolution logic against specific contexts.

## 21.2 Configuration
The CLI reads from `salve.config.json` which MUST specify:
- `packs`: Array of pack identifiers or paths.
- `outDir`: Target directory for bundled artifacts.

------------------------------------------------------------------------

# 22. Demo & Developer Mode Requirements

## 22.1 Developer Tools Overlay (`@salve/devtools`)
The Developer Tools SHALL be provided as a pluggable UI component (`SalveDevTools`) that can be mounted into any web-based application.

### 22.1.1 Context Mocking
The tools MUST allow overriding the following context parameters:
- `now` (System Time): For simulating seasonal and temporal greetings.
- `formality`: For testing social context shifts.

### 22.1.2 Diagnostics
The tools MUST expose a "Resolution Trace" containing:
- Selected Event ID and Domain.
- Scoring breakdown.
- Lexicon template selection.
- Complete resolved context object.

## 22.2 Demo Application (`@salve/demo`)
The demo application serves as the reference implementation for the Salve ecosystem. It MUST utilize the real `@salve/core` engine and `@salve/devtools` to demonstrate production-grade integration.

------------------------------------------------------------------------

# 23. Extensibility Model

Salve MUST allow:

-   Third-party pack creation.
-   Additional calendar plugins.
-   Additional tradition registries.
-   Custom suppression policies.

------------------------------------------------------------------------

# 24. Compliance Requirements

An implementation is compliant if:

-   It adheres to separation of concerns.
-   It supports modular pack loading.
-   It implements saint-based nameday pivot.
-   It provides deterministic resolution.
-   (v1) It implements the SCNA normalization algorithm.
-   (v1) It uses ontology-aware greeting rules.
-   (v1) It resolves greetings via the deterministic ScoreTuple model.

------------------------------------------------------------------------

# 25. Advanced Architecture (v1)

## 25.1 Greeting Ontology

Greeting rules MUST declare a speech-act type (`act`), structural form
(`form`), and rhetorical style (`style`). The ontology provides:

-   **Acts**: salutation, valediction, welcome, congratulation,
    observance, acclamation, address\_only, checkin, acknowledge.
-   **Forms**: greeting\_only, address\_only, salutation, email\_opening,
    email\_closing.
-   **Styles**: neutral, formal, ceremonial, liturgical, poetic,
    playful, archaic, bureaucratic, minimal.

## 25.2 Context Model (SalveContextV1)

The v1 context MUST be structured into six sections:

1.  `env` — Temporal and locale environment (now, locale, timeZone,
    region, outputLocale).
2.  `interaction` — Phase, setting, role, relationship, formality,
    style.
3.  `person` — Person being addressed (names, gender, titles, birthday,
    nameday).
4.  `memberships` — Declared identities (traditions, subcultures).
5.  `affinities` — Declared interests (locales, tags).
6.  `policy` — Engine behavior constraints (allowed domains, extras,
    gender inference, repetition windows).

## 25.3 Context Normalization Algorithm (SCNA)

The SCNA MUST convert partial developer input into a fully resolved
`NormalizedContext` through 11 sequential steps including BCP-47
normalization, region derivation, timezone resolution, day period
computation, and safe policy defaults.

## 25.4 Event Namespace Registry

Events MUST follow the deterministic pattern
`salve.event.<domain>.<region?>.<event_name>`. The registry MUST support
alias resolution and domain-based filtering.

## 25.5 Deterministic Scoring (ScoreTuple)

Candidate greeting rules MUST be scored using a 6-field lexicographic
tuple: `(domainRank, eventRank, packPrecedence, rulePriority,
localeMatchScore, stableTieBreak)`.

## 25.6 Style Engine

Style rendering MUST use a family tree for fallback
(e.g., ceremonial → formal → neutral). Style packs MAY provide template
overrides for specific rule IDs.

------------------------------------------------------------------------

# 26. Future Considerations

Potential extensions include:

-   Hebrew calendar support
-   Buddhist calendar support
-   Advanced phonetic name matching
-   Server-side pack optimization tools
-   Binary pack compression formats
-   Gender inference from given names (low-confidence hint model)

------------------------------------------------------------------------

# Conclusion

This document defines a modular, extensible, culture-aware greeting
engine suitable for modern web and Node environments.

Salve implementations conforming to this specification SHALL provide
deterministic, culturally intelligent greetings while maintaining
payload efficiency and architectural clarity.

------------------------------------------------------------------------

