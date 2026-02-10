# P9: Separation of Concerns (LLM / Compiler / Renderer)

## Summary
Three distinct layers with clear boundaries: the LLM DECIDES (creative), the Compiler TRANSLATES (mechanical), the Renderer PRODUCES (deterministic).

## The Three Layers

### LLM Layer (Creative)
- Receives: topic, client context, content library examples
- Decides: content, structure, creative direction, pacing
- Returns: structured JSON (storyboard)
- **Must NOT**: contain rendering logic, pixel values, or timing calculations

### Compiler Layer (Mechanical)
- Receives: storyboard JSON + creative direction
- Translates: abstract decisions into render-ready props
- Returns: composition props with exact values (pixels, frames, colors)
- **Must NOT**: make creative decisions (no randomness, no subjective choices)

### Renderer Layer (Deterministic)
- Receives: exact props (positions, sizes, colors, timings)
- Produces: final output (video, image, PDF)
- **Must NOT**: parse natural language or make content decisions

## Why This Separation
```
Bug: "The background color doesn't match the topic"
  → Fix in LLM layer (creative direction)
  → NOT in compiler (which just translates colors to hex)
  → NOT in renderer (which just applies hex values)

Bug: "Text is cut off at the bottom"
  → Fix in compiler (spacing calculation)
  → NOT in LLM (which doesn't know pixel values)
  → NOT in renderer (which just places what it's told)
```

## Phase Relevance
- **Phase 0-1**: Often blurred — acceptable during exploration
- **Phase 2+**: Start separating as patterns become clear
- **Phase 5+**: Critical — LLM-driven decisions require clean layer boundaries
