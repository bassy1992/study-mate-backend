"""
MTN Mobile Money API Integration for Ghana
This module handles MTN MoMo payment processing for the BECE platform
"""

import requests
import uuid
import json
from datetime import datetime, timedelta
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


class MTNMoMoAPI:
    """MTN Mobile Money API Client for Ghana"""
    
    def __init__(self):
        # MTN MoMo Sandbox/Production URLs
        self.base_url = getattr(settings, 'MTN_MOMO_BASE_URL', 'https://sandbox.momodeveloper.mtn.com')
        self.collection_url = f"{self.base_url}/collection"
        
        # API Credentials (should be in environment variables)
        self.subscription_key = getattr(settings, 'MTN_MOMO_SUBSCRIPTION_KEY', 'your-sandbox-api-key')
        self.user_id = getattr(settings, 'MTN_MOMO_USER_ID', '')
        self.api_key = getattr(settings, 'MTN_MOMO_API_KEY', '')
        
        # Environment
        self.environment = getattr(settings, 'MTN_MOMO_ENVIRONMENT', 'sandbox')
        
    def get_access_token(self):
        """Get or refresh access token for MTN MoMo API"""
        
        # Check if we have a cached token
        cached_token = cache.get('mtn_momo_access_token')
        if cached_token:
            return cached_token
            
        url = f"{self.collection_url}/token/"
        
        # Create Basic Auth header with user_id:api_key
        import base64
        auth_string = f"{self.user_id}:{self.api_key}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        
        headers = {
            'Authorization': f'Basic {auth_b64}',
            'Ocp-Apim-Subscription-Key': self.subscription_key,
        }
        
        try:
            response = requests.post(url, headers=headers)
            response.raise_for_status()
            
            token_data = response.json()
            access_token = token_data.get('access_token')
            expires_in = token_data.get('expires_in', 3600)
            
            # Cache the token for slightly less than its expiry time
            cache.set('mtn_momo_access_token', access_token, expires_in - 60)
            
            return access_token
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get MTN MoMo access token: {e}")
            raise Exception("Failed to authenticate with MTN MoMo API")
    
    def request_to_pay(self, phone_number, amount, currency='GHS', external_id=None, payer_message=None, payee_note=None):
        """
        Request payment from MTN MoMo user
        
        Args:
            phone_number (str): Phone number in format 233XXXXXXXXX
            amount (float): Amount to charge
            currency (str): Currency code (EUR for sandbox, GHS for production)
            external_id (str): External reference ID
            payer_message (str): Message to show to payer
            payee_note (str): Note for payee
            
        Returns:
            dict: Payment response with transaction ID and status
        """
        
        access_token = self.get_access_token()
        transaction_id = str(uuid.uuid4())
        
        url = f"{self.collection_url}/v1_0/requesttopay"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'X-Reference-Id': transaction_id,
            'X-Target-Environment': self.environment,
            'Ocp-Apim-Subscription-Key': self.subscription_key,
            'Content-Type': 'application/json',
        }
        
        # Format phone number for MTN API
        formatted_phone = self.format_phone_number(phone_number)
        
        payload = {
            'amount': str(amount),
            'currency': currency,
            'externalId': external_id or transaction_id,
            'payer': {
                'partyIdType': 'MSISDN',
                'partyId': formatted_phone,
            },
            'payerMessage': payer_message or f'Payment for BECE Platform course bundle',
            'payeeNote': payee_note or f'Course bundle purchase - {external_id}',
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 202:  # Accepted
                return {
                    'success': True,
                    'transaction_id': transaction_id,
                    'status': 'PENDING',
                    'message': 'Payment request sent successfully'
                }
            else:
                logger.error(f"MTN MoMo request failed: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f'Payment request failed: {response.status_code}',
                    'message': 'Failed to initiate payment'
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"MTN MoMo request error: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Network error occurred'
            }
    
    def get_transaction_status(self, transaction_id):
        """
        Check the status of a payment transaction
        
        Args:
            transaction_id (str): Transaction ID from request_to_pay
            
        Returns:
            dict: Transaction status and details
        """
        
        access_token = self.get_access_token()
        
        url = f"{self.collection_url}/v1_0/requesttopay/{transaction_id}"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'X-Target-Environment': self.environment,
            'Ocp-Apim-Subscription-Key': self.subscription_key,
        }
        
        try:
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'success': True,
                    'status': data.get('status', 'UNKNOWN'),
                    'amount': data.get('amount'),
                    'currency': data.get('currency'),
                    'financial_transaction_id': data.get('financialTransactionId'),
                    'external_id': data.get('externalId'),
                    'payer': data.get('payer', {}),
                    'reason': data.get('reason', {})
                }
            else:
                logger.error(f"Failed to get transaction status: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f'Status check failed: {response.status_code}',
                    'status': 'UNKNOWN'
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Transaction status check error: {e}")
            return {
                'success': False,
                'error': str(e),
                'status': 'UNKNOWN'
            }
    
    def format_phone_number(self, phone_number):
        """
        Format phone number for MTN MoMo API
        
        Args:
            phone_number (str): Phone number in various formats
            
        Returns:
            str: Formatted phone number (233XXXXXXXXX)
        """
        
        # Remove all non-digits
        digits = ''.join(filter(str.isdigit, phone_number))
        
        # Handle different formats
        if digits.startswith('233'):
            return digits
        elif digits.startswith('0'):
            return '233' + digits[1:]
        elif len(digits) == 9:
            return '233' + digits
        else:
            return digits
    
    def validate_phone_number(self, phone_number):
        """
        Validate if phone number is a valid MTN Ghana number
        
        Args:
            phone_number (str): Phone number to validate
            
        Returns:
            bool: True if valid MTN number
        """
        
        formatted = self.format_phone_number(phone_number)
        
        # MTN Ghana prefixes
        mtn_prefixes = ['23324', '23325', '23353', '23354', '23355', '23359']
        
        return any(formatted.startswith(prefix) for prefix in mtn_prefixes)


# Utility functions for Django views
def initiate_mtn_momo_payment(phone_number, amount, bundle_id, user_id):
    """
    Initiate MTN MoMo payment for course bundle purchase
    
    Args:
        phone_number (str): Customer's MTN number
        amount (float): Payment amount
        bundle_id (int): Course bundle ID
        user_id (int): User ID
        
    Returns:
        dict: Payment initiation result
    """
    
    mtn_api = MTNMoMoAPI()
    
    # Validate MTN number
    if not mtn_api.validate_phone_number(phone_number):
        return {
            'success': False,
            'error': 'Invalid MTN Mobile Money number',
            'message': 'Please provide a valid MTN number (024, 025, 053, 054, 055, 059)'
        }
    
    # Create external reference
    external_id = f"BECE-{bundle_id}-{user_id}-{int(datetime.now().timestamp())}"
    
    # For sandbox, use EUR. For production, use GHS
    currency = 'EUR' if settings.DEBUG else 'GHS'
    
    # Initiate payment
    result = mtn_api.request_to_pay(
        phone_number=phone_number,
        amount=amount,
        currency=currency,
        external_id=external_id,
        payer_message=f'BECE Platform - Course Bundle Purchase',
        payee_note=f'Bundle ID: {bundle_id}, User ID: {user_id}'
    )
    
    return result


def check_mtn_momo_status(transaction_id):
    """
    Check MTN MoMo transaction status
    
    Args:
        transaction_id (str): Transaction ID to check
        
    Returns:
        dict: Transaction status result
    """
    
    mtn_api = MTNMoMoAPI()
    return mtn_api.get_transaction_status(transaction_id)


# Demo/Testing functions
def simulate_mtn_momo_payment(phone_number, amount, bundle_id, user_id):
    """
    Simulate MTN MoMo payment for development/testing
    This function simulates the payment flow without calling actual MTN API
    """
    
    import time
    import random
    
    # Simulate processing delay
    time.sleep(1)
    
    # Generate fake transaction ID
    transaction_id = f"DEMO-MTN-{uuid.uuid4().hex[:12].upper()}"
    
    # Always succeed in development for easier testing
    success = True  # Changed from random.random() > 0.1 for consistent testing
    
    if success:
        return {
            'success': True,
            'transaction_id': transaction_id,
            'status': 'PENDING',
            'message': 'Payment request sent successfully (DEMO)'
        }
    else:
        return {
            'success': False,
            'error': 'Insufficient balance or network error (DEMO)',
            'message': 'Payment failed (DEMO)'
        }


def simulate_mtn_momo_status_check(transaction_id):
    """
    Simulate MTN MoMo status check for development/testing
    """
    
    import time
    import random
    
    # Simulate API delay
    time.sleep(0.5)
    
    # Simulate different statuses based on time
    statuses = ['PENDING', 'PENDING', 'SUCCESSFUL']  # Mostly successful
    status = random.choice(statuses)
    
    return {
        'success': True,
        'status': status,
        'amount': '15.00',
        'currency': 'GHS',
        'financial_transaction_id': f"FT{random.randint(100000, 999999)}",
        'external_id': f"BECE-{random.randint(1, 3)}-{random.randint(1, 100)}",
        'payer': {
            'partyId': '233240000000',
            'partyIdType': 'MSISDN'
        }
    }