import re
from urllib.parse import urlparse, parse_qs


def extract_youtube_video_id(url):
    """
    Extract YouTube video ID from various YouTube URL formats
    """
    if not url:
        return None
    
    # Regular expression patterns for different YouTube URL formats
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/v\/([^&\n?#]+)',
        r'youtube\.com\/watch\?.*v=([^&\n?#]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None


def extract_vimeo_video_id(url):
    """
    Extract Vimeo video ID from Vimeo URL
    """
    if not url:
        return None
    
    pattern = r'vimeo\.com\/(?:.*\/)?(\d+)'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    
    return None


def get_video_embed_url(video_url):
    """
    Convert video URL to embeddable format
    """
    if not video_url:
        return None
    
    # YouTube
    youtube_id = extract_youtube_video_id(video_url)
    if youtube_id:
        return f"https://www.youtube.com/embed/{youtube_id}"
    
    # Vimeo
    vimeo_id = extract_vimeo_video_id(video_url)
    if vimeo_id:
        return f"https://player.vimeo.com/video/{vimeo_id}"
    
    # Return original URL if not recognized
    return video_url


def get_video_thumbnail_url(video_url):
    """
    Get thumbnail URL for video
    """
    if not video_url:
        return None
    
    # YouTube thumbnail
    youtube_id = extract_youtube_video_id(video_url)
    if youtube_id:
        return f"https://img.youtube.com/vi/{youtube_id}/maxresdefault.jpg"
    
    # Vimeo thumbnail (requires API call, so return None for now)
    vimeo_id = extract_vimeo_video_id(video_url)
    if vimeo_id:
        # You would need to make an API call to get Vimeo thumbnail
        # For now, return None
        return None
    
    return None


def format_duration(seconds):
    """
    Format duration in seconds to human readable format
    """
    if not seconds:
        return "0:00"
    
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    
    if minutes >= 60:
        hours = minutes // 60
        remaining_minutes = minutes % 60
        return f"{hours}:{remaining_minutes:02d}:{remaining_seconds:02d}"
    else:
        return f"{minutes}:{remaining_seconds:02d}"