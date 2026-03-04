# Salve Monorepo

Universal Greeting & Cultural Awareness Engine.

## Structure

- `packages/core`: Core resolution engine logic.
- `packages/calendars`: Calendar plugins (Gregorian, Hijri, etc.).
- `packages/packs`: Data packs for locales and traditions.
- `packages/registry`: Pack loading and versioning.
- `packages/loader`: Runtime data fetching/caching.
- `packages/cli`: `salve` command line interface.
- `packages/demo`: Web demonstration application.
- `docs`: Specification and roadmap documents.
- `test`: Global testing infrastructure.
- `benchmarks`: Performance benchmarks (inspired by Luxon).
- `scripts`: Build/automation scripts.

## Quick Start

### CLI
```bash
# Initialize salve config
npx salve init

# Add a pack
npx salve add @salve/pack-el-civil

# Test resolution
npx salve resolve --name "Giannis" --locale "el-GR"
```

### Web Integration
```javascript
import { SalveEngine } from '@salve/core';
import { SalveDevTools } from '@salve/devtools';

const engine = new SalveEngine();
const devTools = new SalveDevTools(engine);
devTools.mount();

const greeting = await engine.resolve({
  locale: 'de-DE',
  formality: 'formal'
});
```

## Inspiration

Salve is designed to complement [Luxon](https://github.com/moment/luxon) for a complete cultural/temporal intelligence stack.
