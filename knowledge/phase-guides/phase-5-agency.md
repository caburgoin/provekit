# Phase 5: Agency

## Question
**"Can the system make decisions?"**

## Goal
Replace hardcoded creative decisions with LLM-driven decisions. The system should choose styles, layouts, colors, and pacing contextually — not from a lookup table.

## Evidence Required to Advance
- LLM makes contextually appropriate creative decisions
- Decisions vary with context (different topics → different styles)
- Decisions respect client branding constraints
- System works without human creative direction

## What to Build
- Creative Director module (single LLM call for all creative decisions)
- Decision schema (what the LLM decides vs. what's fixed)
- Prompt engineering for consistent, appropriate decisions
- Constraint system (brand guidelines the LLM must follow)

## What NOT to Build
- Full AI autonomy (LLM should have guardrails)
- Self-modifying prompts
- Production auth/deployment

## Patterns to Follow
- P4: LLM-Driven Decisions — one Haiku call replaces 50 conditionals
- P9: Separation of Concerns — LLM decides, compiler translates
- P3: Few-Shot Learning — examples guide LLM decisions

## Anti-Patterns to Avoid
- A6: Hardcoded Creativity — this is the phase to eliminate it
- A4: Stale Content Library — examples must show creative direction fields

## Example (from Remotion PoC)
Phase 5 added `api/storyboard/creative-director.js` — a single Haiku call that decides backgrounds, transitions, typography, color palette, animation easing, post-production effects, and accent overlays. One call, 12 creative properties, contextually appropriate every time.

## Duration
Typically 5-7 days.

## Advancement Checklist
- [ ] LLM makes varied, contextually appropriate decisions
- [ ] Decisions respect client branding
- [ ] Creative direction integrated into compilation pipeline
- [ ] Examples demonstrate creative direction output
