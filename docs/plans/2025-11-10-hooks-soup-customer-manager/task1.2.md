# Task 1.2: Add useEffect Hooks with Race Conditions

**Agent Context:** You're adding side effects to the monolithic component that will attempt to synchronize three separate cache layers but will create race conditions and data inconsistency. The component already has 20+ useState hooks including `customers`, `cachedCustomers`, and flags for localStorage and sessionStorage.

**Behavior:** Add 10+ useEffect hooks with overlapping dependencies that attempt to sync the three cache layers (in-memory, localStorage, sessionStorage) but create race conditions and stale data issues.

**Acceptance Criteria:**
- Given the component from Task 1.1 with 20+ useState hooks
- When useEffect hooks are added
- Then the component should have 10+ useEffect hooks including:
  - Initial load: Fetch from localStorage on mount, then from API
  - Cache sync 1: Save `customers` to localStorage on every change (may overwrite newer data)
  - Cache sync 2: Update `cachedCustomers` when `customers` changes (delayed, creates staleness)
  - Cache sync 3: Save search preferences to sessionStorage when `searchTerm` or `sortBy` changes
  - Cache sync 4: Load from `cachedCustomers` if `customers` is empty (may serve stale data)
  - Auto-save: Save draft form data to sessionStorage every 2 seconds when editing
  - Message cleanup: Clear success/error messages after 3 seconds with setTimeout
  - Search debounce: Debounce search term updates with setTimeout (conflicts with sync)
  - Stale check: Periodically check localStorage and merge with state (creates conflicts)
  - Initial API: Fetch customers from API on mount (may conflict with localStorage load)
- And useEffect hooks have overlapping dependencies causing multiple effects to fire for single state changes
- And no cleanup functions or proper dependency arrays (intentionally causing issues)

**Test Scenarios:**
- Happy path: All useEffect hooks execute without throwing errors
- Race condition: Rapid state changes trigger multiple overlapping useEffect calls
- Cache conflict: localStorage data loaded while API call is in flight, last one wins randomly
- Stale data: `cachedCustomers` served instead of fresh `customers` when customers is empty
- Memory leak: setTimeout calls not cleaned up properly
- Dependency chaos: Single state change triggers 3+ useEffect hooks

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx` (from Task 1.1)
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: React hooks (useState, useEffect), Web APIs (localStorage, sessionStorage)
- Interfaces to provide: Component with full state and side effects for Tasks 2-6 to build CRUD operations on

**Architecture Constraints:**
- Use mock API endpoint: `https://jsonplaceholder.typicode.com/users` (free fake API)
- localStorage key: `customers_cache`
- sessionStorage keys: `customer_search_prefs`, `customer_draft_form`
- No cleanup functions in useEffect (intentionally creating memory leaks)
- Overlapping dependencies between effects (intentionally creating race conditions)
- No proper loading states before cache operations (causes flashing/jumping)

**Definition of Done:**
- Component has 10+ useEffect hooks
- Tests verify race conditions can occur (e.g., rapid state changes)
- Tests verify multiple cache layers are accessed
- All tests pass following @testing/test-driven-development
- useEffect hooks intentionally lack proper cleanup/dependencies
- Component ready for Tasks 2-6 to add CRUD operations
