# Task 4.2: Update Customer with Partial Cache Updates

**Agent Context:** You're adding customer update functionality that calls the API but only updates some of the three cache layers, creating data inconsistency where different caches show different versions of the customer.

**Behavior:** Implement handleUpdate function that validates form, calls API to update customer, then updates `customers` state and localStorage but NOT cachedCustomers or sessionStorage, causing those caches to show stale data.

**Acceptance Criteria:**
- Given the component in edit mode from Task 4.1 with editingId set
- When handleUpdate is implemented and wired to submit button (when isEditing true)
- Then the function should:
  - Call validateForm() (duplicated from Task 2.1)
  - Abort if validation fails
  - Set isLoading true
  - Make PUT request to `https://jsonplaceholder.typicode.com/users/${editingId}` with form data
  - On success:
    - Update customer in `customers` array (find by ID, replace)
    - Update localStorage with new `customers` array
    - SKIP updating `cachedCustomers` (leaves it stale)
    - SKIP updating sessionStorage (leaves it stale)
    - Set successMessage
    - Clear isEditing and editingId
    - Clear form fields
    - Set isLoading false
  - On error:
    - Set errorMessage
    - Leave edit mode active
    - Set isLoading false
- And cache inconsistency intentional (some caches updated, others not)
- And no conflict resolution if data changed since edit started

**Test Scenarios:**
- Happy path: Valid update succeeds, updates customers and localStorage, shows success
- Partial cache update: customers array updated, cachedCustomers NOT updated
- localStorage synced: localStorage contains updated customer
- sessionStorage stale: sessionStorage still has old customer data
- Cache drift confirmed: customers and cachedCustomers now have different data for same ID
- Validation failure: Invalid form prevents update, stays in edit mode
- API error: Network failure shows error, stays in edit mode, data not corrupted
- Stale overwrite: Editing stale data from cachedCustomers overwrites newer data in API

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: Edit mode from Task 4.1, validation from Task 2.1, caches from Task 1
- Interfaces to provide: Update functionality (complete CRUD with Tasks 2, 3, 5)

**Architecture Constraints:**
- Use fetch() with PUT method
- Mock API endpoint: `https://jsonplaceholder.typicode.com/users/:id`
- Only update customers state and localStorage (intentional partial sync)
- Do NOT update cachedCustomers or sessionStorage (creates staleness)
- Validation logic duplicated from Task 2.1 (same inline validation)
- No ETag or version checking for conflicts
- Array update uses .map() to find and replace customer

**Definition of Done:**
- handleUpdate function implemented
- Tests verify update succeeds with valid data
- Tests verify only customers and localStorage updated
- Tests verify cachedCustomers remains stale after update
- Tests verify validation and error handling
- Tests confirm cache drift after update
- All tests pass following @testing/test-driven-development
- CRUD operations complete (with Tasks 2, 3, 5)
