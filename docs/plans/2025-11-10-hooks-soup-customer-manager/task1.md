# Task 1: Component Foundation with Hooks Soup

**High-Level Behavior:** Establish the monolithic component file with all state management using individual useState hooks (20+ including three separate cache layers) and all side effects using multiple useEffect hooks (10+) with overlapping dependencies that create race conditions.

**Depends On:** None

**Provides To:** All other tasks (Task 2, 3, 4, 5, 6) - provides the component foundation and state management

**Subtasks:**
- 1.1: Create component file with all useState hooks (20+ individual state variables including three cache layers)
- 1.2: Add all useEffect hooks (10+) for side effects with overlapping dependencies and cache synchronization attempts

**Execution Flow:**
1. Execute 1.1 to create component structure with state including cachedCustomers, localStorage, sessionStorage states
2. Execute 1.2 to add side effects that attempt to sync caches but create race conditions
