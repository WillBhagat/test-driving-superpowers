# Task 1.1: Create Component with useState Hooks Soup

**Agent Context:** You're creating the foundation of a monolithic React component that intentionally mixes concerns. This component will manage customer data using 20+ individual useState hooks including three separate, uncoordinated cache layers that will drift out of sync.

**Behavior:** Create a Next.js page component at `src/app/customers/page.jsx` with 20+ individual useState hooks for all state management needs, including three separate cache states that are NOT synchronized.

**Acceptance Criteria:**
- Given a new Next.js application
- When the component is created
- Then it should have individual useState hooks for:
  - Form fields: `customerName`, `customerEmail`, `customerPhone`, `customerAddress`
  - Validation: `nameError`, `emailError`, `phoneError`, `addressError`, `generalError`
  - UI state: `isLoading`, `isEditing`, `editingId`, `showDeleteModal`, `deleteTargetId`
  - Search/sort: `searchTerm`, `sortBy`, `sortOrder`
  - Messages: `successMessage`, `errorMessage`, `lastSaved`
  - **Cache Layer 1 - In-Memory:** `cachedCustomers` (separate from customers, will drift out of sync)
  - **Cache Layer 2 - localStorage:** `localStorageLoaded` (flag for localStorage state)
  - **Cache Layer 3 - sessionStorage:** `sessionStorageLoaded` (flag for sessionStorage state)
  - Data: `customers` (primary data that conflicts with cachedCustomers)
- And NO combined state objects (each piece of state is separate)
- And the component exports as default

**Test Scenarios:**
- Happy path: Component renders without errors, all hooks initialized with appropriate default values
- Edge case: Component has exactly 20+ separate useState hooks
- Verification: Count of useState calls should be 20 or more
- Architecture: Component is a 'use client' directive functional component (Next.js App Router)

**Agent-Specific Context:**
- Files to create: `src/app/customers/page.jsx`
- Tests to create: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: React 19.2.0, Next.js 16.0.1
- Interfaces to provide: Component foundation with 20+ state hooks for Task 1.2 to add useEffect hooks to

**Architecture Constraints:**
- Use 'use client' directive (required for hooks in Next.js App Router)
- Functional component with hooks only (no class component)
- Each state variable gets its own useState hook (no useState objects)
- Three separate cache-related states (`cachedCustomers`, `localStorageLoaded`, `sessionStorageLoaded`)
- Initialize all states with sensible defaults (empty strings, false, null, empty arrays as appropriate)

**Definition of Done:**
- Component file exists at `src/app/customers/page.jsx`
- Component has 20+ individual useState hooks
- All tests pass following @testing/test-driven-development
- Component uses 'use client' directive
- Provides foundation for Task 1.2 to add useEffect hooks
