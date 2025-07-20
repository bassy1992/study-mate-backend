/**
 * Error handling utilities for the API client
 * Provides helper functions and patterns for handling ApiError instances
 */

import { ApiError } from './api';

// Error handling utility functions
export class ErrorHandler {
  /**
   * Handle API errors with user-friendly messages and appropriate actions
   */
  static handleApiError(error: any, context?: string): string {
    console.group(`🔧 Error Handler - ${context || 'Unknown Context'}`);
    console.error('Original Error:', error);
    
    if (ApiError.isNetworkError(error)) {
      console.error('Network Error Details:', {
        message: error.message,
        url: error.url,
        timestamp: error.timestamp
      });
      console.groupEnd();
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (ApiError.isAuthError(error)) {
      console.error('Authentication Error Details:', {
        code: error.code,
        status: error.status,
        url: error.url
      });
      console.groupEnd();
      // Auth errors are handled automatically by the API client (redirect to login)
      return 'Your session has expired. Redirecting to login...';
    }

    if (ApiError.isPremiumError(error)) {
      console.error('Premium Required:', {
        message: error.message,
        url: error.url
      });
      console.groupEnd();
      return 'This feature requires a premium subscription. Please upgrade your account.';
    }

    if (ApiError.isValidationError(error)) {
      console.error('Validation Error Details:', {
        message: error.message,
        data: error.data,
        url: error.url
      });
      console.groupEnd();
      return error.getUserMessage();
    }

    if (ApiError.isServerError(error)) {
      console.error('Server Error Details:', {
        status: error.status,
        message: error.message,
        url: error.url,
        timestamp: error.timestamp
      });
      console.groupEnd();
      return 'Server error occurred. Please try again later.';
    }

    // Handle generic ApiError
    if (error instanceof ApiError) {
      console.error('Generic API Error:', {
        code: error.code,
        status: error.status,
        message: error.message,
        url: error.url
      });
      console.groupEnd();
      return error.getUserMessage();
    }

    // Handle unknown errors
    console.error('Unknown Error Type:', {
      type: error?.constructor?.name,
      message: error?.message,
      error
    });
    console.groupEnd();
    
    return error?.message || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Create a toast notification based on error type
   */
  static getErrorToastConfig(error: any): {
    title: string;
    description: string;
    variant: 'destructive' | 'default';
    duration?: number;
  } {
    if (ApiError.isNetworkError(error)) {
      return {
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
        duration: 5000
      };
    }

    if (ApiError.isPremiumError(error)) {
      return {
        title: 'Premium Required',
        description: 'This feature requires a premium subscription.',
        variant: 'default',
        duration: 4000
      };
    }

    if (ApiError.isValidationError(error)) {
      return {
        title: 'Validation Error',
        description: error.getUserMessage(),
        variant: 'destructive',
        duration: 4000
      };
    }

    if (ApiError.isServerError(error)) {
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        variant: 'destructive',
        duration: 5000
      };
    }

    return {
      title: 'Error',
      description: error?.message || 'An unexpected error occurred.',
      variant: 'destructive',
      duration: 4000
    };
  }

  /**
   * Determine if an error should trigger a retry mechanism
   */
  static shouldRetry(error: any, attemptCount: number = 0, maxRetries: number = 3): boolean {
    if (attemptCount >= maxRetries) {
      return false;
    }

    // Don't retry auth errors, validation errors, or 404s
    if (ApiError.isAuthError(error) || 
        ApiError.isValidationError(error) || 
        (error instanceof ApiError && error.status === 404)) {
      return false;
    }

    // Retry network errors and server errors
    return ApiError.isNetworkError(error) || ApiError.isServerError(error);
  }

  /**
   * Get retry delay in milliseconds (exponential backoff)
   */
  static getRetryDelay(attemptCount: number): number {
    return Math.min(1000 * Math.pow(2, attemptCount), 10000); // Max 10 seconds
  }

  /**
   * Log error for debugging purposes
   */
  static logError(error: any, context: string, additionalData?: any) {
    const errorInfo = {
      context,
      timestamp: new Date().toISOString(),
      error: error instanceof ApiError ? error.toJSON() : {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      additionalData
    };

    console.group(`🐛 Error Log - ${context}`);
    console.error('Error Info:', errorInfo);
    
    if (error instanceof ApiError) {
      console.error('API Error Details:', {
        status: error.status,
        code: error.code,
        url: error.url,
        data: error.data
      });
    }
    
    console.groupEnd();

    // In production, you might want to send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }
}

// React hook for error handling (if using React)
export function useErrorHandler() {
  const handleError = (error: any, context?: string) => {
    const message = ErrorHandler.handleApiError(error, context);
    ErrorHandler.logError(error, context || 'Unknown');
    return message;
  };

  const getToastConfig = (error: any) => {
    return ErrorHandler.getErrorToastConfig(error);
  };

  const shouldRetry = (error: any, attemptCount: number = 0) => {
    return ErrorHandler.shouldRetry(error, attemptCount);
  };

  return {
    handleError,
    getToastConfig,
    shouldRetry,
    getRetryDelay: ErrorHandler.getRetryDelay
  };
}

// Retry wrapper function
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  context?: string
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (!ErrorHandler.shouldRetry(error, attempt, maxRetries)) {
        ErrorHandler.logError(error, context || 'Retry Operation', { attempt, maxRetries });
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = ErrorHandler.getRetryDelay(attempt);
        console.log(`🔄 Retrying operation in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  ErrorHandler.logError(lastError, context || 'Retry Operation', { 
    attempt: maxRetries, 
    maxRetries,
    finalAttempt: true 
  });
  throw lastError;
}

// Example usage patterns
export const ErrorHandlingExamples = {
  // Basic error handling in a component
  basicHandling: `
    try {
      const data = await apiClient.getUserPurchases();
      setData(data);
    } catch (error) {
      const message = ErrorHandler.handleApiError(error, 'Loading Purchases');
      setError(message);
    }
  `,

  // With toast notifications
  withToast: `
    try {
      await apiClient.createOrder([bundleId]);
      toast({ title: "Success", description: "Order created successfully!" });
    } catch (error) {
      const toastConfig = ErrorHandler.getErrorToastConfig(error);
      toast(toastConfig);
    }
  `,

  // With retry mechanism
  withRetry: `
    try {
      const data = await withRetry(
        () => apiClient.getDashboardStats(),
        3,
        'Dashboard Stats'
      );
      setStats(data);
    } catch (error) {
      const message = ErrorHandler.handleApiError(error, 'Dashboard Stats');
      setError(message);
    }
  `,

  // Using the React hook
  reactHook: `
    const { handleError, getToastConfig } = useErrorHandler();
    
    const loadData = async () => {
      try {
        const data = await apiClient.getBundles();
        setBundles(data);
      } catch (error) {
        const message = handleError(error, 'Loading Bundles');
        const toastConfig = getToastConfig(error);
        toast(toastConfig);
      }
    };
  `
};