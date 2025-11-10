# Component Interface Contracts for Task 1.1: useState Hooks Soup

## Overview
This document defines the interface contracts established by Task 1.1 that will be consumed by dependent tasks (Task 1.2 onwards).

## Component File Location
- **Component**: `/target/src/app/customers/page.jsx`
- **Test Suite**: `/target/src/app/customers/__tests__/page.test.jsx`

## Component Export Contract
```javascript
// Default export: Functional React component
export default function CustomersPage()
```

## Next.js Requirements
- **Directive**: `'use client'` (required for hooks in Next.js App Router)
- **Type**: Functional component with React hooks
- **Framework**: Next.js 16.0.1, React 19.2.0

## State Interface Contract - 24 Individual useState Hooks

### Form Field States (4 hooks)
```javascript
const [customerName, setCustomerName] = useState('')
const [customerEmail, setCustomerEmail] = useState('')
const [customerPhone, setCustomerPhone] = useState('')
const [customerAddress, setCustomerAddress] = useState('')
```
**Contract**: Each form field is an independent string state, initialized as empty string.

### Validation Error States (5 hooks)
```javascript
const [nameError, setNameError] = useState('')
const [emailError, setEmailError] = useState('')
const [phoneError, setPhoneError] = useState('')
const [addressError, setAddressError] = useState('')
const [generalError, setGeneralError] = useState('')
```
**Contract**: Each validation error is independent, initialized as empty string.

### UI State Hooks (5 hooks)
```javascript
const [isLoading, setIsLoading] = useState(false)
const [isEditing, setIsEditing] = useState(false)
const [editingId, setEditingId] = useState(null)
const [showDeleteModal, setShowDeleteModal] = useState(false)
const [deleteTargetId, setDeleteTargetId] = useState(null)
```
**Contract**: UI state controls are independent, boolean flags initialized to false, ID states initialized to null.

### Search and Sort States (3 hooks)
```javascript
const [searchTerm, setSearchTerm] = useState('')
const [sortBy, setSortBy] = useState('')
const [sortOrder, setSortOrder] = useState('')
```
**Contract**: Search and sort controls are independent strings, initialized as empty.

### Message States (3 hooks)
```javascript
const [successMessage, setSuccessMessage] = useState('')
const [errorMessage, setErrorMessage] = useState('')
const [lastSaved, setLastSaved] = useState(null)
```
**Contract**: Message states are independent, strings and null values as appropriate.

### Cache Layer 1 - In-Memory Cache (1 hook)
```javascript
const [cachedCustomers, setCachedCustomers] = useState([])
```
**Contract**: Separate from primary `customers` state, initialized as empty array. Will drift out of sync by design.

### Cache Layer 2 - localStorage Flag (1 hook)
```javascript
const [localStorageLoaded, setLocalStorageLoaded] = useState(false)
```
**Contract**: Flag tracking whether localStorage has been synced, independent of actual cache data.

### Cache Layer 3 - sessionStorage Flag (1 hook)
```javascript
const [sessionStorageLoaded, setSessionStorageLoaded] = useState(false)
```
**Contract**: Flag tracking whether sessionStorage has been synced, independent of actual cache data.

### Primary Data State (1 hook)
```javascript
const [customers, setCustomers] = useState([])
```
**Contract**: Primary customer data array, conflicts with `cachedCustomers` by design.

## Total Hook Count
**24 individual useState hooks** exceeding the minimum requirement of 20+.

## Design Characteristics (Intentional Anti-Patterns)

### Monolithic Structure
- All state management in single component
- No state composition or reduction
- No custom hooks to extract concerns
- Foundation for demonstrating hooks soup anti-pattern

### Multiple Uncoordinated Cache Layers
1. **cachedCustomers**: In-memory cache separate from primary data
2. **localStorageLoaded**: Flag for localStorage sync state
3. **sessionStorageLoaded**: Flag for sessionStorage sync state
4. **customers**: Primary data source

These layers are intentionally NOT synchronized, allowing them to drift out of sync as the component demonstrates poor state management.

### No State Abstraction
- Each piece of state is a separate hook
- No combined state objects
- No reducer pattern
- No context providers
- Foundation for Task 1.2 to add useEffect hooks that will struggle to keep all states in sync

## Provider Interface for Task 1.2+

This component provides the following foundation for dependent tasks:

1. **20+ useState hooks to manage with useEffect**: Task 1.2 will add useEffect hooks to demonstrate challenges with uncoordinated state.

2. **Multiple cache layers prone to drift**: Task 1.3+ can demonstrate cache synchronization issues.

3. **Form validation requiring coordination**: Task 1.4+ can show how 20+ independent state pieces make validation logic complex.

4. **Search/Sort/Filter complexity**: Tasks 1.5+ can demonstrate how individual state pieces complicate search and sort operations.

5. **Clear anti-pattern foundation**: The component intentionally demonstrates poor state management for educational purposes.

## Acceptance Criteria Fulfilled

- [x] Component file exists at `/target/src/app/customers/page.jsx`
- [x] Component has exactly 24 individual useState hooks (exceeds 20+ requirement)
- [x] All tests pass (21 comprehensive tests)
- [x] Component uses 'use client' directive for Next.js App Router
- [x] All hooks initialized with sensible defaults (empty strings, false, null, empty arrays)
- [x] NO combined state objects - each piece of state is separate
- [x] Provides foundation for Task 1.2 to add useEffect hooks
- [x] Component renders without errors
- [x] Exports as default

## Testing Strategy Applied

**Test-Driven Development (TDD) Red-Green-Refactor cycle:**

1. **RED**: Wrote 21 comprehensive tests verifying all acceptance criteria before implementation
2. **GREEN**: Implemented minimal component code to pass all tests
3. **REFACTOR**: Expanded tests to cover edge cases and future concerns

All tests verify:
- Component rendering
- Exact number of useState hooks
- Presence of 'use client' directive
- Specific hook names matching requirements
- Proper default value initialization
- Proper setter pair associations
- Cache layer independence
- No combined state objects

## Dependencies Satisfied

- React 19.2.0: Uses modern React with hooks
- Next.js 16.0.1: Uses App Router with 'use client' directive
- Jest + React Testing Library: Comprehensive test suite
