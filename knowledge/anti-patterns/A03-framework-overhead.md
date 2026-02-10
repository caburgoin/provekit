# A3: Framework Overhead

## What It Is
Using Express, Fastify, Koa, Hapi, or NestJS during Phase 0-2 when Node's built-in `http` module is sufficient.

## Why It's an Anti-Pattern
- Frameworks add middleware concepts before you need them
- Error handling patterns you don't need yet
- Routing abstractions for 5 endpoints (overkill)
- Dependencies that need updating
- PoC should have ZERO unnecessary dependencies

## Detection
```bash
grep -E "express|fastify|koa|hapi|@nestjs" package.json
```

## What to Do Instead
```javascript
const http = require('http');
const routes = {
  'GET /api/health': (req, res) => respond(res, { status: 'ok' }),
  'POST /api/generate': handleGenerate,
};
http.createServer((req, res) => {
  const key = `${req.method} ${url.parse(req.url).pathname}`;
  const handler = routes[key];
  handler ? handler(req, res) : respond(res, { error: 'Not found' }, 404);
}).listen(4010);
```

## When to Graduate
- 20+ endpoints with shared middleware needs
- Authentication/authorization requirements
- File upload handling
- WebSocket support
- Phase 3+ and API surface is stable
