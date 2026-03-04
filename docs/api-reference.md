# Salve API Reference

This document provides a detailed reference for the public APIs of the Salve Universal Greeting & Cultural Awareness Engine.

## Table of Contents
1. [Core Engine (`@salve/core`)](#core-engine-salvecore)
2. [Registry & Loader (`@salve/registry`)](#registry--loader-salveregistry)
3. [Developer Tools (`@salve/devtools`)](#developer-tools-salvedevtools)
4. [Shared Types & Interfaces (`@salve/types`)](#shared-types--interfaces-salvetypes)

---

## Core Engine (`@salve/core`)

### `SalveEngine`
The primary entry point for greeting resolution.

#### Constructor
`new SalveEngine(options?: SalveOptions)`
- **options**: Configuration options including a custom `SalveRegistry` or `GreetingMemory` provider.

#### Methods
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

---

## Registry & Loader (`@salve/registry`)

### `SalveRegistry`
Central store for all registered components, divided into `plugins` and `packs`.

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

### Contextual Interfaces

#### `GreetingContext`
The input for the resolution process.
- `now: Date`: The reference point in time.
- `locale: string`: BCP 47 identifier.
- `affiliations?: string[]`: Cultural/religious identities (e.g. `["islam", "orthodox"]`).
- `formality?: Formality`: `informal`, `formal`, or `neutral`.
- `profile?: AddressProfile`: User details (name, gender, titles).

#### `AddressProfile`
- `firstName?`, `lastName?`: User's names.
- `gender?`: `male`, `female`, `nonBinary`, or `unspecified`.
- `academicTitles?`: Array of strings (e.g., `["Dr.", "Prof."]`).

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

#### `GreetingPack`
- `locale: string`: Target locale.
- `greetings: GreetingLexiconEntry[]`: Collection of templates and their constraints.

#### `GreetingResult`
- `salutation: string`: The final, concatenated string.
- `metadata`: Contains `eventId`, `domain`, `score`, and a resolution `trace`.
