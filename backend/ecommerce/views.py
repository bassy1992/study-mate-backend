from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction, models
from django.conf import settings
import uuid
from .models import (
    PricingTier, Bundle, Coupon, Order, OrderItem, Payment, Subscription,
    UserPurchase, FAQ, Announcement
)
from .serializers import (
    PricingTierSerializer, BundleSerializer, BundleListSerializer,
    CouponValidationSerializer, OrderSerializer, OrderCreateSerializer,
    PaymentSerializer, PaymentCreateSerializer, SubscriptionSerializer,
    SubscriptionCreateSerializer, UserPurchaseSerializer, FAQSerializer,
    AnnouncementSerializer, CheckoutSerializer
)
from .mtn_momo import (
    initiate_mtn_momo_payment, check_mtn_momo_status,
    simulate_mtn_momo_payment, simulate_mtn_momo_status_check
)


class PricingTierListView(generics.ListAPIView):
    queryset = PricingTier.objects.filter(is_active=True).order_by('price_monthly')
    serializer_class = PricingTierSerializer
    permission_classes = [permissions.AllowAny]


class BundleListView(generics.ListAPIView):
    serializer_class = BundleListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Bundle.objects.filter(is_active=True)
        
        # Filter by bundle type
        bundle_type = self.request.query_params.get('type')
        if bundle_type:
            queryset = queryset.filter(bundle_type=bundle_type)
        
        # Filter by featured
        is_featured = self.request.query_params.get('featured')
        if is_featured is not None:
            queryset = queryset.filter(is_featured=is_featured.lower() == 'true')
        
        return queryset.order_by('-is_featured', '-created_at')


class BundleDetailView(generics.RetrieveAPIView):
    queryset = Bundle.objects.filter(is_active=True)
    serializer_class = BundleSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def validate_coupon(request):
    """Validate coupon code"""
    serializer = CouponValidationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    code = serializer.validated_data['code']
    total_amount = serializer.validated_data['total_amount']
    
    try:
        coupon = Coupon.objects.get(code=code)
        
        if not coupon.is_valid():
            return Response(
                {'error': 'Coupon is not valid or has expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if total_amount < coupon.minimum_amount:
            return Response(
                {'error': f'Minimum order amount is {coupon.minimum_amount}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate discount
        if coupon.coupon_type == 'percentage':
            discount_amount = (total_amount * coupon.value) / 100
        else:
            discount_amount = coupon.value
        
        # Ensure discount doesn't exceed total
        discount_amount = min(discount_amount, total_amount)
        
        return Response({
            'valid': True,
            'discount_amount': discount_amount,
            'final_amount': total_amount - discount_amount,
            'coupon': {
                'code': coupon.code,
                'description': coupon.description,
                'type': coupon.coupon_type,
                'value': coupon.value
            }
        })
        
    except Coupon.DoesNotExist:
        return Response(
            {'error': 'Invalid coupon code'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    """Create a new order"""
    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    bundle_ids = serializer.validated_data['bundle_ids']
    coupon_code = serializer.validated_data.get('coupon_code')
    
    # Get bundles
    bundles = Bundle.objects.filter(id__in=bundle_ids, is_active=True)
    if len(bundles) != len(bundle_ids):
        return Response(
            {'error': 'Some bundles are not available'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already owns any of these bundles
    existing_purchases = UserPurchase.objects.filter(
        user=request.user,
        bundle__in=bundles,
        is_active=True
    )
    if existing_purchases.exists():
        owned_bundles = [p.bundle.title for p in existing_purchases]
        return Response(
            {'error': f'You already own: {", ".join(owned_bundles)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        # Create order
        order = Order.objects.create(
            user=request.user,
            order_number=f'ORD-{uuid.uuid4().hex[:8].upper()}'
        )
        
        # Calculate totals
        subtotal = 0
        for bundle in bundles:
            OrderItem.objects.create(
                order=order,
                bundle=bundle,
                unit_price=bundle.discounted_price,
                total_price=bundle.discounted_price
            )
            subtotal += bundle.discounted_price
        
        order.subtotal = subtotal
        
        # Apply coupon if provided
        discount_amount = 0
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if coupon.is_valid() and subtotal >= coupon.minimum_amount:
                    if coupon.coupon_type == 'percentage':
                        discount_amount = (subtotal * coupon.value) / 100
                    else:
                        discount_amount = coupon.value
                    
                    discount_amount = min(discount_amount, subtotal)
                    order.coupon = coupon
            except Coupon.DoesNotExist:
                pass
        
        order.discount_amount = discount_amount
        order.total_amount = subtotal - discount_amount
        order.save()
    
    return Response({
        'order': OrderSerializer(order).data,
        'message': 'Order created successfully'
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_payment(request):
    """Process payment for an order"""
    serializer = PaymentCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    order_id = serializer.validated_data['order_id']
    payment_method = serializer.validated_data['payment_method']
    payment_details = serializer.validated_data.get('payment_details', {})
    
    try:
        order = Order.objects.get(id=order_id, user=request.user, status='pending')
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found or already processed'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=order.total_amount,
            transaction_id=f'TXN-{uuid.uuid4().hex[:12].upper()}',
            gateway_response=payment_details,
            status='completed',  # In real app, this would be 'processing'
            processed_at=timezone.now()
        )
        
        # Update order status
        order.status = 'completed'
        order.save()
        
        # Create user purchases
        for item in order.items.all():
            UserPurchase.objects.create(
                user=request.user,
                bundle=item.bundle,
                order=order
            )
        
        # Update coupon usage if applicable
        if order.coupon:
            order.coupon.used_count += 1
            order.coupon.save()
        
        # Update user premium status if applicable
        premium_bundles = order.items.filter(bundle__bundle_type='bece_prep')
        if premium_bundles.exists():
            request.user.is_premium = True
            request.user.save()
    
    return Response({
        'payment': PaymentSerializer(payment).data,
        'message': 'Payment processed successfully'
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    """Complete checkout process (create order + process payment)"""
    serializer = CheckoutSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Create order first
    order_data = {
        'bundle_ids': serializer.validated_data['bundle_ids'],
        'coupon_code': serializer.validated_data.get('coupon_code')
    }
    
    # Create order
    order_serializer = OrderCreateSerializer(data=order_data)
    if not order_serializer.is_valid():
        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Use the create_order logic
    order_response = create_order(request)
    if order_response.status_code != 200:
        return order_response
    
    order_id = order_response.data['order']['id']
    
    # Process payment
    payment_data = {
        'order_id': order_id,
        'payment_method': serializer.validated_data['payment_method']
    }
    
    payment_serializer = PaymentCreateSerializer(data=payment_data)
    if not payment_serializer.is_valid():
        return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return process_payment(request)


class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class UserPurchaseListView(generics.ListAPIView):
    serializer_class = UserPurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserPurchase.objects.filter(user=self.request.user, is_active=True).order_by('-purchased_at')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_bundle_subjects(request, bundle_id):
    """Get subjects available in a purchased bundle"""
    try:
        # Check if user owns this bundle
        purchase = UserPurchase.objects.get(
            user=request.user,
            bundle_id=bundle_id,
            is_active=True
        )
        
        bundle = purchase.bundle
        
        # Get unique subjects in this bundle
        from collections import defaultdict
        subjects_data = defaultdict(lambda: {'courses': [], 'course_count': 0})
        
        for course in bundle.courses.all():
            subject = course.subject
            subject_key = subject.id
            
            if subject_key not in subjects_data:
                subjects_data[subject_key] = {
                    'id': subject.id,
                    'name': subject.name,
                    'code': subject.code,
                    'description': subject.description,
                    'icon': subject.icon,
                    'color': subject.color,
                    'courses': [],
                    'course_count': 0
                }
            
            from courses.serializers import CourseListSerializer
            course_data = CourseListSerializer(course).data
            subjects_data[subject_key]['courses'].append(course_data)
            subjects_data[subject_key]['course_count'] += 1
        
        return Response({
            'bundle': {
                'id': bundle.id,
                'title': bundle.title,
                'slug': bundle.slug
            },
            'subjects': list(subjects_data.values())
        })
        
    except UserPurchase.DoesNotExist:
        return Response(
            {'error': 'Bundle not found or not purchased'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_bundle_subject_courses(request, bundle_id, subject_id):
    """Get courses for a specific subject within a purchased bundle"""
    try:
        # Check if user owns this bundle
        purchase = UserPurchase.objects.get(
            user=request.user,
            bundle_id=bundle_id,
            is_active=True
        )
        
        bundle = purchase.bundle
        
        # Get courses for this subject in this bundle
        courses = bundle.courses.filter(subject_id=subject_id)
        
        if not courses.exists():
            return Response(
                {'error': 'No courses found for this subject in this bundle'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        from courses.serializers import CourseListSerializer, SubjectSerializer
        from courses.models import Subject
        
        subject = Subject.objects.get(id=subject_id)
        
        return Response({
            'bundle': {
                'id': bundle.id,
                'title': bundle.title,
                'slug': bundle.slug
            },
            'subject': SubjectSerializer(subject).data,
            'courses': CourseListSerializer(courses, many=True).data
        })
        
    except UserPurchase.DoesNotExist:
        return Response(
            {'error': 'Bundle not found or not purchased'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Subject.DoesNotExist:
        return Response(
            {'error': 'Subject not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class SubscriptionListView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_subscription(request):
    """Create a new subscription"""
    serializer = SubscriptionCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    pricing_tier_id = serializer.validated_data['pricing_tier_id']
    billing_cycle = serializer.validated_data['billing_cycle']
    
    try:
        pricing_tier = PricingTier.objects.get(id=pricing_tier_id, is_active=True)
    except PricingTier.DoesNotExist:
        return Response(
            {'error': 'Pricing tier not found'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already has an active subscription
    active_subscription = Subscription.objects.filter(
        user=request.user,
        status='active'
    ).first()
    
    if active_subscription:
        return Response(
            {'error': 'You already have an active subscription'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate dates
    start_date = timezone.now()
    if billing_cycle == 'monthly':
        end_date = start_date + timezone.timedelta(days=30)
        next_billing_date = end_date
    else:  # yearly
        end_date = start_date + timezone.timedelta(days=365)
        next_billing_date = end_date
    
    # Create subscription
    subscription = Subscription.objects.create(
        user=request.user,
        pricing_tier=pricing_tier,
        billing_cycle=billing_cycle,
        start_date=start_date,
        end_date=end_date,
        next_billing_date=next_billing_date
    )
    
    # Update user premium status
    if pricing_tier.tier_type in ['premium', 'pro']:
        request.user.is_premium = True
        request.user.save()
    
    return Response({
        'subscription': SubscriptionSerializer(subscription).data,
        'message': 'Subscription created successfully'
    })


class FAQListView(generics.ListAPIView):
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = FAQ.objects.filter(is_active=True)
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        
        return queryset.order_by('order', 'question')


class AnnouncementListView(generics.ListAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        now = timezone.now()
        queryset = Announcement.objects.filter(
            is_active=True,
            valid_from__lte=now
        )
        
        # Filter by valid_until if set
        queryset = queryset.filter(
            models.Q(valid_until__isnull=True) | models.Q(valid_until__gte=now)
        )
        
        # Filter by target users
        user = self.request.user
        queryset = queryset.filter(
            models.Q(show_to_all=True) | models.Q(target_users=user)
        )
        
        return queryset.order_by('-created_at')


# MTN Mobile Money Payment Endpoints

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def initiate_mtn_momo(request):
    """Initiate MTN Mobile Money payment"""
    
    required_fields = ['phone_number', 'amount', 'bundle_id']
    for field in required_fields:
        if field not in request.data:
            return Response(
                {'error': f'{field} is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    phone_number = request.data['phone_number']
    amount = float(request.data['amount'])
    bundle_id = request.data['bundle_id']
    
    try:
        # Verify bundle exists and user doesn't already own it
        bundle = Bundle.objects.get(id=bundle_id, is_active=True)
        
        existing_purchase = UserPurchase.objects.filter(
            user=request.user,
            bundle=bundle,
            is_active=True
        ).first()
        
        if existing_purchase:
            return Response(
                {'error': 'You already own this bundle'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use simulation for development, real API for production
        if settings.DEBUG:
            result = simulate_mtn_momo_payment(
                phone_number=phone_number,
                amount=amount,
                bundle_id=bundle_id,
                user_id=request.user.id
            )
        else:
            result = initiate_mtn_momo_payment(
                phone_number=phone_number,
                amount=amount,
                bundle_id=bundle_id,
                user_id=request.user.id
            )
        
        if result['success']:
            # Create pending payment record
            with transaction.atomic():
                # Create order
                order = Order.objects.create(
                    user=request.user,
                    order_number=f'ORD-{uuid.uuid4().hex[:8].upper()}',
                    subtotal=amount,
                    total_amount=amount,
                    status='pending'
                )
                
                # Create order item
                OrderItem.objects.create(
                    order=order,
                    bundle=bundle,
                    unit_price=amount,
                    total_price=amount
                )
                
                # Create payment record
                payment = Payment.objects.create(
                    order=order,
                    payment_method='mobile_money',
                    amount=amount,
                    currency='GHS',
                    transaction_id=result['transaction_id'],
                    status='pending'
                )
            
            return Response({
                'success': True,
                'transaction_id': result['transaction_id'],
                'order_id': order.id,
                'payment_id': payment.id,
                'message': result['message']
            })
        else:
            return Response({
                'success': False,
                'error': result.get('error', 'Payment initiation failed'),
                'message': result.get('message', 'Failed to initiate payment')
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Bundle.DoesNotExist:
        return Response(
            {'error': 'Bundle not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_mtn_momo_status(request, transaction_id):
    """Check MTN Mobile Money payment status"""
    
    try:
        # Get payment record
        payment = Payment.objects.get(
            transaction_id=transaction_id,
            order__user=request.user
        )
        
        # If already completed, return current status
        if payment.status in ['completed', 'failed']:
            return Response({
                'success': True,
                'status': payment.status.upper(),
                'transaction_id': transaction_id,
                'order_id': payment.order.id
            })
        
        # Check status with MTN API
        if settings.DEBUG:
            result = simulate_mtn_momo_status_check(transaction_id)
        else:
            result = check_mtn_momo_status(transaction_id)
        
        if result['success']:
            status_mapping = {
                'SUCCESSFUL': 'completed',
                'FAILED': 'failed',
                'PENDING': 'pending'
            }
            
            new_status = status_mapping.get(result['status'], 'pending')
            
            # Update payment status
            if new_status != payment.status:
                with transaction.atomic():
                    payment.status = new_status
                    payment.gateway_response = result
                    
                    if new_status == 'completed':
                        payment.processed_at = timezone.now()
                        payment.order.status = 'completed'
                        payment.order.save()
                        
                        # Create user purchase
                        for item in payment.order.items.all():
                            UserPurchase.objects.get_or_create(
                                user=request.user,
                                bundle=item.bundle,
                                order=payment.order,
                                defaults={'is_active': True}
                            )
                        
                        # Update user premium status if BECE bundle
                        premium_bundles = payment.order.items.filter(
                            bundle__bundle_type='bece_prep'
                        )
                        if premium_bundles.exists():
                            request.user.is_premium = True
                            request.user.save()
                    
                    elif new_status == 'failed':
                        payment.order.status = 'cancelled'
                        payment.order.save()
                    
                    payment.save()
            
            return Response({
                'success': True,
                'status': result['status'],
                'transaction_id': transaction_id,
                'order_id': payment.order.id,
                'financial_transaction_id': result.get('financial_transaction_id'),
                'payment_status': new_status
            })
        else:
            return Response({
                'success': False,
                'error': result.get('error', 'Status check failed'),
                'status': 'UNKNOWN'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_mtn_momo_payment(request):
    """Cancel pending MTN Mobile Money payment"""
    
    transaction_id = request.data.get('transaction_id')
    if not transaction_id:
        return Response(
            {'error': 'transaction_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = Payment.objects.get(
            transaction_id=transaction_id,
            order__user=request.user,
            status='pending'
        )
        
        with transaction.atomic():
            payment.status = 'cancelled'
            payment.order.status = 'cancelled'
            payment.save()
            payment.order.save()
        
        return Response({
            'success': True,
            'message': 'Payment cancelled successfully'
        })
        
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Pending payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )