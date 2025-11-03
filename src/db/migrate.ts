import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Run database migration to create contact_submissions table
 * Idempotent - can be run multiple times safely
 */
export async function runMigration(pool: Pool): Promise<void> {
  const migrationPath = path.join(__dirname, 'migrations', '001_create_contact_submissions.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Extract only the UP migration part (before DOWN Migration comment)
  const upMigration = sql.split('-- DOWN Migration')[0];

  try {
    await pool.query(upMigration);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// CLI runner - check if this file is being run directly
const isMainModule = process.argv[1]?.includes('migrate');

if (isMainModule) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  runMigration(pool)
    .then(() => {
      console.log('Database migration complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database migration failed:', error);
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}
