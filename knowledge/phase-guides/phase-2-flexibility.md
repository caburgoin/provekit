# Phase 2: Flexibility

## Question
**"Can output vary without code changes?"**

## Goal
Prove that the system can produce visually/structurally distinct outputs by changing configuration only — no code changes required.

## Evidence Required to Advance
- Same endpoint produces visually distinct outputs via config
- 2+ content library entries per plugin
- LLM generates varied output from different inputs
- Fallback chains handle missing optional fields

## What to Build
- Content library with few-shot examples
- LLM prompt templates
- Fallback chains for optional fields
- Multiple format configurations per plugin

## What NOT to Build
- User-facing forms (Phase 3)
- Professional-quality assets (Phase 4)
- Creative AI decisions (Phase 5)

## Patterns to Follow
- P3: Content Library as Few-Shot Learning — examples teach LLM
- P5: Fallback Chains — optional fields degrade gracefully
- P6: Pipeline Staleness Prevention — start tracking layers

## Anti-Patterns to Avoid
- A4: Stale Content Library — keep examples current
- A5: Missing Fallback — every optional field needs `??`
- A6: Hardcoded Creativity — acceptable at this phase but note it

## Example (from Remotion PoC)
Phase 2 added `plugins/legal/content-library/` with 5 topic examples. The prompt template injected these as few-shot examples. Calling `/api/storyboard/generate` with different topics produced different storyboards — different text, structure, and emphasis — without any code changes.

## Duration
Typically 5-7 days.

## Advancement Checklist
- [ ] Same endpoint, different inputs → different outputs
- [ ] 2+ content library entries per plugin
- [ ] LLM prompt template with few-shot examples
- [ ] Optional fields have fallback chains
