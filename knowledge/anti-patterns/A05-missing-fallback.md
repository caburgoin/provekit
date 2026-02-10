# A5: Missing Fallback Chain

## What It Is
Accessing an optional field without a fallback value, causing runtime crashes when the field is absent.

## Detection
Search for property access on optional fields without `??`, `||`, or `?.`:
```javascript
// BAD: Will throw if postProduction is undefined
const bokeh = scene.postProduction.bokeh;

// GOOD: Fallback chain
const bokeh = scene.postProduction?.bokeh ?? false;
```

## Common Patterns
```javascript
// Level 1: Simple fallback
const value = field ?? 'default';

// Level 2: Migration fallback
const value = newField ?? oldField ?? 'default';

// Level 3: Computed fallback
const value = field ?? computeDefault(context);
```

## Fix
Run `/provekit.pattern --anti-patterns` to find all instances.
