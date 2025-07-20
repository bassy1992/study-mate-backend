#!/usr/bin/env python
"""
Script to create sample bundles for the BECE platform
Run this script to populate the database with sample course bundles
"""

import os
import sys
import django
from decimal import Decimal

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from ecommerce.models import Bundle
from courses.models import Subject, Level, Course


def create_sample_bundles():
    """Create sample course bundles"""
    
    # Create subjects if they don't exist
    subjects_data = [
        {'name': 'English Language', 'code': 'ENG', 'description': 'English Language and Literature'},
        {'name': 'Mathematics', 'code': 'MATH', 'description': 'Core Mathematics'},
        {'name': 'Integrated Science', 'code': 'SCI', 'description': 'Integrated Science covering Biology, Chemistry, and Physics'},
    ]
    
    subjects = {}
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            name=subject_data['name'],
            defaults={
                'code': subject_data['code'],
                'description': subject_data['description']
            }
        )
        subjects[subject_data['name']] = subject
        if created:
            print(f"Created subject: {subject.name}")
    
    # Create levels if they don't exist
    levels_data = [
        {'name': 'JHS 1', 'code': 'JHS1', 'description': 'Junior High School Level 1'},
        {'name': 'JHS 2', 'code': 'JHS2', 'description': 'Junior High School Level 2'},
        {'name': 'JHS 3', 'code': 'JHS3', 'description': 'Junior High School Level 3'},
    ]
    
    levels = {}
    for level_data in levels_data:
        level, created = Level.objects.get_or_create(
            name=level_data['name'],
            defaults={
                'code': level_data['code'],
                'description': level_data['description']
            }
        )
        levels[level_data['name']] = level
        if created:
            print(f"Created level: {level.name}")
    
    # Create sample courses for each level and subject
    courses = {}
    for level_name, level in levels.items():
        courses[level_name] = {}
        for subject_name, subject in subjects.items():
            course, created = Course.objects.get_or_create(
                title=f"{level_name} {subject_name}",
                defaults={
                    'slug': f"{level_name.lower().replace(' ', '-')}-{subject_name.lower().replace(' ', '-')}",
                    'description': f"Comprehensive {subject_name} course for {level_name} students",
                    'level': level,
                    'subject': subject,
                    'is_published': True
                }
            )
            courses[level_name][subject_name] = course
            if created:
                print(f"Created course: {course.title}")
    
    # Create bundles
    bundles_data = [
        {
            'title': 'JHS 1 Foundation Bundle',
            'slug': 'jhs1-foundation',
            'description': 'Foundation level courses for first-year JHS students covering all core subjects',
            'bundle_type': 'level',
            'original_price': Decimal('20.00'),
            'discounted_price': Decimal('15.00'),
            'is_featured': False,
            'level': 'JHS 1'
        },
        {
            'title': 'JHS 2 Intermediate Bundle',
            'slug': 'jhs2-intermediate',
            'description': 'Intermediate courses building on JHS 1 foundation with advanced concepts',
            'bundle_type': 'level',
            'original_price': Decimal('25.00'),
            'discounted_price': Decimal('15.00'),
            'is_featured': True,
            'level': 'JHS 2'
        },
        {
            'title': 'JHS 3 BECE Preparation Bundle',
            'slug': 'jhs3-bece-prep',
            'description': 'Complete BECE exam preparation with past questions, mock tests, and comprehensive review',
            'bundle_type': 'bece_prep',
            'original_price': Decimal('30.00'),
            'discounted_price': Decimal('15.00'),
            'is_featured': False,
            'level': 'JHS 3'
        },
    ]
    
    for bundle_data in bundles_data:
        level_name = bundle_data.pop('level')
        bundle, created = Bundle.objects.get_or_create(
            slug=bundle_data['slug'],
            defaults=bundle_data
        )
        
        if created:
            # Add courses to the bundle
            level_courses = courses.get(level_name, {})
            for course in level_courses.values():
                bundle.courses.add(course)
            
            print(f"Created bundle: {bundle.title} with {bundle.courses.count()} courses")
        else:
            print(f"Bundle already exists: {bundle.title}")
    
    print("\nSample bundles created successfully!")
    print("You can now view them at: http://127.0.0.1:8000/api/ecommerce/bundles/")


if __name__ == '__main__':
    create_sample_bundles()