---
description: Audit codebase against ProveKit's 10 core patterns and 10 anti-patterns. Reports specific violations with file:line references and remediation suggestions.
argument-hint: [--patterns] [--anti-patterns] [--verbose] [--fix]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Audits the current PoC project against ProveKit's pattern library. Detects both the presence of good patterns (things you should be doing) and anti-patterns (things that indicate premature complexity or misaligned effort).

By default, checks both patterns and anti-patterns. Use `--patterns` or `--anti-patterns` to check only one category.

## 10 Core Patterns

### P1: Thin Orchestration / Thick Backend
**Check**: All business logic lives in `api/` directory. Orchestration layer (n8n, forms) contains < 10 lines of logic per node.
**How to detect**:
- Count lines in n8n Code nodes (> 10 lines = violation)
- Check that API server handles all data transformation
- Verify form submissions go straight to API endpoints
**Remediation**: Move logic from orchestration to API endpoints.

### P2: Configuration as Code
**Check**: Configuration stored as JSON files on disk, read fresh each request. No database for config.
**How to detect**:
- Presence of `plugins/*/plugin.json`, `clients/*.json`
- No SQL/ORM imports in config-related code
- `fs.readFileSync` or `fs.readFile` in config loading
**Remediation**: Extract config from code into JSON files.

### P3: Content Library as Few-Shot Learning
**Check**: LLM prompts include real examples from content library. Examples match current schema.
**How to detect**:
- Prompt templates reference content library (glob pattern or file reads)
- Examples are injected into prompts at generation time
- Cross-reference with `/provekit.fewshot validate`
**Remediation**: Create content library entries and inject them into prompts.

### P4: LLM-Driven Decisions
**Check**: Complex branching logic (> 5 conditions) replaced with LLM calls.
**How to detect**:
- Count if/else chains longer than 5 branches in decision-making code
- Look for switch statements with > 5 cases on creative/subjective decisions
- Check if an LLM call exists as alternative
**Remediation**: Replace conditional chains with a single LLM call for subjective decisions.

### P5: Fallback Chains
**Check**: Every optional field has a fallback chain (new → old → default).
**How to detect**:
- Search for `??` (nullish coalescing) and `||` (logical or) patterns
- Check that new optional fields added to types have fallback reads in compilers
- Verify no bare property access on optional fields without fallback
**Remediation**: Add `field ?? fallback1 ?? fallback2 ?? default` chains.

### P6: Pipeline Staleness Prevention
**Check**: Schema changes propagated to all pipeline layers.
**How to detect**: Delegate to `/provekit.pipeline check`
**Remediation**: Run `/provekit.pipeline fix`

### P7: Three-Tier Testing
**Check**: Tests exist at script, API, and E2E levels. No tier skipping.
**How to detect**: Delegate to `/provekit.test status`
**Remediation**: Fill in missing test tiers bottom-up.

### P8: Iterative Quality Uplift
**Check**: Each phase builds on previous without rewriting. No "start over" commits.
**How to detect**:
- Check git history for patterns like "rewrite", "start fresh", "v2 from scratch"
- Verify backward compatibility in type changes
- Look for additive-only schema evolution
**Remediation**: Extend, don't replace. Add fields, don't rename them.

### P9: Separation of Concerns
**Check**: LLM decides (creative), Compiler translates (mechanical), Renderer produces (deterministic).
**How to detect**:
- LLM prompts should NOT contain rendering logic
- Compilers should NOT make creative decisions (no randomness)
- Renderer should NOT parse natural language
**Remediation**: Move logic to the correct layer.

### P10: Asset Pipeline with Theming
**Check**: Assets are reusable across clients via theming/parameterization.
**How to detect**:
- Check for client-specific asset copies (anti-pattern: `assets/client1/logo.png`)
- Look for theming functions that transform base assets
- Verify caching of themed variants
**Remediation**: Create theming pipeline that transforms base assets per-client.

## 10 Anti-Patterns

### A1: Premature UI
**Detect**: React, Next.js, Vue, Angular, Svelte in package.json dependencies before Phase 4.
**Severity**: HIGH before Phase 4, LOW after Phase 4.
**Message**: "UI framework detected at Phase {N}. ProveKit recommends thin orchestration (n8n/Retool/forms) until Phase 4."

### A2: Database Before Validation
**Detect**: SQL, Prisma, Drizzle, Mongoose, TypeORM in package.json. Or `.sql`, `.prisma` files.
**Severity**: HIGH before Phase 2, MEDIUM after.
**Message**: "Database ORM detected. ProveKit recommends JSON-on-disk until your data model is stable (Phase 2+)."

### A3: Framework Overhead
**Detect**: Express, Fastify, Koa, Hapi, NestJS in package.json during Phase 0-2.
**Severity**: MEDIUM.
**Message**: "Web framework detected. Node's built-in http module is sufficient for PoC. Frameworks add complexity without proving value."

### A4: Stale Content Library
**Detect**: Content library examples missing fields that type definitions include.
**Severity**: HIGH (causes LLM output regression).
**Message**: "Content library out of sync with types. Run /provekit.fewshot validate."

### A5: Missing Fallback Chain
**Detect**: Optional fields accessed without `??` or `||` fallback.
**Severity**: MEDIUM (causes runtime errors on older data).
**Message**: "Field '{field}' accessed without fallback at {file}:{line}."

### A6: Hardcoded Creativity
**Detect**: Switch statements or if/else chains > 5 branches for subjective decisions (colors, styles, layouts).
**Severity**: LOW at Phase 0-3, HIGH at Phase 5+.
**Message**: "Hardcoded creative decisions at {file}:{line}. Consider LLM-driven approach."

### A7: Tier Skipping
**Detect**: API tests exist but no script-level tests for the same module.
**Severity**: MEDIUM.
**Message**: "Tier 2 tests exist for {endpoint} but Tier 1 missing for {module}."

### A8: Pipeline Staleness
**Detect**: Schema changes not propagated. Delegate to `/provekit.pipeline check`.
**Severity**: HIGH.
**Message**: "Pipeline layer {layer} is stale. Run /provekit.pipeline fix."

### A9: Business Logic in Orchestration
**Detect**: n8n Code nodes or workflow expressions > 10 lines.
**Severity**: MEDIUM.
**Message**: "Business logic in orchestration layer at {workflow}:{node}. Move to API."

### A10: Premature Production Concerns
**Detect**: Auth middleware, rate limiting, HTTPS config, helmet.js, CORS libraries before Phase 5.
**Severity**: LOW (valid concern, wrong timing).
**Message**: "Production concern '{concern}' detected at Phase {N}. Defer until Phase 5+."

## Output Format

```
ProveKit Pattern Audit
═══════════════════════

PATTERNS (adherence score: 7/10):
  [PASS] P1: Thin Orchestration / Thick Backend — 18 endpoints, 0 fat orchestration nodes
  [PASS] P2: Configuration as Code — 5 plugins, 5 clients, all JSON
  [WARN] P3: Content Library as Few-Shot — 3/5 examples current, 2 stale
  [PASS] P4: LLM-Driven Decisions — creative-director.js uses Haiku
  [FAIL] P5: Fallback Chains — 3 fields missing fallbacks (see details)
  [PASS] P6: Pipeline Staleness — All layers in sync
  [PASS] P7: Three-Tier Testing — 8/10 modules tested
  [PASS] P8: Iterative Quality Uplift — No rewrite commits detected
  [PASS] P9: Separation of Concerns — Clean LLM/Compiler/Renderer split
  [SKIP] P10: Asset Pipeline — No theming pipeline registered

ANTI-PATTERNS (violations: 2):
  [CLEAN] A1-A3: No premature complexity detected
  [ALERT] A4: Stale Content Library — 2 examples need update
  [ALERT] A5: Missing Fallback — postProduction.bokeh at compilers/legal-short-v2.js:145
  [CLEAN] A6-A10: No violations detected

Overall: 7/10 patterns adhered, 2 anti-pattern violations
Run: /provekit.pipeline fix and /provekit.fewshot upgrade legal
```

## Integration Points

- **`/provekit.phase`**: Pattern adherence informs phase readiness
- **`/provekit.pipeline`**: Delegates P6 and A8 checks
- **`/provekit.fewshot`**: Delegates P3 and A4 checks
- **`/provekit.test`**: Delegates P7 and A7 checks
- **`/provekit.handoff`**: Pattern score is part of handoff readiness

## Important Notes

- Anti-pattern severity depends on CURRENT PHASE — what's an anti-pattern at Phase 0 may be appropriate at Phase 5
- Pattern audit is suggestive, not prescriptive — teams may intentionally deviate
- The `--fix` flag only applies automated fixes for A4 (stale content library) and A5 (missing fallbacks)
- File:line references require actual codebase analysis — the agent must read and grep files
