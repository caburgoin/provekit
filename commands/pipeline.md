---
description: Detect and fix pipeline staleness across all layers. Register pipelines, check for schema mismatches, and generate remediation plans.
argument-hint: <check|fix|register|list> [pipeline-name] [--layer NAME] [--verbose]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Pipeline staleness is the #1 source of "it works in tests but fails in production" bugs in PoC projects. When you change a type definition but forget to update the prompt template, the LLM generates output in the OLD format. When you add a field to the compiler but forget to update content library examples, the LLM's few-shot examples teach the WRONG schema.

This command traces data flow across all pipeline layers and detects mismatches.

## Subcommands

### `check` — Scan all pipelines for staleness

**Process for each registered pipeline:**

1. **Load pipeline manifest** from `.provekit/pipeline-manifest.json`
2. **For each pipeline**, check each layer in order:

| Layer | What to Check | How to Detect Staleness |
|-------|--------------|------------------------|
| 1. Types/Constants | Type definitions, enums, field lists | Grep for field names in type files |
| 2. Route Handlers | API routes passing fields through | Check that handler destructures/forwards new fields |
| 3. Prompt Templates | LLM prompts teaching output schema | Check that prompt mentions all type fields |
| 4. Content Library | Few-shot examples matching schema | Parse JSON examples, compare keys to types |
| 5. Compilers | Transform functions reading fields | Check compiler reads each field (with fallback) |
| 6. Preview/UI | Display of generated data | Check preview renders new fields |
| 7. Edit Prompts | Preservation of fields on edit | Check edit prompt template mentions new fields |
| 8. Restart Needed | Node module cache | Flag if JS files changed since server start |

3. **Report results:**
```
Pipeline: storyboard-generation
  [PASS] Types/Constants — 12 fields defined in types.js
  [PASS] Route Handlers — /api/storyboard/generate passes all fields
  [WARN] Prompt Template — Missing field: postProduction.dustParticles
  [FAIL] Content Library — pagares.json missing: creativeDirection.accents
  [PASS] Compilers — legal-short-v2.js reads all fields with fallbacks
  [SKIP] Preview/UI — No preview registered
  [PASS] Edit Prompts — Edit prompt preserves all fields
  [WARN] Restart — server.js modified after last server start

  Result: 1 FAIL, 2 WARN — Run /provekit.pipeline fix to remediate
```

### `fix` — Generate remediation plan

For each FAIL or WARN found by `check`:
1. Identify the specific file and location
2. Generate a concrete fix (what to add/change)
3. Prioritize: FAIL before WARN, upstream before downstream
4. Present as numbered checklist

```
Remediation Plan:
  1. [FAIL] Update plugins/legal/content-library/pagares.json
     Add: "creativeDirection": { "accents": [...] } to match types.js line 45
  2. [WARN] Update plugins/legal/prompts/storyboard-generate.txt
     Add: "dustParticles" to postProduction section (line ~120)
  3. [WARN] Restart API server (kill PID on :4010, re-launch)

Apply fixes? [y/N]
```

If user approves, apply fixes automatically where possible.

### `register {name}` — Register a new pipeline

Interactive registration:
1. Ask for pipeline name (e.g., "storyboard-generation")
2. Ask which layers apply (not all pipelines have all 8 layers)
3. For each layer, ask for the file path(s) to check
4. Save to `.provekit/pipeline-manifest.json`

```json
{
  "pipelines": {
    "storyboard-generation": {
      "description": "From topic text to compiled render props",
      "layers": {
        "types": ["api/storyboard/types.js"],
        "routes": ["api/server.js"],
        "prompts": ["plugins/legal/prompts/storyboard-generate.txt"],
        "examples": ["plugins/legal/content-library/*.json"],
        "compilers": ["api/storyboard/compilers/legal-short-v2.js"],
        "preview": [],
        "editPrompts": ["plugins/legal/prompts/storyboard-edit.txt"],
        "restart": ["api/server.js", "api/storyboard/*.js"]
      },
      "registeredAt": "2025-02-01",
      "lastCheckedAt": null
    }
  }
}
```

### `list` — Show all registered pipelines

Display pipeline names, layer counts, last check dates, and status.

## Staleness Detection Strategies

### Field-Name Tracing
The primary detection strategy: extract field names from type definitions, then search for them in each downstream layer.

```
types.js defines: hookConfig, scenes, ctaConfig, creativeDirection, postProduction
  → server.js destructures: hookConfig ✓, scenes ✓, ctaConfig ✓, creativeDirection ✓, postProduction ✓
  → prompt mentions: hookConfig ✓, scenes ✓, ctaConfig ✓, creativeDirection ✓, postProduction ✗
  → examples contain: hookConfig ✓, scenes ✓, ctaConfig ✓, creativeDirection ✗, postProduction ✗
```

### Content Library Deep Check
For each content library JSON file:
1. Parse the JSON
2. Extract all top-level and nested keys
3. Compare against type definitions
4. Report missing keys AND extra keys (legacy fields)

### Restart Detection
Compare file modification times against server process start time:
```bash
# Server started at: 2025-02-10 10:00:00
# api/storyboard/types.js modified at: 2025-02-10 10:30:00
# → WARN: Restart needed
```

## Integration Points

- **`/provekit.phase`**: Pipeline staleness blocks phase advancement
- **`/provekit.fewshot`**: Content library staleness triggers fewshot upgrade
- **`/provekit.pattern`**: Pipeline staleness = Anti-Pattern #8
- **`/provekit.test`**: Failed tests may be caused by pipeline staleness — check first

## Important Notes

- Always run `check` before `fix` — never blindly fix
- Content library staleness is the most common and hardest to detect manually
- A restart warning does NOT mean the code is wrong — it means the running server has stale code
- Pipeline registration is manual — the tool doesn't auto-discover pipelines
- Layer file paths support globs (e.g., `plugins/*/content-library/*.json`)
