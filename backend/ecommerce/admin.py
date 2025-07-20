from django.contrib import admin
from .models import (
    PricingTier, Bundle, Coupon, Order, OrderItem, Payment, Subscription,
    UserPurchase, FAQ, Announcement
)


@admin.register(PricingTier)
class PricingTierAdmin(admin.ModelAdmin):
    list_display = ('name', 'tier_type', 'price_monthly', 'price_yearly', 'is_active')
    list_filter = ('tier_type', 'is_active', 'has_bece_access', 'has_certificates')
    search_fields = ('name', 'description')


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ('title', 'bundle_type', 'original_price', 'discounted_price', 'discount_percentage', 'is_featured', 'is_active', 'has_preview_video')
    list_filter = ('bundle_type', 'is_featured', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('courses',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'bundle_type', 'thumbnail')
        }),
        ('Courses & Pricing', {
            'fields': ('courses', 'original_price', 'discounted_price')
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_active', 'valid_until')
        }),
        ('Preview Video', {
            'fields': ('preview_video_url', 'preview_video_file', 'preview_video_duration', 'preview_video_thumbnail'),
            'description': 'Add a preview video to showcase this bundle. You can either provide a URL (YouTube, Vimeo, etc.) or upload a video file directly.'
        }),
    )
    
    def has_preview_video(self, obj):
        return bool(obj.preview_video_url or obj.preview_video_file)
    has_preview_video.boolean = True
    has_preview_video.short_description = 'Has Preview'


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'coupon_type', 'value', 'usage_limit', 'used_count', 'valid_until', 'is_active')
    list_filter = ('coupon_type', 'is_active', 'valid_from', 'valid_until')
    search_fields = ('code', 'description')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__email')
    inlines = [OrderItemInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'order', 'payment_method', 'amount', 'status', 'processed_at')
    list_filter = ('payment_method', 'status', 'currency', 'processed_at')
    search_fields = ('transaction_id', 'order__order_number', 'order__user__email')


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'pricing_tier', 'billing_cycle', 'status', 'start_date', 'end_date', 'auto_renew')
    list_filter = ('pricing_tier', 'billing_cycle', 'status', 'auto_renew', 'start_date')
    search_fields = ('user__email', 'pricing_tier__name')


@admin.register(UserPurchase)
class UserPurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'bundle', 'purchased_at', 'expires_at', 'is_active')
    list_filter = ('is_active', 'purchased_at', 'bundle__bundle_type')
    search_fields = ('user__email', 'bundle__title')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'order', 'is_featured', 'is_active')
    list_filter = ('category', 'is_featured', 'is_active', 'created_at')
    search_fields = ('question', 'answer')
    ordering = ('order', 'question')


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'announcement_type', 'is_active', 'show_to_all', 'valid_from', 'valid_until')
    list_filter = ('announcement_type', 'is_active', 'show_to_all', 'valid_from')
    search_fields = ('title', 'content')
    filter_horizontal = ('target_users',)