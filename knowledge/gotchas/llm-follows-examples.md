# Gotcha: LLM Follows Examples Over Instructions

## The Problem
When you give an LLM both instructions ("include field X") and examples (which don't have field X), the LLM follows the examples.

## Why This Happens
- Few-shot examples are the strongest signal for output shape
- LLMs pattern-match against examples more than they parse instructions
- 3 examples without field X > 1 paragraph explaining field X

## Real Example
```
Prompt says: "Include creativeDirection object with backgrounds, transitions, colors"
Example 1: { hookConfig: {...}, scenes: [...], ctaConfig: {...} }
Example 2: { hookConfig: {...}, scenes: [...], ctaConfig: {...} }
Example 3: { hookConfig: {...}, scenes: [...], ctaConfig: {...} }

Result: Claude generates { hookConfig, scenes, ctaConfig } — NO creativeDirection
```

## Solution
1. Update ALL content library examples to include the new field
2. Run `/provekit.fewshot validate` after every schema change
3. Make sure the majority of examples have the field

## Prevention
After adding a new field to the type system:
```
/provekit.fewshot validate {plugin}   # See what's stale
/provekit.fewshot upgrade {plugin}    # Auto-fix
```
