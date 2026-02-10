# ProveKit

**"Prove it works. Then build it right."**

A Claude Code plugin for backend-first PoC iteration. ProveKit helps teams iterate heavily on backend/business logic with thin orchestration, prove the idea at production-grade output quality, and only then consider building a full app.

ProveKit is the step BEFORE [SpecKit](https://github.com/caburgoin/specKitPulso) in the development lifecycle: you **prove** the idea works, then SpecKit helps you **build** it right.

## The Problem

Teams jump to full-stack development too early, spending 70%+ effort on UI, auth, state management, and deployment --- only to discover the core idea needs pivoting, causing rework across all layers.

## The Solution

ProveKit enforces a backend-first methodology with 7 phases, 10 patterns, and 6 maturity levels. It tracks what you've proven, detects when your pipeline is stale, and tells you when you're ready to hand off to production development.

---

## Architecture (4+1 Views)

### Scenarios View (+1): User Journey

The central use case that ties all views together --- a team taking an idea from concept to production handoff.

```mermaid
journey
    title ProveKit User Journey
    section Phase 0-1: Prove Feasibility
      Scaffold project: 5: Developer
      Build thick backend: 4: Developer
      Run script tests: 4: Developer, Agent
      Register capabilities: 3: Developer
    section Phase 2-3: Prove Flexibility
      Add content library: 4: Developer
      Detect pipeline staleness: 5: Agent
      Test via API: 4: Developer, Agent
      Add thin orchestration: 3: Developer
    section Phase 4-5: Prove Quality
      Integrate pro assets: 4: Developer
      Add LLM decisions: 5: Developer, Agent
      Stakeholder review: 3: Stakeholder
    section Phase 6: Prove Variety
      Generate 10 outputs: 5: Agent
      Pattern audit: 4: Agent
      Handoff to SpecKit: 5: Developer, Agent
```

### Logical View: Domain Model

The key abstractions and their relationships --- how ProveKit models a PoC project.

```mermaid
classDiagram
    class Project {
        +String name
        +PhaseState phases
        +CapabilityMap capabilities
        +PipelineManifest pipelines
        +Decision[] decisions
    }

    class PhaseState {
        +Int currentPhase
        +Phase[7] phases
        +HistoryEntry[] history
        +advance()
        +revisit(n)
    }

    class Phase {
        +Int number
        +String name
        +String question
        +String status
        +Evidence[] evidence
    }

    class CapabilityMap {
        +Capability[] capabilities
        +Float overallScore
        +Boolean handoffReady
        +add(name)
        +prove(name, tier)
    }

    class Capability {
        +String name
        +Int level
        +Boolean core
        +Evidence[] evidence
    }

    class PipelineManifest {
        +Pipeline[] pipelines
        +register(name)
        +check()
        +fix()
    }

    class Pipeline {
        +String name
        +Layer[8] layers
        +String status
    }

    class ContentLibrary {
        +Example[] examples
        +validate()
        +upgrade()
    }

    class Decision {
        +String id
        +String title
        +Option[] options
        +String rationale
        +Amendment[] amendments
    }

    Project "1" --> "1" PhaseState
    Project "1" --> "1" CapabilityMap
    Project "1" --> "1" PipelineManifest
    Project "1" --> "*" Decision
    PhaseState "1" --> "7" Phase
    Phase "1" --> "*" Capability : evidence feeds
    CapabilityMap "1" --> "*" Capability
    PipelineManifest "1" --> "*" Pipeline
    Pipeline "1" --> "1" ContentLibrary : layer 4
```

### Process View: Command Workflows

Runtime behavior --- how the 9 commands interact and what triggers what.

```mermaid
flowchart TB
    subgraph Init["Scaffold Phase"]
        init["/provekit.init"]
    end

    subgraph Track["Tracking Phase"]
        phase["/provekit.phase"]
        cap["/provekit.capability"]
        decision["/provekit.decision"]
    end

    subgraph Validate["Validation Phase"]
        test["/provekit.test"]
        pipeline["/provekit.pipeline"]
        fewshot["/provekit.fewshot"]
    end

    subgraph Assess["Assessment Phase"]
        pattern["/provekit.pattern"]
        handoff["/provekit.handoff"]
    end

    subgraph External["External Systems"]
        speckit["SpecKit"]
    end

    init -->|creates .provekit/| phase
    init -->|creates .provekit/| cap

    cap -->|maturity feeds| phase
    test -->|evidence feeds| cap
    test -->|evidence feeds| phase

    pipeline -->|staleness feeds| pattern
    fewshot -->|validates| pipeline

    test -->|tier1 before tier2| test
    pipeline -->|check before fix| pipeline

    pattern -->|delegates P6/A8| pipeline
    pattern -->|delegates P3/A4| fewshot
    pattern -->|delegates P7/A7| test

    handoff -->|scores from| cap
    handoff -->|scores from| pattern
    handoff -->|checks| pipeline
    handoff -->|checks| fewshot
    handoff -->|generates package| speckit

    style init fill:#4a9eff,color:#fff
    style handoff fill:#48bb78,color:#fff
    style speckit fill:#9f7aea,color:#fff
```

### Development View: Module Organization

Static structure of the plugin --- directories, files, and their responsibilities.

```mermaid
flowchart TB
    subgraph root["ProveKit Plugin (55 files, 280K)"]
        pjson["plugin.json"]
        claude["CLAUDE.md"]
        readme2["README.md"]
    end

    subgraph commands["commands/ --- 9 slash commands"]
        wave1["Wave 1: init, phase, capability"]
        wave2["Wave 2: pipeline, test, fewshot"]
        wave3["Wave 3: pattern, handoff, decision"]
    end

    subgraph agents["agents/ --- 5 specialized agents"]
        scout["phase-scout\n(Haiku)"]
        inspector["pipeline-inspector\n(Sonnet)"]
        prover["capability-prover\n(Sonnet)"]
        auditor["fallback-auditor\n(Sonnet)"]
        preparer["handoff-preparer\n(Opus x3)"]
    end

    subgraph knowledge["knowledge/ --- 35 reference files"]
        patterns["patterns/ (10)"]
        antipatterns["anti-patterns/ (10)"]
        guides["phase-guides/ (7)"]
        checklists["checklists/ (3)"]
        gotchas["gotchas/ (5)"]
    end

    subgraph templates["templates/ --- 4 scaffolding files"]
        tpl["api-server.js\nplugin.json\ndefaults.json\nclient.json"]
    end

    root --- commands
    root --- agents
    root --- knowledge
    root --- templates

    style root fill:#1a365d,color:#fff
    style commands fill:#2b6cb0,color:#fff
    style agents fill:#2c7a7b,color:#fff
    style knowledge fill:#744210,color:#fff
    style templates fill:#553c9a,color:#fff
```

### Physical View: Deployment Topology

How ProveKit fits into the developer's environment and the tools it orchestrates.

```mermaid
flowchart LR
    subgraph DevMachine["Developer Machine"]
        subgraph ClaudeCode["Claude Code CLI"]
            provekit["ProveKit Plugin"]
            speckit2["SpecKit Plugin"]
        end

        subgraph PoCProject["PoC Project (.provekit/)"]
            api["api/server.js\n:4010"]
            plugins["plugins/\n(JSON on disk)"]
            clients["clients/\n(JSON on disk)"]
            state[".provekit/\nphase-state.json\ncapability-map.json\npipeline-manifest.json"]
        end

        subgraph Orchestration["Thin Orchestration"]
            n8n["n8n\n:5678"]
            forms["HTML Forms"]
        end
    end

    subgraph LLMCloud["LLM Services"]
        haiku["Claude Haiku\n(creative decisions)"]
        sonnet["Claude Sonnet\n(agents)"]
    end

    provekit -->|scaffolds| PoCProject
    provekit -->|reads/writes| state
    provekit -->|audits| api
    provekit -->|validates| plugins
    n8n -->|thin calls| api
    forms -->|POST| api
    api -->|creative direction| haiku
    provekit -->|agents run on| sonnet
    provekit -->|handoff package| speckit2

    style provekit fill:#4a9eff,color:#fff
    style state fill:#48bb78,color:#fff
    style haiku fill:#f6ad55,color:#000
    style sonnet fill:#f6ad55,color:#000
```

### Cross-Cutting: Phase Progression Model

The 7-phase journey that spans all views --- from feasibility to handoff.

```mermaid
stateDiagram-v2
    [*] --> Phase0
    Phase0: Phase 0 - Feasibility
    Phase1: Phase 1 - Abstraction
    Phase2: Phase 2 - Flexibility
    Phase3: Phase 3 - Automation
    Phase4: Phase 4 - Quality
    Phase5: Phase 5 - Agency
    Phase6: Phase 6 - Variety
    Handoff: SpecKit Handoff

    Phase0 --> Phase1: 3+ outputs produced
    Phase1 --> Phase2: 2+ plugins, 2+ clients
    Phase2 --> Phase3: Varied output via config
    Phase3 --> Phase4: E2E form-to-delivery
    Phase4 --> Phase5: Stakeholder approves quality
    Phase5 --> Phase6: LLM makes good decisions
    Phase6 --> Handoff: 10+ unique pro outputs

    Phase3 --> Phase1: Revisit abstractions
    Phase5 --> Phase2: Revisit flexibility
    Phase6 --> Phase4: Revisit quality

    note right of Phase0: Can the tech produce output?
    note right of Phase2: Can output vary without code?
    note right of Phase4: Can output match pro quality?
    note right of Phase6: Can every output look unique?
```

### Cross-Cutting: Maturity Levels

How capabilities mature through the three testing tiers.

```mermaid
flowchart LR
    L0["Level 0\nIDEA"]
    L1["Level 1\nPROTOTYPE"]
    L2["Level 2\nSCRIPT-PROVEN"]
    L3["Level 3\nAPI-PROVEN"]
    L4["Level 4\nE2E-PROVEN"]
    L5["Level 5\nPRODUCTION"]

    L0 -->|code exists| L1
    L1 -->|Tier 1 passes| L2
    L2 -->|Tier 2 passes| L3
    L3 -->|Tier 3 passes| L4
    L4 -->|stakeholder validates| L5

    style L0 fill:#a0aec0,color:#000
    style L1 fill:#fc8181,color:#000
    style L2 fill:#f6ad55,color:#000
    style L3 fill:#f6e05e,color:#000
    style L4 fill:#68d391,color:#000
    style L5 fill:#63b3ed,color:#000
```

---

## Commands

| Command | Purpose | Key Actions |
|---------|---------|-------------|
| `/provekit.init` | Scaffold PoC project | Creates api/, plugins/, clients/, .provekit/ |
| `/provekit.phase` | Phase management | status, advance, revisit |
| `/provekit.capability` | Maturity tracking | add, prove, list, detail |
| `/provekit.pipeline` | Staleness detection | check, fix, register, list |
| `/provekit.test` | Three-tier testing | tier1, tier2, tier3, status |
| `/provekit.fewshot` | Content library mgmt | validate, upgrade, add, diff |
| `/provekit.pattern` | Pattern audit | 10 patterns + 10 anti-patterns |
| `/provekit.handoff` | SpecKit readiness | score, check hard reqs, generate package |
| `/provekit.decision` | Architecture decisions | add, list, detail, amend |

## Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| Phase Scout | Haiku | Recommends next iteration phase |
| Pipeline Inspector | Sonnet | Deep cross-layer staleness analysis |
| Capability Prover | Sonnet | Automated evidence gathering |
| Fallback Auditor | Sonnet | Backward compatibility verification |
| Handoff Preparer | Opus x3 | Multi-perspective readiness assessment |

## Knowledge Base

- **10 Patterns**: Thin Orchestration, Config-as-Code, Few-Shot Learning, LLM-Driven Decisions, Fallback Chains, Pipeline Staleness Prevention, Three-Tier Testing, Iterative Uplift, Separation of Concerns, Asset Pipeline
- **10 Anti-Patterns**: Premature UI, Database Before Validation, Framework Overhead, Stale Content Library, Missing Fallbacks, Hardcoded Creativity, Tier Skipping, Pipeline Staleness, Logic in Orchestration, Premature Production
- **7 Phase Guides**: One per phase with evidence criteria, what to build/avoid, and Remotion PoC examples
- **3 Checklists**: Schema change, pipeline staleness, handoff readiness
- **5 Gotchas**: Node module cache, LLM follows examples, n8n stuck executions, port conflicts, JSON parse errors

## Origin

ProveKit was extracted from the [Remotion PoC](https://github.com/caburgoin/remotion-poc) project, which demonstrated the methodology over 6+ phases: from static video templates to LLM-driven creative direction producing unique, professional-quality videos --- all without writing a single line of frontend code.

## License

MIT
