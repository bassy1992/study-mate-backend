#!/usr/bin/env python
"""
Script to create detailed quizzes with multiple-choice questions for testing
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

def create_detailed_quizzes():
    """Create comprehensive quizzes with multiple-choice questions"""
    
    # Get subjects
    try:
        math_subject = Subject.objects.get(code='MATH')
        english_subject = Subject.objects.get(code='ENG')
        science_subject = Subject.objects.get(code='SCI')
    except Subject.DoesNotExist:
        print("Required subjects not found. Please run create_sample_data.py first.")
        return

    # Clear existing sample quizzes to avoid duplicates
    Quiz.objects.filter(title__in=[
        'JHS Mathematics Practice Test',
        'English Grammar Assessment',
        'Science Fundamentals Quiz',
        'BECE Mathematics Mock Exam'
    ]).delete()

    print("Creating detailed quizzes with multiple-choice questions...")

    # 1. JHS Mathematics Practice Test
    math_quiz = Quiz.objects.create(
        title="JHS Mathematics Practice Test",
        slug=slugify("JHS Mathematics Practice Test"),
        description="Comprehensive mathematics practice test covering algebra, geometry, and arithmetic for JHS students.",
        subject=math_subject,
        quiz_type='practice',
        time_limit_minutes=20,
        passing_score=70,
        max_attempts=5,
        is_published=True
    )

    # Math Question 1
    q1 = Question.objects.create(
        quiz=math_quiz,
        question_text="What is the value of x in the equation: 3x + 7 = 22?",
        question_type='multiple_choice',
        points=2,
        order=1,
        explanation="To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15, then divide by 3: x = 5"
    )
    Answer.objects.create(question=q1, answer_text="x = 3", is_correct=False, order=1)
    Answer.objects.create(question=q1, answer_text="x = 5", is_correct=True, order=2)
    Answer.objects.create(question=q1, answer_text="x = 7", is_correct=False, order=3)
    Answer.objects.create(question=q1, answer_text="x = 9", is_correct=False, order=4)

    # Math Question 2
    q2 = Question.objects.create(
        quiz=math_quiz,
        question_text="What is the area of a rectangle with length 8cm and width 5cm?",
        question_type='multiple_choice',
        points=2,
        order=2,
        explanation="Area of rectangle = length × width = 8 × 5 = 40 cm²"
    )
    Answer.objects.create(question=q2, answer_text="30 cm²", is_correct=False, order=1)
    Answer.objects.create(question=q2, answer_text="40 cm²", is_correct=True, order=2)
    Answer.objects.create(question=q2, answer_text="45 cm²", is_correct=False, order=3)
    Answer.objects.create(question=q2, answer_text="50 cm²", is_correct=False, order=4)

    # Math Question 3
    q3 = Question.objects.create(
        quiz=math_quiz,
        question_text="Which of the following fractions is equivalent to 0.75?",
        question_type='multiple_choice',
        points=2,
        order=3,
        explanation="0.75 = 75/100 = 3/4 when simplified"
    )
    Answer.objects.create(question=q3, answer_text="2/3", is_correct=False, order=1)
    Answer.objects.create(question=q3, answer_text="3/4", is_correct=True, order=2)
    Answer.objects.create(question=q3, answer_text="4/5", is_correct=False, order=3)
    Answer.objects.create(question=q3, answer_text="5/6", is_correct=False, order=4)

    # Math Question 4
    q4 = Question.objects.create(
        quiz=math_quiz,
        question_text="What is 15% of 200?",
        question_type='multiple_choice',
        points=2,
        order=4,
        explanation="15% of 200 = (15/100) × 200 = 0.15 × 200 = 30"
    )
    Answer.objects.create(question=q4, answer_text="25", is_correct=False, order=1)
    Answer.objects.create(question=q4, answer_text="30", is_correct=True, order=2)
    Answer.objects.create(question=q4, answer_text="35", is_correct=False, order=3)
    Answer.objects.create(question=q4, answer_text="40", is_correct=False, order=4)

    # Math Question 5
    q5 = Question.objects.create(
        quiz=math_quiz,
        question_text="If a triangle has angles of 60° and 70°, what is the third angle?",
        question_type='multiple_choice',
        points=2,
        order=5,
        explanation="The sum of angles in a triangle is 180°. So the third angle = 180° - 60° - 70° = 50°"
    )
    Answer.objects.create(question=q5, answer_text="40°", is_correct=False, order=1)
    Answer.objects.create(question=q5, answer_text="50°", is_correct=True, order=2)
    Answer.objects.create(question=q5, answer_text="60°", is_correct=False, order=3)
    Answer.objects.create(question=q5, answer_text="70°", is_correct=False, order=4)

    print(f"✅ Created Mathematics quiz: {math_quiz.title} with {math_quiz.questions.count()} questions")

    # 2. English Grammar Assessment
    english_quiz = Quiz.objects.create(
        title="English Grammar Assessment",
        slug=slugify("English Grammar Assessment"),
        description="Test your knowledge of English grammar, vocabulary, and sentence structure.",
        subject=english_subject,
        quiz_type='assessment',
        time_limit_minutes=25,
        passing_score=75,
        max_attempts=3,
        is_published=True
    )

    # English Question 1
    eq1 = Question.objects.create(
        quiz=english_quiz,
        question_text="Choose the correct sentence:",
        question_type='multiple_choice',
        points=2,
        order=1,
        explanation="The correct sentence uses proper subject-verb agreement. 'She doesn't like apples' is grammatically correct."
    )
    Answer.objects.create(question=eq1, answer_text="She don't like apples.", is_correct=False, order=1)
    Answer.objects.create(question=eq1, answer_text="She doesn't like apples.", is_correct=True, order=2)
    Answer.objects.create(question=eq1, answer_text="She didn't likes apples.", is_correct=False, order=3)
    Answer.objects.create(question=eq1, answer_text="She don't likes apples.", is_correct=False, order=4)

    # English Question 2
    eq2 = Question.objects.create(
        quiz=english_quiz,
        question_text="What is the plural form of 'child'?",
        question_type='multiple_choice',
        points=1,
        order=2,
        explanation="The plural of 'child' is 'children', which is an irregular plural form."
    )
    Answer.objects.create(question=eq2, answer_text="childs", is_correct=False, order=1)
    Answer.objects.create(question=eq2, answer_text="children", is_correct=True, order=2)
    Answer.objects.create(question=eq2, answer_text="childes", is_correct=False, order=3)
    Answer.objects.create(question=eq2, answer_text="child's", is_correct=False, order=4)

    # English Question 3
    eq3 = Question.objects.create(
        quiz=english_quiz,
        question_text="Which word is a synonym for 'happy'?",
        question_type='multiple_choice',
        points=1,
        order=3,
        explanation="'Joyful' means feeling or expressing great happiness, making it a synonym for 'happy'."
    )
    Answer.objects.create(question=eq3, answer_text="Sad", is_correct=False, order=1)
    Answer.objects.create(question=eq3, answer_text="Angry", is_correct=False, order=2)
    Answer.objects.create(question=eq3, answer_text="Joyful", is_correct=True, order=3)
    Answer.objects.create(question=eq3, answer_text="Tired", is_correct=False, order=4)

    # English Question 4
    eq4 = Question.objects.create(
        quiz=english_quiz,
        question_text="Identify the verb in this sentence: 'The cat sleeps on the mat.'",
        question_type='multiple_choice',
        points=2,
        order=4,
        explanation="'Sleeps' is the verb in the sentence as it describes the action performed by the cat."
    )
    Answer.objects.create(question=eq4, answer_text="cat", is_correct=False, order=1)
    Answer.objects.create(question=eq4, answer_text="sleeps", is_correct=True, order=2)
    Answer.objects.create(question=eq4, answer_text="mat", is_correct=False, order=3)
    Answer.objects.create(question=eq4, answer_text="the", is_correct=False, order=4)

    print(f"✅ Created English quiz: {english_quiz.title} with {english_quiz.questions.count()} questions")

    # 3. Science Fundamentals Quiz
    science_quiz = Quiz.objects.create(
        title="Science Fundamentals Quiz",
        slug=slugify("Science Fundamentals Quiz"),
        description="Basic science concepts covering biology, chemistry, and physics for JHS students.",
        subject=science_subject,
        quiz_type='practice',
        time_limit_minutes=20,
        passing_score=70,
        max_attempts=4,
        is_published=True
    )

    # Science Question 1
    sq1 = Question.objects.create(
        quiz=science_quiz,
        question_text="What is the chemical formula for water?",
        question_type='multiple_choice',
        points=1,
        order=1,
        explanation="Water is composed of two hydrogen atoms and one oxygen atom, hence H₂O."
    )
    Answer.objects.create(question=sq1, answer_text="H₂O", is_correct=True, order=1)
    Answer.objects.create(question=sq1, answer_text="CO₂", is_correct=False, order=2)
    Answer.objects.create(question=sq1, answer_text="NaCl", is_correct=False, order=3)
    Answer.objects.create(question=sq1, answer_text="O₂", is_correct=False, order=4)

    # Science Question 2
    sq2 = Question.objects.create(
        quiz=science_quiz,
        question_text="Which planet is closest to the Sun?",
        question_type='multiple_choice',
        points=1,
        order=2,
        explanation="Mercury is the planet closest to the Sun in our solar system."
    )
    Answer.objects.create(question=sq2, answer_text="Venus", is_correct=False, order=1)
    Answer.objects.create(question=sq2, answer_text="Mercury", is_correct=True, order=2)
    Answer.objects.create(question=sq2, answer_text="Earth", is_correct=False, order=3)
    Answer.objects.create(question=sq2, answer_text="Mars", is_correct=False, order=4)

    # Science Question 3
    sq3 = Question.objects.create(
        quiz=science_quiz,
        question_text="What process do plants use to make their own food?",
        question_type='multiple_choice',
        points=2,
        order=3,
        explanation="Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen."
    )
    Answer.objects.create(question=sq3, answer_text="Respiration", is_correct=False, order=1)
    Answer.objects.create(question=sq3, answer_text="Photosynthesis", is_correct=True, order=2)
    Answer.objects.create(question=sq3, answer_text="Digestion", is_correct=False, order=3)
    Answer.objects.create(question=sq3, answer_text="Transpiration", is_correct=False, order=4)

    # Science Question 4
    sq4 = Question.objects.create(
        quiz=science_quiz,
        question_text="What are the three states of matter?",
        question_type='multiple_choice',
        points=2,
        order=4,
        explanation="The three basic states of matter are solid, liquid, and gas."
    )
    Answer.objects.create(question=sq4, answer_text="Hot, warm, cold", is_correct=False, order=1)
    Answer.objects.create(question=sq4, answer_text="Solid, liquid, gas", is_correct=True, order=2)
    Answer.objects.create(question=sq4, answer_text="Big, medium, small", is_correct=False, order=3)
    Answer.objects.create(question=sq4, answer_text="Fast, slow, still", is_correct=False, order=4)

    print(f"✅ Created Science quiz: {science_quiz.title} with {science_quiz.questions.count()} questions")

    # 4. BECE Mathematics Mock Exam
    bece_quiz = Quiz.objects.create(
        title="BECE Mathematics Mock Exam",
        slug=slugify("BECE Mathematics Mock Exam"),
        description="Mock examination for BECE Mathematics preparation with past question patterns.",
        subject=math_subject,
        quiz_type='bece_practice',
        time_limit_minutes=20,
        passing_score=80,
        max_attempts=3,
        is_published=True
    )

    # BECE Question 1
    bq1 = Question.objects.create(
        quiz=bece_quiz,
        question_text="Simplify: 2/3 + 1/4",
        question_type='multiple_choice',
        points=3,
        order=1,
        explanation="To add fractions: 2/3 + 1/4 = 8/12 + 3/12 = 11/12"
    )
    Answer.objects.create(question=bq1, answer_text="3/7", is_correct=False, order=1)
    Answer.objects.create(question=bq1, answer_text="11/12", is_correct=True, order=2)
    Answer.objects.create(question=bq1, answer_text="5/12", is_correct=False, order=3)
    Answer.objects.create(question=bq1, answer_text="7/12", is_correct=False, order=4)

    # BECE Question 2
    bq2 = Question.objects.create(
        quiz=bece_quiz,
        question_text="If 5x - 3 = 2x + 9, find the value of x.",
        question_type='multiple_choice',
        points=4,
        order=2,
        explanation="5x - 3 = 2x + 9. Subtract 2x: 3x - 3 = 9. Add 3: 3x = 12. Divide by 3: x = 4"
    )
    Answer.objects.create(question=bq2, answer_text="x = 2", is_correct=False, order=1)
    Answer.objects.create(question=bq2, answer_text="x = 3", is_correct=False, order=2)
    Answer.objects.create(question=bq2, answer_text="x = 4", is_correct=True, order=3)
    Answer.objects.create(question=bq2, answer_text="x = 6", is_correct=False, order=4)

    # BECE Question 3
    bq3 = Question.objects.create(
        quiz=bece_quiz,
        question_text="What is the volume of a cube with side length 4cm?",
        question_type='multiple_choice',
        points=3,
        order=3,
        explanation="Volume of cube = side³ = 4³ = 64 cm³"
    )
    Answer.objects.create(question=bq3, answer_text="16 cm³", is_correct=False, order=1)
    Answer.objects.create(question=bq3, answer_text="48 cm³", is_correct=False, order=2)
    Answer.objects.create(question=bq3, answer_text="64 cm³", is_correct=True, order=3)
    Answer.objects.create(question=bq3, answer_text="128 cm³", is_correct=False, order=4)

    print(f"✅ Created BECE quiz: {bece_quiz.title} with {bece_quiz.questions.count()} questions")

    print("\n🎉 All detailed quizzes created successfully!")
    print(f"📊 Total quizzes: {Quiz.objects.filter(is_published=True).count()}")
    print(f"📝 Total questions: {Question.objects.count()}")
    print(f"📋 Total answers: {Answer.objects.count()}")

if __name__ == '__main__':
    create_detailed_quizzes()