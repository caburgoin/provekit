---
description: Plan, develop, and test Pulso services using the proven 3-tier methodology. Encodes all nuances from 7 completed services including n8n sandbox rules, Meta API quirks, and Playwright MCP testing patterns.
argument-hint: <plan|dev|test|status|validate> <service-name> [tier1|tier2|tier3] [--force]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

This command manages the full lifecycle of a Pulso service — from planning through 3-tier development and testing. It encodes ALL nuances discovered across 7 completed services (remotion-poc, pulso-leadmagnet, pulso-intake, pulso-intel, pulso-leads, pulso-nurture, pulso-ads) so that building or modifying any service follows the proven methodology.

**CRITICAL**: Read `~/.claude/projects/-Users-carlosburgoin-Documents-cloudProjects-consultancy/memory/pulso-dev-testing.md` at the start of every invocation for the full methodology reference.

## Subcommands

### `plan <service-name>` — Plan a new Pulso service

**Purpose**: Scaffold and plan a new service with the correct structure and tier roadmap.

**Steps:**
1. Read the Service Registry from MEMORY.md to get context on existing services
2. Read `pulso-patterns.md` from memory for code patterns
3. Ask the user:
   - Port number (check registry for conflicts)
   - External APIs needed (Anthropic, SerpAPI, WhatsApp, Meta, Resend, etc.)
   - n8n workflow types needed (form-triggered, scheduled, webhook)
   - Business domain description
4. Generate scaffold structure:
   ```
   {service}/
   ├── api/{domain}/          # Business logic modules
   ├── scripts/               # Tier 1 CLI scripts
   ├── test/                  # Tier 2 test files
   ├── n8n/workflows/         # Tier 3 workflow JSONs
   ├── clients/               # Client profiles
   ├── prompts/               # Prompt templates (.txt)
   ├── content-library/       # Few-shot examples (.json)
   ├── output/                # Generated output (gitignored)
   ├── plugins/legal/         # Legal vertical plugins
   ├── server.js              # HTTP server
   ├── package.json           # ESM, type: "module"
   ├── .env                   # Default env vars
   └── .env.local             # Local overrides (CLAUDE_BACKEND=cli)
   ```
5. Generate `{service}/TIER-ROADMAP.md` with dependency graph
6. Update MEMORY.md service registry with new entry (status: Planning)

### `dev <service> tier1` — Develop Tier 1 (CLI Scripts)

**Prerequisite**: Service plan exists (TIER-ROADMAP.md)

**Steps:**
1. Create CLI scripts following the pattern:
   ```
   loadEnv() → parseArgs() → validate → call business logic → saveOutput() → print
   ```
2. Wire up `shared/claude.js` import (relative path: `../../../shared/claude.js` from `api/{domain}/`)
3. Create prompt templates in `prompts/*.txt` with `{placeholder}` syntax
4. Create content library examples in `content-library/*.json`
5. Create `scripts/validate-outputs.js` for schema validation
6. Run all scripts and verify `output/` contains valid JSON
7. Record Tier 1 evidence

**Auto-applies:**
- ESM imports (`import` not `require`)
- `shared/claude.js` for all Claude calls (never raw API calls)
- `.env.local` with `CLAUDE_BACKEND=cli` + `ANTHROPIC_TOKEN`

### `dev <service> tier2` — Develop Tier 2 (HTTP API)

**Prerequisite**: Tier 1 must be passing. Check by running `scripts/validate-outputs.js`.

**Block if Tier 1 not passing** — report which scripts fail and stop.

**Steps:**
1. Create `server.js` from skeleton pattern:
   ```javascript
   import http from 'http';
   // parseBody, sendJson, loadEnv helpers
   // CORS headers on every response + OPTIONS preflight
   // Route dispatch: /api/health, /api/{domain}/{action}
   ```
2. Add routes for each business domain action
3. Create `test/test-{domain}.mjs` with:
   ```javascript
   // makeRequest(method, path, body) helper
   // Sequential tests: health → generate → edit → list → get → error cases
   // Color-coded output, exit code for CI
   ```
4. Add `npm start` and `npm test` to `package.json`
5. Start server, run test suite
6. Also test manually with `curl` for endpoints not covered
7. Record Tier 2 evidence

**Auto-applies:**
- CORS headers on every response
- `parseBody(req)` / `sendJson(res, status, data)` helpers
- JSON fence stripping via `parseClaudeJson()` from shared module

### `dev <service> tier3` — Develop Tier 3 (n8n Workflows)

**Prerequisite**: Tier 2 must be passing. Check by running `npm test`.

**Block if Tier 2 not passing** — report which tests fail and stop.

**Steps:**
1. Generate n8n workflow JSON files in `n8n/workflows/`
2. **Auto-apply sandbox rules**: NEVER put `fetch()`, `$helpers.httpRequest`, or `require()` in Code nodes
3. **Auto-apply batch pattern**: When a workflow needs per-item API calls, create a server-side batch endpoint (e.g. `POST /api/{domain}/batch`) that loops internally, then use a single HTTP Request node
4. Run structural validation:
   - Valid JSON parse
   - All HTTP Request URLs target correct port
   - No orphan nodes
   - No sandbox violations in Code nodes
   - Form trigger paths are unique
5. Import via n8n CLI: `npx n8n import:workflow --input=path.json`
6. Activate via n8n API: `POST /api/v1/workflows/{id}/activate`
7. Test via Playwright MCP:
   - **Form workflows**: Navigate to form URL → fill form → submit → verify response
   - **Scheduled workflows**: Navigate to n8n UI → open workflow → click "Execute Workflow" → wait → verify
8. Verify side effects (output files, email delivery, API objects)
9. Record Tier 3 evidence

**Auto-applies:**
- 120s timeout on batch-analyze HTTP Request nodes
- Dark-theme Mermaid diagrams (`%%{init: {'theme': 'dark'}}%%`)
- `graph TD`/`LR` instead of C4Context for Mermaid (contrast issues)
- Email delivery via HTTP Request node calling `POST /api/report/email`

### `test <service> <tier>` — Test a specific tier

**Purpose**: Run tests for a tier with enforced order and evidence collection.

**Tier enforcement**: Same as `dev` — cannot test Tier 2 without Tier 1 passing, etc. Use `--force` to override (records a warning).

**`test <service> tier1`**:
```bash
node scripts/generate-*.js --clientId bufete-mora     # Run each script
node scripts/validate-outputs.js                       # Schema validation
```

**`test <service> tier2`**:
```bash
npm start &    # Ensure server running
npm test       # Run test suite
```

**`test <service> tier3`** — Five phases:
1. **Structural validation**: Parse JSON, check URLs, orphan detection, sandbox scan
2. **CLI import**: `npx n8n import:workflow --input=file.json` for each workflow
3. **API activation**: `POST /api/v1/workflows/{id}/activate` with X-N8N-API-KEY
4. **Playwright MCP testing**:
   - Form workflows: `browser_navigate` → form URL → `browser_fill_form` → `browser_click` submit → `browser_snapshot` verify
   - Scheduled workflows: `browser_navigate` → n8n UI → open workflow → click "Execute Workflow" → `browser_wait_for` → `browser_snapshot`
5. **Side effect verification**: Check `output/` files, email delivery (Resend IDs), API objects

### `status <service>` — Show tier completion status

Display current tier status for the service:
```
Service: pulso-ads (port 4019)

Tier 1 (CLI Scripts):    PASS  — 3/3 scripts, outputs validated
Tier 2 (HTTP API):       PASS  — 7/7 endpoints, 15 API routes
Tier 3 (n8n Workflows):  PASS  — 5/5 workflows imported + tested

Overall: COMPLETE (all tiers passing)
```

Check for:
- Script outputs in `output/`
- Test results from `test/test-*.mjs`
- Workflow JSONs in `n8n/workflows/`
- Evidence in `.provekit/` if exists

### `validate <service>` — Full artifact validation

**Purpose**: Comprehensive check that all service artifacts are complete and consistent.

**Checks:**
1. All tiers have evidence (scripts run, tests pass, workflows tested)
2. Workflow JSONs pass structural validation
3. README.md exists with Mermaid diagrams
4. WORKFLOW-SPECS.md exists and matches actual workflow JSONs
5. `package.json` has correct port, start, and test scripts
6. `.env.local` has required variables
7. `shared/claude.js` import paths are correct
8. No stale output files (output matches current script versions)
9. Memory (MEMORY.md) has up-to-date service registry entry

---

## Nuance Auto-Checks

The command automatically warns or blocks on these known issues:

| Check | Trigger | Action |
|-------|---------|--------|
| Code node sandbox | `fetch(`, `$helpers`, `require(` in Code node | **BLOCK** — suggest batch endpoint pattern |
| splitInBatches | `splitInBatches` node type detected | **WARN** — suggest server-side batch endpoint |
| Meta API version | HTTP URLs containing `/v2[0-1].0/` | **WARN** — should be v22.0 |
| special_ad_categories | `['NONE']` in campaign config | **BLOCK** — must be `[]` |
| Form path uniqueness | Duplicate `path` in formTrigger nodes | **BLOCK** — paths must be unique |
| Batch timeout | HTTP Request to batch-analyze without timeout | **WARN** — add 120s timeout |
| Mermaid theme | C4Context in README | **WARN** — use graph TD/LR instead |
| Workflow activation | Testing inactive workflow | **WARN** — form URLs return 404 when inactive |
| Server restart | New endpoints added since last start | **WARN** — restart server |

---

## Integration Points

- **`/provekit.test`**: This command's `test` subcommand extends provekit.test with Pulso-specific checks
- **`/provekit.capability`**: Test results upgrade capability maturity levels
- **`/provekit.phase`**: Tier completion maps to phase evidence
- **`/provekit.pattern`**: Auto-checks enforce ProveKit patterns (no tier skipping, pipeline staleness)
- **Memory files**: Reads from `pulso-patterns.md` and `pulso-dev-testing.md` for methodology reference

## Important Notes

- **Language**: All user-facing content in Spanish, all code/comments in English
- **Claude model**: Always Haiku for all services (cost/speed optimization)
- **No frameworks**: Pure Node.js `http.createServer()`, never Express
- **ESM only**: All packages use `"type": "module"`
- **Shared module**: All Claude calls go through `shared/claude.js`, never raw API
- **Client profiles**: `clients/*.json` with branding, defaults, contact info
- **Idempotent imports**: `npx n8n import:workflow` creates or updates safely
- **Tier 3 complexity**: n8n workflows are the hardest tier — budget extra time for sandbox workarounds and Playwright testing
