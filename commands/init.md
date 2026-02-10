---
description: Scaffold a new backend-first PoC project with thick-backend structure, plugin architecture, and ProveKit state tracking.
argument-hint: <project-name> [--dir PATH]
---

## User Input
```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

Scaffolds a new PoC project following ProveKit's backend-first methodology. Creates a thick-backend project structure optimized for rapid iteration without premature UI, database, or framework decisions.

**What it creates:**
- `api/server.js` — Single-file HTTP API server (Node http module, zero frameworks)
- `plugins/{default}/` — Plugin directory with content-library + prompts
- `clients/demo.json` — Example client profile
- `output/` — Render/build output directory
- `.provekit/phase-state.json` — Phase tracking (starts at Phase 0)
- `.provekit/capability-map.json` — Capability maturity tracking (empty)
- `.provekit/pipeline-manifest.json` — Pipeline layer registry (empty)

**What it does NOT create:**
- React/Next.js/Vue app (Anti-pattern #1: Premature UI)
- Database schema or ORM config (Anti-pattern #2: Database Before Validation)
- Express/Fastify/Koa setup (Anti-pattern #3: Framework Overhead)
- Auth/rate-limiting/HTTPS config (Anti-pattern #10: Premature Production Concerns)
- Deployment config (Docker, CI/CD, Vercel)

## Process

### Step 1: Determine Project Location

1. If `--dir PATH` is provided, use that directory
2. If `<project-name>` is provided, create `./project-name/`
3. If neither, ask user for project name

### Step 2: Create Directory Structure

```
{project-name}/
├── api/
│   └── server.js              # Single-file API server
├── plugins/
│   └── default/
│       ├── plugin.json        # Plugin config
│       ├── defaults.json      # Default values
│       ├── content-library/   # Few-shot examples
│       └── prompts/           # LLM prompt templates
├── clients/
│   └── demo.json              # Example client profile
├── output/                    # Render/build outputs
├── .provekit/
│   ├── phase-state.json       # Phase 0, no evidence
│   ├── capability-map.json    # Empty capabilities
│   ├── pipeline-manifest.json # Empty pipelines
│   └── decisions/             # ADR directory
└── package.json               # Minimal: name + start script
```

### Step 3: Generate Files from Templates

Use ProveKit templates at `{plugin-root}/templates/` to generate:

1. **api/server.js** — HTTP server skeleton with:
   - `http.createServer` (no Express)
   - JSON body parser helper
   - CORS headers helper
   - Route table pattern (object mapping paths to handlers)
   - Example `/api/health` endpoint
   - Port from `process.env.PORT || 4010`

2. **plugins/default/plugin.json** — Plugin config with:
   - `name`, `description`, `version`
   - Empty `formats` array
   - Empty `compositions` object

3. **plugins/default/defaults.json** — Default values:
   - Placeholder structure for format defaults

4. **clients/demo.json** — Demo client:
   - `id: "demo"`, `name: "Demo Client"`
   - `brandColor`, `accentColor` placeholders
   - `contact` placeholder

5. **.provekit/phase-state.json**:
   ```json
   {
     "currentPhase": 0,
     "phases": {
       "0": { "name": "Feasibility", "status": "active", "question": "Can the tech produce output?", "evidence": [], "startedAt": "<now>" },
       "1": { "name": "Abstraction", "status": "pending", "question": "Can it serve multiple tenants?", "evidence": [] },
       "2": { "name": "Flexibility", "status": "pending", "question": "Can output vary without code changes?", "evidence": [] },
       "3": { "name": "Automation", "status": "pending", "question": "Can non-developers use it?", "evidence": [] },
       "4": { "name": "Quality", "status": "pending", "question": "Can output match professional quality?", "evidence": [] },
       "5": { "name": "Agency", "status": "pending", "question": "Can the system make decisions?", "evidence": [] },
       "6": { "name": "Variety", "status": "pending", "question": "Can every output look unique?", "evidence": [] }
     },
     "history": []
   }
   ```

6. **.provekit/capability-map.json**:
   ```json
   {
     "capabilities": {},
     "metadata": { "createdAt": "<now>", "lastUpdated": "<now>" }
   }
   ```

7. **.provekit/pipeline-manifest.json**:
   ```json
   {
     "pipelines": {},
     "metadata": { "createdAt": "<now>", "lastUpdated": "<now>" }
   }
   ```

8. **package.json**:
   ```json
   {
     "name": "<project-name>",
     "version": "0.1.0",
     "private": true,
     "scripts": {
       "start": "node api/server.js"
     }
   }
   ```

### Step 4: Report

Output summary:
```
ProveKit project scaffolded: {project-name}/

  api/server.js              — Thick backend (0 frameworks, 0 dependencies)
  plugins/default/           — Plugin architecture ready
  clients/demo.json          — Demo client profile
  .provekit/                 — Phase 0: Feasibility (active)

Next steps:
  1. cd {project-name} && npm start
  2. Define your first capability: /provekit.capability add "name"
  3. Build it and prove it: /provekit.test tier1 api/server.js
```

## Important Notes

- If the target directory already exists and contains files, WARN the user and ask for confirmation
- If a `.provekit/` directory already exists, this project was already initialized — offer to reinitialize or abort
- The API server template uses ONLY Node.js built-in modules (http, fs, path, url)
- No `node_modules/` is created — zero dependencies at scaffold time
