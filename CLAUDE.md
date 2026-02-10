# ProveKit — Backend-First PoC Iteration Framework

**Tagline**: "Prove it works. Then build it right."

ProveKit helps teams iterate heavily on backend/business logic with thin orchestration, prove the idea at production-grade OUTPUT quality, and only then consider building a full app.

## Core Philosophy

1. **Backend First**: All business logic lives in a single-file API server. No frameworks, no database, no auth — just prove the idea works.
2. **Thin Orchestration**: Use n8n, Retool, or simple forms for UI. Never build React/Next.js during PoC.
3. **Configuration as Code**: JSON on disk, read fresh each request. No database until data model is stable.
4. **Few-Shot > Instructions**: Content library examples teach LLMs output shape better than prose instructions.
5. **LLM-Driven Decisions**: Replace 50+ conditionals with 1 cheap Haiku call.
6. **Fallback Chains**: Every new optional field must degrade gracefully through 3+ levels.
7. **Pipeline Staleness Prevention**: A schema change is not done until every pipeline layer reflects it.

## Phase Progression (7 Phases)

| Phase | Question | Focus |
|-------|----------|-------|
| 0: Feasibility | Can the tech produce output? | Just get it working |
| 1: Abstraction | Can it serve multiple tenants? | Config-as-Code |
| 2: Flexibility | Can output vary without code changes? | Few-Shot Learning |
| 3: Automation | Can non-developers use it? | Thin Orchestration |
| 4: Quality | Can output match professional quality? | Asset Pipeline |
| 5: Agency | Can the system make decisions? | LLM-Driven Decisions |
| 6: Variety | Can every output look unique? | All patterns together |

## Capability Maturity (6 Levels)

| Level | Name | Evidence |
|-------|------|----------|
| 0 | IDEA | Conceived, not started |
| 1 | PROTOTYPE | Basic implementation, untested |
| 2 | SCRIPT-PROVEN | Tier 1 tests pass |
| 3 | API-PROVEN | Tier 2 tests pass |
| 4 | E2E-PROVEN | Tier 3 tests pass |
| 5 | PRODUCTION | Stakeholder validated |

## Three-Tier Testing (NEVER skip tiers)

1. **Tier 1 — Script-level**: Run modules directly (Node scripts, JSON validation). No server needed.
2. **Tier 2 — API-level**: curl against running server. Restart server if JS modules changed.
3. **Tier 3 — UI-level**: End-to-end via n8n/Retool. User-driven, agent-assisted.

## Pipeline Layers (trace ALL on schema change)

1. Types/constants
2. Server route handlers
3. Prompt templates (read fresh from disk)
4. Content library examples (few-shot signal)
5. Compilers (translate LLM output to render-ready)
6. Preview/UI
7. Edit prompts (must preserve new fields)
8. Server restart (Node module cache)

## State Files

All ProveKit state lives in `.provekit/` at project root:
- `phase-state.json` — Current phase, history, evidence per phase
- `capability-map.json` — All capabilities with maturity levels and evidence
- `pipeline-manifest.json` — Registered pipelines with their layers
- `decisions/` — Architecture decision records (one JSON per decision)

## SpecKit Handoff

ProveKit's output becomes SpecKit's input. When `/provekit.handoff` passes:
- 5+ capabilities at Level 3+
- Core business logic at Level 4+
- Pipeline staleness check passes
- Content library demonstrates full schema

Generate handoff package → feed to `/speckit.init --from-provekit`.

## Agent Work Style

- Favor parallel workers for independent file creation
- Use Serena memory proactively for pattern discovery
- Follow three-tier testing — never skip tiers
- Always trace full pipeline on schema changes
- Fix factories, not instances — improve building blocks
