# A7: Tier Skipping

## What It Is
Running API tests (Tier 2) or E2E tests (Tier 3) without first proving that the underlying modules work at the script level (Tier 1).

## Why It's Dangerous
When a Tier 2 test fails, you don't know if the bug is in:
- The HTTP route handler
- The request parsing
- The business logic module
- The response serialization

If Tier 1 passed, you know the module works — the bug is in the API layer.

## Detection
- Tier 2 test evidence exists but no Tier 1 for the same module
- curl commands in history but no `node -e` commands

## Fix
Run `/provekit.test tier1 {module}` before `/provekit.test tier2 {endpoint}`
