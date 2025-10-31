import { runMigration } from './migrate';
import { Pool } from 'pg';
import * as fs from 'fs';

// Mock the Pool
const mockQuery = jest.fn();
const mockPool = {
  query: mockQuery,
} as unknown as Pool;

describe('Database Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
  });

  test('reads and executes migration SQL file', async () => {
    await runMigration(mockPool);

    // Verify query was called
    expect(mockQuery).toHaveBeenCalledTimes(1);

    // Verify the SQL contains expected DDL statements
    const executedSQL = mockQuery.mock.calls[0][0];
    expect(executedSQL).toContain('CREATE TABLE IF NOT EXISTS contact_submissions');
    expect(executedSQL).toContain('id SERIAL PRIMARY KEY');
    expect(executedSQL).toContain('name VARCHAR(255) NOT NULL');
    expect(executedSQL).toContain('email VARCHAR(255) NOT NULL');
    expect(executedSQL).toContain('job_title VARCHAR(255) NULL');
    expect(executedSQL).toContain('phone_number VARCHAR(50) NULL');
    expect(executedSQL).toContain('company_name VARCHAR(255) NULL');
    expect(executedSQL).toContain('message TEXT NOT NULL');
    expect(executedSQL).toContain('submitted_at TIMESTAMP DEFAULT NOW() NOT NULL');
    expect(executedSQL).toContain('CREATE INDEX IF NOT EXISTS idx_contact_submissions_email');
    expect(executedSQL).toContain('CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at');
  });

  test('handles database connection errors gracefully', async () => {
    const error = new Error('Connection failed');
    mockQuery.mockRejectedValue(error);

    await expect(runMigration(mockPool)).rejects.toThrow('Connection failed');
  });

  test('is idempotent - uses IF NOT EXISTS', async () => {
    await runMigration(mockPool);

    const executedSQL = mockQuery.mock.calls[0][0];
    expect(executedSQL).toContain('IF NOT EXISTS');
  });
});
