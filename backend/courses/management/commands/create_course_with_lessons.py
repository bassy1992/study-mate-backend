from django.core.management.base import BaseCommand
from django.utils.text import slugify
from courses.models import Course, Lesson, Subject, Level


class Command(BaseCommand):
    help = 'Create a course with lessons quickly'

    def add_arguments(self, parser):
        parser.add_argument('--title', type=str, required=True, help='Course title')
        parser.add_argument('--subject', type=str, required=True, help='Subject code (e.g., MATH, ENG, SCI)')
        parser.add_argument('--level', type=str, required=True, help='Level code (e.g., JHS1, JHS2, JHS3)')
        parser.add_argument('--lessons', type=int, default=5, help='Number of lessons to create')
        parser.add_argument('--description', type=str, help='Course description')

    def handle(self, *args, **options):
        title = options['title']
        subject_code = options['subject'].upper()
        level_code = options['level'].upper()
        num_lessons = options['lessons']
        description = options.get('description') or f'Comprehensive course on {title.lower()}'

        try:
            # Get or create subject
            subject, created = Subject.objects.get_or_create(
                code=subject_code,
                defaults={
                    'name': self.get_subject_name(subject_code),
                    'description': f'{self.get_subject_name(subject_code)} subject',
                    'icon': self.get_subject_icon(subject_code),
                    'color': self.get_subject_color(subject_code)
                }
            )
            if created:
                self.stdout.write(f"✅ Created subject: {subject.name}")

            # Get or create level
            level, created = Level.objects.get_or_create(
                code=level_code,
                defaults={
                    'name': self.get_level_name(level_code),
                    'description': f'{self.get_level_name(level_code)} level',
                    'order': self.get_level_order(level_code)
                }
            )
            if created:
                self.stdout.write(f"✅ Created level: {level.name}")

            # Create course
            course_slug = slugify(title)
            course, created = Course.objects.get_or_create(
                slug=course_slug,
                defaults={
                    'title': title,
                    'description': description,
                    'subject': subject,
                    'level': level,
                    'duration_hours': max(2, num_lessons // 2),
                    'difficulty': 'beginner',
                    'is_premium': False,
                    'is_published': True,
                    'learning_objectives': [
                        f'Understand key concepts in {title.lower()}',
                        f'Apply knowledge through practical exercises',
                        f'Build confidence in {subject.name.lower()}',
                        f'Prepare for assessments and exams'
                    ],
                    'prerequisites': f'Basic understanding of {subject.name.lower()} concepts'
                }
            )

            if created:
                self.stdout.write(f"✅ Created course: {course.title}")
                
                # Create lessons
                for i in range(1, num_lessons + 1):
                    lesson_title = f"Lesson {i}: {self.generate_lesson_title(title, i, num_lessons)}"
                    lesson = Lesson.objects.create(
                        course=course,
                        title=lesson_title,
                        slug=slugify(lesson_title),
                        description=f"Comprehensive lesson covering key concepts in {title.lower()}.",
                        lesson_type='video',
                        order=i,
                        duration_minutes=20 + (i * 5),  # Gradually increase duration
                        video_url=self.get_sample_video_url(subject_code, i),
                        is_free=(i <= 3),  # First 3 lessons are free
                        is_published=True
                    )
                    status = "🆓 FREE" if lesson.is_free else "💎 PREMIUM"
                    self.stdout.write(f"  ✅ Created: {lesson.title} ({lesson.duration_minutes} min) {status}")

                self.stdout.write(f"\n🎉 Successfully created course with {num_lessons} lessons!")
                self.stdout.write(f"📚 Course: {course.title}")
                self.stdout.write(f"🔗 Admin URL: http://127.0.0.1:8000/admin/courses/course/{course.id}/change/")
                self.stdout.write(f"🌐 Preview URL: http://localhost:8080/courses/{course.slug}/preview")
                
            else:
                self.stdout.write(f"⚠️  Course '{title}' already exists with slug '{course_slug}'")

        except Exception as e:
            self.stdout.write(f"❌ Error: {str(e)}")

    def get_subject_name(self, code):
        mapping = {
            'MATH': 'Mathematics',
            'ENG': 'English Language',
            'SCI': 'Integrated Science',
            'SOC': 'Social Studies',
            'ICT': 'Information Technology',
            'BDT': 'Basic Design and Technology',
            'RME': 'Religious and Moral Education',
            'GHA': 'Ghanaian Language',
            'FRE': 'French'
        }
        return mapping.get(code, code.title())

    def get_subject_icon(self, code):
        mapping = {
            'MATH': 'calculator',
            'ENG': 'book-open',
            'SCI': 'flask',
            'SOC': 'globe',
            'ICT': 'computer',
            'BDT': 'tool',
            'RME': 'heart',
            'GHA': 'flag',
            'FRE': 'language'
        }
        return mapping.get(code, 'book')

    def get_subject_color(self, code):
        mapping = {
            'MATH': '#3B82F6',  # Blue
            'ENG': '#10B981',   # Green
            'SCI': '#F59E0B',   # Yellow
            'SOC': '#8B5CF6',   # Purple
            'ICT': '#06B6D4',   # Cyan
            'BDT': '#F97316',   # Orange
            'RME': '#EC4899',   # Pink
            'GHA': '#EF4444',   # Red
            'FRE': '#6366F1'    # Indigo
        }
        return mapping.get(code, '#6B7280')

    def get_level_name(self, code):
        mapping = {
            'JHS1': 'JHS 1',
            'JHS2': 'JHS 2',
            'JHS3': 'JHS 3',
            'SHS1': 'SHS 1',
            'SHS2': 'SHS 2',
            'SHS3': 'SHS 3'
        }
        return mapping.get(code, code)

    def get_level_order(self, code):
        mapping = {
            'JHS1': 1,
            'JHS2': 2,
            'JHS3': 3,
            'SHS1': 4,
            'SHS2': 5,
            'SHS3': 6
        }
        return mapping.get(code, 1)

    def generate_lesson_title(self, course_title, lesson_num, total_lessons):
        # Generate contextual lesson titles based on course title
        if 'fraction' in course_title.lower():
            titles = [
                'Introduction to Fractions',
                'Understanding Decimals',
                'Introduction to Percentages',
                'Converting Between Forms',
                'Operations with Fractions',
                'Decimal Operations',
                'Percentage Calculations',
                'Real-World Applications'
            ]
        elif 'science' in course_title.lower():
            titles = [
                'What is Science?',
                'The Scientific Method',
                'Observation and Hypothesis',
                'Experimentation',
                'Data Analysis and Conclusions',
                'Scientific Tools and Instruments',
                'Safety in Science',
                'Applications of Science'
            ]
        elif 'english' in course_title.lower():
            titles = [
                'Introduction to English Sounds',
                'Consonant Sounds',
                'Vowel Sounds Basics',
                'Advanced Vowel Sounds',
                'Sound Combinations',
                'Pronunciation Practice',
                'Listening Skills',
                'Speaking Fluency'
            ]
        else:
            # Generic titles
            titles = [
                'Introduction and Overview',
                'Basic Concepts',
                'Fundamental Principles',
                'Practical Applications',
                'Advanced Topics',
                'Problem Solving',
                'Review and Practice',
                'Assessment and Evaluation'
            ]
        
        # Extend titles if needed
        while len(titles) < total_lessons:
            titles.extend([
                'Additional Practice',
                'Extended Learning',
                'Supplementary Material',
                'Bonus Content'
            ])
        
        return titles[lesson_num - 1] if lesson_num <= len(titles) else f'Lesson {lesson_num}'

    def get_sample_video_url(self, subject_code, lesson_num):
        # Return educational video URLs based on subject
        math_videos = [
            'https://www.youtube.com/watch?v=S7JbmhYdduA',
            'https://www.youtube.com/watch?v=6VhbXzV7NNs',
            'https://www.youtube.com/watch?v=WYWPuG-8U5Q',
            'https://www.youtube.com/watch?v=7_2aV6st95s',
            'https://www.youtube.com/watch?v=78tZn6eM6jI',
            'https://www.youtube.com/watch?v=Gg4C5V1Vuuq',
            'https://www.youtube.com/watch?v=rGK6bpMYJlA',
            'https://www.youtube.com/watch?v=YWHx0RsRNzI'
        ]
        
        english_videos = [
            'https://www.youtube.com/watch?v=dfoRdKEzCwI',
            'https://www.youtube.com/watch?v=BELlZKpi1Zs',
            'https://www.youtube.com/watch?v=4TjcT7Gto3U',
            'https://www.youtube.com/watch?v=8X5zX3yVoEE',
            'https://www.youtube.com/watch?v=saF3IRiXKNs'
        ]
        
        science_videos = [
            'https://www.youtube.com/watch?v=N6IAzlugWw0',
            'https://www.youtube.com/watch?v=zi8FfMBYCkk',
            'https://www.youtube.com/watch?v=OCV7WqjxgHM',
            'https://www.youtube.com/watch?v=oy7gBfLdUWs',
            'https://www.youtube.com/watch?v=Rd4a1X3B61w'
        ]
        
        video_map = {
            'MATH': math_videos,
            'ENG': english_videos,
            'SCI': science_videos
        }
        
        videos = video_map.get(subject_code, math_videos)
        return videos[(lesson_num - 1) % len(videos)]