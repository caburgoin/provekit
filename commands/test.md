---
description: Run three-tier testing with enforced tier order. Script-level, API-level, then UI-level — never skip tiers.
argument-hint: <tier1|tier2|tier3|status> [target] [--force] [--verbose]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

ProveKit's three-tier testing model enforces bottom-up validation: prove that scripts work before testing APIs, prove that APIs work before testing end-to-end flows. This prevents the common PoC failure mode of testing at the wrong abstraction level.

**CRITICAL RULE**: You cannot run Tier 2 tests until Tier 1 passes. You cannot run Tier 3 tests until Tier 2 passes. The `--force` flag overrides this, but records a warning.

## Subcommands

### `tier1 {module}` — Script-level testing

**Purpose**: Validate that a module works in isolation, without a running server.

**What to test:**
1. Module imports without errors
2. Functions return expected types
3. JSON output matches schema
4. Edge cases and error handling
5. File I/O works (reads config, writes output)

**How to run:**
```bash
# Direct node execution
node -e "const m = require('./api/storyboard/types.js'); console.log(Object.keys(m))"

# Run a module's test function if it has one
node api/storyboard/lottie-registry.js --test

# Validate JSON output
node -e "const r = require('./api/storyboard/compilers/legal-short-v2.js'); r.compile(testInput).then(console.log)" | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))"
```

**Evidence recorded:**
```json
{
  "tier": 1,
  "target": "api/storyboard/compilers/legal-short-v2.js",
  "result": "PASS",
  "details": "Compiler produces valid JSON with all required fields",
  "timestamp": "2025-02-10T10:00:00Z"
}
```

**On pass**: Update relevant capability to Level 2 (SCRIPT-PROVEN) if at Level 1.
**On fail**: Report error, suggest fix, do NOT update capability level.

### `tier2 {endpoint}` — API-level testing

**Prerequisite**: All related Tier 1 tests must pass. If not, report which Tier 1 tests need to run first.

**Purpose**: Validate that API endpoints accept input, process it, and return correct output.

**What to test:**
1. Endpoint responds (not 404/500)
2. Content-Type is application/json
3. Response body matches expected schema
4. Error cases return appropriate status codes
5. Required fields are present in response

**How to run:**
```bash
# Basic endpoint test
curl -s http://localhost:4010/api/health | jq .

# POST with body
curl -s -X POST http://localhost:4010/api/storyboard/generate \
  -H 'Content-Type: application/json' \
  -d '{"plugin":"legal","format":"reel-educativo","topic":"test"}' | jq .

# Check status code
curl -s -o /dev/null -w "%{http_code}" http://localhost:4010/api/health
```

**Before running**: Check if server is running on expected port. If not, remind user to start it.

**Evidence recorded:**
```json
{
  "tier": 2,
  "target": "POST /api/storyboard/generate",
  "result": "PASS",
  "details": "Returns 200 with valid storyboard JSON, 15 fields present",
  "timestamp": "2025-02-10T10:05:00Z"
}
```

**On pass**: Update relevant capability to Level 3 (API-PROVEN) if at Level 2.

### `tier3 {workflow}` — UI-level testing (user-driven)

**Prerequisite**: All related Tier 2 tests must pass.

**Purpose**: Validate end-to-end flow from user input to final output.

**This tier is user-driven.** The agent:
1. Describes the test scenario step by step
2. Provides exact form inputs to use
3. Tells user what to verify at each step
4. Optionally assists via browser automation (Playwright MCP)

**Test scenarios should cover:**
1. Happy path: normal input → expected output
2. Edge case: minimal input → acceptable output
3. Error case: invalid input → helpful error message

**Evidence recorded:**
```json
{
  "tier": 3,
  "target": "video-rapido workflow",
  "result": "PASS",
  "details": "Form → storyboard → edit → compile → render → download verified",
  "timestamp": "2025-02-10T10:15:00Z",
  "verifiedBy": "user"
}
```

**On pass**: Update relevant capability to Level 4 (E2E-PROVEN) if at Level 3.

### `status` — Show test status across all tiers

Display:
```
Testing Status:
  Tier 1 (Script):  8/10 modules tested, 7 passing, 1 failing, 2 untested
  Tier 2 (API):     5/8 endpoints tested, 5 passing
  Tier 3 (E2E):     2/3 workflows tested, 2 passing

  Blocked:
    - Tier 2: api/storyboard/compile blocked by Tier 1 failure in compilers/legal-short-v2.js
    - Tier 3: feedback-loop blocked by untested Tier 2 endpoints

  Next: Run /provekit.test tier1 api/storyboard/compilers/legal-short-v2.js
```

## Tier Enforcement

```
User: /provekit.test tier2 /api/storyboard/generate

Agent checks:
  Tier 1 for api/storyboard/generate.js → NOT RUN

Response:
  Cannot run Tier 2: Tier 1 has not been run for this module.
  Run first: /provekit.test tier1 api/storyboard/generate.js

  Use --force to override (not recommended).
```

## Test Results Storage

Test results are stored in `.provekit/capability-map.json` as evidence entries on the relevant capability. Cross-reference is maintained via the `target` field.

## Integration Points

- **`/provekit.capability`**: Test results upgrade capability maturity levels
- **`/provekit.phase`**: Test results become phase evidence
- **`/provekit.pipeline`**: Failed tests may indicate pipeline staleness — suggest running pipeline check
- **`/provekit.pattern`**: Tier skipping = Anti-Pattern #7

## Important Notes

- Tier 1 tests should be runnable WITHOUT a server (pure module execution)
- Tier 2 tests require a running server — remind user to start it
- Tier 3 tests are user-driven — the agent guides but doesn't own execution
- Always check pipeline staleness before debugging test failures
- Server restart is needed after JS file changes (Node module cache)
- Test results are append-only evidence — failures don't erase previous passes
