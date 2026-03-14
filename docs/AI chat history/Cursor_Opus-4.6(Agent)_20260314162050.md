# Data packs folder organization proposal
_Exported on 14-3-2026 at 16:19:46 CET from Cursor (2.6.11)_

---

**User**

So the data/packs folder is becoming very big and unorganized with many, many files. I believe we could have some better structure and organization of those data files. The pattern we are following is that those YAML data files, they start with a BCP47 compliant language tag or an ESO compliant region tag, except for shared data like international base events, international secular events, religious calendars like the Muslim events and the Christian events. So I believe we should reorganize this folder such that related files will be placed in dedicated subfolders, like everything that relates to Greek and Greece could be placed in a folder called Greece and Greek. For example, we could put in the gr.events.yaml together with all of data files starting with AL from Elinica. And thus we could do that for all regions and languages that belong together. Mind you, the problem might be that this might be opinionated because languages and regions do not always correspond, like in the case of Greek. Even for Greek, Cyprus is another region and some Greek-speaking regions in Turkey, like Pontic and Greek, belong to other regions while they have still Greek language tag compliant data. Please make a proposal for how we could reorganize our data packs folder for better structure.

---

**Cursor**

I’m going to inspect the current `data/packs` layout and naming patterns first so the proposal fits the repo’s actual data model, then I’ll suggest a structure that avoids locking you into overly opinionated region-language groupings.

I’m gathering two things in parallel: the current pack taxonomy in `data/packs`, and whether the generator/docs pipeline assumes a flat directory so the proposal can distinguish “conceptual reorg” from “mechanical reorg.”

The current picture is clear: the repo is organized by pack family first and uses a deliberately mixed “scope” namespace second. I’m reading a few representative Greek and shared packs now so the proposal can account for your `el`/`GR` example rather than treating it abstractly.

I have enough context to make a concrete proposal. The core trade-off is that “Greek/Greece” style grouping helps humans browse, but it clashes with the repo’s current mixed scope model, so I’m proposing a structure that groups by pack family first and by scope class second instead of by a single opinionated geography bucket.

---

**User**

Let us keep in mind that of course the end goal of the Salve library is to offer as much as flexibility and configurability for developers using the Salve package and/or packages. So developers could want to use everything Salve offers but only supporting targeted languages like for example a developer only wants to bundle and generate custom packs so as to support Dutch and Greek but only secular events so not religious events and maybe they should also say they want to support academic titles but not military ranks. So we want the utmost configurability and flexibility so custom packs can be built on the fly and generated into highly efficient low payload minimized JSON data packs all generated from the vast collection of data we collect and maintain in the data packs folder through the YAML data files.

---

**Cursor**

I’m updating the proposal to optimize for selective generation and tiny deployable bundles, not just folder neatness. That shifts the preferred structure toward something a future pack builder can query by category, scope, and domain without guessing from geography.

I’m revising the plan so the filesystem becomes a future build graph: a pack builder should be able to include `locale=nl|el`, `events=secular`, and `protocol=academic` without special-case path logic or brittle filename parsing.

The proposal is now tuned to Salve’s bigger goal: not just organizing `data/packs`, but making it a good source tree for future selective pack compilation.

The main implication is that I would not organize around human buckets like `Greece and Greek/`. That is browseable, but it is weak for build-time selection. A future developer should be able to say “give me Dutch and Greek, secular events only, academic protocol only” and have tooling resolve that cleanly. For that, the better model is:

- category-first folders such as `greetings/`, `events/`, `addresses/`, `protocol/`, `namedays/`
- stable filenames that keep machine-readable identifiers like `el-GR.greetings.yaml`, `GR.events.yaml`, `academic.nl.protocol.yaml`
- a generated pack index or manifest that records dimensions like family, scope type, language, locale, country, event tags, and protocol domain

So the filesystem improves human navigation, and the manifest/index enables future low-payload custom bundle generation.

I also updated the plan to include a new explicit step: design the metadata/index layer needed for selective builds. If you want, the next step can be to turn this into a concrete technical design for the custom pack builder API and selector model, before making any code changes.

---

**User**

Please explain to me why you are organizing our YAML data files by category first. So we would have Greetings folder besides an Events folder, besides an Addresses, Protocol, and Locales, Regions, Name Days folder. For this field, it's counter intuitive to me. Not that I'm saying you are wrong, but please clarify why you choose this path. Because I would have intuitively expected we would organize our files by language and Region first such that we would have a data packs /greek or grease or al or gr folder in which we would then have the Greek, so the el.address.yml file, the el-gr.greetings.yml file, and so on. Precisely because of my latest remark in how developers would probably want custom data packs being built.

---

**Cursor**

The reason I favored `category first` is that Salve’s source corpus already has multiple independent axes, and a `language/region first` tree would mix them together too early.

The core issue is this: a developer’s build request is usually not “give me everything Greek.” It is closer to “give me `el` and `nl`, only secular events, plus academic protocol, no religious overlays.” That request spans several different dimensions at once:

- language or locale: `el`, `el-GR`, `nl`
- geography: `GR`, `BE`
- content family: greetings, events, addresses, protocol, namedays
- domain or tradition: academic, judicial, christian, orthodox, muslim, secular

If the source tree is organized by `Greek/`, `Dutch/`, `Belgium/`, and so on, those dimensions get tangled. The builder then has to infer too much from folder names.

## Why Category First Fits Better

Because the data is not one homogeneous thing. Each family behaves differently:

- `greetings` are language or locale utterances
- `events` mix country, supranational, shared, and religious scopes
- `protocol` is domain-based overlay data like `academic` or `judicial`
- `namedays` are a special calendar dataset
- `regions` and `locales` are registry metadata, not end-user content in the same sense

So category-first says: first separate by what the data is, then filter by who or what it applies to.

That is useful both for humans and for tooling:

- humans can go straight to `events/` or `protocol/` when working in that domain
- generators already work by category and schema
- future pack builders can select across independent dimensions without path hacks

## Why Language/Region First Feels Intuitive, But Breaks Down

Your intuition makes sense if most files were strictly “about one language-community bundle.” But Salve already has counterexamples:

- `GR.events.yaml` is country-scoped
- `el-GR.greetings.yaml` is locale-scoped
- `el.address.yaml` is language-scoped
- `academic.nl.protocol.yaml` is domain plus language
- `christian.events.yaml` and `international.secular.events.yaml` are shared/transnational

So if you make a `greek/` folder, what goes in it?

- `el.address.yaml` maybe
- `el-GR.greetings.yaml` yes
- `GR.events.yaml` probably
- `christian.orthodox.events.yaml` maybe, but that is not only Greece
- `international.secular.events.yaml` no, but Greek developers may still need it
- future `el-CY` data partly yes, partly not

That means a language-first layout still needs exceptions and shared folders. Once that happens, the “all Greek things live together” promise stops being true.

## Why This Matters For Custom Builds

If a developer wants:

- languages: `nl`, `el`
- events: secular only
- protocol: academic only

a category-first tree plus an index makes that clean:

- read `greetings/` and keep `nl` and `el*`
- read `events/` and keep `shared secular` plus matching country packs if selected
- read `protocol/academic/` and keep `nl` and `el` if present
- ignore `protocol/judicial/`, `events/tradition/`, `namedays/`, etc.

With language-first folders, the builder still has to crawl multiple folders and also understand exceptions for shared events, religious overlays, and protocol domains. In practice, it becomes less declarative, not more.

## The Real Principle

I’m not saying “developers think in categories.”  
I’m saying “source storage should preserve orthogonal dimensions.”

Then the builder can expose the developer-friendly interface they actually want, such as:

```yaml
include:
  languages: [nl, el]
  families: [greetings, events, addresses, protocol]
  eventTags: [secular]
  protocolDomains: [academic]
exclude:
  eventTags: [religious]
```

That is more flexible than making path layout carry all the semantics.

## The Best Compromise

If your mental model is still language-first, I think the best compromise is:

- keep the canonical source tree `category first`
- add a generated pack index or manifest that lets tooling query by language, locale, country, domain, and tags
- optionally provide a developer-facing “language-centric view” in docs or tooling, without making the filesystem itself encode contested relationships

So the filesystem stays rigorous, while the build API feels intuitive.

If you want, I can next sketch a side-by-side comparison of `category-first` versus `language-first` using your exact Dutch/Greek + secular + academic example, so you can see where each model becomes awkward.

---

**User**

I'm inclined to follow your leads and recommendations, especially because your explanation seems very valid to me. Yet, intuitively, my state of mind or my mental mode still is language first, because I would expect that if we were to invite contributors, that these contributors are not so much domain experts and even polyglots domain experts in, let's say, academical addresses, but that those contributors would rather be situated within a cultural context. So language first. So I expect some Greek professors would be knowledgeable about all the various Greek protocols, customs, events, feast days, religious holidays, secular holidays, without that necessarily meaning that a Greek professor also is knowledgeable about similar data for French. That's why.

Also bear in mind that we would want human contributors to work on the data packages but also for some data packages we already have codependent or related harvesters. So many of our data comes from Wikipedia and on the online sources and it is a selfish intent to not only list those data files but to use them for regular updates on the data files and this by implementing dedicated harvesters so as to scrape those resources again and then maybe bring in sync and/or update our data packages. This means that our harvester packages or harvester package I guess should probably best follow the same organization as our data packs folder.

---

**Cursor**

I’m re-framing the proposal around contributor ownership and harvester symmetry now, because that is the strongest argument for a language-context layout and it should influence the plan rather than be treated as a minor preference.

Your concern is real, and it is probably the strongest argument against a pure `category-first` layout.

You are basically saying: contributors and maintainers do not think like compilers. They think in cultural contexts. A Greek contributor may plausibly know Greek greetings, Greek holidays, Greek namedays, Greek academic forms, and Greek-specific regional data all at once. That is a very good point, and it means the filesystem should not optimize only for generator code.

## Why I still leaned category-first

Because the canonical source tree has to serve three masters at once:

- human contributors
- harvesters and generators
- future selective pack builders

The last two care a lot about separating independent axes cleanly.

For example, Salve already contains data that is not naturally “Greek” or “Dutch” in one unified sense:

- `el.address.yaml` is language-scoped
- `el-GR.greetings.yaml` is locale-scoped
- `GR.events.yaml` is country-scoped
- `christian.orthodox.events.yaml` is tradition-scoped
- `international.secular.events.yaml` is shared and transnational
- `academic.nl.protocol.yaml` is domain-scoped

That is why I hesitated to recommend folders like `greek/` or `greece-and-greek/`: they look intuitive, but they silently collapse language, locale, country, religion, and domain into one bucket.

## Where your intuition is correct

If the primary question is, “How will real contributors discover what they should edit?”, then a language- or culture-oriented view is better.

Also, your harvester point matters a lot. If you have a Greece holiday harvester, a Greek nameday harvester, and maybe later a Greek protocol or registry harvester, maintainers will naturally think in a Greek maintenance surface, not in five separate category silos.

So I think your instinct should influence the architecture more than I initially framed it.

## The refinement I would now recommend

I would not switch all the way to a vague `greek/` folder model, but I would soften the original recommendation into this:

**Keep the data model orthogonal, but make the repository navigable by cultural scope.**

In practice, that means one of two good options.

### Option A: Keep `category-first` as canonical, add strong contributor/harvester indexing

This is still my slightly preferred option for long-term build flexibility.

Why:
- generators and schemas are category-specific already
- selective builds will be easier
- shared and transnational packs remain cleanly separated

But then you must add:
- a generated pack index with `language`, `locale`, `country`, `tradition`, `domain`, and tags like `secular` or `religious`
- contributor docs or ownership maps by cultural context
- harvester registry metadata that groups related harvesters by scope, even if the files are stored by category

This gives you a machine-friendly source tree and a human-friendly working model.

### Option B: Use `scope-first`, not `language-first in a fuzzy sense`

If you want the filesystem itself to mirror contributor mental models, this is the alternative I would seriously consider.

Not:

```text
data/packs/greek/
```

But rather something explicit like:

```text
data/packs/
  shared/
    events/
  language/
    el/
      address/
      locales/
    nl/
      address/
      protocol/
  locale/
    el-GR/
      greetings/
      namedays/
    bg-BG/
      namedays/
  country/
    GR/
      events/
      regions/
    BE/
      events/
      regions/
  tradition/
    christian/
      events/
    christian.orthodox/
      events/
    muslim/
      events/
  supranational/
    EU/
      events/
```

This is much better than `greek/` because it preserves the distinctions that matter:
- `el` is not `el-GR`
- `GR` is not `el`
- `christian.orthodox` is not synonymous with Greece
- `shared` stays shared

Honestly, after your explanation, this `scope-first` model may be the best compromise if contributor workflow is the top priority.

## Why I still would not choose plain `Greek/` folders

Because they become ambiguous very quickly.

Questions that would immediately appear:
- Does `Greek/` include Cyprus Greek?
- Does it include Pontic Greek?
- Does it include `GR.events.yaml` but also `el.address.yaml`?
- Does it include Orthodox shared packs?
- Does a Greek-speaking contributor update `international.secular.events.yaml` there too?

So the real issue is not “category-first versus language-first”.
It is:

- **orthogonal explicit scopes**, or
- **fuzzy human buckets**

I strongly prefer the first.

## How this affects harvesters

I agree with you that harvesters should broadly follow the same conceptual organization as packs.

But I would align them by **explicit scope and family**, not by fuzzy culture folders.

So either:

- category-first harvester layout:
  - `harvesters/events/country/GreeceHarvester.ts`
  - `harvesters/events/shared/UnObservancesHarvester.ts`

or scope-first harvester layout:
- `harvesters/country/GR/events.ts`
- `harvesters/shared/international/secular-events.ts`
- `harvesters/locale/el-GR/namedays.ts`

Both are coherent.

What I would avoid is a structure where the meaning of “Greek” has to be inferred differently in each subsystem.

## My updated recommendation

After your latest point, I would narrow the recommendation to this:

- If build tooling and schema clarity are the main priority, keep `category-first`.
- If contributor ownership and harvester maintenance symmetry are the main priority, prefer an explicit `scope-first` tree.
- In either case, do **not** use broad folders like `Greek/` or `Greece and Greek/`.
- Use explicit axes such as `language/`, `locale/`, `country/`, `tradition/`, `shared/`, and `domain/`.

So I am less attached now to `category-first` specifically than I am to **explicit non-ambiguous axes**.

If you want, I can update the plan to compare these two serious candidates directly:

1. `category-first + pack index`
2. `scope-first + explicit language/locale/country/tradition folders`

That side-by-side comparison would probably make the decision much easier.

---

**User**

Okay, I follow your lead and recommendation!

Still one last remark as regards the plan, esp. on file naming. I would have rather preferred

`nl.protocol.judicial.yaml` instead of `judicial.nl.protocol.yaml`, `nl.protocol.academic.yaml` instead of `academic.nl.protocol.yaml`, `en.protocol.diplomatic.yaml` instead of `diplomatic.en.protocol.yaml` etc.

---

**Cursor**

I’m adjusting the plan to make protocol filenames locale-first. That change actually complements your contributor model well, because sorted filenames then cluster by language instead of scattering Dutch protocol packs across `academic/` and `judicial/` prefixes.

I agree with that change, and I’ve updated the plan accordingly.

Your proposed protocol naming is better:

- `nl.protocol.judicial.yaml`
- `nl.protocol.academic.yaml`
- `en.protocol.diplomatic.yaml`

I think this is stronger than the current `judicial.nl.protocol.yaml` style for three reasons.

First, it matches contributor intuition better. A contributor usually thinks “I’m working on Dutch protocol data,” not “I’m working on the academic domain across all languages.” Putting `nl` first makes the file immediately legible in that way.

Second, it groups better in sorted listings. All Dutch protocol overlays stay adjacent, which is useful both in the filesystem and in tooling output.

Third, it is more consistent with the rest of your pack naming style, where the scope token already tends to lead:
- `el.address.yaml`
- `el-GR.greetings.yaml`
- `GR.events.yaml`

So the updated recommendation is:

- keep category-first folders
- keep stable, machine-readable filenames
- for protocol packs specifically, use `"{locale}.protocol.{domain}.yaml"`

The only caveat is migration cost: existing code and docs currently assume `*.protocol.yaml`, so if you eventually adopt `nl.protocol.academic.yaml`, the generators and documentation will need to be updated in lockstep. But as a naming convention, I think your version is better.

If you want, the next planning step can be to normalize the full naming convention set across all families, so we decide once whether every filename should be `scope-first` in the same way.

---

**User**

Please summarize our discussion and its rationale and design decissions to the relevant documentation, for future reference.

---

**Cursor**

I’m going to update the contributor-facing docs with a concise record of the reasoning, the chosen direction, and the naming decisions so this doesn’t live only in chat history.

I’ve identified the two best places to record this: the authoring guide for the architectural rationale, and the roadmap for the planned implementation work around recursive discovery and selective pack builds.

I’ve written the decision record into the authoring guide and roadmap. I’m doing one quick pass now to make sure the wording clearly distinguishes current state from planned direction so contributors are not misled.

I documented the outcome in the places most likely to help future contributors:

- `docs/Data-Authoring-Guide.md`
- `docs/Implementation-Roadmap.md`

In the authoring guide, I added a new “planned pack organization” section that captures:
- why the current flat `data/packs` layout is reaching its limits
- why the chosen direction is category-first for the canonical source tree
- why that still respects contributor and harvester workflows
- why a future generated pack index/manifest is needed for selective low-payload builds
- the protocol naming decision to move from `academic.nl.protocol.yaml` toward `nl.protocol.academic.yaml`

In the roadmap, I added explicit planned work for:
- reorganizing `data/packs` into subdirectories
- recursive discovery and a shared pack index
- protocol filename normalization
- aligning harvester output paths with the new structure

I did not run tests, since this was a documentation-only change. If you want, I can next turn this into a short ADR-style document under `docs/` as a more formal architecture decision record.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

I'll work through the todos in order. Let me start by understanding the full current state, then execute the implementation sequence from the plan.

Let me first verify the full current file inventory and read the harvester sources to understand all paths that need updating.

Good, I now have a complete picture. Let me execute the implementation. The practical order is:

1. Create the shared recursive discovery helper (before moving files)
2. Update all three generators to use recursive discovery
3. Create the target directory structure and move/rename all files
4. Update harvester output paths
5. Verify generators still work
6. Update all documentation

Let me start.

Now I have all the context. Let me start implementing. First, I'll create the shared discovery helper and update all three generators simultaneously.

Now update all three generator scripts to use recursive discovery.

Now update `generate-address-packs.ts`:

Now update the call sites in `generate-address-packs.ts` to use category names instead of suffixes:

Now update `generate-nameday-packs.ts`:

Now update the call sites in `generate-nameday-packs.ts`:

Good. Now let me verify generators still work with the current flat layout before moving files.

That's a pre-existing YAML parse error in `BE.events.yaml`, not related to my discovery changes. Let me verify by checking the generated output timestamp and also run the other two generators.

All three generators work correctly with recursive discovery on the current flat layout. The demo generator failure is a pre-existing YAML issue in `BE.events.yaml`, not related to my changes. Now let me fix that pre-existing issue quickly, then proceed with the migration.

The Iris Festival entry at line 116 is missing its `- date:` line -- it's not a list item, just a bare mapping key that duplicates `label:` from the previous entry. Let me fix that and check the rest of the file.

I see the issue -- the Iris Festival entry at line 116 is missing its `- date:` list prefix. Let me fix it.

Now verify the demo generator works:

All three generators work with recursive discovery on the flat layout. Now I'll mark the first todo done, move to creating directories and migrating files.

Now create the target directory structure and move all files with `git mv`:

Now move all files with `git mv`. I'll batch them by category:

All files moved. Let me verify the new layout and confirm `data/packs/` root is now empty of YAML files:

The layout matches the plan exactly. Now verify all three generators work with the new structure:

All three generators produce the same results with the new directory structure. Now update the harvester output paths:

Now I also need to check if any harvester has internal references to the old flat path for merge operations. Let me check quickly.

Good -- all harvester paths are updated and no other references to old flat paths remain. Now let me also check for any other files in the codebase that reference the old flat paths:

Two more scripts reference the old flat path. Let me update them:

Let me also check for any remaining references to old pack paths in documentation and other files:

Now update all documentation. I need to update `AGENTS.md`, `Data-Authoring-Guide.md`, `Technical-Specification.md`, and `Implementation-Roadmap.md`. Let me read the relevant sections and update them.

Now update the Data-Authoring-Guide to reflect the completed migration (replacing "planned" language with "current" language):

Now update the "planned direction" language throughout the rest of the authoring guide to reflect current state:

Now update the Protocol Packs section to reflect the completed rename:

Now update the naming conventions section at the bottom:

Now update the examples section to use the new naming:

Now update the generator table in the authoring guide:

Now update the Technical Specification:

Now let me also check if there are references to old protocol filenames in the Technical Specification:

Now update the Implementation Roadmap to reflect that M12A.1, M12A.2, and M12A.3 are completed:

Now update the remaining references in the Implementation Roadmap:

The protocol pack IDs at line 141 are internal IDs (like `protocol-academic-de`), not filenames, so they don't need changing.

Now for the final todo: design and implement the pack manifest/index. This is the metadata model that enables selective builds. I'll create a generator that produces a `pack-index.generated.json` from the directory structure and filenames.

I notice that `EU` is being classified as `country` because it matches the ISO country regex. Let me fix that edge case:

EU is now correctly classified as `supranational`. Let me verify the generated index looks right:

The index is clean and correct. Every entry has proper classification across all dimensions. Now let me add the pack index generator to the AGENTS.md and Data-Authoring-Guide:

Now update the Pack Index section in the authoring guide to reflect that it has been implemented:

Now let me make sure the generated `.json` file is in `.gitignore` since it's a generated artifact:

I see that `scripts/*.js` is in `.gitignore` but that won't cover `scripts/lib/*.js`. Let me add that:

Now let me do a final verification -- run all three generators plus the index generator to confirm everything works end to end:

All four generators pass. Let me also quickly check for any linter issues in the files I've edited:

Now let me also make sure `BE.events.yaml` was correctly processed (the demo generator picked it up via event-nested greetings from the international base events but did not separately list it -- let me verify it was actually loaded):

Good -- `BE.events.yaml` uses object-format greetings (locale->string) rather than array-format, and this is pre-existing behavior from before my changes. The demo generator only processes array-format event greetings. This is not related to the reorganization.

Let me mark the final todo as complete:

All five todos are complete. Here is a summary of everything that was done:

## What was delivered

**1. Shared recursive pack discovery** (`scripts/lib/discover-packs.ts`)
- New helper module with `discoverPacks(rootDir, category)` and `discoverAllYAML(rootDir)` functions
- Recursively walks `data/packs/` and matches files by category marker (`.greetings.`, `.protocol.`, etc.)
- Used by all three existing generators, replacing flat `readdirSync` scans

**2. Generator updates** (3 scripts)
- `generate-demo-packs.ts` -- uses `discoverAllYAML` for multi-family scan
- `generate-address-packs.ts` -- uses `discoverPacks` with `"address"` and `"protocol"` category markers
- `generate-nameday-packs.ts` -- uses `discoverPacks` with `"nameday-saints"` and `"nameday-calendar"` markers

**3. Directory reorganization** (33 files moved)
- `greetings/language/` and `greetings/locale/` -- 7 greeting packs
- `events/shared/`, `events/supranational/`, `events/country/`, `events/tradition/` -- 9 event packs
- `addresses/language/` -- 5 address packs
- `protocol/` -- 5 protocol packs (renamed to locale-first: `nl.protocol.academic.yaml`)
- `locales/`, `regions/`, `namedays/locale/` -- 7 remaining packs

**4. Protocol naming normalization**
- `academic.nl.protocol.yaml` became `nl.protocol.academic.yaml` (and similarly for all protocol files)

**5. Harvester and script path updates** (6 files)
- `BelgiumHarvester.ts`, `GreeceHarvester.ts`, `EUHarvester.ts`, `UnObservancesHarvester.ts`
- `parse-un-dump.ts`, `inject-greetings.ts`

**6. Pack index generator** (`scripts/generate-pack-index.ts`)
- Produces `data/pack-index.generated.json` with family, scopeType, selector, tags, and domain for each pack
- Enables future selective bundle compilation by language, event class, protocol domain, etc.

**7. Documentation updates**
- `AGENTS.md` -- directory table, generator table, contributor workflow
- `Data-Authoring-Guide.md` -- structure rationale, naming conventions, pack index docs
- `Technical-Specification.md` -- generator pipeline description
- `Implementation-Roadmap.md` -- M12A milestones marked complete

**8. Bonus fix**: repaired a missing `- date:` line in `BE.events.yaml` that was causing a pre-existing YAML parse error.

---

**User**

Something I should have remarked earlier. It still bothers me and we should improve our re-organisation of the data packs: In @data/packs/greetings (and similarly in @data/packs/addresses although that folder does not yet have a locale/ subfolder) I do not like the artificial split between "language" and "locale": in fact "locales" are really regional dialects of languages, such thta we better have `greetings/de.greetings.yaml` instead of `greetings/locale/de-DE.greetings.yaml` (for the file contains generic German greetings only, as for now, while we can later always add `greetings/de-AT.greetings.yaml` for greetings that are specific for the Austrian dialect, of those whould become many).

---

**Cursor**

You're right -- the `language/` vs `locale/` split is an unnecessary abstraction layer. A locale like `de-DE` is just a more specific variant of `de`; they belong side by side, not in separate subdirectories. Let me flatten those now.

Now verify the new layout and run all generators:

Clean. Now verify generators:

Everything passes. Now update the documentation to remove the `language/` and `locale/` subfolder references.

Now update the Data-Authoring-Guide layout diagram and naming conventions:

Good, the high-level layout diagram at line 78 is already correct (it just lists the top-level folders without the removed `language/`/`locale/` subfolders). Now update the naming conventions section:

Done. The `language/` and `locale/` subdirectories have been removed from `greetings/`, `addresses/`, and `namedays/`. All files now live directly under their category folder. Language-scoped packs like `nl.greetings.yaml` sit right next to locale-scoped ones like `de-DE.greetings.yaml` -- as they should, since a locale is just a more specific variant that can be added later when regional data becomes available. All generators, the pack index, and the documentation have been updated to match.

---

**User**

Please go through this entire current chat. We've done quite a bit of work; let us update the documentation and then commit. Add to the docs and spec so as to reflect all our recent changes and improvements, including their rationale and design choices. Then, please chunk all of our work/changes, respective to the latest commit, and, whenever, possible inferring the true commit date from the files' `created` and `last edited` timestamps (such that the commits get those timestamps in the git history), in several sizeable commmit stages, as per the rules in AGENTS.md Then commit in order, using a sensible, descriptive, concise commit message for each commit.


---

**Cursor**

Let me start by understanding the full scope of changes and gathering timestamps.

Let me first verify the documentation is comprehensive, then plan the commits.

The Technical Specification mentions the generator pipeline update but doesn't yet document the directory structure itself. Let me add that and also verify the spec's file naming section is current.

The protocol pack naming at line 960 is already updated. Now I need to add the directory structure section. Let me add it after section 17.1.1:

I'll add a new subsection about directory organization right after the YAML-first principle section:

Good. Now let me plan and execute the commits. Based on timestamps and logical grouping, I'll create four commits:

Now I'll stage and commit in four logical chunks. First, reset the staging area to start clean:

**Commit 1: Shared recursive discovery helper + generator updates**

**Commit 2: File reorganization, protocol renames, harvester/script path updates, BE.events.yaml fix**

**Commit 3: Pack index generator + regenerated outputs**

**Commit 4: Documentation updates**

Now let me verify everything is clean and the history looks right:

Working tree is clean and all four commits are in order. Here is a summary of what was done:

**Documentation updates:**
- Added Section 17.1.2 ("Directory Organization") to the Technical Specification, covering the category-first layout, its rationale over language/region-first alternatives, the flattened language/locale coexistence rule, and the generated pack index for selective builds.

**Four commits, chronologically ordered by file timestamps:**

| # | Time | Type | Summary |
|---|------|------|---------|
| 1 | 15:53 | `refactor` | Shared recursive `discoverPacks()` / `discoverAllYAML()` helper in `scripts/lib/`, updated all three generator scripts to use it |
| 2 | 15:55 | `refactor` | Moved all 33 YAML files into category subdirectories, renamed protocol packs to locale-first convention, updated harvester + utility script paths, fixed BE.events.yaml parse error |
| 3 | 16:00 | `feat` | New `generate-pack-index.ts` producing `pack-index.generated.json` manifest; regenerated all downstream `.generated.ts` outputs |
| 4 | 16:06 | `docs` | Comprehensive documentation updates across Technical-Specification, Data-Authoring-Guide, Implementation-Roadmap, and AGENTS.md |

---

**User**

Yet another remark on our re-organisation: I really believe @data/packs/namedays should live under @data/packs/events/tradition , since those namedays in fact are events, following a religious/liturgical calender.

---

**Cursor**

That's a sound observation — namedays are tradition-scoped calendar events, so placing them alongside the other tradition-based event data is the natural home. Let me trace all the references and make the move.

Let me first read the files that need updating to understand the exact references.

Good. The nameday generator uses `discoverPacks(PACKS_DIR, "nameday-saints")` which scans the whole `data/packs/` tree recursively by category marker — so the generator itself doesn't need a path change. It will automatically find the files in their new location. The pack index generator also uses category markers, not directory paths. So the code changes are minimal — just the file move and documentation updates.

Let me move the files and update the docs.

Good. Now let me regenerate all affected outputs to verify everything works.

Both generators work correctly — nameday files discovered in their new location under `events/tradition/`. Now let me update the documentation.

Now I'll update all three documents.

Now let me also check if the Data-Authoring-Guide has a rationale section where I should note this decision, and verify there's a description of the `events/tradition/` directory.

Good, the naming conventions are now consistent. Let me also check the directory taxonomy/rationale section in the Data-Authoring-Guide where the `namedays/` directory was previously described.

The directory tree listing near line 85 already had `namedays/` removed. Let me verify that the directory tree block in the Data-Authoring-Guide looks correct now, and also add a brief mention that nameday files live under `events/tradition/`.

The tree listing is already missing `namedays/` but should now also show the `events/` sub-levels:

Now update the AGENTS.md directory table — the old row listed `events/tradition/` separately, let me check:

There's a duplicate — the old line 89 was kept and a new line 94 was added. Let me fix this:

Now let me commit everything.

Done. The four nameday files have been moved from `data/packs/namedays/` into `data/packs/events/tradition/`, where they now live alongside `christian.events.yaml`, `christian.orthodox.events.yaml`, `muslim.events.yaml`, and `Chinese.events.yaml`. The `namedays/` directory has been removed.

No generator code needed changing — the recursive `discoverPacks()` helper finds files by category marker (`.nameday-saints.`, `.nameday-calendar.`) regardless of directory depth, so it picked them up in their new location automatically. The regenerated outputs and pack index confirmed everything works.

The final directory layout under `events/` is now:

```text
data/packs/events/
  shared/                        ← international.base, international.secular
  supranational/                 ← EU
  country/                       ← BE, GR
  tradition/                     ← christian, orthodox, muslim, Chinese,
                                   plus nameday saints & calendars
```

---

**User**

Please add to the TODO/ROADMAP that we still need to implement scrapers/harvesters for the followining resources, such that the corresponding yaml data files (which are far from complete and still very meager) can be automatedly be populated to full completion and exhaustiveness:

- https://en.wikipedia.org/wiki/Style_(form_of_address)
- https://de.wikipedia.org/wiki/Anrede
- https://fr.wikipedia.org/wiki/Pr%C3%A9dicat_honorifique
- https://nl.wikipedia.org/wiki/Aanspreekvorm
- https://nl.wikipedia.org/wiki/Academische_graad
- https://nl.wikipedia.org/wiki/Predicaat_(titel)
- https://taaladvies.net/titels-en-titulatuur-in-nederland-algemeen/
- https://taaladvies.net/titels-en-titulatuur-in-belgie-algemeen/
- oude dikke Van Dale woordenboek
- Chicago Manual of Style


---

**Cursor**

Now let me also check the data sources bibliography to understand the existing format:

Good — the Wikipedia sources for addressing are already in the bibliography. Let me check if `taaladvies.net`, the Van Dale, `academische_graad`, `predicaat`, and Chicago Manual of Style are there:

Those are missing from the bibliography. Now let me read the end of the roadmap and the relevant milestone area more carefully to find the best place to add the new items:

Now I have a clear picture. I need to:
1. Add a new milestone (or sub-milestone under M14) for address/protocol harvester expansion
2. Add the missing sources to `data/data-sources.bib`

Now let me make all the changes:

Now add the milestone to the roadmap. This fits logically as a new sub-milestone under Milestone 14, or as its own milestone focused on address/protocol data procurement. Given that M14 is about "Global Data & Harvester Scale-up" and already covers events, a dedicated sub-milestone for address and protocol harvesting makes the most sense:

The old M14.3 and M14.4 need their numbers bumped:

Let me verify the final result:

Everything looks good. Here's what was added:

**Implementation Roadmap** — new sub-milestone **M14.3: Address & Protocol Data Procurement** with 10 individual tasks covering:
- 6 Wikipedia harvesters (en `Style (form of address)`, de `Anrede`, fr `Prédicat honorifique`, nl `Aanspreekvorm`, nl `Academische graad`, nl `Predicaat (titel)`)
- 2 Taaladvies.net harvesters (NL and BE titulature guides)
- 2 manual curation entries (Van Dale dictionary and Chicago Manual of Style)

Existing M14.3/M14.4 were renumbered to M14.4/M14.5.

**Data sources bibliography** (`data/data-sources.bib`) — added 6 new entries for the sources that weren't yet tracked: `wikipedia_academische_graad`, `wikipedia_predicaat_titel`, `taaladvies_titels_nederland`, `taaladvies_titels_belgie`, `van_dale_groot_woordenboek`, and `chicago_manual_of_style`. The four other Wikipedia sources were already present.

---

**User**

Please commit

---

**Cursor**

Committed cleanly as `6112b8a`.

