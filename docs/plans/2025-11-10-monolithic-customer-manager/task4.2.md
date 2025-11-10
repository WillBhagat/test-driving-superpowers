# Task 4.2: Implement Edit/Update Customer Handlers

**Agent Context:** You are implementing the handlers that allow users to edit existing customers, including entering edit mode with pre-filled data and saving updates.

**Behavior:** Create handler functions for initiating edit mode with existing customer data and updating customers via API.

**Acceptance Criteria:**
- Given the need to edit existing customers
- When implementing edit handlers
- Then handleEdit(customer) sets editingId to customer.id and editForm to customer data
- And handleSave() now handles both create (editingId === 'new') and update cases
- And for update case, validates form data
- And if validation passes, calls apiService.updateCustomer(editingId, editForm)
- And on success, updates customers state by replacing old customer with updated one
- And saves updated list to localStorage
- And exits edit mode
- And on API error, sets error state

**Test Scenarios:**
- **Start edit mode:** handleEdit populates editForm with existing customer data
- **Edit existing customer:** editingId set to actual customer ID (not 'new')
- **Input changes:** handleInputChange updates editForm (shared with create)
- **Validation failure:** Invalid data shows error, doesn't call API
- **Update success:** Customer updated in list, localStorage updated, edit mode cleared
- **Update error:** Error displayed, edit mode remains active
- **Cancel edit:** Edit mode cleared, changes discarded

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (modify handleSave, add handleEdit)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** State hooks from Task 3.1, handlers from Task 4.1 (handleSave, handleCancel reused)
- **Interfaces to provide:** handleEdit function, enhanced handleSave that handles both create and update

**Architecture Constraints:**
- Add handleEdit: (customer: Customer) => void
- Modify existing handleSave to branch on editingId === 'new'
- For update: use apiService.updateCustomer(editingId, editForm)
- Update customers state using map() to replace matching customer
- Use same validation, error handling, and localStorage update patterns
- handleInputChange and handleCancel work for both create and update (no changes needed)
- Place handleEdit near other handlers

**Definition of Done:**
- handleEdit function defined
- handleSave modified to handle both create and update cases
- Update case calls correct API method with ID
- Customers state correctly updated (replace existing customer)
- localStorage updated after successful edit
- Validation and error handling consistent with create
- Code maintains single responsibility per handler
