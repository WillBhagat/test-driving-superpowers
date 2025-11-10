# Task 3.1: Set Up Component State Hooks

**Agent Context:** You are creating the main React component function and initializing all state management hooks needed for the customer manager.

**Behavior:** Define the CustomerManager component function and set up all useState hooks for managing customers, loading states, errors, and edit mode.

**Acceptance Criteria:**
- Given the need for component state management
- When defining the CustomerManager component
- Then it has useState for customers (Customer[] initialized to empty array)
- And useState for loading (boolean initialized to true)
- And useState for error (string | null initialized to null)
- And useState for editingId (string | null initialized to null)
- And useState for editForm (Partial<Customer> initialized to empty object)
- And component function is defined after all service functions
- And component is exported as default

**Test Scenarios:**
- **Initial state:** All state variables initialized with correct default values
- **State types:** TypeScript correctly infers types for all useState hooks
- **Component structure:** Function component follows React conventions

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add component after services)
- **Tests to create:** None for this subtask (state will be tested through behavior)
- **Dependencies available:** Customer interface from Task 1.1, all service functions from Task 1 and Task 2
- **Interfaces to provide:** CustomerManager component function with state hooks accessible to other tasks

**Architecture Constraints:**
- Define as function component: `export default function CustomerManager() { ... }`
- Place component definition after all service objects
- Use React.useState (ensure React is imported)
- Initialize all five state variables at the top of component function
- Order: customers, loading, error, editingId, editForm
- Add proper TypeScript types for all state
- Component should have empty return statement for now (return null or empty div)

**Definition of Done:**
- CustomerManager component function defined
- All five useState hooks properly typed and initialized
- Component exported as default
- File structure: imports → interfaces → services → component
- TypeScript compiles without errors
