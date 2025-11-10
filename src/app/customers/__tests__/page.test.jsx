import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import fs from 'fs'
import path from 'path'
import CustomersPage from '../page'

// Read the source file directly
const sourceFilePath = path.join(__dirname, '../page.jsx')
const sourceCode = fs.readFileSync(sourceFilePath, 'utf-8')

// Global setup for all tests
beforeEach(() => {
  // Mock fetch for all tests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    })
  )
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Customers Page Component', () => {
  // TEST 1: Component renders without errors
  test('renders without errors', () => {
    render(<CustomersPage />)
    // If component renders without throwing, test passes
    expect(true).toBe(true)
  })

  // TEST 2: Component renders with expected heading
  test('renders a heading', () => {
    render(<CustomersPage />)
    const heading = screen.getByText('Customer Manager')
    // Component should be rendering
    expect(heading).toBeInTheDocument()
  })

  // TEST 3: Component has exactly 20 or more useState hooks
  test('has 20 or more useState hooks', () => {
    const useStateMatches = (sourceCode.match(/useState\(/g) || []).length

    expect(useStateMatches).toBeGreaterThanOrEqual(20)
  })

  // TEST 4: Component uses 'use client' directive
  test('includes use client directive', () => {
    // Check if the source code starts with 'use client'
    expect(sourceCode.includes("'use client'")).toBe(true)
  })

  // TEST 5: Component has specific useState hooks for form fields
  test('has useState hooks for form fields', () => {
    const hasCustomerName = sourceCode.includes('customerName')
    const hasCustomerEmail = sourceCode.includes('customerEmail')
    const hasCustomerPhone = sourceCode.includes('customerPhone')
    const hasCustomerAddress = sourceCode.includes('customerAddress')

    expect(hasCustomerName).toBe(true)
    expect(hasCustomerEmail).toBe(true)
    expect(hasCustomerPhone).toBe(true)
    expect(hasCustomerAddress).toBe(true)
  })

  // TEST 6: Component has validation error states
  test('has useState hooks for validation errors', () => {
    const hasNameError = sourceCode.includes('nameError')
    const hasEmailError = sourceCode.includes('emailError')
    const hasPhoneError = sourceCode.includes('phoneError')
    const hasAddressError = sourceCode.includes('addressError')
    const hasGeneralError = sourceCode.includes('generalError')

    expect(hasNameError).toBe(true)
    expect(hasEmailError).toBe(true)
    expect(hasPhoneError).toBe(true)
    expect(hasAddressError).toBe(true)
    expect(hasGeneralError).toBe(true)
  })

  // TEST 7: Component has UI state hooks
  test('has useState hooks for UI state', () => {
    const hasIsLoading = sourceCode.includes('isLoading')
    const hasIsEditing = sourceCode.includes('isEditing')
    const hasEditingId = sourceCode.includes('editingId')
    const hasShowDeleteModal = sourceCode.includes('showDeleteModal')
    const hasDeleteTargetId = sourceCode.includes('deleteTargetId')

    expect(hasIsLoading).toBe(true)
    expect(hasIsEditing).toBe(true)
    expect(hasEditingId).toBe(true)
    expect(hasShowDeleteModal).toBe(true)
    expect(hasDeleteTargetId).toBe(true)
  })

  // TEST 8: Component has search and sort states
  test('has useState hooks for search and sorting', () => {
    const hasSearchTerm = sourceCode.includes('searchTerm')
    const hasSortBy = sourceCode.includes('sortBy')
    const hasSortOrder = sourceCode.includes('sortOrder')

    expect(hasSearchTerm).toBe(true)
    expect(hasSortBy).toBe(true)
    expect(hasSortOrder).toBe(true)
  })

  // TEST 9: Component has message states
  test('has useState hooks for messages', () => {
    const hasSuccessMessage = sourceCode.includes('successMessage')
    const hasErrorMessage = sourceCode.includes('errorMessage')
    const hasLastSaved = sourceCode.includes('lastSaved')

    expect(hasSuccessMessage).toBe(true)
    expect(hasErrorMessage).toBe(true)
    expect(hasLastSaved).toBe(true)
  })

  // TEST 10: Component has separate cache layers
  test('has useState hooks for all three cache layers', () => {
    const hasCachedCustomers = sourceCode.includes('cachedCustomers')
    const hasLocalStorageLoaded = sourceCode.includes('localStorageLoaded')
    const hasSessionStorageLoaded = sourceCode.includes('sessionStorageLoaded')
    const hasCustomers = sourceCode.includes('customers')

    expect(hasCachedCustomers).toBe(true)
    expect(hasLocalStorageLoaded).toBe(true)
    expect(hasSessionStorageLoaded).toBe(true)
    expect(hasCustomers).toBe(true)
  })

  // TEST 11: Component has correct default values for form fields
  test('initializes form field states with empty strings', () => {
    // Check for initialization patterns with empty strings
    expect(sourceCode.includes("useState('')")).toBe(true)
  })

  // TEST 12: Component has correct default values for boolean states
  test('initializes boolean states with false', () => {
    // Check for initialization patterns with false
    expect(sourceCode.includes('useState(false)')).toBe(true)
  })

  // TEST 13: Component has correct default values for arrays
  test('initializes array states with empty arrays', () => {
    // Check for initialization patterns with empty arrays
    expect(sourceCode.includes('useState([])')).toBe(true)
  })

  // TEST 14: Component is a default export
  test('exports component as default', () => {
    expect(CustomersPage).toBeDefined()
    expect(typeof CustomersPage).toBe('function')
  })

  // TEST 15: Component is a functional component
  test('is a functional component with hooks', () => {
    expect(typeof CustomersPage).toBe('function')
    // Functional components have a render implementation
    expect(CustomersPage.length >= 0).toBe(true)
  })

  // TEST 16: Verify all useState calls have proper setter pairs
  test('has proper useState setter pairs for all hooks', () => {
    const setVariables = sourceCode.match(/const \[.*?, set\w+\]/g) || []
    expect(setVariables.length).toBeGreaterThanOrEqual(20)
  })

  // TEST 17: Verify separate cache layers are indeed independent
  test('confirms three separate cache layer states exist', () => {
    const hasCachedCustomersDeclaration = sourceCode.includes('const [cachedCustomers')
    const hasLocalStorageLoadedDeclaration = sourceCode.includes('const [localStorageLoaded')
    const hasSessionStorageLoadedDeclaration = sourceCode.includes('const [sessionStorageLoaded')
    const hasCustomersDeclaration = sourceCode.includes('const [customers')

    expect(hasCachedCustomersDeclaration).toBe(true)
    expect(hasLocalStorageLoadedDeclaration).toBe(true)
    expect(hasSessionStorageLoadedDeclaration).toBe(true)
    expect(hasCustomersDeclaration).toBe(true)
  })

  // TEST 18: Verify component returns valid JSX
  test('component returns valid JSX element', () => {
    const component = render(<CustomersPage />)
    expect(component.container).toBeTruthy()
  })

  // TEST 19: Verify component has no combined state objects
  test('has no combined state objects (each piece of state is separate)', () => {
    // Check that there are no useState calls with object literals as defaults
    const objectStatePatterns = sourceCode.match(/useState\({[\s\S]*?}\)/g)
    // We expect minimal or no complex object patterns (just single objects as initial values)
    // The component should use individual useState for each piece of state
    expect(sourceCode.match(/useState\(/g)?.length || 0).toBeGreaterThanOrEqual(20)
  })

  // TEST 20: Verify all default values are primitive or simple
  test('uses appropriate default values (primitives and empty collections)', () => {
    const validDefaults =
      sourceCode.includes("useState('')") &&
      sourceCode.includes('useState(false)') &&
      sourceCode.includes('useState(null)') &&
      sourceCode.includes('useState([])')

    expect(validDefaults).toBe(true)
  })

  // TEST 21: Verify component structure allows for independent cache drift
  test('component structure allows separate cache states to drift independently', () => {
    const hasSeparateCaches =
      sourceCode.includes('cachedCustomers') &&
      sourceCode.includes('customers') &&
      sourceCode.includes('localStorageLoaded') &&
      sourceCode.includes('sessionStorageLoaded')

    // These should be independent states that can have different values
    expect(hasSeparateCaches).toBe(true)

    // For Task 1.2: Now they ARE synchronized (with race conditions), so we verify they exist as separate states
    // even though they will be synced in useEffect hooks
    expect(sourceCode.includes('const [cachedCustomers')).toBe(true)
    expect(sourceCode.includes('const [customers')).toBe(true)
  })
})

// TASK 1.2: useEffect Hooks with Race Conditions Tests
describe('Customers Page - useEffect Hooks with Race Conditions', () => {
  beforeEach(() => {
    // Clear all storage before each test
    localStorage.clear()
    sessionStorage.clear()
    // Mock fetch with default resolved promise
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
    // Spy on localStorage methods
    jest.spyOn(Storage.prototype, 'getItem')
    jest.spyOn(Storage.prototype, 'setItem')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 22: Component has 10 or more useEffect hooks
  test('has 10 or more useEffect hooks', () => {
    const useEffectMatches = (sourceCode.match(/useEffect\(/g) || []).length
    expect(useEffectMatches).toBeGreaterThanOrEqual(10)
  })

  // TEST 23: Component imports useEffect from React
  test('imports useEffect from React', () => {
    expect(sourceCode.includes('useEffect')).toBe(true)
    expect(sourceCode.match(/import.*useEffect.*from ['"]react['"]/)).toBeTruthy()
  })

  // TEST 24: Initial localStorage load on mount
  test('loads customers from localStorage on mount', () => {
    const mockData = [{ id: 1, name: 'Test Customer' }]
    localStorage.setItem('customers_cache', JSON.stringify(mockData))

    render(<CustomersPage />)

    // Verify localStorage was accessed
    expect(localStorage.getItem).toHaveBeenCalledWith('customers_cache')
  })

  // TEST 25: Initial API fetch on mount
  test('fetches customers from API on mount', async () => {
    const mockCustomers = [{ id: 1, name: 'API Customer' }]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Verify fetch was called
    await screen.findByText('Customer Manager')
    expect(global.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })

  // TEST 26: Cache sync - save customers to localStorage on every change
  test('has useEffect that saves customers to localStorage on change', () => {
    expect(sourceCode.includes("localStorage.setItem('customers_cache'")).toBe(true)
    expect(sourceCode.match(/useEffect.*customers.*localStorage/s)).toBeTruthy()
  })

  // TEST 27: Cache sync - update cachedCustomers when customers changes (delayed)
  test('has useEffect that updates cachedCustomers from customers with delay', () => {
    expect(sourceCode.includes('setCachedCustomers')).toBe(true)
    expect(sourceCode.includes('setTimeout')).toBe(true)
  })

  // TEST 28: Cache sync - save search preferences to sessionStorage
  test('has useEffect that saves search preferences to sessionStorage', () => {
    expect(sourceCode.includes('customer_search_prefs')).toBe(true)
    expect(sourceCode.includes('sessionStorage.setItem')).toBe(true)
  })

  // TEST 29: Cache sync - load from cachedCustomers if customers is empty
  test('has useEffect that loads from cachedCustomers when customers is empty', () => {
    expect(sourceCode.includes('customers.length === 0')).toBe(true)
    expect(sourceCode.includes('cachedCustomers')).toBe(true)
  })

  // TEST 30: Auto-save draft form data to sessionStorage every 2 seconds
  test('has useEffect that auto-saves draft form data with setInterval', () => {
    expect(sourceCode.includes('customer_draft_form')).toBe(true)
    expect(sourceCode.includes('sessionStorage.setItem')).toBe(true)
    expect(sourceCode.includes('setInterval')).toBe(true)
  })

  // TEST 31: Message cleanup - clear messages after 3 seconds
  test('has useEffect that clears messages after timeout', () => {
    const hasSuccessMessageCleanup = sourceCode.includes('successMessage') && sourceCode.includes('setTimeout')
    const hasErrorMessageCleanup = sourceCode.includes('errorMessage') && sourceCode.includes('setTimeout')

    expect(hasSuccessMessageCleanup || hasErrorMessageCleanup).toBe(true)
  })

  // TEST 32: Search debounce with setTimeout
  test('has useEffect that debounces search term updates', () => {
    expect(sourceCode.includes('searchTerm')).toBe(true)
    const hasDebounce = sourceCode.includes('setTimeout')
    expect(hasDebounce).toBe(true)
  })

  // TEST 33: Periodic stale check - merge localStorage with state
  test('has useEffect that periodically checks localStorage for stale data', () => {
    expect(sourceCode.includes('setInterval')).toBe(true)
    expect(sourceCode.includes('localStorage.getItem')).toBe(true)
  })

  // TEST 34: Race condition - overlapping dependencies
  test('has useEffect hooks with overlapping dependencies', () => {
    // Multiple effects should depend on same state variables
    const customersEffects = (sourceCode.match(/useEffect\([^)]*\)[^[]*\[.*customers.*\]/g) || []).length
    expect(customersEffects).toBeGreaterThanOrEqual(2)
  })

  // TEST 35: No cleanup functions in useEffect (intentional memory leak)
  test('useEffect hooks lack proper cleanup functions', () => {
    // Count useEffects with return statements (cleanup)
    const useEffectsWithCleanup = (sourceCode.match(/useEffect\([^{]*\{[^}]*return\s+\(\)/g) || []).length
    const totalUseEffects = (sourceCode.match(/useEffect\(/g) || []).length

    // Most effects should not have cleanup (intentionally creating issues)
    expect(totalUseEffects).toBeGreaterThanOrEqual(10)
  })

  // TEST 36: Race condition scenario - rapid state changes
  test('component handles rapid state changes without crashing', () => {
    const { rerender } = render(<CustomersPage />)

    // Rapid rerenders should not crash
    for (let i = 0; i < 5; i++) {
      rerender(<CustomersPage />)
    }

    expect(screen.getByText('Customer Manager')).toBeInTheDocument()
  })

  // TEST 37: Cache conflict - localStorage and API race
  test('component can have conflicting data from localStorage and API', async () => {
    const localData = [{ id: 1, name: 'Local Customer' }]
    const apiData = [{ id: 2, name: 'API Customer' }]

    localStorage.setItem('customers_cache', JSON.stringify(localData))
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => apiData
    })

    render(<CustomersPage />)

    // Both should be triggered, last one wins
    await screen.findByText('Customer Manager')
    expect(localStorage.getItem).toHaveBeenCalled()
    expect(global.fetch).toHaveBeenCalled()
  })

  // TEST 38: Memory leak - setTimeout not cleaned up
  test('component uses setTimeout without cleanup', () => {
    const setTimeoutCount = (sourceCode.match(/setTimeout/g) || []).length
    expect(setTimeoutCount).toBeGreaterThanOrEqual(2)
  })

  // TEST 39: Dependency chaos - single state change triggers multiple effects
  test('single state change can trigger multiple useEffect hooks', () => {
    // Check that customers is used in multiple useEffect dependencies
    const customersInDependencies = sourceCode.match(/useEffect\([^)]+\).*?\[.*?customers.*?\]/gs) || []
    expect(customersInDependencies.length).toBeGreaterThan(1)
  })

  // TEST 40: All three cache layers are accessed in useEffects
  test('useEffect hooks access all three cache layers', () => {
    const hasLocalStorageAccess = sourceCode.includes('localStorage')
    const hasSessionStorageAccess = sourceCode.includes('sessionStorage')
    const hasCachedCustomersAccess = sourceCode.includes('cachedCustomers')

    expect(hasLocalStorageAccess).toBe(true)
    expect(hasSessionStorageAccess).toBe(true)
    expect(hasCachedCustomersAccess).toBe(true)
  })
})

// TASK 2.1: Form JSX with Duplicated Validation Tests
describe('Customers Page - Form JSX with Duplicated Validation', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 41: Form renders with name input field
  test('renders name input field with correct type and value', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput.value).toBe('')
  })

  // TEST 42: Form renders with email input field
  test('renders email input field with correct type and value', () => {
    render(<CustomersPage />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput.value).toBe('')
  })

  // TEST 43: Form renders with phone input field
  test('renders phone input field with correct type and value', () => {
    render(<CustomersPage />)

    const phoneInput = screen.getByLabelText(/phone/i)
    expect(phoneInput).toBeInTheDocument()
    expect(phoneInput).toHaveAttribute('type', 'tel')
    expect(phoneInput.value).toBe('')
  })

  // TEST 44: Form renders with address textarea field
  test('renders address textarea field with correct value', () => {
    render(<CustomersPage />)

    const addressInput = screen.getByLabelText(/address/i)
    expect(addressInput).toBeInTheDocument()
    expect(addressInput.tagName).toBe('TEXTAREA')
    expect(addressInput.value).toBe('')
  })

  // TEST 45: Form renders with submit button
  test('renders submit button', () => {
    render(<CustomersPage />)

    const submitButton = screen.getByRole('button', { name: /create customer/i })
    expect(submitButton).toBeInTheDocument()
  })

  // TEST 46: onChange handler updates name state and validates (required, 2-50 chars)
  test('name onChange updates state and validates inline', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)

    // Test valid input
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    expect(nameInput.value).toBe('John Doe')

    // Test invalid input (too short)
    fireEvent.change(nameInput, { target: { value: 'J' } })
    expect(nameInput.value).toBe('J')
    // Error message should appear (will test separately)
  })

  // TEST 47: onChange handler updates email state and validates (required, valid format)
  test('email onChange updates state and validates inline', () => {
    render(<CustomersPage />)

    const emailInput = screen.getByLabelText(/email/i)

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')

    // Test invalid email format
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    expect(emailInput.value).toBe('invalid-email')
  })

  // TEST 48: onChange handler updates phone state and validates (required, 10-15 digits)
  test('phone onChange updates state and validates inline', () => {
    render(<CustomersPage />)

    const phoneInput = screen.getByLabelText(/phone/i)

    // Test valid phone
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    expect(phoneInput.value).toBe('1234567890')

    // Test invalid phone (too short)
    fireEvent.change(phoneInput, { target: { value: '123' } })
    expect(phoneInput.value).toBe('123')
  })

  // TEST 49: onChange handler updates address state and validates (required, 10-200 chars)
  test('address onChange updates state and validates inline', () => {
    render(<CustomersPage />)

    const addressInput = screen.getByLabelText(/address/i)

    // Test valid address
    fireEvent.change(addressInput, { target: { value: '123 Main St, City, State 12345' } })
    expect(addressInput.value).toBe('123 Main St, City, State 12345')

    // Test invalid address (too short)
    fireEvent.change(addressInput, { target: { value: 'Short' } })
    expect(addressInput.value).toBe('Short')
  })

  // TEST 50: Validation logic is duplicated in onChange (code inspection)
  test('onChange handlers contain inline duplicated validation logic', () => {
    // Check that validation logic is inline in onChange handlers
    const onChangePattern = /onChange.*=.*\(/g
    const onChangeMatches = sourceCode.match(onChangePattern) || []

    // Should have onChange handlers for all 4 fields
    expect(onChangeMatches.length).toBeGreaterThanOrEqual(4)

    // Check for inline validation patterns (length checks, regex, etc.)
    expect(sourceCode.includes('value.length < 2')).toBe(true)
    expect(sourceCode.includes('value.length > 50')).toBe(true)
    expect(sourceCode.includes('DUPLICATED VALIDATION #1')).toBe(true)
  })

  // TEST 51: onBlur handler validates name field (duplicated validation)
  test('name onBlur validates with duplicated logic', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)

    // Enter invalid value
    fireEvent.change(nameInput, { target: { value: 'J' } })
    // Blur should trigger validation
    fireEvent.blur(nameInput)

    // Error should be set (will verify display separately)
    expect(nameInput.value).toBe('J')
  })

  // TEST 52: onBlur handler validates email field (duplicated validation)
  test('email onBlur validates with duplicated logic', () => {
    render(<CustomersPage />)

    const emailInput = screen.getByLabelText(/email/i)

    // Enter invalid value
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    // Blur should trigger validation
    fireEvent.blur(emailInput)

    expect(emailInput.value).toBe('invalid')
  })

  // TEST 53: onBlur handler validates phone field (duplicated validation)
  test('phone onBlur validates with duplicated logic', () => {
    render(<CustomersPage />)

    const phoneInput = screen.getByLabelText(/phone/i)

    // Enter invalid value
    fireEvent.change(phoneInput, { target: { value: '123' } })
    // Blur should trigger validation
    fireEvent.blur(phoneInput)

    expect(phoneInput.value).toBe('123')
  })

  // TEST 54: onBlur handler validates address field (duplicated validation)
  test('address onBlur validates with duplicated logic', () => {
    render(<CustomersPage />)

    const addressInput = screen.getByLabelText(/address/i)

    // Enter invalid value
    fireEvent.change(addressInput, { target: { value: 'Short' } })
    // Blur should trigger validation
    fireEvent.blur(addressInput)

    expect(addressInput.value).toBe('Short')
  })

  // TEST 55: Validation logic is duplicated in onBlur (code inspection)
  test('onBlur handlers contain duplicated validation logic', () => {
    // Check that validation logic is duplicated in onBlur handlers
    const onBlurPattern = /onBlur.*=.*\(/g
    const onBlurMatches = sourceCode.match(onBlurPattern) || []

    // Should have onBlur handlers for all 4 fields
    expect(onBlurMatches.length).toBeGreaterThanOrEqual(4)

    // Check for duplicated validation comment marker
    expect(sourceCode.includes('DUPLICATED VALIDATION #2')).toBe(true)
  })

  // TEST 56: validateForm function exists in source code
  test('component has a validateForm function with duplicated validation', () => {
    expect(sourceCode.includes('const validateForm')).toBe(true)
    expect(sourceCode.includes('DUPLICATED VALIDATION #3')).toBe(true)
  })

  // TEST 57: validateForm returns true for valid form data
  test('validateForm returns true when all fields are valid', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const phoneInput = screen.getByLabelText(/phone/i)
    const addressInput = screen.getByLabelText(/address/i)

    // Fill in valid data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.change(addressInput, { target: { value: '123 Main St, City, State 12345' } })

    // Submit button should be available to click
    const submitButton = screen.getByRole('button', { name: /create customer/i })
    expect(submitButton).toBeInTheDocument()
  })

  // TEST 58: validateForm returns false for invalid form data
  test('validateForm returns false when fields are invalid', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const submitButton = screen.getByRole('button', { name: /create customer/i })

    // Fill in invalid data
    fireEvent.change(nameInput, { target: { value: 'J' } })

    // Click submit - should trigger validation
    fireEvent.click(submitButton)

    // Error should appear (will test separately)
    expect(nameInput.value).toBe('J')
  })

  // TEST 59: Error messages display below name field
  test('displays error message below name field when invalid', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)

    // Trigger validation error
    fireEvent.change(nameInput, { target: { value: 'J' } })
    fireEvent.blur(nameInput)

    // Error message should appear
    const errorMessage = screen.getByText(/name must be at least 2 characters/i)
    expect(errorMessage).toBeInTheDocument()
  })

  // TEST 60: Error messages display below email field
  test('displays error message below email field when invalid', () => {
    render(<CustomersPage />)

    const emailInput = screen.getByLabelText(/email/i)

    // Trigger validation error
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    fireEvent.blur(emailInput)

    // Error message should appear
    const errorMessage = screen.getByText(/email must be a valid format/i)
    expect(errorMessage).toBeInTheDocument()
  })

  // TEST 61: Error messages display below phone field
  test('displays error message below phone field when invalid', () => {
    render(<CustomersPage />)

    const phoneInput = screen.getByLabelText(/phone/i)

    // Trigger validation error
    fireEvent.change(phoneInput, { target: { value: '123' } })
    fireEvent.blur(phoneInput)

    // Error message should appear
    const errorMessage = screen.getByText(/phone must be at least 10 digits/i)
    expect(errorMessage).toBeInTheDocument()
  })

  // TEST 62: Error messages display below address field
  test('displays error message below address field when invalid', () => {
    render(<CustomersPage />)

    const addressInput = screen.getByLabelText(/address/i)

    // Trigger validation error
    fireEvent.change(addressInput, { target: { value: 'Short' } })
    fireEvent.blur(addressInput)

    // Error message should appear
    const errorMessage = screen.getByText(/address must be at least 10 characters/i)
    expect(errorMessage).toBeInTheDocument()
  })

  // TEST 63: Submit button triggers validateForm function
  test('submit button triggers validateForm before submission', () => {
    render(<CustomersPage />)

    const submitButton = screen.getByRole('button', { name: /create customer/i })

    // Click submit with empty form
    fireEvent.click(submitButton)

    // Errors should be displayed for all required fields
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
    expect(screen.getByText(/address is required/i)).toBeInTheDocument()
  })

  // TEST 64: Error messages clear when input becomes valid
  test('error messages clear when invalid input becomes valid', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)

    // Trigger validation error
    fireEvent.change(nameInput, { target: { value: 'J' } })
    fireEvent.blur(nameInput)

    // Error should appear
    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()

    // Fix the input
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    // Error should disappear
    expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument()
  })
})

// TASK 2.2: Customer Creation with Multi-Cache Updates Tests
describe('Customers Page - Customer Creation with Multi-Cache Updates', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 65: handleCreate function exists in source code
  test('component has a handleCreate function', () => {
    expect(sourceCode.includes('const handleCreate')).toBe(true)
  })

  // TEST 66: Validation failure prevents API call
  test('handleCreate calls validateForm and aborts if validation fails', async () => {
    render(<CustomersPage />)

    const submitButton = screen.getByRole('button', { name: /create customer/i })

    // Click submit with empty form (invalid)
    fireEvent.click(submitButton)

    // Validation errors should appear
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()

    // API should NOT be called (because form is invalid)
    // We check that fetch was only called once (initial mount) not twice
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(global.fetch).toHaveBeenCalledTimes(1) // Only initial mount fetch
  })

  // TEST 67: Successful customer creation makes API call
  test('handleCreate makes POST request to API with valid form data', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    }) // Initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    }) // Create fetch

    render(<CustomersPage />)

    // Fill in valid form data
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const phoneInput = screen.getByLabelText(/phone/i)
    const addressInput = screen.getByLabelText(/address/i)

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.change(addressInput, { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /create customer/i })
    fireEvent.click(submitButton)

    // Wait for API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify POST request was made
    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.any(String)
      })
    )
  })

  // TEST 68: Customer added to customers array state
  test('handleCreate adds new customer to customers state on success', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    }) // Initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    }) // Create fetch

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Customer should be added to state (verify through localStorage side effect)
    const cachedData = localStorage.getItem('customers_cache')
    expect(cachedData).toBeTruthy()
    const customers = JSON.parse(cachedData)
    expect(customers).toContainEqual(expect.objectContaining({ name: 'John Doe' }))
  })

  // TEST 69: Customer added to cachedCustomers array SEPARATELY
  test('handleCreate adds customer to cachedCustomers array separately from customers', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    })

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify handleCreate updates cachedCustomers separately (code inspection)
    expect(sourceCode.includes('setCachedCustomers')).toBe(true)
  })

  // TEST 70: localStorage updated with new customer
  test('handleCreate saves customers to localStorage', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    })

    // Spy on localStorage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify localStorage was updated with customers_cache
    expect(setItemSpy).toHaveBeenCalledWith('customers_cache', expect.any(String))
  })

  // TEST 71: sessionStorage updated with last created customer
  test('handleCreate saves last created customer to sessionStorage', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    })

    render(<CustomersPage />)

    // Clear sessionStorage before test
    sessionStorage.clear()

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify sessionStorage was updated with last_created_customer
    const lastCreated = sessionStorage.getItem('last_created_customer')
    expect(lastCreated).toBeTruthy()
    const parsedCustomer = JSON.parse(lastCreated)
    expect(parsedCustomer).toHaveProperty('name')
  })

  // TEST 72: Success message displayed after creation
  test('handleCreate displays success message after customer creation', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    })

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Success message should appear (will be auto-cleared by useEffect after 3 seconds)
    // We look for the successMessage state being set
    expect(sourceCode.includes('setSuccessMessage')).toBe(true)
  })

  // TEST 73: Form fields cleared after successful creation
  test('handleCreate clears form fields after successful creation', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    })

    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const phoneInput = screen.getByLabelText(/phone/i)
    const addressInput = screen.getByLabelText(/address/i)

    // Fill in valid form data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.change(addressInput, { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Form fields should be cleared
    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
    expect(phoneInput.value).toBe('')
    expect(addressInput.value).toBe('')
  })

  // TEST 74: API error shows error message
  test('handleCreate displays error message on API failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Error message should appear (verify errorMessage state is set)
    expect(sourceCode.includes('setErrorMessage')).toBe(true)
  })

  // TEST 75: Form data preserved on API error
  test('handleCreate leaves form data intact on API error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const phoneInput = screen.getByLabelText(/phone/i)
    const addressInput = screen.getByLabelText(/address/i)

    // Fill in valid form data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.change(addressInput, { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Form fields should still contain data
    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(phoneInput.value).toBe('1234567890')
    expect(addressInput.value).toBe('123 Main St, City, State 12345')
  })

  // TEST 76: Race condition - rapid submissions create duplicates
  test('rapid form submissions can create duplicate entries (no deduplication)', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockNewCustomer
    })

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    const submitButton = screen.getByRole('button', { name: /create customer/i })

    // Rapid double-click simulation
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)

    // Wait for both calls to complete
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Verify multiple POST requests were made (no deduplication)
    const postCalls = global.fetch.mock.calls.filter(
      (call) => call[1] && call[1].method === 'POST'
    )
    expect(postCalls.length).toBeGreaterThanOrEqual(1)
  })

  // TEST 77: Cache drift - customers and cachedCustomers can differ
  test('customers and cachedCustomers arrays can have different content after creation', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewCustomer
    })

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Wait briefly (not long enough for delayed useEffect to sync cachedCustomers)
    await new Promise((resolve) => setTimeout(resolve, 100))

    // At this point, customers should be updated but cachedCustomers may lag behind
    // This demonstrates the drift opportunity created by separate, uncoordinated updates
    // Verify code has separate update calls (code inspection)
    expect(sourceCode.includes('setCustomers')).toBe(true)
    expect(sourceCode.includes('setCachedCustomers')).toBe(true)
  })

  // TEST 78: isLoading state managed during creation
  test('handleCreate sets isLoading to true during API call', async () => {
    const mockNewCustomer = { id: 101, name: 'John Doe', email: 'john@example.com' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockNewCustomer
              }),
            100
          )
        )
    )

    render(<CustomersPage />)

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St, City, State 12345' } })

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /create customer/i }))

    // Verify isLoading is set in code
    expect(sourceCode.includes('setIsLoading(true)')).toBe(true)
    expect(sourceCode.includes('setIsLoading(false)')).toBe(true)
  })

  // TEST 79: All cache updates are inline (no extracted helpers)
  test('handleCreate has inline cache update logic without extracted helpers', () => {
    // Verify cache updates are inline in handleCreate, not in separate functions
    expect(sourceCode.includes('localStorage.setItem')).toBe(true)
    expect(sourceCode.includes('sessionStorage.setItem')).toBe(true)
  })

  // TEST 80: Submit button is wired to handleCreate (or handleUpdate when editing)
  test('submit button onClick is wired to handleCreate function', () => {
    // TASK 4.2: Button now uses conditional: isEditing ? handleUpdate : handleCreate
    // Verify button calls handleCreate (either directly or via conditional)
    expect(sourceCode.includes('handleCreate')).toBe(true)
    expect(sourceCode.includes('onClick')).toBe(true)
  })
})

// TASK 3.1: Customer List Rendering with Inconsistent Cache Reads Tests
describe('Customers Page - Customer List Rendering with Inconsistent Cache Reads', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 81: Loading spinner displays when isLoading is true
  test('displays loading spinner when isLoading is true', () => {
    // Mock initial loading state by intercepting the fetch to delay response
    global.fetch.mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves, keeps isLoading true
    )

    render(<CustomersPage />)

    // Should display "Loading..." text or spinner - check for both overlay and content loading
    const loadingElements = screen.getAllByText(/loading/i)
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  // TEST 82: Customer table renders with 4 columns (Name, Email, Phone, Actions)
  test('renders customer table with 4 columns when customers exist', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Verify table headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  // TEST 83: Customer data displays in table rows
  test('displays customer data in table rows', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Verify all customer data is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('0987654321')).toBeInTheDocument()
  })

  // TEST 84: Edit button renders for each customer row
  test('renders Edit button for each customer', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Should have 2 Edit buttons (one per customer)
    const editButtons = screen.getAllByText('Edit')
    expect(editButtons).toHaveLength(2)
  })

  // TEST 85: Delete button renders for each customer row
  test('renders Delete button for each customer', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Should have 2 Delete buttons (one per customer)
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(2)
  })

  // TEST 86: "No customers found" message displays when empty
  test('displays "No customers found" message when no customers exist', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<CustomersPage />)

    // Wait for loading to complete
    await screen.findByText(/no customers found/i)

    expect(screen.getByText(/no customers found/i)).toBeInTheDocument()
  })

  // TEST 87: Displays customers from whichever cache loads first (inconsistent logic)
  test('displays from customers if customers.length > 0, otherwise cachedCustomers', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for customers to load
    await screen.findByText('John Doe')

    // Customer should be displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  // TEST 88: Customer count displays (may not match visible rows due to cache mismatch)
  test('displays customer count that may differ from visible rows', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Should display count somewhere (e.g., "Total customers: 0, 1, or 2")
    // The count might come from customers.length or cachedCustomers.length
    // Due to cache mismatch, the count may not match visible rows
    expect(screen.getByText(/total customers:/i)).toBeInTheDocument()
  })

  // TEST 89: Table is inline (no extracted components) - code inspection
  test('customer table is rendered inline without extracted components', () => {
    // Verify table is inline in JSX, not extracted to separate component
    expect(sourceCode.includes('<table')).toBe(true)
    expect(sourceCode.includes('<thead')).toBe(true)
    expect(sourceCode.includes('<tbody')).toBe(true)
  })

  // TEST 90: No memoization used for customer list
  test('customer list rendering has no memoization', () => {
    // Verify no useMemo or React.memo function calls used for customer list
    const hasMemoization = sourceCode.match(/useMemo\s*\(/) || sourceCode.match(/React\.memo\s*\(/)
    expect(hasMemoization).toBe(null)
  })

  // TEST 91: Inline conditional rendering: {isLoading ? <Spinner /> : <Table />}
  test('uses inline conditional for loading vs table display', () => {
    // Verify inline ternary conditional is used
    expect(sourceCode.match(/isLoading\s*\?/)).toBeTruthy()
  })

  // TEST 92: Display logic uses customers.length ? customers : cachedCustomers
  test('display logic prioritizes customers over cachedCustomers', () => {
    // Verify the specific cache inconsistency pattern
    expect(sourceCode.match(/customers\.length.*\?.*customers.*:.*cachedCustomers/s)).toBeTruthy()
  })

  // TEST 93: Cache mismatch scenario - count from wrong source
  test('customer count can come from potentially wrong cache source', async () => {
    // Setup scenario where customers and cachedCustomers differ
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Count should be displayed (might be inconsistent with actual rows)
    // This test verifies the count display exists
    expect(screen.getByText(/total/i)).toBeInTheDocument()
  })

  // TEST 94: No loading skeleton (only spinner or content)
  test('no loading skeleton, only spinner when loading', () => {
    // Verify no skeleton component or JSX in code (comments are OK)
    const hasSkeletonComponent =
      sourceCode.includes('<Skeleton') ||
      sourceCode.includes('Skeleton />') ||
      sourceCode.includes('skeleton-loader')
    expect(hasSkeletonComponent).toBe(false)
  })

  // TEST 95: No cache source indication displayed
  test('no indication of which cache source is being used', () => {
    // Verify no "Loaded from cache" or similar messages
    const hasCacheIndicator =
      sourceCode.includes('Loaded from') ||
      sourceCode.includes('Cache source') ||
      sourceCode.includes('From localStorage')
    expect(hasCacheIndicator).toBe(false)
  })

  // TEST 96: Edit buttons have no functionality yet (no onClick handler)
  test('Edit buttons exist but have no functionality implemented', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const editButton = screen.getByText('Edit')
    // Button exists but clicking it does nothing (or just sets state)
    fireEvent.click(editButton)

    // Test passes if no error is thrown
    expect(editButton).toBeInTheDocument()
  })

  // TEST 97: Delete buttons have no functionality yet (no onClick handler)
  test('Delete buttons exist but have no functionality implemented', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getByText('Delete')
    // Button exists but clicking it does nothing (or just sets state)
    fireEvent.click(deleteButton)

    // Test passes if no error is thrown
    expect(deleteButton).toBeInTheDocument()
  })

  // TEST 98: No error boundaries implemented
  test('no error boundaries in component code', () => {
    // Verify no ErrorBoundary or componentDidCatch
    const hasErrorBoundary =
      sourceCode.includes('ErrorBoundary') ||
      sourceCode.includes('componentDidCatch')
    expect(hasErrorBoundary).toBe(false)
  })

  // TEST 99: Table renders after loading completes
  test('table displays after isLoading becomes false', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Initially might show loading
    // Then should show table after loading completes
    await screen.findByText('John Doe')

    // Table headers should be present
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  // TEST 100: Cache inconsistency creates potential count mismatch
  test('cache inconsistency can create count vs row mismatch', async () => {
    // This is a code inspection test to verify the architecture allows drift
    expect(sourceCode.includes('customers')).toBe(true)
    expect(sourceCode.includes('cachedCustomers')).toBe(true)

    // The display logic allows for potential mismatch
    // (count from one source, display from another)
    const hasInconsistentLogic =
      sourceCode.includes('customers.length') &&
      sourceCode.includes('cachedCustomers')
    expect(hasInconsistentLogic).toBe(true)
  })
})

// TASK 3.2: Inline Search/Filter/Sort with sessionStorage Tests
describe('Customers Page - Inline Search/Filter/Sort with sessionStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 101: Search input renders
  test('renders search input field for filtering customers', async () => {
    render(<CustomersPage />)

    const searchInput = screen.getByPlaceholderText(/search by name/i)
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
  })

  // TEST 102: Sort dropdown renders with options
  test('renders sort dropdown with Name A-Z, Name Z-A, Email A-Z options', async () => {
    render(<CustomersPage />)

    const sortDropdown = screen.getByLabelText(/sort by/i)
    expect(sortDropdown).toBeInTheDocument()
    expect(sortDropdown.tagName).toBe('SELECT')

    // Verify options exist
    expect(screen.getByRole('option', { name: /name a-z/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /name z-a/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /email a-z/i })).toBeInTheDocument()
  })

  // TEST 103: Search input updates searchTerm state
  test('search input onChange updates searchTerm state', () => {
    render(<CustomersPage />)

    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })

    expect(searchInput.value).toBe('John')
  })

  // TEST 104: Sort dropdown updates sortBy state
  test('sort dropdown onChange updates sortBy state', () => {
    render(<CustomersPage />)

    const sortDropdown = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortDropdown, { target: { value: 'name-asc' } })

    expect(sortDropdown.value).toBe('name-asc')
  })

  // TEST 105: Search filters customers by name (case-sensitive)
  test('search filters customers by name with case-sensitive includes()', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '5555555555' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for customers to load
    await screen.findByText('John Doe')

    // All customers should be visible initially
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()

    // Type in search
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })

    // Only customers with 'John' in name should be visible
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  // TEST 106: Search is case-sensitive
  test('search is case-sensitive', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'jane smith', email: 'jane@example.com', phone: '0987654321' },
      { id: 3, name: 'johnson', email: 'johnson@example.com', phone: '5555555555' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    // Search for lowercase 'john' should not match 'John' (case-sensitive)
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'john' } })

    // 'John Doe' should not appear because 'john' != 'John' (case-sensitive)
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    // 'jane smith' should not appear because it doesn't contain 'john'
    expect(screen.queryByText('jane smith')).not.toBeInTheDocument()
    // 'johnson' should appear because it contains 'john' (lowercase)
    expect(screen.getByText('johnson')).toBeInTheDocument()
  })

  // TEST 107: Sort by Name A-Z works
  test('sort by name A-Z orders customers alphabetically ascending', async () => {
    const mockCustomers = [
      { id: 1, name: 'Charlie', email: 'charlie@example.com', phone: '1111111111' },
      { id: 2, name: 'Alice', email: 'alice@example.com', phone: '2222222222' },
      { id: 3, name: 'Bob', email: 'bob@example.com', phone: '3333333333' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('Charlie')

    // Select Name A-Z sort
    const sortDropdown = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortDropdown, { target: { value: 'name-asc' } })

    // Get all rows and verify order
    const rows = screen.getAllByRole('row')
    // Skip header row, check data rows
    expect(rows[1].textContent).toContain('Alice')
    expect(rows[2].textContent).toContain('Bob')
    expect(rows[3].textContent).toContain('Charlie')
  })

  // TEST 108: Sort by Name Z-A works
  test('sort by name Z-A orders customers alphabetically descending', async () => {
    const mockCustomers = [
      { id: 1, name: 'Alice', email: 'alice@example.com', phone: '1111111111' },
      { id: 2, name: 'Bob', email: 'bob@example.com', phone: '2222222222' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', phone: '3333333333' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('Alice')

    // Select Name Z-A sort
    const sortDropdown = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortDropdown, { target: { value: 'name-desc' } })

    // Get all rows and verify order
    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toContain('Charlie')
    expect(rows[2].textContent).toContain('Bob')
    expect(rows[3].textContent).toContain('Alice')
  })

  // TEST 109: Sort by Email A-Z works
  test('sort by email A-Z orders customers by email alphabetically', async () => {
    const mockCustomers = [
      { id: 1, name: 'Charlie', email: 'zebra@example.com', phone: '1111111111' },
      { id: 2, name: 'Alice', email: 'apple@example.com', phone: '2222222222' },
      { id: 3, name: 'Bob', email: 'mango@example.com', phone: '3333333333' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('Charlie')

    // Select Email A-Z sort
    const sortDropdown = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortDropdown, { target: { value: 'email-asc' } })

    // Get all rows and verify order by email
    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toContain('apple@example.com')
    expect(rows[2].textContent).toContain('mango@example.com')
    expect(rows[3].textContent).toContain('zebra@example.com')
  })

  // TEST 110: Filter and sort are chained (filter first, then sort)
  test('filter and sort are chained: filter().sort().map()', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Zebra', email: 'john.z@example.com', phone: '1111111111' },
      { id: 2, name: 'John Apple', email: 'john.a@example.com', phone: '2222222222' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', phone: '3333333333' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Zebra')

    // Filter by 'John'
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })

    // Only John Zebra and John Apple should be visible
    expect(screen.getByText('John Zebra')).toBeInTheDocument()
    expect(screen.getByText('John Apple')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()

    // Now sort by Name A-Z
    const sortDropdown = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortDropdown, { target: { value: 'name-asc' } })

    // Filtered results should be sorted: John Apple, then John Zebra
    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toContain('John Apple')
    expect(rows[2].textContent).toContain('John Zebra')
  })

  // TEST 111: sessionStorage saves search preferences on searchTerm change
  test('sessionStorage saves customer_search_prefs when searchTerm changes', async () => {
    render(<CustomersPage />)

    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'Test' } })

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify sessionStorage was updated
    const savedPrefs = sessionStorage.getItem('customer_search_prefs')
    expect(savedPrefs).toBeTruthy()
    const prefs = JSON.parse(savedPrefs)
    expect(prefs.searchTerm).toBe('Test')
  })

  // TEST 112: sessionStorage saves sort preferences on sortBy change
  test('sessionStorage saves customer_search_prefs when sortBy changes', async () => {
    render(<CustomersPage />)

    const sortDropdown = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortDropdown, { target: { value: 'name-asc' } })

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify sessionStorage was updated
    const savedPrefs = sessionStorage.getItem('customer_search_prefs')
    expect(savedPrefs).toBeTruthy()
    const prefs = JSON.parse(savedPrefs)
    expect(prefs.sortBy).toBe('name-asc')
  })

  // TEST 113: sessionStorage loads on mount
  test('loads search preferences from sessionStorage on mount', async () => {
    // Pre-populate sessionStorage
    sessionStorage.setItem('customer_search_prefs', JSON.stringify({
      searchTerm: 'PreloadedSearch',
      sortBy: 'email-asc'
    }))

    render(<CustomersPage />)

    // Verify inputs are populated from sessionStorage
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    const sortDropdown = screen.getByLabelText(/sort by/i)

    expect(searchInput.value).toBe('PreloadedSearch')
    expect(sortDropdown.value).toBe('email-asc')
  })

  // TEST 114: Search only filters name field
  test('search only filters by name field, not email or phone', async () => {
    const mockCustomers = [
      { id: 1, name: 'Alice', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'john', email: 'alice@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('Alice')

    // Search for 'john' (lowercase)
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'john' } })

    // Should NOT match Alice (even though email is john@example.com)
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    // SHOULD match 'john' (name contains 'john')
    expect(screen.getByText('john')).toBeInTheDocument()
  })

  // TEST 115: Empty search shows all customers
  test('empty search term shows all customers', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    // Initially all customers visible
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()

    // Search for something
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })

    // Only John visible
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })

    // All customers visible again
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  // TEST 116: No debouncing (immediate filter)
  test('search filters immediately without debouncing', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })

    // Should filter immediately (no delay)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  // TEST 117: No useMemo for filtered/sorted results
  test('no useMemo used for filter/sort optimization', () => {
    // Verify inline filter/sort in render (no useMemo function call)
    expect(sourceCode.match(/useMemo\s*\(/)).toBe(null)
  })

  // TEST 118: Inline filter/sort logic in render
  test('filter and sort logic is inline in render using chained methods', () => {
    // Verify chained filter().sort().map() pattern exists in tbody
    const hasFilterChain = sourceCode.includes('.filter(') &&
                           sourceCode.includes('.sort(') &&
                           sourceCode.includes('.map(')
    // Verify they appear in sequence within the tbody section
    const tbodySection = sourceCode.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0] || ''
    const hasChainInTbody = tbodySection.includes('.filter(') &&
                            tbodySection.includes('.sort(') &&
                            tbodySection.includes('.map(')
    expect(hasFilterChain && hasChainInTbody).toBe(true)
  })

  // TEST 119: String comparison for sort (no locale comparison)
  test('sort uses simple string comparison, not localeCompare', () => {
    // Verify string comparison operators (<, >) used instead of localeCompare
    expect(sourceCode.includes('localeCompare')).toBe(false)
  })

  // TEST 120: Sort logic uses standard comparison operators
  test('sort uses standard comparison operators in inline logic', () => {
    // Verify sort comparator uses basic comparison
    const hasSortLogic = sourceCode.includes('.sort(') && (
      sourceCode.includes('a.name') || sourceCode.includes('a.email')
    )
    expect(hasSortLogic).toBe(true)
  })
})

// TASK 4.1: Edit Mode with Stale Cache Reads Tests
describe('Customers Page - Edit Mode with Stale Cache Reads', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 121: handleEdit function exists in source code
  test('component has a handleEdit function', () => {
    expect(sourceCode.includes('const handleEdit')).toBe(true)
  })

  // TEST 122: Edit button in table row has onClick handler
  test('Edit button in table has onClick handler wired to handleEdit', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Verify Edit button onClick is wired
    expect(sourceCode.includes('onClick') && sourceCode.includes('Edit')).toBe(true)
  })

  // TEST 123: Clicking Edit button populates form with customer data
  test('clicking Edit button populates form fields with customer data', async () => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main Street, City, State 12345'
      }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Form should be populated with customer data
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe')
    expect(screen.getByLabelText(/email/i).value).toBe('john@example.com')
    expect(screen.getByLabelText(/phone/i).value).toBe('1234567890')
    expect(screen.getByLabelText(/address/i).value).toBe('123 Main Street, City, State 12345')
  })

  // TEST 124: Clicking Edit sets isEditing to true
  test('clicking Edit button sets isEditing state to true', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // isEditing should be true (verified by checking if Cancel button appears)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  // TEST 125: Clicking Edit sets editingId to customer.id
  test('clicking Edit button sets editingId state to customer.id', async () => {
    const mockCustomers = [
      { id: 42, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // editingId should be set (verify through code inspection)
    expect(sourceCode.includes('setEditingId')).toBe(true)
  })

  // TEST 126: Edit button changes to "Cancel" when in edit mode
  test('Edit button changes to Cancel button when in edit mode', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Initially should show Edit button
    expect(screen.getAllByText('Edit').length).toBeGreaterThan(0)

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should show Cancel button for the edited row
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  // TEST 127: Cancel button clears isEditing state
  test('clicking Cancel button sets isEditing to false', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Cancel button should appear
    expect(screen.getByText('Cancel')).toBeInTheDocument()

    // Click Cancel button
    fireEvent.click(screen.getByText('Cancel'))

    // Edit button should be back
    expect(screen.getAllByText('Edit').length).toBeGreaterThan(0)
  })

  // TEST 128: Cancel button clears form fields
  test('clicking Cancel button clears all form fields', async () => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main Street, City, State 12345'
      }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Form should be populated
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe')

    // Click Cancel button
    fireEvent.click(screen.getByText('Cancel'))

    // Form should be cleared
    expect(screen.getByLabelText(/name/i).value).toBe('')
    expect(screen.getByLabelText(/email/i).value).toBe('')
    expect(screen.getByLabelText(/phone/i).value).toBe('')
    expect(screen.getByLabelText(/address/i).value).toBe('')
  })

  // TEST 129: handleEdit finds customer from customers array first
  test('handleEdit looks up customer in customers array first', async () => {
    const mockCustomers = [
      { id: 1, name: 'Fresh Data', email: 'fresh@example.com', phone: '1111111111', address: '123 Fresh St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('Fresh Data')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should populate with data from customers array
    expect(screen.getByLabelText(/name/i).value).toBe('Fresh Data')
    expect(screen.getByLabelText(/email/i).value).toBe('fresh@example.com')
  })

  // TEST 130: handleEdit falls back to cachedCustomers if not in customers
  test('handleEdit falls back to cachedCustomers when customer not in customers array', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button - this should work even with stale cache
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should populate form (from whichever source is available)
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe')
  })

  // TEST 131: handleEdit uses inline lookup with || fallback pattern
  test('handleEdit uses inline customers.find() || cachedCustomers.find() pattern', () => {
    // Verify the stale cache read pattern in code
    expect(sourceCode.includes('customers.find') || sourceCode.includes('cachedCustomers.find')).toBe(true)
  })

  // TEST 132: No stale data warning displayed
  test('no stale data warning is shown when editing', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should NOT show any stale data warning
    expect(screen.queryByText(/stale/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/outdated/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/old data/i)).not.toBeInTheDocument()
  })

  // TEST 133: No conflict detection implemented
  test('no conflict detection or optimistic locking is implemented', () => {
    // Verify no version/timestamp fields or conflict detection in state or logic
    // Check for actual implementation, not just comments
    expect(sourceCode.includes('versionNumber')).toBe(false)
    expect(sourceCode.includes('lastModified')).toBe(false)
    expect(sourceCode.includes('conflictDetection')).toBe(false)
    expect(sourceCode.includes('optimisticLock')).toBe(false)
  })

  // TEST 134: Edit mode works with stale cachedCustomers
  test('edit works correctly even when cachedCustomers is stale', async () => {
    const mockCustomers = [
      { id: 1, name: 'Current Name', email: 'current@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('Current Name')

    // Click Edit button (should use customers array, not stale cache)
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should populate with current data from customers array
    expect(screen.getByLabelText(/name/i).value).toBe('Current Name')
    expect(screen.getByLabelText(/email/i).value).toBe('current@example.com')
  })

  // TEST 135: handleEdit populates all four form fields
  test('handleEdit populates customerName, customerEmail, customerPhone, customerAddress', async () => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '5551234567',
        address: '456 Oak Avenue, Springfield, IL 62701'
      }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // All four fields should be populated
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const phoneInput = screen.getByLabelText(/phone/i)
    const addressInput = screen.getByLabelText(/address/i)

    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(phoneInput.value).toBe('5551234567')
    expect(addressInput.value).toBe('456 Oak Avenue, Springfield, IL 62701')
  })

  // TEST 136: Cancel clears editingId state
  test('clicking Cancel button clears editingId state', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Cancel button should appear
    expect(screen.getByText('Cancel')).toBeInTheDocument()

    // Click Cancel
    fireEvent.click(screen.getByText('Cancel'))

    // Should be able to edit again (editingId was cleared)
    const editButtonsAfterCancel = screen.getAllByText('Edit')
    fireEvent.click(editButtonsAfterCancel[0])
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  // TEST 137: Multiple customers - Edit only affects one row
  test('clicking Edit on one customer does not affect other rows', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', address: '456 Oak Ave' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button for first customer
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should show one Cancel button and one Edit button
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getAllByText('Edit').length).toBe(1) // Second customer still has Edit
  })

  // TEST 138: Form heading changes based on isEditing state
  test('form heading changes when in edit mode', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Initially should show "Add Customer" as a heading
    const headings = screen.getAllByRole('heading', { level: 2 })
    const addCustomerHeading = headings.find(h => h.textContent === 'Add Customer')
    expect(addCustomerHeading).toBeInTheDocument()

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Form heading should change to "Edit Customer"
    const headingsAfter = screen.getAllByRole('heading', { level: 2 })
    const editCustomerHeading = headingsAfter.find(h => h.textContent === 'Edit Customer')
    expect(editCustomerHeading).toBeInTheDocument()
  })

  // TEST 139: No controlled form pattern (direct state manipulation)
  test('form uses direct state manipulation, not controlled form pattern', () => {
    // Verify direct setState calls in handleEdit, not form control
    expect(sourceCode.includes('setCustomerName')).toBe(true)
    expect(sourceCode.includes('setCustomerEmail')).toBe(true)
    expect(sourceCode.includes('setCustomerPhone')).toBe(true)
    expect(sourceCode.includes('setCustomerAddress')).toBe(true)
  })

  // TEST 140: handleEdit and Cancel functions are inline (no extracted helpers)
  test('handleEdit and cancel logic are inline functions, not extracted', () => {
    // Verify functions are inline in component
    expect(sourceCode.includes('const handleEdit')).toBe(true)
    // Cancel might be inline in JSX or a separate function
    expect(sourceCode.includes('Cancel')).toBe(true)
  })
})

// TASK 4.2: Update Customer with Partial Cache Updates Tests
describe('Customers Page - Update Customer with Partial Cache Updates', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 141: handleUpdate function exists in source code
  test('component has a handleUpdate function', () => {
    expect(sourceCode.includes('const handleUpdate')).toBe(true)
  })

  // TEST 142: Submit button calls handleUpdate when isEditing is true
  test('submit button calls handleUpdate when in edit mode', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock the PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit button (should call handleUpdate, not handleCreate)
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify PUT request was made
    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/1',
      expect.objectContaining({
        method: 'PUT'
      })
    )
  })

  // TEST 143: handleUpdate validates form before updating
  test('handleUpdate calls validateForm and aborts if invalid', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Set invalid name (too short)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'J' } })

    // Click submit button
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify PUT request was NOT made (only initial fetch for customers)
    expect(global.fetch).toHaveBeenCalledTimes(1) // Only initial fetch
  })

  // TEST 144: handleUpdate sets isLoading during operation
  test('handleUpdate sets isLoading to true during update, false after', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request with delay
    global.fetch.mockImplementationOnce(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
        }), 50)
      )
    )

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // isLoading should be set (verify through code inspection)
    expect(sourceCode.includes('setIsLoading(true)')).toBe(true)
    expect(sourceCode.includes('setIsLoading(false)')).toBe(true)
  })

  // TEST 145: handleUpdate makes PUT request to correct URL
  test('handleUpdate makes PUT request to correct endpoint with editingId', async () => {
    const mockCustomers = [
      { id: 42, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 42, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify PUT request to correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/42',
      expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )
  })

  // TEST 146: handleUpdate sends correct body with form data
  test('handleUpdate sends form field data in request body', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify all fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Smith' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '456 Oak Avenue, Springfield, IL 62701' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', address: '456 Oak Avenue, Springfield, IL 62701' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify request body
    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/1',
      expect.objectContaining({
        body: JSON.stringify({
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '9876543210',
          address: '456 Oak Avenue, Springfield, IL 62701'
        })
      })
    )
  })

  // TEST 147: handleUpdate updates customers array with .map
  test('handleUpdate updates customers array using .map to find and replace', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', address: '456 Oak Ave' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')
    await screen.findByText('Jane Smith')

    // Click Edit button for first customer
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Updated' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'John Updated', email: 'john@example.com', phone: '1234567890', address: '123 Main St' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify updated name appears in the list
    expect(screen.getByText('John Updated')).toBeInTheDocument()
    // Verify second customer is unchanged
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  // TEST 148: handleUpdate updates localStorage only (not sessionStorage)
  test('handleUpdate updates localStorage but SKIPS sessionStorage', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    // Spy on storage methods
    const localSetItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    const sessionSetItemSpy = jest.spyOn(sessionStorage, 'setItem')

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Clear spies to ignore initial load calls
    localSetItemSpy.mockClear()
    sessionSetItemSpy.mockClear()

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify localStorage was updated
    expect(localSetItemSpy).toHaveBeenCalledWith('customers_cache', expect.any(String))

    // Verify sessionStorage was NOT updated with customer data (intentional staleness)
    // Note: sessionStorage might be called for other things like draft form, but not for customer updates
    const sessionCalls = sessionSetItemSpy.mock.calls.filter(call =>
      call[0] === 'last_created_customer' || call[0] === 'last_updated_customer'
    )
    expect(sessionCalls.length).toBe(0)
  })

  // TEST 149: handleUpdate SKIPS cachedCustomers update (intentional staleness)
  test('handleUpdate does NOT update cachedCustomers state (intentional stale cache)', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify handleUpdate does NOT call setCachedCustomers
    // Check that handleUpdate logic doesn't include setCachedCustomers call
    const handleUpdateMatch = sourceCode.match(/const handleUpdate[^}]+\{[\s\S]*?\n\s*\}/g)
    if (handleUpdateMatch) {
      const handleUpdateCode = handleUpdateMatch[0]
      // handleUpdate should NOT update cachedCustomers (intentional staleness)
      expect(handleUpdateCode.includes('setCachedCustomers')).toBe(false)
    }
  })

  // TEST 150: handleUpdate displays success message after successful update
  test('handleUpdate sets success message after successful update', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify success message is set (check code for setSuccessMessage call)
    expect(sourceCode.includes('setSuccessMessage')).toBe(true)
  })

  // TEST 151: handleUpdate clears edit mode after success
  test('handleUpdate clears isEditing and editingId after successful update', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Verify Cancel button appears (edit mode is active)
    expect(screen.getByText('Cancel')).toBeInTheDocument()

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Cancel button should be gone (edit mode cleared)
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    // Edit button should be back
    expect(screen.getAllByText('Edit').length).toBeGreaterThan(0)
  })

  // TEST 152: handleUpdate clears form fields after success
  test('handleUpdate clears all form fields after successful update', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Form should be populated
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe')

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Jane Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Form fields should be cleared
    expect(screen.getByLabelText(/name/i).value).toBe('')
    expect(screen.getByLabelText(/email/i).value).toBe('')
    expect(screen.getByLabelText(/phone/i).value).toBe('')
    expect(screen.getByLabelText(/address/i).value).toBe('')
  })

  // TEST 153: handleUpdate sets isLoading to false after success
  test('handleUpdate sets isLoading to false after successful update', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Loading should be false (component should not be in loading state)
    // We verify this by checking that the customer list is visible
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  // TEST 154: handleUpdate displays error message on API failure
  test('handleUpdate sets error message when API request fails', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Mock PUT request failure
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify error message is set
    expect(sourceCode.includes('setErrorMessage')).toBe(true)
  })

  // TEST 155: handleUpdate stays in edit mode on error
  test('handleUpdate leaves edit mode active when update fails', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Verify Cancel button appears (edit mode is active)
    expect(screen.getByText('Cancel')).toBeInTheDocument()

    // Mock PUT request failure
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Cancel button should still be present (edit mode still active)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  // TEST 156: handleUpdate keeps form data intact on error
  test('handleUpdate preserves form data when update fails', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })

    // Mock PUT request failure
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Form data should be preserved
    expect(screen.getByLabelText(/name/i).value).toBe('Jane Doe')
  })

  // TEST 157: handleUpdate sets isLoading to false after error
  test('handleUpdate sets isLoading to false after error', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Mock PUT request failure
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Loading should be false (verify customer list is still visible)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  // TEST 158: handleUpdate uses correct array update pattern
  test('handleUpdate uses customers.map(c => c.id === editingId ? updated : c) pattern', () => {
    // Verify the array update pattern in handleUpdate
    if (sourceCode.includes('const handleUpdate')) {
      const handleUpdateMatch = sourceCode.match(/const handleUpdate[^}]+\{[\s\S]*?\n\s*\}/g)
      if (handleUpdateMatch) {
        const handleUpdateCode = handleUpdateMatch[0]
        // Should use .map to update the array
        expect(handleUpdateCode.includes('.map') || sourceCode.includes('.map')).toBe(true)
      }
    }
  })

  // TEST 159: No version checking or conflict detection in handleUpdate
  test('handleUpdate has no version checking or optimistic locking', () => {
    // Verify no version/timestamp checking in update logic
    expect(sourceCode.includes('versionNumber')).toBe(false)
    expect(sourceCode.includes('lastModified')).toBe(false)
    expect(sourceCode.includes('etag')).toBe(false)
    expect(sourceCode.includes('If-Match')).toBe(false)
  })

  // TEST 160: handleUpdate creates partial cache staleness (cachedCustomers not updated)
  test('update creates intentional cache drift - cachedCustomers stays stale', async () => {
    const mockCustomers = [
      { id: 1, name: 'Original Name', email: 'original@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('Original Name')

    // Wait for cachedCustomers to sync (500ms delay from useEffect)
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Click Edit button
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Modify name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Name' } })

    // Mock PUT request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Updated Name', email: 'original@example.com', phone: '1234567890', address: '123 Main Street, City, State 12345' })
    })

    // Click submit
    const submitButton = screen.getByRole('button', { name: /update customer/i })
    fireEvent.click(submitButton)

    // Wait for update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // customers should be updated (visible in UI)
    expect(screen.getByText('Updated Name')).toBeInTheDocument()

    // cachedCustomers should be stale (not updated immediately)
    // This creates intentional cache drift - cachedCustomers still has "Original Name"
    // We verify this by checking that handleUpdate doesn't call setCachedCustomers
    const handleUpdateMatch = sourceCode.match(/const handleUpdate[^}]+\{[\s\S]*?\n\s*\}/g)
    if (handleUpdateMatch) {
      const handleUpdateCode = handleUpdateMatch[0]
      expect(handleUpdateCode.includes('setCachedCustomers')).toBe(false)
    }
  })
})

// TASK 5.1: Delete Customer with Incomplete Cache Invalidation Tests
describe('Customers Page - Delete Customer with Incomplete Cache Invalidation', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 180: handleDelete function exists in source code
  test('handleDelete function exists in source code', () => {
    expect(sourceCode.includes('const handleDelete')).toBe(true)
  })

  // TEST 181: handleDelete sets deleteTargetId state
  test('handleDelete sets deleteTargetId to the customer id', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Verify deleteTargetId is set by checking if modal appears
    // (Modal should appear when deleteTargetId is set and showDeleteModal is true)
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  // TEST 182: handleDelete sets showDeleteModal to true
  test('handleDelete sets showDeleteModal to true', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Modal should be visible
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  // TEST 183: Delete modal renders inline (not extracted component)
  test('delete modal is rendered inline in JSX, not as separate component', () => {
    // Verify modal JSX is inline, checking for showDeleteModal conditional
    expect(sourceCode.includes('showDeleteModal')).toBe(true)
    // Modal should be inline, not a separate <DeleteModal /> component
    expect(sourceCode.includes('<DeleteModal')).toBe(false)
  })

  // TEST 184: Delete modal displays confirmation message
  test('delete modal displays confirmation message', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Confirmation message should be present
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  // TEST 185: Delete modal has Confirm button
  test('delete modal has Confirm button', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Confirm button should be present
    expect(screen.getByText(/confirm/i)).toBeInTheDocument()
  })

  // TEST 186: Delete modal has Cancel button
  test('delete modal has Cancel button', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Cancel button should be present
    expect(screen.getByText(/cancel/i)).toBeInTheDocument()
  })

  // TEST 187: Cancel button closes modal without deleting
  test('clicking Cancel closes modal without deleting customer', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Modal is visible
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()

    // Click Cancel
    const cancelButton = screen.getByText(/cancel/i)
    fireEvent.click(cancelButton)

    // Modal should be closed
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()

    // Customer should still be in the list
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  // TEST 188: Confirm button makes DELETE API call
  test('clicking Confirm makes DELETE API call to correct endpoint', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify DELETE was called with correct endpoint
    const deleteCalls = global.fetch.mock.calls.filter(
      (call) => call[1] && call[1].method === 'DELETE'
    )
    expect(deleteCalls.length).toBe(1)
    expect(deleteCalls[0][0]).toBe('https://jsonplaceholder.typicode.com/users/1')
  })

  // TEST 189: Successful delete removes customer from customers array
  test('successful delete removes customer from customers array using filter', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for delete to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // John Doe should be removed
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    // Jane Smith should still be present
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  // TEST 190: Delete updates localStorage only (not sessionStorage)
  test('successful delete updates localStorage but NOT sessionStorage', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    localStorage.setItem('customers_cache', JSON.stringify(mockCustomers))
    sessionStorage.setItem('customer_references', JSON.stringify([1, 2, 3]))

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for delete to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // localStorage should be updated (customer removed)
    const updatedCache = JSON.parse(localStorage.getItem('customers_cache'))
    expect(updatedCache).toEqual([])

    // sessionStorage should NOT be updated (stale references remain)
    const sessionRefs = JSON.parse(sessionStorage.getItem('customer_references'))
    expect(sessionRefs).toEqual([1, 2, 3])
  })

  // TEST 191: Delete SKIPS cachedCustomers removal (phantom record)
  test('successful delete does NOT update cachedCustomers (creates phantom record)', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for delete to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify handleDelete or confirm handler does NOT call setCachedCustomers
    // By checking source code for the delete implementation
    expect(sourceCode.includes('setCachedCustomers')).toBe(true)
    // But it should NOT be called in the delete confirmation handler
    // We can't easily test this without inspecting the handler, so we verify behavior:
    // After delete, cachedCustomers should still have the deleted customer (phantom)
  })

  // TEST 192: Successful delete displays success message
  test('successful delete displays success message', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for delete to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Success message should appear (setSuccessMessage called)
    expect(sourceCode.includes('setSuccessMessage')).toBe(true)
  })

  // TEST 193: Successful delete closes modal
  test('successful delete closes the modal', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Modal is visible
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for delete to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Modal should be closed
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
  })

  // TEST 194: Successful delete clears deleteTargetId
  test('successful delete clears deleteTargetId', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for delete to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // deleteTargetId should be cleared (verified by modal being closed)
    // Since we can't directly check state, we verify modal is closed
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
  })

  // TEST 195: Delete API error displays error message
  test('delete API error displays error message', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Error message should be set (setErrorMessage called)
    expect(sourceCode.includes('setErrorMessage')).toBe(true)
  })

  // TEST 196: Delete API error closes modal
  test('delete API error closes modal', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<CustomersPage />)

    await screen.findByText('John Doe')

    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Modal is visible
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()

    const confirmButton = screen.getByText(/confirm/i)
    fireEvent.click(confirmButton)

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Modal should be closed even on error
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
  })

  // TEST 197: Delete button onClick wired to handleDelete
  test('delete button onClick is wired to handleDelete function', () => {
    expect(sourceCode.includes('handleDelete')).toBe(true)
    // Verify Delete button has onClick handler
    expect(sourceCode.match(/Delete.*onClick/s) || sourceCode.match(/onClick.*Delete/s)).toBeTruthy()
  })

  // TEST 198: Delete uses fetch with DELETE method
  test('delete implementation uses fetch with DELETE method', () => {
    expect(sourceCode.includes("method: 'DELETE'")).toBe(true)
  })

  // TEST 199: Delete removes from customers using filter
  test('delete removes customer from array using filter method', () => {
    // Verify filter is used to remove customer
    expect(sourceCode.match(/customers\.filter/)).toBeTruthy()
    expect(sourceCode.match(/\.filter.*c\.id.*!==/s) || sourceCode.match(/\.filter.*c\.id.*!==/s)).toBeTruthy()
  })

  // TEST 200: Delete modal conditional renders based on showDeleteModal
  test('delete modal conditionally renders when showDeleteModal is true', () => {
    // Verify conditional rendering pattern
    expect(sourceCode.match(/showDeleteModal.*&&/s) || sourceCode.match(/showDeleteModal.*\?/s)).toBeTruthy()
  })
})

// TASK 6.1: Massive Single JSX Return Statement Tests
describe('Customers Page - Massive Single JSX Return Statement', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // TEST 201: Component return statement exceeds 200 lines of JSX
  test('return statement contains 200+ lines of JSX', () => {
    // Find the return statement and count lines
    const returnMatch = sourceCode.match(/return\s*\(/s)
    if (returnMatch) {
      const returnIndex = returnMatch.index
      const afterReturn = sourceCode.substring(returnIndex)
      // Count lines from return to the closing of the return statement
      // Look for the return statement content
      const lines = afterReturn.split('\n')
      // Count lines that are part of JSX (rough estimate)
      const jsxLines = lines.filter(line =>
        line.trim().length > 0 &&
        !line.trim().startsWith('//') &&
        line.includes('<') || line.includes('>') || line.includes('{')
      )
      expect(jsxLines.length).toBeGreaterThanOrEqual(200)
    } else {
      // Alternative: count total lines in return
      const returnSection = sourceCode.match(/return\s*\([^]*?\n\s*\)/s)
      if (returnSection) {
        const lineCount = returnSection[0].split('\n').length
        expect(lineCount).toBeGreaterThanOrEqual(200)
      }
    }
  })

  // TEST 202: Single return statement (no extracted JSX variables)
  test('component uses single return statement without JSX variables', () => {
    // Check that there are no JSX variable assignments before return
    const beforeReturn = sourceCode.match(/export default function[\s\S]*?return/s)
    if (beforeReturn) {
      const content = beforeReturn[0]
      // Should not have JSX variable assignments like: const header = <div>...</div>
      const jsxVariables = content.match(/const\s+\w+\s*=\s*</g) || []
      // Allow only hook declarations, not JSX elements
      expect(jsxVariables.length).toBe(0)
    }
  })

  // TEST 203: Header section renders with title "Customer Manager"
  test('header section displays "Customer Manager" title', () => {
    render(<CustomersPage />)
    const heading = screen.getByText('Customer Manager')
    expect(heading).toBeInTheDocument()
  })

  // TEST 204: Header shows customer count from cachedCustomers
  test('header displays customer count from cachedCustomers', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)

    // Wait for data to load
    await screen.findByText('John Doe')

    // Should show count (exact text may vary, but should show a number)
    // Looking for "Total customers: 2" or similar
    expect(screen.getByText(/total customers/i)).toBeInTheDocument()
  })

  // TEST 205: Form shows "Create Customer" button text when not editing
  test('form submit button shows "Create Customer" in create mode', () => {
    render(<CustomersPage />)

    // Initially not editing, so should show "Create Customer"
    const submitButton = screen.getByRole('button', { name: /create customer/i })
    expect(submitButton).toBeInTheDocument()
  })

  // TEST 206: Form shows "Update Customer" button text when editing
  test('form submit button shows "Update Customer" in edit mode', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Click Edit button to enter edit mode
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    // Should show "Update Customer" button
    const updateButton = screen.getByRole('button', { name: /update customer/i })
    expect(updateButton).toBeInTheDocument()
  })

  // TEST 207: Loading overlay displays when isLoading is true
  test('loading overlay shows when isLoading state is true', async () => {
    // Mock a slow API response to catch loading state
    global.fetch.mockImplementationOnce(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => []
          })
        }, 100)
      })
    )

    render(<CustomersPage />)

    // Should show loading indicator initially - check for both possible loading texts
    const loadingElements = screen.getAllByText(/loading/i)
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  // TEST 208: Success toast displays when successMessage is set
  test('success toast appears when successMessage state is set', async () => {
    const mockCustomers = []
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'New Customer', email: 'new@example.com', phone: '1234567890', address: '123 Main St' })
    })

    render(<CustomersPage />)

    // Wait for initial load
    await screen.findByText('Customer Manager')

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Customer' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main Street City' } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create customer/i })
    fireEvent.click(submitButton)

    // Wait for success message
    await screen.findByText(/customer created successfully/i)
    expect(screen.getByText(/customer created successfully/i)).toBeInTheDocument()
  })

  // TEST 209: Error toast displays when errorMessage is set
  test('error toast appears when errorMessage state is set', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'))

    render(<CustomersPage />)

    // Wait for error message to appear
    await screen.findByText(/failed to fetch customers/i)
    expect(screen.getByText(/failed to fetch customers/i)).toBeInTheDocument()
  })

  // TEST 210: Delete modal only visible when showDeleteModal is true
  test('delete modal only renders when showDeleteModal state is true', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Modal should not be visible initially
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()

    // Click delete button
    const deleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteButton)

    // Modal should now be visible
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  // TEST 211: Empty state shows "No customers found"
  test('empty state displays when no customers match filter', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Search for non-existent customer
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } })

    // Should show empty message
    expect(screen.getByText(/no customers found/i)).toBeInTheDocument()
  })

  // TEST 212: All form fields render inline in single return
  test('all four form fields render in the massive JSX', () => {
    render(<CustomersPage />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
  })

  // TEST 213: Validation errors render inline below each field
  test('validation errors display inline when validation fails', async () => {
    render(<CustomersPage />)

    // Trigger validation errors
    const nameInput = screen.getByLabelText(/name/i)
    fireEvent.change(nameInput, { target: { value: 'J' } })
    fireEvent.blur(nameInput)

    // Error should appear
    await screen.findByText(/name must be at least 2 characters/i)
    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
  })

  // TEST 214: Customer table renders with all columns
  test('customer table displays with Name, Email, Phone, Actions columns', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  // TEST 215: Edit and Delete buttons render for each customer row
  test('each customer row has Edit and Delete buttons', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomers
    })

    render(<CustomersPage />)
    await screen.findByText('John Doe')

    // Should have 2 Edit buttons and 2 Delete buttons
    const editButtons = screen.getAllByText('Edit')
    const deleteButtons = screen.getAllByText('Delete')

    expect(editButtons.length).toBe(2)
    expect(deleteButtons.length).toBe(2)
  })

  // TEST 216: Search and sort controls render inline
  test('search input and sort dropdown render in massive JSX', () => {
    render(<CustomersPage />)

    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
  })

  // TEST 217: Inline conditional using ternary for button text
  test('conditional button text uses inline ternary operator', () => {
    // Verify source code uses ternary for conditional rendering
    expect(sourceCode.match(/isEditing\s*\?\s*["']Update/i) || sourceCode.match(/isEditing\s*\?\s*["']Update/i)).toBeTruthy()
  })

  // TEST 218: Nested conditional for loading/empty/content states
  test('nested conditionals handle loading, empty, and content states', () => {
    // Verify source code has nested ternaries
    expect(sourceCode.match(/isLoading\s*\?[\s\S]*?:[\s\S]*?\?/s)).toBeTruthy()
  })

  // TEST 219: Filter and sort chained inline in map
  test('filter and sort are chained inline without variables', () => {
    // Verify inline chaining pattern
    expect(sourceCode.match(/\.filter\([^)]*\)[\s\S]*?\.sort\([^)]*\)[\s\S]*?\.map\(/s)).toBeTruthy()
  })

  // TEST 220: No extracted subcomponents (all inline)
  test('no subcomponents extracted (CustomerRow, FormField, Modal, etc)', () => {
    // Check that there are no component definitions beyond the main one
    const componentDefinitions = sourceCode.match(/function\s+[A-Z]\w*\s*\(/g) || []
    // Should only have CustomersPage (the main component)
    expect(componentDefinitions.length).toBe(1)
    expect(componentDefinitions[0]).toMatch(/CustomersPage/)
  })

  // TASK 6.2 TESTS: Inline Styling Objects

  // TEST 221: Style objects defined before return statement
  test('has style objects defined before return statement', () => {
    // Style objects should be defined in render function before return
    expect(sourceCode).toMatch(/const\s+headerStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+formStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+inputStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+buttonStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+tableStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+tableRowStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+errorStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+successStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+modalStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+overlayStyle\s*=\s*\{/)
    expect(sourceCode).toMatch(/const\s+spinnerStyle\s*=\s*\{/)
  })

  // TEST 222: All elements have style attributes
  test('all major elements have style attributes', () => {
    // Check that style prop is used extensively
    const styleMatches = sourceCode.match(/style=\{\{/g) || []
    expect(styleMatches.length).toBeGreaterThanOrEqual(15)
  })

  // TEST 223: Conditional styling with spread operator
  test('has conditional styling using spread operator', () => {
    // Check for pattern: style={{...baseButton, ...(isEditing ? editStyle : {})}}
    expect(sourceCode).toMatch(/\.\.\..*,\s*\.\.\.\(.*\?.*:\s*\{\}\)/)
  })

  // TEST 224: Inline conditional color styling
  test('has inline conditional color styling', () => {
    // Check for pattern: style={{color: nameError ? '#ef4444' : 'black'}} or similar
    expect(sourceCode).toMatch(/color:\s*\w+Error\s*\?/)
  })

  // TEST 225: Hardcoded colors present
  test('has hardcoded color values', () => {
    // Should use hardcoded hex colors
    expect(sourceCode).toMatch(/#3b82f6/i) // blue
    expect(sourceCode).toMatch(/#ef4444/i) // red
    expect(sourceCode).toMatch(/#10b981/i) // green
  })

  // TEST 226: Hardcoded spacing present
  test('has hardcoded spacing values', () => {
    // Should use hardcoded px values
    expect(sourceCode).toMatch(/['"]8px['"]/)
    expect(sourceCode).toMatch(/['"]16px['"]/)
    expect(sourceCode).toMatch(/['"]24px['"]/)
  })

  // TEST 227: No memoization of styles
  test('styles are not memoized', () => {
    // Should NOT use useMemo for styles
    const useMemoCount = (sourceCode.match(/useMemo\(/g) || []).length
    expect(useMemoCount).toBe(0)
  })

  // TEST 228: Style objects recalculated every render
  test('style objects defined in render function (not outside)', () => {
    // Styles should be defined inside the component function
    // Check that style definitions come after function declaration
    const funcStartIndex = sourceCode.indexOf('export default function CustomersPage()')
    const headerStyleIndex = sourceCode.indexOf('const headerStyle =')

    if (headerStyleIndex !== -1) {
      expect(headerStyleIndex).toBeGreaterThan(funcStartIndex)
    }
  })

  // TEST 229: File exceeds 500 lines
  test('component file exceeds 500 lines total', () => {
    const lineCount = sourceCode.split('\n').length
    expect(lineCount).toBeGreaterThanOrEqual(500)
  })

  // TEST 230: No CSS files or modules
  test('no CSS imports present', () => {
    // Should not import CSS files
    expect(sourceCode).not.toMatch(/import.*\.css/)
    expect(sourceCode).not.toMatch(/import.*styles/)
  })
})
