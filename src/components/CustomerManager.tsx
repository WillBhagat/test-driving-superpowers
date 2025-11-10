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
