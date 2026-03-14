# Salve Data Authoring Guide

This guide explains how to create, extend, and maintain **all**
Salve datasets that live under `data/packs/`.

It supersedes the narrower protocol-only guide and documents the
project's YAML-first data architecture across greetings, events,
addressing, namedays, regions, locales, and future dataset types.

## Purpose

Salve separates **data authoring** from **engine logic**.

Human-authored cultural content belongs in schema-validated YAML files
under `data/packs/`.  Code in `packages/*/src/` is responsible for
resolution, validation, generation, normalization, scoring, and
runtime wiring, but it MUST NOT become the hidden storage location for
locale-specific or culture-specific text.

In short:

- Edit YAML when changing locale data.
- Edit schemas when changing the allowed structure of that data.
- Edit generators when introducing a new data category or emitted
  TypeScript shape.
- Edit runtime code only when behavior changes, not when you are
  merely updating phrases, labels, honorifics, aliases, or templates.

## YAML-First Rule

All locale-specific, region-specific, language-specific, cultural, or
domain-specific textual data MUST live in `data/packs/`.

This includes:

- Greeting phrases
- Event labels and nested greeting payloads
- Honorifics and address templates
- Protocol rules and institutional titulature
- Saint definitions, aliases, and calendar mappings
- Locale geography and region registries

This does **not** belong inline in TypeScript source files.

### Anti-Pattern: "Data Burial"

Do not hide culturally meaningful strings inside:

- `const` tables in `src/index.ts`
- hard-coded arrays in resolver modules
- ad hoc lookup maps in plugins
- package-local JSON blobs that bypass the main schema and generator
  pipeline

If the value is data and not behavior, move it to YAML.

## Canonical Data Flow

Every data category follows the same architectural pattern:

1. Author canonical YAML in `data/packs/`
2. Validate structure with a JSON Schema in `data/schemas/`
3. Generate typed `.generated.ts` output via a script in `scripts/`
4. Consume generated output from package entrypoints and runtime code

Generated files are build artifacts.  They MUST NOT be edited manually.

## Pack Categories

Salve currently maintains the following pack families under
`data/packs/`.

### 1. Greeting Packs

- Filename: `{locale}.greetings.yaml`
- Examples: `nl.greetings.yaml`, `el-GR.greetings.yaml`
- Purpose: time-of-day greetings and other non-event-specific
  utterances
- Primary schema: greeting pack schema used by the greetings pipeline
- Primary generator: `scripts/generate-demo-packs.ts`

Use greeting packs for reusable linguistic forms that are not tied to
a specific celebration or institution.

### 2. Event Registries

- Filename: `{scope}.events.yaml`
- Examples: `BE.events.yaml`, `christian.events.yaml`
- Purpose: regional, national, civil, or religious events and their
  greeting payloads
- Primary generator: `scripts/generate-demo-packs.ts`

Use event registries when the greeting depends on a calendar event,
feast, observance, holiday, or public occasion.

### 3. Region Registries

- Filename: `{country}.regions.yaml`
- Examples: `BE.regions.yaml`
- Purpose: political and jurisdictional subdivisions for geographic
  filtering
- Primary generator: `scripts/generate-demo-packs.ts`

### 4. Locale Registries

- Filename: `{language}.locales.yaml`
- Examples: `nl.locales.yaml`, `el.locales.yaml`
- Purpose: linguistic geography, dialect areas, and locale coverage
- Primary generator: `scripts/generate-demo-packs.ts`

### 5. Address Packs

- Filename: `{locale}.address.yaml`
- Examples: `en.address.yaml`, `nl.address.yaml`, `el.address.yaml`
- Purpose: baseline civility data for a locale
- Schema: `data/schemas/address-pack.schema.json`
- Generator: `scripts/generate-address-packs.ts`

Address packs contain:

- honorifics
- postal and letterhead templates
- common baseline titles
- collective formulas
- title-suppression defaults

These are always-on baseline packs for ordinary polite use.

### 6. Protocol Packs

- Filename: `{domain}.{locale}.protocol.yaml`
- Examples: `academic.nl.protocol.yaml`,
  `judicial.nl.protocol.yaml`, `diplomatic.en.protocol.yaml`
- Purpose: gated institutional overlays for academic, judicial,
  diplomatic, religious, military, noble, organizational, or other
  domains
- Schema: `data/schemas/protocol-pack.schema.json`
- Generator: `scripts/generate-address-packs.ts`

Protocol packs are **not** generic locale data.  They are activated
only when the runtime explicitly opts into the relevant subculture.

### 7. Name-Day Saints Packs

- Filename: `{locale}.nameday-saints.yaml`
- Examples: `el-GR.nameday-saints.yaml`,
  `bg-BG.nameday-saints.yaml`
- Purpose: saint identity records, canonical names, traditions, and
  alias corpora
- Schema: `data/schemas/nameday-saints.schema.json`
- Generator: `scripts/generate-nameday-packs.ts`

### 8. Name-Day Calendar Packs

- Filename: `{locale}.nameday-calendar.yaml`
- Examples: `el-GR.nameday-calendar.yaml`,
  `bg-BG.nameday-calendar.yaml`
- Purpose: date-to-saint mappings, including fixed-date and movable
  entries
- Schema: `data/schemas/nameday-calendar.schema.json`
- Generator: `scripts/generate-nameday-packs.ts`

## Source of Truth Rules

When the same concept exists in more than one runtime shape, the YAML
pack remains the canonical source of truth.

Examples:

- `HonorificPack` is derived from address-pack YAML rather than
  maintained separately as hand-written TypeScript.
- generated nameday saints and calendar arrays replace hand-maintained
  lookup maps in pack entrypoints.
- protocol and address registries are emitted from YAML rather than
  authored directly in `.ts`.

Avoid duplicate manual sources of truth.

## Schemas

Every pack family SHOULD have a dedicated JSON Schema in
`data/schemas/`.

The schema is responsible for:

- structural validation
- required fields
- enum restrictions
- identifier patterns
- early contributor feedback before TypeScript build steps

When introducing a new pack family:

1. Add a new schema in `data/schemas/`
2. Use the schema from editor tooling via `$schema` where appropriate
3. Update the relevant generator to validate against it

## Generators

Current generator mapping:

| Generator | Reads | Emits |
|---|---|---|
| `scripts/generate-demo-packs.ts` | `*.greetings.yaml`, `*.events.yaml`, `*.regions.yaml`, `*.locales.yaml` | demo registries |
| `scripts/generate-address-packs.ts` | `*.address.yaml`, `*.protocol.yaml` | `address-packs.generated.ts`, `protocol-packs.generated.ts`, `honorifics.generated.ts` |
| `scripts/generate-nameday-packs.ts` | `*.nameday-saints.yaml`, `*.nameday-calendar.yaml` | locale-specific `saints.generated.ts` and `calendar.generated.ts` |

Generator responsibilities:

- parse YAML
- validate against schema
- fail loudly on malformed data
- emit typed output
- keep generated files deterministic
- preserve the YAML file as the canonical authoring surface

## Authoring Workflow

When adding or updating Salve data:

1. Identify the correct pack family.
2. Edit or create the YAML file in `data/packs/`.
3. Update or add the corresponding schema if the structure changes.
4. Add or update bibliography entries in `data/data-sources.bib`.
5. Run the relevant generator.
6. Run tests and type checks.
7. Review the generated TypeScript only to confirm output, not as the
   primary editing surface.

## Category-Specific Guidance

### Greetings

Use greeting packs for pure utterances such as morning greetings,
parting formulas, and conversational openings.

Do not place event-specific holiday greetings in a generic greetings
pack when they belong to an event registry.

### Events

Use event packs when the greeting depends on a celebration,
observance, public holiday, or feast that can be resolved by date or
calendar logic.

Keep stable identifiers and source provenance.  If an event is derived
from Wikipedia or another canonical list, preserve that traceability.

### Address and Honorific Data

Use address packs for baseline polite addressing that should work even
without institutional opt-in.

Keep ordinary civility separate from gated protocol logic.  Do not mix
judicial, diplomatic, royal, or specialized academic forms into the
baseline locale pack unless they are truly everyday default forms.

### Protocol Data

Protocol packs are for domain-sensitive overlays only.  They SHOULD be
small, explicit, and traceable to authoritative sources.

Prefer one protocol file per domain and locale rather than one giant
mixed file.

### Name-Day Data

Keep saint identity data separate from calendar mapping data.

Use saints packs for:

- QIDs
- canonical names
- traditions
- aliases

Use calendar packs for:

- fixed month/day mappings
- movable feast offsets
- date labels
- saint references

This separation makes generator validation and future harvesting much
easier.

## Provenance and Bibliography

Every dataset MUST be traceable.

When adding or materially extending a pack:

1. Add or update the pack's `sources` field
2. Add or update the corresponding BibTeX entry in
   `data/data-sources.bib`

If a dataset comes from a harvesting workflow, document the upstream
source anyway.  A generator or harvester does not replace provenance.

## Naming Conventions

Follow existing file naming patterns exactly:

- `{locale}.greetings.yaml`
- `{scope}.events.yaml`
- `{country}.regions.yaml`
- `{language}.locales.yaml`
- `{locale}.address.yaml`
- `{domain}.{locale}.protocol.yaml`
- `{locale}.nameday-saints.yaml`
- `{locale}.nameday-calendar.yaml`

Prefer extending existing naming conventions rather than inventing new
ones for each feature.

## Review Checklist

Before submitting data changes, verify:

- the data is in YAML, not buried in code
- the filename matches the established pattern
- the schema covers the structure you introduced
- the generator succeeds
- the generated output updates as expected
- tests still pass
- `data/data-sources.bib` documents the source
- baseline data and gated protocol data are not mixed incorrectly

## Examples of Good and Bad Changes

Good:

- add `pt.address.yaml` for Portuguese honorifics and templates
- add `military.fr.protocol.yaml` for French military addressing
- extend `el-GR.nameday-saints.yaml` with additional saint aliases
- correct a holiday label in `BE.events.yaml`

Bad:

- add a `const DUTCH_HONORIFICS = {...}` table in `src/index.ts`
- place Bulgarian saint aliases directly in a plugin resolver
- store new address templates in a test fixture instead of a pack
- add a new dataset without a schema or source provenance

## Relationship to Other Documentation

This guide is the practical authoring manual for Salve datasets.

Use it together with:

- `docs/Technical-Specification.md` for formal technical requirements
- `AGENTS.md` for contributor and agent policy
- `data/data-sources.bib` for provenance

When in doubt, prefer the YAML-first architecture and extend the pack
pipeline rather than creating a code-local data exception.
