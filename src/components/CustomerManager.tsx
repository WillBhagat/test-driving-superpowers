import React from 'react';

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
const apiService = {
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
          id: Date.now().toString(), // Generate unique ID using timestamp
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
