# A1: Premature UI

## What It Is
Adding React, Next.js, Vue, Angular, or any frontend framework before Phase 4. Building UI components, state management, routing, and styling when the business logic isn't proven yet.

## Why It's an Anti-Pattern
- **70% of effort goes to UI** (components, state, routing, auth, styling)
- **20% goes to API** (often thin wrappers around libraries)
- **10% goes to business logic** (the part that actually needs proving)
- When the core idea pivots, ALL the UI work is wasted

## Detection
```bash
# Check package.json for UI frameworks
grep -E "react|next|vue|angular|svelte" package.json
# Check for component directories
ls -d src/components/ src/pages/ src/views/ app/ 2>/dev/null
```

## Severity by Phase
| Phase | Severity | Reasoning |
|-------|----------|-----------|
| 0-1 | HIGH | Core idea not proven — any UI is premature |
| 2-3 | HIGH | Variation and automation need API focus |
| 4 | MEDIUM | Quality phase — thin orchestration still preferred |
| 5+ | LOW | May be appropriate for complex interactions |

## What to Do Instead
- **n8n forms**: Free, hosted, webhook-triggered
- **Retool**: Drag-and-drop internal tools
- **HTML forms**: Single-page, no framework, POSTs to API
- **curl**: For testing during development

## The Test
Ask: "If I delete all UI code, does the business logic still work?" If yes, the UI is orchestration (good). If no, business logic is in the UI (bad).
