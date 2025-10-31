import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm - Submission', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('submits form data to API on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ success: true, message: "Thank you! We'll be in touch soon." }),
    });

    const user = userEvent.setup();
    const onSuccess = jest.fn();
    render(<ContactForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John Doe');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('John Doe'),
      }));
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("Thank you! We'll be in touch soon.");
    });
  });

  test('clears form on successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ success: true, message: "Thank you!" }),
    });

    const user = userEvent.setup();
    render(<ContactForm onSuccess={jest.fn()} />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John Doe');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect((screen.getByLabelText(/^name \*/i) as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText(/^email \*/i) as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText(/^message \*/i) as HTMLTextAreaElement).value).toBe('');
    });
  });

  test('shows loading state during submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true }),
      }), 100))
    );

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });

  test('calls onError on server error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: 'Server error' }),
    });

    const user = userEvent.setup();
    const onError = jest.fn();
    render(<ContactForm onError={onError} />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Server error');
    });
  });

  test('keeps form data on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: 'Error' }),
    });

    const user = userEvent.setup();
    render(<ContactForm onError={jest.fn()} />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect((screen.getByLabelText(/^name \*/i) as HTMLInputElement).value).toBe('John');
    });
  });

  test('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    const onError = jest.fn();
    render(<ContactForm onError={onError} />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Network error. Please check your connection.');
    });
  });

  test('prevents double submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true }),
      }), 100))
    );

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test');

    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);
    await user.click(button); // Try double click

    // Should only call fetch once
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
