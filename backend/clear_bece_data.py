#!/usr/bin/env python
"""
Script to clear existing BECE data before recreating with year-specific questions
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from bece.models import (
    BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer, 
    BECEPracticeAttempt, BECEUserAnswer, BECEStatistics
)

def clear_bece_data():
    """Clear all BECE data"""
    print("Clearing existing BECE data...")
    
    # Clear in reverse dependency order
    print("- Clearing user answers...")
    BECEUserAnswer.objects.all().delete()
    
    print("- Clearing practice attempts...")
    BECEPracticeAttempt.objects.all().delete()
    
    print("- Clearing statistics...")
    BECEStatistics.objects.all().delete()
    
    print("- Clearing answers...")
    BECEAnswer.objects.all().delete()
    
    print("- Clearing questions...")
    BECEQuestion.objects.all().delete()
    
    print("- Clearing papers...")
    BECEPaper.objects.all().delete()
    
    print("- Clearing years...")
    BECEYear.objects.all().delete()
    
    print("- Clearing subjects...")
    BECESubject.objects.all().delete()
    
    print("BECE data cleared successfully!")

if __name__ == '__main__':
    clear_bece_data()