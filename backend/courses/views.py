from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Avg, Max
from django.db import models
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from .models import (
    Teacher, Subject, Level, Course, Lesson, Quiz, Question, Answer,
    QuizAttempt, UserAnswer, UserProgress, LessonProgress
)
from .serializers import (
    TeacherSerializer, TeacherListSerializer, SubjectSerializer, LevelSerializer, 
    CourseSerializer, CourseListSerializer, LessonSerializer, LessonDetailSerializer, 
    QuizSerializer, QuizListSerializer, QuestionSerializer, QuizAttemptSerializer, 
    QuizSubmissionSerializer, UserProgressSerializer, LessonProgressSerializer
)


@extend_schema(
    tags=['Teachers'],
    summary='List Teachers',
    description='Retrieve list of all active teachers, optionally filtered by featured status',
    parameters=[
        OpenApiParameter(
            name='featured',
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description='Filter by featured status (true/false)'
        ),
        OpenApiParameter(
            name='subject',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by subject code (e.g., MATH, ENG)'
        ),
    ],
    responses={200: TeacherListSerializer(many=True)}
)
class TeacherListView(generics.ListAPIView):
    serializer_class = TeacherListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Teacher.objects.filter(is_active=True).prefetch_related('subjects')
        
        # Filter by featured status
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        
        # Filter by subject
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subjects__code=subject)
        
        return queryset.order_by('display_order', 'name')


@extend_schema(
    tags=['Teachers'],
    summary='Get Teacher Details',
    description='Retrieve detailed information about a specific teacher',
    responses={200: TeacherSerializer}
)
class TeacherDetailView(generics.RetrieveAPIView):
    queryset = Teacher.objects.filter(is_active=True)
    serializer_class = TeacherSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=['Courses'],
    summary='List Subjects',
    description='Retrieve list of all active subjects available in the platform',
    responses={200: SubjectSerializer(many=True)}
)
class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.filter(is_active=True)
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=['Courses'],
    summary='List Levels',
    description='Retrieve list of all active grade levels (JHS 1, 2, 3, etc.)',
    responses={200: LevelSerializer(many=True)}
)
class LevelListView(generics.ListAPIView):
    queryset = Level.objects.filter(is_active=True).order_by('order')
    serializer_class = LevelSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=['Courses'],
    summary='List Courses',
    description='Retrieve list of published courses with optional filtering',
    parameters=[
        OpenApiParameter(
            name='subject',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by subject code (e.g., MATH, ENG)'
        ),
        OpenApiParameter(
            name='level',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by level code (e.g., JHS1, JHS2, JHS3)'
        ),
        OpenApiParameter(
            name='difficulty',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by difficulty (beginner, intermediate, advanced)'
        ),
        OpenApiParameter(
            name='is_premium',
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description='Filter by premium status (true/false)'
        ),
    ],
    responses={200: CourseListSerializer(many=True)}
)
class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Course.objects.filter(is_published=True).select_related('subject', 'level')
        
        # Filter by subject
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__code=subject)
        
        # Filter by level
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level__code=level)
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filter by premium status
        is_premium = self.request.query_params.get('is_premium')
        if is_premium is not None:
            queryset = queryset.filter(is_premium=is_premium.lower() == 'true')
        
        return queryset.order_by('-created_at')


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def course_by_level_subject(request, level, subject):
    """Get course by level and subject codes"""
    course = get_object_or_404(
        Course.objects.select_related('subject', 'level'),
        level__code=level,
        subject__code=subject,
        is_published=True
    )
    serializer = CourseSerializer(course, context={'request': request})
    return Response(serializer.data)


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.filter(is_published=True)
    serializer_class = LessonDetailSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        lesson = self.get_object()
        
        # Check if user has access to this lesson
        if lesson.course.is_premium and not request.user.is_premium:
            if not lesson.is_free:
                return Response(
                    {'error': 'Premium subscription required'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Update lesson progress
        if request.user.is_authenticated:
            progress, created = LessonProgress.objects.get_or_create(
                user=request.user,
                lesson=lesson
            )
            progress.save()  # Update last_accessed
        
        serializer = self.get_serializer(lesson)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_lesson(request, lesson_id):
    """Mark lesson as completed"""
    lesson = get_object_or_404(Lesson, id=lesson_id, is_published=True)
    
    progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=lesson
    )
    
    progress.is_completed = True
    progress.completion_percentage = 100.0
    progress.save()
    
    # Update course progress
    course_progress, created = UserProgress.objects.get_or_create(
        user=request.user,
        course=lesson.course
    )
    
    completed_lessons = LessonProgress.objects.filter(
        user=request.user,
        lesson__course=lesson.course,
        is_completed=True
    ).count()
    
    total_lessons = lesson.course.lessons.filter(is_published=True).count()
    
    course_progress.lessons_completed = completed_lessons
    course_progress.total_lessons = total_lessons
    course_progress.completion_percentage = (completed_lessons / total_lessons) * 100 if total_lessons > 0 else 0
    course_progress.save()
    
    return Response({
        'message': 'Lesson completed successfully',
        'lesson_progress': LessonProgressSerializer(progress).data,
        'course_progress': UserProgressSerializer(course_progress).data
    })



class QuizListView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Quiz.objects.filter(is_published=True).select_related('subject')
        
        # Filter by subject
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__code=subject)
        
        # Filter by quiz type
        quiz_type = self.request.query_params.get('type')
        if quiz_type:
            queryset = queryset.filter(quiz_type=quiz_type)
        
        return queryset.order_by('-created_at')


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.filter(is_published=True)
    serializer_class = QuizSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_quiz(request, quiz_id):
    """Start a new quiz attempt"""
    quiz = get_object_or_404(Quiz, id=quiz_id, is_published=True)
    
    # Create new attempt (no max attempts restriction)
    attempt = QuizAttempt.objects.create(
        user=request.user,
        quiz=quiz,
        total_questions=quiz.questions.count()
    )
    
    return Response({
        'attempt_id': attempt.id,
        'quiz': QuizListSerializer(quiz).data,
        'message': 'Quiz started successfully'
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_quiz(request):
    """Submit quiz answers"""
    serializer = QuizSubmissionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    quiz_id = serializer.validated_data['quiz_id']
    answers = serializer.validated_data['answers']
    
    # Get the latest attempt for this quiz
    attempt = QuizAttempt.objects.filter(
        user=request.user,
        quiz_id=quiz_id,
        is_completed=False
    ).order_by('-started_at').first()
    
    if not attempt:
        return Response(
            {'error': 'No active quiz attempt found'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Process answers
    score = 0
    for answer_data in answers:
        question_id = answer_data.get('question_id')
        selected_answer_id = answer_data.get('answer_id')
        
        try:
            question = Question.objects.get(id=question_id, quiz_id=quiz_id)
            selected_answer = Answer.objects.get(id=selected_answer_id, question=question)
            
            is_correct = selected_answer.is_correct
            points_earned = question.points if is_correct else 0
            score += points_earned
            
            UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected_answer,
                is_correct=is_correct,
                points_earned=points_earned
            )
        except (Question.DoesNotExist, Answer.DoesNotExist):
            continue
    
    # Calculate total possible points
    total_points = sum(question.points for question in attempt.quiz.questions.all())
    
    # Calculate percentage score
    percentage_score = (score / total_points * 100) if total_points > 0 else 0
    
    # Complete the attempt
    attempt.score = score
    attempt.completed_at = timezone.now()
    attempt.is_completed = True
    attempt.time_taken_minutes = int((timezone.now() - attempt.started_at).total_seconds() / 60)
    attempt.save()
    
    # Check if passed
    passed = percentage_score >= attempt.quiz.passing_score
    
    return Response({
        'attempt_id': attempt.id,
        'score': score,
        'total_points': total_points,
        'percentage_score': round(percentage_score, 1),
        'passed': passed,
        'passing_score': attempt.quiz.passing_score,
        'time_taken_minutes': attempt.time_taken_minutes,
        'total_questions': attempt.quiz.questions.count(),
        'correct_answers': sum(1 for ua in attempt.user_answers.all() if ua.is_correct),
        'message': 'Quiz submitted successfully'
    })


class UserProgressListView(generics.ListAPIView):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user).select_related('course')


class QuizAttemptListView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user).order_by('-started_at')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_quiz_results(request, attempt_id):
    """Get detailed quiz results with correct answers and explanations"""
    try:
        attempt = QuizAttempt.objects.get(
            id=attempt_id,
            user=request.user,
            is_completed=True
        )
    except QuizAttempt.DoesNotExist:
        return Response(
            {'error': 'Quiz attempt not found or not completed'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    quiz = attempt.quiz
    user_answers = attempt.user_answers.all().select_related('question', 'selected_answer')
    
    # Calculate scores
    total_points = sum(question.points for question in quiz.questions.all())
    percentage_score = (attempt.score / total_points * 100) if total_points > 0 else 0
    passed = percentage_score >= quiz.passing_score
    
    # Prepare detailed results
    questions_results = []
    for question in quiz.questions.all().prefetch_related('answers'):
        user_answer = user_answers.filter(question=question).first()
        
        question_result = {
            'id': question.id,
            'question_text': question.question_text,
            'question_type': question.question_type,
            'points': question.points,
            'order': question.order,
            'explanation': question.explanation,
            'answers': [
                {
                    'id': answer.id,
                    'answer_text': answer.answer_text,
                    'is_correct': answer.is_correct,
                    'order': answer.order
                }
                for answer in question.answers.all()
            ],
            'user_answer': {
                'selected_answer_id': user_answer.selected_answer.id if user_answer and user_answer.selected_answer else None,
                'selected_answer_text': user_answer.selected_answer.answer_text if user_answer and user_answer.selected_answer else None,
                'text_answer': user_answer.text_answer if user_answer else None,
                'is_correct': user_answer.is_correct if user_answer else False,
                'points_earned': user_answer.points_earned if user_answer else 0
            } if user_answer else {
                'selected_answer_id': None,
                'selected_answer_text': None,
                'text_answer': None,
                'is_correct': False,
                'points_earned': 0
            },
            'correct_answer': next(
                (answer for answer in question.answers.all() if answer.is_correct),
                None
            )
        }
        questions_results.append(question_result)
    
    return Response({
        'attempt_id': attempt.id,
        'quiz': {
            'id': quiz.id,
            'title': quiz.title,
            'description': quiz.description,
            'quiz_type': quiz.quiz_type,
            'passing_score': quiz.passing_score,
            'time_limit_minutes': quiz.time_limit_minutes,
            'subject': {
                'id': quiz.subject.id,
                'name': quiz.subject.name,
                'code': quiz.subject.code
            }
        },
        'results': {
            'score': attempt.score,
            'total_points': total_points,
            'percentage_score': round(percentage_score, 1),
            'passed': passed,
            'time_taken_minutes': attempt.time_taken_minutes,
            'total_questions': quiz.questions.count(),
            'correct_answers': sum(1 for ua in user_answers if ua.is_correct),
            'started_at': attempt.started_at.isoformat(),
            'completed_at': attempt.completed_at.isoformat() if attempt.completed_at else None
        },
        'questions': questions_results,
        'can_retake': True  # Always allow retakes
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_quizzes(request):
    """Get quizzes based on user's purchased bundles"""
    from ecommerce.models import UserPurchase
    
    print(f"DEBUG: get_user_quizzes called for user: {request.user}")
    
    # Get user's purchased bundles
    user_purchases = UserPurchase.objects.filter(
        user=request.user,
        is_active=True
    ).select_related('bundle')
    
    if not user_purchases.exists():
        return Response({
            'quizzes': [],
            'message': 'No purchased bundles found. Purchase a bundle to access quizzes.'
        })
    
    # Get all courses from purchased bundles
    purchased_courses = []
    purchased_subjects = set()
    
    for purchase in user_purchases:
        bundle_courses = purchase.bundle.courses.all()
        purchased_courses.extend(bundle_courses)
        for course in bundle_courses:
            purchased_subjects.add(course.subject.id)
    
    # Get quizzes for purchased subjects and courses
    quizzes = Quiz.objects.filter(
        is_published=True
    ).filter(
        models.Q(subject_id__in=purchased_subjects) |
        models.Q(course__in=purchased_courses)
    ).select_related('subject', 'course').prefetch_related('questions').distinct()
    
    # Group quizzes by subject
    quizzes_by_subject = {}
    for quiz in quizzes:
        subject_name = quiz.subject.name
        if subject_name not in quizzes_by_subject:
            quizzes_by_subject[subject_name] = {
                'subject': {
                    'id': quiz.subject.id,
                    'name': quiz.subject.name,
                    'code': quiz.subject.code,
                    'color': quiz.subject.color,
                    'icon': quiz.subject.icon,
                },
                'quizzes': []
            }
        
        # Get user's attempts for this quiz
        user_attempts = QuizAttempt.objects.filter(
            user=request.user,
            quiz=quiz
        ).order_by('-started_at')
        
        best_score = 0
        attempts_count = user_attempts.count()
        last_attempt = None
        
        if user_attempts.exists():
            completed_attempts = user_attempts.filter(is_completed=True)
            if completed_attempts.exists():
                best_score = completed_attempts.aggregate(
                    models.Max('score')
                )['score__max'] or 0
            last_attempt = user_attempts.first()
        
        quiz_data = {
            'id': quiz.id,
            'title': quiz.title,
            'slug': quiz.slug,
            'description': quiz.description,
            'quiz_type': quiz.quiz_type,
            'time_limit_minutes': quiz.time_limit_minutes,
            'passing_score': quiz.passing_score,
            'max_attempts': quiz.max_attempts,
            'question_count': quiz.questions.count(),
            'course': ({
                'id': quiz.course.id,
                'title': quiz.course.title,
                'slug': quiz.course.slug,
            } if quiz.course else None),
            'user_stats': {
                'attempts_count': attempts_count,
                'best_score': best_score,
                'can_attempt': True,  # Always allow attempts
                'last_attempt_date': last_attempt.started_at.isoformat() if last_attempt else None,
                'passed': best_score >= quiz.passing_score,
            }
        }
        
        quizzes_by_subject[subject_name]['quizzes'].append(quiz_data)
    
    return Response({
        'quizzes_by_subject': quizzes_by_subject,
        'total_quizzes': sum(len(data['quizzes']) for data in quizzes_by_subject.values()),
        'purchased_bundles': [
            {
                'id': purchase.bundle.id,
                'title': purchase.bundle.title,
                'bundle_type': purchase.bundle.bundle_type,
            }
            for purchase in user_purchases
        ]
    })