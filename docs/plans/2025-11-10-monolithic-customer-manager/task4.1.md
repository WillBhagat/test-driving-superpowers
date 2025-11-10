# Task 4.1: Implement Add/Create Customer Handlers

**Agent Context:** You are implementing the handlers that allow users to add new customers, including entering add mode, handling input changes, and saving the new customer.

**Behavior:** Create handler functions for initiating add mode, updating form inputs, and saving new customers with validation and API calls.

**Acceptance Criteria:**
- Given the need to add new customers
- When implementing add handlers
- Then handleAdd() sets editingId to 'new' and initializes editForm to empty object
- And handleInputChange(field, value) updates editForm state with new field values
- And handleSave() validates the form using validationService
- And if validation fails, sets error state with validation messages
- And if validation passes, calls apiService.createCustomer()
- And on success, updates customers state, saves to localStorage, exits edit mode
- And on API error, sets error state with error message
- And handleCancel() clears editingId and editForm

**Test Scenarios:**
- **Start add mode:** handleAdd sets editingId to 'new', editForm to {}
- **Input changes:** handleInputChange updates editForm correctly
- **Validation failure:** Invalid data shows error, doesn't call API
- **Validation success:** Valid data calls API, updates state
- **API success:** New customer added to list, localStorage updated, edit mode cleared
- **API error:** Error displayed, edit mode remains active
- **Cancel:** Edit mode cleared, form reset

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add handlers after useEffect)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** State hooks from Task 3.1, validationService from Task 2.2, apiService from Task 1.2, storageService from Task 2.1
- **Interfaces to provide:** handleAdd, handleInputChange, handleSave, handleCancel functions for UI binding

**Architecture Constraints:**
- Define handlers as const functions inside component
- Place after useEffect, before render logic
- handleAdd: () => void
- handleInputChange: (field: keyof Customer, value: string) => void
- handleSave: () => Promise<void>
- handleCancel: () => void
- Use async/await for handleSave
- Wrap API calls in try-catch
- Update error state for both validation and API errors
- Clear error state at start of handleSave
- Format validation errors into single error message string

**Definition of Done:**
- Four handler functions defined (handleAdd, handleInputChange, handleSave, handleCancel)
- handleSave validates before API call
- Validation errors displayed to user
- API success updates state and localStorage
- API errors handled gracefully
- All handlers properly typed
- Code placed after useEffect in component
