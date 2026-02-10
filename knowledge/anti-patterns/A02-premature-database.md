# A2: Database Before Validation

## What It Is
Setting up SQL, PostgreSQL, MongoDB, Prisma, Drizzle, or any ORM before your data model is stable. Creating migrations, seeds, and schema definitions during Phase 0-2.

## Why It's an Anti-Pattern
- Data model changes 5-10x during PoC iteration
- Each change requires a migration
- Migrations accumulate, conflict, and break
- ORM setup eats 1-2 days that could be spent proving the idea

## Detection
```bash
grep -E "prisma|drizzle|mongoose|typeorm|sequelize|knex|pg|mysql|sqlite3" package.json
ls *.sql prisma/ migrations/ drizzle/ 2>/dev/null
```

## What to Do Instead
JSON files on disk:
```javascript
// Read config
const plugins = JSON.parse(fs.readFileSync(`plugins/${id}/plugin.json`, 'utf8'));

// Write output
fs.writeFileSync(`output/${jobId}.json`, JSON.stringify(result, null, 2));
```

## When to Graduate
- 100+ records of the same type (file scanning gets slow)
- Concurrent writes from multiple users
- Complex queries across entities
- Phase 3+ and data model stable for 2+ iterations
