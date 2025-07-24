-- SQL Examples for Adding Episodes Directly to Database
-- Use with caution! Make sure to backup your database first.

-- 1. View existing lessons to get lesson IDs
SELECT id, title, course_id FROM courses_lesson WHERE course_id = (
    SELECT id FROM courses_course WHERE slug = 'fractions-decimals-and-percentages'
);

-- 2. Insert a new episode
INSERT INTO courses_episode (
    lesson_id, 
    title, 
    slug, 
    description, 
    "order", 
    duration_minutes, 
    video_url, 
    is_free, 
    is_published, 
    created_at, 
    updated_at
) VALUES (
    68,  -- Replace with actual lesson ID
    'New Episode Title',
    'new-episode-title',
    'Description of the new episode',
    1,
    10,
    'https://www.youtube.com/watch?v=VIDEO_ID',
    true,
    true,
    NOW(),
    NOW()
);

-- 3. View all episodes for a lesson
SELECT 
    e.id,
    e.title,
    e.duration_minutes,
    e.is_free,
    e.is_published,
    l.title as lesson_title
FROM courses_episode e
JOIN courses_lesson l ON e.lesson_id = l.id
WHERE l.id = 68  -- Replace with actual lesson ID
ORDER BY e."order";

-- 4. Update an episode
UPDATE courses_episode 
SET 
    video_url = 'https://www.youtube.com/watch?v=NEW_VIDEO_ID',
    duration_minutes = 12,
    updated_at = NOW()
WHERE title = 'What are Fractions?';

-- 5. Delete an episode
DELETE FROM courses_episode WHERE title = 'Episode to Delete';