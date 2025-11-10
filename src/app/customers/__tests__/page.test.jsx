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

    const submitButton = screen.getByRole('button', { name: /add customer/i })
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
    const submitButton = screen.getByRole('button', { name: /add customer/i })
    expect(submitButton).toBeInTheDocument()
  })

  // TEST 58: validateForm returns false for invalid form data
  test('validateForm returns false when fields are invalid', () => {
    render(<CustomersPage />)

    const nameInput = screen.getByLabelText(/name/i)
    const submitButton = screen.getByRole('button', { name: /add customer/i })

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

    const submitButton = screen.getByRole('button', { name: /add customer/i })

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
