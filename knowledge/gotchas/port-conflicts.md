# Gotcha: Port Conflicts

## The Problem
Multiple services compete for the same port, causing "EADDRINUSE" errors.

## Common Ports in ProveKit Projects
| Port | Service | Notes |
|------|---------|-------|
| 4010 | API server | Default for ProveKit projects |
| 5678 | n8n | Workflow automation UI |
| 3000 | Remotion preview | If using Remotion |
| 3001 | Dev tools | Various |

## Symptoms
```
Error: listen EADDRINUSE: address already in use :::4010
```

## Solution
```bash
# Find what's using the port
lsof -i :4010 | grep LISTEN

# Kill it
kill <PID>

# Or force kill
kill -9 <PID>
```

## Prevention
- Always use environment variables for ports: `process.env.PORT || 4010`
- Check port availability before starting: `lsof -i :4010`
- Use different ports for different projects
