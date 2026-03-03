# Requirements Specification: Salve Universal Greeting & Cultural Awareness Engine

**Version:** 1.1.0-draft  
**Status:** Comprehensive Specification  
**Date:** 2026-03-03  

---

## 1. Introduction
Salve is a modular, data-driven framework designed to resolve and render culturally authentic, temporally appropriate greetings and salutations. Unlike generic localization libraries, Salve prioritizes **Maximal Cultural Specificity**, ensuring that greetings reflect the rich traditions, religious contexts, and social protocols of the user's environment.

## 2. Core Principles
### 2.1 Maximal Cultural Specificity
Salve MUST default to the most specific culturally, temporally, and traditionally grounded greeting available. Generic fallbacks (e.g., "Hello") are only used when no specialized greeting exists or when explicitly suppressed by policy.

### 2.2 Privacy & Offline-First
All resolution MUST happen locally. Salve SHALL NOT require runtime API calls to external services. Data is distributed through modular "packs" that are bundled at build-time or fetched and cached at initialization.

### 2.3 CLDR & BCP 47 Alignment
Salve data structures MUST align with the Unicode Common Locale Data Repository (CLDR) patterns and use BCP 47 locale identifiers. Data packs SHALL be organized hierarchically to support locale inheritance.

## 3. Functional Requirements

### 3.1 Event Resolution Engine
- **Multi-Calendar Support**: MUST support Gregorian, Hijri, Julian, Revised Julian, and Chinese Lunisolar calendars.
- **Event Domains**: MUST categorize events into `Personal` (Birthday, Name-day), `Religious` (Easter, Eid), `Civil` (National holidays), `Temporal` (Time of day), and `Cultural Baseline`.
- **Priority Scoring**: MUST use a deterministic priority system (e.g., Personal > Religious > Civil > Cultural Baseline > Temporal > Generic).

### 3.2 Address Protocol Layer
- **Social Role Modeling**: MUST support addressing users based on their relationship (stranger, acquaintance, friend, family, superior, subordinate).
- **Honorifics & Titles**: MUST handle academic titles (Dr., Prof.), professional roles (Judge, Officer), and traditional honorifics (Herr, Frau, Monsieur).
- **Locale-Specific Grammar**: MUST apply correct title precedence, gender agreement, and vocative morphology (e.g., Greek vocative case for names).

### 3.3 Name-Day Subsystem
- **Canonical Saint Identity**: MUST use stable IDs as pivots between languages (e.g., `saint.george`).
- **Two-Stage Resolution**: 
    1. Date -> Saint IDs.
    2. Normalized Name -> Saint IDs (Alias Index).
- **Fuzzy Matching**: MUST support diacritic-insensitive and low edit-distance matching for names.

### 3.4 Greeting Lexicon
- **Formality Axis**: Support for `informal`, `formal`, and `neutral`.
- **Script Preference**: Support for script variants (e.g., Latin vs. Arabic vs. Cyrillic) independently of language.
- **Call-and-Response**: Support for paired greetings (e.g., "Christos Anesti" -> "Alithos Anesti").

## 4. Technical Requirements

### 4.1 Modular Distribution Model
- **Core Engine**: `@salve/core` (logic only, minimal footprint).
- **Data Packs**: NPM packages (e.g., `@salve/pack-el-civil`) or remote JSON manifests.
- **Cherry-Picking**: Developers MUST be able to include only the specific traditions and locales needed.

### 4.2 Data Schema (JSON/LDML-compatible)
- Greetings MUST be stored in JSON files that translate naturally to LDML XML.
- Attributes: `type`, `phase` (open/close), `role` (initiator/responder), `relationship`, `setting` (chat/email/UI).

### 4.3 Runtime resolution pipeline
The resolution process is handled by the `SalveEngine` class, which follows a deterministic 5-step pipeline:
1. **Context Intake**: Consumes `GreetingContext` (locale, now, affiliations, setting, etc.).
2. **Event Detection**: Queries all registered `CalendarPlugins` to generate `CelebrationEvents`.
3. **Scoring & Selection**: Filters events by user affiliations and applies the domain-weighted scoring logic to select the primary event.
4. **Lexicon Matching**: Queries the `GreetingPack` for the active locale to find the best `GreetingLexiconEntry` matching the event and context (phase, role, formality).
5. **Assembly**: Dynamically constructs the `GreetingResult`, incorporating address resolution and the final salutation string.

## 6. Design Rationale

### 6.1 Restoring Cultural Embeddedness
Standard internationalization (i18n) workflows often result in "cultural flattening," where generic phrases are translated literally. Salve’s **Maximal Cultural Specificity** principle is a deliberate architectural choice to restore cultural nuances, making software feel naturally embedded in the user's specific tradition (e.g., prioritizing "Salam alaikum" or "Grüß Gott" where appropriate).

### 6.2 Decoupling Salutation Layers
By separating the **Greeting Phrase** from the **Address Form**, Salve solves the complexity of formal address in highly regulated languages (German, French). This decoupling allows developers to maintain correctness in professional, legal, or religious contexts without duplicating greeting logic.

### 6.3 Standards-First (CLDR) Compatibility
The decision to mirror CLDR’s hierarchical locale model and BCP 47 identifiers ensures that Salve is not a "siloed" solution. It is designed as a complementary layer to existing date/time libraries like Luxon, with a potential path toward inclusion in future Unicode standards.

### 6.4 Payload Efficiency via Modular Packs
To support the "Offline-First" requirement without bloat, Salve uses a monorepo structure where data is siloed into granular packages. This allows developers to bundle only the cultural data relevant to their specific user base.

---
*End of Specification*
