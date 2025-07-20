from rest_framework import serializers
from .models import (
    PricingTier, Bundle, Coupon, Order, OrderItem, Payment, Subscription,
    UserPurchase, FAQ, Announcement
)
from courses.serializers import CourseListSerializer


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = '__all__'


class BundleSerializer(serializers.ModelSerializer):
    courses = CourseListSerializer(many=True, read_only=True)
    courses_by_subject = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    course_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Bundle
        fields = '__all__'
    
    def get_course_count(self, obj):
        return obj.courses.count()
    
    def get_subjects(self, obj):
        """Get unique subjects in this bundle"""
        from courses.serializers import SubjectSerializer
        subjects = obj.courses.values_list('subject', flat=True).distinct()
        from courses.models import Subject
        subject_objects = Subject.objects.filter(id__in=subjects)
        return SubjectSerializer(subject_objects, many=True).data
    
    def get_courses_by_subject(self, obj):
        """Group courses by subject"""
        from collections import defaultdict
        courses_by_subject = defaultdict(list)
        
        for course in obj.courses.all():
            subject_data = {
                'id': course.subject.id,
                'name': course.subject.name,
                'code': course.subject.code,
                'icon': course.subject.icon,
                'color': course.subject.color,
            }
            
            course_data = CourseListSerializer(course).data
            
            # Find existing subject or create new entry
            subject_key = course.subject.id
            if subject_key not in courses_by_subject:
                courses_by_subject[subject_key] = {
                    'subject': subject_data,
                    'courses': []
                }
            
            courses_by_subject[subject_key]['courses'].append(course_data)
        
        return list(courses_by_subject.values())


class BundleListSerializer(serializers.ModelSerializer):
    """Simplified serializer for bundle lists"""
    course_count = serializers.SerializerMethodField()
    has_preview_video = serializers.SerializerMethodField()
    
    class Meta:
        model = Bundle
        fields = ('id', 'title', 'slug', 'description', 'bundle_type',
                 'original_price', 'discounted_price', 'discount_percentage',
                 'thumbnail', 'is_featured', 'course_count', 'preview_video_url', 
                 'preview_video_file', 'preview_video_duration', 'preview_video_thumbnail',
                 'has_preview_video', 'created_at')
    
    def get_course_count(self, obj):
        return obj.courses.count()
    
    def get_has_preview_video(self, obj):
        return bool(obj.preview_video_url or obj.preview_video_file)


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'


class CouponValidationSerializer(serializers.Serializer):
    """Serializer for coupon validation"""
    code = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class OrderItemSerializer(serializers.ModelSerializer):
    bundle = BundleListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user', 'order_number', 'created_at')


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders"""
    bundle_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    coupon_code = serializers.CharField(required=False, allow_blank=True)


class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('transaction_id', 'processed_at', 'created_at')


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for payment processing"""
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHODS)
    payment_details = serializers.JSONField(required=False)


class SubscriptionSerializer(serializers.ModelSerializer):
    pricing_tier = PricingTierSerializer(read_only=True)
    
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class SubscriptionCreateSerializer(serializers.Serializer):
    """Serializer for creating subscriptions"""
    pricing_tier_id = serializers.IntegerField()
    billing_cycle = serializers.ChoiceField(choices=Subscription.BILLING_CYCLES)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHODS)


class UserPurchaseSerializer(serializers.ModelSerializer):
    bundle = BundleSerializer(read_only=True)
    
    class Meta:
        model = UserPurchase
        fields = '__all__'
        read_only_fields = ('user', 'purchased_at')


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ('created_at',)


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process"""
    bundle_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHODS)
    
    def validate_bundle_ids(self, value):
        """Validate that all bundle IDs exist and are active"""
        bundles = Bundle.objects.filter(id__in=value, is_active=True)
        if len(bundles) != len(value):
            raise serializers.ValidationError("Some bundles are not available")
        return value