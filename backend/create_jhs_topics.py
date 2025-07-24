#!/usr/bin/env python
"""
Create topic-based lessons for Ghana JHS subjects

This script creates specific topics for each subject as outlined in the Ghana JHS curriculum:
- English: Nouns, Verbs, Comprehension, Essay Writing, etc.
- Mathematics: Numbers, Algebra, Geometry, Statistics, etc.
- Science: Physics, Chemistry, Biology, Environmental Science, etc.
"""

import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Subject, Level, Course, Lesson
from django.utils.text import slugify


def create_english_topics():
    """Create English Language topics for all JHS levels"""
    print("📖 Creating English Language Topics...")
    
    english_topics = {
        'JHS1': [
            {'title': 'Parts of Speech - Nouns', 'duration': 45, 'description': 'Understanding different types of nouns and their usage'},
            {'title': 'Parts of Speech - Verbs', 'duration': 45, 'description': 'Action words, tenses, and verb forms'},
            {'title': 'Parts of Speech - Adjectives', 'duration': 30, 'description': 'Describing words and their proper usage'},
            {'title': 'Basic Sentence Structure', 'duration': 40, 'description': 'Subject, predicate, and simple sentences'},
            {'title': 'Reading Comprehension - Stories', 'duration': 50, 'description': 'Understanding and analyzing simple stories'},
            {'title': 'Vocabulary Building', 'duration': 35, 'description': 'Building word power and usage'},
            {'title': 'Basic Punctuation', 'duration': 30, 'description': 'Periods, commas, question marks, and exclamation points'},
            {'title': 'Simple Essay Writing', 'duration': 60, 'description': 'Introduction to paragraph writing'},
        ],
        'JHS2': [
            {'title': 'Advanced Grammar - Tenses', 'duration': 50, 'description': 'Past, present, future tenses and their forms'},
            {'title': 'Pronouns and Their Usage', 'duration': 40, 'description': 'Personal, possessive, and demonstrative pronouns'},
            {'title': 'Reading Comprehension - Articles', 'duration': 45, 'description': 'Understanding newspaper and magazine articles'},
            {'title': 'Descriptive Writing', 'duration': 55, 'description': 'Writing detailed descriptions of people, places, and things'},
            {'title': 'Poetry Analysis', 'duration': 50, 'description': 'Understanding rhythm, rhyme, and meaning in poems'},
            {'title': 'Formal and Informal Language', 'duration': 40, 'description': 'Appropriate language for different situations'},
            {'title': 'Letter Writing', 'duration': 45, 'description': 'Formal and informal letter formats'},
            {'title': 'Speech and Presentation', 'duration': 50, 'description': 'Public speaking and presentation skills'},
        ],
        'JHS3': [
            {'title': 'BECE Essay Writing Techniques', 'duration': 60, 'description': 'Advanced essay writing for BECE examination'},
            {'title': 'Literature Analysis', 'duration': 55, 'description': 'Analyzing prose, poetry, and drama'},
            {'title': 'Advanced Comprehension', 'duration': 50, 'description': 'Complex reading passages and analysis'},
            {'title': 'Grammar Review for BECE', 'duration': 45, 'description': 'Complete grammar review for examination'},
            {'title': 'Oral English and Phonetics', 'duration': 40, 'description': 'Pronunciation and speaking skills'},
            {'title': 'Creative Writing', 'duration': 55, 'description': 'Story writing and creative expression'},
            {'title': 'BECE Past Questions Practice', 'duration': 90, 'description': 'Practice with actual BECE questions'},
            {'title': 'Exam Techniques and Time Management', 'duration': 45, 'description': 'Strategies for BECE success'},
        ]
    }
    
    return create_subject_lessons('ENG', english_topics)


def create_mathematics_topics():
    """Create Mathematics topics for all JHS levels"""
    print("🔢 Creating Mathematics Topics...")
    
    math_topics = {
        'JHS1': [
            {'title': 'Number Systems and Operations', 'duration': 50, 'description': 'Whole numbers, fractions, and decimals'},
            {'title': 'Basic Algebra - Introduction', 'duration': 45, 'description': 'Variables, expressions, and simple equations'},
            {'title': 'Geometry - Shapes and Properties', 'duration': 40, 'description': 'Basic shapes, angles, and measurements'},
            {'title': 'Fractions and Decimals', 'duration': 55, 'description': 'Operations with fractions and decimals'},
            {'title': 'Percentages and Ratios', 'duration': 45, 'description': 'Understanding percentages and ratio concepts'},
            {'title': 'Basic Statistics', 'duration': 40, 'description': 'Data collection and simple graphs'},
            {'title': 'Measurement and Units', 'duration': 35, 'description': 'Length, weight, capacity, and time'},
            {'title': 'Problem Solving Techniques', 'duration': 50, 'description': 'Strategies for solving word problems'},
        ],
        'JHS2': [
            {'title': 'Algebraic Expressions', 'duration': 50, 'description': 'Simplifying and evaluating expressions'},
            {'title': 'Linear Equations', 'duration': 55, 'description': 'Solving equations with one variable'},
            {'title': 'Coordinate Geometry', 'duration': 45, 'description': 'Plotting points and basic graphing'},
            {'title': 'Triangles and Quadrilaterals', 'duration': 50, 'description': 'Properties and calculations'},
            {'title': 'Area and Perimeter', 'duration': 45, 'description': 'Calculating areas and perimeters of shapes'},
            {'title': 'Probability Basics', 'duration': 40, 'description': 'Introduction to probability concepts'},
            {'title': 'Indices and Standard Form', 'duration': 45, 'description': 'Powers and scientific notation'},
            {'title': 'Data Analysis', 'duration': 50, 'description': 'Mean, median, mode, and range'},
        ],
        'JHS3': [
            {'title': 'Quadratic Equations', 'duration': 60, 'description': 'Solving quadratic equations and applications'},
            {'title': 'Simultaneous Equations', 'duration': 55, 'description': 'Systems of linear equations'},
            {'title': 'Circle Geometry', 'duration': 50, 'description': 'Properties of circles and calculations'},
            {'title': 'Trigonometry Basics', 'duration': 55, 'description': 'Sine, cosine, and tangent ratios'},
            {'title': 'Volume and Surface Area', 'duration': 50, 'description': '3D shapes and their measurements'},
            {'title': 'Advanced Statistics', 'duration': 45, 'description': 'Frequency distributions and histograms'},
            {'title': 'BECE Mathematics Review', 'duration': 90, 'description': 'Comprehensive review for BECE'},
            {'title': 'BECE Past Questions Practice', 'duration': 90, 'description': 'Practice with actual BECE questions'},
        ]
    }
    
    return create_subject_lessons('MATH', math_topics)


def create_science_topics():
    """Create Integrated Science topics for all JHS levels"""
    print("🔬 Creating Integrated Science Topics...")
    
    science_topics = {
        'JHS1': [
            {'title': 'Introduction to Science', 'duration': 40, 'description': 'What is science and scientific methods'},
            {'title': 'Living and Non-living Things', 'duration': 45, 'description': 'Characteristics of living organisms'},
            {'title': 'Human Body Systems - Basics', 'duration': 50, 'description': 'Introduction to body systems'},
            {'title': 'Plants and Their Parts', 'duration': 45, 'description': 'Plant structure and functions'},
            {'title': 'Matter and Its Properties', 'duration': 40, 'description': 'States of matter and properties'},
            {'title': 'Simple Machines', 'duration': 45, 'description': 'Levers, pulleys, and inclined planes'},
            {'title': 'Weather and Climate', 'duration': 40, 'description': 'Weather patterns and measurements'},
            {'title': 'Environmental Science Basics', 'duration': 45, 'description': 'Ecosystems and conservation'},
        ],
        'JHS2': [
            {'title': 'Cell Structure and Function', 'duration': 50, 'description': 'Plant and animal cells'},
            {'title': 'Digestive System', 'duration': 45, 'description': 'How the body processes food'},
            {'title': 'Respiratory System', 'duration': 45, 'description': 'Breathing and gas exchange'},
            {'title': 'Chemical Reactions', 'duration': 50, 'description': 'Basic chemistry and reactions'},
            {'title': 'Forces and Motion', 'duration': 55, 'description': 'Newton\'s laws and applications'},
            {'title': 'Electricity and Magnetism', 'duration': 50, 'description': 'Basic electrical concepts'},
            {'title': 'Reproduction in Plants', 'duration': 45, 'description': 'Plant reproduction and life cycles'},
            {'title': 'Environmental Pollution', 'duration': 40, 'description': 'Types and effects of pollution'},
        ],
        'JHS3': [
            {'title': 'Genetics and Heredity', 'duration': 55, 'description': 'Inheritance and genetic principles'},
            {'title': 'Human Reproduction', 'duration': 50, 'description': 'Reproductive systems and processes'},
            {'title': 'Acids, Bases, and Salts', 'duration': 50, 'description': 'Chemical properties and reactions'},
            {'title': 'Energy and Its Forms', 'duration': 45, 'description': 'Types of energy and transformations'},
            {'title': 'Waves and Sound', 'duration': 45, 'description': 'Wave properties and sound'},
            {'title': 'Light and Optics', 'duration': 50, 'description': 'Properties of light and vision'},
            {'title': 'Ecosystem and Food Chains', 'duration': 45, 'description': 'Ecological relationships'},
            {'title': 'BECE Science Review', 'duration': 90, 'description': 'Comprehensive science review for BECE'},
        ]
    }
    
    return create_subject_lessons('SCI', science_topics)


def create_subject_lessons(subject_code, topics_by_level):
    """Create lessons for a specific subject across all JHS levels"""
    created_lessons = []
    
    try:
        subject = Subject.objects.get(code=subject_code)
        
        for level_code, topics in topics_by_level.items():
            try:
                level = Level.objects.get(code=level_code)
                course = Course.objects.get(subject=subject, level=level)
                
                print(f"   Creating lessons for {course.title}...")
                
                for order, topic in enumerate(topics, 1):
                    lesson_slug = slugify(f"{course.slug}-{topic['title']}")
                    
                    lesson, created = Lesson.objects.get_or_create(
                        course=course,
                        slug=lesson_slug,
                        defaults={
                            'title': topic['title'],
                            'description': topic['description'],
                            'lesson_type': 'video',
                            'order': order,
                            'duration_minutes': topic['duration'],
                            'is_free': order <= 2,  # First 2 lessons free
                            'is_published': True
                        }
                    )
                    
                    created_lessons.append(lesson)
                    status = "✅" if created else "📝"
                    print(f"     {status} {lesson.title}")
                    
            except (Level.DoesNotExist, Course.DoesNotExist) as e:
                print(f"   ⚠️  Skipping {level_code}: {str(e)}")
                continue
                
    except Subject.DoesNotExist:
        print(f"   ❌ Subject {subject_code} not found")
        return []
    
    return created_lessons


def update_course_descriptions():
    """Update course descriptions with topic information"""
    print("\n📝 Updating Course Descriptions...")
    
    description_templates = {
        'ENG': {
            'JHS1': "Master the fundamentals of English Language including parts of speech, basic grammar, reading comprehension, and simple essay writing. Perfect foundation for JHS students.",
            'JHS2': "Build on English fundamentals with advanced grammar, poetry analysis, formal writing, and presentation skills. Develop strong communication abilities.",
            'JHS3': "Complete BECE preparation covering advanced essay writing, literature analysis, and exam techniques. Includes extensive practice with past questions."
        },
        'MATH': {
            'JHS1': "Solid foundation in mathematics covering number systems, basic algebra, geometry, and problem-solving techniques. Essential skills for mathematical thinking.",
            'JHS2': "Intermediate mathematics including algebraic expressions, coordinate geometry, probability, and data analysis. Building towards advanced concepts.",
            'JHS3': "Advanced mathematics preparation for BECE including quadratic equations, trigonometry, and comprehensive review with past questions practice."
        },
        'SCI': {
            'JHS1': "Introduction to integrated science covering basic biology, chemistry, physics, and environmental science. Hands-on approach to scientific learning.",
            'JHS2': "Intermediate science exploring cell biology, chemical reactions, forces and motion, and environmental studies. Deeper scientific understanding.",
            'JHS3': "Advanced integrated science for BECE preparation including genetics, advanced chemistry, energy, and comprehensive exam review."
        }
    }
    
    updated_count = 0
    for subject_code, levels in description_templates.items():
        try:
            subject = Subject.objects.get(code=subject_code)
            for level_code, description in levels.items():
                try:
                    level = Level.objects.get(code=level_code)
                    course = Course.objects.get(subject=subject, level=level)
                    course.description = description
                    course.save()
                    updated_count += 1
                    print(f"   ✅ Updated: {course.title}")
                except (Level.DoesNotExist, Course.DoesNotExist):
                    continue
        except Subject.DoesNotExist:
            continue
    
    print(f"   📊 Updated {updated_count} course descriptions")


def display_topics_summary(english_lessons, math_lessons, science_lessons):
    """Display summary of created topics"""
    print("\n" + "="*60)
    print("📚 JHS TOPICS CREATION COMPLETE!")
    print("="*60)
    
    total_lessons = len(english_lessons) + len(math_lessons) + len(science_lessons)
    
    print(f"\n📊 SUMMARY:")
    print(f"   • Total Topics Created: {total_lessons}")
    print(f"   • English Topics: {len(english_lessons)}")
    print(f"   • Mathematics Topics: {len(math_lessons)}")
    print(f"   • Science Topics: {len(science_lessons)}")
    
    print(f"\n📖 SAMPLE ENGLISH TOPICS:")
    for lesson in english_lessons[:4]:
        print(f"   • {lesson.title} ({lesson.duration_minutes} min)")
    
    print(f"\n🔢 SAMPLE MATHEMATICS TOPICS:")
    for lesson in math_lessons[:4]:
        print(f"   • {lesson.title} ({lesson.duration_minutes} min)")
    
    print(f"\n🔬 SAMPLE SCIENCE TOPICS:")
    for lesson in science_lessons[:4]:
        print(f"   • {lesson.title} ({lesson.duration_minutes} min)")
    
    print(f"\n🚀 NEXT STEPS:")
    print(f"   1. Add video content for each topic")
    print(f"   2. Create practice quizzes for each topic")
    print(f"   3. Add lesson materials and resources")
    print(f"   4. Set up progress tracking")
    print(f"   5. Create topic-specific assessments")


def main():
    """Main function to create JHS topics"""
    print("📚 GHANA JHS TOPICS CREATION")
    print("="*50)
    print("Creating topic-based lessons for:")
    print("• English Language (Grammar, Comprehension, Writing)")
    print("• Mathematics (Algebra, Geometry, Statistics)")
    print("• Integrated Science (Biology, Chemistry, Physics)")
    print("="*50)
    
    try:
        # Create topics for each subject
        english_lessons = create_english_topics()
        math_lessons = create_mathematics_topics()
        science_lessons = create_science_topics()
        
        # Update course descriptions
        update_course_descriptions()
        
        # Display summary
        display_topics_summary(english_lessons, math_lessons, science_lessons)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("Topics creation failed. Please check the error and try again.")
        return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)