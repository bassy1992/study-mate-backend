"""
Brevo (Sendinblue) Email Service
Handles sending emails through Brevo API
"""

import requests
import logging
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class BrevoEmailService:
    """Service class for sending emails through Brevo API"""
    
    def __init__(self):
        self.api_key = settings.BREVO_API_KEY
        self.api_url = settings.BREVO_API_URL
        self.from_email = settings.DEFAULT_FROM_EMAIL
        self.from_name = settings.DEFAULT_FROM_NAME
        
        if not self.api_key or self.api_key == 'your-brevo-api-key-here':
            logger.warning("Brevo API key not configured. Email sending will be simulated.")
    
    def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        template_id: Optional[int] = None,
        template_params: Optional[Dict] = None
    ) -> Dict:
        """
        Send an email through Brevo API
        
        Args:
            to_email: Recipient email address
            to_name: Recipient name
            subject: Email subject
            html_content: HTML content of the email
            text_content: Plain text content (optional)
            template_id: Brevo template ID (optional)
            template_params: Template parameters (optional)
        
        Returns:
            Dict with success status and message
        """
        
        # If API key is not configured, simulate email sending
        if not self.api_key or self.api_key == 'your-brevo-api-key-here':
            return self._simulate_email_send(to_email, subject)
        
        headers = {
            'accept': 'application/json',
            'api-key': self.api_key,
            'content-type': 'application/json'
        }
        
        # Prepare email data
        email_data = {
            'sender': {
                'name': self.from_name,
                'email': self.from_email
            },
            'to': [
                {
                    'email': to_email,
                    'name': to_name
                }
            ],
            'subject': subject
        }
        
        # Use template if provided
        if template_id and template_params:
            email_data['templateId'] = template_id
            email_data['params'] = template_params
        else:
            # Use custom content
            email_data['htmlContent'] = html_content
            if text_content:
                email_data['textContent'] = text_content
            else:
                email_data['textContent'] = strip_tags(html_content)
        
        try:
            response = requests.post(
                f'{self.api_url}/smtp/email',
                headers=headers,
                json=email_data,
                timeout=30
            )
            
            if response.status_code == 201:
                logger.info(f"Email sent successfully to {to_email}")
                return {
                    'success': True,
                    'message': 'Email sent successfully',
                    'message_id': response.json().get('messageId')
                }
            else:
                logger.error(f"Failed to send email to {to_email}: {response.text}")
                return {
                    'success': False,
                    'message': f'Failed to send email: {response.text}',
                    'status_code': response.status_code
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error sending email to {to_email}: {str(e)}")
            return {
                'success': False,
                'message': f'Network error: {str(e)}'
            }
        except Exception as e:
            logger.error(f"Unexpected error sending email to {to_email}: {str(e)}")
            return {
                'success': False,
                'message': f'Unexpected error: {str(e)}'
            }
    
    def _simulate_email_send(self, to_email: str, subject: str) -> Dict:
        """Simulate email sending for development/testing"""
        logger.info(f"SIMULATED EMAIL SEND - To: {to_email}, Subject: {subject}")
        return {
            'success': True,
            'message': 'Email simulated successfully (API key not configured)',
            'simulated': True
        }
    
    def send_password_reset_email(
        self,
        user_email: str,
        user_name: str,
        reset_link: str,
        expires_in_hours: int = 24
    ) -> Dict:
        """
        Send password reset email
        
        Args:
            user_email: User's email address
            user_name: User's name
            reset_link: Password reset link
            expires_in_hours: Link expiration time in hours
        
        Returns:
            Dict with success status and message
        """
        
        subject = "Reset Your GhanaLearn Password"
        
        # Prepare template context
        context = {
            'user_name': user_name,
            'reset_link': reset_link,
            'expires_in_hours': expires_in_hours,
            'site_name': 'GhanaLearn',
            'support_email': 'support@ghanalearn.com'
        }
        
        # Render HTML content
        html_content = render_to_string('emails/password_reset.html', context)
        text_content = render_to_string('emails/password_reset.txt', context)
        
        return self.send_email(
            to_email=user_email,
            to_name=user_name,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )
    
    def send_welcome_email(
        self,
        user_email: str,
        user_name: str,
        login_link: str
    ) -> Dict:
        """
        Send welcome email to new users
        
        Args:
            user_email: User's email address
            user_name: User's name
            login_link: Link to login page
        
        Returns:
            Dict with success status and message
        """
        
        subject = f"Welcome to GhanaLearn, {user_name}!"
        
        context = {
            'user_name': user_name,
            'login_link': login_link,
            'site_name': 'GhanaLearn',
            'support_email': 'support@ghanalearn.com'
        }
        
        html_content = render_to_string('emails/welcome.html', context)
        text_content = render_to_string('emails/welcome.txt', context)
        
        return self.send_email(
            to_email=user_email,
            to_name=user_name,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )
    
    def send_password_changed_email(
        self,
        user_email: str,
        user_name: str
    ) -> Dict:
        """
        Send password changed confirmation email
        
        Args:
            user_email: User's email address
            user_name: User's name
        
        Returns:
            Dict with success status and message
        """
        
        subject = "Your GhanaLearn Password Has Been Changed"
        
        context = {
            'user_name': user_name,
            'site_name': 'GhanaLearn',
            'support_email': 'support@ghanalearn.com'
        }
        
        html_content = render_to_string('emails/password_changed.html', context)
        text_content = render_to_string('emails/password_changed.txt', context)
        
        return self.send_email(
            to_email=user_email,
            to_name=user_name,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )


# Global instance
brevo_service = BrevoEmailService()