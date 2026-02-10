# P8: Iterative Quality Uplift

## Summary
Each phase builds on previous work without rewriting. New features are additive — extending schemas, adding optional fields, creating new layers. No "start from scratch" rewrites.

## The Principle
```
Phase 0: Static template → produces basic output
Phase 1: + Plugin config → same code, multiple tenants
Phase 2: + Content library → same code, varied output
Phase 3: + n8n forms → same code, non-dev accessible
Phase 4: + Lottie animations → same renderer, higher quality
Phase 5: + Creative Director → same pipeline, intelligent decisions
Phase 6: + All together → same architecture, unique outputs
```

At no point was the Phase 0 code deleted. It was extended, wrapped, and enhanced.

## Anti-Pattern: The Rewrite Trap
```
"This code is messy, let me rewrite it from scratch"
→ Lose all edge cases discovered through iteration
→ Lose all fallback chains added for backward compatibility
→ Spend 2 weeks recreating what took 2 months
→ New code has NEW bugs that old code already fixed
```

## How to Uplift Without Rewriting
1. **Add fields, don't rename them**: `hookConfig` stays `hookConfig` forever
2. **Use fallback chains**: New field absent? Fall through to old behavior
3. **Extend, don't replace**: New component wraps old component
4. **Optional layers**: New features are opt-in via config

## Phase Relevance
- **All phases**: Every phase extends the previous, never replaces
