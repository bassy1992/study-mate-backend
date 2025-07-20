from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Subject, Level, Course, Lesson, LessonContent, Quiz, Question, Answer
from bece.models import BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer
from ecommerce.models import PricingTier, Bundle, FAQ

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create subjects
        subjects_data = [
            {'name': 'Mathematics', 'code': 'MATH', 'description': 'Mathematics courses', 'color': '#FF6B6B'},
            {'name': 'English Language', 'code': 'ENG', 'description': 'English Language courses', 'color': '#4ECDC4'},
            {'name': 'Integrated Science', 'code': 'SCI', 'description': 'Science courses', 'color': '#45B7D1'},
            {'name': 'Social Studies', 'code': 'SOC', 'description': 'Social Studies courses', 'color': '#96CEB4'},
        ]
        
        for subject_data in subjects_data:
            subject, created = Subject.objects.get_or_create(
                code=subject_data['code'],
                defaults=subject_data
            )
            if created:
                self.stdout.write(f'Created subject: {subject.name}')
        
        # Create levels
        levels_data = [
            {'name': 'JHS 1', 'code': 'JHS1', 'description': 'Junior High School 1', 'order': 1},
            {'name': 'JHS 2', 'code': 'JHS2', 'description': 'Junior High School 2', 'order': 2},
            {'name': 'JHS 3', 'code': 'JHS3', 'description': 'Junior High School 3', 'order': 3},
        ]
        
        for level_data in levels_data:
            level, created = Level.objects.get_or_create(
                code=level_data['code'],
                defaults=level_data
            )
            if created:
                self.stdout.write(f'Created level: {level.name}')
        
        # Create courses
        math_subject = Subject.objects.get(code='MATH')
        eng_subject = Subject.objects.get(code='ENG')
        sci_subject = Subject.objects.get(code='SCI')
        
        jhs1 = Level.objects.get(code='JHS1')
        jhs2 = Level.objects.get(code='JHS2')
        jhs3 = Level.objects.get(code='JHS3')
        
        courses_data = [
            {
                'title': 'JHS 1 Mathematics',
                'slug': 'jhs1-mathematics',
                'description': 'Foundation mathematics for JHS 1 students',
                'subject': math_subject,
                'level': jhs1,
                'duration_hours': 40,
                'difficulty': 'beginner',
                'is_published': True
            },
            {
                'title': 'JHS 3 Mathematics',
                'slug': 'jhs3-mathematics',
                'description': 'Advanced mathematics for JHS 3 students preparing for BECE',
                'subject': math_subject,
                'level': jhs3,
                'duration_hours': 60,
                'difficulty': 'advanced',
                'is_premium': True,
                'is_published': True
            },
        ]
        
        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                slug=course_data['slug'],
                defaults=course_data
            )
            if created:
                self.stdout.write(f'Created course: {course.title}')
        
        self.stdout.write('Sample data created successfully!')