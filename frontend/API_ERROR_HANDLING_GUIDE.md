# API Error Handling Guide

This guide explains how to use the enhanced error handling system in the API client for better debugging and user experience.

## Overview

The API client now includes comprehensive error handling with:
- Detailed logging for debugging
- Categorized error types
- User-friendly error messages
- Automatic retry mechanisms
- Enhanced debugging information

## Error Types

### 1. Network Errors (`NETWORK_ERROR`)
- **Cause**: Unable to connect to the server
- **Common scenarios**: Backend is down, CORS issues, network connectivity problems
- **Handling**: Shows user-friendly message, logs detailed network information

### 2. Authentication Errors (`UNAUTHORIZED`, `SESSION_EXPIRED`)
- **Cause**: Invalid or expired authentication token
- **Handling**: Automatically clears token and redirects to login page
- **Debugging**: Logs token presence and request details

### 3. Permission Errors (`FORBIDDEN`, `PREMIUM_REQUIRED`, `INSUFFICIENT_PERMISSIONS`)
- **Cause**: User lacks required permissions or premium subscription
- **Handling**: Shows appropriate upgrade message or permission denied
- **Debugging**: Distinguishes between different types of forbidden access

### 4. Validation Errors (`VALIDATION_ERROR`)
- **Cause**: Invalid request data
- **Handling**: Shows formatted validation messages
- **Debugging**: Logs all validation errors with field details

### 5. Server Errors (`SERVER_ERROR`)
- **Cause**: Internal server errors (500, 502, 503, 504)
- **Handling**: Shows generic server error message
- **Debugging**: Logs full server response and timing information

### 6. Rate Limiting (`RATE_LIMITED`)
- **Cause**: Too many requests
- **Handling**: Shows retry-after message
- **Debugging**: Logs rate limit headers and retry information

## Using the Enhanced Error Handling

### Basic Usage

```typescript
import { apiClient, ApiError } from '@/shared/api';
import { ErrorHandler } from '@/shared/error-utils';

try {
  const data = await apiClient.getUserPurchases();
  // Handle success
} catch (error) {
  const userMessage = ErrorHandler.handleApiError(error, 'Loading Purchases');
  console.error('User-friendly message:', userMessage);
}
```

### With Toast Notifications

```typescript
import { toast } from '@/components/ui/use-toast';

try {
  await apiClient.createOrder([bundleId]);
  toast({ title: "Success", description: "Order created!" });
} catch (error) {
  const toastConfig = ErrorHandler.getErrorToastConfig(error);
  toast(toastConfig);
}
```

### With Retry Mechanism

```typescript
import { withRetry } from '@/shared/error-utils';

try {
  const data = await withRetry(
    () => apiClient.getDashboardStats(),
    3, // max retries
    'Dashboard Stats' // context for logging
  );
} catch (error) {
  // Handle final error after retries
}
```

### React Hook Usage

```typescript
import { useErrorHandler } from '@/shared/error-utils';

function MyComponent() {
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
}
```

## Debugging Features

### Console Logging

The enhanced error handling provides detailed console logs:

1. **Request Logs**: Shows method, URL, headers (sanitized), and body
2. **Response Logs**: Shows status, duration, and response headers
3. **Error Logs**: Categorized by error type with full context
4. **Retry Logs**: Shows retry attempts and delays

### Log Structure

```
[API-abc123] 🚀 Request: POST /api/ecommerce/orders/
├── Headers: { Authorization: "Token [HIDDEN]", Content-Type: "application/json" }
├── Body: { bundle_ids: [1, 2] }
└── Config: { credentials: "include", method: "POST" }

[API-abc123] ❌ Error Response Details
├── Status: 422 Unprocessable Entity
├── URL: /api/ecommerce/orders/
├── Method: POST
├── Response Headers: { content-type: "application/json" }
├── Raw Response: {"bundle_ids": ["This field is required."]}
└── Parsed Error Data: { bundle_ids: ["This field is required."] }
```

### Error Object Properties

The `ApiError` class provides structured error information:

```typescript
interface ApiError {
  message: string;        // Human-readable error message
  status: number;         // HTTP status code
  code: string;          // Error category code
  data: any;             // Raw error data from server
  url: string;           // Request URL that failed
  timestamp: string;     // ISO timestamp of error
}
```

## Error Handling Best Practices

### 1. Always Provide Context

```typescript
// Good
const message = ErrorHandler.handleApiError(error, 'Creating Order');

// Better
const message = ErrorHandler.handleApiError(error, 'Creating Order for Bundle ID: 123');
```

### 2. Use Appropriate Error Types

```typescript
if (ApiError.isPremiumError(error)) {
  // Show upgrade prompt
  showUpgradeModal();
} else if (ApiError.isValidationError(error)) {
  // Show form validation errors
  setFormErrors(error.data);
} else {
  // Show generic error message
  showErrorToast(error.getUserMessage());
}
```

### 3. Implement Retry Logic for Appropriate Errors

```typescript
// Only retry network and server errors
if (ErrorHandler.shouldRetry(error, attemptCount)) {
  const delay = ErrorHandler.getRetryDelay(attemptCount);
  setTimeout(() => retryOperation(), delay);
}
```

### 4. Log Errors with Context

```typescript
ErrorHandler.logError(error, 'Payment Processing', {
  bundleId,
  userId,
  paymentMethod
});
```

## Common Debugging Scenarios

### 1. CORS Issues
**Symptoms**: Network errors with "Failed to fetch"
**Debug**: Check browser network tab and console for CORS-related messages
**Solution**: Ensure backend CORS settings allow frontend domain

### 2. Authentication Problems
**Symptoms**: 401/403 errors, automatic redirects to login
**Debug**: Check if token is present and valid in localStorage
**Solution**: Verify token format and backend authentication middleware

### 3. Validation Errors
**Symptoms**: 422 errors with field-specific messages
**Debug**: Check request body format and required fields
**Solution**: Ensure frontend validation matches backend requirements

### 4. Premium Feature Access
**Symptoms**: 403 errors with premium-related messages
**Debug**: Check user's subscription status and feature permissions
**Solution**: Implement proper premium checks in frontend

### 5. Server Errors
**Symptoms**: 500+ status codes
**Debug**: Check backend logs and server health
**Solution**: Implement proper error handling in backend endpoints

## Environment-Specific Debugging

### Development
- Full error logging enabled
- Detailed console output
- Network request/response logging

### Production
- User-friendly error messages
- Error tracking integration (Sentry, etc.)
- Minimal console logging

## Integration with Error Tracking

```typescript
// Example Sentry integration
import * as Sentry from '@sentry/browser';

ErrorHandler.logError = (error, context, additionalData) => {
  // Console logging for development
  console.error('Error:', { error, context, additionalData });
  
  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { context },
      extra: additionalData
    });
  }
};
```

## Testing Error Handling

### Manual Testing
1. Disconnect network to test network errors
2. Use invalid tokens to test auth errors
3. Send malformed requests to test validation errors
4. Access premium features without subscription

### Automated Testing
```typescript
// Example test
it('should handle network errors gracefully', async () => {
  // Mock network failure
  jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
  
  try {
    await apiClient.getUserPurchases();
  } catch (error) {
    expect(ApiError.isNetworkError(error)).toBe(true);
    expect(error.getUserMessage()).toContain('Unable to connect');
  }
});
```

## Troubleshooting Checklist

When debugging API errors:

1. ✅ Check browser console for detailed error logs
2. ✅ Verify network connectivity and backend status
3. ✅ Check authentication token presence and validity
4. ✅ Validate request format and required fields
5. ✅ Confirm user permissions and subscription status
6. ✅ Review backend logs for server-side errors
7. ✅ Test with different user accounts and scenarios
8. ✅ Check CORS configuration if seeing network errors

This enhanced error handling system provides comprehensive debugging information while maintaining a good user experience. Use the console logs and error categorization to quickly identify and resolve issues during development.