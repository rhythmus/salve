# Integration of salve-dev-playground and salve-test-harness
_Exported on 14-3-2026 at 16:57:43 CET from Cursor (2.6.11)_

---

**User**

Please have a look at @salve-dev-playground.html and @salve-test-harness.html . Then explain how we could integrate and use those tools.

---

**Cursor**


Here’s a concise summary of both files and how to integrate them.

---

## What each file does

### **salve-dev-playground.html**
- **Context builder** – Full SALVE-style context: `env` (locale, outputLocale, region, timeZone, date, time), `interaction` (phase, setting, relationship, formality, style, role), `person` (givenNames, surname, gender, titles, birthday, nameday), `memberships` (traditions, subcultures), `affinities` (locales, tags), `policy` (allowExtras, allowSubcultureAddressing, etc.).
- **Demo engine** – Inline implementation: `normalizeContext` → `collectEvents` → `resolveGreeting` → `applyAddress`. Produces primary greeting, extras, and **trace** (localeChain, events, winner rule, score, address parts).
- **Test authoring** – “Expected” field, compare with result, **Export Test Case**, **Add to Suite**, **Export Suite JSON**, **Export Vitest Snippet** (ready-to-paste `describe`/`it` that call `salve.greet(t.context)`).
- **Result** – Hero greeting, expected vs actual (✓/✗), extras, trace, context JSON, and export textarea.

### **salve-test-harness.html**
- **Simpler context** – Flat: locale, time, relationship, formality, name, surname, title, tradition, date (MM-DD).
- **Simpler engine** – Inline `resolveGreeting(ctx)` with time-based and a few event/title rules (e.g. orthodox 04-20, nl-BE 05-01).
- **Single-run test** – One “Generate Greeting”, one expected string, match/mismatch, debug JSON.
- **No suite, no export** – One case at a time, no Vitest or JSON suite.

So: **playground** = full context + demo engine + trace + test authoring and suite/Vitest export; **harness** = minimal context + minimal engine + single-case compare.

---

## How to integrate and use them

### 1. **Single integrated dev tool**
- Keep **salve-dev-playground.html** as the main UI (it already has the richer context and export).
- Add a “Simple mode” or collapsible section that exposes only the harness-like fields (locale, time, relationship, formality, name, surname, title, tradition, date) and maps them into the full context before calling the same engine. That gives one place for both quick checks and full authoring.

### 2. **Playground = author, harness = runner**
- **Playground**: Used to build contexts and export **suite JSON** (or Vitest snippet). No change to its current role.
- **Harness**: Change its role to “suite runner”:
  - Add “Load suite” (file input or paste) for the playground’s JSON.
  - For each case, build the same context shape the playground uses (or the real engine expects), call the resolver once, compare `result.primary` to `expected.primary`.
  - Show a list: testId, pass/fail, optional “Run again” for a single case.
- Flow: author tests in playground → export suite → load in harness → run all and see pass/fail in the browser.

### 3. **Wire both to the real SALVE engine**
- In **playground**: Replace the inline `resolveGreeting`/`normalizeContext` block with a call to the real API (e.g. `salve.greet(norm)` or whatever the core package exposes). Keep the UI and export format as-is; only the “Run / Resolve” path talks to the real engine.
- In **harness**: Either:
  - Add an adapter that turns its flat context into the full context shape, then call the same real API, or
  - Drop the minimal engine and only support “load suite JSON” and run each case through the real engine (so harness is runner-only).
- Ensures both UIs validate against the same implementation.

### 4. **Context shape alignment**
- Playground context shape (nested `env`, `interaction`, `person`, `memberships`, `affinities`, `policy`) should be the **canonical** shape for tests and for the real engine.
- In the harness, add a small adapter, e.g.:

```js
function harnessToFullContext(flat) {
  return {
    env: { locale: flat.locale, date: flat.date ? `2027-${flat.date}` : "", time: flat.time || "09:00" },
    interaction: { relationship: flat.relationship || "stranger", formality: flat.formality || "neutral", phase: "opening", setting: "ui", role: "initiator" },
    person: { givenNames: flat.name ? [flat.name] : [], surname: flat.surname || "", titles: flat.title ? [flat.title] : [] },
    memberships: { traditions: flat.tradition ? [flat.tradition] : [], subcultures: [] },
    affinities: { locales: [], tags: [] },
    policy: { allowExtras: false, allowSubcultureAddressing: false, allowGenderInference: false, requireExplicitTraditionsForReligious: true, preferMaxSpecificity: true }
  };
}
```

- Then the harness can either call the playground’s `normalizeContext` + `resolveGreeting` (if you keep the demo engine) or the real `salve.greet(...)` with this full context.

### 5. **CI and Vitest**
- **Playground** already exports a Vitest snippet that:
  - Imports `salve` from `@salve/core`,
  - Loops over the exported cases and does `expect(out.primary.text ?? out.primary).toBe(t.expected.primary)` (and optionally `extras`).
- **Use**: Author tests in the playground → Export Vitest Snippet → put the snippet in your repo (e.g. `packages/core/test/greeting-vectors.test.ts`) and run Vitest in CI. The harness is then optional (browser-based runner); Vitest is the canonical runner.

---

## Suggested next steps (priority order)

1. **Align on one context shape** – Treat the playground’s context as canonical; add the adapter in the harness so both (and the real engine) use the same shape.
2. **Wire the playground to the real engine** – Replace the inline resolver with `@salve/core` (or the actual package) so exported tests are valid for the real implementation.
3. **Either merge or specialize** – Either add a “simple” form to the playground and retire the harness, or turn the harness into a suite runner that loads playground-exported JSON and runs each case (with the same engine or real core).
4. **Use the Vitest export in CI** – Add a test file that uses the exported snippet (or imports the same JSON and runs the same expectations) so every export from the playground is automatically run in CI.

If you tell me whether you prefer “one merged tool” or “playground = author, harness = runner”, I can outline concrete edits (e.g. where to add the adapter, how to load suite JSON in the harness, and how to replace the demo engine with `salve.greet` in the playground).

---

**User**

I'd rather prefer to keep all three separate (those two dev tool web applets + the demo webapp we already have). Do not yet implmenent anuthing, but write an integration/implementation plan, and then reference that plan from the ROADMAP.

---

**Cursor**


Checking the docs folder structure and where similar plans are referenced:



Creating the integration plan and adding a ROADMAP reference.



Adding a reference to the integration plan in the Implementation Roadmap:



Summary of what’s in place:

---

**1. New plan: `docs/Integration-Plan-Dev-Tools.md`**

- **§1 — Three artifacts:** Developer Playground (`salve-dev-playground.html`), Test Harness (`salve-test-harness.html`), Demo Webapp (`packages/demo` → `website/`). Roles and locations; all three stay separate.
- **§2 — Integration principles:** No merge; shared contracts; canonical context = playground shape; single engine authority for tests.
- **§3 — Shared context and test format:** Canonical nested context; test case = `{ testId, context, expected }`; suite = array of those (playground export format).
- **§4 — Workflows:** Author tests in playground → optional quick check in harness → CI via Vitest → demo for end users.
- **§5 — Implementation phases (checklist, not done):**
  - **Phase A:** Document canonical context, add harness adapter (flat → nested), optional playground use of real engine.
  - **Phase B (optional):** Harness “Load suite” and run all cases.
  - **Phase C (optional):** Playground wired to real `@salve/core` when available.
  - **Phase D:** ROADMAP reference and README/contributor docs.
- **§6 — File summary:** Table of deliverables, paths, build, engine.
- **§7 — References:** Implementation Roadmap, Coverage Plan, `@salve/core` / `@salve/types`.

---

**2. ROADMAP reference in `docs/Implementation-Roadmap.md`**

Under **M7.2: Developer Tools** a new unchecked item was added:

- **[ ] Standalone dev tools integration:** Align and integrate the Developer Playground, Test Harness, and Demo Webapp per **Integration Plan: Dev Tools & Demo** (three artifacts kept separate; shared context shape and test format; optional suite runner and real-engine wiring).

So the plan is written and referenced from the ROADMAP; no code or behavior has been implemented.

---

**User**

I've moved those files to where they really belong, I think: @website/salve-dev-playground.html and @website/salve-test-harness.html ; also @brand/Salve-logo.svg .

---

**Cursor**


Updating the integration plan and roadmap to reference the new file locations and checking the repo for other references.



Updating the integration plan and roadmap to use the new paths and adding a brief note about the logo location.



Adding a brief note about the logo location to the plan's file summary:



Summary of updates:

**Docs updated for the new locations**

1. **`docs/Integration-Plan-Dev-Tools.md`**
   - **§1 (The Three Artifacts):** Developer Playground and Test Harness now point to `website/salve-dev-playground.html` and `website/salve-test-harness.html` (removed “repo root”).
   - **§6 (File and Deliverable Summary):** Same paths in the table, and a new row for **Brand assets**: `brand/` (e.g. `brand/Salve-logo.svg`) for shared logo and visual identity.

2. **`docs/Implementation-Roadmap.md`**
   - **M7.2** standalone dev tools bullet now references `website/salve-dev-playground.html` and `website/salve-test-harness.html`.

So the plan and roadmap now match:
- **Playground & harness:** `website/salve-dev-playground.html`, `website/salve-test-harness.html`
- **Demo build output:** `website/index.html`
- **Logo:** `brand/Salve-logo.svg` (documented in the plan’s file summary).

---

**User**

Please go through this entire current chat. We've done quite a bit of work; let us update the documentation and then commit. Add to the docs and spec so as to reflect all our recent changes and improvements, including their rationale and design choices. Then, please chunk all of our work/changes, respective to the latest commit, and, whenever, possible inferring the true commit date from the files' `created` and `last edited` timestamps (such that the commits get those timestamps in the git history), in several sizeable commmit stages, as per the rules in AGENTS.md Then commit in order, using a sensible, descriptive, concise commit message for each commit.


---

**Cursor**


Reviewing the chat, updating the docs and spec, and creating logical commits per AGENTS.md. Checking the repo state and AGENTS.md rules.



Adding documentation updates, then creating the commits.



Checking how to get file dates for commits:



Creating commits in logical order with appropriate dates:



Summary of what was done:

---

## 1. Documentation and spec updates

**README.md**
- **Developer Tools:** New subsection describing the standalone Developer Playground and Test Harness (locations in `website/`, roles, link to the Integration Plan).
- **Project Structure:** New “Website and brand” subsection: `website/` for the demo, playground, and harness; `brand/` for shared assets (e.g. `Salve-logo.svg`).
- **Contributing:** Link to the [Integration Plan (Dev Tools & Demo)](./docs/Integration-Plan-Dev-Tools.md).

**docs/Technical-Specification.md**
- **Section 24.3 – Standalone Developer Playground and Test Harness:** Spec text for the two standalone HTML tools (locations, shared contracts, brand assets) and reference to `docs/Integration-Plan-Dev-Tools.md`. States they are separate from the in-app DevTools and the demo by design.

**CHANGELOG.md**
- **Added:** Integration plan, playground and harness in `website/`, brand directory and logo, README and spec changes.
- **Changed:** Move of playground and harness to `website/`, logo to `brand/`, and roadmap M7.2 update.

---

## 2. Commits (in order)

| Commit     | Date       | Message |
|------------|------------|--------|
| `c43abe8`  | 2026-03-14 | **docs: add integration plan for standalone dev tools and demo** — Add `docs/Integration-Plan-Dev-Tools.md` (three artifacts, shared context, phases). |
| `87eca1a`  | 2026-03-14 | **docs: reference dev tools integration in roadmap** — M7.2 task and paths for playground/harness and Integration Plan. |
| `70aa475`  | 2026-03-11 | **refactor: place dev playground, test harness, and logo under website and brand** — Add `website/salve-dev-playground.html`, `website/salve-test-harness.html`, `brand/Salve-logo.svg`; remove `Salve-logo.svg` from root. |
| `442fcf4`  | 2026-03-14 | **docs: document standalone dev tools and brand layout in README and spec** — README Developer Tools + Project Structure; Spec 24.3; CHANGELOG. |
| `d18fa78`  | 2026-03-14 | **chore: update LICENSE copyright notice** — `(c) 2026 Wouter Soudan` → `© 2026 Dr Wouter Soudan`. |

Author/comitter dates were set from file mtimes where it made sense: refactor uses the logo’s mtime (2026-03-11); plan, roadmap, README/spec/CHANGELOG, and LICENSE use 2026-03-14. Working tree is clean; branch is 14 commits ahead of `Github_Salve/master`.

