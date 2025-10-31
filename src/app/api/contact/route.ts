import { NextRequest, NextResponse } from 'next/server';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Max field lengths
const MAX_LENGTH = {
  name: 255,
  email: 255,
  job_title: 255,
  company_name: 255,
  phone_number: 50,
  message: 5000,
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  job_title?: string | null;
  phone_number?: string | null;
  company_name?: string | null;
}

/**
 * Validate contact form data
 * Returns error message if invalid, null if valid
 */
function validateContactData(data: any): string | null {
  // Check name
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    return 'Missing required field: name';
  }
  if (data.name.length > MAX_LENGTH.name) {
    return 'Field exceeds maximum length: name';
  }

  // Check email
  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    return 'Missing required field: email';
  }
  if (!EMAIL_REGEX.test(data.email)) {
    return 'Invalid email format';
  }
  if (data.email.length > MAX_LENGTH.email) {
    return 'Field exceeds maximum length: email';
  }

  // Check message
  if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
    return 'Missing required field: message';
  }
  if (data.message.length > MAX_LENGTH.message) {
    return 'Field exceeds maximum length: message';
  }

  // Check optional fields types and lengths
  if (data.job_title !== null && data.job_title !== undefined) {
    if (typeof data.job_title !== 'string') {
      return 'Invalid type for field: job_title';
    }
    if (data.job_title.length > MAX_LENGTH.job_title) {
      return 'Field exceeds maximum length: job_title';
    }
  }

  if (data.phone_number !== null && data.phone_number !== undefined) {
    if (typeof data.phone_number !== 'string') {
      return 'Invalid type for field: phone_number';
    }
    if (data.phone_number.length > MAX_LENGTH.phone_number) {
      return 'Field exceeds maximum length: phone_number';
    }
  }

  if (data.company_name !== null && data.company_name !== undefined) {
    if (typeof data.company_name !== 'string') {
      return 'Invalid type for field: company_name';
    }
    if (data.company_name.length > MAX_LENGTH.company_name) {
      return 'Field exceeds maximum length: company_name';
    }
  }

  return null; // Valid
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validationError = validateContactData(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // TODO: Database insertion will be added in Task 2.2
    // For now, return success to pass validation tests
    return NextResponse.json(
      { success: true, message: "Thank you! We'll be in touch soon." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unable to process request. Please try again.' },
      { status: 500 }
    );
  }
}
