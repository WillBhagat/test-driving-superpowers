# Task 2: Inline Create Customer Operations

**High-Level Behavior:** Implement customer creation with form inputs, validation logic duplicated across multiple handlers, inline API calls, and updates to all three cache layers (in-memory, localStorage, sessionStorage) in uncoordinated ways.

**Depends On:** Task 1 (requires state hooks, useEffect foundation, and cache layers)

**Provides To:** Task 3 (customers list needs create functionality), Task 4 (edit reuses form structure)

**Subtasks:**
- 2.1: Implement form JSX with inline validation in onChange, onBlur, and submit handlers (duplicated logic)
- 2.2: Add create customer functionality with inline fetch API call and updates to all three cache layers with race conditions

**Execution Flow:**
1. Execute 2.1 to build form with duplicated validation
2. Execute 2.2 to add create functionality that updates API, in-memory cache, localStorage, and sessionStorage asynchronously
