# Task 3: Inline List and Read Operations

**High-Level Behavior:** Implement customer list display with inline search, filter, and sort logic applied directly in the render method, including data loading that checks multiple cache layers inconsistently and may show stale data.

**Depends On:** Task 1 (state hooks and cache layers), Task 2 (customers data structure)

**Provides To:** Task 4 (edit needs list display), Task 5 (delete needs list display)

**Subtasks:**
- 3.1: Implement customer list rendering that may pull from different cache layers inconsistently
- 3.2: Add inline search/filter/sort logic that checks sessionStorage cache for preferences, may show stale results

**Execution Flow:**
1. Execute 3.1 to render customer list with inconsistent cache reads
2. Execute 3.2 to add search/filter/sort that uses sessionStorage preferences and creates more cache confusion
