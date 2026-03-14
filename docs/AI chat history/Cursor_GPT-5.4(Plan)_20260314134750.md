# Salve greeting engine datasets
_Exported on 14-3-2026 at 13:46:28 CET from Cursor (2.6.11)_

---

**User**

The Salve greeting engine relies on at least three important datasets: (1) calender events for many locales, regions and countries; (2) generic time-of-day greetings for all supported languages (and their regional locales, dialects); (3) protocols of adressing (singular, plural; formal or informal; with their academic title or military rank, or with genreic, gender-specific title like Mr, Ms Mrs, Mx, etc etc.). We did already much work on  (1) and (2), but as for (3) lots has to be done yet, both in terms of architecture and plumbing, as well as for datastructures and datasets. — Please your feedback on this assessment.

---

**Cursor**


Exploring the codebase to verify your assessment and provide feedback on the three datasets and addressing protocols.



Checking how v1 resolution uses person/titles and whether a protocol-pack architecture exists:



Here’s concise feedback based on the codebase and roadmap.

---

## Your assessment

Your split is right: **(1)** and **(2)** are in good shape; **(3)** is the one that still needs a lot of work, both in data and in architecture/plumbing.

---

### (1) Calendar events — in good shape

- **Implemented:** Gregorian, Hijri, Pascha, specialty (seasons, personal milestones), event registry with domains (bank, civil, religious, personal, seasonal, protocol, affinity), regional data (BE, el-GR), harvesters (Belgium, Greece, EU), UN observances, WikiData merge.
- **Roadmap:** M14 targets 200+ countries, universal holiday inventory, religious/festival expansion. So the direction and tooling for (1) are clear.

---

### (2) Time-of-day greetings — in good shape

- **Implemented:** Lexicon schema with `timeOfDay`, `formality`, `eventRef`, `phase`, `setting`, `relationship`, `audienceSize`; multi-locale packs; YAML + generator; greeting ontology (act, form, style); rule-based selection and scoring.
- **Roadmap:** M13 (24 EU languages + major world + dialects) and the harvester/data-pack workflow give a clear path for scaling (2).

---

### (3) Protocols of addressing — where the gap is

**What’s already there**

- **Types:** `HonorificPack` (titles by gender, formal/informal/standard format strings), `AddressProfile` (firstName, lastName, gender, academicTitles[], professionalRole, nobilityParticle), and v1 `SalvePerson` with `SalveTitle[]` (`system`: academic | civil | religious | military | other).
- **Resolver:** `AddressResolver` does single-recipient address: honorific + academic titles + template (e.g. `{fullHonorific} {lastName}`), with Greek vocative transform and a safety ladder when surname is missing in formal mode.
- **Data:** Only three locales in `pack-global-addresses`: en, de, el; generic titles (Mr/Ms/Mx, Herr/Frau, Κύριε/Κυρία). No Mrs, no regional variants (e.g. French M./Mme/Mlle).

**What’s missing or shallow**

| Area | Current state | Gap |
|------|----------------|-----|
| **Plural / group** | `audienceSize` and `group_address` exist for **greeting selection** (e.g. “hello to a group”). | No **address string** for multiple recipients: no “Dear Sirs”, “Ladies and Gentlemen”, “Dear Board”, or locale-specific group forms. No protocol for building a group address. |
| **Formality spectrum** | Formality is in context and in rules; HonorificPack has formal/informal/standard. | No address formats for “hyperformal” or “highly informal”; no explicit link from formality levels to address templates. |
| **Academic titles** | Supported as `academicTitles[]`, concatenated with honorific. | No ordering rules (e.g. Prof. Dr. vs Dr. …) or locale-specific rules; no structured “title stack” model. |
| **Military / civil / religious** | `SalveTitle` has `system: "military" | "civil" | "religious"`. | Resolver doesn’t treat these systems; no datasets or format rules for rank, Judge, Reverend, etc. Demo uses free-form `professionalRole` only. |
| **Gender-specific titles** | Mr/Ms/Mx (and equivalents) in packs. | No Mrs in en; no marital or other variants; no locale-specific sets (e.g. Fr. M./Mme/Mlle). |
| **Protocol as a first-class concept** | Honorifics are a flat list per locale in the registry. | No dedicated “protocol pack” schema or package type. M9.7 “Subculture Protocol Packs” is not started, so there’s no clear place to plug in institutional/formal protocols. |
| **V1 plumbing** | Normalization produces `SalvePerson` with `titles: SalveTitle[]`. | Address resolution still uses legacy `GreetingContext` and `AddressProfile`; v1 pipeline doesn’t yet drive address resolution from `SalvePerson` + full title systems. |

So: the **concepts** (formality, titles, group vs single) are partly in the types and schema, but the **datasets** (many locales, Mrs/Mx, military/civil/religious, group forms) and the **architecture** (protocol packs, group-address builder, v1 person → address) are largely still to do.

---

### Recommendations

1. **Treat (3) as a separate pillar**  
   In roadmap or spec, call out “address protocol packs” (or “protocol datasets”) alongside calendar and lexicon: own schema, own pack type (e.g. `pack.protocol` in M9.1), and a clear extension point so honorifics + formats + title systems are not ad hoc.

2. **Define “group address” explicitly**  
   Specify whether you want a single string for “N people” (e.g. “Ladies and Gentlemen”) or a list of per-recipient addresses. That drives the data shape (e.g. templates like `group_formal`, `group_mixed_gender`) and the resolver API (e.g. `resolveAddress(context, { audienceSize: number })`).

3. **Bridge v1 person → address**  
   Either extend `AddressResolver` to accept `SalvePerson` + locale (and map `SalveTitle[]` + `SalvePerson` into an internal format), or introduce a small “person → address profile” step in the v1 pipeline so that resolution uses the same profile shape but is fully driven by normalized context.

4. **Start protocol data small**  
   One extra locale (e.g. French) with M./Mme/Mlle and one group form (e.g. “Mesdames, Messieurs”) would validate the schema and resolver for (3) without waiting for the full M9.7 subculture work.

---

**Bottom line:** Your assessment is accurate. (1) and (2) are well advanced in implementation and roadmap; (3) has the right type-level hooks and one resolver, but most of the protocol **data** and **architecture** (protocol packs, group addressing, v1 person/title plumbing) still need to be designed and implemented. Treating (3) as a first-class pillar with a small protocol-pack and group-address design would align the codebase and roadmap with that.

---

**User**

I woud like you to read through all the follwoibg resources, so you have a clear picture of the meat and bone of what we need to tackle in (3): https://en.wikipedia.org/wiki/Style_(form_of_address) , https://de.wikipedia.org/wiki/Anrede , https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique . Based on your above assessment and proposal, and based on everuthing you can infer from the resources I here give, I want you to do a thorough functional analysis of the problem scope at hand, and then propose a detailed implementation plan.

---

**Cursor**

You want a deeper functional analysis of addressing protocols and a concrete implementation plan, so I’m switching into planning mode to structure the scope before proposing architecture and milestones.

I’m gathering two kinds of context in parallel: what the current code/spec already assumes about address protocols, and what the roadmap says about future protocol packs, so the plan can separate core architecture from phased data curation.

The docs confirm a strong architectural principle I’ll lean on in the plan: greeting text and address form should be resolved separately, with protocol packs as opt-in cultural modules rather than hardcoded logic.

I have enough to scope this without more questions: the local spec already commits Salve to separate address construction from greeting selection, and the articles broaden the requirement from simple honorifics into a written-protocol system covering office, title, hierarchy, plurality, and locale-specific politeness conventions.

---

**User**

I think we should address (no pun intended ;) maybe a minor but still imporant issue, which has to do with how we glue the constituent parts together. Many greeting texts in the data/packs have punctuation, eg. "Γεια σας!" has the exclamation mark; also the text is already capitalized. However when we need to add a name, with our without honorifics, then the punctuation has to be stripped first, a comma should be addedd after which the address proper can be add, and finally the punctuation mark (!) must be appended again. Maybe we want this all be configurable as well, so that developers using the Salve library have the possibility to choose whether exclamation mark must be used, or the comma, how capitalization is handled etc.

---

**Cursor**

I’m refining the plan around composition and developer-configurable rendering, because this affects where address resolution ends and where style/composition policy begins.

I found the current runtime already has a punctuation shortcut in `engine.resolve()`, but it only toggles between `"greeting, address"` and `"greeting! address"`, so your concern belongs in the plan as a dedicated composition/rendering layer rather than as an afterthought inside address resolution.

I’m updating the plan in smaller chunks so the composition/rendering concern lands cleanly in both the architecture and the sequencing.

I agree; this is not minor in architectural terms. It sits exactly at the boundary between `address resolution` and `final rendering`, and the current behavior in `packages/core/src/engine.ts` is too simplistic for curated pack text like `Γεια σας!` or `Welcome!`.

I’ve updated the plan to make this a first-class concern. The refined plan now treats Salve as producing not just `greetingPhrase` and `addressForm`, but also a separate `renderedSalutation` stage with a dedicated composition/rendering policy layer. That layer would own things like stripping terminal punctuation before insertion, choosing the separator, re-appending punctuation afterward, and handling capitalization policy. It also explicitly includes developer overrides, so Salve can provide locale-aware defaults while still letting integrators choose house style for commas, exclamation marks, capitalization, and output form.

Concretely, the updated plan now includes:
- a new todo for `composition and rendering policy`
- a dedicated architecture subsection for a `CompositionEngine` / `RenderPolicy`
- runtime deliverables covering punctuation, separators, capitalization, and output-form overrides
- tests for already-punctuated greeting texts and developer style overrides
- revised sequencing so composition policy is designed alongside the canonical address/protocol model

The updated plan is in `/Users/woutersoudan/.cursor/plans/address_protocol_plan_429bfeeb.plan.md`.

If you want, the next planning refinement I’d suggest is to pin down the exact developer-facing API for these rendering overrides, for example whether it should be:
- global engine config
- per-request options
- locale-pack defaults with per-request override
- or a combination of the three

---

**User**

Since in the minimum viable implementation, I want Dutch to be added as an important first target locale, please also consider this resource: https://nl.wikipedia.org/wiki/Aanspreekvorm 

---

**Cursor**

I’m folding Dutch into the MVP target set and using the `Aanspreekvorm` material to sharpen what should be baseline Dutch civility versus later opt-in Dutch protocol packs.

The Dutch resource is useful because it makes the same architectural point even more sharply: Dutch distinguishes between ordinary civil address, formal correspondence formulas, and highly specific academic/judicial/diplomatic/church titulature, so Dutch is a strong MVP locale exactly because it exercises both the baseline layer and the opt-in protocol-pack boundary.

I’ve updated the plan to make Dutch a first MVP locale and to use [Aanspreekvorm](https://nl.wikipedia.org/wiki/Aanspreekvorm) as a key scoping reference alongside [Style (form of address)](https://en.wikipedia.org/wiki/Style_(form_of_address)), [Anrede](https://de.wikipedia.org/wiki/Anrede), and [Prédicat honorifique](https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique).

The main effect on the plan is this:

- Dutch is now explicitly part of the first baseline locale set, alongside German and French comparators.
- The plan now treats Dutch as especially valuable for MVP because it spans ordinary civic written address, academic titulature, judiciary, diplomacy, clergy, and royal/noble forms in one tradition, which makes it a good test case for the layered architecture proposed in the plan.
- The Dutch material also strengthens the decision to split:
  - baseline civility data
  - from opt-in protocol packs

That distinction matters a lot for Dutch, because [Aanspreekvorm](https://nl.wikipedia.org/wiki/Aanspreekvorm) mixes very common written forms like `de heer/mevrouw`, `geachte heer/mevrouw`, and `beste` with much more specialized judicial, diplomatic, ecclesiastical, and royal styles. So the MVP should not flatten all Dutch titulature into one pack. Instead:

- `baseline Dutch MVP`:
  - ordinary written civility
  - safe formal defaults
  - common professional/educational forms
  - likely `nl-NL` first, with room for `nl-BE` after that
- `later opt-in Dutch protocol packs`:
  - academic
  - judicial
  - diplomatic
  - clerical
  - royal/noble

I also updated the “first cohesive unit” in the plan so it now centers on Dutch from day one: baseline data expansion for `nl`, with `de` and `fr` as comparison locales, plus a first gated `protocol-academic` pack that includes Dutch immediately.

The updated plan is still here:

`/Users/woutersoudan/.cursor/plans/address_protocol_plan_429bfeeb.plan.md`

One design implication worth calling out: Dutch makes it even clearer that Salve should model both `predicaat/style` and `aanspreekvorm/direct address` separately. The Dutch resource explicitly shows that those are not always the same thing, especially in royal/protocol contexts, which aligns nicely with the separation already suggested by the French and English materials.

If you want, I can next refine the plan one step further by proposing a concrete Dutch MVP dataset boundary:
- exactly which Dutch forms belong in `baseline`
- exactly which belong in `protocol-academic`
- and which should be postponed to later packs such as `protocol-judicial`, `protocol-diplomatic`, and `protocol-royal`

---

**User**

Now, as a proof of concept, I want you to add to the implementation plan, that on the demo website/webapp, we need a new component which mocks-up an envelope with a full postal address (e.g. "Herrn Prof. Dr. Müller") and a letterhead address mockup (eg. "Weledelgeleerde Heer Müller,"), along all the configuration options, aka variables, that consitute both text outputs (the address on the enevelope, and the address atop a letter).

---

**Cursor**

I’m adding a concrete proof-of-concept deliverable for the demo so the plan doesn’t stay purely architectural: a UI mockup for postal and letterhead address rendering, with the variables that drive both outputs exposed side by side.

I’ve got enough context from the current demo to make this concrete in the plan: the new proof-of-concept should sit in `packages/demo/src/main.ts` and expose separate “postal address” and “letterhead salutation” renderings, driven by the same structured recipient/config variables but with different output rules.

I’ve added this proof-of-concept requirement to the implementation plan.

The plan now explicitly says that the demo in `packages/demo/src/main.ts` should gain a new component that mocks two separate outputs from the same structured address data:

- an `envelope` / postal addressee block, such as `Herrn Prof. Dr. Müller`
- a `letterhead` / opening-line address block, such as `Weledelgeleerde Heer Müller,`

It also now specifies that the demo should expose the variables that drive both outputs, including:

- locale / locale variant
- recipient type
- first name / surname / initials
- gender / neutral preference
- title stack
- office or role code
- formality / relationship
- output form
- composition controls like punctuation, separator, and capitalization policy

And it now frames the demo as a “protocol workbench”, not just a greeting preview, with three distinct renderable outputs:

- `postalAddressText`
- `letterheadAddressText`
- `fullSalutationText`

plus a compact trace explaining which locale defaults, protocol packs, and render policies were used.

I also added a test expectation that the same Dutch recipient data should be able to produce different `postalAddressText` and `letterheadAddressText`, because that distinction is exactly what this proof of concept is meant to make visible.

The updated plan remains here:

`/Users/woutersoudan/.cursor/plans/address_protocol_plan_429bfeeb.plan.md`

One nice side effect of this addition is that it sharpens the architecture further: it confirms that Salve should not model just one generic “address string”, but at least multiple rendering targets derived from the same protocol data.

