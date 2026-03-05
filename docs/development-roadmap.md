# Development Roadmap: Salve Project

This document outlines the detailed, staged implementation plan for the Salve Universal Greeting & Cultural Awareness Engine.

## Milestone 1: Requirements & Architectural Design (Completed)
- [x] Analyze chat history and capture all conceptual expansions.
- [x] Draft Functional, Technical, and Architectural Requirements Specification.
- [x] Finalize JSON schemas for greeting packs and event registries.

## Milestone 2: Core Infrastructure & Resolution Engine
- **M2.1: Monorepo Scaffolding** (Completed)
    - Initialize workspace (NX or Turborepo).
    - Setup `@salve/core`, `@salve/registry`, and `@salve/types`.
- **M2.2: Core Resolution Engine** (Completed)
    - Implement context resolution (locale, time, traditions).
    - Build the deterministic priority scoring engine.
    - Implement "Maximal Cultural Specificity" selection logic.
- **M2.3: Anti-Repetition Layer** (Completed)
    - Define pluggable memory interface.
    - Implement default localStorage provider for browser environments.

## Milestone 3: Implementing Calendar Plugins
- **M3.1: Gregorian Plugin** (Completed)
    - Implement baseline date resolution (fixed dates).
    - Support Nth-weekday rules (e.g., Thanksgiving).
    - Implement temporal slots (Morning, Afternoon, Evening, Night).
- **M3.2: Religious Calendar Plugins** (Completed)
    - `@salve/calendars-pascha`: Orthodox and Western Easter calculations.
    - `@salve/calendars-hijri`: Tabular Islamic calendar or conversion utility.
- **M3.3: Specialty Calendars** (Completed)
    - Implement seasonal transitions (solstices, equinoxes).
    - Support personal milestones (birthdays, anniversaries).
    - Add basic astronomical events (full moon, eclipses).

## Milestone 4: Address Protocol & Social Context
- **M4.1: Address Resolver** (Completed)
    - Implement localized honorific resolution (Mr/Ms/Mx).
    - Support academic and professional title integration.
    - Implement formality-based address formatting.
- **M4.2: Vocabulary & Punctuation** (Completed)
    - Implement locale-specific punctuation rules (comma placement).
    - Support for vocative case inflections (morphology hooks).
- **M4.3: Initial Address Packs** (Completed)
    - Create `@salve/pack-global-addresses` with basic honorifics.

## Milestone 5: Name-Day Subsystem
- **M5.1: Name-Day Core** (Completed)
    - Implement two-stage resolution (Date -> Saint -> Names).
    - Build the Alias Index fuzzy matching (diacritic removal, edit distance).
- **M5.2: Name-Day Data Curation** (Completed)
    - Create `@salve/pack-el-namedays` (Greek) and `@salve/pack-bg-namedays` (Bulgarian).
    - Implement partitioning strategy for large alias datasets.

## Milestone 6: Distribution & Loader Architecture
- **M6.1: @salve/registry & Loader** (Completed)
    - Implement manifest-based dynamic loading.
    - Support for integrity hashes and selective payload inclusion.
- **M6.2: Distribution Infrastructure** (Completed)
    - Setup automated CI/CD for publishing packs to NPM and a central CDN.

## Milestone 7: Tooling & Documentation
- **M7.1: Salve CLI** (Completed)
    - `salve init`: Setup project config.
    - `salve add <pack>`: Manage dependencies and bundling.
- **M7.2: Developer Tools** (Completed)
    - Visually interactive Developer Mode overlay.
    - Debugging trace for greeting resolution.
- **M7.3: Project Documentation** (In Progress)
    - [x] Create comprehensive README with installation and usage guides.
    - [x] Add standard open-source metadata (LICENSE, CITATION, FUNDING).
    - [ ] **API Reference Generation**: Set up TypeDoc or similar to generate site from TSDoc comments.
    - [ ] **Cultural Implementation Guide**: Author a comprehensive guide for pack contributors explaining JSON schemas and specificity scoring.

## Milestone 8: Final Demo & Public Launch
- **M8.1: The "Salve" Showcase (Demo App)** (In Progress)
    - [x] Refine `packages/demo` into a polished web experience powered by the real `@salve/core` engine and calendar plugins.
    - [x] **Interactive Playground**: Add controls for Locale, Time, and User Attributes to see real-time resolution, including presets for multiple cultural scenarios.
    - [x] **"Explain Why" Visualization**: Render a narrative reasoning paragraph with inline editable variables and expose scoring trace via the `@salve/devtools` overlay.
    - [x] **Static Showcase Build**: Produce a single self-contained `website/index.html` (all JS and CSS inlined) suitable for `file://` usage and GitHub Pages.
    - [ ] Polish typography and microcopy for the landing page hero and explanation text.
- **M8.2: Ecosystem Seeding (Data Packs)**
    - Finalize and validate existing packs (`el`, `bg`).
    - Create starter packs for key regions:
        - `en-US`/`en-GB`: Civil holidays and Thanksgiving.
        - `de-DE`: High-formality address protocols.
        - `ar-SA`: Hijri calendar integration demonstration.

## Milestone 9: Salve v1 Advanced Architecture & Modularization
*(Derived from chat transcript 014546)*

- **M9.1: Monorepo Package Extraction**
    - Split Salve into focused, tree-shakeable packages: `@salve/core`, `@salve/runtime`, `@salve/schema`, etc.
    - Implement plugin architecture with 4 main kinds: `pack.locale`, `pack.protocol`, `provider.holiday`, and `provider.nameday`.
- **M9.2: Greeting Ontology & Canonical Schemas**
    - Centralize JSON schemas (`greeting-rule.schema.json`, `locale-pack.schema.json`, etc.).
    - Implement the formal Greeting Ontology defining rules by `act` (salutation, valediction, etc.), `form` (email_opening, address_only), and `anchor` (time, event, social).
- **M9.3: Global Event Namespace Registry**
    - Create a deterministic Event Registry (`salve.event.domain.region.name`).
    - Support domains: `bank`, `civil`, `religious`, `personal`, `seasonal`, `protocol`, `affinity`.
- **M9.4: The Salve Context Normalization Algorithm (SCNA)**
    - Introduce pre-processing of API inputs into a unified `SalveContextV1`.
    - Automatically derive region from locale, resolve missing timezones, and enforce BCP-47 strictness.
    - Establish strict separation between explicit `memberships` (identities) and soft `affinities` (interests/reminders).
    - Implement optional, low-confidence Gender Inference from given names as a non-authoritative hint.
- **M9.5: Deterministic Resolution Pipeline & Scoring**
    - Refactor engine loop: Context Normalization -> Locale Fallback -> Event Collection -> Candidate Enumeration -> Scoring -> Address Resolution -> Style Rendering -> Composition.
    - Implement the `ScoreTuple` for strict tie-breaking: `(DomainRank, EventRank, PackPrecedence, RulePriority, LocaleMatch, StableTieBreak)`.
- **M9.6: Greeting Style Engine (Rhetorical Register)**
    - Introduce structural style modes: `neutral`, `formal`, `ceremonial`, `poetic`, `playful`, `historic`, `liturgical`.
    - Enable fallback routing (e.g., `ceremonial` -> `formal` -> `neutral`) to transform base greetings.
- **M9.7: Subculture Protocol Packs & Affinity Providers**
    - Isolate socio-political and institutional greetings into Opt-In Protocol Packs (`@salve/protocol-*`).
    - Implement "Affinity Reminders" (e.g., reminding a user in Belgium of a Japanese festival if they have an affinity for Japan).
- **M9.8: Provider Integrations**
    - Wrap `date-holidays` into `@salve/provider-date-holidays` for global bank holidays.
    - Standardize Nameday remote fetching via `@salve/provider-namedays-*` (Date -> Saint -> Names).
- **M9.9: Demo Integration & Developer Trace API**
    - Output `SalveOutputV1` featuring primary greeting, secondary extras (affinities), and full scoring trace metadata.
    - Update the Demo UI with Style toggles, Affinity selections, and visual trace logs to build developer trust.

## Milestone 10: Salve v1 Launch 
- **M10.1: Launch Logistics**
    - [ ] Final npm publish of all packages (v1.0.0).
    - [ ] GitHub Release creation with detailed changelog.
    - [ ] Public announcement and social sharing (inc. dedication).