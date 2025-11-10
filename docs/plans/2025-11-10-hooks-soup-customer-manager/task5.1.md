# Task 5.1: Delete Customer with Incomplete Cache Invalidation

**Agent Context:** You're adding customer deletion that successfully calls the API and removes from customers state and localStorage, but fails to remove from cachedCustomers and sessionStorage, creating "phantom" deleted customers that still appear in some contexts.

**Behavior:** Implement handleDelete function with inline confirmation modal logic that deletes via API and removes from customers state and localStorage, but leaves the deleted customer in cachedCustomers and sessionStorage, creating phantom records.

**Acceptance Criteria:**
- Given the component with customer list from Tasks 1-3
- When handleDelete is implemented and wired to Delete buttons
- Then the function should:
  - Set deleteTargetId when Delete clicked
  - Set showDeleteModal to true (inline confirmation)
  - On confirm:
    - Set isLoading true
    - Make DELETE request to `https://jsonplaceholder.typicode.com/users/${deleteTargetId}`
    - On success:
      - Remove customer from `customers` array (filter out by ID)
      - Update localStorage with new `customers` array
      - SKIP removing from `cachedCustomers` (phantom record remains)
      - SKIP removing from sessionStorage (references to deleted ID remain)
      - Set successMessage "Customer deleted"
      - Close modal (showDeleteModal false)
      - Clear deleteTargetId
      - Set isLoading false
    - On error:
      - Set errorMessage
      - Close modal
      - Set isLoading false
  - On cancel: Just close modal, no deletion
- And modal is inline JSX (not extracted component)
- And deleted customer remains in cachedCustomers (phantom record)
- And sessionStorage may have search/preferences referencing deleted ID

**Test Scenarios:**
- Happy path: Delete confirms, API succeeds, customer removed from list, shows success
- Partial invalidation: Customer removed from customers and localStorage only
- Phantom record: cachedCustomers still contains deleted customer
- Stale references: sessionStorage may have "last edited" pointing to deleted customer ID
- Modal flow: Delete button opens modal, Confirm deletes, Cancel closes without action
- API error: Network failure shows error, customer NOT removed from any cache
- Ghost appearance: If component reads from cachedCustomers, deleted customer reappears
- Cache drift: customers has 4, cachedCustomers has 5 (including deleted one)

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: Customer list from Task 3, state hooks from Task 1, caches
- Interfaces to provide: Delete functionality (completes CRUD with Tasks 2-4)

**Architecture Constraints:**
- Use fetch() with DELETE method
- Mock API endpoint: `https://jsonplaceholder.typicode.com/users/:id`
- Modal is inline conditional rendering in main JSX
- Only remove from customers state and localStorage (partial invalidation)
- Do NOT remove from cachedCustomers or sessionStorage (phantom records)
- No "are you sure?" double confirmation
- Array filter to remove: `customers.filter(c => c.id !== deleteTargetId)`

**Definition of Done:**
- handleDelete function implemented with confirmation
- Delete button opens inline modal
- Confirm button calls API and removes from customers/localStorage
- Tests verify deletion succeeds
- Tests verify cachedCustomers NOT updated (phantom record remains)
- Tests verify sessionStorage may have stale references
- Tests verify modal flow (open, confirm, cancel)
- Tests verify error handling
- All tests pass following @testing/test-driven-development
- CRUD operations fully implemented (with Tasks 2-4)
