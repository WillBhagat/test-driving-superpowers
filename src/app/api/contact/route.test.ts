import { POST } from './route';
import { NextRequest } from 'next/server';

// Helper to create a mock NextRequest
function createMockRequest(body: any): NextRequest {
  return {
    json: async () => body,
  } as NextRequest;
}

describe('POST /api/contact - Request Validation', () => {
  test('accepts valid complete data', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a test message',
      job_title: 'Developer',
      phone_number: '123-456-7890',
      company_name: 'Tech Corp',
    };

    const request = createMockRequest(validData);
    const response = await POST(request);
    const data = await response.json();

    // Should not return validation error for valid data
    expect(response.status).not.toBe(400);
  });

  test('rejects missing name', async () => {
    const invalidData = {
      email: 'john@example.com',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('name');
  });

  test('rejects empty name', async () => {
    const invalidData = {
      name: '',
      email: 'john@example.com',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('name');
  });

  test('rejects missing email', async () => {
    const invalidData = {
      name: 'John Doe',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('email');
  });

  test('rejects empty email', async () => {
    const invalidData = {
      name: 'John Doe',
      email: '',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('email');
  });

  test('rejects invalid email format - missing @', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'notanemail',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('email');
  });

  test('rejects invalid email format - missing TLD', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'user@domain',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('email');
  });

  test('rejects missing message', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('message');
  });

  test('rejects empty message', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: '',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('message');
  });

  test('rejects name exceeding max length', async () => {
    const invalidData = {
      name: 'a'.repeat(256), // Exceeds VARCHAR(255)
      email: 'john@example.com',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('name');
  });

  test('accepts null optional fields', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello',
      job_title: null,
      phone_number: null,
      company_name: null,
    };

    const request = createMockRequest(validData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).not.toBe(400);
  });

  test('rejects non-string name', async () => {
    const invalidData = {
      name: 123,
      email: 'john@example.com',
      message: 'Hello',
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('name');
  });
});
