# A6: Hardcoded Creativity

## What It Is
Using switch statements or long if/else chains for subjective decisions like colors, styles, layouts, or any creative choice. Usually 15+ branches that keep growing.

## Detection
```javascript
// Pattern: switch/if with > 5 branches for creative decisions
switch(topic) {
  case 'legal': return { bg: 'navy', font: 'serif' };
  case 'finance': return { bg: 'green', font: 'sans' };
  case 'health': return { bg: 'blue', font: 'rounded' };
  // ... 15 more cases
}
```

## Fix
Replace with one LLM call:
```javascript
const direction = await callHaiku(`Choose visual style for: ${topic}`);
```

## Phase Context
- Phase 0-3: Acceptable — focus on pipeline, not creativity
- Phase 5+: Anti-pattern — use LLM-Driven Decisions (P4)
