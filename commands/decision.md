---
description: Record and manage lightweight architecture decision records (ADRs) for PoC pivots and design choices.
argument-hint: <add|list|detail|amend> [title|id] [--context "..."] [--options "..."] [--rationale "..."]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Architecture Decision Records (ADRs) capture the "why" behind key technical choices. In a PoC context, decisions happen fast and often — pivoting from SVG to Lottie, choosing JSON-on-disk over a database, replacing conditionals with LLM calls. Without recording these decisions, the context is lost when handing off to a production team.

ProveKit's ADRs are lighter weight than traditional ADRs — focused on PoC-specific pivot decisions.

## Subcommands

### `add "title"` — Record a new decision

**Interactive process:**
1. Ask for (or accept from flags):
   - **Context**: What situation led to this decision? What problem were you solving?
   - **Options Considered**: What alternatives did you evaluate? (at least 2)
   - **Decision**: Which option was chosen?
   - **Rationale**: Why this option over the others?
   - **Consequences**: What are the known tradeoffs?
   - **Phase**: Which phase was this decision made in?

2. Generate decision record:
```json
{
  "id": "ADR-001",
  "title": "Use Lottie animations instead of SVG primitives",
  "status": "accepted",
  "date": "2025-02-09",
  "phase": 4,
  "context": "SVG primitives (circles, rects, paths) animated with basic behaviors have a quality ceiling below motion-graphics-studio quality. The 5 named presets get recycled across all videos.",
  "options": [
    {
      "name": "Enhanced SVG Factory",
      "description": "Add more primitives, behaviors, and presets to the SVG factory",
      "pros": ["No new dependencies", "Existing code stays"],
      "cons": ["Quality ceiling remains", "Still looks procedural"]
    },
    {
      "name": "Lottie Animations (chosen)",
      "description": "Use professional Lottie animations from LottieFiles for hero visuals, keep SVG for backgrounds",
      "pros": ["Professional quality", "Huge asset library", "Industry standard"],
      "cons": ["New dependency (lottie-web)", "Need asset management", "File size"]
    },
    {
      "name": "After Effects renders",
      "description": "Pre-render animation sequences in After Effects",
      "pros": ["Maximum quality"],
      "cons": ["Not parameterizable", "Huge files", "Manual pipeline"]
    }
  ],
  "decision": "Lottie Animations",
  "rationale": "Lottie provides professional-quality animations that are parameterizable (color theming), lightweight, and have a massive free library. SVG factory retained for backgrounds, creating a hybrid model.",
  "consequences": [
    "Need asset catalog management (catalog.json)",
    "Need theming pipeline (lottie-colorify)",
    "Need LLM-driven assignment (match topics to animations)",
    "SVG factory not deleted — dual-mode ScaledPreset component"
  ],
  "relatedCapabilities": ["lottie-pipeline", "creative-direction"],
  "relatedFiles": [
    "src/components/LottieAsset.tsx",
    "api/storyboard/lottie-registry.js",
    "api/storyboard/lottie-factory.js",
    "public/lottie/catalog.json"
  ]
}
```

3. Save to `.provekit/decisions/ADR-{NNN}.json`

### `list` — Show all decisions

```
Architecture Decisions:
  ID       Phase  Date        Title
  ───────────────────────────────────────────────
  ADR-001  0      2025-01-30  Use Remotion for video generation
  ADR-002  1      2025-02-01  Plugin architecture for multi-tenant
  ADR-003  2      2025-02-05  Content library for few-shot learning
  ADR-004  4      2025-02-09  Use Lottie instead of SVG primitives
  ADR-005  5      2025-02-09  LLM-driven creative direction

  5 decisions recorded across phases 0-5
```

### `detail {id}` — Show full decision

Display the complete ADR with all fields, formatted for readability.

### `amend {id}` — Update a decision

Add new information to an existing decision without changing the original:
- Add consequences discovered after the decision
- Update status (accepted → superseded, deprecated)
- Link related capabilities or files discovered later

Amendments are appended, not replaced:
```json
{
  "amendments": [
    {
      "date": "2025-02-10",
      "note": "Added LLM-driven assignment (Phase 5) — now using Haiku for semantic matching instead of keyword lookup",
      "addedConsequences": ["LLM cost per compilation (~$0.001)"],
      "addedFiles": ["api/storyboard/lottie-registry.js"]
    }
  ]
}
```

## ADR Numbering

- Sequential: ADR-001, ADR-002, etc.
- Never reuse numbers (even if a decision is superseded)
- Superseded decisions keep their number with `status: "superseded"` and a `supersededBy` field

## Integration Points

- **`/provekit.handoff`**: All ADRs included in handoff package
- **`/provekit.phase`**: ADRs tagged with the phase they were made in
- **`/provekit.capability`**: ADRs linked to affected capabilities

## Important Notes

- ADRs are lightweight — don't overthink them. 5 minutes to record is better than 5 hours to reconstruct later.
- The most important field is **rationale** — the "why" is what future teams need.
- Options should include at least 2 alternatives (even if the choice was obvious).
- ADRs for pivots (changing direction) are MORE valuable than ADRs for initial choices.
- Store one JSON file per decision for easy diffing and handoff.
