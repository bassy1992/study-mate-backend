#!/usr/bin/env python
"""
Migration script to align the system with Ghana JHS Framework

This script will:
1. Create the 3 JHS levels (JHS 1, JHS 2, JHS 3)
2. Create the core subjects (English, Mathematics, Science)
3. Update existing data to align with the new structure
4. Create appropriate bundles for each JHS level
"""

import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Subject, Level, Course
from ecommerce.models import Bundle
from django.utils.text import slugify


def create_jhs_levels():
    """Create the 3 JHS levels"""
    print("Creating JHS Levels...")
    
    jhs_levels = [
        {
            'name': 'JHS 1',
            'code': 'JHS1',
            'description': 'Junior High School Level 1 - Foundation year introducing core subjects',
            'order': 1
        },
        {
            'name': 'JHS 2', 
            'code': 'JHS2',
            'description': 'Junior High School Level 2 - Intermediate year building on JHS 1 concepts',
            'order': 2
        },
        {
            'name': 'JHS 3',
            'code': 'JHS3', 
            'description': 'Junior High School Level 3 - Final year preparing for BECE examination',
            'order': 3
        }
    ]
    
    created_levels = []
    for level_data in jhs_levels:
        level, created = Level.objects.get_or_create(
            code=level_data['code'],
            defaults={
                'name': level_data['name'],
                'description': level_data['description'],
                'order': level_data['order'],
                'is_active': True
            }
        )
        created_levels.append(level)
        status = "✅ Created" if created else "📝 Updated"
        print(f"   {status}: {level.name} ({level.code})")
    
    return created_levels


def create_core_subjects():
    """Create the core JHS subjects"""
    print("\n📚 Creating Core Subjects...")
    
    core_subjects = [
        {
            'name': 'English Language',
            'code': 'ENG',
            'description': 'English Language - Reading, Writing, Grammar, Literature and Communication Skills',
            'icon': '📖',
            'color': '#2563eb'  # Blue
        },
        {
            'name': 'Mathematics',
            'code': 'MATH',
            'description': 'Mathematics - Numbers, Algebra, Geometry, Statistics and Problem Solving',
            'icon': '🔢',
            'color': '#dc2626'  # Red
        },
        {
            'name': 'Integrated Science',
            'code': 'SCI',
            'description': 'Integrated Science - Physics, Chemistry, Biology and Environmental Science',
            'icon': '🔬',
            'color': '#16a34a'  # Green
        }
    ]
    
    created_subjects = []
    for subject_data in core_subjects:
        subject, created = Subject.objects.get_or_create(
            code=subject_data['code'],
            defaults={
                'name': subject_data['name'],
                'description': subject_data['description'],
                'icon': subject_data['icon'],
                'color': subject_data['color'],
                'is_active': True
            }
        )
        created_subjects.append(subject)
        status = "✅ Created" if created else "📝 Updated"
        print(f"   {status}: {subject.name} ({subject.code})")
    
    return created_subjects


def create_jhs_bundles(levels, subjects):
    """Create JHS class bundles"""
    print("\n🎁 Creating JHS Class Bundles...")
    
    bundle_data = [
        {
            'level': levels[0],  # JHS 1
            'title': 'JHS 1 Complete Package',
            'slug': 'jhs1-complete',
            'description': 'Complete foundation package for JHS 1 students covering English, Mathematics, and Integrated Science with comprehensive lessons and practice materials.',
            'original_price': Decimal('50.00'),
            'discounted_price': Decimal('35.00'),
            'is_featured': True
        },
        {
            'level': levels[1],  # JHS 2
            'title': 'JHS 2 Complete Package',
            'slug': 'jhs2-complete', 
            'description': 'Intermediate package for JHS 2 students building on foundation concepts with advanced topics in English, Mathematics, and Integrated Science.',
            'original_price': Decimal('60.00'),
            'discounted_price': Decimal('45.00'),
            'is_featured': True
        },
        {
            'level': levels[2],  # JHS 3
            'title': 'JHS 3 BECE Preparation Package',
            'slug': 'jhs3-bece-prep',
            'description': 'Comprehensive BECE preparation package for JHS 3 students with past questions, mock exams, and intensive review materials for all core subjects.',
            'original_price': Decimal('80.00'),
            'discounted_price': Decimal('60.00'),
            'is_featured': True
        }
    ]
    
    created_bundles = []
    for bundle_info in bundle_data:
        bundle, created = Bundle.objects.get_or_create(
            slug=bundle_info['slug'],
            defaults={
                'title': bundle_info['title'],
                'description': bundle_info['description'],
                'bundle_type': 'level',
                'original_price': bundle_info['original_price'],
                'discounted_price': bundle_info['discounted_price'],
                'is_featured': bundle_info['is_featured'],
                'is_active': True
            }
        )
        created_bundles.append((bundle, bundle_info['level']))
        status = "✅ Created" if created else "📝 Updated"
        print(f"   {status}: {bundle.title}")
    
    return created_bundles


def create_sample_courses(levels, subjects):
    """Create sample courses for each JHS level and subject combination"""
    print("\n📖 Creating Sample Courses...")
    
    course_templates = {
        'ENG': {
            'JHS1': 'English Language Fundamentals',
            'JHS2': 'Intermediate English Language',
            'JHS3': 'Advanced English & BECE Preparation'
        },
        'MATH': {
            'JHS1': 'Mathematics Foundations',
            'JHS2': 'Intermediate Mathematics',
            'JHS3': 'Advanced Mathematics & BECE Preparation'
        },
        'SCI': {
            'JHS1': 'Introduction to Integrated Science',
            'JHS2': 'Intermediate Integrated Science', 
            'JHS3': 'Advanced Science & BECE Preparation'
        }
    }
    
    created_courses = []
    for subject in subjects:
        for level in levels:
            if subject.code in course_templates and level.code in course_templates[subject.code]:
                title = course_templates[subject.code][level.code]
                slug = slugify(f"{level.code}-{subject.code}")
                
                course, created = Course.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'title': title,
                        'subject': subject,
                        'level': level,
                        'description': f"Comprehensive {subject.name} course for {level.name} students following the Ghana Education Service curriculum.",
                        'difficulty': 'beginner' if level.code == 'JHS1' else 'intermediate' if level.code == 'JHS2' else 'advanced',
                        'duration_hours': 40,
                        'is_published': True,
                        'is_premium': False if level.code == 'JHS1' else True
                    }
                )
                created_courses.append(course)
                status = "✅ Created" if created else "📝 Updated"
                print(f"   {status}: {course.title}")
    
    return created_courses


def link_courses_to_bundles(bundles, courses):
    """Link courses to their respective level bundles"""
    print("\n🔗 Linking Courses to Bundles...")
    
    for bundle, level in bundles:
        # Get courses for this level
        level_courses = [course for course in courses if course.level == level]
        
        # Add courses to bundle
        for course in level_courses:
            bundle.courses.add(course)
        
        print(f"   ✅ Linked {len(level_courses)} courses to {bundle.title}")


def update_existing_data():
    """Update any existing data to align with new structure"""
    print("\n🔄 Updating Existing Data...")
    
    # Update any existing courses that might have old level/subject references
    updated_count = 0
    
    # You can add specific data migration logic here if needed
    # For example, mapping old subject codes to new ones
    
    print(f"   ✅ Updated {updated_count} existing records")


def display_summary(levels, subjects, bundles, courses):
    """Display migration summary"""
    print("\n" + "="*60)
    print("🎉 GHANA JHS FRAMEWORK MIGRATION COMPLETE!")
    print("="*60)
    
    print(f"\n📊 SUMMARY:")
    print(f"   • JHS Levels: {len(levels)}")
    print(f"   • Core Subjects: {len(subjects)}")
    print(f"   • Class Bundles: {len(bundles)}")
    print(f"   • Sample Courses: {len(courses)}")
    
    print(f"\n🏫 JHS LEVELS:")
    for level in levels:
        print(f"   • {level.name} ({level.code})")
    
    print(f"\n📚 CORE SUBJECTS:")
    for subject in subjects:
        print(f"   • {subject.name} ({subject.code})")
    
    print(f"\n🎁 CLASS BUNDLES:")
    for bundle, level in bundles:
        print(f"   • {bundle.title} - GHS {bundle.discounted_price}")
    
    print(f"\n📖 SAMPLE COURSES:")
    for course in courses[:6]:  # Show first 6
        print(f"   • {course.title}")
    if len(courses) > 6:
        print(f"   ... and {len(courses) - 6} more courses")
    
    print(f"\n🚀 NEXT STEPS:")
    print(f"   1. Review the created structure in Django Admin")
    print(f"   2. Add specific lesson content for each course")
    print(f"   3. Create topic-based lessons within each subject")
    print(f"   4. Set up BECE practice materials for JHS 3")
    print(f"   5. Configure payment integration for bundles")


def main():
    """Main migration function"""
    print("GHANA JHS FRAMEWORK MIGRATION")
    print("="*50)
    print("Aligning system with Ghana Junior High School structure...")
    print("Classes: JHS 1, JHS 2, JHS 3")
    print("Core Subjects: English, Mathematics, Science")
    print("="*50)
    
    try:
        # Create JHS levels
        levels = create_jhs_levels()
        
        # Create core subjects  
        subjects = create_core_subjects()
        
        # Create sample courses
        courses = create_sample_courses(levels, subjects)
        
        # Create JHS bundles
        bundles = create_jhs_bundles(levels, subjects)
        
        # Link courses to bundles
        link_courses_to_bundles(bundles, courses)
        
        # Update existing data
        update_existing_data()
        
        # Display summary
        display_summary(levels, subjects, bundles, courses)
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("Migration failed. Please check the error and try again.")
        return False
    
    return True


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)