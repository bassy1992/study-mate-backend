from django.contrib import admin
from .models import (
    BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer,
    BECEPracticeAttempt, BECEUserAnswer, BECEStatistics
)


@admin.register(BECESubject)
class BECESubjectAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'name', 'is_core', 'is_active')
    list_filter = ('is_core', 'is_active')
    search_fields = ('display_name', 'name')


@admin.register(BECEYear)
class BECEYearAdmin(admin.ModelAdmin):
    list_display = ('year', 'is_available', 'created_at')
    list_filter = ('is_available', 'created_at')
    ordering = ('-year',)


class BECEAnswerInline(admin.TabularInline):
    model = BECEAnswer
    extra = 4


@admin.register(BECEQuestion)
class BECEQuestionAdmin(admin.ModelAdmin):
    list_display = ('paper', 'question_number', 'marks', 'difficulty_level', 'topic')
    list_filter = ('difficulty_level', 'paper__subject', 'paper__year', 'topic')
    search_fields = ('question_text', 'topic')
    inlines = [BECEAnswerInline]


@admin.register(BECEPaper)
class BECEPaperAdmin(admin.ModelAdmin):
    list_display = ('year', 'subject', 'paper_type', 'duration_minutes', 'total_marks', 'is_published')
    list_filter = ('paper_type', 'subject', 'year', 'is_published')
    search_fields = ('title', 'subject__display_name')


@admin.register(BECEPracticeAttempt)
class BECEPracticeAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'paper', 'score', 'total_marks', 'percentage', 'is_completed', 'started_at')
    list_filter = ('is_completed', 'paper__subject', 'paper__year', 'started_at')
    search_fields = ('user__email', 'paper__title')


@admin.register(BECEStatistics)
class BECEStatisticsAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'total_attempts', 'best_score', 'average_score', 'last_attempt')
    list_filter = ('subject', 'last_attempt')
    search_fields = ('user__email', 'subject__display_name')