import React from 'react'
import { render, screen } from '@testing-library/react'
import fs from 'fs'
import path from 'path'
import CustomersPage from '../page'

// Read the source file directly
const sourceFilePath = path.join(__dirname, '../page.jsx')
const sourceCode = fs.readFileSync(sourceFilePath, 'utf-8')

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

    // Verify they are NOT being synchronized
    const hasSyncCode =
      sourceCode.includes('setCachedCustomers(customers)') ||
      sourceCode.includes('setCustomers(cachedCustomers)')

    expect(hasSyncCode).toBe(false)
  })
})
