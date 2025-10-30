#!/usr/bin/env node

/**
 * Database migration script
 * Runs the schema.sql file to set up the messages table
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  // Load DATABASE_URL from .env.local
  const envPath = path.join(__dirname, '..', '.env.local');
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (match) {
      databaseUrl = match[1];
    }
  }

  if (!databaseUrl) {
    console.error('Error: DATABASE_URL not found in environment or .env.local');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema migration...');
    await client.query(schema);
    console.log('Schema migration completed successfully');

    // Verify table exists
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'messages'
      ORDER BY ordinal_position
    `);

    console.log('\nMessages table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'NO' ? 'NOT NULL' : 'nullable'})`);
    });

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
