import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm - Controlled Inputs', () => {
  test('renders form with all 6 input fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^job title$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone number$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^company name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message \*/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    render(<ContactForm />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('name input updates state when typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/^name \*/i) as HTMLInputElement;
    await user.type(nameInput, 'John Doe');

    expect(nameInput.value).toBe('John Doe');
  });

  test('email input updates state when typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/^email \*/i) as HTMLInputElement;
    await user.type(emailInput, 'john@example.com');

    expect(emailInput.value).toBe('john@example.com');
  });

  test('job title input updates state when typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const jobTitleInput = screen.getByLabelText(/^job title$/i) as HTMLInputElement;
    await user.type(jobTitleInput, 'Developer');

    expect(jobTitleInput.value).toBe('Developer');
  });

  test('phone number input updates state when typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const phoneInput = screen.getByLabelText(/^phone number$/i) as HTMLInputElement;
    await user.type(phoneInput, '123-456-7890');

    expect(phoneInput.value).toBe('123-456-7890');
  });

  test('company name input updates state when typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const companyInput = screen.getByLabelText(/^company name$/i) as HTMLInputElement;
    await user.type(companyInput, 'Tech Corp');

    expect(companyInput.value).toBe('Tech Corp');
  });

  test('message textarea updates state when typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/^message \*/i) as HTMLTextAreaElement;
    await user.type(messageInput, 'This is a test message');

    expect(messageInput.value).toBe('This is a test message');
  });

  test('required fields show asterisk indicator', () => {
    render(<ContactForm />);

    const nameLabel = screen.getByText(/^name \*$/i);
    const emailLabel = screen.getByText(/^email \*$/i);
    const messageLabel = screen.getByText(/^message \*$/i);

    expect(nameLabel.textContent).toContain('*');
    expect(emailLabel.textContent).toContain('*');
    expect(messageLabel.textContent).toContain('*');
  });

  test('optional fields do not show asterisk indicator', () => {
    render(<ContactForm />);

    const jobTitleLabel = screen.getByText(/^job title$/i);
    const phoneLabel = screen.getByText(/^phone number$/i);
    const companyLabel = screen.getByText(/^company name$/i);

    expect(jobTitleLabel.textContent).not.toContain('*');
    expect(phoneLabel.textContent).not.toContain('*');
    expect(companyLabel.textContent).not.toContain('*');
  });

  test('form has accessible heading', () => {
    render(<ContactForm />);

    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  });

  test('inputs have correct HTML types', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name \*/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/^email \*/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^phone number$/i)).toHaveAttribute('type', 'tel');
  });

  test('required fields have aria-required attribute', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name \*/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/^email \*/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/^message \*/i)).toHaveAttribute('aria-required', 'true');
  });

  test('form is keyboard navigable', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill in required fields so button is enabled
    await user.type(screen.getByLabelText(/^name \*/i), 'John');
    await user.type(screen.getByLabelText(/^email \*/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^message \*/i), 'Test');

    // Now test tab order
    const nameInput = screen.getByLabelText(/^name \*/i);
    nameInput.focus();

    // Tab through all fields
    await user.tab();
    expect(screen.getByLabelText(/^email \*/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/^job title$/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/^phone number$/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/^company name$/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/^message \*/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: /submit/i })).toHaveFocus();
  });
});
