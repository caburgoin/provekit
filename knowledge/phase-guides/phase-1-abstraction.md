# Phase 1: Abstraction

## Question
**"Can it serve multiple tenants?"**

## Goal
Extract hardcoded values into configuration. Prove that the same code can produce output for different clients/plugins/formats.

## Evidence Required to Advance
- 2+ plugins registered with distinct configurations
- 2+ client profiles with different branding
- 3+ API endpoints working
- Same code serves both plugins/clients

## What to Build
- Plugin directory structure (`plugins/{name}/plugin.json`)
- Client profile directory (`clients/{name}.json`)
- API server with basic CRUD for plugins and clients
- Parameterized output (colors, text, branding from config)

## What NOT to Build
- Content library (Phase 2)
- LLM-generated content (Phase 2+)
- User-facing forms (Phase 3)
- Quality assets (Phase 4)

## Patterns to Follow
- P2: Configuration as Code — JSON files on disk
- P1: Thin Orchestration — API server handles everything

## Anti-Patterns to Avoid
- A2: Database — use JSON files, not SQL
- A3: Framework — Node http module suffices for 3-5 endpoints

## Example (from Remotion PoC)
Phase 1 created `plugins/legal/plugin.json` and `plugins/motion/plugin.json`, each with different formats, compositions, and default values. `clients/demo-legal.json` and `clients/garcia-abogados.json` had different brand colors. The same `api/server.js` served both.

## Duration
Typically 3-5 days.

## Advancement Checklist
- [ ] 2+ plugins with distinct configurations
- [ ] 2+ client profiles
- [ ] 3+ API endpoints (health, list plugins, list clients minimum)
- [ ] Outputs parameterized by plugin and client config
