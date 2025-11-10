# Task 1.1: Define TypeScript Interfaces

**Agent Context:** You are creating the foundational type definitions for a customer management system. These interfaces will be used throughout the component for type safety.

**Behavior:** Define TypeScript interfaces that describe the shape of customer data, validation errors, and API responses.

**Acceptance Criteria:**
- Given the need for type-safe customer data handling
- When defining interfaces at the top of the component file
- Then Customer interface has: id (string), name (string), email (string), phone (string)
- And ValidationError interface has: field (string), message (string)
- And ApiResponse<T> interface has: success (boolean), data (T | null), error (string | null)

**Test Scenarios:**
- **Type checking:** Interfaces should allow valid customer objects and reject invalid ones at compile time
- **Generic response:** ApiResponse should work with any data type (Customer, Customer[], etc.)
- **Optional fields:** Consider which fields are optional vs required

**Agent-Specific Context:**
- **File to create:** `src/components/CustomerManager.tsx`
- **Tests to create:** None for this subtask (interfaces are compile-time only)
- **Dependencies available:** None
- **Interfaces to provide:** Customer, ValidationError, ApiResponse<T> for use in all subsequent tasks

**Architecture Constraints:**
- Use TypeScript interfaces (not types) for consistency
- Keep interfaces simple and focused
- Export interfaces from the file for potential reuse
- Place interfaces at the very top of the file after imports

**Definition of Done:**
- All three interfaces defined with correct properties
- TypeScript compiler accepts the interfaces
- Interfaces are exported for use in other tasks
- File structure follows: imports → interfaces → (rest of code to be added by other tasks)
