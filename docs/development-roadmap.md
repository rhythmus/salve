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
- **M8.3: Launch Logistics**
    - [ ] Final npm publish of all packages (v1.0.0).
    - [ ] GitHub Release creation with detailed changelog.
    - [ ] Public announcement and social sharing (inc. dedication).

---
*Roadmap Version 1.0.0*
