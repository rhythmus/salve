# Salve Pack Hosting Strategy (CDN)

To optimize load times and reduce the main application bundle, Salve data packs (JSON) can be hosted on a CDN instead of being bundled directly.

## Hosting Options

1. **GitHub Pages (Free)**
   - Simply commit the `packs/` directory to a `gh-pages` branch or the `docs/` folder.
   - Access via `https://<user>.github.io/salve/packs/{locale}/namedays.json`.

2. **Unpkg / JSDelivr**
   - If published to NPM, packs are automatically available via:
   - `https://unpkg.com/@salve/pack-el-namedays@latest/dist/data/recurring_namedays.json`.

3. **Custom S3/Cloudfront**
   - For enterprise use, host JSON files on a private S3 bucket with Cloudfront.

## Example Integration (React)

```typescript
import { SalveEngine } from "@salve/core";
import { RemoteNameDayPlugin } from "@salve/plugin-nameday-remote";

const engine = new SalveEngine();

engine.use([
    new RemoteNameDayPlugin({
        endpoint: "https://your-cdn.com/salve/api/namedays"
    })
]);
```

## Security Recommendations
- **CORS**: Ensure the CDN allows requests from your app's domain.
- **Integrity**: Consider using Subresource Integrity (SRI) if loading via script tags (not applicable for JSON fetch).
- **Versioning**: Always include a version or hash in the URL to prevent caching issues after updates.
