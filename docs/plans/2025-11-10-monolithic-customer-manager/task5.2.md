# Task 5.2: Implement Table Structure with Headers and Add Button

**Agent Context:** You are implementing the main table structure that will display the customer list, including headers and the add customer button.

**Behavior:** Create the HTML table structure with proper headers and an "Add Customer" button that triggers add mode.

**Acceptance Criteria:**
- Given the component has loaded data
- When rendering the table section
- Then display "Customer Management" heading (h1 or h2)
- And display "Add Customer" button that calls handleAdd
- And if customers array is empty, show "No customers yet. Add one to get started."
- And if customers array has data, show table with headers: Name | Email | Phone | Actions
- And table uses standard HTML table elements (table, thead, tbody, tr, th, td)
- And table structure is ready for rows to be rendered

**Test Scenarios:**
- **Empty state:** Shows empty state message when no customers
- **With customers:** Shows table headers
- **Add button:** Button is always visible, calls handleAdd when clicked
- **Table structure:** Proper semantic HTML table structure
- **Headers:** All four column headers present

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add table structure to return JSX)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** State (customers) from Task 3.1, handleAdd from Task 4.1
- **Interfaces to provide:** Table structure ready for row rendering in Task 5.3

**Architecture Constraints:**
- Add table after error alert section in JSX
- Structure: heading → add button → (empty state OR table)
- Conditional rendering: {customers.length === 0 ? emptyState : table}
- Table headers in thead/tr/th
- tbody ready for rows (tbody will be populated in Task 5.3)
- Add button: <button onClick={handleAdd}>Add Customer</button>
- Basic styling for table borders and spacing
- Responsive design not required, but table should be functional

**Definition of Done:**
- "Customer Management" heading rendered
- "Add Customer" button rendered and wired to handleAdd
- Empty state message for no customers
- Table structure with four column headers
- Proper HTML table elements used
- Table tbody ready for row content
- Basic styling applied
- TypeScript compiles without errors
