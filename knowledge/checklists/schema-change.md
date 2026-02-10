# Schema Change Checklist

When you modify a type definition, add a field, or change the shape of any data structure in the pipeline, trace through ALL layers:

## 8-Layer Checklist

- [ ] **1. Types/Constants** — Add/modify field definition in type file
  - File: `api/storyboard/types.js` (or equivalent)
  - Action: Add field with type, optionality, and default value comment

- [ ] **2. Route Handlers** — Pass new field through API routes
  - File: `api/server.js` (or equivalent)
  - Action: Ensure handler destructures and forwards new field
  - **Requires server restart** after change

- [ ] **3. Prompt Templates** — Teach LLM about the field
  - File: `plugins/*/prompts/storyboard-generate.txt` (or equivalent)
  - Action: Add field to output schema description in prompt
  - Read fresh from disk — no restart needed

- [ ] **4. Content Library** — Update ALL few-shot examples
  - Files: `plugins/*/content-library/*.json`
  - Action: Add field with realistic values to EVERY example
  - Run: `/provekit.fewshot validate` then `/provekit.fewshot upgrade`
  - **This is the most commonly missed layer**

- [ ] **5. Compilers** — Read field with fallback chain
  - File: `api/storyboard/compilers/*.js` (or equivalent)
  - Action: Read field with `??` fallback: `field ?? default`
  - **Requires server restart** after change

- [ ] **6. Preview/UI** — Display field if user-visible
  - File: Preview handler or UI component
  - Action: Render new field in preview output
  - Skip if field is internal-only

- [ ] **7. Edit Prompts** — Preserve field on edits
  - File: `plugins/*/prompts/storyboard-edit.txt` (or equivalent)
  - Action: Tell edit prompt to preserve the new field
  - Read fresh from disk — no restart needed

- [ ] **8. Server Restart** — Clear Node module cache
  - Action: Kill process on API port, re-launch
  - Required whenever JS files change (layers 1, 2, 5)

## Quick Validation

After completing all 8 steps:
```bash
# Tier 1: Module still works?
node -e "require('./api/storyboard/types.js')"

# Tier 2: API returns new field?
curl -s localhost:4010/api/storyboard/generate -X POST \
  -H 'Content-Type: application/json' \
  -d '{"plugin":"default","topic":"test"}' | jq '.newField'

# Pipeline check
/provekit.pipeline check
```

## Common Mistakes

1. **Updating 3 of 5 examples** — Must update ALL or LLM follows the majority
2. **Forgetting server restart** — Old module cache serves stale code
3. **No fallback in compiler** — Crashes on old data without the new field
4. **Edit prompt doesn't preserve** — Edits strip the new field
