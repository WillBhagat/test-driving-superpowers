import React, { useState, useEffect } from 'react';

// Type definitions for customer management system

/**
 * Represents a customer entity in the system
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * Represents a validation error for form fields
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Generic API response wrapper
 * @template T - The type of data returned in the response
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// Mock data storage (persists during component lifetime)
let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0100'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0200'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-0300'
  }
];

/**
 * Mock API service that simulates backend operations with realistic delays
 */
export const apiService = {
  /**
   * Fetches all customers from the mock backend
   * @returns Promise resolving to ApiResponse with array of customers
   */
  fetchCustomers(): Promise<ApiResponse<Customer[]>> {
    return new Promise((resolve) => {
      const delay = 1000 + Math.random() * 1000; // 1-2 second delay
      setTimeout(() => {
        resolve({
          success: true,
          data: [...mockCustomers], // Return a copy to prevent direct mutation
          error: null
        });
      }, delay);
    });
  },

  /**
   * Creates a new customer in the mock backend
   * @param customer - Customer data (without id)
   * @returns Promise resolving to ApiResponse with created customer
   */
  createCustomer(customer: Omit<Customer, 'id'>): Promise<ApiResponse<Customer>> {
    return new Promise((resolve) => {
      const delay = 1000 + Math.random() * 1000; // 1-2 second delay
      setTimeout(() => {
        const newCustomer: Customer = {
          id: crypto.randomUUID(), // Generate unique ID using random UUID
          ...customer
        };
        mockCustomers.push(newCustomer);
        resolve({
          success: true,
          data: newCustomer,
          error: null
        });
      }, delay);
    });
  },

  /**
   * Updates an existing customer in the mock backend
   * @param id - Customer ID to update
   * @param updates - Partial customer data to update
   * @returns Promise resolving to ApiResponse with updated customer
   */
  updateCustomer(id: string, updates: Partial<Omit<Customer, 'id'>>): Promise<ApiResponse<Customer>> {
    return new Promise((resolve) => {
      const delay = 1000 + Math.random() * 1000; // 1-2 second delay
      setTimeout(() => {
        const customerIndex = mockCustomers.findIndex(c => c.id === id);

        if (customerIndex === -1) {
          resolve({
            success: false,
            data: null,
            error: `Customer with id ${id} not found`
          });
          return;
        }

        // Update customer with new data
        mockCustomers[customerIndex] = {
          ...mockCustomers[customerIndex],
          ...updates
        };

        resolve({
          success: true,
          data: mockCustomers[customerIndex],
          error: null
        });
      }, delay);
    });
  },

  /**
   * Deletes a customer from the mock backend
   * @param id - Customer ID to delete
   * @returns Promise resolving to ApiResponse with success status
   */
  deleteCustomer(id: string): Promise<ApiResponse<{ id: string }>> {
    return new Promise((resolve) => {
      const delay = 1000 + Math.random() * 1000; // 1-2 second delay
      setTimeout(() => {
        const customerIndex = mockCustomers.findIndex(c => c.id === id);

        if (customerIndex === -1) {
          resolve({
            success: false,
            data: null,
            error: `Customer with id ${id} not found`
          });
          return;
        }

        // Remove customer from array
        mockCustomers.splice(customerIndex, 1);

        resolve({
          success: true,
          data: { id },
          error: null
        });
      }, delay);
    });
  }
};

/**
 * Storage service for persisting customer data to localStorage
 * Provides methods to save, load, and clear customer data with graceful error handling
 */
export const storageService = {
  /**
   * Storage key used for persisting customer data
   */
  STORAGE_KEY: 'customerManager_customers' as const,

  /**
   * Saves customer array to localStorage
   * @param customers - Array of customers to persist
   */
  saveToStorage(customers: Customer[]): void {
    try {
      const serialized = JSON.stringify(customers);
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      // Handle localStorage errors gracefully (quota exceeded, privacy mode, etc.)
      console.error('Failed to save customers to localStorage:', error);
    }
  },

  /**
   * Loads customer array from localStorage
   * @returns Array of customers, or empty array if no data exists or parsing fails
   */
  loadFromStorage(): Customer[] {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);

      // Return empty array if no data exists
      if (serialized === null) {
        return [];
      }

      const parsed = JSON.parse(serialized);

      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) {
        console.error('Invalid data format in localStorage: expected array');
        return [];
      }

      return parsed;
    } catch (error) {
      // Handle localStorage errors or JSON parsing errors gracefully
      console.error('Failed to load customers from localStorage:', error);
      return [];
    }
  },

  /**
   * Clears customer data from localStorage
   */
  clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      // Handle localStorage errors gracefully
      console.error('Failed to clear customers from localStorage:', error);
    }
  }
};

/**
 * Validation service for checking customer form data
 * Validates required fields and returns user-friendly error messages
 */
export const validationService = {
  /**
   * Validates customer data for required fields
   * @param customer - Partial customer data to validate
   * @returns Array of validation errors (empty if all required fields are present)
   */
  validateCustomer(customer: Partial<Customer>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check name field (trim whitespace to handle empty strings)
    if (!customer.name || customer.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Name is required'
      });
    }

    // Check email field (trim whitespace to handle empty strings)
    if (!customer.email || customer.email.trim() === '') {
      errors.push({
        field: 'email',
        message: 'Email is required'
      });
    }

    // Check phone field (trim whitespace to handle empty strings)
    if (!customer.phone || customer.phone.trim() === '') {
      errors.push({
        field: 'phone',
        message: 'Phone is required'
      });
    }

    return errors;
  }
};

/**
 * CustomerManager component - main component for managing customer data
 * Provides UI for viewing, creating, updating, and deleting customers
 */
export default function CustomerManager() {
  // State management hooks
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

  // Data loading effect - runs once on component mount
  useEffect(() => {
    // Track if component is still mounted to prevent setState on unmounted component
    let isMounted = true;

    // Async IIFE to handle async operations in useEffect
    (async () => {
      // Phase 1: Load cached data from localStorage immediately
      const cachedCustomers = storageService.loadFromStorage();

      if (cachedCustomers.length > 0 && isMounted) {
        // Display cached data instantly for better UX
        setCustomers(cachedCustomers);
        // Note: Keep loading indicator visible while fetching fresh data
      }

      // Phase 2: Fetch fresh data from API
      try {
        // Clear any previous errors before API call
        if (isMounted) {
          setError(null);
        }

        const response = await apiService.fetchCustomers();

        if (isMounted) {
          if (response.success && response.data) {
            // Update state with fresh data
            setCustomers(response.data);

            // Persist fresh data to localStorage
            storageService.saveToStorage(response.data);
          } else {
            // Handle API error response
            setError(response.error || 'Failed to fetch customers');
          }
        }
      } catch (err) {
        // Handle network or unexpected errors
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
      } finally {
        // Always set loading to false after API call completes
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    // Cleanup function to prevent setState on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handler functions for customer operations

  /**
   * Initiates add mode by setting editingId to 'new' and clearing the edit form
   * This prepares the UI for creating a new customer
   */
  const handleAdd = (): void => {
    setEditingId('new');
    setEditForm({});
  };

  /**
   * Initiates edit mode for an existing customer
   * Pre-fills the edit form with the customer's current data
   * @param customer - The customer to edit
   */
  const handleEdit = (customer: Customer): void => {
    setEditingId(customer.id);
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });
  };

  /**
   * Deletes a customer from the system
   * Calls the delete API, removes customer from state and updates localStorage
   * @param id - The customer ID to delete
   */
  const handleDelete = async (id: string): Promise<void> => {
    // Clear any previous errors
    setError(null);

    try {
      // Call API to delete customer
      const response = await apiService.deleteCustomer(id);

      if (response.success) {
        // Remove customer from state by filtering out the deleted customer
        const updatedCustomers = customers.filter(c => c.id !== id);
        setCustomers(updatedCustomers);

        // Persist updated customers to localStorage
        storageService.saveToStorage(updatedCustomers);
      } else {
        // Handle API error response
        setError(response.error || 'Failed to delete customer');
      }
    } catch (err) {
      // Handle network or unexpected errors
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  /**
   * Updates a specific field in the edit form
   * @param field - The customer field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: keyof Customer, value: string): void => {
    setEditForm(prevForm => ({
      ...prevForm,
      [field]: value
    }));
  };

  /**
   * Saves the current edit form, handling both create and update operations
   * Branches on editingId to determine if creating new or updating existing customer
   * Validates form data, calls appropriate API, updates state and localStorage
   */
  const handleSave = async (): Promise<void> => {
    // Clear any previous errors
    setError(null);

    // Validate form data before API call
    const validationErrors = validationService.validateCustomer(editForm);

    if (validationErrors.length > 0) {
      // Format validation errors into a single error message string
      const errorMessage = validationErrors
        .map(err => err.message)
        .join(', ');
      setError(errorMessage);
      return;
    }

    // Type assertion: after validation, we know all required fields are present
    const customerData = editForm as Omit<Customer, 'id'>;

    try {
      // Branch on editingId to determine create vs update operation
      if (editingId === 'new') {
        // CREATE CASE: Call API to create new customer
        const response = await apiService.createCustomer(customerData);

        if (response.success && response.data) {
          // Update customers state with new customer
          const updatedCustomers = [...customers, response.data];
          setCustomers(updatedCustomers);

          // Persist updated customers to localStorage
          storageService.saveToStorage(updatedCustomers);

          // Exit edit mode and clear form
          setEditingId(null);
          setEditForm({});
        } else {
          // Handle API error response
          setError(response.error || 'Failed to create customer');
        }
      } else if (editingId) {
        // UPDATE CASE: Call API to update existing customer
        const response = await apiService.updateCustomer(editingId, customerData);

        if (response.success && response.data) {
          // Update customers state by replacing the old customer with the updated one
          const updatedCustomers = customers.map(customer =>
            customer.id === editingId ? response.data! : customer
          );
          setCustomers(updatedCustomers);

          // Persist updated customers to localStorage
          storageService.saveToStorage(updatedCustomers);

          // Exit edit mode and clear form
          setEditingId(null);
          setEditForm({});
        } else {
          // Handle API error response
          setError(response.error || 'Failed to update customer');
        }
      }
    } catch (err) {
      // Handle network or unexpected errors
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  /**
   * Cancels the current edit operation
   * Clears edit mode and resets the edit form
   */
  const handleCancel = (): void => {
    setEditingId(null);
    setEditForm({});
  };

  /**
   * Dismisses the current error by clearing the error state
   * Allows users to remove error alerts from the UI
   */
  const handleDismissError = (): void => {
    setError(null);
  };

  /**
   * Retries data loading by resetting loading state and triggering a reload
   * Clears current error and initiates a fresh API call
   */
  const handleRetry = async (): Promise<void> => {
    // Clear error and set loading state
    setError(null);
    setLoading(true);

    try {
      const response = await apiService.fetchCustomers();

      if (response.success && response.data) {
        // Update state with fresh data
        setCustomers(response.data);

        // Persist fresh data to localStorage
        storageService.saveToStorage(response.data);
      } else {
        // Handle API error response
        setError(response.error || 'Failed to fetch customers');
      }
    } catch (err) {
      // Handle network or unexpected errors
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      // Always set loading to false after API call completes
      setLoading(false);
    }
  };

  // Render component UI
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Error alert - displayed when error exists */}
      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#c33' }}>Error:</strong>
            <span style={{ marginLeft: '8px', color: '#600' }}>{error}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
            <button
              onClick={handleRetry}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Retry
            </button>
            <button
              onClick={handleDismissError}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading spinner - displayed during data fetching */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            fontSize: '18px',
            color: '#666'
          }}
        >
          <div style={{ marginBottom: '12px' }}>Loading customers...</div>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Main content - displayed when not loading */}
      {!loading && (
        <div>
          <h1>Customer Manager</h1>
          <p>Customer management functionality will be implemented in subsequent tasks.</p>
        </div>
      )}
    </div>
  );
}
