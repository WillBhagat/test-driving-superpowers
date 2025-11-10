'use client'

import { useState, useEffect } from 'react'

export default function CustomersPage() {
  // Form field states
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')

  // Validation error states
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [generalError, setGeneralError] = useState('')

  // UI state hooks
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  // Search and sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  // Message states
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [lastSaved, setLastSaved] = useState(null)

  // Cache Layer 1 - In-Memory cache (separate from customers, will drift out of sync)
  const [cachedCustomers, setCachedCustomers] = useState([])

  // Cache Layer 2 - localStorage flag
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false)

  // Cache Layer 3 - sessionStorage flag
  const [sessionStorageLoaded, setSessionStorageLoaded] = useState(false)

  // Primary data (conflicts with cachedCustomers)
  const [customers, setCustomers] = useState([])

  // useEffect 1: Initial load from localStorage on mount
  // Race condition: loads before API, may be overwritten
  useEffect(() => {
    const cached = localStorage.getItem('customers_cache')
    if (cached) {
      try {
        const parsedData = JSON.parse(cached)
        setCustomers(parsedData)
        setLocalStorageLoaded(true)
      } catch (e) {
        setErrorMessage('Failed to load cached customers')
      }
    }
  }, [])

  // useEffect 12: Load search preferences from sessionStorage on mount
  useEffect(() => {
    const savedPrefs = sessionStorage.getItem('customer_search_prefs')
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        if (prefs.searchTerm) {
          setSearchTerm(prefs.searchTerm)
        }
        if (prefs.sortBy) {
          setSortBy(prefs.sortBy)
        }
      } catch (e) {
        // Silently fail
      }
    }
  }, [])

  // useEffect 2: Initial API fetch on mount
  // Race condition: conflicts with localStorage load, last one wins
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setErrorMessage('Failed to fetch customers from API')
        setIsLoading(false)
      })
  }, [])

  // useEffect 3: Save customers to localStorage on every change
  // Race condition: may overwrite newer data from API
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('customers_cache', JSON.stringify(customers))
    }
  }, [customers])

  // useEffect 4: Update cachedCustomers when customers changes (delayed)
  // Creates staleness - 500ms delay causes cachedCustomers to lag behind
  useEffect(() => {
    setTimeout(() => {
      setCachedCustomers(customers)
    }, 500)
  }, [customers])

  // useEffect 5: Save search preferences to sessionStorage
  // Overlapping dependencies with other effects
  useEffect(() => {
    if (searchTerm || sortBy) {
      sessionStorage.setItem(
        'customer_search_prefs',
        JSON.stringify({ searchTerm, sortBy })
      )
    }
  }, [searchTerm, sortBy])

  // useEffect 6: Load from cachedCustomers if customers is empty
  // Race condition: may serve stale data instead of waiting for API
  useEffect(() => {
    if (customers.length === 0 && cachedCustomers.length > 0) {
      setCustomers(cachedCustomers)
    }
  }, [customers, cachedCustomers])

  // useEffect 7: Auto-save draft form data to sessionStorage every 2 seconds
  // Memory leak: setInterval not cleaned up
  useEffect(() => {
    setInterval(() => {
      if (customerName || customerEmail || customerPhone || customerAddress) {
        sessionStorage.setItem(
          'customer_draft_form',
          JSON.stringify({
            customerName,
            customerEmail,
            customerPhone,
            customerAddress
          })
        )
        setLastSaved(new Date())
      }
    }, 2000)
  }, [customerName, customerEmail, customerPhone, customerAddress])

  // useEffect 8: Clear success message after 3 seconds
  // Memory leak: setTimeout not cleaned up
  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }
  }, [successMessage])

  // useEffect 9: Clear error message after 3 seconds
  // Memory leak: setTimeout not cleaned up
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }, [errorMessage])

  // useEffect 10: Search debounce with setTimeout
  // Conflicts with search preferences sync, both fire on searchTerm change
  useEffect(() => {
    setTimeout(() => {
      if (searchTerm) {
        // Debounced search would happen here
        setIsLoading(true)
        setIsLoading(false)
      }
    }, 300)
  }, [searchTerm])

  // useEffect 11: Periodically check localStorage and merge with state
  // Memory leak: setInterval not cleaned up
  // Race condition: creates conflicts by merging stale localStorage data
  useEffect(() => {
    setInterval(() => {
      const cached = localStorage.getItem('customers_cache')
      if (cached) {
        try {
          const parsedData = JSON.parse(cached)
          // Merge logic creates conflicts - may overwrite newer in-memory data
          if (parsedData.length > customers.length) {
            setCustomers(parsedData)
          }
        } catch (e) {
          // Silently fail
        }
      }
    }, 5000)
  }, [customers])

  // validateForm function - DUPLICATED VALIDATION #3
  // Third copy of all validation logic (duplicated from onChange and onBlur)
  const validateForm = () => {
    let isValid = true

    // DUPLICATED VALIDATION #3 - validateForm for Name
    // Validation: required, 2-50 characters (EXACT COPY)
    if (customerName === '') {
      setNameError('Name is required')
      isValid = false
    } else if (customerName.length < 2) {
      setNameError('Name must be at least 2 characters')
      isValid = false
    } else if (customerName.length > 50) {
      setNameError('Name must be no more than 50 characters')
      isValid = false
    } else {
      setNameError('')
    }

    // DUPLICATED VALIDATION #3 - validateForm for Email
    // Validation: required, valid email format (EXACT COPY)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (customerEmail === '') {
      setEmailError('Email is required')
      isValid = false
    } else if (!emailRegex.test(customerEmail)) {
      setEmailError('Email must be a valid format')
      isValid = false
    } else {
      setEmailError('')
    }

    // DUPLICATED VALIDATION #3 - validateForm for Phone
    // Validation: required, 10-15 digits (EXACT COPY)
    const digitsOnly = customerPhone.replace(/\D/g, '')
    if (customerPhone === '') {
      setPhoneError('Phone is required')
      isValid = false
    } else if (digitsOnly.length < 10) {
      setPhoneError('Phone must be at least 10 digits')
      isValid = false
    } else if (digitsOnly.length > 15) {
      setPhoneError('Phone must be no more than 15 digits')
      isValid = false
    } else {
      setPhoneError('')
    }

    // DUPLICATED VALIDATION #3 - validateForm for Address
    // Validation: required, 10-200 characters (EXACT COPY)
    if (customerAddress === '') {
      setAddressError('Address is required')
      isValid = false
    } else if (customerAddress.length < 10) {
      setAddressError('Address must be at least 10 characters')
      isValid = false
    } else if (customerAddress.length > 200) {
      setAddressError('Address must be no more than 200 characters')
      isValid = false
    } else {
      setAddressError('')
    }

    return isValid
  }

  // handleEdit function - TASK 4.1: Edit Mode with Stale Cache Reads
  // Find customer by ID, populate form (checks customers first, fallback to cachedCustomers)
  // Anti-pattern: No stale data warning, reads from whichever cache has the data
  const handleEdit = (customerId) => {
    // Inline lookup: customers.find() || cachedCustomers.find()
    // No conflict detection, no version checking, may read stale data
    const customer = customers.find((c) => c.id === customerId) || cachedCustomers.find((c) => c.id === customerId)

    if (customer) {
      // Set isEditing to true
      setIsEditing(true)
      // Set editingId to customer.id
      setEditingId(customer.id)

      // Populate form fields directly (no controlled form pattern)
      setCustomerName(customer.name)
      setCustomerEmail(customer.email)
      setCustomerPhone(customer.phone)
      setCustomerAddress(customer.address)
    }
  }

  // handleCancel function - TASK 4.1: Cancel Edit Mode
  // Clears isEditing and form fields
  const handleCancel = () => {
    // Clear isEditing state
    setIsEditing(false)
    // Clear editingId state
    setEditingId(null)

    // Clear all form fields
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setCustomerAddress('')
  }

  // handleCreate function - Create customer with multi-cache updates
  // Anti-pattern: Uncoordinated cache updates create race conditions and drift
  const handleCreate = async () => {
    // Call validateForm() and abort if validation fails
    if (!validateForm()) {
      return
    }

    // Set isLoading to true
    setIsLoading(true)

    try {
      // Make POST request to API with form data
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create customer')
      }

      const newCustomer = await response.json()

      // ANTI-PATTERN: Separate, uncoordinated cache updates
      // Update 1: Add to customers array
      const updatedCustomers = [...customers, newCustomer]
      setCustomers(updatedCustomers)

      // Update 2: SEPARATELY add to cachedCustomers (creates drift opportunity)
      const updatedCachedCustomers = [...cachedCustomers, newCustomer]
      setCachedCustomers(updatedCachedCustomers)

      // Update 3: Save to localStorage (may happen before/after state updates)
      localStorage.setItem('customers_cache', JSON.stringify(updatedCustomers))

      // Update 4: Save to sessionStorage as "last created"
      sessionStorage.setItem('last_created_customer', JSON.stringify(newCustomer))

      // Set success message
      setSuccessMessage('Customer created successfully!')

      // Clear form fields
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setCustomerAddress('')

      // Set isLoading to false
      setIsLoading(false)
    } catch (error) {
      // Set error message with error details
      setErrorMessage('Failed to create customer: ' + error.message)

      // Set isLoading to false
      setIsLoading(false)

      // Leave form data intact (do not clear fields)
    }
  }

  // handleUpdate function - TASK 4.2: Update Customer with Partial Cache Updates
  // Anti-pattern: Partial cache sync - only updates customers + localStorage, skips cachedCustomers + sessionStorage
  const handleUpdate = async () => {
    // Call validateForm() and abort if validation fails
    if (!validateForm()) {
      return
    }

    // Set isLoading to true
    setIsLoading(true)

    try {
      // Make PUT request to API with editingId
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update customer')
      }

      const updatedCustomer = await response.json()

      // ANTI-PATTERN: Partial cache update - only update customers array
      // Update customers array using .map to find and replace
      const updatedCustomers = customers.map((c) =>
        c.id === editingId ? updatedCustomer : c
      )
      setCustomers(updatedCustomers)

      // SKIP cachedCustomers update (intentional stale cache)
      // This creates cache drift - cachedCustomers stays stale

      // Update localStorage only
      localStorage.setItem('customers_cache', JSON.stringify(updatedCustomers))

      // SKIP sessionStorage update (intentional stale cache)
      // No sessionStorage.setItem for updated customer

      // Set success message
      setSuccessMessage('Customer updated successfully!')

      // Clear edit mode
      setIsEditing(false)
      setEditingId(null)

      // Clear form fields
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setCustomerAddress('')

      // Set isLoading to false
      setIsLoading(false)
    } catch (error) {
      // Set error message with error details
      setErrorMessage('Failed to update customer: ' + error.message)

      // Set isLoading to false
      setIsLoading(false)

      // Leave form data intact and stay in edit mode (do not clear fields or edit state)
    }
  }

  // handleDelete function - TASK 5.1: Set deleteTargetId and showDeleteModal
  // Opens confirmation modal for delete operation
  const handleDelete = (customerId) => {
    // Set deleteTargetId to the customer id
    setDeleteTargetId(customerId)
    // Set showDeleteModal to true
    setShowDeleteModal(true)
  }

  // handleConfirmDelete function - TASK 5.1: Delete Customer with Incomplete Cache Invalidation
  // Anti-pattern: Partial cache invalidation - only updates customers + localStorage, skips cachedCustomers + sessionStorage
  const handleConfirmDelete = async () => {
    try {
      // Make DELETE request to API with deleteTargetId
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${deleteTargetId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete customer')
      }

      // ANTI-PATTERN: Partial cache invalidation
      // Remove from customers array using filter
      const updatedCustomers = customers.filter((c) => c.id !== deleteTargetId)
      setCustomers(updatedCustomers)

      // Update localStorage only
      localStorage.setItem('customers_cache', JSON.stringify(updatedCustomers))

      // SKIP cachedCustomers removal (intentional phantom record)
      // This creates cache drift - cachedCustomers still has the deleted customer

      // SKIP sessionStorage removal (intentional stale references)
      // No sessionStorage removal for customer references

      // Set success message
      setSuccessMessage('Customer deleted successfully!')

      // Close modal
      setShowDeleteModal(false)

      // Clear deleteTargetId
      setDeleteTargetId(null)
    } catch (error) {
      // Set error message with error details
      setErrorMessage('Failed to delete customer: ' + error.message)

      // Close modal
      setShowDeleteModal(false)
    }
  }

  // handleCancelDelete function - TASK 5.1: Cancel delete operation
  // Closes modal without deleting
  const handleCancelDelete = () => {
    // Close modal
    setShowDeleteModal(false)
    // Clear deleteTargetId (optional, but good practice)
    setDeleteTargetId(null)
  }

  // TASK 3.1: Display logic - whichever cache loads first
  // Anti-pattern: Inconsistent cache reads can show wrong data
  const displayCustomers = customers.length ? customers : cachedCustomers

  // TASK 6.2: Inline Styling Objects - Defined before return (recalculated every render)
  // Anti-pattern: No memoization, recalculated on every render
  // Anti-pattern: Hardcoded colors and spacing values
  // Anti-pattern: Duplicated styles for similar elements

  // Header styles - duplicated padding and colors
  const headerStyle = {
    padding: '24px',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #3b82f6',
    marginBottom: '24px'
  }

  const headerTitleStyle = {
    color: '#3b82f6',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 8px 0'
  }

  const headerSubtitleStyle = {
    color: '#666',
    fontSize: '16px',
    margin: '8px 0'
  }

  // Form styles - duplicated for similar form sections
  const formStyle = {
    padding: '24px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '24px'
  }

  const formTitleStyle = {
    color: '#3b82f6',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  }

  // Input styles - separate objects for each type (duplicated)
  const inputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '8px'
  }

  const inputLabelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  }

  const inputContainerStyle = {
    marginBottom: '16px'
  }

  // Separate input styles for each field (duplication)
  const nameInputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '8px'
  }

  const emailInputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '8px'
  }

  const phoneInputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '8px'
  }

  const addressInputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: '100%',
    minHeight: '80px',
    marginBottom: '8px'
  }

  // Button styles - duplicated base styles
  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  }

  const primaryButtonStyle = {
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  }

  const secondaryButtonStyle = {
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  }

  const dangerButtonStyle = {
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  }

  const editButtonStyle = {
    backgroundColor: '#10b981',
    padding: '8px 16px'
  }

  // Table styles - duplicated styling
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    marginTop: '16px'
  }

  const tableHeaderStyle = {
    backgroundColor: '#f5f5f5',
    padding: '8px',
    textAlign: 'left',
    borderBottom: '2px solid #3b82f6',
    fontWeight: 'bold'
  }

  const tableRowStyle = {
    borderBottom: '1px solid #e0e0e0'
  }

  const tableCellStyle = {
    padding: '8px',
    borderBottom: '1px solid #e0e0e0'
  }

  // Error and success styles
  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '8px'
  }

  const successStyle = {
    color: '#10b981',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '8px'
  }

  const errorToastStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    zIndex: 10000,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }

  const successToastStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    zIndex: 10000,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }

  // Modal styles
  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    maxWidth: '400px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  }

  const modalTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333'
  }

  const modalTextStyle = {
    fontSize: '16px',
    marginBottom: '24px',
    color: '#666'
  }

  // Overlay and spinner styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }

  const spinnerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3b82f6'
  }

  // Search and filter styles
  const searchSectionStyle = {
    padding: '24px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '24px'
  }

  const searchInputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: '300px',
    marginRight: '16px'
  }

  const selectStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginRight: '16px'
  }

  // Container styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px'
  }

  const sectionStyle = {
    marginBottom: '24px'
  }

  // TASK 6.1: Massive Single JSX Return Statement (200+ lines)
  // All UI sections inline: header, search, form, validation, table, loading, toasts, modal
  // No extracted components, no JSX variables, deeply nested conditionals
  return (
    <div style={containerStyle}>
      {/* TASK 6.1: Loading Overlay - covers entire page when isLoading is true */}
      {/* TASK 6.2: Apply overlayStyle and spinnerStyle */}
      {isLoading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}>Loading...</div>
        </div>
      )}

      {/* TASK 6.1: Success Toast - green message when successMessage is set */}
      {/* TASK 6.2: Apply successToastStyle */}
      {successMessage && (
        <div style={successToastStyle}>
          {successMessage}
        </div>
      )}

      {/* TASK 6.1: Error Toast - red message when errorMessage is set */}
      {/* TASK 6.2: Apply errorToastStyle */}
      {errorMessage && (
        <div style={errorToastStyle}>
          {errorMessage}
        </div>
      )}

      {/* TASK 6.1: Header Section - title and customer count from cachedCustomers */}
      {/* TASK 6.2: Apply headerStyle, headerTitleStyle, headerSubtitleStyle */}
      <div style={headerStyle}>
        <h1 style={headerTitleStyle}>Customer Manager</h1>
        <p style={headerSubtitleStyle}>Total customers: {cachedCustomers.length}</p>
        <p style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
          {localStorageLoaded ? 'Data from localStorage cache' : sessionStorageLoaded ? 'Data from sessionStorage cache' : 'Data from in-memory cache'}
        </p>
      </div>

      {/* TASK 6.1: Search Section - inline search input and sort dropdown */}
      {/* TASK 6.2: Apply searchSectionStyle, searchInputStyle, selectStyle */}
      <div style={searchSectionStyle}>
        <h2 style={formTitleStyle}>Search and Filter</h2>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="searchInput" style={inputLabelStyle}>Search:</label>
          <input
            id="searchInput"
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="sortDropdown" style={inputLabelStyle}>Sort by:</label>
          <select
            id="sortDropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="">-- Select Sort --</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="email-asc">Email A-Z</option>
          </select>
        </div>
      </div>

      {/* TASK 6.1: Form Section - all inputs inline with conditional submit button text */}
      {/* TASK 6.2: Apply formStyle, formTitleStyle with conditional styling */}
      <div style={formStyle}>
        <h2 style={{...formTitleStyle, color: isEditing ? '#10b981' : '#3b82f6'}}>{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>

        {/* Name Input with inline validation error */}
        {/* TASK 6.2: Apply inputContainerStyle, inputLabelStyle, nameInputStyle */}
        {/* TASK 6.2: Inline conditional color styling for error state */}
        <div style={inputContainerStyle}>
          <label htmlFor="customerName" style={{...inputLabelStyle, color: nameError ? '#ef4444' : '#333'}}>Name:</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => {
              const value = e.target.value
              setCustomerName(value)

              // DUPLICATED VALIDATION #1 - onChange for Name
              // Validation: required, 2-50 characters
              if (value === '') {
                setNameError('Name is required')
              } else if (value.length < 2) {
                setNameError('Name must be at least 2 characters')
              } else if (value.length > 50) {
                setNameError('Name must be no more than 50 characters')
              } else {
                setNameError('')
              }
            }}
            onBlur={(e) => {
              const value = e.target.value

              // DUPLICATED VALIDATION #2 - onBlur for Name
              // Validation: required, 2-50 characters (EXACT COPY)
              if (value === '') {
                setNameError('Name is required')
              } else if (value.length < 2) {
                setNameError('Name must be at least 2 characters')
              } else if (value.length > 50) {
                setNameError('Name must be no more than 50 characters')
              } else {
                setNameError('')
              }
            }}
            style={{...nameInputStyle, borderColor: nameError ? '#ef4444' : '#e0e0e0'}}
          />
          {nameError && <div style={{...errorStyle, color: nameError ? '#ef4444' : 'black'}}>{nameError}</div>}
        </div>

        {/* Email Input with inline validation error */}
        {/* TASK 6.2: Apply styles with inline conditional color */}
        <div style={inputContainerStyle}>
          <label htmlFor="customerEmail" style={{...inputLabelStyle, color: emailError ? '#ef4444' : '#333'}}>Email:</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => {
              const value = e.target.value
              setCustomerEmail(value)

              // DUPLICATED VALIDATION #1 - onChange for Email
              // Validation: required, valid email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (value === '') {
                setEmailError('Email is required')
              } else if (!emailRegex.test(value)) {
                setEmailError('Email must be a valid format')
              } else {
                setEmailError('')
              }
            }}
            onBlur={(e) => {
              const value = e.target.value

              // DUPLICATED VALIDATION #2 - onBlur for Email
              // Validation: required, valid email format (EXACT COPY)
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (value === '') {
                setEmailError('Email is required')
              } else if (!emailRegex.test(value)) {
                setEmailError('Email must be a valid format')
              } else {
                setEmailError('')
              }
            }}
            style={{...emailInputStyle, borderColor: emailError ? '#ef4444' : '#e0e0e0'}}
          />
          {emailError && <div style={{...errorStyle, color: emailError ? '#ef4444' : 'black'}}>{emailError}</div>}
        </div>

        {/* Phone Input with inline validation error */}
        {/* TASK 6.2: Apply styles with inline conditional color */}
        <div style={inputContainerStyle}>
          <label htmlFor="customerPhone" style={{...inputLabelStyle, color: phoneError ? '#ef4444' : '#333'}}>Phone:</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => {
              const value = e.target.value
              setCustomerPhone(value)

              // DUPLICATED VALIDATION #1 - onChange for Phone
              // Validation: required, 10-15 digits
              const digitsOnly = value.replace(/\D/g, '')
              if (value === '') {
                setPhoneError('Phone is required')
              } else if (digitsOnly.length < 10) {
                setPhoneError('Phone must be at least 10 digits')
              } else if (digitsOnly.length > 15) {
                setPhoneError('Phone must be no more than 15 digits')
              } else {
                setPhoneError('')
              }
            }}
            onBlur={(e) => {
              const value = e.target.value

              // DUPLICATED VALIDATION #2 - onBlur for Phone
              // Validation: required, 10-15 digits (EXACT COPY)
              const digitsOnly = value.replace(/\D/g, '')
              if (value === '') {
                setPhoneError('Phone is required')
              } else if (digitsOnly.length < 10) {
                setPhoneError('Phone must be at least 10 digits')
              } else if (digitsOnly.length > 15) {
                setPhoneError('Phone must be no more than 15 digits')
              } else {
                setPhoneError('')
              }
            }}
            style={{...phoneInputStyle, borderColor: phoneError ? '#ef4444' : '#e0e0e0'}}
          />
          {phoneError && <div style={{...errorStyle, color: phoneError ? '#ef4444' : 'black'}}>{phoneError}</div>}
        </div>

        {/* Address Textarea with inline validation error */}
        {/* TASK 6.2: Apply styles with inline conditional color */}
        <div style={inputContainerStyle}>
          <label htmlFor="customerAddress" style={{...inputLabelStyle, color: addressError ? '#ef4444' : '#333'}}>Address:</label>
          <textarea
            id="customerAddress"
            value={customerAddress}
            onChange={(e) => {
              const value = e.target.value
              setCustomerAddress(value)

              // DUPLICATED VALIDATION #1 - onChange for Address
              // Validation: required, 10-200 characters
              if (value === '') {
                setAddressError('Address is required')
              } else if (value.length < 10) {
                setAddressError('Address must be at least 10 characters')
              } else if (value.length > 200) {
                setAddressError('Address must be no more than 200 characters')
              } else {
                setAddressError('')
              }
            }}
            onBlur={(e) => {
              const value = e.target.value

              // DUPLICATED VALIDATION #2 - onBlur for Address
              // Validation: required, 10-200 characters (EXACT COPY)
              if (value === '') {
                setAddressError('Address is required')
              } else if (value.length < 10) {
                setAddressError('Address must be at least 10 characters')
              } else if (value.length > 200) {
                setAddressError('Address must be no more than 200 characters')
              } else {
                setAddressError('')
              }
            }}
            style={{...addressInputStyle, borderColor: addressError ? '#ef4444' : '#e0e0e0'}}
          />
          {addressError && <div style={{...errorStyle, color: addressError ? '#ef4444' : 'black'}}>{addressError}</div>}
        </div>

        {/* TASK 6.1: Conditional Submit Button - "Create Customer" vs "Update Customer" */}
        {/* TASK 6.2: Conditional styling with spread operator */}
        <button
          type="button"
          onClick={isEditing ? handleUpdate : handleCreate}
          style={{...buttonStyle, ...(isEditing ? editButtonStyle : {})}}
        >
          {isEditing ? 'Update Customer' : 'Create Customer'}
        </button>

        {/* TASK 6.1: Cancel Button - only shows when editing */}
        {/* TASK 6.2: Apply secondaryButtonStyle */}
        {isEditing && (
          <button type="button" onClick={handleCancel} style={{...secondaryButtonStyle, marginLeft: '8px'}}>
            Cancel Edit
          </button>
        )}
      </div>

      {/* TASK 6.1: Customer List Section - nested conditionals for loading/empty/content */}
      {/* TASK 6.2: Apply sectionStyle */}
      <div style={sectionStyle}>
        <h2 style={formTitleStyle}>Customer List</h2>

        {/* TASK 6.1: Nested Conditional - isLoading ? spinner : (empty ? message : table) */}
        {isLoading ? (
          <div style={spinnerStyle}>Loading customers...</div>
        ) : displayCustomers.length === 0 ? (
          <p style={{padding: '16px', color: '#666'}}>No customers found</p>
        ) : (
          <div>
            {/* TASK 6.1: Filter and sort inline - show results count */}
            <p style={{padding: '8px 0', color: '#666', fontSize: '14px'}}>
              Showing {displayCustomers.filter((c) => c.name.includes(searchTerm)).length} of {displayCustomers.length} customers
            </p>

            {/* TASK 6.1: Customer Table - all inline, no extracted row component */}
            {displayCustomers.filter((c) => c.name.includes(searchTerm)).length === 0 ? (
              <p style={{padding: '16px', color: '#666'}}>No customers found matching "{searchTerm}"</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={tableRowStyle}>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Phone</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TASK 6.1: Inline filter+sort+map chain - no useMemo, no variables */}
                  {displayCustomers
                    .filter((c) => c.name.includes(searchTerm))
                    .sort((a, b) => {
                      if (sortBy === 'name-asc') {
                        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                      } else if (sortBy === 'name-desc') {
                        return a.name > b.name ? -1 : a.name < b.name ? 1 : 0
                      } else if (sortBy === 'email-asc') {
                        return a.email < b.email ? -1 : a.email > b.email ? 1 : 0
                      }
                      return 0
                    })
                    .map((customer) => (
                      <tr key={customer.id} style={tableRowStyle}>
                        <td style={tableCellStyle}>{customer.name}</td>
                        <td style={tableCellStyle}>{customer.email}</td>
                        <td style={tableCellStyle}>{customer.phone}</td>
                        <td style={tableCellStyle}>
                          {/* TASK 6.1: Inline conditional - Edit vs Cancel button */}
                          {/* TASK 6.2: Apply button styles conditionally */}
                          {isEditing && editingId === customer.id ? (
                            <button type="button" onClick={handleCancel} style={secondaryButtonStyle}>Cancel</button>
                          ) : (
                            <button type="button" onClick={() => handleEdit(customer.id)} style={{...primaryButtonStyle, backgroundColor: '#10b981'}}>Edit</button>
                          )}
                          <button type="button" onClick={() => handleDelete(customer.id)} style={{...dangerButtonStyle, marginLeft: '8px'}}>Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* TASK 6.1: Delete Modal - inline confirmation modal, no extracted component */}
      {/* TASK 6.2: Apply modalStyle and modalContentStyle */}
      {showDeleteModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={modalTitleStyle}>Are you sure?</h3>
            <p style={modalTextStyle}>Do you want to delete this customer? This action cannot be undone.</p>
            <div>
              <button type="button" onClick={handleConfirmDelete} style={dangerButtonStyle}>Confirm</button>
              <button type="button" onClick={handleCancelDelete} style={{...secondaryButtonStyle, marginLeft: '8px'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TASK 6.1: General Error Display - inline at bottom */}
      {/* TASK 6.2: Apply errorStyle with hardcoded colors */}
      {generalError && (
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ffebee', color: '#ef4444', borderRadius: '8px', border: '1px solid #ef4444' }}>
          {generalError}
        </div>
      )}

      {/* TASK 6.1: Last Saved Indicator - shows draft auto-save time */}
      {/* TASK 6.2: Apply inline styles with hardcoded values */}
      {lastSaved && (
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#999', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          Draft last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
