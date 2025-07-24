#!/usr/bin/env python
"""
Script to populate BECE subjects from existing data
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from bece.models import BECESubject

def populate_bece_subjects():
    """Populate BECE subjects"""
    
    print("📚 Populating BECE Subjects")
    print("=" * 40)
    
    # Check existing subjects
    existing_count = BECESubject.objects.count()
    print(f"📊 Existing BECE subjects: {existing_count}")
    
    if existing_count > 0:
        print("⚠️  BECE subjects already exist:")
        for subject in BECESubject.objects.all():
            print(f"   • {subject.display_name} ({subject.name})")
        return
    
    # Create BECE subjects
    subjects_data = [
        {
            'name': 'mathematics',
            'display_name': 'Mathematics',
            'description': 'BECE Mathematics past questions and practice tests',
            'icon': 'calculator',
            'is_core': True,
            'is_active': True
        },
        {
            'name': 'english_language',
            'display_name': 'English Language',
            'description': 'BECE English Language past questions and practice tests',
            'icon': 'book-open',
            'is_core': True,
            'is_active': True
        },
        {
            'name': 'integrated_science',
            'display_name': 'Integrated Science',
            'description': 'BECE Integrated Science past questions and practice tests',
            'icon': 'microscope',
            'is_core': True,
            'is_active': True
        },
        {
            'name': 'social_studies',
            'display_name': 'Social Studies',
            'description': 'BECE Social Studies past questions and practice tests',
            'icon': 'globe',
            'is_core': True,
            'is_active': True
        },
        {
            'name': 'religious_moral_education',
            'display_name': 'Religious and Moral Education',
            'description': 'BECE Religious and Moral Education past questions and practice tests',
            'icon': 'heart',
            'is_core': False,
            'is_active': True
        },
        {
            'name': 'ghanaian_language',
            'display_name': 'Ghanaian Language',
            'description': 'BECE Ghanaian Language past questions and practice tests',
            'icon': 'language',
            'is_core': False,
            'is_active': True
        }
    ]
    
    created_subjects = []
    for subject_data in subjects_data:
        subject, created = BECESubject.objects.get_or_create(
            name=subject_data['name'],
            defaults=subject_data
        )
        
        if created:
            created_subjects.append(subject)
            status = "🔥 CORE" if subject.is_core else "📚 ELECTIVE"
            print(f"✅ Created: {subject.display_name} ({subject.name}) - {status}")
        else:
            print(f"⚠️  Already exists: {subject.display_name}")
    
    print(f"\n🎉 Successfully created {len(created_subjects)} BECE subjects!")
    print(f"📊 Total BECE subjects: {BECESubject.objects.count()}")
    
    return created_subjects

if __name__ == '__main__':
    populate_bece_subjects()