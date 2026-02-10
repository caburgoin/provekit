# Gotcha: JSON Parse Errors from LLM Output

## The Problem
LLMs sometimes return invalid JSON — markdown code fences, trailing commas, comments, or truncated output.

## Common Issues
1. **Markdown fences**: ````json\n{...}\n```` instead of just `{...}`
2. **Trailing commas**: `{ "a": 1, "b": 2, }` — invalid JSON
3. **Comments**: `{ "a": 1 // this is a comment }` — invalid JSON
4. **Truncated**: Response hit token limit, JSON is incomplete
5. **Extra text**: "Here is the JSON:\n{...}\nI hope this helps!"

## Solution
```javascript
function parseJSONFromLLM(text) {
  // Strip markdown fences
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Try to find JSON object/array
  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (jsonMatch) cleaned = jsonMatch[0];

  // Remove trailing commas (common LLM mistake)
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  return JSON.parse(cleaned);
}
```

## Prevention
- Include "Return ONLY valid JSON, no markdown fences" in prompts
- Use response_format: "json" if your LLM API supports it
- Always wrap JSON.parse in try/catch with a retry
