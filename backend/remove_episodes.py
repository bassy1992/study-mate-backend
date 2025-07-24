#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bece_platform.settings')
django.setup()

from courses.models import Episode, EpisodeProgress

def remove_all_episodes():
    """Remove all episodes and episode progress from the database"""
    
    try:
        print("Removing all episodes and episode progress...")
        
        # Count existing data
        episode_count = Episode.objects.count()
        progress_count = EpisodeProgress.objects.count()
        
        print(f"Found {episode_count} episodes and {progress_count} episode progress records")
        
        if episode_count > 0 or progress_count > 0:
            # Delete all episode progress first (foreign key constraint)
            deleted_progress = EpisodeProgress.objects.all().delete()
            print(f"✅ Deleted {deleted_progress[0]} episode progress records")
            
            # Delete all episodes
            deleted_episodes = Episode.objects.all().delete()
            print(f"✅ Deleted {deleted_episodes[0]} episodes")
            
            print("\n✅ All episode data removed successfully!")
        else:
            print("No episode data found to remove.")
            
    except Exception as e:
        print(f"❌ Error removing episodes: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    remove_all_episodes()