# Coverage Plan: Dutch, Greek, and English (NL / EL / EN)

**Goal:** Complete and exhaustive Salve coverage for Dutch, Greek, and English so that a Dutch–Greek vocabulary training app can rely on Salve for all advertised features in these three languages.

**Audience:** Integrators (e.g. vocabulary app), pack authors, and contributors.

---

## 1. What Salve Promises (Feature Matrix)

Salve offers the following data-driven capabilities. For “complete coverage” per language/locale we need at least one pack (or equivalent) in each row where the row applies to that language.

| Category | Purpose | Dutch (nl) | Greek (el / el-GR) | English (en / en-GB) |
|----------|---------|------------|--------------------|----------------------|
| **Greetings** | Time-of-day, encounter/parting, formality, regional variants | ✅ `nl.greetings.yaml` (rich) | ✅ `el-GR.greetings.yaml` (rich) | ✅ `en-GB.greetings.yaml` (exhaustive) |
| **Address** | Honorifics, postal/letterhead templates, titles, collective formulas | ✅ `nl.address.yaml` | ✅ `el.address.yaml` | ✅ `en.address.yaml` |
| **Locales** | Language geography / region definitions for resolution | ✅ `nl.locales.yaml` | ✅ `el.locales.yaml` | ✅ `en.locales.yaml` |
| **Protocol** | Domain overlays (academic, judicial, diplomatic, etc.) | ✅ nl: academic, judicial | ✅ `el.protocol.academic.yaml` | ✅ en: academic, diplomatic |
| **Events (country)** | Public holidays, observances, event-specific greetings | ✅ BE + `NL.events.yaml` | ✅ `GR.events.yaml` | ✅ `UK.events.yaml`, `US.events.yaml` |
| **Regions (country)** | Political subdivisions for filtering (e.g. requiredRegions) | ✅ `NL.regions.yaml` | ✅ `GR.regions.yaml` | N/A (UK/US use event packs) |
| **Nameday** | Saints + calendar for name-day resolution | N/A (no tradition) | ✅ `el-GR.nameday-saints` + `el-GR.nameday-calendar` | N/A |
| **Shared/supranational events** | International + EU events with multi-language labels | ✅ Used by engine | ✅ Used by engine | ✅ Used by engine |

**Legend:** ✅ Present and sufficient for baseline use; ⚠️ Present but incomplete or only partial; ❌ Missing; N/A = not applicable for that locale.

---

## 2. Gaps to Close (Prioritised)

### 2.1 High priority (needed for “complete” NL/EL/EN)

1. **English locale registry**  
   - Add `data/packs/locales/en.locales.yaml` so that English has a locale/geography registry like `nl` and `el` (e.g. en-GB, en-US macro regions).  
   - Enables consistent resolution and bundling for “English” as a language.

2. **English greetings (exhaustive)**  
   - Expand `data/packs/greetings/en-GB.greetings.yaml` to the same level of detail as `nl.greetings.yaml` and `el-GR.greetings.yaml`: time-of-day, encounter/parting, formality, settings (e.g. email_closing, phone), optional regional variants.  
   - Ensures the vocab app has a full English greeting lexicon.

3. **Netherlands events**  
   - Add `data/packs/events/country/NL.events.yaml` with Dutch public holidays and observances (and greetings in `nl` / `en` where useful for the app).  
   - Today only `BE.events.yaml` exists for Dutch-speaking territory; the app may need NL-specific dates and labels.

4. **Greek protocol (at least one domain)**  
   - Add at least one Greek protocol pack, e.g. `data/packs/protocol/el.protocol.academic.yaml`, following the structure of `de.protocol.academic.yaml` or `nl.protocol.academic.yaml`.  
   - Ensures “protocol” is not a Dutch/English-only feature when the app uses Greek.

### 2.2 Medium priority (strong “exhaustive” story)

5. **English protocol (academic)**  
   - Add `data/packs/protocol/en.protocol.academic.yaml` so academic titulature is covered in English as in Dutch and German.

6. **Trilingual event labels and greetings**  
   - In `GR.events.yaml` and `BE.events.yaml` (and new `NL.events.yaml`), ensure important events have `label` and `greetings` with `nl`, `el`, and `en` where applicable.  
   - Directly supports a Dutch–Greek vocab app that also uses English as a bridge language.

7. **Optional: UK and/or US events**  
   - If the app targets English-speaking countries, add `UK.events.yaml` and/or `US.events.yaml` (or a shared `en.events.yaml` if the schema supports it).  
   - Can be deferred if the app only uses English as a UI/bridge language.

### 2.3 Lower priority (optional for “exhaustive”)

8. **Country regions**  
   - Add `NL.regions.yaml` and/or `GR.regions.yaml` if the app or Salve resolution uses `requiredRegions` or region-scoped events (e.g. regional holidays).  
   - Follow `data/schemas/region-registry.schema.json` and existing `BE.regions.yaml` pattern.

9. **Additional protocol domains**  
   - e.g. `en.protocol.judicial`, `el.protocol.diplomatic`, if the vocab app or future use cases need them.

---

## 3. Recommended Next Steps (Concrete)

**Phase A – Minimal “complete” set (do first)**  
1. Add `data/packs/locales/en.locales.yaml` (en-GB, en-US macro regions; schema: locale-registry).  
2. Expand `data/packs/greetings/en-GB.greetings.yaml` to exhaustive level (time-of-day, encounter/parting, formality, email/phone, etc.).  
3. Add `data/packs/events/country/NL.events.yaml` (NL public holidays + nl/en greetings where relevant).  
4. Add `data/packs/protocol/el.protocol.academic.yaml` (Greek academic titles and rules).

**Phase B – Parity and trilingual support**  
5. Add `data/packs/protocol/en.protocol.academic.yaml`.  
6. Enrich `GR.events.yaml` and `BE.events.yaml` (and `NL.events.yaml`) with `label` and `greetings` in `nl`, `el`, and `en` for key events.  
7. If the app targets UK/US users, add UK and/or US event packs.

**Phase C – Optional**  
8. Add `NL.regions.yaml` and `GR.regions.yaml` if region-scoped resolution is required.  
9. Add further protocol packs (en judicial, el diplomatic, etc.) as needed.

After each new or modified YAML file: run the relevant generator(s), update `data/data-sources.bib` for new sources, and run `scripts/generate-pack-index.ts` so the pack index stays up to date.

---

## 4. Integration Note (Vocabulary App)

- **Consumption:** Your app can depend on `@salve/core` and the relevant Salve packs (e.g. from `packages/demo` or a dedicated bundle). Ensure the bundle includes all nl, el, and en-GB/en packs and the event registries (BE, NL, GR, shared, supranational) you need.  
- **Locale list:** For “Dutch, Greek, and English” expose at least: `nl`, `nl-BE`, `el-GR`, `en-GB` (and optionally `en-US` once en.locales and events exist).  
- **Namedays:** Only Greek (el-GR) has nameday data; Dutch and English do not use nameday packs in the current setup.

This document can be updated as packs are added or as the vocabulary app’s requirements become more specific.
