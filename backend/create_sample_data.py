#!/usr/bin/env python
"""
Create comprehensive sample data for the BECE Platform
Run this script after setting up the database
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Subject, Level, Course, Lesson, Quiz, Question, Answer
from bece.models import BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer
from ecommerce.models import PricingTier, Bundle, FAQ

User = get_user_model()

def create_pricing_tiers():
    """Create pricing tiers"""
    tiers = [
        {
            'name': 'Free',
            'tier_type': 'free',
            'description': 'Basic access to limited content',
            'price_monthly': 0.00,
            'price_yearly': 0.00,
            'features': ['Limited course access', 'Basic quizzes', 'Progress tracking'],
            'max_courses': 2,
            'max_quiz_attempts': 3,
            'has_bece_access': False,
        },
        {
            'name': 'Premium',
            'tier_type': 'premium',
            'description': 'Full access to all content and BECE preparation',
            'price_monthly': 29.99,
            'price_yearly': 299.99,
            'features': ['All courses', 'BECE practice tests', 'Unlimited quizzes', 'Progress analytics', 'Certificates'],
            'max_courses': 0,  # Unlimited
            'max_quiz_attempts': 0,  # Unlimited
            'has_bece_access': True,
            'has_certificates': True,
        }
    ]
    
    for tier_data in tiers:
        tier, created = PricingTier.objects.get_or_create(
            tier_type=tier_data['tier_type'],
            defaults=tier_data
        )
        if created:
            print(f'✅ Created pricing tier: {tier.name}')

def create_bece_subjects():
    """Create BECE subjects"""
    subjects = [
        {
            'name': 'mathematics',
            'display_name': 'Mathematics',
            'description': 'BECE Mathematics preparation',
            'is_core': True,
        },
        {
            'name': 'english_language',
            'display_name': 'English Language',
            'description': 'BECE English Language preparation',
            'is_core': True,
        },
        {
            'name': 'integrated_science',
            'display_name': 'Integrated Science',
            'description': 'BECE Integrated Science preparation',
            'is_core': True,
        },
        {
            'name': 'social_studies',
            'display_name': 'Social Studies',
            'description': 'BECE Social Studies preparation',
            'is_core': True,
        }
    ]
    
    for subject_data in subjects:
        subject, created = BECESubject.objects.get_or_create(
            name=subject_data['name'],
            defaults=subject_data
        )
        if created:
            print(f'✅ Created BECE subject: {subject.display_name}')

def create_bece_years():
    """Create BECE years"""
    years = [2020, 2021, 2022, 2023, 2024]
    
    for year in years:
        bece_year, created = BECEYear.objects.get_or_create(
            year=year,
            defaults={'is_available': True}
        )
        if created:
            print(f'✅ Created BECE year: {year}')

def create_sample_lessons():
    """Create sample lessons for courses"""
    try:
        math_course = Course.objects.get(slug='jhs3-mathematics')
        
        lessons_data = [
            {
                'title': 'Introduction to Algebra',
                'slug': 'intro-algebra',
                'description': 'Basic algebraic concepts and operations',
                'lesson_type': 'text',
                'order': 1,
                'duration_minutes': 45,
                'is_free': True,
                'is_published': True,
            },
            {
                'title': 'Solving Linear Equations',
                'slug': 'linear-equations',
                'description': 'Methods for solving linear equations',
                'lesson_type': 'video',
                'order': 2,
                'duration_minutes': 60,
                'is_published': True,
            },
            {
                'title': 'Quadratic Equations',
                'slug': 'quadratic-equations',
                'description': 'Understanding and solving quadratic equations',
                'lesson_type': 'interactive',
                'order': 3,
                'duration_minutes': 75,
                'is_published': True,
            }
        ]
        
        for lesson_data in lessons_data:
            lesson_data['course'] = math_course
            lesson, created = Lesson.objects.get_or_create(
                slug=lesson_data['slug'],
                course=math_course,
                defaults=lesson_data
            )
            if created:
                print(f'✅ Created lesson: {lesson.title}')
                
    except Course.DoesNotExist:
        print('⚠️  JHS3 Mathematics course not found. Run populate_data first.')

def create_sample_quiz():
    """Create a sample quiz"""
    try:
        math_subject = Subject.objects.get(code='MATH')
        
        quiz_data = {
            'title': 'JHS 3 Mathematics Practice Quiz',
            'slug': 'jhs3-math-practice',
            'description': 'Practice quiz for JHS 3 Mathematics',
            'subject': math_subject,
            'quiz_type': 'practice',
            'time_limit_minutes': 20,
            'passing_score': 70,
            'max_attempts': 3,
            'is_published': True,
        }
        
        quiz, created = Quiz.objects.get_or_create(
            slug=quiz_data['slug'],
            defaults=quiz_data
        )
        
        if created:
            print(f'✅ Created quiz: {quiz.title}')
            
            # Create sample questions
            questions_data = [
                {
                    'question_text': 'What is 2 + 2?',
                    'question_type': 'multiple_choice',
                    'points': 1,
                    'order': 1,
                    'answers': [
                        {'answer_text': '3', 'is_correct': False},
                        {'answer_text': '4', 'is_correct': True},
                        {'answer_text': '5', 'is_correct': False},
                        {'answer_text': '6', 'is_correct': False},
                    ]
                },
                {
                    'question_text': 'Solve for x: 2x + 4 = 10',
                    'question_type': 'multiple_choice',
                    'points': 2,
                    'order': 2,
                    'answers': [
                        {'answer_text': 'x = 2', 'is_correct': False},
                        {'answer_text': 'x = 3', 'is_correct': True},
                        {'answer_text': 'x = 4', 'is_correct': False},
                        {'answer_text': 'x = 5', 'is_correct': False},
                    ]
                }
            ]
            
            for q_data in questions_data:
                answers_data = q_data.pop('answers')
                q_data['quiz'] = quiz
                
                question, q_created = Question.objects.get_or_create(
                    quiz=quiz,
                    order=q_data['order'],
                    defaults=q_data
                )
                
                if q_created:
                    print(f'  ✅ Created question: {question.question_text[:30]}...')
                    
                    for i, a_data in enumerate(answers_data):
                        a_data['question'] = question
                        a_data['order'] = i + 1
                        
                        answer, a_created = Answer.objects.get_or_create(
                            question=question,
                            order=a_data['order'],
                            defaults=a_data
                        )
                        
                        if a_created:
                            print(f'    ✅ Created answer: {answer.answer_text}')
                            
    except Subject.DoesNotExist:
        print('⚠️  Mathematics subject not found. Run populate_data first.')

def create_bundles():
    """Create course bundles"""
    try:
        # Get courses
        courses = Course.objects.filter(is_published=True)
        
        if courses.exists():
            bundle_data = {
                'title': 'JHS Mathematics Complete Bundle',
                'slug': 'jhs-math-complete',
                'description': 'Complete mathematics preparation for JHS students',
                'bundle_type': 'subject',
                'original_price': 99.99,
                'discounted_price': 79.99,
                'is_featured': True,
                'is_active': True,
            }
            
            bundle, created = Bundle.objects.get_or_create(
                slug=bundle_data['slug'],
                defaults=bundle_data
            )
            
            if created:
                bundle.courses.set(courses)
                print(f'✅ Created bundle: {bundle.title}')
            
    except Exception as e:
        print(f'⚠️  Error creating bundles: {e}')

def create_faqs():
    """Create sample FAQs"""
    faqs_data = [
        {
            'question': 'How do I access BECE practice tests?',
            'answer': 'BECE practice tests are available with a Premium subscription. Sign up for Premium to access all past papers and practice materials.',
            'category': 'bece',
            'order': 1,
            'is_featured': True,
        },
        {
            'question': 'Can I track my progress?',
            'answer': 'Yes! The platform provides detailed progress tracking for all courses, lessons, and practice tests. View your dashboard to see your learning analytics.',
            'category': 'general',
            'order': 2,
            'is_featured': True,
        },
        {
            'question': 'What payment methods do you accept?',
            'answer': 'We accept credit/debit cards, mobile money, and bank transfers. All payments are processed securely.',
            'category': 'payment',
            'order': 3,
        },
        {
            'question': 'How long do I have access to purchased content?',
            'answer': 'Once you purchase a bundle, you have lifetime access to the content. Premium subscriptions are valid for the subscription period.',
            'category': 'courses',
            'order': 4,
        }
    ]
    
    for faq_data in faqs_data:
        faq, created = FAQ.objects.get_or_create(
            question=faq_data['question'],
            defaults=faq_data
        )
        if created:
            print(f'✅ Created FAQ: {faq.question[:50]}...')

def main():
    print('🚀 Creating comprehensive sample data for BECE Platform')
    print('=' * 60)
    
    create_pricing_tiers()
    create_bece_subjects()
    create_bece_years()
    create_sample_lessons()
    create_sample_quiz()
    create_bundles()
    create_faqs()
    
    print('\n🎉 Sample data creation completed!')
    print('\nNext steps:')
    print('1. Start the server: python manage.py runserver')
    print('2. Test the API: python test_api.py')
    print('3. Access admin: http://127.0.0.1:8000/admin/')
    print('4. View API docs: http://127.0.0.1:8000/api/')

if __name__ == '__main__':
    main()