# P5: Fallback Chains

## Summary
Every optional field must degrade gracefully through multiple fallback levels. When a new field is absent (old data, LLM omission, config gap), the system should work with reduced features — never crash.

## The Pattern
```javascript
// 3-level fallback chain:
const hero = scene.lottieHero          // Level 1: New Lottie animation
  ?? scene.customPreset                 // Level 2: Custom SVG preset
  ?? getDefaultPreset(scene.position);  // Level 3: Position-based default

// Nested fallback:
const accents = creativeDirection?.accents ?? [];
const bokeh = postProduction?.bokeh ?? false;
const colorGrade = postProduction?.colorGrade ?? 'none';
```

## Why Fallback Chains Matter in PoC
1. **Schema evolves rapidly**: Fields added in Phase 4 don't exist in Phase 2 data
2. **Content library lag**: Examples updated incrementally, not atomically
3. **LLM unreliability**: Claude may omit optional fields unpredictably
4. **Multiple clients**: Some clients have richer config than others

## Operator Guide
| Operator | Use When | Caveat |
|----------|----------|--------|
| `??` | Field might be null/undefined | Preserves `0`, `""`, `false` |
| `\|\|` | Field might be falsy | Treats `0`, `""`, `false` as missing |
| `?.` | Accessing nested property | Must still provide fallback for the final value |

**Prefer `??` over `||`** in almost all cases.

## Phase Relevance
- **Phase 0**: Not needed — single schema, no optionals
- **Phase 1+**: Start adding fallbacks as schema grows
- **Phase 4+**: Critical — every new quality feature is optional
