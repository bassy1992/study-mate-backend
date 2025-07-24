#!/usr/bin/env python
"""
Check paper types and question distribution
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from bece.models import BECEPaper

def check_papers():
    papers = BECEPaper.objects.all()
    
    print("=== Paper Analysis ===")
    print(f"Total papers: {papers.count()}")
    
    essay_only = 0
    mc_only = 0
    mixed = 0
    
    for paper in papers:
        mc_count = paper.questions.filter(question_type='multiple_choice').count()
        essay_count = paper.questions.filter(question_type='essay').count()
        
        if mc_count > 0 and essay_count > 0:
            mixed += 1
            print(f"MIXED: {paper.title} - MC: {mc_count}, Essay: {essay_count}")
        elif essay_count > 0:
            essay_only += 1
        elif mc_count > 0:
            mc_only += 1
    
    print(f"\nSummary:")
    print(f"Essay only: {essay_only}")
    print(f"Multiple choice only: {mc_only}")
    print(f"Mixed papers: {mixed}")

if __name__ == '__main__':
    check_papers()