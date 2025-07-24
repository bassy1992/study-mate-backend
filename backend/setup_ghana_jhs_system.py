#!/usr/bin/env python
"""
Complete setup script for Ghana JHS System

This script will:
1. Run the JHS framework migration
2. Create topic-based lessons
3. Set up sample data
4. Verify the complete system
"""

import os
import sys
import django
import subprocess

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Subject, Level, Course, Lesson
from ecommerce.models import Bundle


def run_script(script_name, description):
    """Run a Python script and handle errors"""
    print(f"\n🚀 {description}")
    print("-" * 50)
    
    try:
        result = subprocess.run([sys.executable, script_name], 
                              capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print(result.stdout)
            return True
        else:
            print(f"❌ Error running {script_name}:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Failed to run {script_name}: {str(e)}")
        return False


def verify_system():
    """Verify that the JHS system is properly set up"""
    print("\n🔍 VERIFYING GHANA JHS SYSTEM SETUP")
    print("="*50)
    
    # Check levels
    jhs_levels = Level.objects.filter(code__in=['JHS1', 'JHS2', 'JHS3'])
    print(f"✅ JHS Levels: {jhs_levels.count()}/3")
    for level in jhs_levels:
        print(f"   • {level.name} ({level.code})")
    
    # Check subjects
    core_subjects = Subject.objects.filter(code__in=['ENG', 'MATH', 'SCI'])
    print(f"\n✅ Core Subjects: {core_subjects.count()}/3")
    for subject in core_subjects:
        print(f"   • {subject.name} ({subject.code})")
    
    # Check courses
    jhs_courses = Course.objects.filter(
        level__code__in=['JHS1', 'JHS2', 'JHS3'],
        subject__code__in=['ENG', 'MATH', 'SCI']
    )
    print(f"\n✅ JHS Courses: {jhs_courses.count()}/9")
    for course in jhs_courses.order_by('level__order', 'subject__code'):
        lesson_count = course.lessons.count()
        print(f"   • {course.title} ({lesson_count} lessons)")
    
    # Check bundles
    jhs_bundles = Bundle.objects.filter(slug__in=['jhs1-complete', 'jhs2-complete', 'jhs3-bece-prep'])
    print(f"\n✅ JHS Bundles: {jhs_bundles.count()}/3")
    for bundle in jhs_bundles:
        course_count = bundle.courses.count()
        print(f"   • {bundle.title} ({course_count} courses) - GHS {bundle.discounted_price}")
    
    # Check lessons
    total_lessons = Lesson.objects.filter(
        course__level__code__in=['JHS1', 'JHS2', 'JHS3'],
        course__subject__code__in=['ENG', 'MATH', 'SCI']
    ).count()
    print(f"\n✅ Total JHS Lessons: {total_lessons}")
    
    # Sample lessons by subject
    for subject in core_subjects:
        subject_lessons = Lesson.objects.filter(course__subject=subject).count()
        print(f"   • {subject.name}: {subject_lessons} lessons")
    
    return {
        'levels': jhs_levels.count() == 3,
        'subjects': core_subjects.count() == 3,
        'courses': jhs_courses.count() == 9,
        'bundles': jhs_bundles.count() == 3,
        'lessons': total_lessons > 0
    }


def display_admin_guide():
    """Display guide for using Django admin"""
    print("\n📋 DJANGO ADMIN GUIDE")
    print("="*50)
    print("Access your Ghana JHS system at: http://127.0.0.1:8000/admin/")
    print("\n🏫 LEVELS (Classes):")
    print("   • JHS 1 - Foundation year")
    print("   • JHS 2 - Intermediate year") 
    print("   • JHS 3 - BECE preparation year")
    
    print("\n📚 SUBJECTS (Core):")
    print("   • English Language (ENG)")
    print("   • Mathematics (MATH)")
    print("   • Integrated Science (SCI)")
    
    print("\n📖 COURSES:")
    print("   • Each JHS level has 3 courses (one per subject)")
    print("   • Each course contains 8 topic-based lessons")
    print("   • First 2 lessons are free, rest are premium")
    
    print("\n🎁 BUNDLES:")
    print("   • JHS 1 Complete Package - GHS 35.00")
    print("   • JHS 2 Complete Package - GHS 45.00")
    print("   • JHS 3 BECE Preparation - GHS 60.00")
    
    print("\n🔧 CUSTOMIZATION:")
    print("   1. Add more subjects (Social Studies, ICT, etc.)")
    print("   2. Create additional topics within subjects")
    print("   3. Add video content to lessons")
    print("   4. Set up quizzes and assessments")
    print("   5. Configure payment integration")


def display_api_endpoints():
    """Display key API endpoints for the JHS system"""
    print("\n🌐 KEY API ENDPOINTS")
    print("="*50)
    print("Base URL: http://127.0.0.1:8000/api/")
    
    print("\n📚 Courses:")
    print("   GET /courses/levels/ - List JHS levels")
    print("   GET /courses/subjects/ - List core subjects")
    print("   GET /courses/courses/ - List all courses")
    print("   GET /courses/courses/?level=JHS1 - JHS 1 courses")
    print("   GET /courses/courses/?subject=MATH - Math courses")
    
    print("\n🎁 Bundles:")
    print("   GET /ecommerce/bundles/ - List all bundles")
    print("   GET /ecommerce/bundles/jhs1-complete/ - JHS 1 bundle")
    print("   GET /ecommerce/bundles/jhs2-complete/ - JHS 2 bundle")
    print("   GET /ecommerce/bundles/jhs3-bece-prep/ - JHS 3 bundle")
    
    print("\n📖 Lessons:")
    print("   GET /courses/courses/{course_slug}/lessons/ - Course lessons")
    print("   GET /courses/lessons/{lesson_id}/ - Lesson details")
    
    print("\n📊 Documentation:")
    print("   GET /api/schema/swagger-ui/ - Interactive API docs")
    print("   GET /api/schema/redoc/ - ReDoc documentation")


def main():
    """Main setup function"""
    print("GHANA JHS SYSTEM COMPLETE SETUP")
    print("="*60)
    print("Setting up the complete Ghana Junior High School system")
    print("with classes, subjects, topics, and bundles...")
    print("="*60)
    
    success_steps = []
    
    # Step 1: Run JHS framework migration
    if run_script('migrate_to_jhs_framework.py', 'Setting up JHS Framework'):
        success_steps.append('framework')
    else:
        print("❌ Framework setup failed. Stopping.")
        return False
    
    # Step 2: Create topic-based lessons
    if run_script('create_jhs_topics.py', 'Creating Topic-Based Lessons'):
        success_steps.append('topics')
    else:
        print("⚠️  Topics creation failed, but continuing...")
    
    # Step 3: Verify system
    verification = verify_system()
    
    # Step 4: Display guides
    display_admin_guide()
    display_api_endpoints()
    
    # Final summary
    print("\n" + "="*60)
    print("🎉 GHANA JHS SYSTEM SETUP COMPLETE!")
    print("="*60)
    
    if all(verification.values()):
        print("✅ All components successfully created!")
        print("\n🚀 Your Ghana JHS system is ready to use!")
        print("\n📋 Next Steps:")
        print("   1. Start Django server: python manage.py runserver")
        print("   2. Access admin: http://127.0.0.1:8000/admin/")
        print("   3. View API docs: http://127.0.0.1:8000/api/schema/swagger-ui/")
        print("   4. Add video content to lessons")
        print("   5. Test the frontend integration")
        
        return True
    else:
        print("⚠️  Some components may need attention:")
        for component, status in verification.items():
            status_icon = "✅" if status else "❌"
            print(f"   {status_icon} {component.title()}")
        
        return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)