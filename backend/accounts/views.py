from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.db import models
from django.conf import settings
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from .models import CustomUser, UserProfile, Achievement, StudySession
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, CustomUserSerializer,
    UserProfileSerializer, AchievementSerializer, StudySessionSerializer,
    PasswordChangeSerializer
)
from .email_service import brevo_service


@extend_schema(
    tags=['Authentication'],
    summary='User Registration',
    description='Register a new user account with email and password',
    responses={
        201: OpenApiResponse(
            response=CustomUserSerializer,
            description='User registered successfully'
        ),
        400: OpenApiResponse(description='Validation errors')
    }
)
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        # Create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': CustomUserSerializer(user).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=['Authentication'],
    summary='User Login',
    description='Authenticate user with email and password',
    request=UserLoginSerializer,
    responses={
        200: OpenApiResponse(
            response=CustomUserSerializer,
            description='Login successful'
        ),
        400: OpenApiResponse(description='Invalid credentials')
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': CustomUserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Authentication'],
    summary='User Logout',
    description='Logout user and invalidate authentication token',
    responses={
        200: OpenApiResponse(description='Logout successful')
    }
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    logout(request)
    return Response({'message': 'Logout successful'})


@extend_schema_view(
    get=extend_schema(
        tags=['Authentication'],
        summary='Get User Profile',
        description='Retrieve authenticated user profile information',
        responses={200: CustomUserSerializer}
    ),
    put=extend_schema(
        tags=['Authentication'],
        summary='Update User Profile',
        description='Update authenticated user profile information',
        responses={200: CustomUserSerializer}
    ),
    patch=extend_schema(
        tags=['Authentication'],
        summary='Partially Update User Profile',
        description='Partially update authenticated user profile information',
        responses={200: CustomUserSerializer}
    )
)
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@extend_schema_view(
    get=extend_schema(
        tags=['Authentication'],
        summary='Get User Profile Details',
        description='Retrieve detailed user profile information and preferences',
        responses={200: UserProfileSerializer}
    ),
    put=extend_schema(
        tags=['Authentication'],
        summary='Update User Profile Details',
        description='Update detailed user profile information and preferences',
        responses={200: UserProfileSerializer}
    ),
    patch=extend_schema(
        tags=['Authentication'],
        summary='Partially Update User Profile Details',
        description='Partially update detailed user profile information and preferences',
        responses={200: UserProfileSerializer}
    )
)
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@extend_schema(
    tags=['Authentication'],
    summary='Change Password',
    description='Change user password with old password verification',
    request=PasswordChangeSerializer,
    responses={
        200: OpenApiResponse(description='Password changed successfully'),
        400: OpenApiResponse(description='Validation errors')
    }
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Update token
        try:
            request.user.auth_token.delete()
        except:
            pass
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Password changed successfully',
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Authentication'],
    summary='Request Password Reset',
    description='Send password reset email to user',
    request={
        'type': 'object',
        'properties': {
            'email': {'type': 'string', 'format': 'email'}
        },
        'required': ['email']
    },
    responses={
        200: OpenApiResponse(description='Password reset email sent'),
        400: OpenApiResponse(description='Invalid email or user not found')
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        # Don't reveal if user exists or not for security
        return Response({'message': 'If an account with this email exists, you will receive a password reset link.'})
    
    # Generate reset token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Create reset link
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
    
    # Send email
    email_result = brevo_service.send_password_reset_email(
        user_email=user.email,
        user_name=user.get_full_name() or user.email,
        reset_link=reset_link,
        expires_in_hours=24
    )
    
    if email_result['success']:
        return Response({'message': 'If an account with this email exists, you will receive a password reset link.'})
    else:
        return Response({'error': 'Failed to send email. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    tags=['Authentication'],
    summary='Reset Password',
    description='Reset user password using token from email',
    request={
        'type': 'object',
        'properties': {
            'uid': {'type': 'string'},
            'token': {'type': 'string'},
            'new_password': {'type': 'string', 'minLength': 8}
        },
        'required': ['uid', 'token', 'new_password']
    },
    responses={
        200: OpenApiResponse(description='Password reset successful'),
        400: OpenApiResponse(description='Invalid token or password')
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not all([uid, token, new_password]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = CustomUser.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify token
    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Invalid or expired reset link'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Reset password
    user.set_password(new_password)
    user.save()
    
    # Send confirmation email
    brevo_service.send_password_changed_email(
        user_email=user.email,
        user_name=user.get_full_name() or user.email
    )
    
    return Response({'message': 'Password reset successful'})


@extend_schema(
    tags=['Authentication'],
    summary='Get User Achievements',
    description='Retrieve list of user achievements and badges',
    responses={200: AchievementSerializer(many=True)}
)
class AchievementListView(generics.ListAPIView):
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user).order_by('-earned_at')


@extend_schema_view(
    get=extend_schema(
        tags=['Authentication'],
        summary='Get Study Sessions',
        description='Retrieve list of user study sessions',
        responses={200: StudySessionSerializer(many=True)}
    ),
    post=extend_schema(
        tags=['Authentication'],
        summary='Create Study Session',
        description='Create a new study session record',
        responses={201: StudySessionSerializer}
    )
)
class StudySessionListCreateView(generics.ListCreateAPIView):
    serializer_class = StudySessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user).order_by('-start_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema(
    tags=['Authentication'],
    summary='Get Dashboard Statistics',
    description='Retrieve user dashboard statistics including study time, achievements, and recent sessions',
    responses={
        200: OpenApiResponse(
            description='Dashboard statistics retrieved successfully',
            examples=[
                {
                    'total_study_time_minutes': 1250,
                    'achievements_count': 5,
                    'recent_sessions': [],
                    'is_premium': True
                }
            ]
        )
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    from courses.models import LessonProgress, QuizAttempt, UserProgress
    from django.utils import timezone
    from datetime import datetime, timedelta
    
    user = request.user
    
    # Get lessons completed count
    lessons_completed = LessonProgress.objects.filter(
        user=user, 
        is_completed=True
    ).count()
    
    # Get quizzes passed count (score >= 70%)
    quizzes_passed = QuizAttempt.objects.filter(
        user=user,
        is_completed=True,
        score__gte=70  # Assuming 70% is passing score
    ).count()
    
    # Get total study time from lesson progress and quiz attempts
    lesson_study_time = LessonProgress.objects.filter(user=user).aggregate(
        total=models.Sum('time_spent_minutes')
    )['total'] or 0
    
    quiz_study_time = QuizAttempt.objects.filter(user=user).aggregate(
        total=models.Sum('time_taken_minutes')
    )['total'] or 0
    
    total_study_hours = round((lesson_study_time + quiz_study_time) / 60, 1)
    
    # Calculate study streak (consecutive days with activity)
    study_streak = calculate_study_streak(user)
    
    # Get overall progress percentage
    user_progress_data = UserProgress.objects.filter(user=user)
    if user_progress_data.exists():
        overall_progress = round(
            user_progress_data.aggregate(
                avg_progress=models.Avg('completion_percentage')
            )['avg_progress'] or 0, 1
        )
    else:
        overall_progress = 0.0
    
    # Get achievements count
    achievements_count = Achievement.objects.filter(user=user).count()
    
    # Get recent study sessions
    recent_sessions = StudySession.objects.filter(user=user).order_by('-start_time')[:5]
    
    # Get recent activity (lessons and quizzes from last 7 days)
    week_ago = timezone.now() - timedelta(days=7)
    recent_lessons = LessonProgress.objects.filter(
        user=user, 
        last_accessed__gte=week_ago
    ).order_by('-last_accessed')[:5]
    
    recent_quizzes = QuizAttempt.objects.filter(
        user=user,
        started_at__gte=week_ago
    ).order_by('-started_at')[:5]
    
    return Response({
        'lessons_completed': lessons_completed,
        'quizzes_passed': quizzes_passed,
        'total_study_hours': total_study_hours,
        'study_streak': study_streak,
        'overall_progress': overall_progress,
        'achievements_count': achievements_count,
        'total_study_time_minutes': lesson_study_time + quiz_study_time,
        'recent_sessions': StudySessionSerializer(recent_sessions, many=True).data,
        'recent_lessons_count': recent_lessons.count(),
        'recent_quizzes_count': recent_quizzes.count(),
        'is_premium': user.is_premium
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def upcoming_tasks(request):
    """Get upcoming tasks for the authenticated user"""
    from .models import UpcomingTask
    from django.utils import timezone
    from datetime import timedelta
    
    user = request.user
    
    # Get upcoming tasks (not completed, due in the next 30 days)
    thirty_days_from_now = timezone.now() + timedelta(days=30)
    
    tasks = UpcomingTask.objects.filter(
        user=user,
        is_completed=False,
        due_date__gte=timezone.now(),
        due_date__lte=thirty_days_from_now
    ).order_by('due_date', '-priority')[:10]  # Limit to 10 most urgent tasks
    
    tasks_data = []
    for task in tasks:
        tasks_data.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'task_type': task.task_type,
            'subject': task.subject,
            'due_date': task.due_date.isoformat(),
            'priority': task.priority,
            'days_until_due': task.days_until_due,
            'urgency_label': task.urgency_label,
            'urgency_color': task.urgency_color,
            'course_id': task.course.id if task.course else None,
            'lesson_id': task.lesson.id if task.lesson else None,
            'quiz_id': task.quiz.id if task.quiz else None,
        })
    
    return Response({
        'tasks': tasks_data,
        'count': len(tasks_data)
    })


def calculate_study_streak(user):
    """Calculate consecutive days of study activity"""
    from courses.models import LessonProgress, QuizAttempt
    from accounts.models import StudySession
    from django.utils import timezone
    from datetime import datetime, timedelta
    
    # Get all activity dates (lessons, quizzes, and study sessions)
    lesson_dates = set(
        LessonProgress.objects.filter(user=user)
        .values_list('last_accessed__date', flat=True)
        .distinct()
    )
    
    quiz_dates = set(
        QuizAttempt.objects.filter(user=user)
        .values_list('started_at__date', flat=True)
        .distinct()
    )
    
    session_dates = set(
        StudySession.objects.filter(user=user)
        .values_list('start_time__date', flat=True)
        .distinct()
    )
    
    # Combine all activity dates
    all_activity_dates = lesson_dates.union(quiz_dates).union(session_dates)
    
    if not all_activity_dates:
        return 0
    
    # Sort dates in descending order
    sorted_dates = sorted(all_activity_dates, reverse=True)
    
    # Calculate streak from most recent activity date backwards
    today = timezone.now().date()
    streak = 0
    
    # Start from today or the most recent activity date
    if sorted_dates and sorted_dates[0] == today:
        current_check_date = today
    elif sorted_dates and sorted_dates[0] == today - timedelta(days=1):
        # If most recent activity was yesterday, start streak from yesterday
        current_check_date = today - timedelta(days=1)
    else:
        # No recent activity, no streak
        return 0
    
    # Count consecutive days with activity
    for activity_date in sorted_dates:
        if activity_date == current_check_date:
            streak += 1
            current_check_date -= timedelta(days=1)
        elif activity_date < current_check_date:
            # Check if there's a gap
            gap_days = (current_check_date - activity_date).days
            if gap_days == 1:
                # Continue checking previous day
                current_check_date = activity_date
                streak += 1
                current_check_date -= timedelta(days=1)
            else:
                # Gap found, break streak
                break
    
    return streak

@extend_schema(
    tags=['Authentication'],
    summary='Delete Account',
    description='Permanently delete user account and all associated data',
    responses={
        200: OpenApiResponse(description='Account deleted successfully'),
        400: OpenApiResponse(description='Error deleting account')
    }
)
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_account(request):
    """
    Permanently delete the user's account and all associated data.
    This action cannot be undone.
    """
    try:
        user = request.user
        
        # Log the account deletion for audit purposes
        print(f"Account deletion requested for user: {user.email} (ID: {user.id})")
        
        # Delete the user account (this will cascade delete related data)
        user.delete()
        
        return Response({
            'message': 'Account deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error deleting account for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'Failed to delete account. Please try again or contact support.'
        }, status=status.HTTP_400_BAD_REQUEST)
@extend_schema(
    tags=['Authentication'],
    summary='Update User Preferences',
    description='Update user notification preferences',
    request={
        'type': 'object',
        'properties': {
            'email_notifications': {'type': 'boolean'},
            'sms_notifications': {'type': 'boolean'},
            'marketing_emails': {'type': 'boolean'},
            'study_reminders': {'type': 'boolean'}
        }
    },
    responses={
        200: OpenApiResponse(description='Preferences updated successfully'),
        400: OpenApiResponse(description='Invalid preferences data')
    }
)
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_preferences(request):
    """
    Update user notification preferences
    """
    try:
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Get current preferences or initialize with defaults
        current_preferences = profile.notification_preferences or {}
        
        # Update preferences with provided data
        preferences_data = {
            'email_notifications': request.data.get('email_notifications', current_preferences.get('email_notifications', True)),
            'sms_notifications': request.data.get('sms_notifications', current_preferences.get('sms_notifications', False)),
            'marketing_emails': request.data.get('marketing_emails', current_preferences.get('marketing_emails', False)),
            'study_reminders': request.data.get('study_reminders', current_preferences.get('study_reminders', True)),
        }
        
        # Save updated preferences
        profile.notification_preferences = preferences_data
        profile.save()
        
        return Response({
            'message': 'Preferences updated successfully',
            'preferences': preferences_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error updating preferences for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'Failed to update preferences. Please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Authentication'],
    summary='Get User Preferences',
    description='Get user notification preferences',
    responses={
        200: OpenApiResponse(description='User preferences retrieved successfully'),
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_preferences(request):
    """
    Get user notification preferences
    """
    try:
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Get preferences or return defaults
        preferences = profile.notification_preferences or {
            'email_notifications': True,
            'sms_notifications': False,
            'marketing_emails': False,
            'study_reminders': True,
        }
        
        return Response({
            'preferences': preferences
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error getting preferences for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'Failed to get preferences.'
        }, status=status.HTTP_400_BAD_REQUEST)