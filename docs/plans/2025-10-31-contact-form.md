# Contact Form Implementation Plan

> **For Claude:** Use `${UNI_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task with hierarchical agent isolation.

**Goal:** Build a contact form that captures user information (name, job title, email, phone, company, message) and stores submissions in PostgreSQL with timestamps, displaying toast notifications for feedback.

**Architecture:** Traditional API Route + Client Form approach with clear separation of concerns. React form component with controlled inputs submits to `/api/contact` POST endpoint. Server validates, stores in PostgreSQL, and returns JSON response. Client shows toast notification based on response.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, PostgreSQL, pg library, react-hot-toast (or similar), Tailwind CSS

**Task Execution Model:** Each task number (1, 1.1, 1.2, 2, etc.) will be assigned to a dedicated agent with isolated context.

---

## Task 1: Database Schema Setup

**High-Level Behavior:** Create PostgreSQL table to store contact form submissions with automatic timestamp generation.

**Depends On:** None (foundational task)
**Provides To:** Task 2 (API needs table), Task 5 (verification needs data)

### Task 1.1: Create Database Migration Script

**Agent Context:** You are setting up the database schema for a contact form feature. The project has PostgreSQL configured via Docker Compose with connection details in `.env.local`. This is a new table being created from scratch.

**Behavior:** Create a SQL migration script that defines the `contact_submissions` table with appropriate columns, constraints, and indexes.

**Acceptance Criteria:**
- Given a fresh database connection
- When the migration script is executed
- Then a `contact_submissions` table exists with the following structure:
  - `id`: SERIAL PRIMARY KEY
  - `name`: VARCHAR(255) NOT NULL
  - `email`: VARCHAR(255) NOT NULL
  - `job_title`: VARCHAR(255) NULL
  - `phone_number`: VARCHAR(50) NULL
  - `company_name`: VARCHAR(255) NULL
  - `message`: TEXT NOT NULL
  - `submitted_at`: TIMESTAMP DEFAULT NOW() NOT NULL
- And the table has an index on `email` for query performance
- And the table has an index on `submitted_at` for sorting

**Test Scenarios:**
- Happy path: Execute migration creates table successfully
- Idempotent: Running migration twice doesn't fail (use IF NOT EXISTS)
- Verification: Query table schema matches specification
- Edge case: Default timestamp is set automatically without manual insertion

**Agent-Specific Context:**
- File to create: `src/db/migrations/001_create_contact_submissions.sql`
- Migration runner to create: `src/db/migrate.ts` (Node.js script using `pg` library)
- Database URL available at: `process.env.DATABASE_URL`
- Dependencies: `pg` library (already in package.json)

**Architecture Constraints:**
- Use IF NOT EXISTS to make migration idempotent
- Include DOWN migration for rollback capability
- Log migration status to console
- Handle connection errors gracefully

**Definition of Done:**
- Migration SQL file created with UP and DOWN sections
- Migration runner script can execute SQL files
- Test verifies table exists with correct schema
- Documentation comment explains each column's purpose
- Interface provided: Table schema ready for API to use

---

## Task 2: API Route Implementation

**High-Level Behavior:** Create REST API endpoint at `/api/contact` that validates input, stores submissions in database, and returns appropriate responses.

**Depends On:** Task 1 (requires database table)
**Provides To:** Task 3 (form posts to this endpoint)

### Task 2.1: Create API Route Handler with Request Validation

**Agent Context:** You are building the API endpoint for a contact form. The database table `contact_submissions` exists with columns: name, email, job_title, phone_number, company_name, message, submitted_at. You need to handle POST requests with JSON bodies.

**Behavior:** Implement POST handler at `/api/contact/route.ts` that validates incoming request body against required schema and returns appropriate error responses for invalid data.

**Acceptance Criteria:**
- Given a POST request to `/api/contact`
- When request body contains valid data:
  - Required: name (non-empty string), email (valid format), message (non-empty string)
  - Optional: job_title, phone_number, company_name (strings or null)
- Then validation passes and processing continues
- When required fields are missing or empty
- Then return 400 Bad Request with `{success: false, error: "Missing required field: <field>"}`
- When email format is invalid (not matching email regex)
- Then return 400 Bad Request with `{success: false, error: "Invalid email format"}`
- When non-string types provided
- Then return 400 Bad Request with descriptive error

**Test Scenarios:**
- Happy path: Valid complete data passes validation
- Missing required: name=null → error
- Missing required: email="" → error
- Missing required: message=undefined → error
- Invalid format: email="notanemail" → error
- Edge case: email="user@domain" (no TLD) → error
- Edge case: Very long name (256 chars) → error (exceeds VARCHAR(255))
- Optional fields: job_title=null → passes
- Type mismatch: name=123 → error

**Agent-Specific Context:**
- File to create: `src/app/api/contact/route.ts`
- Test file: `src/app/api/contact/route.test.ts`
- Use Next.js App Router API route pattern: `export async function POST(request: Request)`
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Return JSON using: `NextResponse.json()`

**Architecture Constraints:**
- Validate before any database operations
- Sanitize inputs to prevent SQL injection (use parameterized queries)
- Max lengths: name/email/job_title/company_name: 255 chars, phone: 50 chars, message: 5000 chars
- Security: Never expose internal error details to client

**Definition of Done:**
- All acceptance criteria have passing tests (use @testing/test-driven-development)
- Validation function is pure and testable independently
- Interface provided: POST handler validates and returns 400 for invalid input
- Next task can call this endpoint with confidence about validation

### Task 2.2: Database Insert Logic with Error Handling

**Agent Context:** You are extending the validated `/api/contact` API endpoint. Validation has already passed at this point. The database connection is configured via `DATABASE_URL` environment variable. You need to insert the validated data into `contact_submissions` table.

**Behavior:** After validation passes, insert contact submission into PostgreSQL database and handle database errors gracefully.

**Acceptance Criteria:**
- Given validated request data from Task 2.1
- When database connection is available
- Then insert record into `contact_submissions` table using parameterized query
- And `submitted_at` timestamp is auto-generated by database
- And return 201 Created with `{success: true, message: "Thank you! We'll be in touch soon."}`
- When database connection fails
- Then return 500 Internal Server Error with `{success: false, error: "Unable to process request. Please try again."}`
- When insert fails (e.g., constraint violation)
- Then return 500 with generic error message (no internal details exposed)
- And log full error details server-side for debugging

**Test Scenarios:**
- Happy path: Valid data inserted, returns 201 with success message
- Database down: Connection error → 500 response, error logged
- Constraint violation: Unique constraint fails → 500 response, error logged
- Edge case: Very long message (4999 chars) → successfully inserted
- Edge case: Special characters in message (quotes, apostrophes, unicode) → inserted correctly
- Verification: Record exists in database with correct data and auto-generated timestamp
- Verification: submitted_at is within 1 second of current time

**Agent-Specific Context:**
- File to extend: `src/app/api/contact/route.ts` (add database logic after validation)
- Database utility to create: `src/db/client.ts` (connection pool management)
- Use `pg` library's `Pool` for connection management
- SQL query with parameterized placeholders: `INSERT INTO contact_submissions (name, email, ...) VALUES ($1, $2, ...) RETURNING id`
- Environment: `DATABASE_URL` from `.env.local`

**Architecture Constraints:**
- Use connection pooling (create singleton Pool instance)
- Always use parameterized queries (NEVER string concatenation)
- Close connections properly (use try/finally)
- Log errors with context but don't expose to client
- Transaction not needed (single insert operation)

**Definition of Done:**
- All acceptance criteria have passing tests with database mocking
- Database client utility handles connection lifecycle
- Integration test verifies actual database insertion
- Error handling prevents information leakage
- Interface provided: API endpoint fully functional for form submission

---

## Task 3: Contact Form Component

**High-Level Behavior:** Create client-side React form component with controlled inputs, validation, loading states, and submission handling.

**Depends On:** Task 2 (posts to API endpoint)
**Provides To:** Task 4 (triggers toast notifications)

### Task 3.1: Form Component with Controlled Inputs

**Agent Context:** You are building a contact form component for a Next.js app. The form needs 6 fields: name, email, job_title, phone_number, company_name, message. This is a "use client" React component with controlled form inputs. The styling uses Tailwind CSS (already configured).

**Behavior:** Create form component that manages input state and renders accessible form fields with proper labels and structure.

**Acceptance Criteria:**
- Given user is viewing the contact form
- When component renders
- Then display form with 6 labeled input fields:
  - Name (text input, required)
  - Email (email input, required)
  - Job Title (text input, optional)
  - Phone Number (tel input, optional)
  - Company Name (text input, optional)
  - Message (textarea, required)
- And display "Submit" button
- And all inputs use controlled component pattern (value={state} onChange={handler})
- And required fields show visual indicator (asterisk)
- When user types in any field
- Then state updates and input shows typed value
- And form is keyboard navigable (tab through fields, no tab traps)

**Test Scenarios:**
- Happy path: All inputs render with correct labels and types
- Interaction: Typing updates state correctly for each field
- Accessibility: Labels associated with inputs (htmlFor/id match)
- Accessibility: Required fields marked with aria-required
- Accessibility: Form has descriptive heading
- Edge case: Empty form state initializes correctly
- Visual: Required fields show asterisk in label

**Agent-Specific Context:**
- File to create: `src/components/ContactForm.tsx`
- Test file: `src/components/ContactForm.test.tsx`
- Use React.useState for form state
- Use "use client" directive at top of file
- Styling: Tailwind classes for layout and appearance
- Form structure: `<form>` element wrapping all inputs

**Architecture Constraints:**
- Accessibility: WCAG 2.1 Level AA compliance
- Form semantics: Use proper HTML5 input types
- State management: Single state object for all fields
- No external form libraries (use vanilla React)
- Responsive design: Works on mobile and desktop

**Definition of Done:**
- All acceptance criteria have passing tests (@testing/test-driven-development)
- Component renders without errors
- Accessibility testing passes (screen reader friendly)
- Interface provided: Controlled form component ready for validation logic

### Task 3.2: Client-Side Validation Logic

**Agent Context:** You are extending the ContactForm component from Task 3.1. The form has controlled inputs for name, email, job_title, phone_number, company_name, message. You need to add validation that runs before submission and shows inline errors.

**Behavior:** Implement validation logic that checks required fields and email format, displays error messages below invalid fields, and prevents submission when validation fails.

**Acceptance Criteria:**
- Given user has interacted with a field
- When field loses focus (onBlur)
- Then validate that field and show error if invalid
- When required field (name, email, message) is empty
- Then show error: "<Field> is required"
- When email doesn't match format `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Then show error: "Please enter a valid email address"
- When all fields are valid
- Then no errors shown and submit button is enabled
- When any field is invalid
- Then submit button is disabled
- And error messages displayed below invalid fields
- When user fixes invalid field
- Then error message clears

**Test Scenarios:**
- Happy path: Valid complete form → no errors, submit enabled
- Required validation: Empty name → error shown
- Required validation: Empty email → error shown
- Required validation: Empty message → error shown
- Format validation: Invalid email "test@" → error shown
- Format validation: Valid email "user@example.com" → no error
- Interaction: Error appears on blur, clears on fix
- Edge case: Optional fields left empty → no validation errors
- Edge case: Whitespace-only required field → treated as empty, shows error
- Visual: Error messages styled distinctly (red text)

**Agent-Specific Context:**
- File to extend: `src/components/ContactForm.tsx`
- Add validation state: `errors` object tracking field errors
- Add validation functions: `validateName`, `validateEmail`, `validateMessage`
- Add `onBlur` handlers to inputs for field-level validation
- Error display: `<p>` element below each field showing error
- Submit button: `disabled={hasErrors}` attribute

**Architecture Constraints:**
- Validation runs on blur (not every keystroke)
- Validation also runs on submit attempt
- Error messages are user-friendly, not technical
- Validation logic is pure functions (testable in isolation)
- Don't validate optional fields (unless they have format requirements)

**Definition of Done:**
- All acceptance criteria have passing tests
- Validation functions are unit tested separately
- Error states update correctly
- Submit button disabled when invalid
- Interface provided: Validated form ready for submission logic

### Task 3.3: Form Submission Handler with Loading States

**Agent Context:** You are extending the validated ContactForm component. Validation logic from Task 3.2 is complete. The API endpoint `/api/contact` exists and expects POST with JSON body. You need to handle form submission, loading states, and prepare for toast notifications.

**Behavior:** Implement form submission that posts to API endpoint, manages loading state, handles success/error responses, and provides feedback hooks.

**Acceptance Criteria:**
- Given user clicks Submit button with valid form
- When submission starts
- Then disable all inputs and submit button
- And show loading indicator (spinner or "Submitting..." text)
- And POST request sent to `/api/contact` with JSON body
- When API returns 201 success
- Then call `onSuccess` callback with success message
- And clear all form fields
- And re-enable form inputs
- When API returns 4xx/5xx error
- Then call `onError` callback with error message from response
- And keep form data intact (user doesn't lose their message)
- And re-enable form inputs
- When network request fails (no response)
- Then call `onError` callback with "Network error. Please check your connection."
- And keep form data intact
- And re-enable form inputs

**Test Scenarios:**
- Happy path: Valid submission → API returns 201 → onSuccess called, form cleared
- Server error: API returns 500 → onError called with message, form data kept
- Validation error: API returns 400 → onError called with message
- Network error: Fetch fails → onError called with network message
- Loading state: During submission → all inputs disabled, spinner visible
- Edge case: Double-click submit → second click ignored (button disabled)
- Edge case: Submit with special characters in message → posted correctly
- Verification: Request body matches expected API format

**Agent-Specific Context:**
- File to extend: `src/components/ContactForm.tsx`
- Add loading state: `const [isSubmitting, setIsSubmitting] = useState(false)`
- Add callback props: `onSuccess?: (message: string) => void`, `onError?: (error: string) => void`
- Use fetch API for POST request
- Request: `fetch('/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)})`
- Handle response: Check `response.ok`, parse JSON, call appropriate callback

**Architecture Constraints:**
- Prevent double submission (disable button during loading)
- Always re-enable form after completion (use finally block)
- Parse error messages from API response JSON
- Keep form data on error (user shouldn't retype)
- Clear form data only on success
- Loading indicator should be visible but not intrusive

**Definition of Done:**
- All acceptance criteria have passing tests
- Mock fetch in tests to simulate API responses
- Loading states prevent race conditions
- Error handling covers all failure modes
- Interface provided: Fully functional form component with onSuccess/onError callbacks for Task 4 to wire up

---

## Task 4: Toast Notification Integration

**High-Level Behavior:** Add toast notification library and wire up success/error feedback in response to form submission.

**Depends On:** Task 3 (form provides onSuccess/onError callbacks)
**Provides To:** Task 5 (complete feature for testing)

### Task 4.1: Add Toast Library and Provider Setup

**Agent Context:** You are adding toast notifications to a Next.js 16 App Router application. The app has a root layout at `src/app/layout.tsx`. You need to install a toast library and set up the provider for app-wide usage.

**Behavior:** Install `react-hot-toast` library, configure the Toaster provider in the root layout, and verify toast infrastructure works.

**Acceptance Criteria:**
- Given application startup
- When root layout renders
- Then Toaster component is mounted and ready to display toasts
- And Toaster is positioned at top-center of viewport
- And Toaster styling matches application theme (uses Tailwind classes if possible)
- When `toast.success('message')` is called anywhere in app
- Then success toast appears with green styling and checkmark icon
- When `toast.error('message')` is called anywhere in app
- Then error toast appears with red styling and error icon
- And toasts auto-dismiss after 4 seconds (configurable)

**Test Scenarios:**
- Happy path: Toaster renders in layout without errors
- Success toast: Call toast.success → green toast appears with message
- Error toast: Call toast.error → red toast appears with message
- Auto-dismiss: Toast disappears after configured duration
- Multiple toasts: Multiple toasts stack vertically without overlap
- Edge case: Very long message → toast expands or truncates gracefully
- Accessibility: Toast announces message to screen readers (aria-live)

**Agent-Specific Context:**
- Install: Run `npm install react-hot-toast`
- File to modify: `src/app/layout.tsx`
- Import: `import { Toaster } from 'react-hot-toast'`
- Add to layout: `<Toaster position="top-center" />` inside body
- Documentation: https://react-hot-toast.com/docs

**Architecture Constraints:**
- Provider wraps entire app (in root layout)
- Position: top-center for visibility
- Duration: 4000ms for success, 6000ms for errors (longer to read errors)
- Styling: Match app theme, use consistent colors
- No custom toast components yet (use library defaults)

**Definition of Done:**
- react-hot-toast installed and in package.json
- Toaster component added to layout
- Test verifies toasts appear when triggered
- Documentation comment explains toast configuration
- Interface provided: Global toast system ready for use in components

### Task 4.2: Wire Up Form Success and Error Notifications

**Agent Context:** You are integrating toast notifications with the ContactForm component from Task 3. The form has `onSuccess` and `onError` callback props. The toast library (react-hot-toast) is configured in the app. You need to create a page that renders the form and handles toast notifications.

**Behavior:** Create or update page component that renders ContactForm and shows toast notifications for submission success/error via the form's callbacks.

**Acceptance Criteria:**
- Given user is on the contact page
- When ContactForm is rendered
- Then form is visible and functional
- When form submission succeeds (API returns 201)
- Then green success toast appears with message: "Thank you! We'll be in touch soon."
- And form fields are cleared (handled by form component)
- And toast auto-dismisses after 4 seconds
- When form submission fails (API returns error)
- Then red error toast appears with error message from API response
- And form data remains intact
- And toast auto-dismisses after 6 seconds
- When network error occurs
- Then red error toast appears with: "Network error. Please check your connection."

**Test Scenarios:**
- Happy path: Form success → success toast appears
- Server error: Form error → error toast with message appears
- Multiple submissions: Success → Error → Both show appropriate toasts
- Toast timing: Success toast dismisses in 4s, error toast in 6s
- Integration: Form clears on success toast, stays populated on error toast
- Visual: Success toast is green, error toast is red
- Accessibility: Toast messages announced to screen readers

**Agent-Specific Context:**
- File to create or modify: `src/app/contact/page.tsx`
- Import: `import { toast } from 'react-hot-toast'`
- Import: `import ContactForm from '@/components/ContactForm'`
- Wire callbacks: `<ContactForm onSuccess={(msg) => toast.success(msg)} onError={(err) => toast.error(err)} />`
- Alternatively, if using home page: Modify `src/app/page.tsx` instead

**Architecture Constraints:**
- Page component can be Server Component (ContactForm is 'use client')
- Toast calls happen in callbacks (client-side only)
- Error messages from API are user-friendly (not technical)
- Success message matches design specification
- Toast duration: success 4000ms, error 6000ms

**Definition of Done:**
- All acceptance criteria have passing tests
- Page renders form with toast integration
- Success and error paths both show appropriate toasts
- Toast messages are user-friendly
- Interface provided: Complete end-to-end flow from form → API → toast feedback

---

## Task 5: End-to-End Verification and Manual Testing

**High-Level Behavior:** Verify complete feature works end-to-end with real database, run manual test checklist, and document any findings.

**Depends On:** Tasks 1-4 (all components complete)
**Provides To:** Feature completion and deployment readiness

### Task 5.1: Integration Testing with Database

**Agent Context:** You are verifying the complete contact form feature. The database migration, API endpoint, form component, and toast notifications are all implemented. Docker Compose provides PostgreSQL at localhost:5432. You need to run integration tests against the real database.

**Behavior:** Create and execute integration tests that verify the complete flow: form submission → API → database → response → toast, using a real PostgreSQL database.

**Acceptance Criteria:**
- Given Docker Compose database is running
- When integration test executes
- Then database migration creates table successfully
- When test submits valid form data via API
- Then record is inserted into `contact_submissions` table
- And response is 201 with success message
- And submitted_at timestamp is auto-generated
- When test submits invalid data (missing required fields)
- Then no record is inserted
- And response is 400 with error message
- When test queries database after submission
- Then submitted record matches input data exactly
- And all fields (including NULL optional fields) are stored correctly

**Test Scenarios:**
- Full flow: Submit form → verify database row → verify response
- Required fields: Submit with missing name → no row inserted
- Optional fields: Submit with nulls → row inserted with NULLs
- Timestamp: Verify submitted_at is within 1 second of submission time
- Special characters: Submit with quotes/apostrophes → stored correctly
- Multiple submissions: Two submissions → two distinct rows in database
- Cleanup: Test cleans up test data after execution

**Agent-Specific Context:**
- File to create: `tests/integration/contact-form.test.ts`
- Database URL: Use `DATABASE_URL` from `.env.local`
- Setup: Run migration before tests
- Teardown: Delete test records after tests
- Use `pg` client to query database directly
- Use test framework's beforeAll/afterAll hooks

**Architecture Constraints:**
- Tests run against real database (not mocks)
- Test data is isolated (use unique email prefix like "test-{uuid}@example.com")
- Cleanup is guaranteed (use try/finally)
- Tests can run in parallel (unique data per test)
- Migration idempotency is verified (run migration twice, no errors)

**Definition of Done:**
- Integration tests pass with real database
- All data persistence verified
- Error cases tested and working
- Test cleanup ensures no leftover data
- Documentation explains how to run integration tests
- Interface provided: Feature verified working end-to-end

### Task 5.2: Manual Testing Checklist Execution

**Agent Context:** You are performing final manual testing of the contact form feature. All implementation and integration tests are complete. You need to verify the feature works correctly in a real browser environment and document the results.

**Behavior:** Execute comprehensive manual test checklist covering UI, UX, accessibility, and edge cases, documenting results and any issues found.

**Acceptance Criteria:**
- Given developer has local environment running (npm run dev + docker-compose up)
- When executing each test case in checklist
- Then document pass/fail for each case
- And document any bugs or unexpected behaviors
- When all test cases pass
- Then feature is ready for code review
- When any test cases fail
- Then create issues/todos for fixes needed

**Manual Test Checklist:**

**UI/UX Tests:**
- [ ] All 6 form fields render correctly
- [ ] Required fields show asterisk indicator
- [ ] Form is visually appealing and aligned
- [ ] Submit button is styled appropriately
- [ ] Loading state shows spinner/disabled state during submission
- [ ] Success toast appears and is green
- [ ] Error toast appears and is red
- [ ] Form clears after successful submission
- [ ] Form keeps data after error

**Functional Tests:**
- [ ] Submit valid complete form → success toast, database record created
- [ ] Submit with missing name → validation error shown
- [ ] Submit with missing email → validation error shown
- [ ] Submit with missing message → validation error shown
- [ ] Submit with invalid email format → validation error shown
- [ ] Submit with valid data + optional fields null → success
- [ ] Special characters in message → stored and retrieved correctly
- [ ] Very long message (1000 chars) → handles gracefully

**Accessibility Tests:**
- [ ] Tab through all fields with keyboard only
- [ ] Submit form with Enter key
- [ ] Screen reader announces field labels correctly
- [ ] Screen reader announces validation errors
- [ ] Screen reader announces toast messages
- [ ] Focus visible indicator on all interactive elements
- [ ] Required fields marked with aria-required

**Browser Tests:**
- [ ] Chrome: Feature works correctly
- [ ] Firefox: Feature works correctly
- [ ] Safari: Feature works correctly (if available)

**Responsive Tests:**
- [ ] Desktop (1920px): Layout looks good
- [ ] Tablet (768px): Layout adapts correctly
- [ ] Mobile (375px): Layout adapts correctly, inputs are usable

**Edge Cases:**
- [ ] Submit with database down → error toast with friendly message
- [ ] Submit with network disconnected → error toast with network message
- [ ] Double-click submit → second click ignored (no double submission)
- [ ] Submit form, navigate away, come back → form is fresh/cleared

**Agent-Specific Context:**
- Document results in: `docs/plans/2025-10-31-contact-form-testing-results.md`
- Run dev server: `cd /target && npm run dev`
- Run database: `cd /target && docker-compose up -d db`
- Test URL: `http://localhost:3000` or `/contact` if separate page
- Use browser DevTools to inspect network requests and console

**Architecture Constraints:**
- All tests should pass before marking complete
- Document any browser-specific issues
- Note any accessibility violations
- Capture screenshots of any visual issues
- Testing should be thorough, not rushed

**Definition of Done:**
- All checklist items tested and documented
- Pass/fail status recorded for each test
- Any issues found are documented with reproduction steps
- Feature confirmed working in manual testing
- Ready for code review and merge
- Interface provided: Testing results document confirms feature quality
