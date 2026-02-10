---
description: Manage content library examples that teach LLMs output schema via few-shot learning. Validate, upgrade, and add examples.
argument-hint: <validate|upgrade|add|diff> [plugin] [topic] [--schema FILE] [--fix]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Content library examples are the most powerful tool for teaching LLMs your output schema — more effective than prose instructions alone. When you change your schema but forget to update examples, the LLM follows the OLD format from the examples instead of the NEW format from the instructions. This is Anti-Pattern #4 (Stale Content Library) and the most common source of "Claude ignores my instructions" bugs.

This command ensures your content library stays synchronized with your type definitions.

## Subcommands

### `validate {plugin}` — Check examples match schema

**Process:**
1. Load type definitions for the plugin (from pipeline manifest or auto-detect)
2. Load all content library JSON files from `plugins/{plugin}/content-library/`
3. For each example file:
   a. Parse the JSON
   b. Compare all keys against type definition
   c. Report:
      - **Missing fields**: Present in types but absent in example (FAIL)
      - **Extra fields**: Present in example but absent in types (WARN — may be legacy)
      - **Type mismatches**: String where number expected, etc. (FAIL)
      - **Empty required fields**: Field present but empty/null (WARN)

4. Report summary:
```
Content Library Validation: plugins/legal/

  pagares.json:
    [FAIL] Missing: creativeDirection.accents (added in types.js line 45)
    [FAIL] Missing: postProduction.dustParticles (added in types.js line 67)
    [WARN] Extra: hookConfig.oldField (removed from types.js in commit abc123)
    [PASS] 38/40 fields match schema

  arrendamiento.json:
    [PASS] All 40 fields match schema

  poder-notarial.json:
    [FAIL] Missing: creativeDirection (entire section missing)

  Summary: 2/5 examples fully valid, 3 need updates
  Run: /provekit.fewshot upgrade legal to auto-fix
```

### `upgrade {plugin}` — Auto-upgrade examples

**Process:**
1. Run `validate` first to identify issues
2. For each FAIL (missing field):
   a. Check if a default value exists in `defaults.json`
   b. If yes, insert the default
   c. If no, generate a contextually appropriate value based on the example's topic
   d. Present the change for user approval

3. For each WARN (extra field):
   a. Ask user: remove legacy field or keep for backward compatibility?

4. Apply approved changes
5. Re-run `validate` to confirm all examples pass

**Smart defaults:** When generating values for missing fields, use the example's existing context. If the example is about "pagarés" (promissory notes) and the missing field is `creativeDirection.accents`, generate accent suggestions appropriate to financial legal topics.

### `add {plugin} {topic}` — Create new example

**Process:**
1. Load current type definitions
2. Load existing examples for reference
3. Generate a new example for the given topic that:
   a. Uses ALL current fields (no staleness from day 1)
   b. Follows the style of existing examples
   c. Contains realistic, topic-appropriate content
   d. Includes field annotations explaining choices (as JSON comments or adjacent field)
4. Write to `plugins/{plugin}/content-library/{topic}.json`
5. Run `validate` to confirm it passes

### `diff {plugin}` — Show schema drift over time

Show what changed between content library examples and current types:
```
Schema Drift: plugins/legal/

  Fields added to types (not in all examples):
    + creativeDirection.accents    (added 2025-02-09, missing in 3/5 examples)
    + postProduction.dustParticles (added 2025-02-10, missing in 4/5 examples)

  Fields removed from types (still in some examples):
    - hookConfig.oldField          (removed 2025-02-08, still in 2/5 examples)

  Timeline:
    2025-02-08: hookConfig.oldField removed (examples not updated)
    2025-02-09: creativeDirection.accents added (2/5 examples updated)
    2025-02-10: postProduction.dustParticles added (1/5 examples updated)
```

## Why Few-Shot > Instructions

```
Prompt says: "Include a creativeDirection object with accents array"
Example shows: { "hookConfig": { ... }, "scenes": [ ... ] }  ← NO creativeDirection

Result: Claude follows the example shape, ignoring the instruction.

Fix: Update example to include creativeDirection → Claude follows the example.
```

This is well-documented LLM behavior: concrete examples override abstract instructions. ProveKit enforces example currency to prevent this failure mode.

## Integration Points

- **`/provekit.pipeline`**: Content library is Layer 4 in the pipeline — fewshot staleness = pipeline staleness
- **`/provekit.pattern`**: Pattern #3 (Content Library as Few-Shot Learning) and Anti-Pattern #4 (Stale Content Library)
- **`/provekit.test`**: Stale examples cause test failures — check fewshot before debugging
- **`/provekit.capability`**: Content library coverage feeds capability evidence

## Important Notes

- Always run `validate` before `upgrade` — understand the drift before fixing it
- `upgrade` never deletes fields without user approval
- New examples created via `add` use the LATEST schema — they're the gold standard
- Content library files must be valid JSON (no comments, no trailing commas)
- File naming convention: kebab-case topic name + `.json`
- The content library is read fresh from disk on every request — no server restart needed
