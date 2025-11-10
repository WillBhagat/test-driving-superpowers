# Task 5.3: Implement Inline Editable Rows

**Agent Context:** You are implementing the table rows that can switch between view mode (displaying data) and edit mode (input fields) based on editingId state.

**Behavior:** Create row rendering logic that maps over customers and displays either view mode or edit mode for each row, with special handling for the "new" row when adding a customer.

**Acceptance Criteria:**
- Given the customers array and editingId state
- When rendering table rows
- Then if editingId === 'new', render an edit row at the top with empty fields
- And for each customer, check if customer.id === editingId
- And if editing, render input fields for name, email, phone
- And if not editing, render plain text for name, email, phone
- And view mode has Edit and Delete buttons
- And edit mode has Save and Cancel buttons
- And input fields call handleInputChange on change
- And Save button calls handleSave
- And Cancel button calls handleCancel
- And Edit button calls handleEdit(customer)
- And Delete button calls handleDelete(customer.id)
- And buttons are disabled during loading operations

**Test Scenarios:**
- **View mode:** Customer data displayed as text with Edit/Delete buttons
- **Edit mode:** Input fields displayed with current values, Save/Cancel buttons
- **Add mode:** Empty row at top with input fields when editingId === 'new'
- **Single edit:** Only one row in edit mode at a time
- **Input changes:** Typing in inputs updates editForm via handleInputChange
- **Save:** Calls handleSave, exits edit mode on success
- **Cancel:** Exits edit mode, discards changes
- **Delete:** Removes customer from list

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add row rendering to tbody)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** State (customers, editingId, editForm, loading) from Task 3.1, all handlers from Task 4
- **Interfaces to provide:** Complete, functional UI

**Architecture Constraints:**
- Render add row first if editingId === 'new'
- Map over customers array to render each row
- Conditional rendering: editingId === customer.id ? editRow : viewRow
- View row: td elements with text, td with Edit/Delete buttons
- Edit row: td elements with input fields, td with Save/Cancel buttons
- Input value: editForm[field] || ''
- Input onChange: (e) => handleInputChange(field, e.target.value)
- Disable buttons when loading or during API operations (optional enhancement)
- Basic input styling: border, padding
- Button styling: distinguish Save (green/primary) from Cancel/Delete (red)

**Definition of Done:**
- Table tbody renders all customer rows
- Add row appears at top when in add mode
- Each row switches between view and edit modes correctly
- All handlers properly wired to buttons and inputs
- Input fields update editForm state
- View mode shows data and Edit/Delete buttons
- Edit mode shows inputs and Save/Cancel buttons
- Basic styling for usability
- Complete component is ~500-550 lines
- Component is functional and ready for use
- TypeScript compiles without errors
