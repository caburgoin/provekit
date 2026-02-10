# P10: Asset Pipeline with Theming

## Summary
Assets (images, animations, templates) are stored once and themed per-client via a parameterized pipeline. Never copy assets per client — transform them at request time with caching.

## The Pattern
```
Base asset:        public/lottie/legal/document-sign.json (universal)
Client branding:   clients/garcia-abogados.json → { brandColor: "#1a365d" }
Theming function:  replaceColors(asset, brandColor, accentColor)
Cached output:     public/lottie/.themed/garcia-abogados/document-sign.json
Cache invalidation: On client branding update
```

## Implementation
```javascript
function getThemedLottie(assetId, clientId) {
  const cachePath = `public/lottie/.themed/${clientId}/${assetId}.json`;
  if (fs.existsSync(cachePath)) return cachePath;

  const base = loadLottieAsset(assetId);
  const client = loadClient(clientId);
  const themed = replaceTopColors(base, client.brandColor, client.accentColor);
  fs.writeFileSync(cachePath, JSON.stringify(themed));
  return cachePath;
}
```

## Why Not Copy Per Client
- 100 assets * 50 clients = 5,000 files to maintain
- Brand color change = re-export 100 files manually
- New asset = create 50 copies

## Why Not Theme at Render Time
- Theming is expensive (parse JSON, find colors, replace, serialize)
- Same client renders same asset many times
- Cache makes second render instant

## Phase Relevance
- **Phase 0-1**: Not needed — single client, hardcoded assets
- **Phase 2**: Start when supporting multiple clients
- **Phase 4+**: Essential for quality — professional assets need client branding
