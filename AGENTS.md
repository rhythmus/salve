# AI Agent Code of Conduct

## 📝 Commit Message Style

Follow this format consistently for all commits.

### Structure

```
<type>: <concise summary in lowercase imperative mood>

<body: what was done and why, wrapped at ~72 chars per line>
```

### Type Prefixes

| Prefix | Use when |
|--------|----------|
| `feat` | Adding or extending functionality (new decoders, new modules, new CLI flags, new UI features) |
| `fix` | Correcting a bug or incorrect behaviour |
| `refactor` | Restructuring code without changing behaviour (renames, moves, extractions) |
| `docs` | Documentation-only changes (README, spec, ROADMAP, AGENTS.md, comments) |
| `test` | Adding or updating tests without changing production code |
| `chore` | Tooling, CI, dependency bumps, config changes with no user-facing impact |

### Rules

1. **Subject line**: lowercase after the prefix colon, imperative mood ("add", not "added" or "adds"), no trailing period, ideally under 72 characters.

2. **Body**: separated from subject by a blank line. Describe *what* was delivered and *why*. Use plain sentences or a concise bulleted list. Name files, interfaces, and design choices where relevant. Wrap at ~72 characters.

3. **Scope tags** (e.g. `feat(parser):`) are not used in this project — keep it simple.

4. **Group logically**: one commit per cohesive unit of work (e.g. one ROADMAP phase, one feature area). Do not mix unrelated changes; do not split a single feature across many tiny commits.

5. **No noise**: do not commit generated files (`dist/`, `docs/api/`), secrets, or empty commits.

## 🏷️ Naming Conventions

## 📚 Data Bibliography & Sources

All cultural, linguistic, and calendar data sources — whether procured manually or through automated harvesting scripts — MUST be documented in `data/data-sources.bib`. This ensures complete transparency, accountability, and traceability for all Salve datasets.

When adding a new dataset, manually populating greetings, or implementing a new modular harvester, you MUST promptly add a corresponding entry (`@online`, `@book`, `@article`, etc.) to the bibliography with the authoritative URL and a descriptive note.

## 📄 RFC Specification Authoring

The Salve specification (`docs/salve-rfc-specification.md`) follows the RFC authoring guidelines defined in RFC 7322 ("RFC Style Guide") and its web companion.  All updates to the specification MUST comply with the rules below.

### Required Document Structure

The specification MUST contain the following sections in this order:

1. **First-page header** — title, author(s), category, date, version.
2. **Abstract** — concise overview; MUST NOT contain citations.
3. **Status of This Memo** — one-paragraph legal standing.
4. **Table of Contents** — numbered section list.
5. **Introduction** (Section 1) — motivation and scope.
6. **Requirements Language** (Section 2) — cite RFC 2119 [BCP14] and RFC 8174.  Include the standard boilerplate sentence.
7. **Terminology and Conventions** — define all project-specific terms.
8. **Body sections** — the technical specification.
9. **Internationalization Considerations** — i18n-relevant concerns.
10. **Security Considerations** — REQUIRED; discuss threats and mitigations.
11. **References** — split into "Normative References" and "Informative References" subsections.
12. **Author's Address** — name, affiliation, and email (REQUIRED).

### Style Conventions

| Rule | Detail |
|------|--------|
| **Language** | English, American spelling preferred, internally consistent. |
| **Sentence spacing** | Two spaces after a period ending a sentence. |
| **Serial comma** | Always use the Oxford comma (e.g., "TCP, IP, and SNMP"). |
| **Capitalization** | Title case for section headings.  Consistent term capitalization throughout. |
| **Abbreviations** | Expand on first use, followed by the abbreviation in parentheses (e.g., "Application Programming Interface (API)").  Well-known abbreviations (TCP, IP, HTTP, JSON, URI, API, CLI, CDN, npm) may be used without expansion. |
| **Citations** | Square brackets, no spaces (e.g., `[RFC2119]`, `[BCP47]`).  Every citation MUST have a matching entry in the References section, and vice versa. |
| **Cross-references** | Use section numbers, not page numbers (e.g., "see Section 15.4"). |
| **URIs** | Wrap in angle brackets (e.g., `<https://example.com/>`). |
| **RFC 2119 keywords** | Use ALL CAPS only when the term carries normative weight as defined in RFC 2119 (MUST, SHOULD, MAY, etc.).  Do not capitalize these words for ordinary emphasis. |

### Reference Formatting

Follow the RFC 7322 §4.8.6 format for all reference entries:

```
[TAG]      Author(s), "Title", Series/Number, Date,
           <URI>.
```

Split references into:
- **Normative References** — essential to implementing or understanding the spec.
- **Informative References** — provide additional context or background.

### When Editing the Specification

1. Preserve the overall section numbering structure.  Add new sub-sections rather than renumbering.
2. When adding a new normative term (MUST, SHALL, etc.), verify it is genuinely needed for interoperability — do not overuse.
3. When referencing a new external document, add a properly formatted entry to the appropriate References sub-section.
4. Keep prose style: avoid bare bullet-only sections.  A section SHOULD contain at least one introductory sentence before any list.
5. Maintain consistent terminology.  Use the exact term forms defined in the Terminology section.
