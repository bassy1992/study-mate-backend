#!/usr/bin/env python
"""
Script to create the BECE bundle for JHS 3 students
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
from courses.models import Subject, Level

def create_bece_bundle():
    """Create the BECE preparation bundle"""
    
    # Get or create JHS 3 level
    jhs3_level, created = Level.objects.get_or_create(
        code='JHS3',
        defaults={
            'name': 'Junior High School 3',
            'description': 'Final year of Junior High School - BECE preparation',
            'order': 3,
            'is_active': True
        }
    )
    if created:
        print(f"Created level: {jhs3_level.name}")
    
    # Get core subjects for BECE
    core_subjects = ['English Language', 'Mathematics', 'Integrated Science']
    subjects = []
    
    for subject_name in core_subjects:
        subject, created = Subject.objects.get_or_create(
            name=subject_name,
            defaults={
                'code': subject_name.replace(' ', '').upper()[:10],
                'description': f'{subject_name} for BECE preparation',
                'icon': 'book-open',
                'color': '#3B82F6'
            }
        )
        subjects.append(subject)
        if created:
            print(f"Created subject: {subject.name}")
    
    # Create the BECE bundle
    bundle, created = Bundle.objects.get_or_create(
        slug='JHS3',
        defaults={
            'title': 'BECE Preparation Bundle',
            'description': 'Complete BECE preparation with past questions, practice tests, and comprehensive study materials for English Language, Mathematics, and Integrated Science.',
            'bundle_type': 'bece_prep',
            'original_price': Decimal('25.00'),
            'discounted_price': Decimal('15.00'),
            'discount_percentage': 40,
            'is_featured': True,
            'is_active': True,
        }
    )
    
    if created:
        print(f"Created bundle: {bundle.title}")
        print(f"Bundle slug: {bundle.slug}")
        print(f"Price: ${bundle.discounted_price} (was ${bundle.original_price})")
    else:
        print(f"Bundle already exists: {bundle.title}")
    
    return bundle

def main():
    """Main function to create BECE bundle"""
    print("Creating BECE bundle...")
    
    bundle = create_bece_bundle()
    
    print(f"\nBECE Bundle created successfully!")
    print(f"- Title: {bundle.title}")
    print(f"- Slug: {bundle.slug}")
    print(f"- Price: ${bundle.discounted_price}")
    print(f"- Type: {bundle.bundle_type}")
    print(f"- Active: {bundle.is_active}")
    
    # Print all available bundles
    print(f"\nAll available bundles:")
    for b in Bundle.objects.all():
        print(f"- {b.slug}: {b.title} (${b.discounted_price})")

if __name__ == '__main__':
    main()