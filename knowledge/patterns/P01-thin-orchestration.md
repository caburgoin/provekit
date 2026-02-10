# P1: Thin Orchestration / Thick Backend

## Summary
All business logic lives in the backend API. The orchestration layer (n8n, Retool, forms) is a thin pass-through that connects user input to API endpoints. No data transformation, validation, or creative logic in the orchestration layer.

## The Rule
If a line of code makes a DECISION about data, it belongs in the API — not in n8n, not in a form handler, not in a webhook processor.

## Good Example
```
n8n Form → POST /api/storyboard/generate (body: {topic, plugin, format})
                    ↓
         API does ALL the work:
         - loads plugin config
         - reads content library
         - calls LLM
         - parses response
         - validates output
                    ↓
n8n receives response → displays to user
```

## Bad Example
```
n8n Form → n8n Code Node:
  // 50 lines of JavaScript
  const plugin = loadPlugin(input.plugin);
  const template = buildPrompt(plugin, input.topic);
  const response = await callLLM(template);
  const parsed = parseStoryboard(response);
  // validation, transformation, etc.
```

## Detection
- n8n Code nodes with > 10 lines of JavaScript
- Orchestration layer importing utility modules
- Form handlers with switch/case logic
- Workflow expressions doing data transformation

## Why This Matters in PoC
During iteration, you change logic constantly. If logic is in the API, you restart one server. If logic is scattered across n8n nodes, form handlers, and API routes, every change touches 3 places.

## Phase Relevance
- **Phase 0-2**: Essential — keeps iteration speed high
- **Phase 3+**: Critical — orchestration layer should be trivially replaceable
