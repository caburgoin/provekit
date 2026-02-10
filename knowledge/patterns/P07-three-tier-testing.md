# P7: Three-Tier Testing

## Summary
Test bottom-up: scripts first, then API, then end-to-end. Never test at a higher tier without proving the lower tier. This prevents the most common PoC debugging trap: testing the API when the bug is in the module.

## The Three Tiers

### Tier 1: Script-Level (Agent-Driven)
- Run the module directly with `node`
- No server needed
- Validate output JSON schema
- Test edge cases and error handling
```bash
node -e "const c = require('./api/storyboard/compilers/legal-short-v2.js'); c.compile(testData).then(r => console.log(JSON.stringify(r, null, 2)))"
```

### Tier 2: API-Level (Agent-Driven)
- curl against running server
- Validate status codes, content-type, response body
- Test error cases (bad input, missing fields)
```bash
curl -s -X POST localhost:4010/api/storyboard/generate \
  -H 'Content-Type: application/json' \
  -d '{"plugin":"legal","format":"reel-educativo","topic":"test"}'
```

### Tier 3: UI-Level (User-Driven)
- End-to-end through n8n/Retool/form
- User executes, agent guides
- Verify final output (download, preview, delivery)

## Why Order Matters
```
Bug: Compiler doesn't handle optional field

If you test Tier 3 first:
  Form → API → Compiler → [crash]
  Debug: Is it the form? The API? The route? The compiler? The prompt?
  Time: 30+ minutes to isolate

If you test Tier 1 first:
  node compiler.js → [crash]
  Debug: It's the compiler, line 145, missing fallback
  Time: 2 minutes to isolate
```

## Phase Relevance
- **All phases**: Always test bottom-up
