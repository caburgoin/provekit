# Gotcha: Node.js Module Cache

## The Problem
Node.js caches `require()` results. When you edit a JS file and hit the API endpoint, the server still uses the OLD version of the module.

## Symptoms
- "I changed the code but the API still returns old results"
- "My fix works in Tier 1 (script-level) but not Tier 2 (API-level)"
- "The console.log I added doesn't appear in server output"

## Solution
Restart the API server:
```bash
# Find the process
lsof -i :4010 | grep LISTEN

# Kill it
kill <PID>

# Restart
npm start
# or
node api/server.js
```

## What's NOT Cached
- `fs.readFileSync` results — read fresh every call
- Prompt templates (if loaded via fs, not require)
- JSON files loaded via fs.readFileSync + JSON.parse
- Content library examples (if loaded via fs)

## ProveKit Convention
- JS modules that change logic → require server restart
- JSON config files → read fresh, no restart
- Prompt template files → read fresh, no restart
- Content library JSON → read fresh, no restart

This is why ProveKit prefers "Configuration as Code" (P2) — config changes don't need restarts.
