---
description: Manage PoC iteration phases. View current status, advance to next phase with evidence, or revisit a previous phase.
argument-hint: <status|advance|revisit> [phase-number] [--evidence "description"] [--force]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Manages the 7-phase iteration model that guides PoC development from initial feasibility to production variety. Each phase answers exactly ONE question and requires specific evidence before advancing.

## Subcommands

### `status` — Show current phase and progress

Display:
1. Current phase number, name, and question
2. For each phase (0-6): status (active/completed/pending/revisiting), evidence count, timestamps
3. Overall progress bar: `[████░░░░░░] 3/7 phases`
4. Capabilities summary: how many at each maturity level
5. Recommendations: what evidence is still needed for current phase

**Phase status values:**
- `pending` — Not yet started
- `active` — Currently working on this phase
- `completed` — Evidence meets advancement criteria
- `revisiting` — Previously completed, being re-evaluated

### `advance` — Attempt to advance to next phase

**Process:**
1. Read `.provekit/phase-state.json`
2. Check current phase's advancement criteria (see table below)
3. If criteria met:
   - Mark current phase as `completed` with timestamp
   - Set next phase to `active`
   - Update `currentPhase`
   - Record in `history` array
   - Report success with next phase's question
4. If criteria NOT met:
   - Report what's missing
   - Suggest specific actions to gather evidence
   - Do NOT advance (unless `--force` is used)

**`--force` flag**: Advances even if criteria aren't fully met. Records a warning in history. Use for experienced teams who understand the risk.

### `revisit {N}` — Revisit a previous phase

Mark phase N as `revisiting`. This is normal — ProveKit expects non-linear progression.

1. Set target phase status to `revisiting`
2. Keep current phase as `active` (both can be active simultaneously)
3. Record in history with reason
4. Phase N does NOT lose its evidence — it's additive

## Advancement Criteria

| Phase | Criteria |
|-------|----------|
| 0 → 1 | 3+ outputs matching target format; 1+ capability at Level 1+ |
| 1 → 2 | 2+ plugins registered; 2+ client profiles; 3+ API endpoints working |
| 2 → 3 | Same endpoint produces visually distinct outputs via config only; 2+ content library entries |
| 3 → 4 | E2E from form submission to delivery works; non-developer can trigger it |
| 4 → 5 | Output passes quality bar (stakeholder approval or blind test); 3+ capabilities at Level 4+ |
| 5 → 6 | LLM makes contextually appropriate decisions; varied output without code changes |
| 6 → handoff | 10+ outputs all distinct and professional; /provekit.handoff passes |

## State File: `.provekit/phase-state.json`

```json
{
  "currentPhase": 2,
  "phases": {
    "0": {
      "name": "Feasibility",
      "status": "completed",
      "question": "Can the tech produce output?",
      "evidence": [
        { "description": "Generated 5 legal short videos", "date": "2025-02-01", "tier": 1 },
        { "description": "Output matches 1080x1920 target", "date": "2025-02-01", "tier": 1 }
      ],
      "startedAt": "2025-01-30",
      "completedAt": "2025-02-01"
    },
    "2": {
      "name": "Flexibility",
      "status": "active",
      "question": "Can output vary without code changes?",
      "evidence": [],
      "startedAt": "2025-02-05"
    }
  },
  "history": [
    { "action": "advance", "from": 0, "to": 1, "date": "2025-02-01" },
    { "action": "advance", "from": 1, "to": 2, "date": "2025-02-05" }
  ]
}
```

## Adding Evidence

Use `--evidence "description"` with any subcommand, or when proving capabilities via `/provekit.capability prove`.

Evidence is also auto-collected when:
- `/provekit.test` passes at any tier
- `/provekit.capability` advances a capability level
- `/provekit.pipeline check` passes

## Integration Points

- **`/provekit.capability`**: Capability maturity feeds phase advancement criteria
- **`/provekit.test`**: Test results become phase evidence
- **`/provekit.handoff`**: Phase 6 completion triggers handoff readiness
- **`/provekit.pattern`**: Pattern audit results inform phase-appropriate patterns

## Important Notes

- Phase regression is NOT failure — it's expected. The Remotion PoC revisited Phase 2 after reaching Phase 5.
- Evidence is append-only. Revisiting a phase adds evidence, never removes it.
- The `--force` flag should be used sparingly. It's there for teams who know their domain.
- Phase advancement is a SUGGESTION, not a gate. Teams can work on any phase at any time.
