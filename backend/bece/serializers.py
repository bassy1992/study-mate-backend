from rest_framework import serializers
from .models import (
    BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer,
    BECEPracticeAttempt, BECEUserAnswer, BECEStatistics
)


class BECESubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = BECESubject
        fields = '__all__'


class BECEYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = BECEYear
        fields = '__all__'


class BECEAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BECEAnswer
        fields = '__all__'


class BECEQuestionSerializer(serializers.ModelSerializer):
    answers = BECEAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = BECEQuestion
        fields = '__all__'


class BECEPaperSerializer(serializers.ModelSerializer):
    year = BECEYearSerializer(read_only=True)
    subject = BECESubjectSerializer(read_only=True)
    questions = BECEQuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BECEPaper
        fields = '__all__'
    
    def get_question_count(self, obj):
        return obj.questions.count()


class BECEPaperListSerializer(serializers.ModelSerializer):
    """Simplified serializer for paper lists"""
    year = BECEYearSerializer(read_only=True)
    subject = BECESubjectSerializer(read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BECEPaper
        fields = ('id', 'year', 'subject', 'paper_type', 'title', 
                 'duration_minutes', 'total_marks', 'question_count', 'created_at')
    
    def get_question_count(self, obj):
        return obj.questions.count()


class BECEUserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BECEUserAnswer
        fields = '__all__'
        read_only_fields = ('attempt',)


class BECEPracticeAttemptSerializer(serializers.ModelSerializer):
    user_answers = BECEUserAnswerSerializer(many=True, read_only=True)
    paper = BECEPaperListSerializer(read_only=True)
    
    class Meta:
        model = BECEPracticeAttempt
        fields = '__all__'
        read_only_fields = ('user', 'started_at')


class BECESubmissionSerializer(serializers.Serializer):
    """Serializer for BECE practice submission"""
    paper_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )


class BECEStatisticsSerializer(serializers.ModelSerializer):
    subject = BECESubjectSerializer(read_only=True)
    
    class Meta:
        model = BECEStatistics
        fields = '__all__'
        read_only_fields = ('user',)


class BECEDashboardSerializer(serializers.Serializer):
    """Serializer for BECE dashboard data"""
    subjects = BECESubjectSerializer(many=True, read_only=True)
    recent_attempts = BECEPracticeAttemptSerializer(many=True, read_only=True)
    statistics = BECEStatisticsSerializer(many=True, read_only=True)
    available_years = BECEYearSerializer(many=True, read_only=True)