# Task 6.1: Massive Single JSX Return Statement

**Agent Context:** You're building a monolithic render method with 200+ lines of inline JSX that contains all UI sections without extracted components. All previous tasks built functionality; this task integrates everything into one massive return statement with deeply nested conditionals.

**Behavior:** Create a single massive return statement (200+ lines) that contains all UI sections: header, search bar, sort dropdown, form (with conditional "Create" vs "Edit" mode), validation errors, customer table, loading spinner, success/error toasts, delete confirmation modal - all inline without subcomponents.

**Acceptance Criteria:**
- Given the component with all functionality from Tasks 1-5
- When the massive JSX return statement is created
- Then the component should render:
  - Header section: Title "Customer Manager", customer count (may be wrong due to cache)
  - Search section: Search input, sort dropdown (from Task 3.2)
  - Form section: Four inputs with labels, conditional submit button text ("Create" vs "Update")
  - Validation errors: Inline error messages below each field
  - Customer table: Headers, map over filtered/sorted customers, Edit/Delete buttons per row
  - Loading overlay: Spinner when isLoading true (covers whole page)
  - Success toast: Green message when successMessage set (auto-dismiss)
  - Error toast: Red message when errorMessage set (auto-dismiss)
  - Delete modal: Inline modal with confirmation when showDeleteModal true
  - Cache indicator: Small text showing "Data from cache" or similar (lies about which cache)
- And everything in one return statement (no extracted components)
- And deeply nested ternaries and && operators for conditionals
- And no JSX variables or section extraction
- And reaches 200+ lines of JSX

**Test Scenarios:**
- Happy path: Component renders all sections without errors
- Conditional rendering: Form shows "Create Customer" when not editing, "Update Customer" when editing
- Loading state: Spinner overlays everything when isLoading true
- Empty state: "No customers found" shows when filtered list is empty
- Modal rendering: Delete modal only visible when showDeleteModal true
- Toast messages: Success/error toasts display with appropriate styling
- Edit mode: Form pre-populated in edit mode, button says "Update"
- Cache confusion: Count may not match table rows due to cache drift
- Nested conditionals: Multiple levels of ternary operators for different states

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: All functionality from Tasks 1-5, all state hooks
- Interfaces to provide: Complete UI structure for Task 6.2 to add inline styling

**Architecture Constraints:**
- Single return statement with all JSX inline
- No extracted components (CustomerRow, FormField, Modal, etc.)
- Conditional rendering with inline ternaries: `{isEditing ? "Update" : "Create"}`
- Nested conditionals: `{isLoading ? <Spinner /> : customers.length ? <Table /> : <Empty />}`
- Filter and sort inline in map: `{customers.filter(...).sort(...).map(...)}`
- No JSX fragments or section variables
- Target 200+ lines of JSX (measure from return to closing tag)

**Definition of Done:**
- Single massive return statement created
- All UI sections rendered inline
- JSX exceeds 200 lines
- Tests verify all sections render correctly
- Tests verify conditional states (loading, edit mode, empty, modal)
- No extracted subcomponents
- All tests pass following @testing/test-driven-development
- Component ready for Task 6.2 to add inline styling to reach 500+ total lines
