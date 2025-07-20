#!/usr/bin/env python3
"""
Script to create sample progress data for testing dashboard stats
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Course, Lesson, Quiz, UserProgress, LessonProgress, QuizAttempt
from accounts.models import StudySession

User = get_user_model()

def create_sample_progress():
    """Create sample progress data for testing"""
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'Student',
            'username': 'teststudent'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created test user: {user.email}")
    else:
        print(f"Using existing user: {user.email}")
    
    # Get some courses and lessons
    courses = Course.objects.filter(is_published=True)[:3]
    
    if not courses:
        print("No published courses found. Please create some courses first.")
        return
    
    # Create lesson progress for completed lessons
    lessons_completed = 0
    total_study_time = 0
    
    # First, let's create some sample lessons if they don't exist
    from courses.models import Subject, Level
    
    # Get or create subjects and levels
    math_subject, _ = Subject.objects.get_or_create(
        name='Mathematics',
        defaults={'code': 'MATH', 'description': 'Mathematics subject'}
    )
    
    jhs1_level, _ = Level.objects.get_or_create(
        name='JHS 1',
        defaults={'code': 'JHS1', 'description': 'Junior High School Level 1'}
    )
    
    # Create a sample course if none exist
    if not courses:
        from courses.models import Lesson
        
        sample_course, created = Course.objects.get_or_create(
            title='Basic Mathematics',
            defaults={
                'subject': math_subject,
                'level': jhs1_level,
                'description': 'Introduction to basic mathematics concepts',
                'is_published': True,
                'is_premium': False
            }
        )
        
        if created:
            # Create sample lessons
            lesson_titles = [
                'Introduction to Numbers',
                'Basic Addition and Subtraction', 
                'Multiplication Tables',
                'Division Basics',
                'Fractions Introduction'
            ]
            
            for i, title in enumerate(lesson_titles):
                Lesson.objects.get_or_create(
                    title=title,
                    course=sample_course,
                    defaults={
                        'description': f'Learn about {title.lower()}',
                        'order': i + 1,
                        'duration_minutes': 30,
                        'is_published': True,
                        'is_free': i == 0  # First lesson is free
                    }
                )
            
            print(f"Created sample course: {sample_course.title} with {len(lesson_titles)} lessons")
        
        courses = [sample_course]
    
    for course in courses:
        lessons = course.lessons.filter(is_published=True)[:5]  # First 5 lessons per course
        
        if lessons.count() == 0:
            continue
            
        # Create course progress
        course_progress, created = UserProgress.objects.get_or_create(
            user=user,
            course=course,
            defaults={
                'total_lessons': lessons.count(),
                'lessons_completed': min(3, lessons.count()),  # Complete first 3 lessons
                'completion_percentage': min(60.0, (3 / lessons.count()) * 100) if lessons.count() > 0 else 0
            }
        )
        
        # Create lesson progress
        for i, lesson in enumerate(lessons[:3]):  # Complete first 3 lessons
            lesson_progress, created = LessonProgress.objects.get_or_create(
                user=user,
                lesson=lesson,
                defaults={
                    'is_completed': True,
                    'completion_percentage': 100.0,
                    'time_spent_minutes': 25 + (i * 5),  # 25, 30, 35 minutes
                    'completed_at': timezone.now() - timedelta(days=i+1),
                    'last_accessed': timezone.now() - timedelta(days=i+1)
                }
            )
            
            if created:
                lessons_completed += 1
                total_study_time += lesson_progress.time_spent_minutes
                print(f"Created lesson progress: {lesson.title}")
        
        # Update course progress
        if created:
            course_progress.lessons_completed = min(3, lessons.count())
            course_progress.completion_percentage = (course_progress.lessons_completed / lessons.count()) * 100
            course_progress.save()
    
    # Create quiz attempts
    quizzes = Quiz.objects.filter(is_published=True)[:4]
    quizzes_passed = 0
    
    for i, quiz in enumerate(quizzes):
        # Create quiz attempts with varying scores
        scores = [85, 92, 78, 88]  # All passing scores (>= 70%)
        score = scores[i] if i < len(scores) else 75
        
        quiz_attempt, created = QuizAttempt.objects.get_or_create(
            user=user,
            quiz=quiz,
            defaults={
                'score': score,
                'total_questions': 10,
                'time_taken_minutes': 15 + (i * 3),  # 15, 18, 21, 24 minutes
                'is_completed': True,
                'started_at': timezone.now() - timedelta(days=i+2),
                'completed_at': timezone.now() - timedelta(days=i+2, hours=-1)
            }
        )
        
        if created:
            quizzes_passed += 1
            total_study_time += quiz_attempt.time_taken_minutes
            print(f"Created quiz attempt: {quiz.title} - Score: {score}%")
    
    # Create study sessions for streak calculation
    for i in range(7):  # Create 7 days of study activity
        study_date = timezone.now() - timedelta(days=i)
        
        # Create study session
        StudySession.objects.get_or_create(
            user=user,
            start_time=study_date.replace(hour=14, minute=0),  # 2 PM each day
            defaults={
                'end_time': study_date.replace(hour=15, minute=30),  # 1.5 hours
                'duration_minutes': 90,
                'subject': 'Mathematics' if i % 2 == 0 else 'English',
                'activity_type': 'lesson'
            }
        )
    
    print(f"\n✅ Sample progress data created successfully!")
    print(f"📊 Stats Summary:")
    print(f"   - Lessons Completed: {lessons_completed}")
    print(f"   - Quizzes Passed: {quizzes_passed}")
    print(f"   - Total Study Time: {total_study_time} minutes ({total_study_time/60:.1f} hours)")
    print(f"   - Study Streak: 7 days")
    print(f"   - Test User: {user.email}")
    print(f"\n🔗 You can now login with:")
    print(f"   Email: {user.email}")
    print(f"   Password: testpass123")

if __name__ == '__main__':
    create_sample_progress()