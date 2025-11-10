# Task 3.2: Inline Search/Filter/Sort with sessionStorage

**Agent Context:** You're adding search, filter, and sort functionality that applies logic inline in the render method and stores preferences in sessionStorage, creating more opportunities for cache confusion and showing results that don't match the actual data.

**Behavior:** Add search input, sort dropdown, and inline filtering/sorting logic that runs during render. Store search preferences in sessionStorage and retrieve them on mount, which may reference customer IDs or data that doesn't exist in other caches.

**Acceptance Criteria:**
- Given the component with customer list from Task 3.1
- When search and sort UI and logic are added
- Then the component should have:
  - Search input that updates searchTerm state on change
  - Sort dropdown with options: "Name A-Z", "Name Z-A", "Email A-Z"
  - Inline filter logic in render: `customers.filter(c => c.name.includes(searchTerm))`
  - Inline sort logic after filter: `.sort((a,b) => /* inline comparison */)`
  - Chained filter and sort: `customers.filter(...).sort(...).map(...)`
  - Save search term and sort preference to sessionStorage on change
  - Load search preferences from sessionStorage on mount (via useEffect from 1.2)
  - May filter customers that don't exist in current cache (stale IDs from sessionStorage)
  - No debouncing (searches on every keystroke)
- And all filter/sort logic is duplicated inline (not extracted)
- And sessionStorage may have search term for deleted customers
- And no indication when search results are stale

**Test Scenarios:**
- Happy path: Search filters customers by name, sort changes order
- Search functionality: Typing updates results immediately (no debounce despite useEffect in 1.2)
- Sort functionality: Dropdown changes order customers are displayed
- Chained operations: Filter then sort produces correct order
- Empty results: Search for non-existent customer shows "No customers found"
- Stale search: sessionStorage has search for deleted customer, shows empty results confusingly
- Case sensitivity: Search is case-sensitive (no toLowerCase)
- Performance: Every keystroke triggers full filter+sort+render (no optimization)
- Cache mismatch: Searching `cachedCustomers` but displaying `customers` results

**Agent-Specific Context:**
- Files to edit: `src/app/customers/page.jsx`
- Tests to update: `src/app/customers/__tests__/page.test.jsx`
- Dependencies available: State hooks from Task 1, list rendering from Task 3.1
- Interfaces to provide: Filtered/sorted list for Tasks 4-5 to operate on

**Architecture Constraints:**
- All filter/sort logic inline in JSX or render method
- sessionStorage key: `customer_search_prefs` (object with searchTerm, sortBy, sortOrder)
- No useMemo or optimization (recalculates on every render)
- Filter and sort logic duplicated if needed elsewhere
- String comparison for sort (no locale comparison)
- Search checks name field only (not email or phone)

**Definition of Done:**
- Search input and sort dropdown added to UI
- Inline filter and sort logic works
- Tests verify search filters correctly
- Tests verify sort changes order
- Tests verify sessionStorage saves/loads preferences
- Tests verify stale search scenarios
- All tests pass following @testing/test-driven-development
- Component ready for Tasks 4-5 with filtered/sorted list
