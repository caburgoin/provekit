# P4: LLM-Driven Decisions

## Summary
Replace complex branching logic for subjective/creative decisions with a single cheap LLM call. One Haiku call can replace 50+ conditionals and produce contextually appropriate results.

## The Pattern
**Before (hardcoded):**
```javascript
function chooseBackground(topic) {
  if (topic.includes('legal')) return 'navy-gradient';
  if (topic.includes('finance')) return 'green-gradient';
  if (topic.includes('health')) return 'blue-gradient';
  // ... 20 more conditions
  return 'gray-gradient'; // catch-all
}
```

**After (LLM-driven):**
```javascript
async function getCreativeDirection(topic, clientBranding) {
  const response = await callHaiku({
    prompt: `Given topic "${topic}" and brand colors ${clientBranding},
             choose: background, transitions, typography, color palette.
             Return JSON.`
  });
  return JSON.parse(response);
}
```

## Why This Works
- LLMs understand context, aesthetics, and appropriateness
- One call decides 10+ properties simultaneously (background, transitions, fonts, colors, pacing)
- Cost: ~$0.001 per call with Haiku
- Results are varied and contextually appropriate
- No maintenance when adding new topics

## When NOT to Use LLM
- Deterministic decisions (math, lookups, routing)
- Security-critical decisions (auth, permissions)
- High-frequency decisions (> 100/second)
- Decisions that must be exactly reproducible

## Phase Relevance
- **Phase 0-3**: Hardcoded decisions are fine — focus on proving the pipeline
- **Phase 4**: Start noticing "everything looks the same" problem
- **Phase 5**: Essential — this is the Agency phase
- **Phase 6**: Combined with few-shot, produces unique outputs every time
