# Salve!

Greet your users as if you were a local!

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Status: Alpha](https://img.shields.io/badge/Status-Alpha-orange.svg)

_Lectori salutem!_

**Salve** is a modular, offline-first TypeScript framework designed to resolve and render culturally authentic, temporally appropriate greetings. Unlike generic internationalization (i18n) libraries that translate words literally, Salve prioritizes **Maximal Cultural Specificity**, ensuring that applications reflect the rich traditions, religious contexts, and social norms of their users.

---

## 📚 Table of Contents
- [Salve!](#salve)
  - [📚 Table of Contents](#-table-of-contents)
  - [Why Salve?](#why-salve)
  - [Features](#features)
  - [Target Use Cases](#target-use-cases)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Quick Setup](#quick-setup)
  - [Usage](#usage)
    - [CLI](#cli)
    - [Programmatic Usage](#programmatic-usage)
    - [Developer Tools](#developer-tools)
  - [Project Structure](#project-structure)
    - [Core \& Logic](#core--logic)
    - [Calendars \& Plugins](#calendars--plugins)
    - [Data Packs (Examples)](#data-packs-examples)
    - [Tooling](#tooling)
  - [Roadmap \& Status](#roadmap--status)
  - [Contributing](#contributing)
  - [Sponsorship](#sponsorship)
  - [License](#license)
  - [Data Sources \& Accountability](#data-sources--accountability)
  - [Citation](#citation)
  - [Gelukkige verjaardag, Pieter!](#gelukkige-verjaardag-pieter)
  - [Contact](#contact)

---

## Why Salve?

Standard i18n often leads to "cultural flattening." A simple "Hello" might be translated to "Guten Tag" in German, but that misses the nuance of "Mahlzeit" at lunch, "Grüß Gott" in Bavaria, or "Eid Mubarak" during Eid al-Fitr.

Salve solves this by:
- **Context Awareness**: It knows the time, the season, and the specific cultural or religious events happening *right now*.
- **Protocol & Etiquette**: It handles complex address forms (formal vs. informal, honorifics like "Herr Doktor").
- **Privacy Focused**: All resolution happens locally on the device. No data is sent to external APIs.

## Features

- 🌍 **Culturally Specific**: Prioritizes local traditions (Name Days, Religious Holidays) over generic greetings.
- 📦 **Modular Architecture**: Install only what you need (e.g., just `@salve/pack-el-civil` for Greek civil holidays).
- 📅 **Multi-Calendar Support**: Native support for Gregorian, Hijri, and specialized calculation (Easter/Pascha).
- 🛡️ **Offline-First**: Zero runtime dependencies on external services.
- 🧠 **Anti-Repetition**: Remembers what greetings have been shown to avoid fatigue.
- 🛠️ **Developer Tooling**: Includes a CLI for project management and a DevTools overlay for debugging.

## Target Use Cases

Salve is ideal for systems where personalized, respectful communication is critical:

- **UI Welcome Screens**: Start a user session with a greeting that acknowledges the time of day or a local holiday.
- **Email Generators**: Ensure automated emails use the correct honorifics and seasonal greetings.
- **CRM Systems**: Help support agents address customers correctly based on their location and cultural background.
- **Chat Systems**: Provide culturally aware opening lines for chatbots or support interfaces.
- **Legal Automation**: Generate documents with precise, formal address protocols (e.g., "Dear Dr. Smith").
- **Public Announcements**: Digital signage that adapts to the time of day and public holidays.
- **Government Portals**: Respectful and formal interaction with citizens.
- **Academic Systems**: Properly handle academic titles and university schedules.

## Installation

### Prerequisites

- **Node.js**: v18 or higher recommended.
- **npm** or **yarn** package manager.

### Quick Setup

You can use the CLI directly via `npx` to initialize a new configuration in your project:

```bash
npx salve init
```

To add specific cultural data packs (e.g., Greek civil holidays):

```bash
npx salve add @salve/pack-el-civil
```

## Usage

### CLI

Test the resolution engine directly from your terminal to verify outputs without writing code:

```bash
# Resolve a greeting for a specific name and locale
npx salve resolve --name "Giannis" --locale "el-GR"
```

### Programmatic Usage

Integrate Salve into your TypeScript/JavaScript application:

```typescript
import { SalveEngine } from '@salve/core';

// Initialize the engine
const engine = new SalveEngine();

// Resolve a greeting based on context
const result = await engine.resolve({
  locale: 'de-DE',          // Target locale
  formality: 'formal',      // Desired formality level
  user: {
    name: 'Müller',         // User's surname
    titles: ['Dr.']         // Academic titles
  }
});

console.log(result.greeting); 
// Output: "Guten Abend, Herr Dr. Müller" (depending on time of day)
```

### Developer Tools

Salve includes a powerful DevTools overlay that helps you understand *why* a specific greeting was chosen.

```typescript
import { SalveEngine } from '@salve/core';
import { SalveDevTools } from '@salve/devtools';

const engine = new SalveEngine();
const devTools = new SalveDevTools(engine);

// Mounts the debug overlay to the DOM
devTools.mount();
```

## Project Structure

This monorepo is organized into several packages under `packages/`:

### Core & Logic
- **`@salve/core`**: The brain of the operation. Handles resolution logic, priority scoring, address resolution (`AddressEngine`), and salutation composition (`CompositionEngine`).
- **`@salve/registry`**: Manages the loading and versioning of data packs, including address packs and protocol packs.
- **`@salve/loader`**: Handles runtime data fetching and caching.

### Calendars & Plugins
- **`@salve/calendars-gregorian`**: Standard civil dates and time-of-day logic.
- **`@salve/calendars-hijri`**: Tabular Islamic calendar support.
- **`@salve/calendars-pascha`**: Algorithms for Western and Orthodox Easter.
- **`@salve/calendars-specialty`**: Seasons, astronomical events, and personal milestones.

### Data Packs (Examples)
- **`@salve/pack-global-addresses`**: Baseline address packs (honorifics, format templates, titles) and institutional protocol packs (academic, judicial, diplomatic) for `en`, `de`, `fr`, `nl`, `el`.
- **`@salve/pack-el-namedays`**: Greek Name Day data.
- **`@salve/pack-bg-namedays`**: Bulgarian Name Day data.

### Tooling
- **`@salve/cli`**: Command-line interface for project management.
- **`@salve/devtools`**: Visual overlay for debugging.

## Roadmap & Status

Current Version: **v0.0.1 (Alpha)**

For detailed development plans, see our [Roadmap](./docs/development-roadmap.md).
For a comprehensive specification of the system, refer to the [Requirements Specification](./docs/requirements-specification.md).

## Contributing

We welcome contributions! Please review our [Code of Conduct](./AGENTS.md) (currently in `AGENTS.md`) for coding standards and commit message conventions.

For contributing address data and protocol packs, see the [Protocol Pack Authoring Guide](./docs/protocol-pack-authoring.md).

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feat/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add some amazing feature'`).
4.  Push to the branch (`git push origin feat/amazing-feature`).
5.  Open a Pull Request.

## Sponsorship

If you find Salve useful, please consider sponsoring the project to support its ongoing development and maintenance.

[![Sponsor on GitHub](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/rhythmus)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Data Sources & Accountability

Salve is built upon a foundation of shared cultural knowledge. We maintain a comprehensive bibliography of all data sources — including hundreds of Wikipedia articles, cultural podcasts, and linguistic research — to ensure accountability and academic fairness.

See [data/data-sources.bib](./data/data-sources.bib) for the full BibTeX bibliography.

## Citation

If you use Salve in your research or project, please cite it using the metadata in `CITATION.cff` or as follows:

```bibtex
@software{Salve_Universal_Greeting_Engine,
  author = {Soudan, Wouter},
  title = {Salve: Universal Greeting & Cultural Awareness Engine},
  url = {https://github.com/rhythmus/salve},
  version = {0.0.1},
  year = {2026}
}
```

## Gelukkige verjaardag, Pieter!

This project is dedicated to my younger brother, Pieter, at the occasion of Salve’s first public release, on his birthday (March 4th, 2026).

Pieter has been my teacher and mentor in coding, instilling in me a deep enthusiasm for engineering and the craft of building beautiful, useful software. This dedication is a tribute to the years-long road we have walked together.

## Contact

**Dr Wouter Soudan** - Project Lead

Project Link: [https://github.com/rhythmus/salve](https://github.com/rhythmus/salve)
