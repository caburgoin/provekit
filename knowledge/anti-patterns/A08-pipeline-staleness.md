# A8: Pipeline Staleness

## What It Is
A schema change that wasn't propagated to all pipeline layers. The type definition says one thing, the prompt says another, the examples show a third thing.

## Detection
Run `/provekit.pipeline check`.

## Most Common Scenario
Developer adds a field to types.js, updates the compiler, tests via curl (passes) — but forgets to update content library examples and prompt template. Next LLM generation follows old examples.

## Fix
Follow the 8-layer checklist (Pattern P6) for every schema change.
