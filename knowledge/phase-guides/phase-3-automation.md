# Phase 3: Automation

## Question
**"Can non-developers use it?"**

## Goal
Prove that the system is accessible to non-technical users through thin orchestration (forms, no-code tools). End-to-end flow from user input to delivered output.

## Evidence Required to Advance
- End-to-end flow from form submission to output delivery
- Non-developer can trigger the flow successfully
- Error messages are user-friendly
- No terminal/code required for normal operation

## What to Build
- n8n/Retool/form workflows
- Webhook endpoints for workflow integration
- Status polling or callback for async operations
- User-friendly error responses

## What NOT to Build
- Custom React/Vue frontend (use n8n forms instead)
- Complex user management
- Production deployment

## Patterns to Follow
- P1: Thin Orchestration — forms submit to API, nothing more
- P7: Three-Tier Testing — test the full E2E flow

## Anti-Patterns to Avoid
- A1: Premature UI — n8n forms, not React
- A9: Business Logic in Orchestration — n8n nodes stay thin

## Example (from Remotion PoC)
Phase 3 added `n8n/workflows/video-rapido.json` — a form that asked for topic, plugin, and format, then called the storyboard generation API, showed a preview, allowed editing, and compiled + rendered the final video. The entire flow was form-driven.

## Duration
Typically 3-5 days.

## Advancement Checklist
- [ ] Non-developer can trigger full workflow
- [ ] Form → API → output delivery works end-to-end
- [ ] Error cases show user-friendly messages
- [ ] At least 1 workflow/form is production-ready for demo
