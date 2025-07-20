"""
Custom exception handlers for Django REST Framework
Provides consistent error responses with enhanced debugging information
"""

import logging
import traceback
from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.exceptions import (
    ValidationError,
    PermissionDenied,
    NotAuthenticated,
    AuthenticationFailed,
    NotFound,
    MethodNotAllowed,
    Throttled,
    ParseError,
    UnsupportedMediaType,
)

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides detailed error information
    and consistent error response format
    """
    # Get the standard error response first
    response = exception_handler(exc, context)
    
    # Get request information for logging
    request = context.get('request')
    view = context.get('view')
    
    # Create detailed error context
    error_context = {
        'exception_type': exc.__class__.__name__,
        'exception_message': str(exc),
        'view': view.__class__.__name__ if view else None,
        'method': request.method if request else None,
        'path': request.path if request else None,
        'user': str(request.user) if request and hasattr(request, 'user') else None,
        'user_agent': request.META.get('HTTP_USER_AGENT', '') if request else None,
        'ip_address': get_client_ip(request) if request else None,
    }
    
    # Log the error with context
    logger.error(
        f"API Error: {exc.__class__.__name__} - {str(exc)}",
        extra={
            'error_context': error_context,
            'traceback': traceback.format_exc() if settings.DEBUG else None
        }
    )
    
    if response is not None:
        # Enhance the existing response with additional information
        custom_response_data = create_error_response(
            exc, 
            response.status_code, 
            response.data,
            error_context,
            request
        )
        response.data = custom_response_data
        
        # Add custom headers for debugging
        if settings.DEBUG:
            response['X-Error-Type'] = exc.__class__.__name__
            response['X-Error-Context'] = view.__class__.__name__ if view else 'Unknown'
        
        return response
    
    # Handle exceptions not covered by DRF's default handler
    if isinstance(exc, DjangoValidationError):
        return handle_django_validation_error(exc, error_context)
    
    if isinstance(exc, IntegrityError):
        return handle_integrity_error(exc, error_context)
    
    if isinstance(exc, Http404):
        return handle_404_error(exc, error_context)
    
    # Handle unexpected exceptions
    return handle_unexpected_error(exc, error_context)


def create_error_response(exc, status_code, original_data, error_context, request):
    """
    Create a standardized error response format
    """
    # Base error response structure
    error_response = {
        'error': True,
        'status_code': status_code,
        'error_type': exc.__class__.__name__,
        'timestamp': get_current_timestamp(),
    }
    
    # Add the main error message
    if hasattr(exc, 'detail'):
        if isinstance(exc.detail, dict):
            error_response['message'] = 'Validation failed'
            error_response['details'] = exc.detail
        elif isinstance(exc.detail, list):
            error_response['message'] = exc.detail[0] if exc.detail else 'An error occurred'
            error_response['details'] = exc.detail
        else:
            error_response['message'] = str(exc.detail)
    else:
        error_response['message'] = str(exc)
    
    # Handle specific error types
    if isinstance(exc, ValidationError):
        error_response = handle_validation_error_response(exc, error_response, original_data)
    elif isinstance(exc, PermissionDenied):
        error_response = handle_permission_error_response(exc, error_response, request)
    elif isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
        error_response = handle_auth_error_response(exc, error_response)
    elif isinstance(exc, NotFound):
        error_response = handle_not_found_response(exc, error_response)
    elif isinstance(exc, Throttled):
        error_response = handle_throttled_response(exc, error_response)
    
    # Add debugging information in development
    if settings.DEBUG:
        error_response['debug'] = {
            'view': error_context.get('view'),
            'method': error_context.get('method'),
            'path': error_context.get('path'),
            'user': error_context.get('user'),
            'traceback': traceback.format_exc(),
            'request_data': get_request_data(request) if request else None,
        }
    
    # Add request ID for tracking
    error_response['request_id'] = generate_request_id()
    
    return error_response


def handle_validation_error_response(exc, error_response, original_data):
    """Handle validation error responses with detailed field information"""
    error_response['error_code'] = 'VALIDATION_ERROR'
    
    if isinstance(exc.detail, dict):
        # Format field-specific errors
        formatted_errors = {}
        for field, errors in exc.detail.items():
            if isinstance(errors, list):
                formatted_errors[field] = [str(error) for error in errors]
            else:
                formatted_errors[field] = [str(errors)]
        
        error_response['field_errors'] = formatted_errors
        error_response['message'] = 'Please correct the following errors:'
        
        # Create a user-friendly summary
        error_count = sum(len(errors) for errors in formatted_errors.values())
        error_response['summary'] = f'{error_count} validation error(s) found'
    
    return error_response


def handle_permission_error_response(exc, error_response, request):
    """Handle permission denied errors with context"""
    error_response['error_code'] = 'PERMISSION_DENIED'
    
    # Check if it's a premium subscription issue
    message = str(exc.detail) if hasattr(exc, 'detail') else str(exc)
    if 'premium' in message.lower() or 'subscription' in message.lower():
        error_response['error_code'] = 'PREMIUM_REQUIRED'
        error_response['message'] = 'Premium subscription required to access this feature'
        error_response['upgrade_required'] = True
    else:
        error_response['message'] = 'You do not have permission to perform this action'
    
    # Add user context if available
    if request and hasattr(request, 'user') and request.user.is_authenticated:
        error_response['user_context'] = {
            'is_authenticated': True,
            'is_premium': getattr(request.user, 'is_premium', False),
            'user_type': 'student' if getattr(request.user, 'is_student', False) else 'teacher' if getattr(request.user, 'is_teacher', False) else 'unknown'
        }
    
    return error_response


def handle_auth_error_response(exc, error_response):
    """Handle authentication errors"""
    if isinstance(exc, NotAuthenticated):
        error_response['error_code'] = 'NOT_AUTHENTICATED'
        error_response['message'] = 'Authentication credentials were not provided'
    else:  # AuthenticationFailed
        error_response['error_code'] = 'AUTHENTICATION_FAILED'
        error_response['message'] = 'Invalid authentication credentials'
    
    error_response['login_required'] = True
    return error_response


def handle_not_found_response(exc, error_response):
    """Handle 404 not found errors"""
    error_response['error_code'] = 'NOT_FOUND'
    error_response['message'] = 'The requested resource was not found'
    return error_response


def handle_throttled_response(exc, error_response):
    """Handle rate limiting errors"""
    error_response['error_code'] = 'RATE_LIMITED'
    error_response['message'] = f'Request was throttled. Expected available in {exc.wait} seconds.'
    error_response['retry_after'] = exc.wait
    return error_response


def handle_django_validation_error(exc, error_context):
    """Handle Django validation errors"""
    return Response({
        'error': True,
        'error_type': 'ValidationError',
        'error_code': 'DJANGO_VALIDATION_ERROR',
        'message': 'Validation error occurred',
        'details': exc.message_dict if hasattr(exc, 'message_dict') else [str(exc)],
        'timestamp': get_current_timestamp(),
        'request_id': generate_request_id(),
    }, status=status.HTTP_400_BAD_REQUEST)


def handle_integrity_error(exc, error_context):
    """Handle database integrity errors"""
    message = 'A database constraint was violated'
    
    # Try to provide more specific error messages
    exc_str = str(exc).lower()
    if 'unique' in exc_str:
        message = 'This record already exists'
    elif 'foreign key' in exc_str:
        message = 'Referenced record does not exist'
    elif 'not null' in exc_str:
        message = 'Required field cannot be empty'
    
    return Response({
        'error': True,
        'error_type': 'IntegrityError',
        'error_code': 'DATABASE_CONSTRAINT_VIOLATION',
        'message': message,
        'timestamp': get_current_timestamp(),
        'request_id': generate_request_id(),
    }, status=status.HTTP_400_BAD_REQUEST)


def handle_404_error(exc, error_context):
    """Handle Http404 errors"""
    return Response({
        'error': True,
        'error_type': 'Http404',
        'error_code': 'NOT_FOUND',
        'message': 'The requested page or resource was not found',
        'timestamp': get_current_timestamp(),
        'request_id': generate_request_id(),
    }, status=status.HTTP_404_NOT_FOUND)


def handle_unexpected_error(exc, error_context):
    """Handle unexpected errors"""
    logger.critical(
        f"Unexpected error: {exc.__class__.__name__} - {str(exc)}",
        extra={
            'error_context': error_context,
            'traceback': traceback.format_exc()
        }
    )
    
    # Don't expose internal error details in production
    if settings.DEBUG:
        message = str(exc)
        debug_info = {
            'traceback': traceback.format_exc(),
            'error_context': error_context
        }
    else:
        message = 'An unexpected error occurred. Please try again later.'
        debug_info = None
    
    response_data = {
        'error': True,
        'error_type': exc.__class__.__name__,
        'error_code': 'UNEXPECTED_ERROR',
        'message': message,
        'timestamp': get_current_timestamp(),
        'request_id': generate_request_id(),
    }
    
    if debug_info:
        response_data['debug'] = debug_info
    
    return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Utility functions
def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_current_timestamp():
    """Get current timestamp in ISO format"""
    from django.utils import timezone
    return timezone.now().isoformat()


def generate_request_id():
    """Generate a unique request ID for tracking"""
    import uuid
    return str(uuid.uuid4())[:8]


def get_request_data(request):
    """Safely extract request data for debugging"""
    try:
        data = {}
        if hasattr(request, 'data'):
            data['body'] = request.data
        if hasattr(request, 'query_params'):
            data['query_params'] = dict(request.query_params)
        
        # Sanitize sensitive data
        sensitive_fields = ['password', 'token', 'secret', 'key', 'authorization']
        for key in list(data.get('body', {}).keys()):
            if any(field in key.lower() for field in sensitive_fields):
                data['body'][key] = '[HIDDEN]'
        
        return data
    except Exception:
        return {'error': 'Could not extract request data'}


# Logging configuration
def setup_error_logging():
    """Setup enhanced error logging configuration"""
    import logging.config
    
    LOGGING_CONFIG = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'detailed': {
                'format': '{levelname} {asctime} {name} {process:d} {thread:d} {message}',
                'style': '{',
            },
            'simple': {
                'format': '{levelname} {name} {message}',
                'style': '{',
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'formatter': 'detailed' if settings.DEBUG else 'simple',
            },
            'file': {
                'class': 'logging.FileHandler',
                'filename': 'logs/api_errors.log',
                'formatter': 'detailed',
            },
        },
        'loggers': {
            'bece_platform.exception_handlers': {
                'handlers': ['console', 'file'] if not settings.DEBUG else ['console'],
                'level': 'ERROR',
                'propagate': False,
            },
        },
    }
    
    # Create logs directory if it doesn't exist
    import os
    os.makedirs('logs', exist_ok=True)
    
    logging.config.dictConfig(LOGGING_CONFIG)