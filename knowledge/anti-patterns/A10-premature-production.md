# A10: Premature Production Concerns

## What It Is
Adding authentication, rate limiting, HTTPS, helmet.js, CORS libraries, logging frameworks, monitoring, or CI/CD before Phase 5.

## Why It's Premature
These are important for production — but they slow down PoC iteration:
- Auth adds friction to every API test
- Rate limiting blocks rapid testing
- HTTPS requires certificate management
- Logging frameworks add dependencies

## Detection
```bash
grep -E "helmet|passport|jsonwebtoken|rate-limit|cors|winston|pino|morgan" package.json
ls .github/workflows/ Dockerfile docker-compose.yml 2>/dev/null
```

## When to Add
- Phase 5+: After business logic is proven and stable
- Handoff: SpecKit handles production concerns properly

## Exception
Basic CORS headers (3 lines in server.js) are acceptable at any phase — they're needed for browser testing.
