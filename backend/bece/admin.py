from django.contrib import admin
from django import forms
from .models import (
    BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer,
    BECEPracticeAttempt, BECEUserAnswer, BECEStatistics
)


@admin.register(BECESubject)
class BECESubjectAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'name', 'is_core', 'is_active', 'paper_count')
    list_filter = ('is_core', 'is_active')
    search_fields = ('display_name', 'name', 'description')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'display_name', 'description', 'icon')
        }),
        ('Classification', {
            'fields': ('is_core', 'is_active')
        }),
    )
    
    def paper_count(self, obj):
        return obj.papers.count()
    paper_count.short_description = 'Papers'


@admin.register(BECEYear)
class BECEYearAdmin(admin.ModelAdmin):
    list_display = ('year', 'is_available', 'paper_count', 'created_at')
    list_filter = ('is_available', 'created_at')
    search_fields = ('year',)
    ordering = ('-year',)
    
    def paper_count(self, obj):
        return obj.papers.count()
    paper_count.short_description = 'Papers'


class BECEAnswerInline(admin.TabularInline):
    model = BECEAnswer
    extra = 0
    fields = ('option_letter', 'answer_text', 'is_correct')
    
    def get_extra(self, request, obj=None, **kwargs):
        # Only show answer options for multiple choice questions
        if obj and obj.question_type == 'multiple_choice':
            return 4 if not obj.answers.exists() else 0
        return 0


class BECEQuestionInline(admin.TabularInline):
    model = BECEQuestion
    extra = 3
    fields = ('question_number', 'question_type', 'question_text', 'marks', 'difficulty_level', 'topic')
    ordering = ('question_number',)
    
    class Media:
        css = {
            'all': ('admin/css/bece_question_inline.css',)
        }


@admin.register(BECEQuestion)
class BECEQuestionAdmin(admin.ModelAdmin):
    list_display = ('paper', 'question_number', 'question_type', 'marks', 'difficulty_level', 'topic', 'answer_count')
    list_filter = ('question_type', 'difficulty_level', 'paper__subject', 'paper__year', 'topic')
    search_fields = ('question_text', 'topic', 'learning_objective')
    inlines = [BECEAnswerInline]
    
    fieldsets = (
        ('Question Details', {
            'fields': ('paper', 'question_number', 'question_type', 'question_text', 'image')
        }),
        ('Scoring & Classification', {
            'fields': ('marks', 'difficulty_level', 'topic', 'learning_objective')
        }),
        ('Essay Question Settings', {
            'fields': ('essay_instructions', 'word_limit', 'time_limit_minutes'),
            'classes': ('collapse',),
            'description': 'These fields are only relevant for essay-type questions.'
        }),
        ('Additional Information', {
            'fields': ('explanation',),
            'classes': ('collapse',)
        }),
    )
    
    def answer_count(self, obj):
        return obj.answers.count()
    answer_count.short_description = 'Answers'
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        
        # Add help text based on question type
        if obj and obj.question_type == 'essay':
            form.base_fields['essay_instructions'].help_text = "Provide detailed instructions for the essay question."
            form.base_fields['word_limit'].help_text = "Set a word limit for the essay (optional)."
        
        return form


@admin.register(BECEPaper)
class BECEPaperAdmin(admin.ModelAdmin):
    list_display = ('year', 'subject', 'paper_type', 'duration_minutes', 'total_marks', 'question_count', 'is_published')
    list_filter = ('paper_type', 'subject', 'year', 'is_published')
    search_fields = ('title', 'subject__display_name')
    inlines = [BECEQuestionInline]
    
    fieldsets = (
        ('Paper Information', {
            'fields': ('year', 'subject', 'paper_type', 'title')
        }),
        ('Exam Settings', {
            'fields': ('duration_minutes', 'total_marks', 'instructions')
        }),
        ('Publication', {
            'fields': ('is_published',)
        }),
    )
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        
        # Auto-generate title based on year, subject, and paper type
        if not obj:
            form.base_fields['title'].help_text = "Title will be auto-generated if left blank."
        
        return form
    
    def save_model(self, request, obj, form, change):
        # Auto-generate title if not provided
        if not obj.title:
            obj.title = f"{obj.year.year} {obj.subject.display_name} - {obj.get_paper_type_display()}"
        super().save_model(request, obj, form, change)


@admin.register(BECEPracticeAttempt)
class BECEPracticeAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'paper', 'score', 'total_marks', 'percentage', 'is_completed', 'started_at')
    list_filter = ('is_completed', 'paper__subject', 'paper__year', 'started_at')
    search_fields = ('user__email', 'paper__title')
    readonly_fields = ('percentage', 'started_at')
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing object
            return self.readonly_fields + ('user', 'paper')
        return self.readonly_fields


@admin.register(BECEUserAnswer)
class BECEUserAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'is_correct', 'marks_earned', 'answered_at')
    list_filter = ('is_correct', 'question__question_type', 'question__paper__subject', 'answered_at')
    search_fields = ('attempt__user__email', 'question__question_text')
    readonly_fields = ('answered_at',)
    
    fieldsets = (
        ('Answer Information', {
            'fields': ('attempt', 'question', 'answered_at')
        }),
        ('Multiple Choice Answer', {
            'fields': ('selected_answer',),
            'classes': ('collapse',)
        }),
        ('Text Answer', {
            'fields': ('text_answer',),
            'classes': ('collapse',)
        }),
        ('Scoring & Feedback', {
            'fields': ('is_correct', 'marks_earned', 'teacher_feedback')
        }),
        ('Metadata', {
            'fields': ('time_spent_seconds',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BECEStatistics)
class BECEStatisticsAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'total_attempts', 'best_score', 'average_score', 'last_attempt')
    list_filter = ('subject', 'last_attempt')
    search_fields = ('user__email', 'subject__display_name')
    readonly_fields = ('last_attempt',)