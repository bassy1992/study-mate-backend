from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class Teacher(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField()
    qualification = models.CharField(max_length=300)
    experience_years = models.IntegerField(default=0)
    specialization = models.CharField(max_length=200)
    
    # Profile image
    profile_image = models.ImageField(upload_to='teacher_profiles/', null=True, blank=True)
    
    # Subjects they teach
    subjects = models.ManyToManyField('Subject', related_name='teachers', blank=True)
    
    # Achievements
    achievements = models.JSONField(default=list, blank=True, help_text="List of achievements")
    
    # Social links
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show on homepage")
    display_order = models.IntegerField(default=0, help_text="Order on homepage")
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', 'name']
    
    def __str__(self):
        return self.name
    
    @property
    def experience_text(self):
        """Return formatted experience text"""
        if self.experience_years == 1:
            return "1 year teaching experience"
        return f"{self.experience_years}+ years teaching experience"
    
    @property
    def primary_subject(self):
        """Return the first subject they teach"""
        return self.subjects.first()
    
    @property
    def subjects_list(self):
        """Return comma-separated list of subjects"""
        return ", ".join([subject.name for subject in self.subjects.all()])


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#000000')  # hex color
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.name


class Level(models.Model):
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='courses')
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    
    # Preview video fields
    preview_video_url = models.URLField(blank=True, help_text="YouTube, Vimeo, or other video platform URL")
    preview_video_file = models.FileField(upload_to='course_previews/', null=True, blank=True, help_text="Upload video file directly")
    preview_video_duration = models.IntegerField(default=0, help_text="Duration in seconds")
    preview_video_thumbnail = models.ImageField(upload_to='course_preview_thumbnails/', null=True, blank=True)
    
    duration_hours = models.IntegerField(default=0)
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='beginner')
    
    # Course content fields
    learning_objectives = models.JSONField(
        default=list, 
        blank=True,
        help_text="List of learning objectives/outcomes for this course"
    )
    prerequisites = models.TextField(
        blank=True,
        help_text="Prerequisites and prior knowledge required for this course"
    )
    
    is_premium = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['subject__name', 'title']
    
    def __str__(self):
        return f"{self.level.name} {self.subject.name}"
    
    @property
    def has_preview_video(self):
        """Check if course has a preview video"""
        return bool(self.preview_video_url or self.preview_video_file)
    
    @property
    def preview_video_embed_url(self):
        """Get embeddable URL for preview video"""
        if self.preview_video_url:
            from .utils import get_video_embed_url
            return get_video_embed_url(self.preview_video_url)
        return None
    
    @property
    def preview_video_thumbnail_url(self):
        """Get thumbnail URL for preview video"""
        if self.preview_video_thumbnail:
            return self.preview_video_thumbnail.url
        elif self.preview_video_url:
            from .utils import get_video_thumbnail_url
            return get_video_thumbnail_url(self.preview_video_url)
        return None
    
    @property
    def formatted_preview_duration(self):
        """Get formatted duration string"""
        if self.preview_video_duration:
            from .utils import format_duration
            return format_duration(self.preview_video_duration)
        return None


class Lesson(models.Model):
    LESSON_TYPES = [
        ('video', 'Video'),
        ('text', 'Text'),
        ('interactive', 'Interactive'),
        ('quiz', 'Quiz'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES, default='text')
    order = models.IntegerField(default=0)
    duration_minutes = models.IntegerField(default=0)
    is_free = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order']
        unique_together = ['course', 'slug']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class LessonContent(models.Model):
    CONTENT_TYPES = [
        ('text', 'Text'),
        ('video', 'Video'),
        ('image', 'Image'),
        ('audio', 'Audio'),
        ('pdf', 'PDF'),
    ]
    
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='contents')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200, blank=True)
    text_content = models.TextField(blank=True)
    file = models.FileField(upload_to='lesson_content/', null=True, blank=True)
    video_url = models.URLField(blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - {self.content_type}"


class Quiz(models.Model):
    QUIZ_TYPES = [
        ('practice', 'Practice Quiz'),
        ('assessment', 'Assessment'),
        ('bece_practice', 'BECE Practice'),
        ('mock_exam', 'Mock Exam'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='quizzes')
    quiz_type = models.CharField(max_length=20, choices=QUIZ_TYPES, default='practice')
    time_limit_minutes = models.IntegerField(default=20)
    passing_score = models.IntegerField(default=70)
    max_attempts = models.IntegerField(default=3)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title


class Question(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
    ]
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    image = models.ImageField(upload_to='question_images/', null=True, blank=True)
    points = models.IntegerField(default=1)
    order = models.IntegerField(default=0)
    explanation = models.TextField(blank=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}"


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.question} - {self.answer_text[:50]}"


class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    time_taken_minutes = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.email} - {self.quiz.title}"


class UserAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='user_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.attempt.user.email} - {self.question}"


class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='user_progress')
    lessons_completed = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    completion_percentage = models.FloatField(default=0.0)
    last_accessed = models.DateTimeField(default=timezone.now)
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'course']
    
    def __str__(self):
        return f"{self.user.email} - {self.course.title}"


class LessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progress')
    is_completed = models.BooleanField(default=False)
    completion_percentage = models.FloatField(default=0.0)
    time_spent_minutes = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'lesson']
    
    def __str__(self):
        return f"{self.user.email} - {self.lesson.title}"