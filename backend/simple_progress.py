#!/usr/bin/env python3
"""
Simple script to create basic progress data for dashboard testing
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

def create_simple_progress():
    """Create simple progress data for testing"""
    
    # Get the test user
    try:
        user = User.objects.get(email='test@example.com')
        print(f"Using existing user: {user.email}")
    except User.DoesNotExist:
        print("Test user not found. Please run create_sample_progress.py first.")
        return
    
    # Clear existing progress
    UserProgress.objects.filter(user=user).delete()
    LessonProgress.objects.filter(user=user).delete()
    QuizAttempt.objects.filter(user=user).delete()
    StudySession.objects.filter(user=user).delete()
    
    # Create one lesson progress entry
    actual_lesson = Lesson.objects.first()
    if actual_lesson:
        LessonProgress.objects.create(
            user=user,
            lesson=actual_lesson,
            is_completed=True,
            completion_percentage=100.0,
            time_spent_minutes=45,
            completed_at=timezone.now() - timedelta(days=1),
            last_accessed=timezone.now() - timedelta(days=1)
        )
        print(f"✅ Created lesson progress: {actual_lesson.title}")
    
    # Create quiz attempts
    actual_quiz = Quiz.objects.first()
    if actual_quiz:
        quiz_scores = [85, 92, 78]
        for i, score in enumerate(quiz_scores):
            QuizAttempt.objects.create(
                user=user,
                quiz=actual_quiz,
                score=score,
                total_questions=10,
                time_taken_minutes=20,
                is_completed=True,
                started_at=timezone.now() - timedelta(days=i+1),
                completed_at=timezone.now() - timedelta(days=i+1, hours=-1)
            )
            print(f"✅ Created quiz attempt: Score {score}%")
    
    # Create study sessions for the last 5 days
    for day in range(1, 6):
        study_date = timezone.now() - timedelta(days=day)
        StudySession.objects.create(
            user=user,
            start_time=study_date.replace(hour=14, minute=0),
            end_time=study_date.replace(hour=15, minute=30),
            duration_minutes=90,
            subject='Mathematics' if day % 2 == 0 else 'English',
            activity_type='lesson'
        )
        print(f"✅ Created study session for day {day}")
    
    # Create course progress
    courses = Course.objects.filter(is_published=True)[:2]
    for course in courses:
        UserProgress.objects.create(
            user=user,
            course=course,
            lessons_completed=1,
            total_lessons=5,
            completion_percentage=20.0,
            last_accessed=timezone.now() - timedelta(days=1)
        )
        print(f"✅ Created course progress: {course.title}")
    
    print(f"\n🎉 Simple progress data created!")
    print(f"📊 Expected Stats:")
    print(f"   - Lessons Completed: 1")
    print(f"   - Quizzes Passed: 3 (scores: 85%, 92%, 78%)")
    print(f"   - Study Hours: ~8.2h (45min lesson + 60min quizzes + 450min sessions)")
    print(f"   - Study Streak: 5 days")
    print(f"   - Overall Progress: 20%")

if __name__ == '__main__':
    create_simple_progress()