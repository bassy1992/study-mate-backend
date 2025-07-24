#!/usr/bin/env python
"""
Verify the complete Ghana JHS System setup
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Subject, Level, Course, Lesson
from ecommerce.models import Bundle


def verify_complete_system():
    """Verify that the complete JHS system is properly set up"""
    print("GHANA JHS SYSTEM VERIFICATION")
    print("="*60)
    
    # Check levels
    jhs_levels = Level.objects.filter(code__in=['JHS1', 'JHS2', 'JHS3']).order_by('order')
    print(f"\nJHS LEVELS ({jhs_levels.count()}/3):")
    for level in jhs_levels:
        print(f"   • {level.name} ({level.code}) - Order: {level.order}")
    
    # Check subjects
    core_subjects = Subject.objects.filter(code__in=['ENG', 'MATH', 'SCI']).order_by('code')
    print(f"\nCORE SUBJECTS ({core_subjects.count()}/3):")
    for subject in core_subjects:
        print(f"   • {subject.name} ({subject.code}) - Color: {subject.color}")
    
    # Check courses
    print(f"\nJHS COURSES:")
    for level in jhs_levels:
        print(f"\n   {level.name}:")
        level_courses = Course.objects.filter(level=level, subject__in=core_subjects).order_by('subject__code')
        for course in level_courses:
            lesson_count = course.lessons.count()
            free_lessons = course.lessons.filter(is_free=True).count()
            print(f"     • {course.title}")
            print(f"       Subject: {course.subject.name} | Lessons: {lesson_count} ({free_lessons} free)")
    
    # Check bundles
    jhs_bundles = Bundle.objects.filter(slug__in=['jhs1-complete', 'jhs2-complete', 'jhs3-bece-prep']).order_by('slug')
    print(f"\nJHS BUNDLES ({jhs_bundles.count()}/3):")
    for bundle in jhs_bundles:
        course_count = bundle.courses.count()
        print(f"   • {bundle.title}")
        print(f"     Price: GHS {bundle.original_price} -> GHS {bundle.discounted_price}")
        print(f"     Courses: {course_count} | Featured: {bundle.is_featured}")
    
    # Detailed lesson breakdown
    print(f"\nLESSON BREAKDOWN BY SUBJECT:")
    for subject in core_subjects:
        print(f"\n   {subject.name} ({subject.code}):")
        for level in jhs_levels:
            try:
                course = Course.objects.get(subject=subject, level=level)
                lessons = course.lessons.all().order_by('order')
                print(f"     {level.name} - {course.title} ({lessons.count()} lessons):")
                for lesson in lessons[:3]:  # Show first 3 lessons
                    free_status = "FREE" if lesson.is_free else "PREMIUM"
                    print(f"       {lesson.order}. {lesson.title} ({lesson.duration_minutes}min) [{free_status}]")
                if lessons.count() > 3:
                    print(f"       ... and {lessons.count() - 3} more lessons")
            except Course.DoesNotExist:
                print(f"     {level.name} - No course found")
    
    # Statistics
    total_courses = Course.objects.filter(level__in=jhs_levels, subject__in=core_subjects).count()
    total_lessons = Lesson.objects.filter(course__level__in=jhs_levels, course__subject__in=core_subjects).count()
    free_lessons = Lesson.objects.filter(course__level__in=jhs_levels, course__subject__in=core_subjects, is_free=True).count()
    
    print(f"\nSYSTEM STATISTICS:")
    print(f"   • Total JHS Courses: {total_courses}")
    print(f"   • Total JHS Lessons: {total_lessons}")
    print(f"   • Free Lessons: {free_lessons}")
    print(f"   • Premium Lessons: {total_lessons - free_lessons}")
    print(f"   • Average Lessons per Course: {total_lessons / total_courses if total_courses > 0 else 0:.1f}")
    
    # API endpoints guide
    print(f"\nKEY API ENDPOINTS:")
    print(f"   Base URL: http://127.0.0.1:8000/api/")
    print(f"   • GET /courses/levels/ - List JHS levels")
    print(f"   • GET /courses/subjects/ - List core subjects")
    print(f"   • GET /courses/courses/ - List all courses")
    print(f"   • GET /courses/courses/?level=JHS1 - JHS 1 courses")
    print(f"   • GET /courses/courses/?subject=MATH - Math courses")
    print(f"   • GET /ecommerce/bundles/ - List bundles")
    print(f"   • GET /api/schema/swagger-ui/ - API documentation")
    
    # Admin guide
    print(f"\nADMIN ACCESS:")
    print(f"   • URL: http://127.0.0.1:8000/admin/")
    print(f"   • Manage: Levels, Subjects, Courses, Lessons, Bundles")
    print(f"   • Add video content to lessons")
    print(f"   • Create quizzes and assessments")
    
    # Validation
    issues = []
    if jhs_levels.count() != 3:
        issues.append("Missing JHS levels")
    if core_subjects.count() != 3:
        issues.append("Missing core subjects")
    if total_courses != 9:
        issues.append(f"Expected 9 courses, found {total_courses}")
    if jhs_bundles.count() != 3:
        issues.append("Missing JHS bundles")
    
    print(f"\nSYSTEM STATUS:")
    if not issues:
        print("   STATUS: COMPLETE - Ghana JHS system is fully set up!")
        print("   READY: System is ready for content addition and deployment")
    else:
        print("   STATUS: INCOMPLETE - Issues found:")
        for issue in issues:
            print(f"     • {issue}")
    
    return len(issues) == 0


def main():
    """Main verification function"""
    success = verify_complete_system()
    
    print(f"\n" + "="*60)
    if success:
        print("VERIFICATION COMPLETE - SYSTEM READY!")
        print("\nNext steps:")
        print("1. Start Django server: python manage.py runserver")
        print("2. Access admin panel to add video content")
        print("3. Test API endpoints")
        print("4. Configure frontend integration")
    else:
        print("VERIFICATION FAILED - PLEASE FIX ISSUES")
    print("="*60)
    
    return success


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)