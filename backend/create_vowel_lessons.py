#!/usr/bin/env python
"""
Script to create lessons for vowel-sounds course
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course, Lesson

def create_vowel_lessons():
    """Create lessons for vowel-sounds course"""
    
    try:
        course = Course.objects.get(slug='vowel-sounds')
        print(f"Creating lessons for: {course.title}")
        
        # Delete existing lessons to avoid duplicates
        course.lessons.all().delete()
        
        # Create proper lessons for vowel sounds
        lessons_data = [
            {'title': 'Introduction to Vowel Sounds', 'duration': 8, 'is_free': True, 'description': 'Overview of English vowel system'},
            {'title': 'Short Vowel Sounds', 'duration': 15, 'is_free': True, 'description': 'Learn short vowel sounds: a, e, i, o, u'},
            {'title': 'Long Vowel Sounds', 'duration': 18, 'is_free': False, 'description': 'Master long vowel sounds and patterns'},
            {'title': 'Vowel Combinations', 'duration': 12, 'is_free': False, 'description': 'Diphthongs and vowel pairs'},
            {'title': 'Vowel Practice Exercises', 'duration': 20, 'is_free': False, 'description': 'Interactive vowel pronunciation practice'},
        ]
        
        for i, lesson_data in enumerate(lessons_data, 1):
            lesson = Lesson.objects.create(
                course=course,
                title=lesson_data['title'],
                slug=f'vowel-sounds-lesson-{i}',
                description=lesson_data['description'],
                lesson_type='video',
                order=i,
                duration_minutes=lesson_data['duration'],
                is_free=lesson_data['is_free'],
                is_published=True
            )
            print(f"✅ {lesson.title} ({lesson.duration_minutes} min) - {'Free' if lesson.is_free else 'Premium'}")
        
        print("✅ Successfully created vowel-sounds lessons!")
        
    except Course.DoesNotExist:
        print("❌ vowel-sounds course not found")

if __name__ == '__main__':
    create_vowel_lessons()