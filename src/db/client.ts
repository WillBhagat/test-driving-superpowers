import { Pool } from 'pg';

// Singleton pool instance
let pool: Pool | null = null;

/**
 * Get database connection pool (singleton)
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

export interface ContactSubmissionData {
  name: string;
  email: string;
  job_title: string | null;
  phone_number: string | null;
  company_name: string | null;
  message: string;
}

/**
 * Insert contact submission into database
 * Uses parameterized queries to prevent SQL injection
 */
export async function insertContactSubmission(
  data: ContactSubmissionData
): Promise<{ id: number }> {
  const pool = getPool();

  const sql = `
    INSERT INTO contact_submissions
      (name, email, job_title, phone_number, company_name, message)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;

  const params = [
    data.name,
    data.email,
    data.job_title,
    data.phone_number,
    data.company_name,
    data.message,
  ];

  try {
    const result = await pool.query(sql, params);
    return { id: result.rows[0].id };
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}
