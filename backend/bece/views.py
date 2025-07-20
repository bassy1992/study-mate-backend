from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg, Max
from .models import (
    BECESubject, BECEYear, BECEPaper, BECEQuestion, BECEAnswer,
    BECEPracticeAttempt, BECEUserAnswer, BECEStatistics
)
from .serializers import (
    BECESubjectSerializer, BECEYearSerializer, BECEPaperSerializer,
    BECEPaperListSerializer, BECEQuestionSerializer, BECEPracticeAttemptSerializer,
    BECESubmissionSerializer, BECEStatisticsSerializer, BECEDashboardSerializer
)


def has_bece_access(user):
    """Check if user has access to BECE content"""
    if user.is_premium:
        return True
    
    # Check if user has purchased BECE bundle
    from ecommerce.models import UserPurchase, Bundle
    try:
        bece_bundle = Bundle.objects.get(slug='JHS3')
        return UserPurchase.objects.filter(
            user=user,
            bundle=bece_bundle
        ).exists()
    except Bundle.DoesNotExist:
        return False


class BECESubjectListView(generics.ListAPIView):
    queryset = BECESubject.objects.filter(is_active=True)
    serializer_class = BECESubjectSerializer
    permission_classes = [permissions.AllowAny]


class BECEYearListView(generics.ListAPIView):
    queryset = BECEYear.objects.filter(is_available=True).order_by('-year')
    serializer_class = BECEYearSerializer
    permission_classes = [permissions.AllowAny]


class BECEPaperListView(generics.ListAPIView):
    serializer_class = BECEPaperListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BECEPaper.objects.filter(is_published=True).select_related('year', 'subject')
        
        # Filter by subject
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__name=subject)
        
        # Filter by year
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(year__year=year)
        
        # Filter by paper type
        paper_type = self.request.query_params.get('paper_type')
        if paper_type:
            queryset = queryset.filter(paper_type=paper_type)
        
        return queryset.order_by('-year__year', 'subject__display_name', 'paper_type')


class BECEPaperDetailView(generics.RetrieveAPIView):
    queryset = BECEPaper.objects.filter(is_published=True)
    serializer_class = BECEPaperSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        paper = self.get_object()
        
        # Check if user has access to BECE content
        if not has_bece_access(request.user):
            return Response(
                {'error': 'Premium subscription required for BECE practice'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(paper)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def bece_practice_by_subject(request, subject):
    """Get BECE papers by subject"""
    if not has_bece_access(request.user):
        return Response(
            {'error': 'Premium subscription required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    papers = BECEPaper.objects.filter(
        subject__name=subject,
        is_published=True
    ).select_related('year', 'subject').order_by('-year__year', 'paper_type')
    
    serializer = BECEPaperListSerializer(papers, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_bece_practice(request, paper_id):
    """Start a new BECE practice attempt"""
    if not has_bece_access(request.user):
        return Response(
            {'error': 'Premium subscription required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    paper = get_object_or_404(BECEPaper, id=paper_id, is_published=True)
    
    # Create new attempt
    attempt = BECEPracticeAttempt.objects.create(
        user=request.user,
        paper=paper,
        total_marks=paper.total_marks
    )
    
    return Response({
        'attempt_id': attempt.id,
        'paper': BECEPaperListSerializer(paper).data,
        'message': 'BECE practice started successfully'
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_bece_practice(request):
    """Submit BECE practice answers"""
    serializer = BECESubmissionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    paper_id = serializer.validated_data['paper_id']
    answers = serializer.validated_data['answers']
    
    # Get the latest attempt for this paper
    attempt = BECEPracticeAttempt.objects.filter(
        user=request.user,
        paper_id=paper_id,
        is_completed=False
    ).order_by('-started_at').first()
    
    if not attempt:
        return Response(
            {'error': 'No active practice attempt found'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Process answers
    score = 0
    for answer_data in answers:
        question_id = answer_data.get('question_id')
        selected_answer_id = answer_data.get('answer_id')
        
        try:
            question = BECEQuestion.objects.get(id=question_id, paper_id=paper_id)
            selected_answer = BECEAnswer.objects.get(id=selected_answer_id, question=question)
            
            is_correct = selected_answer.is_correct
            marks_earned = question.marks if is_correct else 0
            score += marks_earned
            
            BECEUserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected_answer,
                is_correct=is_correct,
                marks_earned=marks_earned
            )
        except (BECEQuestion.DoesNotExist, BECEAnswer.DoesNotExist):
            continue
    
    # Complete the attempt
    attempt.score = score
    attempt.percentage = (score / attempt.total_marks) * 100 if attempt.total_marks > 0 else 0
    attempt.is_completed = True
    attempt.save()
    
    # Update user statistics
    stats, created = BECEStatistics.objects.get_or_create(
        user=request.user,
        subject=attempt.paper.subject
    )
    
    stats.total_attempts += 1
    if attempt.score > stats.best_score:
        stats.best_score = attempt.score
    
    # Calculate average score
    all_attempts = BECEPracticeAttempt.objects.filter(
        user=request.user,
        paper__subject=attempt.paper.subject,
        is_completed=True
    )
    stats.average_score = all_attempts.aggregate(avg=Avg('score'))['avg'] or 0
    stats.last_attempt = attempt.completed_at
    stats.save()
    
    return Response({
        'attempt': BECEPracticeAttemptSerializer(attempt).data,
        'statistics': BECEStatisticsSerializer(stats).data,
        'message': 'BECE practice submitted successfully'
    })


class BECEAttemptListView(generics.ListAPIView):
    serializer_class = BECEPracticeAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = BECEPracticeAttempt.objects.filter(user=self.request.user).order_by('-started_at')
        
        # Filter by subject
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(paper__subject__name=subject)
        
        return queryset


class BECEStatisticsView(generics.ListAPIView):
    serializer_class = BECEStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BECEStatistics.objects.filter(user=self.request.user).select_related('subject')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def bece_dashboard(request):
    """Get BECE dashboard data"""
    # Check if user has purchased BECE bundle
    from ecommerce.models import UserPurchase, Bundle
    try:
        bece_bundle = Bundle.objects.get(slug='JHS3')
        has_bece_access = UserPurchase.objects.filter(
            user=request.user,
            bundle=bece_bundle
        ).exists()
        
        if not has_bece_access:
            return Response(
                {'error': 'Premium subscription required'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Bundle.DoesNotExist:
        return Response(
            {'error': 'BECE bundle not available'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get subjects
    subjects = BECESubject.objects.filter(is_active=True)
    
    # Get recent attempts
    recent_attempts = BECEPracticeAttempt.objects.filter(
        user=request.user,
        is_completed=True
    ).order_by('-completed_at')[:5]
    
    # Get statistics
    statistics = BECEStatistics.objects.filter(user=request.user).select_related('subject')
    
    # Get available years
    available_years = BECEYear.objects.filter(is_available=True).order_by('-year')
    
    return Response({
        'subjects': BECESubjectSerializer(subjects, many=True).data,
        'recent_attempts': BECEPracticeAttemptSerializer(recent_attempts, many=True).data,
        'statistics': BECEStatisticsSerializer(statistics, many=True).data,
        'available_years': BECEYearSerializer(available_years, many=True).data,
        'total_attempts': BECEPracticeAttempt.objects.filter(user=request.user, is_completed=True).count(),
        'subjects_practiced': statistics.count()
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def bece_subject_performance(request, subject):
    """Get detailed performance for a specific BECE subject"""
    if not has_bece_access(request.user):
        return Response(
            {'error': 'Premium subscription required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        bece_subject = BECESubject.objects.get(name=subject, is_active=True)
    except BECESubject.DoesNotExist:
        return Response(
            {'error': 'Subject not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get attempts for this subject
    attempts = BECEPracticeAttempt.objects.filter(
        user=request.user,
        paper__subject=bece_subject,
        is_completed=True
    ).order_by('-completed_at')
    
    # Get statistics
    try:
        stats = BECEStatistics.objects.get(user=request.user, subject=bece_subject)
        stats_data = BECEStatisticsSerializer(stats).data
    except BECEStatistics.DoesNotExist:
        stats_data = None
    
    # Get available papers
    papers = BECEPaper.objects.filter(
        subject=bece_subject,
        is_published=True
    ).order_by('-year__year', 'paper_type')
    
    return Response({
        'subject': BECESubjectSerializer(bece_subject).data,
        'attempts': BECEPracticeAttemptSerializer(attempts, many=True).data,
        'statistics': stats_data,
        'available_papers': BECEPaperListSerializer(papers, many=True).data,
        'performance_trend': [
            {
                'date': attempt.completed_at.date(),
                'score': attempt.score,
                'percentage': attempt.percentage
            }
            for attempt in attempts[:10]  # Last 10 attempts
        ]
    })