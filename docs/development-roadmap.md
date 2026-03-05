# Development Roadmap: Salve Project

This document outlines the detailed, staged implementation plan for the Salve Universal Greeting & Cultural Awareness Engine.

Status markers: `[x]` = completed, `[…]` = partly done, `[ ]` = not yet started.

## Milestone 1: Requirements & Architectural Design (Completed)
- [x] Analyze chat history and capture all conceptual expansions.
- [x] Draft Functional, Technical, and Architectural Requirements Specification.
- [x] Finalize JSON schemas for greeting packs and event registries.

## Milestone 2: Core Infrastructure & Resolution Engine (Completed)
- **M2.1: Monorepo Scaffolding**
    - [x] Initialize workspace (npm workspaces).
    - [x] Setup `@salve/core`, `@salve/registry`, and `@salve/types`.
- **M2.2: Core Resolution Engine**
    - [x] Implement context resolution (locale, time, traditions).
    - [x] Build the deterministic priority scoring engine.
    - [x] Implement "Maximal Cultural Specificity" selection logic.
- **M2.3: Anti-Repetition Layer**
    - [x] Define pluggable memory interface (`GreetingMemory`).
    - […] Implement default localStorage provider for browser environments (interface exists, no built-in localStorage adapter).

## Milestone 3: Implementing Calendar Plugins (Completed)
- **M3.1: Gregorian Plugin**
    - [x] Implement baseline date resolution (fixed dates).
    - [x] Support Nth-weekday rules (e.g., Thanksgiving).
    - [x] Implement temporal slots (Morning, Afternoon, Evening, Night).
- **M3.2: Religious Calendar Plugins**
    - [x] `@salve/calendars-pascha`: Orthodox and Western Easter calculations.
    - [x] `@salve/calendars-hijri`: Tabular Islamic calendar or conversion utility.
- **M3.3: Specialty Calendars**
    - [x] Implement seasonal transitions (solstices, equinoxes).
    - [x] Support personal milestones (birthdays, anniversaries).
    - [x] Add basic astronomical events (full moon, eclipses).

## Milestone 4: Address Protocol & Social Context (Completed)
- **M4.1: Address Resolver**
    - [x] Implement localized honorific resolution (Mr/Ms/Mx).
    - [x] Support academic and professional title integration.
    - [x] Implement formality-based address formatting.
- **M4.2: Vocabulary & Punctuation**
    - [x] Implement locale-specific punctuation rules (comma placement).
    - [x] Support for vocative case inflections (morphology hooks — Greek vocative).
- **M4.3: Initial Address Packs**
    - [x] Create `@salve/pack-global-addresses` with basic honorifics.

## Milestone 5: Name-Day Subsystem (Completed)
- **M5.1: Name-Day Core**
    - [x] Implement two-stage resolution (Date -> Saint -> Names).
    - [x] Build the Alias Index fuzzy matching (diacritic removal, edit distance).
- **M5.2: Name-Day Data Curation**
    - [x] Create `@salve/pack-el-namedays` (Greek) and `@salve/pack-bg-namedays` (Bulgarian).
    - [x] Implement partitioning strategy for large alias datasets.

## Milestone 6: Distribution & Loader Architecture
- **M6.1: @salve/registry & Loader** (Completed)
    - [x] Implement manifest-based dynamic loading (`SalveLoader`).
    - [ ] Support for integrity hashes and selective payload inclusion.
- **M6.2: Distribution Infrastructure** (Partially Complete)
    - […] Setup automated CI/CD for publishing packs to NPM and a central CDN (GitHub Actions workflows exist for Pages deploy and publish, but no CDN distribution).

## Milestone 7: Tooling & Documentation
- **M7.1: Salve CLI** (Completed)
    - [x] `salve init`: Setup project config.
    - [x] `salve add <pack>`: Manage dependencies and bundling.
    - [x] `salve resolve`: Resolve greeting from CLI.
- **M7.2: Developer Tools** (Completed)
    - [x] Visually interactive Developer Mode overlay (`@salve/devtools`).
    - [x] Debugging trace for greeting resolution.
- **M7.3: Project Documentation** (In Progress)
    - [x] Create comprehensive README with installation and usage guides.
    - [x] Add standard open-source metadata (LICENSE, CITATION, FUNDING).
    - [ ] **API Reference Generation**: Set up TypeDoc or similar to generate site from TSDoc comments.
    - [ ] **Cultural Implementation Guide**: Author a comprehensive guide for pack contributors explaining JSON schemas and specificity scoring.

## Milestone 8: Final Demo & Public Launch
- **M8.1: The "Salve" Showcase (Demo App)** (In Progress)
    - [x] Refine `packages/demo` into a polished web experience powered by the real `@salve/core` engine and calendar plugins.
    - [x] **Interactive Playground**: Add controls for Locale, Time, and User Attributes to see real-time resolution, including presets for multiple cultural scenarios.
    - [x] **"Explain Why" Visualization**: Render a narrative reasoning paragraph with inline editable variables and expose scoring trace.
    - [x] **Static Showcase Build**: Produce a single self-contained `website/index.html` (all JS and CSS inlined) suitable for `file://` usage and GitHub Pages.
    - [ ] Polish typography and microcopy for the landing page hero and explanation text.
- **M8.2: Ecosystem Seeding (Data Packs)** (Partially Complete)
    - [x] Establish single source of truth architecture (`data/packs/`).
    - [x] Create JSON Schema for pack validation (`data/greeting-pack.schema.json`).
    - [x] Create generator pipeline (`scripts/generate-demo-packs.ts`) to produce TS packs from JSON.
    - [x] Seed 6 locale packs: `ar`, `de-DE`, `el-GR`, `en-GB`, `tr-TR`, `zh-CN`.
    - [ ] Finalize and validate existing packs (`el`, `bg`).
    - [ ] Create starter packs for key regions:
        - [ ] `en-US`/`en-GB`: Civil holidays and Thanksgiving.
        - [ ] `de-DE`: High-formality address protocols.
        - [ ] `ar-SA`: Hijri calendar integration demonstration.

## Milestone 9: Salve v1 Advanced Architecture & Modularization
*(Derived from chat transcript 014546)*

- **M9.1: Monorepo Package Extraction** (Not Started)
    - [ ] Split Salve into focused, tree-shakeable packages: `@salve/runtime`, `@salve/schema`, etc.
    - [ ] Implement plugin architecture with 4 main kinds: `pack.locale`, `pack.protocol`, `provider.holiday`, and `provider.nameday`.
- **M9.2: Greeting Ontology & Canonical Schemas** (Partially Complete)
    - [x] Create `greeting-pack.schema.json` (JSON Schema Draft 2020-12) for locale pack validation.
    - [ ] Centralize remaining JSON schemas (`greeting-rule.schema.json`, etc.).
    - [x] Implement the formal Greeting Ontology defining rules by `act` (salutation, valediction, etc.), `form` (email_opening, address_only), and `style` (neutral, formal, ceremonial, etc.) — types and `GreetingRule` defined in `@salve/types`.
- **M9.3: Global Event Namespace Registry** (Completed)
    - [x] Create a deterministic Event Registry (`salve.event.domain.region.name`) with alias support.
    - [x] Support domains: `bank`, `civil`, `religious`, `personal`, `seasonal`, `protocol`, `affinity`.
    - [x] Seed 14 default events covering bank holidays, religious observances, and personal events.
- **M9.4: The Salve Context Normalization Algorithm (SCNA)** (Mostly Complete)
    - [x] Introduce pre-processing of API inputs into a unified `SalveContextV1` → `NormalizedContext`.
    - [x] Automatically derive region from locale, resolve missing timezones, and enforce BCP-47 strictness.
    - [x] Establish strict separation between explicit `memberships` (identities) and soft `affinities` (interests/reminders).
    - [ ] Implement optional, low-confidence Gender Inference from given names as a non-authoritative hint.
- **M9.5: Deterministic Resolution Pipeline & Scoring** (Completed)
    - [x] Refactor engine loop: Context Normalization -> Locale Fallback -> Event Collection -> Candidate Enumeration -> Scoring -> Address Resolution -> Style Rendering -> Composition.
    - [x] Implement the `ScoreTuple` for strict tie-breaking: `(DomainRank, EventRank, PackPrecedence, RulePriority, LocaleMatch, StableTieBreak)`.
- **M9.6: Greeting Style Engine (Rhetorical Register)** (Completed)
    - [x] Introduce structural style modes: `neutral`, `formal`, `ceremonial`, `poetic`, `playful`, `archaic`, `liturgical`, `bureaucratic`, `minimal`.
    - [x] Enable fallback routing (e.g., `ceremonial` -> `formal` -> `neutral`) to transform base greetings.
- **M9.7: Subculture Protocol Packs & Affinity Providers** (Not Started)
    - [ ] Isolate socio-political and institutional greetings into Opt-In Protocol Packs (`@salve/protocol-*`).
    - [ ] Implement "Affinity Reminders" (e.g., reminding a user in Belgium of a Japanese festival if they have an affinity for Japan).
- **M9.8: Provider Integrations** (Not Started)
    - [ ] Wrap `date-holidays` into `@salve/provider-date-holidays` for global bank holidays.
    - [ ] Standardize Nameday remote fetching via `@salve/provider-namedays-*` (Date -> Saint -> Names).
- **M9.9: Demo Integration & Developer Trace API** (Partially Complete)
    - [x] Output `SalveOutputV1` featuring primary greeting, secondary extras (affinities), and full scoring trace metadata.
    - [ ] Update the Demo UI with Style toggles, Affinity selections, and visual trace logs to build developer trust.

## Milestone 10: Salve v1 Launch 
- **M10.1: Launch Logistics**
    - [ ] Final npm publish of all packages (v1.0.0).
    - [ ] GitHub Release creation with detailed changelog.
    - [ ] Public announcement and social sharing (inc. dedication).