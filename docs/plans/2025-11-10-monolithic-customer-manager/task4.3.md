# Task 4.3: Implement Delete Customer Handler

**Agent Context:** You are implementing the handler that allows users to delete customers from the system with proper state and cache updates.

**Behavior:** Create a handler function that calls the delete API and removes the customer from state and localStorage.

**Acceptance Criteria:**
- Given the need to delete customers
- When implementing delete handler
- Then handleDelete(id) calls apiService.deleteCustomer(id)
- And on success, removes customer from customers state
- And updates localStorage with new customer list
- And clears error state
- And on API error, sets error state with error message
- And delete operation doesn't require validation

**Test Scenarios:**
- **Delete success:** Customer removed from list, localStorage updated
- **Delete error:** Error displayed, customer remains in list
- **Multiple deletes:** Can delete multiple customers sequentially
- **Delete last customer:** Works correctly when deleting the last remaining customer
- **State consistency:** Deleted customer immediately removed from UI

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add handleDelete handler)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** State hooks from Task 3.1, apiService from Task 1.2, storageService from Task 2.1
- **Interfaces to provide:** handleDelete function for UI binding

**Architecture Constraints:**
- Define handleDelete: (id: string) => Promise<void>
- Use async/await
- Place near other handlers (after handleEdit)
- Wrap API call in try-catch
- Filter customers state to remove deleted customer
- Use customers.filter(c => c.id !== id)
- Save updated list to localStorage
- Clear error state on success, set on failure
- No confirmation dialog needed (assumed handled by UI or accepted as requirement)

**Definition of Done:**
- handleDelete function defined and properly typed
- API call to deleteCustomer
- Customer removed from state on success
- localStorage updated after delete
- Error handling for API failures
- Code placed with other handlers
- TypeScript compiles without errors
