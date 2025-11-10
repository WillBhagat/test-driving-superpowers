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
  const [isLoading, setIsLoading] = useState(false)
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

  return (
    <div>
      <h1>Customer Manager</h1>
      <p>This is a monolithic customer management component with 20+ useState hooks.</p>

      {/* Customer Input Form */}
      <div>
        <h2>Add Customer</h2>

        {/* Name Input */}
        <div>
          <label htmlFor="customerName">Name:</label>
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
          />
          {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="customerEmail">Email:</label>
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
          />
          {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="customerPhone">Phone:</label>
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
          />
          {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}
        </div>

        {/* Address Textarea */}
        <div>
          <label htmlFor="customerAddress">Address:</label>
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
          />
          {addressError && <div style={{ color: 'red' }}>{addressError}</div>}
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleCreate}>
          Add Customer
        </button>
      </div>
    </div>
  )
}
