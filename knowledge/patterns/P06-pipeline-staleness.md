# P6: Pipeline Staleness Prevention

## Summary
When you change a type definition, you must trace the change through ALL pipeline layers. A schema change is NOT done until every layer reflects it.

## The 8-Layer Checklist

| # | Layer | Action | Restart? |
|---|-------|--------|----------|
| 1 | Types/Constants | Add/modify field definition | — |
| 2 | Route Handlers | Pass field through to downstream | Server restart |
| 3 | Prompt Templates | Teach LLM about the field | No (read fresh) |
| 4 | Content Library | Update ALL examples with the field | No (read fresh) |
| 5 | Compilers | Read field with fallback chain | Server restart |
| 6 | Preview/UI | Display field if visible | Depends |
| 7 | Edit Prompts | Preserve field on edit operations | No (read fresh) |
| 8 | Server Restart | Kill and restart Node process | Yes |

## Most Common Staleness Bug
Layer 4 (Content Library) is updated for 2 of 5 examples. The LLM sees 3 examples WITHOUT the new field and 2 WITH it. Result: LLM follows the majority (old format) 60% of the time.

**Fix**: `/provekit.fewshot upgrade` to update all examples.

## Detection
Run `/provekit.pipeline check` after any schema change.

## Phase Relevance
- **Phase 0**: Not relevant (single pipeline, rarely changes)
- **Phase 1+**: Becomes critical as schema evolves rapidly
- **Phase 4+**: Most dangerous — quality features add many optional fields
