from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from courses.models import Subject, Question, Answer

User = get_user_model()


class BECESubject(models.Model):
    """BECE-specific subjects"""
    BECE_SUBJECTS = [
        ('mathematics', 'Mathematics'),
        ('english_language', 'English Language'),
        ('integrated_science', 'Integrated Science'),
        ('social_studies', 'Social Studies'),
        ('religious_moral_education', 'Religious and Moral Education'),
        ('ghanaian_language', 'Ghanaian Language'),
        ('french', 'French'),
        ('ict', 'Information and Communication Technology'),
        ('creative_arts', 'Creative Arts'),
        ('career_technology', 'Career Technology'),
    ]
    
    name = models.CharField(max_length=50, choices=BECE_SUBJECTS, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    is_core = models.BooleanField(default=True)  # Core vs Elective
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.display_name


class BECEYear(models.Model):
    """BECE examination years"""
    year = models.IntegerField(unique=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-year']
    
    def __str__(self):
        return f"BECE {self.year}"


class BECEPaper(models.Model):
    """BECE past papers"""
    PAPER_TYPES = [
        ('paper1', 'Paper 1 - Objective'),
        ('paper2', 'Paper 2 - Essay'),
    ]
    
    year = models.ForeignKey(BECEYear, on_delete=models.CASCADE, related_name='papers')
    subject = models.ForeignKey(BECESubject, on_delete=models.CASCADE, related_name='papers')
    paper_type = models.CharField(max_length=10, choices=PAPER_TYPES)
    title = models.CharField(max_length=200)
    duration_minutes = models.IntegerField(default=120)
    total_marks = models.IntegerField(default=100)
    instructions = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ['year', 'subject', 'paper_type']
    
    def __str__(self):
        return f"{self.year.year} {self.subject.display_name} - {self.paper_type}"


class BECEQuestion(models.Model):
    """BECE-specific questions"""
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('essay', 'Essay'),
        ('short_answer', 'Short Answer'),
        ('true_false', 'True/False'),
        ('fill_blank', 'Fill in the Blank'),
        ('matching', 'Matching'),
    ]
    
    paper = models.ForeignKey(BECEPaper, on_delete=models.CASCADE, related_name='questions')
    question_number = models.IntegerField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    question_text = models.TextField()
    image = models.ImageField(upload_to='bece_questions/', null=True, blank=True)
    marks = models.IntegerField(default=1)
    difficulty_level = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ], default='medium')
    topic = models.CharField(max_length=100, blank=True)
    
    # Essay-specific fields
    essay_instructions = models.TextField(blank=True, help_text="Instructions for essay questions")
    word_limit = models.IntegerField(null=True, blank=True, help_text="Word limit for essay questions")
    time_limit_minutes = models.IntegerField(null=True, blank=True, help_text="Time limit for this question")
    
    # Additional metadata
    learning_objective = models.CharField(max_length=200, blank=True)
    explanation = models.TextField(blank=True, help_text="Explanation for the correct answer")
    
    class Meta:
        ordering = ['question_number']
        unique_together = ['paper', 'question_number']
    
    def __str__(self):
        return f"{self.paper} - Q{self.question_number} ({self.get_question_type_display()})"
    
    @property
    def is_multiple_choice(self):
        return self.question_type == 'multiple_choice'
    
    @property
    def is_essay(self):
        return self.question_type == 'essay'
    
    @property
    def formatted_marks(self):
        return f"{self.marks} mark{'s' if self.marks != 1 else ''}"


class BECEAnswer(models.Model):
    """Answers for BECE questions"""
    question = models.ForeignKey(BECEQuestion, on_delete=models.CASCADE, related_name='answers')
    option_letter = models.CharField(max_length=1, choices=[
        ('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E')
    ])
    answer_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['question', 'option_letter']
    
    def __str__(self):
        return f"{self.question} - {self.option_letter}"


class BECEPracticeAttempt(models.Model):
    """User attempts at BECE practice tests"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bece_attempts')
    paper = models.ForeignKey(BECEPaper, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)
    total_marks = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    time_taken_minutes = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.email} - {self.paper}"


class BECEUserAnswer(models.Model):
    """User answers for BECE questions"""
    attempt = models.ForeignKey(BECEPracticeAttempt, on_delete=models.CASCADE, related_name='user_answers')
    question = models.ForeignKey(BECEQuestion, on_delete=models.CASCADE)
    
    # For multiple choice questions
    selected_answer = models.ForeignKey(BECEAnswer, on_delete=models.CASCADE, null=True, blank=True)
    
    # For essay and text-based questions
    text_answer = models.TextField(blank=True, help_text="Text answer for essay/short answer questions")
    
    # Scoring and feedback
    is_correct = models.BooleanField(default=False)
    marks_earned = models.IntegerField(default=0)
    teacher_feedback = models.TextField(blank=True, help_text="Teacher feedback for essay questions")
    
    # Metadata
    answered_at = models.DateTimeField(default=timezone.now)
    time_spent_seconds = models.IntegerField(default=0, help_text="Time spent on this question")
    
    class Meta:
        unique_together = ['attempt', 'question']
    
    def __str__(self):
        return f"{self.attempt.user.email} - {self.question}"
    
    @property
    def answer_preview(self):
        """Get a preview of the answer for display"""
        if self.selected_answer:
            return f"Option {self.selected_answer.option_letter}: {self.selected_answer.answer_text[:50]}..."
        elif self.text_answer:
            return self.text_answer[:100] + "..." if len(self.text_answer) > 100 else self.text_answer
        return "No answer provided"


class BECEStatistics(models.Model):
    """User BECE performance statistics"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bece_stats')
    subject = models.ForeignKey(BECESubject, on_delete=models.CASCADE, related_name='user_stats')
    total_attempts = models.IntegerField(default=0)
    best_score = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    total_time_minutes = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'subject']
    
    def __str__(self):
        return f"{self.user.email} - {self.subject.display_name} Stats"