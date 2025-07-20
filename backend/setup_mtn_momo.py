#!/usr/bin/env python
"""
MTN MoMo API User Setup Script
This script helps you create the API user and get the credentials needed for MTN MoMo integration
"""

import requests
import uuid
import json


def setup_mtn_momo_user():
    """Create MTN MoMo API user and get credentials"""
    
    # Your subscription key
    subscription_key = "048d8ed66c2c4b04ba142d49febb2a37"
    base_url = "https://sandbox.momodeveloper.mtn.com"
    
    print("🚀 Setting up MTN MoMo API User...")
    print("=" * 50)
    
    # Step 1: Create API User
    print("1️⃣  Creating API User...")
    
    reference_id = str(uuid.uuid4())
    print(f"   Generated Reference ID: {reference_id}")
    
    create_user_url = f"{base_url}/v1_0/apiuser"
    headers = {
        'X-Reference-Id': reference_id,
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Content-Type': 'application/json'
    }
    
    # You can use any callback host for sandbox
    payload = {
        "providerCallbackHost": "webhook.site"  # Dummy callback for sandbox
    }
    
    try:
        response = requests.post(create_user_url, headers=headers, json=payload)
        
        if response.status_code == 201:
            print("   ✅ API User created successfully!")
            user_id = reference_id  # The reference ID becomes the user ID
            print(f"   📋 User ID: {user_id}")
            
            # Step 2: Create API Key
            print("\n2️⃣  Creating API Key...")
            
            create_key_url = f"{base_url}/v1_0/apiuser/{user_id}/apikey"
            key_headers = {
                'Ocp-Apim-Subscription-Key': subscription_key
            }
            
            key_response = requests.post(create_key_url, headers=key_headers)
            
            if key_response.status_code == 201:
                api_key = key_response.json().get('apiKey')
                print("   ✅ API Key created successfully!")
                print(f"   🔑 API Key: {api_key}")
                
                # Step 3: Show Django Settings Update
                print("\n" + "=" * 60)
                print("🎉 SUCCESS! Your MTN MoMo credentials are ready!")
                print("=" * 60)
                
                print("\n📝 Update your Django settings.py with these values:")
                print("-" * 50)
                print(f"MTN_MOMO_USER_ID = '{user_id}'")
                print(f"MTN_MOMO_API_KEY = '{api_key}'")
                print("-" * 50)
                
                print("\n🔧 Complete settings.py configuration:")
                print("```python")
                print("# MTN Mobile Money Configuration")
                print("MTN_MOMO_BASE_URL = 'https://sandbox.momodeveloper.mtn.com'")
                print(f"MTN_MOMO_SUBSCRIPTION_KEY = '{subscription_key}'")
                print(f"MTN_MOMO_USER_ID = '{user_id}'")
                print(f"MTN_MOMO_API_KEY = '{api_key}'")
                print("MTN_MOMO_ENVIRONMENT = 'sandbox'")
                print("```")
                
                print("\n✅ Next Steps:")
                print("1. Copy the USER_ID and API_KEY to your Django settings")
                print("2. Run: python test_mtn_momo.py (to test the integration)")
                print("3. Test payments in your application!")
                
                return {
                    'success': True,
                    'user_id': user_id,
                    'api_key': api_key
                }
                
            else:
                print(f"   ❌ Failed to create API Key: {key_response.status_code}")
                print(f"   Response: {key_response.text}")
                return {'success': False, 'error': 'Failed to create API key'}
                
        else:
            print(f"   ❌ Failed to create API User: {response.status_code}")
            print(f"   Response: {response.text}")
            return {'success': False, 'error': 'Failed to create API user'}
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return {'success': False, 'error': str(e)}


if __name__ == '__main__':
    print("🔧 MTN MoMo API Setup Tool")
    print("This script will create your API user and generate credentials\n")
    
    confirm = input("Do you want to proceed? (y/n): ").lower().strip()
    
    if confirm == 'y' or confirm == 'yes':
        result = setup_mtn_momo_user()
        
        if result['success']:
            print(f"\n🎊 Setup completed successfully!")
        else:
            print(f"\n💥 Setup failed: {result['error']}")
            print("\nTry running the script again or check your subscription key.")
    else:
        print("Setup cancelled.")