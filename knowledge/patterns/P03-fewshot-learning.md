# P3: Content Library as Few-Shot Learning

## Summary
When using LLMs to generate structured output, concrete examples in the prompt are MORE effective than prose instructions. Content library JSON files serve as few-shot examples that teach the LLM your output schema.

## The Principle
```
Prompt says:  "Generate a JSON with hookConfig, scenes, ctaConfig, and creativeDirection"
Example shows: {"hookConfig": {...}, "scenes": [...], "ctaConfig": {...}}

Result: LLM follows the EXAMPLE shape, often omitting creativeDirection
        because the example didn't include it.

Fix: Update example to include creativeDirection → LLM follows correctly.
```

Few-shot examples override abstract instructions. This is well-documented LLM behavior.

## Implementation Pattern
```javascript
// In prompt builder:
const examples = loadContentLibrary(pluginId);
const exampleBlock = examples.map(e =>
  `EJEMPLO (${e.topic}):\n${JSON.stringify(e.storyboard, null, 2)}`
).join('\n\n');

const prompt = template
  .replace('{examples}', exampleBlock)
  .replace('{topic}', userTopic);
```

## Critical Rule: Example Currency
Every content library example MUST include ALL current schema fields. One stale example can override ten correct instructions.

Run `/provekit.fewshot validate` after any schema change.

## How Many Examples
- 2-3 examples: Minimum for pattern recognition
- 5+ examples: Good variety, LLM learns style variations
- 10+: Diminishing returns, eats context window

## Phase Relevance
- **Phase 0**: Not needed — hardcoded output is fine
- **Phase 1**: Start building content library
- **Phase 2**: Essential — this is how you get variation without code changes
- **Phase 3+**: Must keep examples current as schema evolves
