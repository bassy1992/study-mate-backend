from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/details/', views.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', views.change_password, name='change-password'),
    path('password-reset/request/', views.request_password_reset, name='request-password-reset'),
    path('password-reset/confirm/', views.reset_password, name='reset-password'),
    path('achievements/', views.AchievementListView.as_view(), name='achievements'),
    path('study-sessions/', views.StudySessionListCreateView.as_view(), name='study-sessions'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('upcoming-tasks/', views.upcoming_tasks, name='upcoming-tasks'),
]