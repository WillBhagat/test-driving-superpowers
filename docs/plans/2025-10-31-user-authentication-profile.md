# User Authentication and Profile Management Implementation Plan

> **For Claude:** Use `${UNI_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Build complete user authentication system with email/password login and profile management settings page.

**Architecture:** Next.js App Router with Server Actions for form handling, PostgreSQL for data persistence, encrypted session cookies for authentication, and server-side middleware for route protection. All forms use React Server Components with progressive enhancement.

**Tech Stack:** Next.js 16 (App Router), PostgreSQL with pg client, bcrypt for password hashing, iron-session for encrypted cookies, TypeScript, Tailwind CSS

---

## Task 1: Database Schema and Connection Setup

**Behavior:** Establish PostgreSQL connection utilities and create users table with all required fields and constraints.

**Acceptance Criteria:**
- Given a PostgreSQL connection string in environment variables
- When the database connection is initialized
- Then it should successfully connect and maintain a connection pool
- And the users table should exist with proper schema and constraints
- And timestamps should automatically record creation and update times

**Test Scenarios:**
- Happy path: Connection established successfully, queries execute
- Edge cases: Invalid connection string handled gracefully
- Error cases: Database unavailable, connection timeout handling
- Constraint validation: Duplicate email prevented, required fields enforced

**Integration Points:**
- Depends on: PostgreSQL database (connection string from env)
- Provides: Database client singleton, connection utilities
- Side effects: Creates users table if not exists, opens connection pool

**Files to Create/Modify:**
- Implementation: `src/lib/db.ts`
- Schema file: `src/lib/schema.sql`
- Tests: `src/lib/__tests__/db.test.ts`
- Environment: `.env.local` (DATABASE_URL)

**Architecture Notes:**
- Use connection pooling for efficiency (pg.Pool)
- SQL schema: users(id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL, phone VARCHAR(50), address TEXT, date_of_birth DATE, job_title VARCHAR(100), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())
- Parameterized queries only (prevent SQL injection)
- Graceful connection error handling

**Definition of Done:**
- Database connection established and tested
- Users table created with all fields and constraints
- Connection pool properly configured
- Error handling for connection failures tested

---

## Task 2: Authentication Utilities (Password Hashing and Session)

**Behavior:** Provide utilities for securely hashing passwords, verifying passwords, and managing encrypted session cookies.

**Acceptance Criteria:**
- Given a plain text password
- When hashPassword is called
- Then it should return a bcrypt hash with proper salt rounds
- And verifyPassword should correctly verify passwords against hashes
- And createSession should create encrypted session cookie with user ID
- And getSession should decrypt and return session data
- And destroySession should clear the session cookie

**Test Scenarios:**
- Happy path: Hash generated, password verified correctly, session created/retrieved
- Edge cases: Empty password, very long password, special characters
- Error cases: Invalid hash format, corrupted session cookie, expired session
- Security: Same password produces different hashes (salt working), session encryption working

**Integration Points:**
- Depends on: bcrypt library, iron-session library
- Provides: hashPassword, verifyPassword, createSession, getSession, destroySession functions
- Side effects: Sets httpOnly secure cookies

**Files to Create/Modify:**
- Implementation: `src/lib/auth.ts`
- Tests: `src/lib/__tests__/auth.test.ts`
- Types: `src/lib/session.ts` (session type definition)

**Architecture Notes:**
- Bcrypt salt rounds: 10 (balance security and performance)
- Session cookie config: httpOnly, secure (HTTPS only), sameSite: 'strict', maxAge: 7 days
- Session payload: { userId: number } only
- Use iron-session for encrypted cookies (not JWT for this use case)

**Definition of Done:**
- Password hashing produces different hashes for same input
- Password verification works correctly
- Session creation and retrieval tested
- Cookie security attributes verified

---

## Task 3: Registration Page and Server Action

**Behavior:** Display registration form with all required and optional fields, validate inputs, create user account with hashed password, and establish authenticated session.

**Acceptance Criteria:**
- Given a user visits /auth/register
- When they submit valid registration data (email, password, name, optional fields)
- Then account should be created with hashed password
- And session should be established
- And user should be redirected to /settings
- And validation errors should display inline for invalid inputs
- And duplicate email should show appropriate error message

**Test Scenarios:**
- Happy path: Valid data, account created, session established, redirected
- Validation: Invalid email format, weak password, missing required fields
- Edge cases: Optional fields empty, very long inputs, special characters in name
- Error cases: Duplicate email, database error, password mismatch (confirm)
- Security: Password not visible, properly hashed before storage

**Integration Points:**
- Depends on: Database utilities (Task 1), Auth utilities (Task 2)
- Provides: User registration endpoint, registration form UI
- Side effects: Inserts user record, sets session cookie, redirects to settings

**Files to Create/Modify:**
- Page: `src/app/auth/register/page.tsx`
- Action: `src/app/auth/register/actions.ts`
- Tests: `src/app/auth/register/__tests__/actions.test.ts`
- Tests: `src/app/auth/register/__tests__/page.test.tsx`

**Architecture Notes:**
- Server Component for form rendering
- Server Action for form submission (use 'use server')
- Client-side password confirmation validation (useFormState hook)
- Input validation: email regex, password min 8 chars with letter and number, name 1-100 chars
- Return structured errors: { success: boolean, error?: string, fieldErrors?: Record<string, string> }
- Use revalidatePath and redirect after successful registration

**Definition of Done:**
- Registration form renders with all fields
- Valid registration creates user and session
- All validation rules enforced
- Error messages displayed appropriately
- Redirect to settings after success

---

## Task 4: Login Page and Server Action

**Behavior:** Display login form with email and password, authenticate user credentials, establish session on success, and show errors on failure.

**Acceptance Criteria:**
- Given a user visits /auth/login
- When they submit valid credentials
- Then password should be verified against stored hash
- And session should be established
- And user should be redirected to /settings
- And invalid credentials should show "Invalid email or password" error
- And form should not reveal whether email exists

**Test Scenarios:**
- Happy path: Valid credentials, session created, redirected to settings
- Error cases: Invalid password, non-existent email, empty fields
- Edge cases: Special characters in email/password, very long inputs
- Security: No user enumeration (same error for invalid email vs password), rate limiting consideration

**Integration Points:**
- Depends on: Database utilities (Task 1), Auth utilities (Task 2)
- Provides: User login endpoint, login form UI
- Side effects: Queries user by email, sets session cookie, redirects

**Files to Create/Modify:**
- Page: `src/app/auth/login/page.tsx`
- Action: `src/app/auth/login/actions.ts`
- Tests: `src/app/auth/login/__tests__/actions.test.ts`
- Tests: `src/app/auth/login/__tests__/page.test.tsx`

**Architecture Notes:**
- Server Component for form rendering
- Server Action for authentication
- Generic error message (don't reveal if email exists)
- Link to registration page
- Use revalidatePath and redirect after successful login
- Consider rate limiting (log attempts, future enhancement)

**Definition of Done:**
- Login form renders with email and password fields
- Valid credentials establish session and redirect
- Invalid credentials show appropriate error
- No user enumeration possible
- Link to registration works

---

## Task 5: Session Middleware for Protected Routes

**Behavior:** Intercept requests to protected routes, verify session validity, allow access if authenticated, and redirect to login if not authenticated.

**Acceptance Criteria:**
- Given a request to /settings or other protected routes
- When session cookie is valid and contains user ID
- Then request should proceed to the page
- And when session is missing or invalid
- Then user should be redirected to /auth/login
- And public routes (/auth/*) should remain accessible without session

**Test Scenarios:**
- Happy path: Valid session, access granted to protected route
- Error cases: No session cookie, invalid session data, expired session
- Edge cases: Corrupted session cookie, tampered session data
- Public routes: /auth/login and /auth/register accessible without session

**Integration Points:**
- Depends on: Auth utilities (Task 2) for session validation
- Provides: Route protection middleware
- Side effects: Redirects to login for unauthenticated access

**Files to Create/Modify:**
- Middleware: `src/middleware.ts`
- Tests: `src/middleware.test.ts`
- Config: Update `next.config.ts` if needed for middleware matcher

**Architecture Notes:**
- Use Next.js middleware (runs on Edge Runtime)
- Match protected paths: /settings/*
- Exclude public paths: /auth/*, /_next/*, /api/*, /favicon.ico
- Session validation without database query (decrypt cookie only)
- Redirect to /auth/login with `next/navigation` redirect
- Store original URL for post-login redirect (optional enhancement)

**Definition of Done:**
- Middleware protects /settings routes
- Valid sessions allow access
- Invalid/missing sessions redirect to login
- Public routes remain accessible
- Middleware doesn't break static assets

---

## Task 6: Settings Page with Profile Form

**Behavior:** Display protected settings page that loads current user data, renders editable form with all profile fields, and shows user-friendly interface.

**Acceptance Criteria:**
- Given an authenticated user visits /settings
- When the page loads
- Then current user data should be fetched from database
- And form should be pre-populated with existing values
- And all fields should be editable (except email)
- And form should indicate required vs optional fields
- And page should display last updated timestamp

**Test Scenarios:**
- Happy path: User data loads, form pre-populated, renders correctly
- Edge cases: Newly registered user with minimal data, user with all fields filled
- Error cases: Database error loading user data, session valid but user deleted
- UI: Proper labels, placeholders, field types (date picker for DOB, tel for phone)

**Integration Points:**
- Depends on: Database utilities (Task 1), Session middleware (Task 5)
- Provides: Settings page UI, user data display
- Side effects: Queries database for current user data

**Files to Create/Modify:**
- Page: `src/app/settings/page.tsx`
- Tests: `src/app/settings/__tests__/page.test.tsx`
- Components: `src/components/ProfileForm.tsx` (optional extraction)
- Components: `src/components/SuccessMessage.tsx` (reusable)

**Architecture Notes:**
- Server Component for initial data loading
- Fetch user by ID from session
- Client Component for form interactivity (useFormState, useFormStatus)
- Tailwind CSS for responsive styling
- Accessible form (proper labels, ARIA attributes)
- Email field disabled/read-only (change email flow separate)
- Show "Last updated: [timestamp]" below form

**Definition of Done:**
- Settings page loads for authenticated users
- Form pre-populated with current data
- All fields editable except email
- Responsive design works on mobile
- Accessibility standards met

---

## Task 7: Profile Update Server Action

**Behavior:** Process profile update form submission, validate inputs, update user record in database with timestamp, and return success confirmation.

**Acceptance Criteria:**
- Given an authenticated user submits updated profile data
- When the Server Action processes the request
- Then input validation should be performed
- And valid data should update the user record
- And updated_at timestamp should be set to current time
- And success response should be returned with confirmation message
- And validation errors should be returned for invalid inputs
- And page should revalidate to show updated data and timestamp

**Test Scenarios:**
- Happy path: Valid updates save successfully, timestamp updated, success message shown
- Validation: Invalid phone format, future date of birth, field length violations
- Edge cases: Clearing optional fields (set to null), special characters, unicode
- Error cases: Database update failure, session valid but user not found
- Concurrent updates: Last write wins (timestamp reflects latest update)

**Integration Points:**
- Depends on: Database utilities (Task 1), Auth utilities (Task 2)
- Provides: Profile update endpoint
- Side effects: Updates user record, sets updated_at timestamp

**Files to Create/Modify:**
- Action: `src/app/settings/actions.ts`
- Tests: `src/app/settings/__tests__/actions.test.ts`
- Validation: `src/lib/validation.ts` (shared validation functions)

**Architecture Notes:**
- Server Action with 'use server' directive
- Validate session and extract user ID
- Input validation rules:
  - Email: Not modifiable in this action
  - Name: Required, 1-100 chars
  - Phone: Optional, basic format (digits, dashes, spaces, parentheses)
  - Address: Optional, max 500 chars
  - Date of Birth: Optional, valid date, not future, reasonable age (13-120)
  - Job Title: Optional, max 100 chars
- SQL: UPDATE users SET name=$1, phone=$2, address=$3, date_of_birth=$4, job_title=$5, updated_at=NOW() WHERE id=$6
- Return: { success: true, message: "Profile updated successfully" } or { success: false, error: "...", fieldErrors: {...} }
- Use revalidatePath('/settings') after successful update

**Definition of Done:**
- Profile updates save to database
- Validation enforced on all fields
- Success message displayed after update
- Errors displayed appropriately
- Page revalidates to show new data
- Timestamp updates correctly

---

## Testing Strategy

All tasks must follow @testing/test-driven-development:
1. Write failing test (RED)
2. Write minimal code to pass (GREEN)
3. Refactor while keeping tests green (REFACTOR)

**Unit Tests:**
- Database connection and queries
- Password hashing and verification
- Session creation and validation
- Input validation functions
- Server Actions with mocked dependencies

**Integration Tests:**
- Complete registration flow (form → action → DB → redirect)
- Complete login flow (form → action → session → redirect)
- Profile update flow (load → edit → save → revalidate)
- Middleware protection (authenticated vs unauthenticated)

**Manual Testing Checklist:**
- Register new user with all fields
- Login with created user
- Access settings page (should succeed)
- Update profile with valid data
- Verify changes persist after reload
- Test validation errors
- Test responsive design on mobile
- Test keyboard navigation and accessibility

---

## Security Considerations

**SQL Injection:** All queries use parameterized statements (pg library's $1, $2 syntax)

**XSS:** React escapes output by default, input validation on types

**CSRF:** Server Actions have built-in CSRF protection via Next.js

**Password Security:**
- Bcrypt hashing with salt rounds: 10
- Minimum 8 characters, letter + number requirement
- Never log or expose passwords

**Session Security:**
- httpOnly cookies (no JavaScript access)
- secure flag (HTTPS only in production)
- sameSite: 'strict' (CSRF protection)
- Encrypted with iron-session

**Rate Limiting:**
- Consider adding rate limiting for login attempts (future enhancement)
- Log failed login attempts

**Data Validation:**
- Server-side validation for all inputs
- Sanitize and validate before database operations
- Maximum field lengths enforced

**Error Messages:**
- Generic messages for authentication failures
- Don't reveal if email exists
- Don't expose internal errors to client

---

## Dependencies to Install

```bash
npm install bcrypt @types/bcrypt iron-session pg @types/pg
```

## Environment Variables Required

```
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=<generate secure random string, min 32 chars>
```

---

**Implementation Order:** Tasks should be executed sequentially 1-7, as each builds on previous tasks.
