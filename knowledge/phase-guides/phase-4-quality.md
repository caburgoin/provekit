# Phase 4: Quality

## Question
**"Can output match professional quality?"**

## Goal
Upgrade output quality to professional standards. Replace placeholder assets with production-quality assets. Pass a stakeholder blind test.

## Evidence Required to Advance
- Output passes quality bar (stakeholder approval)
- Professional assets integrated (Lottie, images, fonts)
- 3+ capabilities at Level 4+ (E2E-proven)
- Asset pipeline with theming

## What to Build
- Professional asset library (Lottie, images, fonts)
- Asset theming pipeline (per-client variations)
- Quality uplift for existing components
- Post-production effects (color grading, overlays)

## What NOT to Build
- LLM-driven creative decisions (Phase 5)
- Full UI (still use thin orchestration)
- Production deployment concerns

## Patterns to Follow
- P10: Asset Pipeline with Theming — one asset, infinite client variations
- P8: Iterative Quality Uplift — extend, don't rewrite
- P5: Fallback Chains — quality features are optional

## Anti-Patterns to Avoid
- A5: Missing Fallback — every quality feature must be optional
- A4: Stale Content Library — update examples with new quality fields

## Example (from Remotion PoC)
Phase 4 was the Lottie Pivot — replacing SVG primitives with professional Lottie animations. Added 24 Lottie files, theming pipeline (lottie-colorify), and dual-mode rendering (Lottie when available, SVG fallback). Output quality jumped from "prototype" to "could fool a client."

## Duration
Typically 7-14 days (asset sourcing takes time).

## Advancement Checklist
- [ ] Stakeholder approves output quality
- [ ] Professional assets integrated
- [ ] Asset theming works per-client
- [ ] 3+ capabilities at Level 4+
- [ ] All quality features have fallback chains
