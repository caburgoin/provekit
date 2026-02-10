---
description: Track and prove capability maturity levels. Register capabilities, run evidence-gathering tests, and view maturity scores.
argument-hint: <add|prove|list|detail> [name] [--tier N] [--evidence "description"]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Tracks individual capabilities through 6 maturity levels (IDEA → PRODUCTION). Each capability represents a distinct piece of business logic or system behavior that must be independently proven.

## Subcommands

### `add "name"` — Register a new capability

1. Add capability to `.provekit/capability-map.json`
2. Set initial level to 0 (IDEA)
3. Record creation timestamp
4. Optionally set `--description` for context

```json
{
  "capabilities": {
    "storyboard-generation": {
      "level": 0,
      "name": "IDEA",
      "description": "Generate video storyboards from text topics",
      "evidence": [],
      "createdAt": "2025-02-01",
      "lastProvenAt": null
    }
  }
}
```

### `prove "name"` — Run evidence gathering and upgrade level

**Process:**
1. Load capability from `.provekit/capability-map.json`
2. Determine target level (current + 1, or specific level via `--tier`)
3. Check what evidence is needed for target level
4. If `--tier` specified, enforce tier order (cannot prove Tier 2 without Tier 1)
5. Guide the user through evidence gathering:

| Target Level | Evidence Needed | Action |
|-------------|----------------|--------|
| 1: PROTOTYPE | Basic implementation exists | Check for relevant source files |
| 2: SCRIPT-PROVEN | Tier 1 tests pass | Run `/provekit.test tier1` on relevant module |
| 3: API-PROVEN | Tier 2 tests pass | Run `/provekit.test tier2` on relevant endpoint |
| 4: E2E-PROVEN | Tier 3 tests pass | Guide user through E2E test |
| 5: PRODUCTION | Stakeholder validation | Record stakeholder approval with notes |

6. If evidence gathered successfully:
   - Update capability level
   - Append evidence entry with timestamp, description, tier
   - Update `lastProvenAt`
   - Check if this upgrades any phase advancement criteria
   - Report new level and suggest next steps

7. If evidence fails:
   - Report what failed
   - Keep current level
   - Suggest remediation

### `list` — Show all capabilities with maturity

Display table:
```
Capability               Level  Status         Last Proven
─────────────────────────────────────────────────────────
storyboard-generation    4/5    E2E-PROVEN     2025-02-08
creative-direction       3/5    API-PROVEN     2025-02-07
lottie-pipeline          2/5    SCRIPT-PROVEN  2025-02-06
video-rendering          4/5    E2E-PROVEN     2025-02-08
client-theming           1/5    PROTOTYPE      —

Overall: 2.8/5.0 (14/25 points)
Handoff ready: NO (need 5+ at Level 3+, have 2)
```

### `detail "name"` — Show detailed evidence for a capability

Display:
1. Capability name, description, current level
2. Full evidence trail with dates, tiers, descriptions
3. Next level requirements
4. Related phase criteria

## Maturity Levels

| Level | Name | Color | Evidence Required |
|-------|------|-------|-------------------|
| 0 | IDEA | gray | None — just conceived |
| 1 | PROTOTYPE | red | Source code exists, basic implementation |
| 2 | SCRIPT-PROVEN | orange | Tier 1 tests pass (script-level) |
| 3 | API-PROVEN | yellow | Tier 2 tests pass (API-level) |
| 4 | E2E-PROVEN | green | Tier 3 tests pass (end-to-end) |
| 5 | PRODUCTION | blue | Stakeholder validated, edge cases handled |

## Overall Readiness Score

Calculated as weighted average:
- Each capability: `level / 5 * weight`
- Default weight: 1.0 (can be overridden with `--weight N`)
- Core capabilities (marked with `--core`) get 2x weight
- Handoff threshold: 7.5/10

## State File: `.provekit/capability-map.json`

```json
{
  "capabilities": {
    "storyboard-generation": {
      "level": 3,
      "name": "API-PROVEN",
      "description": "Generate video storyboards from text topics via Claude",
      "core": true,
      "weight": 1.0,
      "evidence": [
        { "level": 1, "description": "api/storyboard/generate implemented", "date": "2025-02-01", "tier": null },
        { "level": 2, "description": "node api/storyboard/generate.js test passes", "date": "2025-02-02", "tier": 1 },
        { "level": 3, "description": "curl POST /api/storyboard/generate returns valid storyboard", "date": "2025-02-03", "tier": 2 }
      ],
      "createdAt": "2025-01-30",
      "lastProvenAt": "2025-02-03"
    }
  },
  "metadata": {
    "createdAt": "2025-01-30",
    "lastUpdated": "2025-02-03",
    "overallScore": 3.0,
    "handoffReady": false
  }
}
```

## Integration Points

- **`/provekit.phase`**: Capability levels feed phase advancement criteria
- **`/provekit.test`**: Test results automatically upgrade capability levels
- **`/provekit.handoff`**: Overall score determines handoff readiness
- **`/provekit.pipeline`**: Pipeline-related capabilities get staleness warnings

## Important Notes

- Capabilities can only advance one level at a time (no skipping from 0 to 3)
- Evidence is append-only — proving a capability never removes prior evidence
- A capability can be re-proven at the same level (adds evidence without changing level)
- Core capabilities (`--core`) have stricter handoff requirements: must be Level 4+
- Capability names should be kebab-case, descriptive, and unique
