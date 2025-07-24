#!/usr/bin/env python
"""
Check JHS 1 bundle purchases and available subjects
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from ecommerce.models import Bundle, UserPurchase
from django.contrib.auth import get_user_model

User = get_user_model()

def check_jhs1_purchases():
    print("=== JHS 1 Bundle Purchase Check ===\n")
    
    # Check if there are any users with JHS 1 bundle purchases
    jhs1_bundle = Bundle.objects.get(slug='jhs-1-bundle-description')
    purchases = UserPurchase.objects.filter(bundle=jhs1_bundle, is_active=True)
    
    print(f'JHS 1 Bundle purchases: {purchases.count()}')
    
    if purchases.exists():
        for purchase in purchases:
            print(f'User: {purchase.user.email}')
            print(f'Purchased: {purchase.purchased_at}')
            print(f'Active: {purchase.is_active}')
            
            # Test the bundle subjects API logic
            from collections import defaultdict
            subjects_data = defaultdict(lambda: {'courses': [], 'course_count': 0})
            
            for course in purchase.bundle.courses.all():
                subject = course.subject
                subject_key = subject.id
                
                if subject_key not in subjects_data:
                    subjects_data[subject_key] = {
                        'id': subject.id,
                        'name': subject.name,
                        'code': subject.code,
                        'description': subject.description,
                        'icon': subject.icon,
                        'color': subject.color,
                        'courses': [],
                        'course_count': 0
                    }
                
                subjects_data[subject_key]['course_count'] += 1
            
            print(f'Available subjects: {len(subjects_data)}')
            for subject_data in subjects_data.values():
                print(f'  - {subject_data["name"]} ({subject_data["course_count"]} courses)')
    else:
        print('No active purchases found for JHS 1 bundle')
        
        # Check all user purchases
        print('\nAll user purchases:')
        all_purchases = UserPurchase.objects.all()
        for purchase in all_purchases:
            print(f'  - {purchase.user.email}: {purchase.bundle.title} (Active: {purchase.is_active})')

if __name__ == '__main__':
    check_jhs1_purchases()