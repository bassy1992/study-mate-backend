from django.contrib import admin
from django import forms
from .models import (
    Teacher, Subject, Level, Course, Lesson, LessonContent, Quiz, Question, Answer,
    QuizAttempt, UserAnswer, UserProgress, LessonProgress
)


class TeacherAdminForm(forms.ModelForm):
    achievements_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 80}),
        required=False,
        help_text="Enter achievements, one per line. These will be converted to a list automatically."
    )
    
    class Meta:
        model = Teacher
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.achievements:
            # Convert list to text for editing
            self.fields['achievements_text'].initial = '\n'.join(self.instance.achievements)
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        # Convert text to list
        achievements_text = self.cleaned_data.get('achievements_text', '')
        if achievements_text:
            instance.achievements = [
                achievement.strip() for achievement in achievements_text.split('\n') 
                if achievement.strip()
            ]
        else:
            instance.achievements = []
        
        if commit:
            instance.save()
        return instance


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    form = TeacherAdminForm
    list_display = ('name', 'subjects_display', 'experience_years', 'is_featured', 'is_active', 'display_order')
    list_filter = ('is_active', 'is_featured', 'subjects', 'experience_years')
    search_fields = ('name', 'email', 'qualification', 'specialization')
    filter_horizontal = ('subjects',)
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'email', 'phone', 'profile_image')
        }),
        ('Professional Details', {
            'fields': ('bio', 'qualification', 'experience_years', 'specialization', 'subjects')
        }),
        ('Achievements', {
            'fields': ('achievements_text',),
            'description': 'Enter teacher achievements, one per line.'
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        ('Display Settings', {
            'fields': ('is_active', 'is_featured', 'display_order'),
            'description': 'Featured teachers appear on the homepage.'
        }),
    )
    
    def subjects_display(self, obj):
        return ", ".join([subject.name for subject in obj.subjects.all()[:3]])
    subjects_display.short_description = 'Subjects'


class CourseAdminForm(forms.ModelForm):
    learning_objectives_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 8, 'cols': 80}),
        required=False,
        help_text="Enter learning objectives, one per line. These will be converted to a list automatically."
    )
    
    class Meta:
        model = Course
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.learning_objectives:
            # Convert list to text for editing
            self.fields['learning_objectives_text'].initial = '\n'.join(self.instance.learning_objectives)
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        # Convert text to list
        objectives_text = self.cleaned_data.get('learning_objectives_text', '')
        if objectives_text:
            instance.learning_objectives = [
                obj.strip() for obj in objectives_text.split('\n') 
                if obj.strip()
            ]
        else:
            instance.learning_objectives = []
        
        if commit:
            instance.save()
        return instance


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'code')


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'code')
    ordering = ('order',)


# Inline classes need to be defined before they're used
class LessonContentInline(admin.TabularInline):
    model = LessonContent
    extra = 1
    fields = ('content_type', 'title', 'text_content', 'video_url', 'file', 'order')


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 3
    fields = ('title', 'slug', 'order', 'duration_minutes', 'video_url', 'video_file', 'is_free', 'is_published')
    prepopulated_fields = {'slug': ('title',)}
    verbose_name = "Lesson"
    verbose_name_plural = "Course Lessons"
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        
        # Add help text to fields
        formset.form.base_fields['title'].help_text = 'e.g., "Lesson 1: Introduction to Fractions"'
        formset.form.base_fields['order'].help_text = 'Lesson sequence (1, 2, 3, etc.)'
        formset.form.base_fields['duration_minutes'].help_text = 'Duration in minutes'
        formset.form.base_fields['video_url'].help_text = 'YouTube, Vimeo, or other video platform URL'
        formset.form.base_fields['video_file'].help_text = 'Or upload video file directly'
        formset.form.base_fields['is_free'].help_text = 'Allow access without enrollment'
        formset.form.base_fields['is_published'].help_text = 'Make visible to students'
        
        return formset
    
    class Media:
        css = {
            'all': ('admin/css/lesson_inline.css',)
        }


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    form = CourseAdminForm
    list_display = ('title', 'subject', 'level', 'difficulty', 'is_premium', 'is_published', 'has_preview_video', 'lesson_count', 'created_at')
    list_filter = ('subject', 'level', 'difficulty', 'is_premium', 'is_published', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'subject', 'level', 'thumbnail')
        }),
        ('Course Content', {
            'fields': ('learning_objectives_text', 'prerequisites'),
            'description': 'Define what students will learn and what they need to know before starting this course.'
        }),
        ('Course Details', {
            'fields': ('duration_hours', 'difficulty', 'is_premium', 'is_published')
        }),
        ('Preview Video', {
            'fields': ('preview_video_url', 'preview_video_file', 'preview_video_duration', 'preview_video_thumbnail'),
            'description': 'Add a preview video to showcase this course. You can either provide a URL (YouTube, Vimeo, etc.) or upload a video file directly.'
        }),
    )
    
    def has_preview_video(self, obj):
        return bool(obj.preview_video_url or obj.preview_video_file)
    has_preview_video.boolean = True
    has_preview_video.short_description = 'Has Preview'
    
    def lesson_count(self, obj):
        return obj.lessons.count()
    lesson_count.short_description = 'Lessons'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'lesson_type', 'order', 'duration_minutes', 'is_free', 'is_published', 'has_video')
    list_filter = ('lesson_type', 'is_free', 'is_published', 'course__subject', 'course__level')
    search_fields = ('title', 'description', 'course__title')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonContentInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('course', 'title', 'slug', 'description', 'lesson_type', 'order')
        }),
        ('Video Content', {
            'fields': ('video_url', 'video_file', 'video_duration', 'video_thumbnail'),
            'description': 'Add video content for this lesson. You can either provide a URL or upload a file.'
        }),
        ('Settings', {
            'fields': ('duration_minutes', 'is_free', 'is_published'),
            'description': 'Configure lesson settings and availability.'
        }),
    )
    
    def has_video(self, obj):
        return obj.has_video
    has_video.boolean = True
    has_video.short_description = 'Has Video'


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'question_type', 'order', 'points')
    list_filter = ('question_type', 'quiz__subject', 'quiz__quiz_type')
    search_fields = ('question_text', 'quiz__title')
    inlines = [AnswerInline]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'quiz_type', 'time_limit_minutes', 'passing_score', 'is_published')
    list_filter = ('quiz_type', 'subject', 'is_published', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'total_questions', 'is_completed', 'started_at')
    list_filter = ('is_completed', 'quiz__subject', 'started_at')
    search_fields = ('user__email', 'quiz__title')


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'completion_percentage', 'lessons_completed', 'total_lessons', 'last_accessed')
    list_filter = ('course__subject', 'course__level', 'last_accessed')
    search_fields = ('user__email', 'course__title')


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_completed', 'completion_percentage', 'time_spent_minutes', 'last_accessed')
    list_filter = ('is_completed', 'lesson__course__subject', 'last_accessed')
    search_fields = ('user__email', 'lesson__title')


