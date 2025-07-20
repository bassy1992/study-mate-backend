from django.urls import path
from . import views

urlpatterns = [
    path('pricing-tiers/', views.PricingTierListView.as_view(), name='pricing-tiers'),
    path('bundles/', views.BundleListView.as_view(), name='bundles'),
    path('bundles/<slug:slug>/', views.BundleDetailView.as_view(), name='bundle-detail'),
    path('coupons/validate/', views.validate_coupon, name='validate-coupon'),
    path('orders/create/', views.create_order, name='create-order'),
    path('orders/', views.UserOrderListView.as_view(), name='user-orders'),
    path('payments/process/', views.process_payment, name='process-payment'),
    path('checkout/', views.checkout, name='checkout'),
    path('purchases/', views.UserPurchaseListView.as_view(), name='user-purchases'),
    path('bundles/<int:bundle_id>/subjects/', views.get_bundle_subjects, name='bundle-subjects'),
    path('bundles/<int:bundle_id>/subjects/<int:subject_id>/courses/', views.get_bundle_subject_courses, name='bundle-subject-courses'),
    path('subscriptions/', views.SubscriptionListView.as_view(), name='subscriptions'),
    path('subscriptions/create/', views.create_subscription, name='create-subscription'),
    path('faqs/', views.FAQListView.as_view(), name='faqs'),
    path('announcements/', views.AnnouncementListView.as_view(), name='announcements'),
    
    # MTN Mobile Money endpoints
    path('mtn-momo/initiate/', views.initiate_mtn_momo, name='initiate-mtn-momo'),
    path('mtn-momo/status/<str:transaction_id>/', views.check_mtn_momo_status, name='check-mtn-momo-status'),
    path('mtn-momo/cancel/', views.cancel_mtn_momo_payment, name='cancel-mtn-momo'),
]