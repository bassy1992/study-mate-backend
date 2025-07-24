#!/usr/bin/env python
"""
Script to create multiple lessons for courses to break down long videos into smaller segments
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course, Lesson, Subject, Level
from django.utils.text import slugify

def create_lessons_for_course():
    """Create multiple lessons for the Fractions, Decimals and Percentages course"""
    
    # Get or create the course
    try:
        course = Course.objects.get(slug='fractions-decimals-and-percentages')
        print(f"Found existing course: {course.title}")
    except Course.DoesNotExist:
        # Create the course if it doesn't exist
        math_subject, _ = Subject.objects.get_or_create(
            code='MATH',
            defaults={
                'name': 'Mathematics',
                'description': 'Mathematics subject covering various mathematical concepts',
                'icon': 'calculator',
                'color': '#3B82F6'
            }
        )
        
        jhs1_level, _ = Level.objects.get_or_create(
            code='JHS1',
            defaults={
                'name': 'JHS 1',
                'description': 'Junior High School Level 1',
                'order': 1
            }
        )
        
        course = Course.objects.create(
            title='Fractions, Decimals and Percentages',
            slug='fractions-decimals-and-percentages',
            description='Master the concepts of fractions, decimals, and percentages with practical applications and problem-solving techniques.',
            subject=math_subject,
            level=jhs1_level,
            duration_hours=3,
            difficulty='beginner',
            is_premium=False,
            is_published=True,
            learning_objectives=[
                'Understand the relationship between fractions, decimals, and percentages',
                'Convert between fractions, decimals, and percentages',
                'Solve real-world problems involving fractions, decimals, and percentages',
                'Apply mathematical operations to fractions and decimals',
                'Use percentages in practical situations'
            ],
            prerequisites='Basic arithmetic operations and number sense'
        )
        print(f"Created new course: {course.title}")
    
    # Clear existing lessons
    existing_lessons = course.lessons.all()
    if existing_lessons.exists():
        print(f"Removing {existing_lessons.count()} existing lessons...")
        existing_lessons.delete()
    
    # Define lessons for the course with actual educational video URLs
    lessons_data = [
        {
            'title': 'Lesson 1: Introduction to Fractions',
            'description': 'Learn the basics of fractions, what they represent, and how to identify numerators and denominators.',
            'duration_minutes': 25,
            'video_url': 'https://www.youtube.com/watch?v=S7JbmhYdduA',  # Introduction to Fractions
            'is_free': True
        },
        {
            'title': 'Lesson 2: Understanding Decimals',
            'description': 'Explore decimal numbers, place values, and how decimals relate to fractions.',
            'duration_minutes': 30,
            'video_url': 'https://www.youtube.com/watch?v=6VhbXzV7NNs',  # Decimals Explained
            'is_free': True
        },
        {
            'title': 'Lesson 3: Introduction to Percentages',
            'description': 'Discover what percentages are and how they connect to fractions and decimals.',
            'duration_minutes': 28,
            'video_url': 'https://www.youtube.com/watch?v=WYWPuG-8U5Q',  # Percentages Made Easy
            'is_free': True
        },
        {
            'title': 'Lesson 4: Converting Between Forms',
            'description': 'Master the techniques for converting between fractions, decimals, and percentages.',
            'duration_minutes': 35,
            'video_url': 'https://www.youtube.com/watch?v=7_2aV6st95s',  # Converting Fractions, Decimals, Percentages
            'is_free': False
        },
        {
            'title': 'Lesson 5: Operations with Fractions',
            'description': 'Learn how to add, subtract, multiply, and divide fractions effectively.',
            'duration_minutes': 40,
            'video_url': 'https://www.youtube.com/watch?v=78tZn6eM6jI',  # Fraction Operations
            'is_free': False
        },
        {
            'title': 'Lesson 6: Decimal Operations',
            'description': 'Practice mathematical operations with decimal numbers.',
            'duration_minutes': 32,
            'video_url': 'https://www.youtube.com/watch?v=Gg4C5V1Vuuq',  # Decimal Operations
            'is_free': False
        },
        {
            'title': 'Lesson 7: Percentage Calculations',
            'description': 'Solve problems involving percentage calculations and applications.',
            'duration_minutes': 38,
            'video_url': 'https://www.youtube.com/watch?v=rGK6bpMYJlA',  # Percentage Calculations
            'is_free': False
        },
        {
            'title': 'Lesson 8: Real-World Applications',
            'description': 'Apply your knowledge to solve real-world problems involving fractions, decimals, and percentages.',
            'duration_minutes': 45,
            'video_url': 'https://www.youtube.com/watch?v=YWHx0RsRNzI',  # Real World Math Applications
            'is_free': False
        }
    ]
    
    # Create lessons
    created_lessons = []
    for i, lesson_data in enumerate(lessons_data, 1):
        lesson = Lesson.objects.create(
            course=course,
            title=lesson_data['title'],
            slug=slugify(lesson_data['title']),
            description=lesson_data['description'],
            lesson_type='video',
            order=i,
            duration_minutes=lesson_data['duration_minutes'],
            video_duration=lesson_data['duration_minutes'] * 60,  # Convert to seconds
            video_url=lesson_data['video_url'],
            is_free=lesson_data['is_free'],
            is_published=True
        )
        created_lessons.append(lesson)
        print(f"✅ Created: {lesson.title} ({lesson.duration_minutes} min)")
    
    print(f"\n🎉 Successfully created {len(created_lessons)} lessons for '{course.title}'")
    print(f"📚 Course now has {course.lessons.count()} total lessons")
    print(f"🆓 Free lessons: {course.lessons.filter(is_free=True).count()}")
    print(f"💎 Premium lessons: {course.lessons.filter(is_free=False).count()}")
    
    return course, created_lessons

def create_lessons_for_other_courses():
    """Create lessons for other courses as well"""
    
    # Define other courses and their lessons with actual video URLs
    other_courses_data = {
        'english-sounds': {
            'title': 'English Sounds',
            'subject_code': 'ENG',
            'lessons': [
                {'title': 'Lesson 1: Introduction to English Sounds', 'duration': 20, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=dfoRdKEzCwI'},
                {'title': 'Lesson 2: Consonant Sounds', 'duration': 25, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=BELlZKpi1Zs'},
                {'title': 'Lesson 3: Vowel Sounds Basics', 'duration': 30, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=4TjcT7Gto3U'},
                {'title': 'Lesson 4: Advanced Vowel Sounds', 'duration': 28, 'free': False, 'video_url': 'https://www.youtube.com/watch?v=8X5zX3yVoEE'},
                {'title': 'Lesson 5: Sound Combinations', 'duration': 35, 'free': False, 'video_url': 'https://www.youtube.com/watch?v=saF3IRiXKNs'},
            ]
        },
        'vowel-sounds': {
            'title': 'Vowel Sounds',
            'subject_code': 'ENG',
            'lessons': [
                {'title': 'Lesson 1: Short Vowel Sounds', 'duration': 22, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=4TjcT7Gto3U'},
                {'title': 'Lesson 2: Long Vowel Sounds', 'duration': 26, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=8X5zX3yVoEE'},
                {'title': 'Lesson 3: Vowel Digraphs', 'duration': 24, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=saF3IRiXKNs'},
                {'title': 'Lesson 4: Diphthongs', 'duration': 30, 'free': False, 'video_url': 'https://www.youtube.com/watch?v=dfoRdKEzCwI'},
                {'title': 'Lesson 5: Practice and Application', 'duration': 32, 'free': False, 'video_url': 'https://www.youtube.com/watch?v=BELlZKpi1Zs'},
            ]
        },
        'introduction-to-science-and-scientific-methods': {
            'title': 'Introduction to Science and Scientific Methods',
            'subject_code': 'SCI',
            'lessons': [
                {'title': 'Lesson 1: What is Science?', 'duration': 18, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=N6IAzlugWw0'},
                {'title': 'Lesson 2: The Scientific Method', 'duration': 25, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=zi8FfMBYCkk'},
                {'title': 'Lesson 3: Observation and Hypothesis', 'duration': 22, 'free': True, 'video_url': 'https://www.youtube.com/watch?v=OCV7WqjxgHM'},
                {'title': 'Lesson 4: Experimentation', 'duration': 28, 'free': False, 'video_url': 'https://www.youtube.com/watch?v=oy7gBfLdUWs'},
                {'title': 'Lesson 5: Data Analysis and Conclusions', 'duration': 30, 'free': False, 'video_url': 'https://www.youtube.com/watch?v=Rd4a1X3B61w'},
            ]
        }
    }
    
    for course_slug, course_info in other_courses_data.items():
        try:
            course = Course.objects.get(slug=course_slug)
            print(f"\nProcessing course: {course.title}")
            
            # Clear existing lessons
            course.lessons.all().delete()
            
            # Create new lessons
            for i, lesson_data in enumerate(course_info['lessons'], 1):
                lesson = Lesson.objects.create(
                    course=course,
                    title=lesson_data['title'],
                    slug=slugify(lesson_data['title']),
                    description=f"Comprehensive lesson covering key concepts in {course.title.lower()}.",
                    lesson_type='video',
                    order=i,
                    duration_minutes=lesson_data['duration'],
                    video_duration=lesson_data['duration'] * 60,
                    video_url=lesson_data.get('video_url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
                    is_free=lesson_data['free'],
                    is_published=True
                )
                print(f"  ✅ Created: {lesson.title} - {lesson_data.get('video_url', 'No URL')[:50]}...")
                
        except Course.DoesNotExist:
            print(f"  ⚠️  Course '{course_slug}' not found, skipping...")
            continue

if __name__ == '__main__':
    print("🚀 Creating course lessons...")
    print("=" * 50)
    
    # Create lessons for the main course
    course, lessons = create_lessons_for_course()
    
    # Create lessons for other courses
    create_lessons_for_other_courses()
    
    print("\n" + "=" * 50)
    print("✨ Course lesson creation completed!")