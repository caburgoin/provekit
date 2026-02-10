# Gotcha: n8n Stuck Executions

## The Problem
If you restart n8n while executions are in a Wait node, those executions stay stuck in "Waiting" state forever.

## Symptoms
- Old executions show "Waiting" in the executions list
- New webhook triggers don't work (old execution is "holding" the webhook)
- Form submissions hang

## Solution
1. Go to `http://localhost:5678/home/executions`
2. Find executions in "Waiting" state
3. Stop them manually (click → Stop)

## Prevention
- Check the executions list before restarting n8n
- Stop any running/waiting executions first
- Then restart n8n

## Starting n8n
```bash
# Foreground (see logs)
npm exec n8n

# Background
nohup npm exec n8n &
```
