# Database Setup

## Prerequisites
- PostgreSQL running via docker-compose (see project root)
- DATABASE_URL configured in .env.local

## Initial Setup

### Option 1: Using psql CLI

Run the schema migration:

```bash
psql $DATABASE_URL -f db/schema.sql
```

Or if using docker-compose:

```bash
docker-compose exec db psql -U app_user -d test_driving_superpowers -f /workspace/db/schema.sql
```

### Option 2: Using Node.js migration script

If psql is not available, use the provided Node.js migration script:

```bash
npm install pg  # if not already installed
node db/migrate.js
```

This script will:
- Read DATABASE_URL from environment or .env.local
- Connect to PostgreSQL
- Run the schema.sql file
- Verify the table was created correctly

## Verify Setup

```bash
psql $DATABASE_URL -c "SELECT * FROM messages;"
```

Or using psql via docker:

```bash
docker-compose exec db psql -U app_user -d test_driving_superpowers -c "SELECT * FROM messages;"
```
