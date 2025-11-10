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

  return (
    <div>
      <h1>Customer Manager</h1>
      <p>This is a monolithic customer management component with 20+ useState hooks.</p>
    </div>
  )
}
