# Pipeline Staleness Checklist

Run this checklist when `/provekit.pipeline check` reports issues.

## Triage Order (fix upstream first)

1. **Types/Constants** — Source of truth. If wrong here, everything downstream is wrong.
2. **Route Handlers** — Data flow. If the field isn't forwarded, nothing downstream sees it.
3. **Prompt Templates** — LLM instruction. If the LLM doesn't know about the field, it won't generate it.
4. **Content Library** — Few-shot signal. If examples don't have the field, LLM ignores instructions.
5. **Compilers** — Translation. If compiler doesn't read the field, it's lost.
6. **Preview/UI** — Display. If it's not shown, users can't verify it.
7. **Edit Prompts** — Preservation. If edits strip the field, it's a data loss bug.
8. **Server Restart** — Cache. If running code is stale, tests give false results.

## Per-Layer Fix Actions

### Types stale
- This is rare (types is usually where changes start)
- If detected: your type file may have reverted or a merge conflict

### Routes stale
```javascript
// Before: field not forwarded
const { topic, plugin } = req.body;
// After: field forwarded
const { topic, plugin, newField } = req.body;
```

### Prompts stale
- Open prompt template file
- Add field to the output schema section
- No restart needed (read fresh each request)

### Content Library stale (MOST COMMON)
```bash
/provekit.fewshot validate {plugin}
/provekit.fewshot upgrade {plugin}
```

### Compilers stale
```javascript
// Add fallback chain
const newField = storyboard.newField ?? 'default-value';
```
- Requires server restart

### Preview stale
- Add field to preview template/handler
- May require restart depending on implementation

### Edit Prompts stale
- Open edit prompt template
- Add instruction to preserve the new field

### Restart needed
```bash
# Find and kill server process
lsof -i :4010 | grep LISTEN | awk '{print $2}' | xargs kill
# Restart
npm start
```
