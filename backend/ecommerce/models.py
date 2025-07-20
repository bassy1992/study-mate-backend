from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from courses.models import Course

User = get_user_model()


class PricingTier(models.Model):
    """Different pricing tiers for the platform"""
    TIER_TYPES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('pro', 'Pro'),
    ]
    
    name = models.CharField(max_length=50, unique=True)
    tier_type = models.CharField(max_length=20, choices=TIER_TYPES, unique=True)
    description = models.TextField()
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    features = models.JSONField(default=list)
    max_courses = models.IntegerField(default=0)  # 0 = unlimited
    max_quiz_attempts = models.IntegerField(default=0)  # 0 = unlimited
    has_bece_access = models.BooleanField(default=False)
    has_progress_tracking = models.BooleanField(default=True)
    has_certificates = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.name


class Bundle(models.Model):
    """Course bundles/packages"""
    BUNDLE_TYPES = [
        ('subject', 'Subject Bundle'),
        ('level', 'Level Bundle'),
        ('bece_prep', 'BECE Preparation'),
        ('custom', 'Custom Bundle'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    bundle_type = models.CharField(max_length=20, choices=BUNDLE_TYPES)
    courses = models.ManyToManyField(Course, related_name='bundles')
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.IntegerField(default=0)
    thumbnail = models.ImageField(upload_to='bundle_thumbnails/', null=True, blank=True)
    
    # Preview video fields for bundles
    preview_video_url = models.URLField(blank=True, help_text="YouTube, Vimeo, or other video platform URL")
    preview_video_file = models.FileField(upload_to='bundle_previews/', null=True, blank=True, help_text="Upload video file directly")
    preview_video_duration = models.IntegerField(default=0, help_text="Duration in seconds")
    preview_video_thumbnail = models.ImageField(upload_to='bundle_preview_thumbnails/', null=True, blank=True)
    
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def save(self, *args, **kwargs):
        if self.original_price and self.discounted_price:
            self.discount_percentage = int(
                ((self.original_price - self.discounted_price) / self.original_price) * 100
            )
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    @property
    def has_preview_video(self):
        """Check if bundle has a preview video"""
        return bool(self.preview_video_url or self.preview_video_file)
    
    @property
    def preview_video_embed_url(self):
        """Get embeddable URL for preview video"""
        if self.preview_video_url:
            from courses.utils import get_video_embed_url
            return get_video_embed_url(self.preview_video_url)
        return None
    
    @property
    def preview_video_thumbnail_url(self):
        """Get thumbnail URL for preview video"""
        if self.preview_video_thumbnail:
            return self.preview_video_thumbnail.url
        elif self.preview_video_url:
            from courses.utils import get_video_thumbnail_url
            return get_video_thumbnail_url(self.preview_video_url)
        return None
    
    @property
    def formatted_preview_duration(self):
        """Get formatted duration string"""
        if self.preview_video_duration:
            from courses.utils import format_duration
            return format_duration(self.preview_video_duration)
        return None


class Coupon(models.Model):
    """Discount coupons"""
    COUPON_TYPES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200)
    coupon_type = models.CharField(max_length=20, choices=COUPON_TYPES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    usage_limit = models.IntegerField(default=1)
    used_count = models.IntegerField(default=0)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_until and
            self.used_count < self.usage_limit
        )
    
    def __str__(self):
        return self.code


class Order(models.Model):
    """Purchase orders"""
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    bundles = models.ManyToManyField(Bundle, through='OrderItem')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.order_number} - {self.user.email}"


class OrderItem(models.Model):
    """Items in an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.order.order_number} - {self.bundle.title}"


class Payment(models.Model):
    """Payment records"""
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHODS = [
        ('card', 'Credit/Debit Card'),
        ('mobile_money', 'Mobile Money'),
        ('bank_transfer', 'Bank Transfer'),
        ('paypal', 'PayPal'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')
    transaction_id = models.CharField(max_length=100, unique=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount}"


class Subscription(models.Model):
    """User subscriptions"""
    SUBSCRIPTION_STATUS = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('suspended', 'Suspended'),
    ]
    
    BILLING_CYCLES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    pricing_tier = models.ForeignKey(PricingTier, on_delete=models.CASCADE)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    next_billing_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS, default='active')
    auto_renew = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def is_active(self):
        return self.status == 'active' and self.end_date > timezone.now()
    
    def __str__(self):
        return f"{self.user.email} - {self.pricing_tier.name}"


class UserPurchase(models.Model):
    """Track user purchases for access control"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, related_name='purchases')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user', 'bundle']
    
    def __str__(self):
        return f"{self.user.email} - {self.bundle.title}"


class FAQ(models.Model):
    """Frequently Asked Questions"""
    CATEGORIES = [
        ('general', 'General'),
        ('courses', 'Courses'),
        ('payment', 'Payment'),
        ('technical', 'Technical'),
        ('bece', 'BECE'),
    ]
    
    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORIES, default='general')
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['order', 'question']
    
    def __str__(self):
        return self.question


class Announcement(models.Model):
    """Platform announcements"""
    ANNOUNCEMENT_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('success', 'Success'),
        ('maintenance', 'Maintenance'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    announcement_type = models.CharField(max_length=20, choices=ANNOUNCEMENT_TYPES, default='info')
    is_active = models.BooleanField(default=True)
    show_to_all = models.BooleanField(default=True)
    target_users = models.ManyToManyField(User, blank=True, related_name='targeted_announcements')
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title