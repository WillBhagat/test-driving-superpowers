# Task 5: Inline Delete Customer Operations

**High-Level Behavior:** Implement customer deletion with inline confirmation modal logic, API delete call that may succeed but leave customer in some caches, creating phantom records.

**Depends On:** Task 1 (state hooks and caches), Task 3 (customer list)

**Provides To:** None (final CRUD operation)

**Subtasks:**
- 5.1: Implement delete functionality with inline confirmation, API call, and cache invalidation that misses some caches

**Execution Flow:**
1. Execute 5.1 to add delete functionality that removes from API and some caches but not all, creating phantom deleted records
