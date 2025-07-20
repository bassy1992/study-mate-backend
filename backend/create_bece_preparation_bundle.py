#!/usr/bin/env python
"""
Script to create the BECE Preparation Bundle that loads only questions (not videos)
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

def create_bece_preparation_bundle():
    """Create the BECE Preparation Bundle for questions only"""
    
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
    
    # Create the BECE Preparation Bundle
    bundle, created = Bundle.objects.get_or_create(
        slug='JHS3',
        defaults={
            'title': 'BECE Preparation Bundle',
            'description': 'Complete BECE preparation with past questions and practice tests for English Language, Mathematics, and Integrated Science. Access authentic BECE past questions from 2015-2024 with detailed solutions and explanations.',
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
        print(f"Type: {bundle.bundle_type}")
        print(f"Description: {bundle.description}")
    else:
        # Update existing bundle to ensure correct details
        bundle.title = 'BECE Preparation Bundle'
        bundle.description = 'Complete BECE preparation with past questions and practice tests for English Language, Mathematics, and Integrated Science. Access authentic BECE past questions from 2015-2024 with detailed solutions and explanations.'
        bundle.bundle_type = 'bece_prep'
        bundle.original_price = Decimal('25.00')
        bundle.discounted_price = Decimal('15.00')
        bundle.discount_percentage = 40
        bundle.is_featured = True
        bundle.is_active = True
        bundle.save()
        print(f"Updated existing bundle: {bundle.title}")
    
    return bundle

def main():
    """Main function to create BECE Preparation Bundle"""
    print("Creating BECE Preparation Bundle (Questions Only)...")
    
    bundle = create_bece_preparation_bundle()
    
    print(f"\nBECE Preparation Bundle created successfully!")
    print(f"- Title: {bundle.title}")
    print(f"- Slug: {bundle.slug}")
    print(f"- Price: ${bundle.discounted_price}")
    print(f"- Type: {bundle.bundle_type}")
    print(f"- Active: {bundle.is_active}")
    print(f"- Focus: Past Questions and Practice Tests (No Videos)")
    
    # Print all available bundles
    print(f"\nAll available bundles:")
    for b in Bundle.objects.all():
        print(f"- {b.slug}: {b.title} (${b.discounted_price})")

if __name__ == '__main__':
    main()