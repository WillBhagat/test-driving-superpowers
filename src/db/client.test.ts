import { getPool, insertContactSubmission } from './client';
import { Pool } from 'pg';

// Mock pg Pool
jest.mock('pg', () => {
  const mockQuery = jest.fn();
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: mockQuery,
    })),
  };
});

describe('Database Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getPool returns singleton Pool instance', () => {
    const pool1 = getPool();
    const pool2 = getPool();

    expect(pool1).toBe(pool2); // Same instance
  });

  test('insertContactSubmission inserts data with parameterized query', async () => {
    const mockPool = getPool();
    (mockPool.query as jest.Mock).mockResolvedValue({
      rows: [{ id: 1 }],
      rowCount: 1,
    });

    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      job_title: 'Developer',
      phone_number: '123-456-7890',
      company_name: 'Tech Corp',
      message: 'Hello, this is a test',
    };

    const result = await insertContactSubmission(data);

    expect(mockPool.query).toHaveBeenCalledTimes(1);

    // Verify parameterized query
    const call = (mockPool.query as jest.Mock).mock.calls[0];
    const sql = call[0];
    const params = call[1];

    expect(sql).toContain('INSERT INTO contact_submissions');
    expect(sql).toContain('$1'); // Parameterized
    expect(params).toEqual([
      data.name,
      data.email,
      data.job_title,
      data.phone_number,
      data.company_name,
      data.message,
    ]);

    expect(result.id).toBe(1);
  });

  test('insertContactSubmission handles null optional fields', async () => {
    const mockPool = getPool();
    (mockPool.query as jest.Mock).mockResolvedValue({
      rows: [{ id: 2 }],
      rowCount: 1,
    });

    const data = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      job_title: null,
      phone_number: null,
      company_name: null,
      message: 'Test message',
    };

    const result = await insertContactSubmission(data);

    const call = (mockPool.query as jest.Mock).mock.calls[0];
    const params = call[1];

    expect(params[2]).toBeNull();
    expect(params[3]).toBeNull();
    expect(params[4]).toBeNull();
    expect(result.id).toBe(2);
  });

  test('insertContactSubmission throws on database error', async () => {
    const mockPool = getPool();
    const dbError = new Error('Database connection failed');
    (mockPool.query as jest.Mock).mockRejectedValue(dbError);

    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      job_title: null,
      phone_number: null,
      company_name: null,
      message: 'Test',
    };

    await expect(insertContactSubmission(data)).rejects.toThrow('Database connection failed');
  });
});
