#!/usr/bin/env python
"""
Script to add preview videos to existing courses and bundles
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Course
from ecommerce.models import Bundle

def add_sample_preview_videos():
    """Add sample preview videos to courses and bundles"""
    
    # Sample YouTube video URLs (you can replace these with actual preview videos)
    sample_videos = [
        {
            'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'duration': 180,  # 3 minutes
        },
        {
            'url': 'https://www.youtube.com/watch?v=9bZkp7q19f0',
            'duration': 240,  # 4 minutes
        },
        {
            'url': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
            'duration': 300,  # 5 minutes
        },
    ]
    
    # Add preview videos to courses
    courses = Course.objects.filter(is_published=True)
    print(f"Found {courses.count()} published courses")
    
    for i, course in enumerate(courses):
        video_data = sample_videos[i % len(sample_videos)]
        course.preview_video_url = video_data['url']
        course.preview_video_duration = video_data['duration']
        course.save()
        print(f"Added preview video to course: {course.title}")
    
    # Add preview videos to bundles
    bundles = Bundle.objects.filter(is_active=True)
    print(f"\nFound {bundles.count()} active bundles")
    
    for i, bundle in enumerate(bundles):
        video_data = sample_videos[i % len(sample_videos)]
        bundle.preview_video_url = video_data['url']
        bundle.preview_video_duration = video_data['duration']
        bundle.save()
        print(f"Added preview video to bundle: {bundle.title}")
    
    print("\nPreview videos added successfully!")

if __name__ == '__main__':
    add_sample_preview_videos()