#!/usr/bin/env python
"""
Script to add courses to the BECE bundle to fix the BundleSubjects API
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course, Subject, Level
from ecommerce.models import Bundle

def add_courses_to_bece_bundle():
    """Add courses to the BECE bundle"""
    
    try:
        # Get the BECE bundle
        bundle = Bundle.objects.get(slug='JHS3')
        print(f"Found bundle: {bundle.title}")
        
        # Get or create JHS3 level
        jhs3_level, _ = Level.objects.get_or_create(
            code='JHS3',
            defaults={
                'name': 'Junior High School 3',
                'description': 'Final year of Junior High School - BECE preparation',
                'order': 3,
                'is_active': True
            }
        )
        
        # Core subjects for BECE
        subjects_data = [
            ('English Language', 'BECE English Language Practice'),
            ('Mathematics', 'BECE Mathematics Practice'),
            ('Integrated Science', 'BECE Integrated Science Practice'),
            ('Social Studies', 'BECE Social Studies Practice'),
            ('Religious and Moral Education', 'BECE RME Practice'),
            ('Ghanaian Language', 'BECE Ghanaian Language Practice'),
            ('French', 'BECE French Practice'),
            ('Information Communication Technology', 'BECE ICT Practice'),
            ('Career Technology', 'BECE Career Technology Practice'),
            ('Creative Arts', 'BECE Creative Arts Practice')
        ]
        
        created_courses = []
        
        for subject_name, course_title in subjects_data:
            # Get or create subject
            subject, _ = Subject.objects.get_or_create(
                name=subject_name,
                defaults={
                    'code': subject_name.replace(' ', '').upper()[:10],
                    'description': f'{subject_name} for BECE preparation',
                    'icon': 'book-open',
                    'color': '#3B82F6'
                }
            )
            
            # Create course
            course_slug = f"bece-{subject_name.lower().replace(' ', '-')}"
            course, created = Course.objects.get_or_create(
                slug=course_slug,
                defaults={
                    'title': course_title,
                    'description': f'Practice BECE {subject_name} with past questions and interactive exercises.',
                    'subject': subject,
                    'level': jhs3_level,
                    'duration_hours': 20,
                    'difficulty': 'intermediate',
                    'is_premium': True,
                    'is_published': True,
                }
            )
            
            if created:
                print(f"Created course: {course.title}")
                created_courses.append(course)
            else:
                print(f"Course already exists: {course.title}")
            
            # Add course to bundle
            if course not in bundle.courses.all():
                bundle.courses.add(course)
                print(f"Added {course.title} to bundle")
        
        bundle.save()
        print(f"\nBundle now has {bundle.courses.count()} courses")
        
        return bundle
        
    except Bundle.DoesNotExist:
        print("BECE bundle (JHS3) not found. Please run create_bece_preparation_bundle.py first.")
        return None

def main():
    """Main function"""
    print("Adding courses to BECE bundle...")
    
    bundle = add_courses_to_bece_bundle()
    
    if bundle:
        print(f"\n✅ Successfully updated BECE bundle!")
        print(f"Bundle: {bundle.title}")
        print(f"Courses: {bundle.courses.count()}")
        
        for course in bundle.courses.all():
            print(f"- {course.title} ({course.subject.name})")
    else:
        print(f"\n❌ Failed to update BECE bundle")

if __name__ == '__main__':
    main()