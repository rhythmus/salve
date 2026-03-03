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

## Milestone 3: Multiple calendar Systems & Plugins
- **M3.1: Gregorian Plugin** (`@salve/calendars-gregorian`)
    - Fixed dates, nth-weekday rules (e.g., Thanksgiving).
- **M3.2: Religious Calendar Plugins**
    - `@salve/calendars-pascha`: Orthodox and Western Easter calculations.
    - `@salve/calendars-hijri`: Tabular Islamic calendar or conversion utility.
- **M3.3: Specialty Calendars**
    - `@salve/calendars-lunar`: Chinese Lunisolar support for Spring Festival.

## Milestone 4: Address Protocol & Social Context
- **M4.1: Address Resolver**
    - Implement logic for honorific/title construction.
    - Support for relationship axes (stranger vs. friend).
- **M4.2: Vocabulary & Punctuation**
    - Implement locale-specific punctuation rules (comma placement).
    - Support for vocative case inflections (morphology hooks).
- **M4.3: Initial Address Packs**
    - Create `@salve/pack-global-addresses` with basic honorifics.

## Milestone 5: Name-Day Subsystem
- **M5.1: Name-Day Core**
    - Implement two-stage resolution (Date -> Saint -> Names).
    - Build the Alias Index fuzzy matching (diacritic removal, edit distance).
- **M5.2: Name-Day Data Curation**
    - Create `@salve/pack-el-namedays` (Greek) and `@salve/pack-bg-namedays` (Bulgarian).
    - Implement partitioning strategy for large alias datasets.

## Milestone 6: Distribution & Loader Architecture
- **M6.1: @salve/registry & Loader**
    - Implement manifest-based dynamic loading.
    - Support for integrity hashes and selective payload inclusion.
- **M6.2: Distribution Infrastructure**
    - Setup automated CI/CD for publishing packs to NPM and a central CDN (e.g., GitHub Pages).

## Milestone 7: Tooling & Documentation
- **M7.1: Salve CLI**
    - `salve init`: Setup project config.
    - `salve add <pack>`: Manage dependencies and bundling.
- **M7.2: Developer Tools**
    - Visually interactive Developer Mode overlay.
    - Debugging trace for greeting resolution.
- **M7.3: Project Documentation**
    - Generate full API references.
    - Create "Cultural Implementation Guide" for pack contributors.

## Milestone 8: Final Demo & Public Launch
- **M8.1: Purpose-Driven Landing Page**
    - Finalizing the interactive timeline and "Reasoning Paragraph".
    - Integrating the Address Protocol demo (Mahlzeit, Herr Doktor).
- **M8.2: Initial Ecosystem Seed**
    - Release core set of 10+ locale packs.

---
*Roadmap Version 1.0.0*
