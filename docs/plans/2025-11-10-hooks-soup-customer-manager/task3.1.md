# Task 3.1: Customer List Rendering with Inconsistent Cache Reads

**Agent Context:** You're adding customer list display that may inconsistently read from different cache layers (`customers` state, `cachedCustomers`, localStorage) depending on race conditions, showing users potentially stale or conflicting data.

**Behavior:** Render a customer list table that displays data, but the data source may come from `customers`, `cachedCustomers`, or localStorage depending on timing, creating an inconsistent user experience.

**Acceptance Criteria:**
- Given the component with customers data from Tasks 1-2
- When list rendering JSX is added
- Then the component should:
  - Display customers in a table with columns: Name, Email, Phone, Actions
  - Show a loading spinner when isLoading is true
  - Show "No customers found" when no data available
  - Include Edit and Delete buttons for each row
  - Display data from whichever cache loads first (creates inconsistency):
    - If `customers` is empty but `cachedCustomers` has data, show cachedCustomers
    - If localStorage has data but state doesn't, may show localStorage data
    - No explicit "which cache?" logic, just race conditions
  - Include a customer count display that may not match visible rows (cache mismatch)
- And no loading skeleton or graceful loading states
- And no indication to user which cache data is from

**Test Scenarios:**
- Happy path: Customers display in table with all columns
- Empty state: "No customers found" shows when no data
- Loading state: Spinner shows during isLoading
- Cache inconsistency: `customers` has 3 items, `cachedCustomers` has 5, shows either depending on render timing
- Stale data: Deleted customer still appears if cached
- Race condition: Table flashes between different data sources during load
- Count mismatch: Count shows "5 customers" but table displays 3 rows

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: State hooks from Task 1, customers data from Task 2
- Interfaces to provide: List display for Tasks 4-5 to add Edit/Delete functionality

**Architecture Constraints:**
- Table rendered inline in component (no extracted CustomerRow component)
- Use inline conditional rendering: `{isLoading ? <Spinner /> : <Table />}`
- Display logic checks multiple sources: `customers.length ? customers : cachedCustomers`
- No error boundaries for rendering failures
- No memoization (re-renders on every state change)
- Customer count calculated inline with potentially wrong data source

**Definition of Done:**
- Customer list table renders with Name, Email, Phone, Actions columns
- Tests verify list displays customers correctly
- Tests verify loading and empty states
- Tests verify cache inconsistency scenarios
- All tests pass following @testing/test-driven-development
- Component ready for Tasks 4-5 to add Edit/Delete buttons functionality
