# Task 2.1: Form JSX with Duplicated Validation

**Agent Context:** You're adding a customer input form to the monolithic component with validation logic that is intentionally duplicated across onChange, onBlur, and onSubmit handlers. This creates maintainability nightmares when validation rules need to change.

**Behavior:** Add form JSX elements (name, email, phone, address inputs) with validation logic duplicated in three places: onChange (live validation), onBlur (field blur validation), and a validation function called before submit.

**Acceptance Criteria:**
- Given the component from Tasks 1.1-1.2 with state hooks
- When form JSX and validation handlers are added
- Then the component should have:
  - Four input fields: name (text), email (email), phone (tel), address (textarea)
  - onChange handlers for each field that update state AND perform inline validation
  - onBlur handlers for each field that duplicate the same validation logic
  - A validateForm() function called on submit that duplicates validation logic a third time
  - Validation rules (duplicated in all three places):
    - Name: required, 2-50 characters
    - Email: required, valid email format (regex)
    - Phone: required, 10-15 digits
    - Address: required, 10-200 characters
  - Error messages displayed below each field from state (nameError, emailError, etc.)
  - Submit button that triggers validation before submission
- And validation logic is copy-pasted (not extracted to a function)
- And validation rules can drift out of sync between handlers

**Test Scenarios:**
- Happy path: Form renders with all inputs, validation works in all three handlers
- Live validation: Typing triggers onChange validation, updates error state immediately
- Blur validation: Leaving field triggers onBlur validation, shows errors
- Submit validation: Clicking submit triggers validateForm(), prevents submission if invalid
- Validation drift: If one validation handler is updated but others aren't, behavior differs
- Edge case: Empty inputs show appropriate error messages
- Edge case: Invalid email format caught by all three validation locations

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: Form state hooks from Task 1.1 (customerName, customerEmail, etc.)
- Interfaces to provide: Form structure and validation for Task 2.2 to add submit functionality

**Architecture Constraints:**
- Duplicate validation logic exactly in onChange, onBlur, and validateForm
- Use inline regex for email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Store each error in separate state hooks (nameError, emailError, phoneError, addressError)
- No extracted validation utility functions (all inline duplication)
- Form is NOT wrapped in <form> tag (handle submit via button onClick)

**Definition of Done:**
- Form JSX added with four input fields
- Validation logic duplicated in three places (onChange, onBlur, validateForm)
- Tests verify validation works in all three handlers
- Tests verify error messages display correctly
- All tests pass following @testing/test-driven-development
- Component ready for Task 2.2 to add create functionality
