from django.core.management.base import BaseCommand
from django.utils.text import slugify
from bece.models import BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer


class Command(BaseCommand):
    help = 'Create a BECE paper with questions quickly'

    def add_arguments(self, parser):
        parser.add_argument('--year', type=int, required=True, help='Exam year (e.g., 2023)')
        parser.add_argument('--subject', type=str, required=True, help='Subject name (e.g., mathematics)')
        parser.add_argument('--paper-type', type=str, choices=['paper1', 'paper2'], required=True, help='Paper type')
        parser.add_argument('--questions', type=int, default=10, help='Number of sample questions to create')

    def handle(self, *args, **options):
        year_value = options['year']
        subject_name = options['subject']
        paper_type = options['paper_type']
        num_questions = options['questions']

        try:
            # Get or create year
            year, created = BECEYear.objects.get_or_create(
                year=year_value,
                defaults={'is_available': True}
            )
            if created:
                self.stdout.write(f"✅ Created year: {year}")

            # Get subject
            try:
                subject = BECESubject.objects.get(name=subject_name)
            except BECESubject.DoesNotExist:
                self.stdout.write(f"❌ Subject '{subject_name}' not found")
                self.stdout.write("Available subjects:")
                for subj in BECESubject.objects.all():
                    self.stdout.write(f"  - {subj.name}")
                return

            # Create paper
            paper_title = f"{year.year} {subject.display_name} - {paper_type.upper()}"
            
            # Set defaults based on paper type
            if paper_type == 'paper1':
                duration = 60  # 1 hour for objective
                total_marks = 50
                instructions = "Choose the correct answer from the options A, B, C, or D."
            else:  # paper2
                duration = 120  # 2 hours for essay
                total_marks = 50
                instructions = "Answer all questions. Write clearly and show all working."

            paper, created = BECEPaper.objects.get_or_create(
                year=year,
                subject=subject,
                paper_type=paper_type,
                defaults={
                    'title': paper_title,
                    'duration_minutes': duration,
                    'total_marks': total_marks,
                    'instructions': instructions,
                    'is_published': False
                }
            )

            if created:
                self.stdout.write(f"✅ Created paper: {paper.title}")
                
                # Create sample questions
                self.create_sample_questions(paper, num_questions)
                
                self.stdout.write(f"\n🎉 Successfully created BECE paper with {num_questions} questions!")
                self.stdout.write(f"📚 Paper: {paper.title}")
                self.stdout.write(f"🔗 Admin URL: http://127.0.0.1:8000/admin/bece/becepaper/{paper.id}/change/")
                
            else:
                self.stdout.write(f"⚠️  Paper already exists: {paper.title}")

        except Exception as e:
            self.stdout.write(f"❌ Error: {str(e)}")

    def create_sample_questions(self, paper, num_questions):
        """Create sample questions based on paper type"""
        
        if paper.paper_type == 'paper1':
            # Create multiple choice questions
            for i in range(1, num_questions + 1):
                question = BECEQuestion.objects.create(
                    paper=paper,
                    question_number=i,
                    question_type='multiple_choice',
                    question_text=f"Sample multiple choice question {i} for {paper.subject.display_name}.",
                    marks=1,
                    difficulty_level='medium',
                    topic=f"Topic {i}",
                    explanation=f"Explanation for question {i}."
                )
                
                # Create answer options
                options = [
                    ('A', f"Option A for question {i}", False),
                    ('B', f"Option B for question {i}", True),  # Correct answer
                    ('C', f"Option C for question {i}", False),
                    ('D', f"Option D for question {i}", False),
                ]
                
                for letter, text, is_correct in options:
                    BECEAnswer.objects.create(
                        question=question,
                        option_letter=letter,
                        answer_text=text,
                        is_correct=is_correct
                    )
                
                self.stdout.write(f"  ✅ Created multiple choice question {i}")
        
        else:  # paper2 - essay questions
            essay_marks = [10, 15, 10, 15]  # Typical essay question marks
            
            for i in range(1, min(num_questions + 1, 5)):  # Max 4 essay questions
                marks = essay_marks[i-1] if i <= len(essay_marks) else 10
                
                question = BECEQuestion.objects.create(
                    paper=paper,
                    question_number=i,
                    question_type='essay',
                    question_text=f"Sample essay question {i} for {paper.subject.display_name}. Discuss in detail.",
                    marks=marks,
                    difficulty_level='medium',
                    topic=f"Essay Topic {i}",
                    essay_instructions=f"Write a comprehensive essay addressing all aspects of the question. Your answer should be well-structured with clear introduction, body, and conclusion.",
                    word_limit=500,
                    time_limit_minutes=30,
                    explanation=f"Marking scheme for essay question {i}."
                )
                
                self.stdout.write(f"  ✅ Created essay question {i} ({marks} marks)")

    def get_sample_questions_by_subject(self, subject_name, question_type):
        """Get subject-specific sample questions"""
        
        questions_map = {
            'mathematics': {
                'multiple_choice': [
                    "What is the value of 2 + 3 × 4?",
                    "If x + 5 = 12, what is the value of x?",
                    "What is the area of a rectangle with length 8cm and width 5cm?",
                ],
                'essay': [
                    "Solve the following system of equations: 2x + y = 7, x - y = 2",
                    "A farmer has 120 meters of fencing. What is the maximum area he can enclose?",
                ]
            },
            'english_language': {
                'multiple_choice': [
                    "Choose the correct spelling:",
                    "What is the plural of 'child'?",
                    "Identify the verb in this sentence: 'The cat runs quickly.'",
                ],
                'essay': [
                    "Write a letter to your friend describing your school.",
                    "Discuss the importance of education in society.",
                ]
            },
            'integrated_science': {
                'multiple_choice': [
                    "What is the chemical symbol for water?",
                    "Which organ pumps blood in the human body?",
                    "What force pulls objects toward the Earth?",
                ],
                'essay': [
                    "Explain the process of photosynthesis in plants.",
                    "Describe the water cycle and its importance to life on Earth.",
                ]
            }
        }
        
        return questions_map.get(subject_name, {}).get(question_type, [
            f"Sample {question_type} question for {subject_name}"
        ])