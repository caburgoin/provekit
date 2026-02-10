# A4: Stale Content Library

## What It Is
Content library examples that are missing fields defined in the current type system. The most common cause of "Claude ignores my instructions" bugs.

## Why It's Critical
Few-shot examples have MORE influence on LLM output than prose instructions. When examples show the old schema, the LLM follows the old schema — even if the instructions describe the new one.

## Detection
Run `/provekit.fewshot validate` to compare examples against types.

## Example
```
types.js defines: { hookConfig, scenes, ctaConfig, creativeDirection, postProduction }

pagares.json has:  { hookConfig, scenes, ctaConfig }
                   ← Missing creativeDirection and postProduction!

Result: Claude generates output WITHOUT creativeDirection and postProduction
        60% of the time (3 of 5 examples are stale)
```

## Fix
1. Run `/provekit.fewshot validate {plugin}`
2. Run `/provekit.fewshot upgrade {plugin}`
3. Verify: run storyboard generation, check output has all fields

## Prevention
Add to your schema-change checklist:
- [ ] Update ALL content library examples before testing
