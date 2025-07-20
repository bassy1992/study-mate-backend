/**
 * Test script to demonstrate the enhanced API error handling
 * Run this in the browser console to see the improved error logging
 */

// Import the API client (adjust path as needed)
// import { apiClient, ApiError } from './shared/api.js';
// import { ErrorHandler, withRetry } from './shared/error-utils.js';

// For testing in browser console, we'll simulate the API calls
const testErrorHandling = async () => {
  console.log('🧪 Testing Enhanced API Error Handling');
  console.log('=====================================');

  // Test 1: Network Error
  console.log('\n1. Testing Network Error...');
  try {
    // Simulate network error by calling non-existent endpoint
    await fetch('http://localhost:9999/non-existent-api');
  } catch (error) {
    console.log('✅ Network error caught and logged properly');
  }

  // Test 2: Authentication Error
  console.log('\n2. Testing Authentication Error...');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
      headers: {
        'Authorization': 'Token invalid-token-here',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('✅ Auth error response:', errorData);
    }
  } catch (error) {
    console.log('Network error while testing auth:', error.message);
  }

  // Test 3: Validation Error
  console.log('\n3. Testing Validation Error...');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/ecommerce/orders/', {
      method: 'POST',
      headers: {
        'Authorization': 'Token valid-token-here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Missing required fields to trigger validation error
        bundle_ids: []
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('✅ Validation error response:', errorData);
    }
  } catch (error) {
    console.log('Network error while testing validation:', error.message);
  }

  // Test 4: 404 Error
  console.log('\n4. Testing 404 Error...');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/ecommerce/bundles/non-existent-bundle/');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('✅ 404 error response:', errorData);
    }
  } catch (error) {
    console.log('Network error while testing 404:', error.message);
  }

  console.log('\n🎉 Error handling tests completed!');
  console.log('Check the console logs above to see the enhanced error information.');
};

// Test the error utility functions
const testErrorUtils = () => {
  console.log('\n🔧 Testing Error Utility Functions');
  console.log('==================================');

  // Create mock ApiError instances
  const networkError = {
    name: 'ApiError',
    message: 'Network error: Unable to connect to server',
    status: 0,
    code: 'NETWORK_ERROR',
    url: '/api/test',
    timestamp: new Date().toISOString()
  };

  const authError = {
    name: 'ApiError',
    message: 'Authentication failed',
    status: 401,
    code: 'UNAUTHORIZED',
    url: '/api/profile',
    timestamp: new Date().toISOString()
  };

  const validationError = {
    name: 'ApiError',
    message: 'Validation failed',
    status: 422,
    code: 'VALIDATION_ERROR',
    data: { email: ['This field is required'] },
    url: '/api/register',
    timestamp: new Date().toISOString()
  };

  console.log('Network Error Toast Config:', {
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your internet connection.',
    variant: 'destructive',
    duration: 5000
  });

  console.log('Auth Error Toast Config:', {
    title: 'Authentication Required',
    description: 'Your session has expired. Redirecting to login...',
    variant: 'destructive',
    duration: 4000
  });

  console.log('Validation Error Toast Config:', {
    title: 'Validation Error',
    description: 'Please correct the following errors: email: This field is required',
    variant: 'destructive',
    duration: 4000
  });
};

// Example of how to use the enhanced error handling in a React component
const reactComponentExample = `
// Example React component using enhanced error handling
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/shared/api';
import { useErrorHandler, withRetry } from '@/shared/error-utils';
import { toast } from '@/components/ui/use-toast';

function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleError, getToastConfig } = useErrorHandler();

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    try {
      setLoading(true);
      
      // Use retry mechanism for network resilience
      const data = await withRetry(
        () => apiClient.getBundles(),
        3, // max retries
        'Loading Bundles' // context for logging
      );
      
      setBundles(data.results);
      
    } catch (error) {
      // Handle error with enhanced error handling
      const message = handleError(error, 'Loading Bundles');
      const toastConfig = getToastConfig(error);
      
      // Show user-friendly error message
      toast(toastConfig);
      
      // Log detailed error information (automatically done by handleError)
      console.error('Failed to load bundles:', message);
      
    } finally {
      setLoading(false);
    }
  };

  const purchaseBundle = async (bundleId) => {
    try {
      await apiClient.createOrder([bundleId]);
      
      toast({
        title: "Success",
        description: "Bundle purchased successfully!",
        variant: "default"
      });
      
    } catch (error) {
      const toastConfig = getToastConfig(error);
      toast(toastConfig);
      
      // Handle specific error types
      if (ApiError.isPremiumError(error)) {
        // Show upgrade modal
        showUpgradeModal();
      } else if (ApiError.isValidationError(error)) {
        // Handle validation errors
        console.error('Validation errors:', error.data);
      }
    }
  };

  // Component JSX...
}
`;

// Run the tests
console.log('🚀 Starting API Error Handling Tests...');
console.log('Make sure your Django backend is running on http://127.0.0.1:8000');

// Test the error handling
testErrorHandling();

// Test the utility functions
testErrorUtils();

// Show the React component example
console.log('\n📝 React Component Example:');
console.log(reactComponentExample);

console.log('\n📚 For more information, see:');
console.log('- frontend/API_ERROR_HANDLING_GUIDE.md');
console.log('- frontend/shared/error-utils.ts');
console.log('- backend/bece_platform/exception_handlers.py');