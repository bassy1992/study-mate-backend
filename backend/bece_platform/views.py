from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings


@api_view(['GET'])
@permission_classes([AllowAny])
def api_overview(request):
    """API Overview and Documentation"""
    
    api_endpoints = {
        'Authentication': {
            'register': '/api/auth/register/',
            'login': '/api/auth/login/',
            'logout': '/api/auth/logout/',
            'profile': '/api/auth/profile/',
            'change_password': '/api/auth/change-password/',
        },
        'Courses': {
            'subjects': '/api/courses/subjects/',
            'levels': '/api/courses/levels/',
            'courses': '/api/courses/courses/',
            'course_detail': '/api/courses/courses/{slug}/',
            'course_by_level_subject': '/api/courses/courses/{level}/{subject}/',
            'lesson_detail': '/api/courses/lessons/{id}/',
            'complete_lesson': '/api/courses/lessons/{id}/complete/',
            'quizzes': '/api/courses/quizzes/',
            'quiz_detail': '/api/courses/quizzes/{slug}/',
            'start_quiz': '/api/courses/quizzes/{id}/start/',
            'submit_quiz': '/api/courses/quizzes/submit/',
            'user_progress': '/api/courses/progress/',
        },
        'BECE': {
            'subjects': '/api/bece/subjects/',
            'years': '/api/bece/years/',
            'papers': '/api/bece/papers/',
            'paper_detail': '/api/bece/papers/{id}/',
            'practice_by_subject': '/api/bece/practice/{subject}/',
            'start_practice': '/api/bece/practice/{paper_id}/start/',
            'submit_practice': '/api/bece/practice/submit/',
            'dashboard': '/api/bece/dashboard/',
            'statistics': '/api/bece/statistics/',
        },
        'E-commerce': {
            'pricing_tiers': '/api/ecommerce/pricing-tiers/',
            'bundles': '/api/ecommerce/bundles/',
            'bundle_detail': '/api/ecommerce/bundles/{slug}/',
            'validate_coupon': '/api/ecommerce/coupons/validate/',
            'checkout': '/api/ecommerce/checkout/',
            'orders': '/api/ecommerce/orders/',
            'purchases': '/api/ecommerce/purchases/',
            'subscriptions': '/api/ecommerce/subscriptions/',
            'faqs': '/api/ecommerce/faqs/',
        }
    }
    
    return Response({
        'message': 'BECE Platform API',
        'version': '1.0',
        'endpoints': api_endpoints,
        'authentication': 'Token-based authentication required for most endpoints',
        'base_url': request.build_absolute_uri('/api/'),
        'documentation': {
            'swagger_ui': request.build_absolute_uri('/api/docs/'),
            'redoc': request.build_absolute_uri('/api/redoc/'),
            'openapi_schema': request.build_absolute_uri('/api/schema/'),
        },
        'getting_started': {
            '1': 'Register a new account: POST /api/auth/register/',
            '2': 'Login to get token: POST /api/auth/login/',
            '3': 'Use token in headers: Authorization: Token <your_token>',
            '4': 'Explore endpoints in Swagger UI for interactive testing'
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'BECE Platform API is running',
        'debug': settings.DEBUG,
    })