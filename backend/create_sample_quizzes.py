#!/usr/bin/env python
"""
Script to create sample quizzes for testing the quiz system
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Subject, Course, Quiz, Question, Answer
from django.utils.text import slugify

def create_sample_quizzes():
    """Create sample quizzes for different subjects"""
    
    # Get subjects
    try:
        math_subject = Subject.objects.get(code='MATH')
        english_subject = Subject.objects.get(code='ENG')
        science_subject = Subject.objects.get(code='SCI')
    except Subject.DoesNotExist:
        print("Required subjects not found. Please run create_sample_data.py first.")
        return

    # Mathematics Quizzes
    math_quiz = Quiz.objects.create(
        title="Basic Algebra Quiz",
        slug=slugify("Basic Algebra Quiz"),
        description="Test your understanding of basic algebraic concepts including linear equations and expressions.",
        subject=math_subject,
        quiz_type='practice',
        time_limit_minutes=20,
        passing_score=70,
        max_attempts=3,
        is_published=True
    )

    # Math Question 1
    q1 = Question.objects.create(
        quiz=math_quiz,
        question_text="What is the solution to the equation 2x + 5 = 13?",
        question_type='multiple_choice',
        points=2,
        order=1,
        explanation="To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
    )
    Answer.objects.create(question=q1, answer_text="x = 4", is_correct=True, order=1)
    Answer.objects.create(question=q1, answer_text="x = 6", is_correct=False, order=2)
    Answer.objects.create(question=q1, answer_text="x = 8", is_correct=False, order=3)
    Answer.objects.create(question=q1, answer_text="x = 9", is_correct=False, order=4)

    # Math Question 2
    q2 = Question.objects.create(
        quiz=math_quiz,
        question_text="Which of the following is a linear equation?",
        question_type='multiple_choice',
        points=2,
        order=2,
        explanation="A linear equation has the highest power of the variable as 1. Only 3x + 7 = 0 meets this criterion."
    )
    Answer.objects.create(question=q2, answer_text="x² + 2x = 5", is_correct=False, order=1)
    Answer.objects.create(question=q2, answer_text="3x + 7 = 0", is_correct=True, order=2)
    Answer.objects.create(question=q2, answer_text="x³ - 4 = 0", is_correct=False, order=3)
    Answer.objects.create(question=q2, answer_text="√x + 1 = 5", is_correct=False, order=4)

    # Math Question 3
    q3 = Question.objects.create(
        quiz=math_quiz,
        question_text="Solve for x: 4x - 12 = 20",
        question_type='short_answer',
        points=3,
        order=3,
        explanation="4x - 12 = 20. Add 12 to both sides: 4x = 32. Divide by 4: x = 8"
    )

    print(f"Created Mathematics quiz: {math_quiz.title}")

    # English Quiz
    english_quiz = Quiz.objects.create(
        title="Grammar and Comprehension Quiz",
        slug=slugify("Grammar and Comprehension Quiz"),
        description="Test your English grammar skills and reading comprehension abilities.",
        subject=english_subject,
        quiz_type='assessment',
        time_limit_minutes=20,
        passing_score=75,
        max_attempts=2,
        is_published=True
    )

    # English Question 1
    eq1 = Question.objects.create(
        quiz=english_quiz,
        question_text="Which sentence is grammatically correct?",
        question_type='multiple_choice',
        points=2,
        order=1,
        explanation="The correct sentence uses proper subject-verb agreement and tense consistency."
    )
    Answer.objects.create(question=eq1, answer_text="She don't like apples.", is_correct=False, order=1)
    Answer.objects.create(question=eq1, answer_text="She doesn't like apples.", is_correct=True, order=2)
    Answer.objects.create(question=eq1, answer_text="She didn't likes apples.", is_correct=False, order=3)
    Answer.objects.create(question=eq1, answer_text="She don't likes apples.", is_correct=False, order=4)

    # English Question 2
    eq2 = Question.objects.create(
        quiz=english_quiz,
        question_text="What is the past tense of 'run'?",
        question_type='multiple_choice',
        points=1,
        order=2,
        explanation="The past tense of 'run' is 'ran'."
    )
    Answer.objects.create(question=eq2, answer_text="runned", is_correct=False, order=1)
    Answer.objects.create(question=eq2, answer_text="ran", is_correct=True, order=2)
    Answer.objects.create(question=eq2, answer_text="running", is_correct=False, order=3)
    Answer.objects.create(question=eq2, answer_text="runs", is_correct=False, order=4)

    print(f"Created English quiz: {english_quiz.title}")

    # Science Quiz
    science_quiz = Quiz.objects.create(
        title="Basic Chemistry Quiz",
        slug=slugify("Basic Chemistry Quiz"),
        description="Test your knowledge of basic chemistry concepts including atoms, molecules, and chemical reactions.",
        subject=science_subject,
        quiz_type='practice',
        time_limit_minutes=20,
        passing_score=70,
        max_attempts=3,
        is_published=True
    )

    # Science Question 1
    sq1 = Question.objects.create(
        quiz=science_quiz,
        question_text="What is the chemical symbol for water?",
        question_type='multiple_choice',
        points=1,
        order=1,
        explanation="Water is composed of two hydrogen atoms and one oxygen atom, hence H2O."
    )
    Answer.objects.create(question=sq1, answer_text="H2O", is_correct=True, order=1)
    Answer.objects.create(question=sq1, answer_text="CO2", is_correct=False, order=2)
    Answer.objects.create(question=sq1, answer_text="NaCl", is_correct=False, order=3)
    Answer.objects.create(question=sq1, answer_text="O2", is_correct=False, order=4)

    # Science Question 2
    sq2 = Question.objects.create(
        quiz=science_quiz,
        question_text="How many protons does a carbon atom have?",
        question_type='short_answer',
        points=2,
        order=2,
        explanation="Carbon has an atomic number of 6, which means it has 6 protons."
    )

    # Science Question 3
    sq3 = Question.objects.create(
        quiz=science_quiz,
        question_text="True or False: Photosynthesis occurs in plant leaves.",
        question_type='true_false',
        points=1,
        order=3,
        explanation="Photosynthesis primarily occurs in the chloroplasts of plant leaves."
    )
    Answer.objects.create(question=sq3, answer_text="True", is_correct=True, order=1)
    Answer.objects.create(question=sq3, answer_text="False", is_correct=False, order=2)

    print(f"Created Science quiz: {science_quiz.title}")

    # BECE Practice Quiz
    bece_quiz = Quiz.objects.create(
        title="BECE Mathematics Practice",
        slug=slugify("BECE Mathematics Practice"),
        description="Practice quiz for BECE Mathematics preparation with past question patterns.",
        subject=math_subject,
        quiz_type='bece_practice',
        time_limit_minutes=20,
        passing_score=80,
        max_attempts=5,
        is_published=True
    )

    # BECE Question 1
    bq1 = Question.objects.create(
        quiz=bece_quiz,
        question_text="If 3x + 7 = 22, find the value of x.",
        question_type='multiple_choice',
        points=3,
        order=1,
        explanation="3x + 7 = 22. Subtract 7: 3x = 15. Divide by 3: x = 5"
    )
    Answer.objects.create(question=bq1, answer_text="x = 3", is_correct=False, order=1)
    Answer.objects.create(question=bq1, answer_text="x = 5", is_correct=True, order=2)
    Answer.objects.create(question=bq1, answer_text="x = 7", is_correct=False, order=3)
    Answer.objects.create(question=bq1, answer_text="x = 9", is_correct=False, order=4)

    # BECE Question 2
    bq2 = Question.objects.create(
        quiz=bece_quiz,
        question_text="Calculate the area of a rectangle with length 8cm and width 5cm.",
        question_type='short_answer',
        points=2,
        order=2,
        explanation="Area of rectangle = length × width = 8 × 5 = 40 cm²"
    )

    print(f"Created BECE quiz: {bece_quiz.title}")

    print("\n✅ Sample quizzes created successfully!")
    print(f"Total quizzes created: {Quiz.objects.count()}")
    print(f"Total questions created: {Question.objects.count()}")
    print(f"Total answers created: {Answer.objects.count()}")

if __name__ == '__main__':
    create_sample_quizzes()