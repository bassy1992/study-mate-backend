#!/usr/bin/env python
"""
Script to verify loaded essay questions
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from bece.models import BECESubject, BECEYear, BECEPaper, BECEQuestion

def verify_essay_questions():
    """Verify the loaded essay questions"""
    print("=== BECE Essay Questions Verification ===\n")
    
    # Get all essay papers
    essay_papers = BECEPaper.objects.filter(paper_type='paper2').order_by('subject__display_name', '-year__year')
    
    for paper in essay_papers:
        print(f"📄 {paper.title}")
        print(f"   Duration: {paper.duration_minutes} minutes | Total Marks: {paper.total_marks}")
        
        questions = paper.questions.filter(question_type='essay').order_by('question_number')
        
        for question in questions:
            print(f"\n   Q{question.question_number}. {question.question_text[:80]}...")
            print(f"   Topic: {question.topic} | Marks: {question.marks}")
            if question.word_limit:
                print(f"   Word Limit: {question.word_limit} words")
            if question.time_limit_minutes:
                print(f"   Time Limit: {question.time_limit_minutes} minutes")
            
            # Show part of instructions
            if question.essay_instructions:
                instructions_preview = question.essay_instructions.strip().split('\n')[0:3]
                print(f"   Instructions: {instructions_preview[0][:60]}...")
        
        print("\n" + "="*80 + "\n")

def show_summary_stats():
    """Show summary statistics"""
    print("=== Summary Statistics ===")
    
    total_papers = BECEPaper.objects.filter(paper_type='paper2').count()
    total_questions = BECEQuestion.objects.filter(question_type='essay').count()
    
    print(f"Total Essay Papers: {total_papers}")
    print(f"Total Essay Questions: {total_questions}")
    
    print("\nBy Subject:")
    for subject in BECESubject.objects.all():
        papers = BECEPaper.objects.filter(subject=subject, paper_type='paper2').count()
        questions = BECEQuestion.objects.filter(paper__subject=subject, question_type='essay').count()
        if papers > 0:
            print(f"  {subject.display_name}: {papers} papers, {questions} questions")
    
    print("\nBy Year:")
    for year in BECEYear.objects.order_by('-year'):
        papers = BECEPaper.objects.filter(year=year, paper_type='paper2').count()
        if papers > 0:
            print(f"  {year.year}: {papers} papers")
    
    print("\nQuestion Types Distribution:")
    question_types = BECEQuestion.objects.values('question_type').distinct()
    for qt in question_types:
        count = BECEQuestion.objects.filter(question_type=qt['question_type']).count()
        print(f"  {qt['question_type'].title()}: {count} questions")

def show_sample_question():
    """Show a detailed sample question"""
    print("\n=== Sample Essay Question ===")
    
    sample_question = BECEQuestion.objects.filter(question_type='essay').first()
    if sample_question:
        print(f"Subject: {sample_question.paper.subject.display_name}")
        print(f"Year: {sample_question.paper.year.year}")
        print(f"Paper: {sample_question.paper.title}")
        print(f"\nQuestion {sample_question.question_number}:")
        print(f"{sample_question.question_text}")
        print(f"\nTopic: {sample_question.topic}")
        print(f"Marks: {sample_question.marks}")
        print(f"Difficulty: {sample_question.difficulty_level}")
        
        if sample_question.word_limit:
            print(f"Word Limit: {sample_question.word_limit}")
        if sample_question.time_limit_minutes:
            print(f"Time Limit: {sample_question.time_limit_minutes} minutes")
        
        if sample_question.essay_instructions:
            print(f"\nInstructions:")
            print(sample_question.essay_instructions)
        
        if sample_question.explanation:
            print(f"\nMarking Guide/Explanation:")
            print(sample_question.explanation)

if __name__ == '__main__':
    show_summary_stats()
    print("\n" + "="*80)
    show_sample_question()
    print("\n" + "="*80)
    
    # Ask if user wants to see all questions
    response = input("\nDo you want to see all essay questions? (y/n): ").lower()
    if response == 'y':
        verify_essay_questions()