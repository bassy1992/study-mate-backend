#!/usr/bin/env python
"""
Setup Railway PostgreSQL database for BECE Platform
"""
import os
import django
import sys

# Set the Railway database URL
os.environ['DATABASE_URL'] = 'postgresql://postgres:AuKnRSxpuRvZbrYgREpwwEadaNnABoVh@hopper.proxy.rlwy.net:18031/railway'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')

# Setup Django
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))
django.setup()

from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model
from courses.models import Subject, Level, Course, Lesson
from bece.models import BECESubject, BECEYear

def setup_railway_database():
    print("🚀 Setting up Railway PostgreSQL database for BECE Platform...")
    
    # Run migrations
    print("\n1. Running database migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    print("✅ Migrations completed")
    
    # Create superuser
    print("\n2. Creating superuser...")
    User = get_user_model()
    
    if not User.objects.filter(is_superuser=True).exists():
        User.objects.create_superuser(
            email='admin@beceplatform.com',
            username='admin',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print("✅ Superuser created: admin@beceplatform.com / admin123")
    else:
        print("✅ Superuser already exists")
    
    # Set up basic structure
    print("\n3. Setting up basic structure...")
    
    # Create subjects
    subjects_data = [
        {'name': 'Mathematics', 'code': 'MATH', 'icon': 'calculator', 'color': '#2196F3'},
        {'name': 'English Language', 'code': 'ENG', 'icon': 'book', 'color': '#4CAF50'},
        {'name': 'Integrated Science', 'code': 'SCI', 'icon': 'science', 'color': '#FF9800'},
        {'name': 'Social Studies', 'code': 'SOC', 'icon': 'globe', 'color': '#9C27B0'},
        {'name': 'French', 'code': 'FRE', 'icon': 'language', 'color': '#F44336'},
        {'name': 'ICT', 'code': 'ICT', 'icon': 'computer', 'color': '#607D8B'},
    ]
    
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            name=subject_data['name'],
            defaults=subject_data
        )
        if created:
            print(f"  ✅ Created subject: {subject.name}")
    
    # Create levels
    levels_data = [
        {'name': 'JHS 1', 'code': 'JHS1', 'order': 1},
        {'name': 'JHS 2', 'code': 'JHS2', 'order': 2},
        {'name': 'JHS 3', 'code': 'JHS3', 'order': 3},
    ]
    
    for level_data in levels_data:
        level, created = Level.objects.get_or_create(
            name=level_data['name'],
            defaults=level_data
        )
        if created:
            print(f"  ✅ Created level: {level.name}")
    
    # Create BECE subjects
    bece_subjects_data = [
        {'name': 'mathematics', 'display_name': 'Mathematics', 'is_core': True},
        {'name': 'english_language', 'display_name': 'English Language', 'is_core': True},
        {'name': 'integrated_science', 'display_name': 'Integrated Science', 'is_core': True},
        {'name': 'social_studies', 'display_name': 'Social Studies', 'is_core': True},
    ]
    
    for subject_data in bece_subjects_data:
        subject, created = BECESubject.objects.get_or_create(
            name=subject_data['name'],
            defaults=subject_data
        )
        if created:
            print(f"  ✅ Created BECE subject: {subject.display_name}")
    
    # Create BECE years
    current_year = 2024
    for year in range(current_year - 9, current_year + 1):
        bece_year, created = BECEYear.objects.get_or_create(
            year=year,
            defaults={'is_available': True}
        )
        if created:
            print(f"  ✅ Created BECE year: {year}")
    
    print("\n🎉 Railway database setup complete!")
    print("\n📊 Database Summary:")
    print(f"  - Subjects: {Subject.objects.count()}")
    print(f"  - Levels: {Level.objects.count()}")
    print(f"  - BECE Subjects: {BECESubject.objects.count()}")
    print(f"  - BECE Years: {BECEYear.objects.count()}")
    print(f"  - Users: {User.objects.count()}")
    
    print("\n🔗 Your production platform is ready at:")
    print("  https://study-mate-4z66l0s6t-bassys-projects-fca17413.vercel.app")
    print("\n🔧 Admin access:")
    print("  URL: https://study-mate-4z66l0s6t-bassys-projects-fca17413.vercel.app/admin/")
    print("  Email: admin@beceplatform.com")
    print("  Password: admin123")

if __name__ == '__main__':
    setup_railway_database()