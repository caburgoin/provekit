/**
 * ProveKit PoC API Server Template
 *
 * A single-file, zero-dependency HTTP API server.
 * Uses only Node.js built-in modules.
 *
 * Start: node api/server.js
 * Port: process.env.PORT || 4010
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 4010;

// ─── Helpers ────────────────────────────────────────────

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function respond(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data, null, 2));
}

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// ─── Route Handlers ─────────────────────────────────────

async function handleHealth(req, res) {
  respond(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

async function handleListPlugins(req, res) {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  try {
    const dirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const config = loadJSON(path.join(pluginsDir, d.name, 'plugin.json'));
        return config ? { id: d.name, ...config } : { id: d.name };
      });
    respond(res, { plugins: dirs });
  } catch (e) {
    respond(res, { plugins: [] });
  }
}

async function handleListClients(req, res) {
  const clientsDir = path.join(__dirname, '..', 'clients');
  try {
    const files = fs.readdirSync(clientsDir).filter(f => f.endsWith('.json'));
    const clients = files.map(f => loadJSON(path.join(clientsDir, f))).filter(Boolean);
    respond(res, { clients });
  } catch (e) {
    respond(res, { clients: [] });
  }
}

// ─── Add your route handlers above ─────────────────────
// Example:
// async function handleGenerate(req, res) {
//   const body = await parseBody(req);
//   const { plugin, topic } = body;
//   // Your business logic here
//   respond(res, { result: '...' });
// }

// ─── Route Table ────────────────────────────────────────

const routes = {
  'GET /api/health': handleHealth,
  'GET /api/plugins': handleListPlugins,
  'GET /api/clients': handleListClients,
  // Add routes here:
  // 'POST /api/generate': handleGenerate,
};

// ─── Server ─────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const parsed = url.parse(req.url, true);
  const key = `${req.method} ${parsed.pathname}`;
  const handler = routes[key];

  if (handler) {
    try {
      await handler(req, res, parsed);
    } catch (err) {
      console.error(`Error in ${key}:`, err);
      respond(res, { error: err.message }, 500);
    }
  } else {
    respond(res, { error: `Not found: ${key}` }, 404);
  }
});

server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Routes: ${Object.keys(routes).join(', ')}`);
});
