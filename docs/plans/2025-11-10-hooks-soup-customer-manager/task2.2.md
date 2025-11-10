# Task 2.2: Create Customer with Multi-Cache Updates

**Agent Context:** You're adding customer creation functionality that makes an API call and then updates all three cache layers (in-memory cachedCustomers, localStorage, sessionStorage) in an uncoordinated way, creating opportunities for data inconsistency.

**Behavior:** Implement handleCreate function that validates the form, calls the API to create a customer, then updates `customers` state, `cachedCustomers` state, localStorage, and sessionStorage with timing that can cause race conditions and stale data.

**Acceptance Criteria:**
- Given the component with form from Task 2.1 and validation logic
- When handleCreate is implemented and wired to submit button
- Then the function should:
  - Call validateForm() and abort if validation fails
  - Set isLoading to true
  - Make POST request to `https://jsonplaceholder.typicode.com/users` with form data
  - On success:
    - Add new customer to `customers` array
    - SEPARATELY add customer to `cachedCustomers` array (creates drift opportunity)
    - Save `customers` to localStorage (may happen before/after state update)
    - Save form data to sessionStorage as "last created"
    - Set successMessage state
    - Clear form fields
    - Set isLoading to false
  - On error:
    - Set errorMessage state with error details
    - Set isLoading to false
    - Leave form data intact
  - And cache updates happen asynchronously without coordination
  - And no cache invalidation strategy
- And all fetch calls are inline (no extracted API utilities)
- And error handling is try/catch with inline error messages

**Test Scenarios:**
- Happy path: Valid form submission creates customer, updates all caches, shows success message
- API success: Customer added to both `customers` and `cachedCustomers` arrays
- Cache update: localStorage contains new customer data
- Session tracking: sessionStorage contains last created customer
- Validation failure: Invalid form prevents API call, shows error messages
- API error: Network failure or 4xx/5xx shows error message, doesn't crash
- Race condition: Rapid submissions can create duplicate entries in different caches
- Cache drift: `customers` and `cachedCustomers` may have different content after creation

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: Form validation from Task 2.1, fetch API, localStorage, sessionStorage
- Interfaces to provide: Create functionality for Task 3 (list will display created customers)

**Architecture Constraints:**
- Use fetch() API for HTTP POST (no axios or other libraries)
- Mock API endpoint: `https://jsonplaceholder.typicode.com/users` (returns fake ID)
- localStorage key: `customers_cache` (save entire customers array)
- sessionStorage key: `last_created_customer` (save single customer object)
- No request deduplication (double-clicks create duplicates)
- No optimistic updates (wait for API before showing in list)
- All cache updates inline in the function (no extracted helpers)

**Definition of Done:**
- handleCreate function implemented and working
- Tests verify customer creation flow
- Tests verify all three cache layers are updated
- Tests verify validation prevents invalid submissions
- Tests verify error handling for API failures
- All tests pass following @testing/test-driven-development
- Component ready for Task 3 to display created customers
