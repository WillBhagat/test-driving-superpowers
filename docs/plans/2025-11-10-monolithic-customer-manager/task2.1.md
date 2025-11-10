# Task 2.1: Implement localStorage Service

**Agent Context:** You are creating a service that persists customer data to the browser's localStorage to provide instant loading and offline capability.

**Behavior:** Create a storageService object with methods to save, load, and clear customer data from localStorage.

**Acceptance Criteria:**
- Given the need for data persistence across page reloads
- When calling storageService methods
- Then saveToStorage(customers) serializes and stores customer array in localStorage
- And loadFromStorage() deserializes and returns customer array or empty array if none exists
- And clearStorage() removes customer data from localStorage
- And all operations handle localStorage errors gracefully (quota exceeded, privacy mode)

**Test Scenarios:**
- **Happy path:** Save and load customer array successfully
- **Empty state:** loadFromStorage returns empty array when no data exists
- **Error handling:** Methods catch and silently handle localStorage exceptions
- **Data integrity:** Loaded data matches saved data structure
- **Storage key:** Use consistent key like 'customerManager_customers'

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add after apiService)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** Customer interface from Task 1.1
- **Interfaces to provide:** storageService object with methods: saveToStorage(customers: Customer[]), loadFromStorage(): Customer[], clearStorage()

**Architecture Constraints:**
- Define storageService as a plain JavaScript object with methods
- Place after apiService, before component definition
- Use try-catch blocks for all localStorage operations
- Use JSON.stringify/parse for serialization
- Use storage key: 'customerManager_customers'
- Return empty array [] if data doesn't exist or parsing fails
- Log errors to console but don't throw exceptions

**Definition of Done:**
- storageService object defined with three methods
- All localStorage operations wrapped in try-catch
- Methods handle missing data gracefully
- Consistent storage key used throughout
- Code placed after apiService in file
