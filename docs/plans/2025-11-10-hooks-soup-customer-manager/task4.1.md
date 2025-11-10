# Task 4.1: Edit Mode with Stale Cache Reads

**Agent Context:** You're adding edit mode that populates the form with existing customer data, but the data may come from the wrong cache layer (cachedCustomers instead of customers), leading to users editing stale data.

**Behavior:** Implement handleEdit function that switches to edit mode, sets editingId, and populates form fields with customer data that may be read from cachedCustomers (stale) instead of customers (fresh).

**Acceptance Criteria:**
- Given the component with customer list and form from Tasks 1-3
- When handleEdit is implemented and wired to Edit buttons
- Then the function should:
  - Find customer by ID in the data source
  - Check `customers` array first, but fall back to `cachedCustomers` if not found
  - May load stale data if customer was updated but cachedCustomers wasn't synced
  - Set isEditing to true
  - Set editingId to customer.id
  - Populate form fields (customerName, customerEmail, customerPhone, customerAddress)
  - Scroll to form or make it visible
  - Edit button changes to "Cancel" when in edit mode
- And no indication to user that data might be stale
- And no conflict detection (editing stale data)
- And form validation still duplicated (from Task 2.1)

**Test Scenarios:**
- Happy path: Clicking Edit populates form with customer data, switches to edit mode
- Data population: All form fields filled with correct customer values
- Edit mode indicator: isEditing true, editingId set, button shows "Cancel"
- Stale data: Customer was updated in `customers` but not `cachedCustomers`, shows old data
- Missing customer: Customer in cachedCustomers but deleted from customers, shows stale data
- Cache mismatch: Customer data differs between caches, random which one loads
- Multiple edits: Starting new edit while editing cancels first without saving

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: Customer list from Task 3, form from Task 2, state hooks from Task 1
- Interfaces to provide: Edit mode state for Task 4.2 to implement update functionality

**Architecture Constraints:**
- Customer lookup logic inline in handleEdit function
- Check customers array, fall back to cachedCustomers if not found
- No optimistic locking or version checking
- No "you're editing stale data" warning
- Form fields populated via setState calls (not controlled form pattern)
- Cancel button just clears isEditing and form fields (no confirmation)

**Definition of Done:**
- handleEdit function implemented
- Edit buttons trigger edit mode
- Form populates with customer data (potentially stale)
- Tests verify edit mode activation
- Tests verify form population
- Tests verify stale data scenarios
- All tests pass following @testing/test-driven-development
- Component ready for Task 4.2 to add update functionality
