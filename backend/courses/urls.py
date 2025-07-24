from django.urls import path
from . import views

urlpatterns = [
    path('teachers/', views.TeacherListView.as_view(), name='teachers'),
    path('teachers/<int:id>/', views.TeacherDetailView.as_view(), name='teacher-detail'),
    path('subjects/', views.SubjectListView.as_view(), name='subjects'),
    path('levels/', views.LevelListView.as_view(), name='levels'),
    path('courses/', views.CourseListView.as_view(), name='courses'),
    path('courses/<slug:slug>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/<str:level>/<str:subject>/', views.course_by_level_subject, name='course-by-level-subject'),
    path('lessons/<int:id>/', views.LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:lesson_id>/complete/', views.complete_lesson, name='complete-lesson'),

    path('quizzes/', views.QuizListView.as_view(), name='quizzes'),
    path('quizzes/user/', views.get_user_quizzes, name='user-quizzes'),
    path('quizzes/submit/', views.submit_quiz, name='submit-quiz'),
    path('quizzes/results/<int:attempt_id>/', views.get_quiz_results, name='quiz-results'),
    path('quizzes/<int:quiz_id>/start/', views.start_quiz, name='start-quiz'),
    path('quizzes/<slug:slug>/', views.QuizDetailView.as_view(), name='quiz-detail'),
    path('progress/', views.UserProgressListView.as_view(), name='user-progress'),
    path('quiz-attempts/', views.QuizAttemptListView.as_view(), name='quiz-attempts'),
]