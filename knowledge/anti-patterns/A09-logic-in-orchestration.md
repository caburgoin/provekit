# A9: Business Logic in Orchestration

## What It Is
n8n Code nodes, Retool transformers, or form handlers containing business logic (> 10 lines of JavaScript). The orchestration layer should be a thin pass-through.

## Detection
- n8n Code nodes with > 10 lines
- Workflow expressions with complex logic
- Form handlers importing utility modules

## Why It's Bad
- Can't test without the orchestration tool running
- Can't reuse logic from a different orchestration tool
- Logic is hidden inside a GUI tool instead of version-controlled code

## Fix
Extract logic into API endpoint. Orchestration calls the endpoint.
