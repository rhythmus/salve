# Salve API Reference

This document provides a detailed reference for the public APIs of the Salve Universal Greeting & Cultural Awareness Engine.

## Table of Contents
1. [Core Engine (`@salve/core`)](#core-engine-salvecore)
2. [Registry & Loader (`@salve/registry`)](#registry--loader-salveregistry)
3. [Developer Tools (`@salve/devtools`)](#developer-tools-salvedevtools)
4. [Shared Types & Interfaces (`@salve/types`)](#shared-types--interfaces-salvetypes)
5. [Utility Modules](#utility-modules)

---

## Core Engine (`@salve/core`)

### `SalveEngine`
The primary entry point for greeting resolution.

#### Constructor
`new SalveEngine(options?: SalveOptions)`
- **options**: Configuration options including a custom `SalveRegistry` or `GreetingMemory` provider.

#### Methods (Legacy API)
- **`async resolve(context: GreetingContext): Promise<GreetingResult>`**
  Resolves the most culturally appropriate greeting based on the provided context.
- **`use(components: any[]): void`**
  Uses the `SalveLoader` to automatically discover and register components (packs, plugins) from an array.
- **`registerPlugin(plugin: CalendarPlugin): void`**
  Manually registers a calendar plugin for date resolution.
- **`registerPack(pack: GreetingPack): void`**
  Manually registers a greeting pack for a specific locale.
- **`registerHonorifics(pack: HonorificPack): void`**
  Manually registers localized honorifics.
- **`registerTransform(locale: string, hook: TransformHook): void`**
  Registers a linguistic transformation hook (e.g., vocative case) for a locale.

#### Methods (v1 API — Milestone 9)
- **`async resolveV1(input: SalveContextV1): Promise<SalveOutputV1>`**
  Resolves a greeting using the 8-stage deterministic pipeline:
  1. Context Normalization (SCNA)
  2. Locale Fallback Chain
  3. Event Collection
  4. Candidate Enumeration
  5. Deterministic Scoring (ScoreTuple)
  6. Address Resolution
  7. Style Rendering
  8. Composition & Output
- **`registerGreetingRules(packId: string, locale: string, rules: GreetingRule[], precedence?: number): void`**
  Registers ontology-aware greeting rules for a locale pack.
- **`registerStylePack(pack: StylePack): void`**
  Registers a style transformation pack for rhetorical rendering.

---

## Registry & Loader (`@salve/registry`)

### `SalveRegistry`
Central store for all registered components: `plugins`, `packs`, `events`, and `greetingRules`.

### `EventRegistry`
Global event namespace registry. Events follow the pattern `salve.event.<domain>.<region?>.<event_name>`.

#### Methods
- **`registerEvent(entry: EventRegistryEntry): void`** — Register a canonical event with optional aliases.
- **`registerEvents(entries: EventRegistryEntry[]): void`** — Bulk registration.
- **`resolveAlias(alias: string): string | undefined`** — Resolve an alias to its canonical event id.
- **`resolveId(id: string): string`** — Resolve an id, checking aliases if direct lookup fails.
- **`getEvent(id: string): EventRegistryEntry | undefined`** — Get a specific event entry.
- **`getEventsByDomain(domain: EventDomainV1): EventRegistryEntry[]`** — Get all events for a domain.
- **`getAllEvents(): EventRegistryEntry[]`** — Get all registered events.

### `GreetingRuleRegistry`
Stores ontology-aware greeting rules per-pack, retrievable by locale fallback chain.

#### Methods
- **`registerRules(packId: string, locale: string, rules: GreetingRule[], precedence?: number): void`**
- **`getRulesByLocaleChain(localeChain: string[]): Array<{ packId, precedence, rule }>`**

### `SalveLoader`
Helper utility to automatically categorize and register raw data objects or class instances into the `SalveRegistry`.

#### Methods
- **`load(components: any[]): void`**
  Iterates through components and routes them to the appropriate registry department based on their structural signature.

---

## Developer Tools (`@salve/devtools`)

### `SalveDevTools`
A pluggable UI overlay for debugging the resolution engine.

#### Methods
- **`mount(parent?: HTMLElement): void`**
  Injects the DevTools UI into the DOM (defaults to `document.body`).
- **`setOnContextChange(callback: (context: Partial<GreetingContext>) => void): void`**
  Registers a callback for when the developer mocks a new context (e.g., date change) in the overlay.
- **`updateTrace(result: GreetingResult): void`**
  Updates the overlay's "Resolution Trace" and diagnostics with the result of a recent resolution.

---

## Shared Types & Interfaces (`@salve/types`)

### Contextual Interfaces (Legacy)

#### `GreetingContext`
The input for the legacy resolution process.
- `now: Date`: The reference point in time.
- `locale: string`: BCP 47 identifier.
- `affiliations?: string[]`: Cultural/religious identities (e.g. `["islam", "orthodox"]`).
- `formality?: Formality`: `informal`, `formal`, or `neutral`.
- `profile?: AddressProfile`: User details (name, gender, titles).

#### `AddressProfile`
- `firstName?`, `lastName?`: User's names.
- `gender?`: `male`, `female`, `nonBinary`, or `unspecified`.
- `academicTitles?`: Array of strings (e.g., `["Dr.", "Prof."]`).

### Contextual Interfaces (v1 — Milestone 9)

#### `SalveContextV1`
Unified input context with structured sections:
- `env: SalveEnv` — `now`, `locale`, `timeZone?`, `outputLocale?`, `region?`.
- `interaction?: SalveInteraction` — `phase`, `setting`, `role`, `relationship`, `formality`, `style`.
- `person?: SalvePerson` — `givenNames`, `surname`, `preferredName`, `gender`, `genderSource`, `titles`, `birthday`, `nameday`.
- `memberships?: SalveMemberships` — `traditions[]`, `subcultures[]`.
- `affinities?: SalveAffinities` — `locales[]`, `tags[]`.
- `policy?: SalvePolicy` — `allowDomains[]`, `allowExtras`, `allowSubcultureAddressing`, `requireExplicitTraditionsForReligious`, `allowGenderInference`, `repetition`.

#### `NormalizedContext`
Fully resolved context: all fields present, no optionals. Includes computed `dayPeriod` and `localeChain`.

#### `SalveOutputV1`
Structured output of the v1 engine:
- `primary: SalvePrimaryOutput` — `text`, `act`, `eventId?`, `ruleId`.
- `extras?: SalveExtra[]` — affinity reminders or info items.
- `trace?` — `candidates[]`, `usedEvents[]`, `normalizedContext?`.

### Greeting Ontology

#### `GreetingAct`
Speech-act taxonomy: `salutation`, `valediction`, `welcome`, `congratulation`, `observance`, `acclamation`, `address_only`, `checkin`, `acknowledge`.

#### `GreetingForm`
Structural output form: `greeting_only`, `address_only`, `salutation`, `email_opening`, `email_closing`.

#### `GreetingStyle`
Rhetorical register (never inferred, always configured): `neutral`, `formal`, `ceremonial`, `liturgical`, `poetic`, `playful`, `archaic`, `bureaucratic`, `minimal`.

#### `GreetingRule`
Ontology-aware greeting rule: `id`, `act`, `form`, `style`, `priority`, `template`, `when?`, `expectedResponseTemplate?`, `addressTemplate?`.

#### `ScoreTuple`
Deterministic scoring tuple: `domainRank`, `eventRank`, `packPrecedence`, `rulePriority`, `localeMatchScore`, `stableTieBreak`.

### Extension Interfaces

#### `CalendarPlugin`
Interface for plugins that compute semantic events from a date.
- `id: string`: Unique identifier.
- `resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] | Promise<CelebrationEvent[]>`

#### `GreetingMemory`
Interface for anti-repetition providers.
- `has(key: string): boolean`
- `record(key: string, ttlMs?: number): void`

### Data Structures

#### `CelebrationEvent`
- `id: string`: e.g., `eid_al_fitr`.
- `domain: EventDomain`: `personal`, `religious`, `civil`, `temporal`, or `cultural_baseline`.

#### `SalveEvent`
Namespaced event (v1): `id`, `kind` (EventDomainV1), `start`, `end`, `label?`, `source?`, `precedence?`.

#### `EventDomainV1`
Expanded domain taxonomy: `bank`, `civil`, `religious`, `personal`, `seasonal`, `protocol`, `affinity`, `custom`, `temporal`, `cultural_baseline`.

#### `GreetingPack`
- `locale: string`: Target locale.
- `greetings: GreetingLexiconEntry[]`: Collection of templates and their constraints.

#### `GreetingResult`
- `salutation: string`: The final, concatenated string.
- `metadata`: Contains `eventId`, `domain`, `score`, and a resolution `trace`.

---

## Utility Modules

### Context Normalization (`normalizeContext`)
`normalizeContext(input: SalveContextV1): NormalizedContext`
Converts partial developer input into a fully resolved, all-fields-present context via the 11-step SCNA algorithm.

### Day Period Resolution (`resolveDayPeriod`)
`resolveDayPeriod(hour: number): DayPeriod`
Maps hour-of-day (0–23) to: `night` (0–4, 22–23), `morning` (5–10), `midday` (11–13), `afternoon` (14–17), `evening` (18–21).

### Locale Fallback Chain (`buildLocaleChain`)
`buildLocaleChain(locale: string): string[]`
Progressively strips BCP-47 subtags: `"nl-BE"` → `["nl-BE", "nl", "root"]`.

### Style Engine (`getStyleFallbackChain`, `applyStyleTransform`)
- `getStyleFallbackChain(style: GreetingStyle): GreetingStyle[]` — e.g. `"ceremonial"` → `["ceremonial", "formal", "neutral"]`.
- `applyStyleTransform(rule, requestedStyle, locale, stylePacks?): string` — render a rule template through the style family tree.

