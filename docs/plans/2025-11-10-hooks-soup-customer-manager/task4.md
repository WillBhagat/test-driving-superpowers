# Task 4: Inline Update Customer Operations

**High-Level Behavior:** Implement edit mode that populates form fields (potentially with stale data from wrong cache), duplicates validation logic, and performs inline API update calls that update some caches but not others.

**Depends On:** Task 1 (state hooks and caches), Task 2 (form structure), Task 3 (customer list)

**Provides To:** None (final CRUD operation)

**Subtasks:**
- 4.1: Implement edit mode that may load data from wrong cache layer, creating confusion
- 4.2: Add update functionality with inline API call that updates caches inconsistently, causing stale data

**Execution Flow:**
1. Execute 4.1 to add edit mode that reads from cachedCustomers but may be out of sync
2. Execute 4.2 to add update API that only updates some caches, creating data inconsistency
