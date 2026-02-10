---
description: Assess SpecKit readiness and generate handoff package. Scores business logic completeness, API stability, output quality, and test coverage.
argument-hint: [--score-only] [--generate] [--verbose]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

The handoff command determines whether your PoC is ready to transition from "proving it works" (ProveKit) to "building it right" (SpecKit). It scores your project across 5 dimensions, checks hard requirements, and optionally generates a handoff package that becomes SpecKit's input.

**Key principle**: ProveKit's output is SpecKit's input. The handoff package contains everything SpecKit needs to scaffold a production app around your proven business logic.

## Process

### Step 1: Score Assessment (5 Dimensions)

| Dimension | Weight | How Scored |
|-----------|--------|------------|
| Business Logic Completeness | 30% | Capability maturity average (0-5 scale → 0-10) |
| API Stability | 20% | Endpoint count, response consistency, error handling |
| Output Quality | 20% | Stakeholder validation count, quality tier evidence |
| Test Coverage | 15% | Tier coverage across capabilities (tier1 + tier2 + tier3 scores) |
| Pattern Adherence | 15% | Pattern audit score from `/provekit.pattern` |

**Scoring:**
```
Business Logic: (avg capability level / 5) * 10 * 0.30
API Stability:  (proven endpoints / total endpoints) * 10 * 0.20
Output Quality: (stakeholder approvals / capabilities) * 10 * 0.20
Test Coverage:  (passed tiers / possible tiers) * 10 * 0.15
Patterns:       (pattern score / 10) * 10 * 0.15
─────────────────────────────────────────────────────
Total:          X.X / 10.0
Threshold:      7.5 / 10.0
```

### Step 2: Hard Requirements Check

All must be TRUE for handoff:
- [ ] 5+ capabilities registered
- [ ] 5+ capabilities at Level 3+ (API-proven)
- [ ] All core capabilities at Level 4+ (E2E-proven)
- [ ] No critical-path capabilities at Level 0-1
- [ ] Pipeline staleness check passes (all pipelines clean)
- [ ] 1+ content library entry per plugin demonstrates full current schema
- [ ] At least 1 architecture decision recorded

### Step 3: Report

```
SpecKit Handoff Assessment
══════════════════════════

Score: 8.2 / 10.0 (threshold: 7.5) ✓ READY

Dimensions:
  Business Logic:  8.5/10 (0.30) = 2.55  ← 7 capabilities, avg Level 4.2
  API Stability:   9.0/10 (0.20) = 1.80  ← 18/18 endpoints proven
  Output Quality:  7.0/10 (0.20) = 1.40  ← 5/7 stakeholder validations
  Test Coverage:   8.0/10 (0.15) = 1.20  ← 80% tier coverage
  Pattern Score:   8.5/10 (0.15) = 1.28  ← 8.5/10 pattern adherence

Hard Requirements:
  [PASS] 7 capabilities registered (need 5+)
  [PASS] 6 capabilities at Level 3+ (need 5+)
  [PASS] 3 core capabilities at Level 4+
  [PASS] No critical capabilities at Level 0-1
  [PASS] Pipeline staleness check clean
  [WARN] 4/5 plugins have full-schema examples (1 needs update)
  [PASS] 4 architecture decisions recorded

Recommendation: READY FOR HANDOFF
  Fix: Update plugins/motion content library to include latest schema fields
  Then: Run /provekit.handoff --generate to create handoff package
```

### Step 4: Generate Handoff Package (with `--generate`)

Creates a `.provekit/handoff/` directory containing:

1. **`api-contracts.json`** — All API endpoints with:
   - Method, path, description
   - Request body schema (from type definitions)
   - Response body schema (from actual responses)
   - curl examples (from Tier 2 test evidence)

2. **`plugin-architecture.json`** — Plugin system documentation:
   - Plugin directory structure
   - plugin.json schema
   - How plugins are loaded and used
   - Format definitions

3. **`capability-map.json`** — Copy of `.provekit/capability-map.json` with:
   - All capabilities, levels, evidence
   - Overall maturity score
   - Core vs non-core classification

4. **`architecture-decisions.json`** — All ADRs from `.provekit/decisions/`

5. **`client-profiles.json`** — Example client structure:
   - Schema definition
   - 2+ example profiles
   - How clients are loaded and used

6. **`pipeline-map.json`** — Pipeline architecture:
   - All registered pipelines
   - Layer definitions and file paths
   - Data flow diagram (text-based)

7. **`handoff-summary.md`** — Human-readable summary:
   - What was proven and how
   - Key architectural decisions
   - Known limitations
   - Recommended SpecKit phases
   - What to build vs what to keep

## SpecKit Integration

The handoff package is designed for `/speckit.init --from-provekit`:
```bash
# In SpecKit project
/speckit.init --from-provekit /path/to/.provekit/handoff/
```

SpecKit will:
1. Import API contracts as the API specification
2. Import architecture decisions as initial design context
3. Import capability map as feature requirements
4. Import client profiles as data model seeds
5. Set up project structure that wraps the proven API

## Integration Points

- **`/provekit.capability`**: Capability scores are primary input
- **`/provekit.test`**: Test coverage is scored
- **`/provekit.pattern`**: Pattern adherence is scored
- **`/provekit.pipeline`**: Pipeline health is a hard requirement
- **`/provekit.fewshot`**: Content library currency is checked
- **`/provekit.phase`**: Phase 6 completion is implied by handoff

## Important Notes

- Handoff is NOT a gate — teams can use SpecKit earlier if they choose
- The `--score-only` flag skips hard requirements and just shows the score
- The `--generate` flag creates the handoff package (requires passing score)
- Re-running handoff after fixes updates the score incrementally
- The handoff package is a snapshot — continued ProveKit work won't auto-update it
