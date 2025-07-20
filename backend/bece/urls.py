from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.BECESubjectListView.as_view(), name='bece-subjects'),
    path('years/', views.BECEYearListView.as_view(), name='bece-years'),
    path('papers/', views.BECEPaperListView.as_view(), name='bece-papers'),
    path('papers/<int:pk>/', views.BECEPaperDetailView.as_view(), name='bece-paper-detail'),
    # More specific patterns should come first
    path('practice/submit/', views.submit_bece_practice, name='submit-bece-practice'),
    path('practice/<int:paper_id>/start/', views.start_bece_practice, name='start-bece-practice'),
    path('practice/<str:subject>/', views.bece_practice_by_subject, name='bece-practice-by-subject'),
    path('attempts/', views.BECEAttemptListView.as_view(), name='bece-attempts'),
    path('statistics/', views.BECEStatisticsView.as_view(), name='bece-statistics'),
    path('dashboard/', views.bece_dashboard, name='bece-dashboard'),
    path('performance/<str:subject>/', views.bece_subject_performance, name='bece-subject-performance'),
]