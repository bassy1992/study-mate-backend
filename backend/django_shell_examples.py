#!/usr/bin/env python
"""
Django Shell Examples for Adding Episodes

Run this in Django shell:
python manage.py shell

Then copy and paste the code blocks below
"""

# Import required models
from courses.models import Course, Lesson, Episode
from django.utils.text import slugify

# Example 1: Add a single episode
def add_single_episode():
    # Get the lesson
    lesson = Lesson.objects.get(title="Introduction to Fractions")
    
    # Create episode
    episode = Episode.objects.create(
        lesson=lesson,
        title="Understanding Fractions Basics",
        slug=slugify("Understanding Fractions Basics"),
        description="A comprehensive introduction to fractions for beginners.",
        duration_minutes=12,
        video_url="https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
        order=1,
        is_free=True,
        is_published=True
    )
    
    print(f"Created episode: {episode.title}")

# Example 2: Add multiple episodes to a lesson
def add_multiple_episodes():
    # Get the lesson
    lesson = Lesson.objects.get(title="Working with Decimals")
    
    episodes_data = [
        {
            'title': 'Decimal Place Values',
            'description': 'Learn about tenths, hundredths, and thousandths.',
            'duration': 9,
            'video_url': 'https://www.youtube.com/watch?v=EXAMPLE1',
            'is_free': True
        },
        {
            'title': 'Comparing Decimals',
            'description': 'How to compare decimal numbers.',
            'duration': 7,
            'video_url': 'https://www.youtube.com/watch?v=EXAMPLE2',
            'is_free': False
        }
    ]
    
    for i, data in enumerate(episodes_data):
        episode = Episode.objects.create(
            lesson=lesson,
            title=data['title'],
            slug=slugify(data['title']),
            description=data['description'],
            duration_minutes=data['duration'],
            video_url=data['video_url'],
            order=i + 1,
            is_free=data['is_free'],
            is_published=True
        )
        print(f"Created: {episode.title}")

# Example 3: Update existing episode
def update_episode():
    episode = Episode.objects.get(title="What are Fractions?")
    episode.video_url = "https://www.youtube.com/watch?v=NEW_VIDEO_ID"
    episode.duration_minutes = 10
    episode.save()
    print(f"Updated: {episode.title}")

# Example 4: List all episodes for a lesson
def list_episodes():
    lesson = Lesson.objects.get(title="Introduction to Fractions")
    episodes = lesson.episodes.all().order_by('order')
    
    print(f"Episodes in '{lesson.title}':")
    for episode in episodes:
        status = "Free" if episode.is_free else "Premium"
        print(f"  {episode.order}. {episode.title} ({episode.duration_minutes}min) - {status}")

# Example 5: Delete an episode
def delete_episode():
    episode = Episode.objects.get(title="Episode to Delete")
    episode.delete()
    print("Episode deleted")

# Run examples (uncomment the ones you want to use):
# add_single_episode()
# add_multiple_episodes()
# update_episode()
# list_episodes()
# delete_episode()