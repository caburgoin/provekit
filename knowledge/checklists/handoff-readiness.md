# Handoff Readiness Checklist

Run before `/provekit.handoff` to ensure all criteria are met.

## Hard Requirements (ALL must pass)

- [ ] **5+ capabilities registered** — `/provekit.capability list` shows 5+
- [ ] **5+ at Level 3+** — At least 5 capabilities are API-PROVEN or higher
- [ ] **Core capabilities at Level 4+** — All capabilities marked `--core` are E2E-PROVEN
- [ ] **No critical at Level 0-1** — No critical-path capability is just an IDEA or PROTOTYPE
- [ ] **Pipeline clean** — `/provekit.pipeline check` shows no FAIL results
- [ ] **Content library current** — `/provekit.fewshot validate` shows all examples match schema
- [ ] **1+ ADR recorded** — `/provekit.decision list` shows at least 1 decision

## Scoring Dimensions (target: 7.5/10)

### Business Logic (30%)
- [ ] All core use cases have working API endpoints
- [ ] Edge cases documented (even if not all handled)
- [ ] No pending pivots or open architectural questions

### API Stability (20%)
- [ ] All endpoints respond correctly to valid input
- [ ] Error cases return appropriate status codes
- [ ] Response schemas are consistent and documented

### Output Quality (20%)
- [ ] At least 1 stakeholder has seen and approved output
- [ ] Quality meets professional standards for the domain
- [ ] 5+ sample outputs demonstrate variety

### Test Coverage (15%)
- [ ] Every core module has Tier 1 tests
- [ ] Every core endpoint has Tier 2 tests
- [ ] At least 1 E2E flow has Tier 3 test

### Pattern Adherence (15%)
- [ ] `/provekit.pattern` scores 7+/10
- [ ] No HIGH severity anti-patterns
- [ ] Pipeline staleness check passes

## Pre-Handoff Actions

1. Run all checks: `/provekit.pipeline check && /provekit.fewshot validate && /provekit.pattern`
2. Fix any FAIL results
3. Run `/provekit.handoff --score-only` to see current score
4. If score >= 7.5: run `/provekit.handoff --generate`
5. Review handoff package in `.provekit/handoff/`
