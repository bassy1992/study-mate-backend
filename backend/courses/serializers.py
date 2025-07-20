from rest_framework import serializers
from .models import (
    Teacher, Subject, Level, Course, Lesson, LessonContent, Quiz, Question, Answer,
    QuizAttempt, UserAnswer, UserProgress, LessonProgress
)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class TeacherSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    experience_text = serializers.ReadOnlyField()
    primary_subject = SubjectSerializer(read_only=True)
    subjects_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Teacher
        fields = '__all__'


class TeacherListSerializer(serializers.ModelSerializer):
    """Simplified serializer for teacher lists"""
    subjects = SubjectSerializer(many=True, read_only=True)
    experience_text = serializers.ReadOnlyField()
    primary_subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = Teacher
        fields = ('id', 'name', 'bio', 'qualification', 'experience_years', 
                 'experience_text', 'specialization', 'profile_image', 'subjects', 
                 'primary_subject', 'achievements', 'is_featured', 'display_order')


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = '__all__'


class LessonContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonContent
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    contents = LessonContentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    level = LevelSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
    
    def get_lesson_count(self, obj):
        return obj.lessons.filter(is_published=True).count()


class CourseListSerializer(serializers.ModelSerializer):
    """Simplified serializer for course lists"""
    subject = SubjectSerializer(read_only=True)
    level = LevelSerializer(read_only=True)
    lesson_count = serializers.SerializerMethodField()
    has_preview_video = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'title', 'slug', 'description', 'subject', 'level', 
                 'thumbnail', 'duration_hours', 'difficulty', 'is_premium', 
                 'lesson_count', 'preview_video_url', 'preview_video_file', 
                 'preview_video_duration', 'preview_video_thumbnail', 
                 'has_preview_video', 'learning_objectives', 'prerequisites', 'created_at')
    
    def get_lesson_count(self, obj):
        return obj.lessons.filter(is_published=True).count()
    
    def get_has_preview_video(self, obj):
        return bool(obj.preview_video_url or obj.preview_video_file)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = '__all__'
    
    def get_question_count(self, obj):
        return obj.questions.count()


class QuizListSerializer(serializers.ModelSerializer):
    """Simplified serializer for quiz lists"""
    subject = SubjectSerializer(read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = ('id', 'title', 'slug', 'description', 'subject', 'quiz_type',
                 'time_limit_minutes', 'passing_score', 'question_count', 'created_at')
    
    def get_question_count(self, obj):
        return obj.questions.count()


class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = '__all__'
        read_only_fields = ('attempt',)


class QuizAttemptSerializer(serializers.ModelSerializer):
    user_answers = UserAnswerSerializer(many=True, read_only=True)
    quiz = QuizListSerializer(read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = '__all__'
        read_only_fields = ('user', 'started_at')


class QuizSubmissionSerializer(serializers.Serializer):
    """Serializer for quiz submission"""
    quiz_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )


class UserProgressSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    
    class Meta:
        model = UserProgress
        fields = '__all__'
        read_only_fields = ('user',)


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = '__all__'
        read_only_fields = ('user',)


class LessonDetailSerializer(serializers.ModelSerializer):
    """Detailed lesson serializer with progress"""
    contents = LessonContentSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = '__all__'
    
    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = LessonProgress.objects.get(user=request.user, lesson=obj)
                return LessonProgressSerializer(progress).data
            except LessonProgress.DoesNotExist:
                return None
        return None