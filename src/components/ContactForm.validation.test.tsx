import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm - Validation', () => {
  test('shows error when name is empty and field loses focus', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/^name \*/i);
    await user.click(nameInput);
    await user.tab(); // Blur

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  test('shows error when email is empty and field loses focus', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/^email \*/i);
    await user.click(emailInput);
    await user.tab(); // Blur

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  test('shows error when message is empty and field loses focus', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/^message \*/i);
    await user.click(messageInput);
    await user.tab(); // Blur

    expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/^email \*/i);
    await user.type(emailInput, 'notanemail');
    await user.tab(); // Blur

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test('does not show error for valid email', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/^email \*/i);
    await user.type(emailInput, 'john@example.com');
    await user.tab(); // Blur

    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
  });

  test('clears error when field is fixed', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/^name \*/i);
    await user.click(nameInput);
    await user.tab(); // Blur - triggers error

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    await user.type(nameInput, 'John Doe');
    await user.tab(); // Blur again

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });

  test('submit button is disabled when form has errors', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/^name \*/i);
    await user.click(nameInput);
    await user.tab(); // Blur - triggers error

    await screen.findByText(/name is required/i);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when all required fields are valid', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^name \*/i), 'John Doe');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('does not validate optional fields when empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const jobTitleInput = screen.getByLabelText(/^job title$/i);
    await user.click(jobTitleInput);
    await user.tab(); // Blur

    // Should not show any error (check for the error message class)
    const errorMessages = screen.queryAllByText(/required/i);
    expect(errorMessages.length).toBe(0);
  });

  test('treats whitespace-only required field as empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/^name \*/i);
    await user.type(nameInput, '   ');
    await user.tab(); // Blur

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  test('error messages styled in red', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/^name \*/i);
    await user.click(nameInput);
    await user.tab(); // Blur

    const errorMessage = await screen.findByText(/name is required/i);
    expect(errorMessage).toHaveClass('text-red-600');
  });
});
