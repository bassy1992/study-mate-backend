from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile, Achievement, StudySession, UpcomingTask


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_premium', 'is_staff', 'date_joined')
    list_filter = ('is_premium', 'is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone_number', 'date_of_birth', 'profile_picture', 'is_premium')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'grade_level', 'daily_study_time')
    list_filter = ('grade_level', 'daily_study_time')
    search_fields = ('user__email', 'school')


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'achievement_type', 'earned_at')
    list_filter = ('achievement_type', 'earned_at')
    search_fields = ('user__email', 'title')


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_time', 'duration_minutes', 'subject', 'activity_type')
    list_filter = ('activity_type', 'subject', 'start_time')
    search_fields = ('user__email', 'subject')


@admin.register(UpcomingTask)
class UpcomingTaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'task_type', 'subject', 'due_date', 'priority', 'is_completed')
    list_filter = ('task_type', 'priority', 'is_completed', 'subject', 'due_date')
    search_fields = ('user__email', 'title', 'subject')
    date_hierarchy = 'due_date'
    ordering = ('due_date', '-priority')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'description', 'task_type', 'subject')
        }),
        ('Scheduling', {
            'fields': ('due_date', 'priority', 'is_completed')
        }),
        ('Content Links', {
            'fields': ('course', 'lesson', 'quiz'),
            'classes': ('collapse',)
        }),
    )