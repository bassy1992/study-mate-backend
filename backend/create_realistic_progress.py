#!/usr/bin/env python3
"""
Script to create realistic progress data for dashboard testing
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

def create_realistic_progress():
    """Create realistic progress data for testing"""
    
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
    
    # Get available courses and create some manual lesson progress
    courses = Course.objects.filter(is_published=True)[:2]
    
    lessons_completed = 0
    total_study_time = 0
    
    # Create manual lesson progress (simulating completed lessons)
    lesson_data = [
        {"title": "Introduction to Mathematics", "time": 35, "days_ago": 1},
        {"title": "Basic Algebra Concepts", "time": 42, "days_ago": 2},
        {"title": "Solving Linear Equations", "time": 38, "days_ago": 3},
        {"title": "Introduction to Geometry", "time": 45, "days_ago": 4},
        {"title": "Area and Perimeter", "time": 40, "days_ago": 5},
        {"title": "English Grammar Basics", "time": 30, "days_ago": 6},
        {"title": "Sentence Structure", "time": 35, "days_ago": 7},
    ]
    
    # Get actual lesson to use
    actual_lesson = Lesson.objects.first()
    if not actual_lesson:
        print("No lessons found. Creating study sessions only.")
        lessons_completed = 0
    else:
        # Create lesson progress entries using the actual lesson
        for i, lesson_info in enumerate(lesson_data):
            # Create lesson progress entry
            progress_entry = LessonProgress.objects.create(
                user=user,
                lesson=actual_lesson,  # Using actual lesson
                is_completed=True,
                completion_percentage=100.0,
                time_spent_minutes=lesson_info["time"],
                completed_at=timezone.now() - timedelta(days=lesson_info["days_ago"]),
                last_accessed=timezone.now() - timedelta(days=lesson_info["days_ago"])
            )
            
            lessons_completed += 1
            total_study_time += lesson_info["time"]
            print(f"Created lesson progress: {lesson_info['title']} ({lesson_info['time']} min)")
    
    # Create quiz attempts with realistic scores
    quiz_data = [
        {"title": "Mathematics Quiz 1", "score": 85, "time": 20, "days_ago": 1},
        {"title": "Mathematics Quiz 2", "score": 92, "time": 18, "days_ago": 3},
        {"title": "English Quiz 1", "score": 78, "time": 15, "days_ago": 5},
        {"title": "Science Quiz 1", "score": 88, "time": 22, "days_ago": 6},
    ]
    
    # Get actual quiz to use
    actual_quiz = Quiz.objects.first()
    
    quizzes_passed = 0
    if actual_quiz:
        for quiz_info in quiz_data:
            quiz_attempt = QuizAttempt.objects.create(
                user=user,
                quiz=actual_quiz,  # Using actual quiz
                score=quiz_info["score"],
                total_questions=10,
                time_taken_minutes=quiz_info["time"],
                is_completed=True,
                started_at=timezone.now() - timedelta(days=quiz_info["days_ago"]),
                completed_at=timezone.now() - timedelta(days=quiz_info["days_ago"], hours=-1)
            )
            
            if quiz_info["score"] >= 70:
                quizzes_passed += 1
            
            total_study_time += quiz_info["time"]
            print(f"Created quiz attempt: {quiz_info['title']} - Score: {quiz_info['score']}%")
    
    # Create study sessions for the last 10 days (with some gaps for realistic streak)
    study_days = [1, 2, 3, 4, 5, 7, 8, 9]  # Missing day 6 and 10 for realistic streak
    
    for day in study_days:
        study_date = timezone.now() - timedelta(days=day)
        
        StudySession.objects.create(
            user=user,
            start_time=study_date.replace(hour=14, minute=0),
            end_time=study_date.replace(hour=15, minute=30),
            duration_minutes=90,
            subject='Mathematics' if day % 2 == 0 else 'English',
            activity_type='lesson'
        )
    
    # Create course progress for existing courses
    if courses:
        for course in courses[:2]:
            UserProgress.objects.create(
                user=user,
                course=course,
                lessons_completed=3,
                total_lessons=5,
                completion_percentage=60.0,
                last_accessed=timezone.now() - timedelta(days=1)
            )
    
    print(f"\n✅ Realistic progress data created successfully!")
    print(f"📊 Expected Stats:")
    print(f"   - Lessons Completed: {lessons_completed}")
    print(f"   - Quizzes Passed: {quizzes_passed}")
    print(f"   - Total Study Time: {total_study_time} minutes ({total_study_time/60:.1f} hours)")
    print(f"   - Study Streak: ~8 days (with some gaps)")
    print(f"   - Overall Progress: ~60%")
    print(f"\n🔗 Login with:")
    print(f"   Email: test@example.com")
    print(f"   Password: testpass123")

if __name__ == '__main__':
    create_realistic_progress()