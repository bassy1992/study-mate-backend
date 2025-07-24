#!/usr/bin/env python
"""
Create comprehensive JHS 1 English curriculum lessons based on Ghana Education Service syllabus
"""
import os
import sys
import django
from django.utils.text import slugify

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course, Lesson, LessonContent, Level, Subject

def create_jhs1_english_lessons():
    print("=== Creating JHS 1 English Curriculum Lessons ===\n")
    
    # Get JHS 1 English course
    try:
        jhs1_level = Level.objects.get(code='JHS1')
        english_subject = Subject.objects.get(code='ENG')
        course = Course.objects.get(level=jhs1_level, subject=english_subject)
        print(f"Found course: {course.title} ({course.slug})")
    except Exception as e:
        print(f"Error finding course: {e}")
        return
    
    # Clear existing lessons to avoid duplicates
    existing_count = course.lessons.count()
    if existing_count > 0:
        print(f"Removing {existing_count} existing lessons...")
        course.lessons.all().delete()
    
    lessons_data = [
        # Conversation/Everyday Discourse
        {
            'title': 'Using Appropriate Register in Everyday Communication',
            'description': 'Learn to use formal and informal language appropriately in different social contexts',
            'content': 'Master the art of choosing the right level of formality when speaking to different people in various situations.',
            'duration_minutes': 25,
            'order': 1,
            'is_free': True
        },
        {
            'title': 'Asking Questions That Elicit Elaboration',
            'description': 'Develop skills to ask meaningful questions and respond effectively in conversations',
            'content': 'Learn techniques for asking open-ended questions that encourage detailed responses and practice active listening.',
            'duration_minutes': 30,
            'order': 2,
            'is_free': False
        },
        {
            'title': 'Using Appropriate Language to Describe Experiences',
            'description': 'Express personal experiences and describe others using suitable vocabulary and tone',
            'content': 'Practice describing personal experiences, events, and people using appropriate descriptive language.',
            'duration_minutes': 28,
            'order': 3,
            'is_free': False
        },
        {
            'title': 'Listening to and Giving Accurate Directions',
            'description': 'Master the skills of giving and following directions to familiar places',
            'content': 'Learn to give clear, step-by-step directions and understand directional instructions effectively.',
            'duration_minutes': 22,
            'order': 4,
            'is_free': False
        },
        {
            'title': 'Techniques for Effective Oral Communication',
            'description': 'Develop confidence and clarity in spoken English through proven techniques',
            'content': 'Master voice projection, pace, tone, and body language for effective oral communication.',
            'duration_minutes': 35,
            'order': 5,
            'is_free': False
        },
        
        # Listening Comprehension
        {
            'title': 'Listening Attentively and Identifying Key Information',
            'description': 'Develop active listening skills to extract important information from texts',
            'content': 'Practice focused listening techniques to identify main ideas, supporting details, and key information.',
            'duration_minutes': 25,
            'order': 6,
            'is_free': False
        },
        {
            'title': 'Discussing Ideas and Sharing Opinions from Texts',
            'description': 'Learn to analyze, discuss, and express personal opinions about what you hear',
            'content': 'Develop critical thinking skills through listening exercises and opinion-sharing activities.',
            'duration_minutes': 30,
            'order': 7,
            'is_free': False
        },
        
        # English Sounds
        {
            'title': 'Introduction to English Language Sounds',
            'description': 'Foundation lesson on the sound system of English language',
            'content': 'Understand the basics of English phonetics and the importance of correct pronunciation.',
            'duration_minutes': 20,
            'order': 8,
            'is_free': False
        },
        {
            'title': 'Producing Pure Vowel Sounds (Short Vowels)',
            'description': 'Master the pronunciation of short vowel sounds in context',
            'content': 'Practice producing /ɪ/, /e/, /æ/, /ʌ/, /ɒ/, /ʊ/ sounds correctly in words and sentences.',
            'duration_minutes': 25,
            'order': 9,
            'is_free': False
        },
        {
            'title': 'Producing Pure Vowel Sounds (Long Vowels)',
            'description': 'Master the pronunciation of long vowel sounds in context',
            'content': 'Practice producing /iː/, /ɑː/, /ɔː/, /uː/, /ɜː/ sounds correctly in words and sentences.',
            'duration_minutes': 25,
            'order': 10,
            'is_free': False
        },
        {
            'title': 'Producing Diphthongs (Centring and Closing)',
            'description': 'Learn to pronounce diphthongs correctly in various contexts',
            'content': 'Master the pronunciation of diphthongs like /eɪ/, /aɪ/, /ɔɪ/, /aʊ/, /əʊ/, /ɪə/, /eə/, /ʊə/.',
            'duration_minutes': 30,
            'order': 11,
            'is_free': False
        },
        
        # Comprehension
        {
            'title': 'Reading with Monitoring and Mental Visualisation',
            'description': 'Develop advanced reading strategies for better text comprehension',
            'content': 'Learn to monitor your understanding while reading and create mental images to aid comprehension.',
            'duration_minutes': 35,
            'order': 12,
            'is_free': False
        },
        {
            'title': 'Using Prediction to Improve Understanding',
            'description': 'Learn to make predictions while reading to enhance comprehension',
            'content': 'Practice predicting outcomes, events, and meanings to become a more active reader.',
            'duration_minutes': 28,
            'order': 13,
            'is_free': False
        },
        {
            'title': 'Generating and Answering Questions for Fiction Texts',
            'description': 'Develop questioning skills to deepen understanding of fictional works',
            'content': 'Learn to ask and answer different types of questions about characters, plot, and themes.',
            'duration_minutes': 32,
            'order': 14,
            'is_free': False
        },
        {
            'title': 'Using Text Structure for Independent Reading',
            'description': 'Understand how text organization helps with reading comprehension',
            'content': 'Learn to identify and use text structures like sequence, cause-effect, and compare-contrast.',
            'duration_minutes': 30,
            'order': 15,
            'is_free': False
        },
        {
            'title': 'Identifying Main Features of Non-Literary Texts',
            'description': 'Recognize key elements and structures in informational texts',
            'content': 'Learn to identify headings, subheadings, captions, diagrams, and other text features.',
            'duration_minutes': 25,
            'order': 16,
            'is_free': False
        },
        {
            'title': 'Interpreting Non-Fiction: Attitudes, Opinions, and Biases',
            'description': 'Develop critical reading skills to identify author perspectives',
            'content': 'Learn to distinguish between facts and opinions, and identify bias in non-fiction texts.',
            'duration_minutes': 35,
            'order': 17,
            'is_free': False
        },
        {
            'title': 'Personal Responses to Non-Literary Texts with Evidence',
            'description': 'Learn to form and support personal opinions about informational texts',
            'content': 'Practice expressing personal responses and supporting them with textual evidence.',
            'duration_minutes': 30,
            'order': 18,
            'is_free': False
        },
        
        # Summarising
        {
            'title': 'Using Summarising to Understand Key Ideas',
            'description': 'Master the skill of summarising to improve text comprehension',
            'content': 'Learn effective summarising techniques to identify and express main ideas concisely.',
            'duration_minutes': 28,
            'order': 19,
            'is_free': False
        },
        {
            'title': 'Determining Central and Supporting Ideas',
            'description': 'Learn to identify main ideas and distinguish them from supporting details',
            'content': 'Practice analyzing texts to find central themes and the details that support them.',
            'duration_minutes': 32,
            'order': 20,
            'is_free': False
        },
        
        # Grammar (Part 1)
        {
            'title': 'Command and Application of Nouns',
            'description': 'Master different types of nouns and their correct usage',
            'content': 'Learn about common, proper, abstract, concrete, collective, and compound nouns.',
            'duration_minutes': 30,
            'order': 21,
            'is_free': False
        },
        {
            'title': 'Using Types of Pronouns Accurately',
            'description': 'Understand and correctly use different categories of pronouns',
            'content': 'Master personal, possessive, demonstrative, interrogative, and relative pronouns.',
            'duration_minutes': 28,
            'order': 22,
            'is_free': False
        },
        {
            'title': 'Accurate Use of Adjectives',
            'description': 'Learn to use descriptive, comparative, and superlative adjectives correctly',
            'content': 'Practice using adjectives to describe, compare, and enhance your writing and speaking.',
            'duration_minutes': 25,
            'order': 23,
            'is_free': False
        },
        {
            'title': 'Forms of Verbs in Everyday Activities',
            'description': 'Understand verb forms and their relationship to daily actions',
            'content': 'Learn about base forms, past tense, past participle, and present participle of verbs.',
            'duration_minutes': 32,
            'order': 24,
            'is_free': False
        },
        {
            'title': 'Using Adverbs to Modify Verbs',
            'description': 'Master the use of adverbs at phrase and sentence level',
            'content': 'Learn how adverbs modify verbs, adjectives, and other adverbs to add detail and precision.',
            'duration_minutes': 28,
            'order': 25,
            'is_free': False
        },
        {
            'title': 'Using Conjunctions to Link Ideas',
            'description': 'Learn to connect ideas effectively using coordinating and subordinating conjunctions',
            'content': 'Master the use of conjunctions like and, but, or, because, although, and while.',
            'duration_minutes': 30,
            'order': 26,
            'is_free': False
        },
        {
            'title': 'Command of Prepositions in Daily Discourse',
            'description': 'Understand and correctly use prepositions in everyday communication',
            'content': 'Learn prepositions of time, place, direction, and manner for accurate expression.',
            'duration_minutes': 25,
            'order': 27,
            'is_free': False
        },
        
        # Grammar (Part 2)
        {
            'title': 'Identifying and Using Determiners',
            'description': 'Master the use of articles, demonstratives, and quantifiers',
            'content': 'Learn to use a, an, the, this, that, some, many, and other determiners correctly.',
            'duration_minutes': 22,
            'order': 28,
            'is_free': False
        },
        {
            'title': 'Subject and Predicate in Texts',
            'description': 'Understand the basic structure of sentences through subjects and predicates',
            'content': 'Learn to identify what sentences are about (subject) and what is said about it (predicate).',
            'duration_minutes': 25,
            'order': 29,
            'is_free': False
        },
        {
            'title': 'Command and Use of Compound Sentences',
            'description': 'Learn to create and use compound sentences effectively',
            'content': 'Master joining independent clauses with coordinating conjunctions and semicolons.',
            'duration_minutes': 30,
            'order': 30,
            'is_free': False
        },
        {
            'title': 'Dependent and Independent Clauses',
            'description': 'Understand clause types and their appropriate use in communication',
            'content': 'Learn to identify and correctly use dependent and independent clauses in complex sentences.',
            'duration_minutes': 32,
            'order': 31,
            'is_free': False
        },
        {
            'title': 'Using Conditional Sentences',
            'description': 'Master conditional structures to express possibilities and results',
            'content': 'Learn first, second, and third conditional patterns for different types of conditions.',
            'duration_minutes': 35,
            'order': 32,
            'is_free': False
        },
        {
            'title': 'Using Passive Sentences for Various Functions',
            'description': 'Understand when and how to use passive voice effectively',
            'content': 'Learn to transform active sentences to passive and understand when passive voice is preferred.',
            'duration_minutes': 30,
            'order': 33,
            'is_free': False
        },
        {
            'title': 'Use and Command of Reported Speech',
            'description': 'Master the rules for reporting what others have said',
            'content': 'Learn to change direct speech to indirect speech with appropriate tense and pronoun changes.',
            'duration_minutes': 35,
            'order': 34,
            'is_free': False
        },
        {
            'title': 'Using Question Tags Accurately',
            'description': 'Learn to form and use question tags in conversation',
            'content': 'Master the patterns for creating question tags to confirm information or invite agreement.',
            'duration_minutes': 25,
            'order': 35,
            'is_free': False
        },
        
        # Punctuation and Capitalisation
        {
            'title': 'Identifying and Using Punctuation Marks',
            'description': 'Master the correct use of punctuation for clear communication',
            'content': 'Learn proper use of periods, commas, question marks, exclamation points, and other punctuation.',
            'duration_minutes': 28,
            'order': 36,
            'is_free': False
        },
        
        # Vocabulary
        {
            'title': 'Applying Vocabulary in Specific Contexts',
            'description': 'Learn to choose and use appropriate vocabulary for different situations',
            'content': 'Practice selecting context-appropriate words for formal, informal, academic, and social settings.',
            'duration_minutes': 30,
            'order': 37,
            'is_free': False
        },
        {
            'title': 'Using Proverbs to Enrich Communication',
            'description': 'Explore Ghanaian and English proverbs to enhance expression',
            'content': 'Learn common proverbs, their meanings, and how to use them appropriately in communication.',
            'duration_minutes': 25,
            'order': 38,
            'is_free': False
        },
        
        # Production and Distribution of Writing
        {
            'title': 'Cohesive Devices in Paragraph Writing',
            'description': 'Learn to connect sentences within paragraphs using appropriate linking words',
            'content': 'Master transition words, pronouns, and other cohesive devices for smooth paragraph flow.',
            'duration_minutes': 32,
            'order': 39,
            'is_free': False
        },
        {
            'title': 'Techniques for Engaging Introductory Paragraphs',
            'description': 'Learn various methods to capture readers attention from the start',
            'content': 'Practice using hooks, questions, quotes, and anecdotes to create compelling introductions.',
            'duration_minutes': 30,
            'order': 40,
            'is_free': False
        },
        
        # Text Types and Purposes
        {
            'title': 'Writing Personal Narratives with Effective Techniques',
            'description': 'Master the art of telling personal stories engagingly',
            'content': 'Learn narrative techniques like dialogue, description, and chronological organization.',
            'duration_minutes': 35,
            'order': 41,
            'is_free': False
        },
        {
            'title': 'Using Precise Words and Sensory Language',
            'description': 'Enhance writing with vivid vocabulary and sensory details',
            'content': 'Learn to choose specific words and use sensory language to create vivid mental pictures.',
            'duration_minutes': 30,
            'order': 42,
            'is_free': False
        },
        {
            'title': 'Creating Persuasive Advertisements',
            'description': 'Learn to write compelling advertisements for products and services',
            'content': 'Master persuasive techniques, target audience analysis, and effective advertising language.',
            'duration_minutes': 32,
            'order': 43,
            'is_free': False
        },
        {
            'title': 'Composing Explanatory Paragraphs',
            'description': 'Learn to explain processes and phenomena clearly in writing',
            'content': 'Practice explaining natural and social processes using clear, logical organization.',
            'duration_minutes': 28,
            'order': 44,
            'is_free': False
        },
        {
            'title': 'Composing Informal Letters',
            'description': 'Master the format and style of personal letter writing',
            'content': 'Learn the structure, tone, and conventions of informal letters to friends and family.',
            'duration_minutes': 25,
            'order': 45,
            'is_free': False
        },
        {
            'title': 'Composing Formal Writing',
            'description': 'Learn to write formal letters, applications, and official documents',
            'content': 'Master formal tone, structure, and language for business and official correspondence.',
            'duration_minutes': 35,
            'order': 46,
            'is_free': False
        },
        {
            'title': 'Taking Notes for Academic Purposes',
            'description': 'Develop effective note-taking strategies for learning and research',
            'content': 'Learn various note-taking methods and how to organize information for study and reference.',
            'duration_minutes': 30,
            'order': 47,
            'is_free': False
        },
        {
            'title': 'Designing Notices and Posters',
            'description': 'Create effective visual communications for different audiences',
            'content': 'Learn design principles, layout, and language for creating impactful notices and posters.',
            'duration_minutes': 28,
            'order': 48,
            'is_free': False
        },
        {
            'title': 'Writing Articles for Publication',
            'description': 'Learn to write engaging articles for magazines and publications',
            'content': 'Master article structure, research, and writing techniques for different types of publications.',
            'duration_minutes': 35,
            'order': 49,
            'is_free': False
        },
        {
            'title': 'Creating Dialogues on Different Themes',
            'description': 'Learn to write realistic conversations between characters',
            'content': 'Practice writing dialogue that sounds natural and advances plot or reveals character.',
            'duration_minutes': 30,
            'order': 50,
            'is_free': False
        },
        
        # Building and Presenting Knowledge
        {
            'title': 'Recording Information from Non-Text Sources',
            'description': 'Learn to gather and organize information from various media',
            'content': 'Practice extracting information from images, charts, graphs, and multimedia sources.',
            'duration_minutes': 32,
            'order': 51,
            'is_free': False
        },
        
        # Narratives, Drama and Poetry
        {
            'title': 'Understanding Oral Literature and Genres',
            'description': 'Explore traditional oral literature and its contribution to meaning',
            'content': 'Learn about folktales, proverbs, riddles, and songs in Ghanaian oral tradition.',
            'duration_minutes': 30,
            'order': 52,
            'is_free': False
        },
        {
            'title': 'Analyzing Elements of Written Literature',
            'description': 'Understand the basic components of literary works',
            'content': 'Learn to identify and analyze character, setting, plot, theme, and point of view.',
            'duration_minutes': 35,
            'order': 53,
            'is_free': False
        },
        {
            'title': 'Using Basic Literary Devices',
            'description': 'Learn to identify and use common literary techniques in texts',
            'content': 'Master simile, metaphor, personification, alliteration, and other basic literary devices.',
            'duration_minutes': 32,
            'order': 54,
            'is_free': False
        }
    ]
    
    total_lessons = 0
    
    print(f"Creating {len(lessons_data)} lessons for {course.title}...")
    print()
    
    for lesson_data in lessons_data:
        # Generate unique slug for the lesson
        base_slug = slugify(lesson_data['title'])
        lesson_slug = base_slug
        counter = 1
        while Lesson.objects.filter(course=course, slug=lesson_slug).exists():
            lesson_slug = f"{base_slug}-{counter}"
            counter += 1
        
        lesson, created = Lesson.objects.get_or_create(
            course=course,
            title=lesson_data['title'],
            defaults={
                'slug': lesson_slug,
                'description': lesson_data['description'],
                'duration_minutes': lesson_data['duration_minutes'],
                'order': lesson_data['order'],
                'is_free': lesson_data['is_free'],
                'is_published': True,
                'lesson_type': 'text'
            }
        )
        
        if created:
            # Create lesson content
            LessonContent.objects.create(
                lesson=lesson,
                content_type='text',
                title=lesson.title,
                text_content=lesson_data['content'],
                order=1
            )
            
            status = 'Free' if lesson.is_free else 'Premium'
            print(f"  ✅ Created: {lesson.title} ({status}) - {lesson.duration_minutes}min")
            total_lessons += 1
        else:
            print(f"  📝 Exists: {lesson.title}")
    
    print(f"\nTotal lessons created: {total_lessons}")
    
    # Update course information
    course.duration_hours = sum(lesson['duration_minutes'] for lesson in lessons_data) // 60
    course.learning_objectives = [
        "Master fundamental English language skills including grammar, vocabulary, and pronunciation",
        "Develop effective oral communication skills for various social contexts",
        "Improve reading comprehension through various strategies and techniques",
        "Learn to write different types of texts including narratives, letters, and explanatory pieces",
        "Understand and analyze basic literary works and oral literature",
        "Use appropriate language register for different audiences and purposes",
        "Apply correct punctuation, capitalization, and sentence structure",
        "Build vocabulary and use context-appropriate words and expressions"
    ]
    course.save()
    
    # Summary
    print(f"\n=== Course Summary ===")
    lesson_count = course.lessons.count()
    free_lessons = course.lessons.filter(is_free=True).count()
    total_duration = sum(lesson.duration_minutes for lesson in course.lessons.all())
    
    print(f"Course: {course.title}")
    print(f"  - Total lessons: {lesson_count}")
    print(f"  - Free lessons: {free_lessons}")
    print(f"  - Premium lessons: {lesson_count - free_lessons}")
    print(f"  - Total duration: {total_duration} minutes ({total_duration//60}h {total_duration%60}m)")
    print(f"  - Course duration: {course.duration_hours} hours")
    print()
    
    print("✅ JHS 1 English curriculum successfully created!")
    print("\nCurriculum covers:")
    print("- Conversation and Everyday Discourse")
    print("- Listening Comprehension")
    print("- English Sounds (Phonetics)")
    print("- Reading Comprehension Strategies")
    print("- Summarising Skills")
    print("- Complete Grammar Foundation")
    print("- Punctuation and Capitalisation")
    print("- Vocabulary Development")
    print("- Writing Skills (Various Text Types)")
    print("- Literature and Oral Tradition")

if __name__ == '__main__':
    create_jhs1_english_lessons()