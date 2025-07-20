#!/usr/bin/env python
"""
Script to remove all lessons from the database
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Lesson, LessonContent, LessonProgress
from django.db import transaction

def remove_all_lessons():
    """Remove all lessons and related data from the database"""
    
    try:
        with transaction.atomic():
            # Count existing records
            lesson_count = Lesson.objects.count()
            content_count = LessonContent.objects.count()
            progress_count = LessonProgress.objects.count()
            
            print(f"📊 Current database state:")
            print(f"  - Lessons: {lesson_count}")
            print(f"  - Lesson Contents: {content_count}")
            print(f"  - Lesson Progress Records: {progress_count}")
            
            if lesson_count == 0:
                print("✅ No lessons found in database. Nothing to remove.")
                return
            
            # Confirm deletion
            confirm = input(f"\n⚠️  This will permanently delete {lesson_count} lessons and all related data. Continue? (yes/no): ")
            if confirm.lower() != 'yes':
                print("❌ Operation cancelled.")
                return
            
            print("\n🗑️  Removing lessons from database...")
            
            # Delete all lesson-related data in correct order
            deleted_progress = LessonProgress.objects.all().delete()[0]
            print(f"  ✅ Deleted {deleted_progress} lesson progress records")
            
            deleted_content = LessonContent.objects.all().delete()[0]
            print(f"  ✅ Deleted {deleted_content} lesson contents")
            
            deleted_lessons = Lesson.objects.all().delete()[0]
            print(f"  ✅ Deleted {deleted_lessons} lessons")
            
            print(f"\n🎉 Successfully removed all lessons from the database!")
            print("   - All lesson data has been permanently deleted")
            print("   - Course preview pages will no longer show lesson lists")
            print("   - User progress data has been cleared")
            
    except Exception as e:
        print(f"❌ Error removing lessons: {str(e)}")
        print("   Database transaction has been rolled back")

if __name__ == '__main__':
    remove_all_lessons()