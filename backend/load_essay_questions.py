#!/usr/bin/env python
"""
Script to load essay questions for BECE practice tests
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

def get_english_essay_questions(year):
    """Generate English Language essay questions"""
    return [
        {
            'question_text': f'Write a letter to your friend describing your experience during the {year} school vacation. Your letter should be between 200-250 words.',
            'topic': 'Letter Writing',
            'marks': 20,
            'word_limit': 250,
            'time_limit_minutes': 30,
            'essay_instructions': '''
Instructions:
1. Use proper letter format (address, date, salutation, body, closing)
2. Write clearly and legibly
3. Use appropriate language and tone
4. Include specific details about your vacation experience
5. Check your grammar, spelling, and punctuation

Marking Scheme:
- Content and ideas: 8 marks
- Language use and grammar: 6 marks
- Format and organization: 4 marks
- Spelling and punctuation: 2 marks
            ''',
            'explanation': '''
Sample Answer Structure:
- Your address and date
- Friend's address
- Dear [Friend's name],
- Opening paragraph: Greetings and purpose
- Body paragraphs: Vacation experiences, activities, memorable moments
- Closing paragraph: Conclusion and invitation to respond
- Your name
            '''
        },
        {
            'question_text': f'Write a composition of about 300 words on the topic: "The Importance of Education in Ghana in {year}"',
            'topic': 'Composition Writing',
            'marks': 25,
            'word_limit': 300,
            'time_limit_minutes': 40,
            'essay_instructions': '''
Instructions:
1. Write a well-structured composition with introduction, body, and conclusion
2. Use relevant examples and personal experiences
3. Express your ideas clearly and logically
4. Use varied sentence structures and vocabulary
5. Proofread your work for errors

Marking Scheme:
- Content and relevance: 10 marks
- Organization and structure: 6 marks
- Language use and style: 6 marks
- Grammar and mechanics: 3 marks
            ''',
            'explanation': '''
Expected Content:
- Introduction: Define education and its significance
- Body: Discuss benefits (personal development, economic growth, social progress)
- Examples: Success stories, government initiatives
- Conclusion: Summarize importance and future outlook
            '''
        },
        {
            'question_text': f'You witnessed a road accident near your school in {year}. Write a report to the headmaster describing what happened. (200-250 words)',
            'topic': 'Report Writing',
            'marks': 20,
            'word_limit': 250,
            'time_limit_minutes': 30,
            'essay_instructions': '''
Instructions:
1. Use formal report format
2. Include all relevant details (time, place, people involved)
3. Write objectively without personal opinions
4. Use past tense throughout
5. Be clear and concise

Marking Scheme:
- Format and structure: 5 marks
- Content and accuracy: 8 marks
- Language and clarity: 5 marks
- Grammar and spelling: 2 marks
            ''',
            'explanation': '''
Report Structure:
- Title: Report on Road Accident
- To: The Headmaster
- From: [Your name and class]
- Date: [Date of report]
- Subject: Road Accident Report
- Body: Details of the incident
- Conclusion: Recommendations if any
            '''
        }
    ]

def get_social_studies_essay_questions(year):
    """Generate Social Studies essay questions"""
    return [
        {
            'question_text': f'Discuss the role of traditional rulers in Ghana\'s governance system as of {year}. (400 words)',
            'topic': 'Governance and Politics',
            'marks': 30,
            'word_limit': 400,
            'time_limit_minutes': 45,
            'essay_instructions': '''
Instructions:
1. Define traditional rulers and their historical significance
2. Explain their current roles in modern Ghana
3. Discuss the relationship between traditional and modern governance
4. Use specific examples from different regions
5. Provide a balanced analysis

Marking Scheme:
- Understanding of concept: 8 marks
- Analysis and examples: 10 marks
- Organization and structure: 7 marks
- Language and presentation: 5 marks
            ''',
            'explanation': '''
Key Points to Cover:
- Historical background of traditional authority
- Constitutional recognition and limitations
- Roles in conflict resolution and development
- Relationship with government institutions
- Challenges and opportunities
            '''
        },
        {
            'question_text': f'Analyze the impact of colonialism on Ghana\'s economic development up to {year}. (350 words)',
            'topic': 'History and Economics',
            'marks': 25,
            'word_limit': 350,
            'time_limit_minutes': 40,
            'essay_instructions': '''
Instructions:
1. Explain the colonial economic system in Ghana
2. Discuss both positive and negative impacts
3. Connect colonial legacy to current economic challenges
4. Use specific historical examples
5. Draw logical conclusions

Marking Scheme:
- Historical knowledge: 8 marks
- Analysis of impacts: 8 marks
- Use of examples: 5 marks
- Conclusion and evaluation: 4 marks
            ''',
            'explanation': '''
Areas to Discuss:
- Colonial economic policies and structures
- Impact on agriculture and mining
- Infrastructure development
- Effects on local industries and trade
- Long-term consequences for modern Ghana
            '''
        },
        {
            'question_text': f'Examine the challenges facing Ghana\'s democracy in {year} and suggest solutions. (300 words)',
            'topic': 'Governance and Citizenship',
            'marks': 25,
            'word_limit': 300,
            'time_limit_minutes': 35,
            'essay_instructions': '''
Instructions:
1. Identify key democratic challenges in Ghana
2. Explain the causes of these challenges
3. Propose realistic solutions
4. Consider the role of citizens in strengthening democracy
5. Write in a clear, analytical manner

Marking Scheme:
- Identification of challenges: 7 marks
- Analysis of causes: 6 marks
- Proposed solutions: 8 marks
- Overall coherence: 4 marks
            ''',
            'explanation': '''
Potential Challenges:
- Electoral issues and disputes
- Corruption and accountability
- Youth participation in politics
- Media freedom and responsibility
- Economic inequality and development
            '''
        }
    ]

def get_integrated_science_essay_questions(year):
    """Generate Integrated Science essay questions"""
    return [
        {
            'question_text': f'Explain the process of photosynthesis and its importance to life on Earth. Discuss how climate change in {year} might affect this process. (300 words)',
            'topic': 'Biology and Environmental Science',
            'marks': 25,
            'word_limit': 300,
            'time_limit_minutes': 35,
            'essay_instructions': '''
Instructions:
1. Define photosynthesis and write the chemical equation
2. Explain the light and dark reactions
3. Discuss the importance of photosynthesis
4. Analyze the impact of climate change
5. Use scientific terminology correctly

Marking Scheme:
- Understanding of photosynthesis: 8 marks
- Explanation of process: 7 marks
- Climate change analysis: 6 marks
- Scientific language use: 4 marks
            ''',
            'explanation': '''
Key Points:
- Definition and equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
- Light reactions (chlorophyll, ATP, NADPH)
- Dark reactions (Calvin cycle)
- Importance: oxygen production, food chain base
- Climate change effects: temperature, CO₂ levels, water availability
            '''
        },
        {
            'question_text': f'Describe the water cycle and explain how human activities in {year} have affected this natural process. (250 words)',
            'topic': 'Environmental Science',
            'marks': 20,
            'word_limit': 250,
            'time_limit_minutes': 30,
            'essay_instructions': '''
Instructions:
1. Describe the stages of the water cycle
2. Explain the role of energy in the process
3. Discuss human impacts on the water cycle
4. Suggest ways to minimize negative effects
5. Use diagrams if helpful

Marking Scheme:
- Description of water cycle: 8 marks
- Human impact analysis: 6 marks
- Solutions and suggestions: 4 marks
- Clarity and organization: 2 marks
            ''',
            'explanation': '''
Water Cycle Stages:
- Evaporation from water bodies
- Transpiration from plants
- Condensation in atmosphere
- Precipitation as rain/snow
- Collection and runoff
Human impacts: deforestation, pollution, urbanization, dam construction
            '''
        },
        {
            'question_text': f'Discuss the properties and uses of acids and bases in everyday life. Include safety precautions when handling them. (280 words)',
            'topic': 'Chemistry',
            'marks': 22,
            'word_limit': 280,
            'time_limit_minutes': 32,
            'essay_instructions': '''
Instructions:
1. Define acids and bases with examples
2. Explain their properties (pH, indicators, reactions)
3. Discuss everyday uses and applications
4. Emphasize safety measures
5. Use chemical formulas where appropriate

Marking Scheme:
- Definitions and properties: 8 marks
- Everyday applications: 6 marks
- Safety precautions: 5 marks
- Use of examples: 3 marks
            ''',
            'explanation': '''
Content Areas:
- Acid properties: sour taste, pH < 7, react with metals
- Base properties: bitter taste, pH > 7, slippery feel
- Uses: cleaning, food preservation, medicine, industry
- Safety: protective equipment, proper storage, first aid
            '''
        }
    ]

def create_essay_papers():
    """Create Paper 2 (Essay) for each subject and year"""
    
    # Get subjects that have essay papers
    essay_subjects = BECESubject.objects.filter(
        name__in=['english_language', 'social_studies', 'integrated_science']
    )
    
    # Get ALL available years
    years = BECEYear.objects.filter(is_available=True).order_by('-year')  # All years
    
    for subject in essay_subjects:
        for year in years:
            # Create Paper 2 (Essay paper)
            paper, created = BECEPaper.objects.get_or_create(
                year=year,
                subject=subject,
                paper_type='paper2',
                defaults={
                    'title': f'{year.year} {subject.display_name} - Paper 2 (Essay)',
                    'duration_minutes': 120,
                    'total_marks': 70,
                    'instructions': '''
INSTRUCTIONS:
1. Answer ALL questions in this paper
2. Write your answers in the spaces provided
3. Use clear, legible handwriting
4. Pay attention to word limits for each question
5. Plan your time carefully
6. Check your work before submission

GENERAL MARKING CRITERIA:
- Content and ideas
- Organization and structure  
- Language use and grammar
- Spelling and punctuation
                    ''',
                    'is_published': True,
                }
            )
            
            if created:
                print(f"Created essay paper: {paper.title}")
                
                # Get essay questions for this subject and year
                if subject.name == 'english_language':
                    questions_data = get_english_essay_questions(year.year)
                elif subject.name == 'social_studies':
                    questions_data = get_social_studies_essay_questions(year.year)
                elif subject.name == 'integrated_science':
                    questions_data = get_integrated_science_essay_questions(year.year)
                else:
                    continue
                
                # Create questions
                for i, question_data in enumerate(questions_data, 1):
                    question = BECEQuestion.objects.create(
                        paper=paper,
                        question_number=i,
                        question_type='essay',
                        question_text=question_data['question_text'],
                        marks=question_data['marks'],
                        difficulty_level='medium',
                        topic=question_data['topic'],
                        essay_instructions=question_data['essay_instructions'],
                        word_limit=question_data.get('word_limit'),
                        time_limit_minutes=question_data.get('time_limit_minutes'),
                        explanation=question_data['explanation'],
                    )
                    
                    print(f"  Added essay question {i}: {question_data['question_text'][:60]}...")
            else:
                print(f"Essay paper already exists: {paper.title}")

def create_additional_essay_questions():
    """Create additional essay questions for variety"""
    
    # Mathematics essay questions (problem-solving type)
    math_subject = BECESubject.objects.filter(name='mathematics').first()
    if math_subject:
        years = BECEYear.objects.filter(is_available=True).order_by('-year')  # All years
        
        for year in years:
            paper, created = BECEPaper.objects.get_or_create(
                year=year,
                subject=math_subject,
                paper_type='paper2',
                defaults={
                    'title': f'{year.year} Mathematics - Paper 2 (Problem Solving)',
                    'duration_minutes': 150,
                    'total_marks': 100,
                    'instructions': '''
INSTRUCTIONS:
1. Answer ALL questions
2. Show all working clearly
3. Marks are awarded for method as well as correct answers
4. Use mathematical instruments where necessary
5. Give answers to appropriate degree of accuracy
                    ''',
                    'is_published': True,
                }
            )
            
            if created:
                print(f"Created math essay paper: {paper.title}")
                
                math_questions = [
                    {
                        'question_text': f'A rectangular field has a length of (2x + 5) meters and width of (x + 3) meters. If the perimeter is {40 + year.year % 20} meters, find the dimensions of the field. Show all your working.',
                        'topic': 'Algebra and Mensuration',
                        'marks': 15,
                        'instructions': 'Set up equation for perimeter, solve for x, then find actual dimensions',
                    },
                    {
                        'question_text': f'The table below shows the marks obtained by {30 + year.year % 10} students in a mathematics test. Calculate the mean, median, and mode. Draw a histogram to represent the data.',
                        'topic': 'Statistics',
                        'marks': 20,
                        'instructions': 'Show calculations for all measures of central tendency and draw accurate histogram',
                    },
                    {
                        'question_text': f'A cone has a base radius of {6 + year.year % 5} cm and height of {12 + year.year % 8} cm. Calculate: (a) the slant height (b) the curved surface area (c) the total surface area. Use π = 22/7',
                        'topic': 'Mensuration',
                        'marks': 18,
                        'instructions': 'Use appropriate formulas and show all calculations clearly',
                    }
                ]
                
                for i, question_data in enumerate(math_questions, 1):
                    question = BECEQuestion.objects.create(
                        paper=paper,
                        question_number=i,
                        question_type='essay',
                        question_text=question_data['question_text'],
                        marks=question_data['marks'],
                        difficulty_level='medium',
                        topic=question_data['topic'],
                        essay_instructions=question_data['instructions'],
                        time_limit_minutes=question_data['marks'] * 2,  # 2 minutes per mark
                    )
                    
                    print(f"  Added math essay question {i}: {question_data['topic']}")

def main():
    """Main function to load essay questions"""
    print("Loading BECE Essay Questions...")
    
    print("\n1. Creating essay papers for core subjects...")
    create_essay_papers()
    
    print("\n2. Creating additional essay questions...")
    create_additional_essay_questions()
    
    print("\nEssay questions loading completed!")
    
    # Print summary
    essay_papers = BECEPaper.objects.filter(paper_type='paper2')
    essay_questions = BECEQuestion.objects.filter(question_type='essay')
    
    print(f"\nSummary:")
    print(f"- Essay Papers: {essay_papers.count()}")
    print(f"- Essay Questions: {essay_questions.count()}")
    
    print(f"\nBreakdown by subject:")
    for subject in BECESubject.objects.all():
        subject_papers = essay_papers.filter(subject=subject).count()
        subject_questions = essay_questions.filter(paper__subject=subject).count()
        if subject_papers > 0:
            print(f"- {subject.display_name}: {subject_papers} papers, {subject_questions} questions")

if __name__ == '__main__':
    main()