import React, { useState } from 'react';

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

  // Component will be implemented in subsequent tasks
  return null;
}
