# P2: Configuration as Code

## Summary
All configuration lives as JSON files on disk, read fresh each request. No database, no .env files for business config, no hardcoded values in source code.

## The Rule
If a value might change between iterations, it's a JSON file. If it might change between clients, it's a JSON file. If it might change between plugins, it's a JSON file.

## Structure
```
plugins/
  legal/
    plugin.json        # Plugin identity, formats, compositions
    defaults.json      # Default values for this plugin
    content-library/   # Few-shot examples (JSON)
    prompts/           # LLM prompt templates (text)
  motion/
    plugin.json
    ...

clients/
  demo-legal.json      # Client branding, contact, preferences
  garcia-abogados.json
```

## Why JSON on Disk (Not Database)
1. **No migration headaches**: Change schema by editing files, not running ALTER TABLE
2. **Git-trackable**: Every config change is in version history
3. **Fresh reads**: `fs.readFileSync` reads current file — no cache invalidation
4. **Zero dependencies**: No database driver, no connection string, no ORM
5. **Copy-paste deployment**: rsync the directory = deploy

## When to Graduate to Database
- When you have 100+ client profiles (file system gets slow)
- When concurrent writes matter (JSON files aren't atomic)
- When you need queries across configs (SQL is better than file scanning)
- **Never before Phase 3** — premature database is Anti-Pattern A2

## Phase Relevance
- **Phase 0-1**: Essential — iterate on schema without migrations
- **Phase 2**: Validates that config-as-code scales to multiple plugins/clients
- **Phase 3+**: Evaluate if you've outgrown files (usually haven't for PoC)
