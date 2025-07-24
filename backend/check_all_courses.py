#!/usr/bin/env python
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course

print("📚 All Published Courses and Their Lessons:")
print("=" * 50)

courses = Course.objects.filter(is_published=True).order_by('title')
for course in courses:
    lesson_count = course.lessons.filter(is_published=True).count()
    free_count = course.lessons.filter(is_published=True, is_free=True).count()
    premium_count = lesson_count - free_count
    
    print(f"📖 {course.title}")
    print(f"   Slug: {course.slug}")
    print(f"   Total lessons: {lesson_count}")
    print(f"   Free: {free_count} | Premium: {premium_count}")
    print(f"   Preview URL: http://localhost:8080/courses/{course.slug}/preview")
    print()