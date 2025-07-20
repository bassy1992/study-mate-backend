#!/usr/bin/env python
"""
Script to create sample BECE data for testing the practice pages
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from bece.models import (
    BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer
)

def create_bece_subjects():
    """Create BECE subjects"""
    subjects_data = [
        {
            'name': 'mathematics',
            'display_name': 'Mathematics',
            'description': 'BECE Mathematics past questions and practice tests',
            'icon': 'calculator',
            'is_core': True,
        },
        {
            'name': 'english_language',
            'display_name': 'English Language',
            'description': 'BECE English Language past questions and practice tests',
            'icon': 'book-open',
            'is_core': True,
        },
        {
            'name': 'integrated_science',
            'display_name': 'Integrated Science',
            'description': 'BECE Integrated Science past questions and practice tests',
            'icon': 'microscope',
            'is_core': True,
        },
        {
            'name': 'social_studies',
            'display_name': 'Social Studies',
            'description': 'BECE Social Studies past questions and practice tests',
            'icon': 'globe',
            'is_core': True,
        },
    ]
    
    for subject_data in subjects_data:
        subject, created = BECESubject.objects.get_or_create(
            name=subject_data['name'],
            defaults=subject_data
        )
        if created:
            print(f"Created subject: {subject.display_name}")
        else:
            print(f"Subject already exists: {subject.display_name}")

def create_bece_years():
    """Create BECE years"""
    years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]
    
    for year in years:
        year_obj, created = BECEYear.objects.get_or_create(
            year=year,
            defaults={'is_available': True}
        )
        if created:
            print(f"Created year: {year}")
        else:
            print(f"Year already exists: {year}")

def get_year_specific_questions(subject_name, year):
    """Generate year-specific questions for each subject"""
    
    if subject_name == 'mathematics':
        base_questions = [
            {
                'question_text': f'If {2 + year % 5}x + {5 + year % 10} = {20 + year % 15}, find the value of x.',
                'topic': 'Algebraic Equations',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'x = {year % 10}', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': f'x = {(20 + year % 15 - 5 - year % 10) // (2 + year % 5)}', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f'x = {year % 8}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'x = {year % 12}', 'is_correct': False},
                ]
            },
            {
                'question_text': f'What is the area of a rectangle with length {10 + year % 8} cm and width {6 + year % 6} cm?',
                'topic': 'Mensuration',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{(10 + year % 8) + (6 + year % 6)} cm²', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': f'{(10 + year % 8) * (6 + year % 6)} cm²', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f'{(10 + year % 8) * 2} cm²', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{(6 + year % 6) * 2} cm²', 'is_correct': False},
                ]
            },
            {
                'question_text': f'Simplify: {year % 3 + 1}/{year % 4 + 2} + 1/{year % 5 + 3}',
                'topic': 'Fractions',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{year % 6 + 2}/{year % 8 + 4}', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': f'{((year % 3 + 1) * (year % 5 + 3) + (year % 4 + 2)) // ((year % 4 + 2) * (year % 5 + 3))}/{(year % 4 + 2) * (year % 5 + 3)}', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f'{year % 4 + 1}/{year % 6 + 2}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{year % 5 + 2}/{year % 7 + 3}', 'is_correct': False},
                ]
            },
            {
                'question_text': f'What is {10 + year % 10}% of {100 + year % 100}?',
                'topic': 'Percentages',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{year % 20 + 10}', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': f'{((10 + year % 10) * (100 + year % 100)) // 100}', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f'{year % 30 + 15}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{year % 25 + 20}', 'is_correct': False},
                ]
            },
            {
                'question_text': f'Find the perimeter of a square with side length {5 + year % 8} cm.',
                'topic': 'Mensuration',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{(5 + year % 8) * 4} cm', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': f'{(5 + year % 8) * 2} cm', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': f'{(5 + year % 8) ** 2} cm', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{5 + year % 8} cm', 'is_correct': False},
                ]
            },
        ]
    elif subject_name == 'english_language':
        pronouns = ['he', 'she', 'they', 'we', 'I']
        verbs = ['runs', 'walks', 'reads', 'writes', 'sings']
        adjectives = ['beautiful', 'intelligent', 'creative', 'honest', 'brave']
        
        base_questions = [
            {
                'question_text': f"Choose the correct form: '{pronouns[year % len(pronouns)].title()} _____ every morning.'",
                'topic': 'Grammar',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{verbs[year % len(verbs)]}', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': f'{verbs[year % len(verbs)][:-1]}', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': f'{verbs[year % len(verbs)]}ing', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{verbs[year % len(verbs)]}ed', 'is_correct': False},
                ]
            },
            {
                'question_text': f"Which word is an antonym of '{adjectives[year % len(adjectives)]}'?",
                'topic': 'Vocabulary',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{adjectives[(year + 1) % len(adjectives)]}', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': 'ugly' if adjectives[year % len(adjectives)] == 'beautiful' else 'stupid', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f'{adjectives[(year + 2) % len(adjectives)]}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{adjectives[(year + 3) % len(adjectives)]}', 'is_correct': False},
                ]
            },
            {
                'question_text': f"Complete the sentence: 'The {adjectives[year % len(adjectives)]} student _____ the exam.'",
                'topic': 'Grammar',
                'answers': [
                    {'option_letter': 'A', 'answer_text': 'pass', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': 'passed', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': 'passing', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': 'passes', 'is_correct': False},
                ]
            },
            {
                'question_text': f"What is the plural of '{['child', 'mouse', 'foot', 'tooth', 'goose'][year % 5]}'?",
                'topic': 'Grammar',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f"{['child', 'mouse', 'foot', 'tooth', 'goose'][year % 5]}s", 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': ['children', 'mice', 'feet', 'teeth', 'geese'][year % 5], 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f"{['child', 'mouse', 'foot', 'tooth', 'goose'][year % 5]}es", 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': ['child', 'mouse', 'foot', 'tooth', 'goose'][year % 5], 'is_correct': False},
                ]
            },
            {
                'question_text': f"Choose the correct punctuation: 'What time is it{['?', '.', '!', ','][year % 4]}'",
                'topic': 'Punctuation',
                'answers': [
                    {'option_letter': 'A', 'answer_text': '?', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': '.', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': '!', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': ',', 'is_correct': False},
                ]
            },
        ]
    else:  # integrated_science
        elements = ['Oxygen', 'Carbon', 'Nitrogen', 'Hydrogen', 'Helium']
        organs = ['Heart', 'Liver', 'Kidney', 'Brain', 'Lungs']
        
        base_questions = [
            {
                'question_text': f'What is the atomic number of {elements[year % len(elements)]}?',
                'topic': 'Chemistry',
                'answers': [
                    {'option_letter': 'A', 'answer_text': f'{year % 10 + 1}', 'is_correct': False},
                    {'option_letter': 'B', 'answer_text': f'{[8, 6, 7, 1, 2][year % len(elements)]}', 'is_correct': True},
                    {'option_letter': 'C', 'answer_text': f'{year % 15 + 5}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{year % 20 + 10}', 'is_correct': False},
                ]
            },
            {
                'question_text': f'Which organ is responsible for pumping blood?',
                'topic': 'Biology',
                'answers': [
                    {'option_letter': 'A', 'answer_text': 'Heart', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': f'{organs[(year + 1) % len(organs)]}', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': f'{organs[(year + 2) % len(organs)]}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{organs[(year + 3) % len(organs)]}', 'is_correct': False},
                ]
            },
            {
                'question_text': f'What is the speed of light approximately?',
                'topic': 'Physics',
                'answers': [
                    {'option_letter': 'A', 'answer_text': '300,000 km/s', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': f'{100 + year % 100},000 km/s', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': f'{200 + year % 50},000 km/s', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{400 + year % 100},000 km/s', 'is_correct': False},
                ]
            },
            {
                'question_text': f'Which process converts {elements[year % len(elements)].lower()} into energy in plants?',
                'topic': 'Biology',
                'answers': [
                    {'option_letter': 'A', 'answer_text': 'Photosynthesis', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': 'Respiration', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': 'Digestion', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': 'Fermentation', 'is_correct': False},
                ]
            },
            {
                'question_text': f'What is the pH of pure water at {20 + year % 10}°C?',
                'topic': 'Chemistry',
                'answers': [
                    {'option_letter': 'A', 'answer_text': '7', 'is_correct': True},
                    {'option_letter': 'B', 'answer_text': f'{year % 6 + 1}', 'is_correct': False},
                    {'option_letter': 'C', 'answer_text': f'{year % 8 + 8}', 'is_correct': False},
                    {'option_letter': 'D', 'answer_text': f'{year % 5}', 'is_correct': False},
                ]
            },
        ]
    
    return base_questions

def create_sample_questions():
    """Create sample questions for each subject and year"""
    
    # English Language questions
    english_questions = [
        {
            'question_text': "Choose the correct form of the verb: 'She _____ to school every day.'",
            'topic': 'Grammar',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'go', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'goes', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'going', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'gone', 'is_correct': False},
            ]
        },
        {
            'question_text': "What is the plural form of 'child'?",
            'topic': 'Grammar',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'childs', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'children', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'childrens', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'child', 'is_correct': False},
            ]
        },
        {
            'question_text': "Choose the word that best completes the sentence: 'The weather is very _____ today.'",
            'topic': 'Grammar',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'good', 'is_correct': True},
                {'option_letter': 'B', 'answer_text': 'well', 'is_correct': False},
                {'option_letter': 'C', 'answer_text': 'better', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'best', 'is_correct': False},
            ]
        },
        {
            'question_text': "Which of the following is a synonym for 'happy'?",
            'topic': 'Vocabulary',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'sad', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'joyful', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'angry', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'worried', 'is_correct': False},
            ]
        },
        {
            'question_text': "Identify the subject in this sentence: 'The tall boy kicked the ball.'",
            'topic': 'Grammar',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'tall', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'boy', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'kicked', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'ball', 'is_correct': False},
            ]
        },
    ]
    
    # Integrated Science questions
    science_questions = [
        {
            'question_text': 'Which of the following is the basic unit of life?',
            'topic': 'Biology',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'Tissue', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'Cell', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'Organ', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'Organism', 'is_correct': False},
            ]
        },
        {
            'question_text': 'What is the chemical symbol for water?',
            'topic': 'Chemistry',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'H₂O', 'is_correct': True},
                {'option_letter': 'B', 'answer_text': 'CO₂', 'is_correct': False},
                {'option_letter': 'C', 'answer_text': 'NaCl', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'O₂', 'is_correct': False},
            ]
        },
        {
            'question_text': 'Which force keeps objects on the Earth\'s surface?',
            'topic': 'Physics',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'Magnetic force', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'Gravitational force', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'Electric force', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'Nuclear force', 'is_correct': False},
            ]
        },
        {
            'question_text': 'What process do plants use to make their own food?',
            'topic': 'Biology',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'Respiration', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'Photosynthesis', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'Digestion', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'Fermentation', 'is_correct': False},
            ]
        },
        {
            'question_text': 'Which gas makes up the largest portion of Earth\'s atmosphere?',
            'topic': 'Environmental Science',
            'answers': [
                {'option_letter': 'A', 'answer_text': 'Oxygen', 'is_correct': False},
                {'option_letter': 'B', 'answer_text': 'Nitrogen', 'is_correct': True},
                {'option_letter': 'C', 'answer_text': 'Carbon dioxide', 'is_correct': False},
                {'option_letter': 'D', 'answer_text': 'Hydrogen', 'is_correct': False},
            ]
        },
    ]
    
    # Create papers and questions for each subject and all available years
    subjects = BECESubject.objects.filter(name__in=['mathematics', 'english_language', 'integrated_science'])
    years = BECEYear.objects.filter(is_available=True).order_by('-year')
    
    for subject in subjects:
        for year in years:
            # Create paper
            paper, created = BECEPaper.objects.get_or_create(
                year=year,
                subject=subject,
                paper_type='paper1',
                defaults={
                    'title': f'{year.year} {subject.display_name} - Paper 1',
                    'duration_minutes': 120,
                    'total_marks': 50,
                    'instructions': 'Answer all questions. Choose the best answer for each question.',
                    'is_published': True,
                }
            )
            
            if created:
                print(f"Created paper: {paper.title}")
                
                # Get year-specific questions for this subject and year
                questions_data = get_year_specific_questions(subject.name, year.year)
                
                for i, question_data in enumerate(questions_data, 1):
                    question = BECEQuestion.objects.create(
                        paper=paper,
                        question_number=i,
                        question_text=question_data['question_text'],
                        marks=1,
                        difficulty_level='medium',
                        topic=question_data['topic'],
                    )
                    
                    # Add answers
                    for answer_data in question_data['answers']:
                        BECEAnswer.objects.create(
                            question=question,
                            option_letter=answer_data['option_letter'],
                            answer_text=answer_data['answer_text'],
                            is_correct=answer_data['is_correct'],
                        )
                    
                    print(f"  Added question {i}: {question_data['question_text'][:50]}...")
            else:
                print(f"Paper already exists: {paper.title}")

def main():
    """Main function to create all sample data"""
    print("Creating BECE sample data...")
    
    print("\n1. Creating subjects...")
    create_bece_subjects()
    
    print("\n2. Creating years...")
    create_bece_years()
    
    print("\n3. Creating sample questions...")
    create_sample_questions()
    
    print("\nBECE sample data creation completed!")
    
    # Print summary
    print(f"\nSummary:")
    print(f"- Subjects: {BECESubject.objects.count()}")
    print(f"- Years: {BECEYear.objects.count()}")
    print(f"- Papers: {BECEPaper.objects.count()}")
    print(f"- Questions: {BECEQuestion.objects.count()}")
    print(f"- Answers: {BECEAnswer.objects.count()}")

if __name__ == '__main__':
    main()