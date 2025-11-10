# Task 3.2: Implement Data Loading Effect

**Agent Context:** You are implementing the data loading logic that runs when the component mounts, loading cached data immediately then fetching fresh data from the API.

**Behavior:** Create a useEffect hook that loads customer data from localStorage first (instant display), then fetches from API, and updates both state and localStorage with fresh data.

**Acceptance Criteria:**
- Given the component has mounted
- When the useEffect runs
- Then it immediately loads data from storageService.loadFromStorage()
- And sets customers state with cached data (instant display)
- And sets loading to false if cached data exists
- And calls apiService.fetchCustomers()
- And when API responds, updates customers state with fresh data
- And saves fresh data to localStorage via storageService.saveToStorage()
- And sets loading to false after API completes
- And sets error state if API call fails
- And useEffect has empty dependency array (runs once on mount)

**Test Scenarios:**
- **Happy path with cache:** Cached data loads instantly, then replaced by fresh API data
- **Happy path no cache:** Shows loading, then displays API data
- **API error:** Error state set, cached data remains visible
- **API success:** Fresh data replaces cache, localStorage updated
- **Loading states:** loading true initially, false after data loads
- **Error recovery:** Error state cleared on successful load

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add useEffect after state hooks)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** All state hooks from Task 3.1, storageService from Task 2.1, apiService from Task 1.2
- **Interfaces to provide:** Data loading behavior for component initialization

**Architecture Constraints:**
- Add React.useEffect import if not already present
- Place useEffect immediately after all useState hooks
- Use async/await inside useEffect (wrap in async IIFE)
- Empty dependency array: useEffect(() => { ... }, [])
- Flow: loadFromStorage → set state → fetchCustomers → set state → saveToStorage
- Set loading to true initially (via useState default)
- Set loading to false after API call completes (both success and error)
- Clear error state before API call, set on catch
- Use try-catch for error handling

**Definition of Done:**
- useEffect hook added after state hooks
- Loads from localStorage first
- Fetches from API second
- Updates state with both cached and fresh data
- Saves fresh data to localStorage
- Handles loading and error states correctly
- Empty dependency array ensures single run on mount
- TypeScript compiles without errors
