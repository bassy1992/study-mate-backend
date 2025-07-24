#!/usr/bin/env python
"""
Complete BECE Preparation Bundle Setup
Creates all necessary courses for BECE practice including English, Math, Science, and other subjects
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

def setup_complete_bece_bundle():
    """Setup complete BECE preparation bundle with all subjects"""
    
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
        
        # Complete BECE subjects with colors and icons
        subjects_data = [
            {
                'name': 'English Language',
                'code': 'ENG',
                'course_title': 'BECE English Language Practice',
                'description': 'Master BECE English with comprehension, essay writing, grammar, and literature practice',
                'icon': 'book-open',
                'color': '#3B82F6',
                'duration': 25
            },
            {
                'name': 'Mathematics',
                'code': 'MATH',
                'course_title': 'BECE Mathematics Practice',
                'description': 'Complete BECE Math preparation covering algebra, geometry, statistics, and problem solving',
                'icon': 'calculator',
                'color': '#10B981',
                'duration': 30
            },
            {
                'name': 'Integrated Science',
                'code': 'SCI',
                'course_title': 'BECE Integrated Science Practice',
                'description': 'BECE Science covering physics, chemistry, biology, and environmental science',
                'icon': 'flask',
                'color': '#8B5CF6',
                'duration': 25
            },
            {
                'name': 'Social Studies',
                'code': 'SOCIAL',
                'course_title': 'BECE Social Studies Practice',
                'description': 'Ghana history, geography, government, and social issues for BECE',
                'icon': 'globe',
                'color': '#F59E0B',
                'duration': 20
            },
            {
                'name': 'Religious and Moral Education',
                'code': 'RME',
                'course_title': 'BECE RME Practice',
                'description': 'Religious studies and moral education for BECE preparation',
                'icon': 'heart',
                'color': '#EF4444',
                'duration': 15
            },
            {
                'name': 'Ghanaian Language',
                'code': 'GHLANG',
                'course_title': 'BECE Ghanaian Language Practice',
                'description': 'Local language practice for BECE (Twi, Ga, Ewe, etc.)',
                'icon': 'chat',
                'color': '#06B6D4',
                'duration': 15
            },
            {
                'name': 'French',
                'code': 'FRENCH',
                'course_title': 'BECE French Practice',
                'description': 'French language skills and communication for BECE',
                'icon': 'language',
                'color': '#EC4899',
                'duration': 15
            },
            {
                'name': 'Information Communication Technology',
                'code': 'ICT',
                'course_title': 'BECE ICT Practice',
                'description': 'Computer skills, digital literacy, and ICT concepts for BECE',
                'icon': 'computer',
                'color': '#6366F1',
                'duration': 15
            },
            {
                'name': 'Career Technology',
                'code': 'CAREER',
                'course_title': 'BECE Career Technology Practice',
                'description': 'Technical and vocational skills for BECE preparation',
                'icon': 'tools',
                'color': '#84CC16',
                'duration': 15
            },
            {
                'name': 'Creative Arts',
                'code': 'ARTS',
                'course_title': 'BECE Creative Arts Practice',
                'description': 'Visual arts, music, and creative expression for BECE',
                'icon': 'palette',
                'color': '#F97316',
                'duration': 15
            }
        ]
        
        created_courses = []
        updated_courses = []
        
        for subject_data in subjects_data:
            # Get or create subject
            subject, subject_created = Subject.objects.get_or_create(
                name=subject_data['name'],
                defaults={
                    'code': subject_data['code'],
                    'description': f"{subject_data['name']} for BECE preparation",
                    'icon': subject_data['icon'],
                    'color': subject_data['color']
                }
            )
            
            if subject_created:
                print(f"Created subject: {subject.name}")
            
            # Create course
            course_slug = f"bece-{subject_data['name'].lower().replace(' ', '-').replace('&', 'and')}"
            course, course_created = Course.objects.get_or_create(
                slug=course_slug,
                defaults={
                    'title': subject_data['course_title'],
                    'description': subject_data['description'],
                    'subject': subject,
                    'level': jhs3_level,
                    'duration_hours': subject_data['duration'],
                    'difficulty': 'intermediate',
                    'is_premium': True,
                    'is_published': True,
                }
            )
            
            if course_created:
                print(f"Created course: {course.title}")
                created_courses.append(course)
            else:
                # Update existing course
                course.description = subject_data['description']
                course.duration_hours = subject_data['duration']
                course.save()
                updated_courses.append(course)
                print(f"Updated course: {course.title}")
            
            # Add course to bundle
            if course not in bundle.courses.all():
                bundle.courses.add(course)
                print(f"Added {course.title} to bundle")
        
        bundle.save()
        
        print(f"\n=== BECE PREPARATION BUNDLE SETUP COMPLETE ===")
        print(f"Bundle: {bundle.title}")
        print(f"Total courses: {bundle.courses.count()}")
        print(f"New courses created: {len(created_courses)}")
        print(f"Existing courses updated: {len(updated_courses)}")
        
        print(f"\nCourses in bundle:")
        for course in bundle.courses.all().order_by('subject__name'):
            print(f"- {course.title} ({course.subject.name}) - {course.duration_hours}h")
        
        return bundle
        
    except Bundle.DoesNotExist:
        print("❌ BECE bundle (JHS3) not found. Please run create_bece_preparation_bundle.py first.")
        return None
    except Exception as e:
        print(f"❌ Error setting up BECE bundle: {str(e)}")
        return None

def main():
    """Main function"""
    print("Setting up Complete BECE Preparation Bundle...")
    print("This will create courses for all BECE subjects:")
    print("- English Language")
    print("- Mathematics") 
    print("- Integrated Science")
    print("- Social Studies")
    print("- Religious and Moral Education")
    print("- Ghanaian Language")
    print("- French")
    print("- ICT")
    print("- Career Technology")
    print("- Creative Arts")
    print()
    
    bundle = setup_complete_bece_bundle()
    
    if bundle:
        print(f"\n✅ BECE Preparation Bundle setup successful!")
        print(f"Students can now practice all BECE subjects with past questions and exercises.")
        print(f"Bundle price: ${bundle.discounted_price} (was ${bundle.original_price})")
    else:
        print(f"\n❌ Failed to setup BECE bundle")

if __name__ == '__main__':
    main()