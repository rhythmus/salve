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

## Pack Directory Structure

Pack YAML files are organized into category-first subdirectories under
`data/packs/`.  This structure preserves stable, machine-readable
filenames while making the corpus easier to browse and enabling future
selective pack generation.

The current layout is:

```text
data/packs/
  greetings/
  events/
    shared/
    supranational/
    country/
    tradition/          ← includes nameday saints and calendars
  addresses/
  protocol/
  locales/
  regions/
```

### Why Category-First

At first glance, a language-first or region-first tree can feel more
natural for contributors.  For example, it is intuitive to imagine a
Greek contributor working on Greek greetings, Greek holidays, Greek
namedays, and Greek address or protocol data together.

However, Salve's data corpus mixes several different axes:

- language-scoped packs such as `el.address.yaml`
- locale-scoped packs such as `el-GR.greetings.yaml`
- country-scoped packs such as `GR.events.yaml`
- shared or supranational packs such as `international.base.events.yaml`
- tradition-scoped packs such as `christian.orthodox.events.yaml`
- domain overlays such as protocol packs

Because these axes are independent, a broad folder such as `greek/` or
`greece-and-greek/` would quickly become ambiguous.  It would blur the
difference between language, locale, country, tradition, and shared
data, and that ambiguity would make future selective build tooling much
harder to implement.

Category-first organization was chosen for the canonical source tree
because it:

- matches the current schema and generator split
- keeps shared and transnational data separate from locale data
- scales better for future selective build tooling
- gives harvesters and generators a clearer one-to-one mapping to pack
  families

### Contributor and Harvester Perspective

This category-first decision does **not** mean contributor experience is
being ignored.

Contributors will often think in cultural or linguistic contexts rather
than in abstract pack families.  Likewise, harvesters may be maintained
around country, locale, or tradition expertise.  Salve supports both
views:

- a canonical source layout organized by pack family
- contributor-facing documentation and tooling that can surface data
  by language, locale, country, or tradition
- harvester paths and registries that are conceptually aligned with
  the same explicit axes

In other words, the filesystem remains precise, while contributor
experience can still be language-aware and culture-aware.

### Build-System Rationale

A key goal of this layout is to enable developers to build minimal,
highly targeted data bundles.

For example, a developer may want:

- Dutch and Greek only
- secular events only
- academic protocol only
- no religious overlays

That kind of request spans multiple dimensions at once:

- pack family
- language or locale
- country
- domain
- tradition or event class

Category-first storage, combined with an explicit generated pack index
or manifest, is the clearest foundation for this future custom build
pipeline.

### Pack Index

Directory structure alone is not enough for selective bundle
compilation.  The `scripts/generate-pack-index.ts` generator produces
`data/pack-index.generated.json`, a machine-readable manifest that
records metadata for every YAML source file:

- `family`: pack category (greetings, events, address, protocol, etc.)
- `scopeType`: what the scope token represents (`language`, `locale`,
  `country`, `shared`, `supranational`, `tradition`)
- `selector`: the primary scope identifier (`nl`, `el`, `el-GR`, `GR`,
  `EU`, etc.)
- `tags`: additional classification labels (`secular`, `religious`,
  `orthodox`, `academic`, `judicial`, etc.)
- `domain`: protocol domain if applicable (`academic`, `judicial`,
  `diplomatic`, etc.)

Future tooling can consume this index to assemble low-payload bundles
for targeted developer use cases without parsing filenames or walking
the directory tree at build time.

### Coverage and integrator guidance

Integrators who need complete, exhaustive support for a fixed set of
languages (e.g. Dutch, Greek, and English for a vocabulary or
learning app) should consult `docs/Coverage-Plan-NL-EL-EN.md`.  That
document lists which pack families exist for each language, what was
added to achieve parity (e.g. `en.locales.yaml`, exhaustive
`en-GB.greetings.yaml`, `NL.events.yaml`, UK/US event packs,
`NL.regions.yaml`, `GR.regions.yaml`, Greek and English academic
protocol), and the rationale for trilingual labels and greetings (nl,
el, en) in country event packs.  The Technical Specification
(Section 17.1.3) and this guide are the canonical references for pack
layout and authoring; the coverage plan is the entry point for
targeted bundle design.

## Pack Categories

Salve currently maintains the following pack families under
`data/packs/`.

### 1. Greeting Packs

- Filename: `{locale}.greetings.yaml`
- Examples: `nl.greetings.yaml`, `el-GR.greetings.yaml`, `en-GB.greetings.yaml`
- Purpose: time-of-day greetings and other non-event-specific
  utterances
- Primary schema: greeting pack schema used by the greetings pipeline
- Primary generator: `scripts/generate-demo-packs.ts`

Use greeting packs for reusable linguistic forms that are not tied to
a specific celebration or institution.

### 2. Event Registries

- Filename: `{scope}.events.yaml`
- Examples: `BE.events.yaml`, `NL.events.yaml`, `GR.events.yaml`, `UK.events.yaml`, `US.events.yaml`, `christian.events.yaml`
- Purpose: regional, national, civil, or religious events and their
  greeting payloads
- Primary generator: `scripts/generate-demo-packs.ts`

Use event registries when the greeting depends on a calendar event,
feast, observance, holiday, or public occasion.

### 3. Region Registries

- Filename: `{country}.regions.yaml`
- Examples: `BE.regions.yaml`, `NL.regions.yaml`, `GR.regions.yaml`
- Purpose: political and jurisdictional subdivisions for geographic
  filtering
- Primary generator: `scripts/generate-demo-packs.ts`

### 4. Locale Registries

- Filename: `{language}.locales.yaml`
- Examples: `nl.locales.yaml`, `el.locales.yaml`, `en.locales.yaml`
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

- Filename: `{locale}.protocol.{domain}.yaml`
- Examples: `nl.protocol.academic.yaml`, `nl.protocol.judicial.yaml`,
  `el.protocol.academic.yaml`, `en.protocol.academic.yaml`,
  `en.protocol.diplomatic.yaml`
- Location: `data/packs/protocol/`
- Purpose: gated institutional overlays for academic, judicial,
  diplomatic, religious, military, noble, organizational, or other
  domains
- Schema: `data/schemas/protocol-pack.schema.json`
- Generator: `scripts/generate-address-packs.ts`

Protocol packs are **not** generic locale data.  They are activated
only when the runtime explicitly opts into the relevant subculture.

Locale-first protocol naming keeps all protocol overlays for the same
locale adjacent in sorted listings and better matches how contributors
usually think about their work: "Dutch protocol data", "Greek protocol
data", and so on.

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

| Generator | Category markers (recursive) | Emits |
|---|---|---|
| `scripts/generate-demo-packs.ts` | `.greetings.`, `.events.`, `.regions.`, `.locales.` | demo registries |
| `scripts/generate-address-packs.ts` | `.address.`, `.protocol.` | `address-packs.generated.ts`, `protocol-packs.generated.ts`, `honorifics.generated.ts` |
| `scripts/generate-nameday-packs.ts` | `.nameday-saints.`, `.nameday-calendar.` | locale-specific `saints.generated.ts` and `calendar.generated.ts` |
| `scripts/generate-pack-index.ts` | all YAML files | `data/pack-index.generated.json` |

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

Follow these file naming patterns exactly:

- `{locale}.greetings.yaml` in `greetings/`
- `{scope}.events.yaml` in `events/shared/`, `events/supranational/`, `events/country/`, or `events/tradition/`
- `{country}.regions.yaml` in `regions/`
- `{language}.locales.yaml` in `locales/`
- `{locale}.address.yaml` in `addresses/`
- `{locale}.protocol.{domain}.yaml` in `protocol/`
- `{locale}.nameday-saints.yaml` in `events/tradition/`
- `{locale}.nameday-calendar.yaml` in `events/tradition/`

For protocol packs, the locale comes first so related overlays cluster
naturally for contributors and tools.

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

- add `pt.address.yaml` in `addresses/` for Portuguese honorifics and templates
- add `fr.protocol.military.yaml` in `protocol/` for French military addressing
- extend `el-GR.nameday-saints.yaml` in `events/tradition/` with additional saint aliases
- correct a holiday label in `events/country/BE.events.yaml`

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
