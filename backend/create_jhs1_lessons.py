#!/usr/bin/env python
"""
Create sample lessons for JHS 1 courses
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course, Lesson, Level

def create_jhs1_lessons():
    print("=== Creating JHS 1 Lessons ===\n")
    
    # Get JHS 1 courses
    jhs1_level = Level.objects.get(code='JHS1')
    courses = Course.objects.filter(level=jhs1_level)
    
    lessons_data = {
        'jhs-1-mathematics-numbers-and-operations': [
            {
                'title': 'Introduction to Numbers',
                'description': 'Understanding different types of numbers: natural, whole, and integers',
                'content': 'Learn about the number system and how numbers are used in everyday life.',
                'duration_minutes': 25,
                'order': 1,
                'is_free': True
            },
            {
                'title': 'Basic Addition and Subtraction',
                'description': 'Master the fundamental operations of addition and subtraction',
                'content': 'Practice adding and subtracting numbers with step-by-step examples.',
                'duration_minutes': 30,
                'order': 2,
                'is_free': False
            },
            {
                'title': 'Introduction to Fractions',
                'description': 'Understanding fractions and their basic operations',
                'content': 'Learn what fractions are and how to work with them.',
                'duration_minutes': 35,
                'order': 3,
                'is_free': False
            }
        ],
        'jhs-1-english-language-reading-and-writing': [
            {
                'title': 'Reading Comprehension Basics',
                'description': 'Develop skills to understand and analyze texts',
                'content': 'Learn techniques for better reading comprehension and understanding.',
                'duration_minutes': 20,
                'order': 1,
                'is_free': True
            },
            {
                'title': 'Grammar Fundamentals',
                'description': 'Master basic grammar rules and sentence structure',
                'content': 'Understanding parts of speech, sentence structure, and basic grammar rules.',
                'duration_minutes': 25,
                'order': 2,
                'is_free': False
            },
            {
                'title': 'Creative Writing',
                'description': 'Express yourself through creative writing exercises',
                'content': 'Learn to write stories, poems, and express your creativity through words.',
                'duration_minutes': 30,
                'order': 3,
                'is_free': False
            }
        ],
        'jhs-1-integrated-science-introduction-to-science': [
            {
                'title': 'What is Science?',
                'description': 'Introduction to the world of science and scientific thinking',
                'content': 'Discover what science is and how it helps us understand the world.',
                'duration_minutes': 18,
                'order': 1,
                'is_free': True
            },
            {
                'title': 'Scientific Method',
                'description': 'Learn the steps of scientific investigation',
                'content': 'Understanding observation, hypothesis, experimentation, and conclusion.',
                'duration_minutes': 22,
                'order': 2,
                'is_free': False
            },
            {
                'title': 'Matter and Its Properties',
                'description': 'Explore the basic properties of matter',
                'content': 'Learn about solids, liquids, gases, and their characteristics.',
                'duration_minutes': 25,
                'order': 3,
                'is_free': False
            }
        ],
        'jhs-1-social-studies-our-community': [
            {
                'title': 'Understanding Community',
                'description': 'What makes a community and our role in it',
                'content': 'Learn about communities, their characteristics, and how we contribute.',
                'duration_minutes': 20,
                'order': 1,
                'is_free': True
            },
            {
                'title': 'Ghanaian Culture and Traditions',
                'description': 'Explore the rich culture and traditions of Ghana',
                'content': 'Discover Ghanaian festivals, customs, and cultural practices.',
                'duration_minutes': 28,
                'order': 2,
                'is_free': False
            },
            {
                'title': 'Basic Geography of Ghana',
                'description': 'Learn about Ghana\'s location, regions, and physical features',
                'content': 'Understanding Ghana\'s position in Africa and its geographical features.',
                'duration_minutes': 25,
                'order': 3,
                'is_free': False
            }
        ]
    }
    
    total_lessons = 0
    
    for course in courses:
        if course.slug in lessons_data:
            print(f"Creating lessons for: {course.title}")
            course_lessons = lessons_data[course.slug]
            
            for lesson_data in course_lessons:
                lesson, created = Lesson.objects.get_or_create(
                    course=course,
                    title=lesson_data['title'],
                    defaults={
                        'description': lesson_data['description'],
                        'content': lesson_data['content'],
                        'duration_minutes': lesson_data['duration_minutes'],
                        'order': lesson_data['order'],
                        'is_free': lesson_data['is_free'],
                        'is_published': True
                    }
                )
                
                if created:
                    print(f"  ✅ Created: {lesson.title} ({'Free' if lesson.is_free else 'Premium'})")
                    total_lessons += 1
                else:
                    print(f"  📝 Exists: {lesson.title}")
            
            print()
    
    print(f"Total lessons created: {total_lessons}")
    
    # Summary
    print("\n=== Course Summary ===")
    for course in courses:
        lesson_count = course.lessons.count()
        free_lessons = course.lessons.filter(is_free=True).count()
        print(f"{course.title}:")
        print(f"  - Total lessons: {lesson_count}")
        print(f"  - Free lessons: {free_lessons}")
        print(f"  - Premium lessons: {lesson_count - free_lessons}")
        print()

if __name__ == '__main__':
    create_jhs1_lessons()