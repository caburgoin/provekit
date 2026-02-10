# Phase 0: Feasibility

## Question
**"Can the tech produce output?"**

## Goal
Prove that your chosen technology stack can produce the target output format. Don't worry about quality, variation, or architecture — just get SOMETHING working.

## Evidence Required to Advance
- 3+ outputs matching the target format (e.g., 3 videos, 3 PDFs, 3 images)
- 1+ capability at Level 1 (PROTOTYPE)
- Output opens/plays/renders correctly

## What to Build
- Hardcoded script that produces output
- Minimal configuration (inline values are fine)
- Single input → single output

## What NOT to Build
- Plugin architecture (Phase 1)
- Content library (Phase 2)
- User-facing forms (Phase 3)
- Quality improvements (Phase 4)
- LLM integration (Phase 5)

## Patterns to Follow
- None strictly required — just make it work

## Anti-Patterns to Avoid
- A1: Premature UI — no React/Vue
- A2: Database — no SQL/ORM
- A3: Framework Overhead — use Node http or even just scripts

## Example (from Remotion PoC)
Phase 0 was a single Remotion composition with hardcoded text, colors, and timing. `npm run build` produced a 1080x1920 MP4. That's it — feasibility proven.

## Duration
Typically 1-3 days. If it takes longer, the technology choice may be wrong.

## Advancement Checklist
- [ ] 3+ outputs produced
- [ ] Outputs match target format (resolution, codec, etc.)
- [ ] At least 1 capability registered and at Level 1
- [ ] No showstopper technical blockers discovered
