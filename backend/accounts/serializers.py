from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, UserProfile, Achievement, StudySession


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('user',)


class CustomUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 
                 'phone_number', 'date_of_birth', 'profile_picture', 
                 'is_premium', 'created_at', 'profile')
        read_only_fields = ('id', 'created_at', 'is_premium')


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'
        read_only_fields = ('user', 'earned_at')


class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySession
        fields = '__all__'
        read_only_fields = ('user', 'duration_minutes')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value