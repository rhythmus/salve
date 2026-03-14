# Integration Plan: Standalone Dev Tools and Demo Webapp

**Goal:** Define how the three separate web artifacts — the Developer Playground, the Test Harness, and the Demo Webapp — coexist, share contracts, and integrate with the Salve engine and test pipeline without merging into a single application.

**Audience:** Contributors, maintainers, and anyone extending or wiring the dev tooling.

**Status:** Plan only; implementation is deferred until explicitly scheduled (e.g. via the [Implementation Roadmap](Implementation-Roadmap.md)).

---

## 1. The Three Artifacts (Kept Separate)

| Artifact | Location | Role |
|----------|----------|------|
| **Developer Playground** | `website/salve-dev-playground.html` | Context builder, event simulator, trace viewer, and **test-authoring**: export single test cases or suites (JSON + Vitest snippet). Contains a **self-contained demo runtime** (inline resolver) for exploration without building the monorepo. |
| **Test Harness** | `website/salve-test-harness.html` | Lightweight **single-case runner**: configure a minimal context (locale, time, relationship, name, title, tradition, date), run resolution, compare output to expected string. Contains a **simplified inline resolver**. Suited for quick sanity checks and manual regression. |
| **Demo Webapp** | `packages/demo` (source) → `website/index.html` (build output) | **User-facing showcase**: polished, narrative-driven experience powered by the real `@salve/core` engine and calendar plugins. Interactive controls, “Explain Why” visualization, static single-file build for GitHub Pages / `file://`. |

All three remain **separate** deliverables: different entry points, different UIs, and (for the two HTML applets) no build step. The demo webapp is the only one built from source and wired to the real engine today.

---

## 2. Integration Principles

- **No merge:** Do not combine the two HTML applets with each other or with the demo. Each serves a distinct use case.
- **Shared contracts:** Where tools need to talk to the same engine or exchange test data, they MUST use the same context shape and the same test-case format.
- **Canonical context shape:** The shape produced by the Developer Playground (nested `env`, `interaction`, `person`, `memberships`, `affinities`, `policy`) is the **canonical** Salve context for tests and for the real engine. Any adapter (e.g. Test Harness flat form → full context) converts into this shape.
- **Single engine authority:** For regression and CI, test vectors are run against **one** implementation: the real `@salve/core` (or the API the roadmap designates). The inline runtimes in the playground and harness are for convenience only and may diverge; they are not the source of truth.

---

## 3. Shared Context Shape and Test Format

- **Context:** Use the normalized context structure expected by `SalveEngine` / `resolveV1` (or the current public API). This is the same structure the Developer Playground builds and exposes as “Context JSON” and “Export JSON.”
- **Test case format:** A single test case is an object with at least:
  - `testId`: string (e.g. `SALVE_001`, `SALVE_CUSTOM_xyz`)
  - `context`: the full context object (canonical shape)
  - `expected`: `{ primary: string, extras?: string[] }`
- **Suite format:** A JSON array of such test case objects. The playground already exports this; the harness (and Vitest) can consume it.

No new formats are required; the playground’s existing export format is the reference.

---

## 4. Intended Workflows (After Integration)

1. **Authoring tests:** Use the Developer Playground to build contexts, run resolution (demo or real engine), set “Expected,” and export a single case or a suite (JSON / Vitest snippet).
2. **Quick manual check:** Use the Test Harness to tweak a few knobs (locale, time, name, tradition, date), run once, and compare to an expected string. Optionally, the harness may “Load suite” and run all cases (see implementation plan).
3. **CI regression:** Vitest (or equivalent) runs the test file generated from the playground (or a checked-in suite JSON). Tests call the real engine with `context` and assert on `expected.primary` (and optionally `expected.extras`).
4. **End-user experience:** The Demo Webapp remains the only user-facing app; it uses the real engine and does not need to implement test export or suite running.

---

## 5. Implementation Phases (High-Level)

Implementation is **not** started by this plan; the following is a checklist for when work is scheduled.

### Phase A: Align Context and Adapters

- [ ] Document the canonical context schema (or point to existing `@salve/types` / spec) in this doc or in `docs/Data-Authoring-Guide.md`.
- [ ] Add an adapter in the Test Harness (or in a small shared script) that maps the harness’s flat form (locale, time, name, surname, title, tradition, date, etc.) to the canonical nested context. The harness then calls the same resolution API (or the same inline normalization + resolution logic) as the playground for consistency.
- [ ] Optionally, make the playground’s “Run / Resolve” path call the real `@salve/core` when run from a built environment (e.g. script that injects the engine), while keeping the self-contained inline runtime for pure `file://` usage.

### Phase B: Test Harness as Suite Runner (Optional)

- [ ] Add “Load suite” (file upload or paste) to the Test Harness. Parse JSON array of test cases (playground format).
- [ ] For each case, build or use `context`, run resolution (real engine or shared inline), compare `result.primary` to `expected.primary`. Display pass/fail list and optional details (testId, expected vs actual).

### Phase C: Wire Playground to Real Engine (Optional)

- [ ] Provide a way to load `@salve/core` in the playground (e.g. bundled runner or local server that serves the playground with the engine injected). When available, “Run / Resolve” uses the real engine; otherwise fall back to inline demo runtime.
- [ ] Ensure exported test vectors remain valid for the real engine (same context shape, same expectations).

### Phase D: Documentation and ROADMAP

- [ ] Reference this plan from the [Implementation Roadmap](Implementation-Roadmap.md) so that future “Developer Tools” or “Demo” work can tie tasks to these phases.
- [ ] Update README or contributor docs to describe when to use which artifact (playground vs harness vs demo).

---

## 6. File and Deliverable Summary

| Deliverable | Path | Build | Engine |
|-------------|------|--------|--------|
| Developer Playground | `website/salve-dev-playground.html` | None (static HTML) | Inline demo runtime; optional real engine (Phase C) |
| Test Harness | `website/salve-test-harness.html` | None (static HTML) | Inline simplified runtime; optional real engine or shared logic (Phase A/B) |
| Demo Webapp | `packages/demo` → `website/index.html` | Vite → single-file | Real `@salve/core` |
| Test suite (exported) | Any (e.g. `docs/fixtures/salve-test-suite.json` or Vitest file) | N/A | Consumed by Vitest / harness |
| Brand assets | `brand/` (e.g. `brand/Salve-logo.svg`) | N/A | Shared logo and visual identity for website and docs |

---

## 7. References

- [Implementation Roadmap](Implementation-Roadmap.md) — milestones and task tracking.
- [Coverage Plan (NL / EL / EN)](Coverage-Plan-NL-EL-EN.md) — data coverage for locales used in dev tools and demo.
- `@salve/core` and `@salve/types` — canonical context shape and resolution API.
