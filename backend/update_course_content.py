#!/usr/bin/env python
"""
Script to add learning objectives and prerequisites to existing courses
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course

def update_course_content():
    """Add learning objectives and prerequisites to courses"""
    
    # Course content data
    course_content = {
        'english-sounds': {
            'learning_objectives': [
                'Master the pronunciation of English consonant and vowel sounds',
                'Identify and differentiate between similar sounding phonemes',
                'Apply correct pronunciation in speaking and reading activities',
                'Develop listening skills to recognize sound patterns in English',
                'Build confidence in oral communication through proper sound production'
            ],
            'prerequisites': 'Basic familiarity with the English alphabet and simple vocabulary. No prior phonetics knowledge required.'
        },
        'features-of-a-non-literary-text': {
            'learning_objectives': [
                'Identify key features of non-literary texts such as reports, articles, and informational writing',
                'Analyze the structure and organization of different non-literary text types',
                'Understand the purpose and audience of various non-literary texts',
                'Extract main ideas and supporting details from informational texts',
                'Apply knowledge to create well-structured non-literary texts'
            ],
            'prerequisites': 'Basic reading comprehension skills and familiarity with different types of texts. Elementary writing skills recommended.'
        },
        'vowel-sounds': {
            'learning_objectives': [
                'Master the pronunciation of all English vowel sounds (short and long)',
                'Distinguish between vowel sounds in minimal pairs',
                'Apply correct vowel pronunciation in words and sentences',
                'Understand vowel sound patterns and spelling relationships',
                'Improve overall speaking clarity through proper vowel articulation'
            ],
            'prerequisites': 'Basic knowledge of English alphabet and simple words. Completion of "English Sounds" course recommended but not required.'
        },
        'introduction-to-science-and-scientific-methods': {
            'learning_objectives': [
                'Understand the nature and scope of scientific inquiry',
                'Learn the steps of the scientific method and how to apply them',
                'Develop skills in observation, hypothesis formation, and experimentation',
                'Understand the importance of evidence-based conclusions',
                'Apply scientific thinking to everyday situations and problems'
            ],
            'prerequisites': 'Basic mathematics skills and curiosity about the natural world. No prior science knowledge required.'
        },
        'physical-and-chemical-changes': {
            'learning_objectives': [
                'Distinguish between physical and chemical changes in matter',
                'Identify examples of physical and chemical changes in daily life',
                'Understand the properties that change during physical and chemical processes',
                'Predict whether a change is physical or chemical based on observations',
                'Apply knowledge to explain natural phenomena and laboratory experiments'
            ],
            'prerequisites': 'Basic understanding of matter and its properties. Completion of "Introduction to Science" course recommended.'
        },
        'states-of-matter-solid-liquid-gas': {
            'learning_objectives': [
                'Identify and describe the three main states of matter',
                'Understand the particle behavior in solids, liquids, and gases',
                'Explain how matter changes from one state to another',
                'Relate temperature and pressure to state changes',
                'Apply knowledge to explain everyday phenomena involving state changes'
            ],
            'prerequisites': 'Basic understanding of matter and temperature concepts. Elementary knowledge of particles and atoms helpful but not required.'
        },
        'fractions-decimals-and-percentages': {
            'learning_objectives': [
                'Understand the relationship between fractions, decimals, and percentages',
                'Convert between fractions, decimals, and percentages accurately',
                'Perform basic operations with fractions and decimals',
                'Apply fraction and percentage concepts to real-world problems',
                'Develop number sense and estimation skills with rational numbers'
            ],
            'prerequisites': 'Solid understanding of whole numbers and basic arithmetic operations. Knowledge of place value system required.'
        },
        'number-operations': {
            'learning_objectives': [
                'Master the four basic arithmetic operations: addition, subtraction, multiplication, and division',
                'Apply order of operations (PEMDAS/BODMAS) correctly',
                'Solve multi-step problems involving various operations',
                'Develop mental math strategies for quick calculations',
                'Apply number operations to solve real-world mathematical problems'
            ],
            'prerequisites': 'Basic number recognition and counting skills. Understanding of place value system essential.'
        },
        'number-and-numeration-systems': {
            'learning_objectives': [
                'Understand different number systems and their applications',
                'Master place value concepts in decimal system',
                'Read, write, and compare numbers in various forms',
                'Understand the concept of zero and its role in numeration',
                'Apply numeration concepts to solve mathematical problems'
            ],
            'prerequisites': 'Basic counting skills and number recognition. No advanced mathematical knowledge required.'
        }
    }
    
    # Update courses with content
    updated_count = 0
    for slug, content in course_content.items():
        try:
            course = Course.objects.get(slug=slug)
            course.learning_objectives = content['learning_objectives']
            course.prerequisites = content['prerequisites']
            course.save()
            print(f"✅ Updated {course.title}")
            updated_count += 1
        except Course.DoesNotExist:
            print(f"❌ Course not found: {slug}")
    
    print(f"\n🎉 Successfully updated {updated_count} courses with learning objectives and prerequisites!")

if __name__ == '__main__':
    update_course_content()