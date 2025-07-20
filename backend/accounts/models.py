from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid
from datetime import timedelta


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    school = models.CharField(max_length=200, blank=True)
    grade_level = models.CharField(max_length=50, blank=True)
    preferred_subjects = models.JSONField(default=list, blank=True)
    study_goals = models.TextField(blank=True)
    daily_study_time = models.IntegerField(default=30)  # minutes
    timezone = models.CharField(max_length=50, default='UTC')
    notification_preferences = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.user.email} Profile"


class Achievement(models.Model):
    ACHIEVEMENT_TYPES = [
        ('quiz', 'Quiz Achievement'),
        ('streak', 'Study Streak'),
        ('completion', 'Course Completion'),
        ('score', 'High Score'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=100)
    description = models.TextField()
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    icon = models.CharField(max_length=50, blank=True)
    earned_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ['user', 'title']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"


class StudySession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='study_sessions')
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    subject = models.CharField(max_length=100, blank=True)
    activity_type = models.CharField(max_length=50, blank=True)  # lesson, quiz, practice
    
    def save(self, *args, **kwargs):
        if self.end_time and self.start_time:
            duration = self.end_time - self.start_time
            self.duration_minutes = int(duration.total_seconds() / 60)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.email} - {self.start_time.date()}"


class UpcomingTask(models.Model):
    TASK_TYPES = [
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
        ('lesson', 'Lesson'),
        ('exam', 'Exam'),
        ('practice', 'Practice'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upcoming_tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    task_type = models.CharField(max_length=20, choices=TASK_TYPES, default='lesson')
    subject = models.CharField(max_length=100)
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    # Optional links to specific course content
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, null=True, blank=True)
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE, null=True, blank=True)
    quiz = models.ForeignKey('courses.Quiz', on_delete=models.CASCADE, null=True, blank=True)
    
    class Meta:
        ordering = ['due_date', '-priority']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
    
    @property
    def days_until_due(self):
        """Calculate days until due date"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        if self.due_date <= now:
            return 0
        
        delta = self.due_date - now
        return delta.days
    
    @property
    def urgency_label(self):
        """Get urgency label based on days until due"""
        days = self.days_until_due
        if days == 0:
            return "Due Today"
        elif days == 1:
            return "Due Tomorrow"
        elif days <= 3:
            return f"{days} days"
        elif days <= 7:
            return f"{days} days"
        else:
            return f"{days} days"
    
    @property
    def urgency_color(self):
        """Get color class based on urgency"""
        days = self.days_until_due
        if days == 0:
            return "red"  # Due today
        elif days <= 1:
            return "orange"  # Due soon
        elif days <= 3:
            return "yellow"  # Due this week
        else:
            return "green"  # Due later