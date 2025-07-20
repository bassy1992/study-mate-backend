#!/usr/bin/env python3
"""
Script to create sample lessons for existing courses
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course, Lesson

def create_sample_lessons():
    """Create sample lessons for existing courses"""
    
    courses = Course.objects.filter(is_published=True)[:3]
    
    if not courses:
        print("No published courses found.")
        return
    
    lesson_templates = [
        "Introduction to {subject}",
        "Basic Concepts in {subject}",
        "Practical Examples",
        "Practice Exercises",
        "Review and Assessment"
    ]
    
    total_lessons_created = 0
    
    for course in courses:
        print(f"\nCreating lessons for: {course.title}")
        
        # Create 5 lessons per course
        for i, template in enumerate(lesson_templates):
            lesson_title = f"{template.format(subject=course.subject.name if hasattr(course, 'subject') else course.title)} - Part {i+1}"
            
            # Check if lesson already exists for this course
            existing_lesson = Lesson.objects.filter(course=course, title=lesson_title).first()
            if existing_lesson:
                print(f"  ⚠️  Already exists: {lesson_title}")
                continue
            
            lesson = Lesson.objects.create(
                title=lesson_title,
                course=course,
                description=f'Learn about {lesson_title.lower()} in this comprehensive lesson.',
                order=i + 1,
                duration_minutes=30 + (i * 5),  # 30, 35, 40, 45, 50 minutes
                is_published=True,
                is_free=i == 0,  # First lesson is free
                lesson_type='video'
            )
            
            total_lessons_created += 1
            print(f"  ✅ Created: {lesson.title}")
    
    print(f"\n🎉 Created {total_lessons_created} new lessons!")
    print(f"📊 Total published lessons now: {Lesson.objects.filter(is_published=True).count()}")

if __name__ == '__main__':
    create_sample_lessons()