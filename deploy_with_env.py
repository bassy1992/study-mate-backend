#!/usr/bin/env python
"""
Deploy to Vercel with environment variables
"""
import subprocess
import sys

def deploy_with_env():
    print("🚀 Deploying to Vercel with environment variables...")
    
    # Environment variables to set
    env_vars = [
        "DEBUG=False",
        "SECRET_KEY=!e6zgbm#ad+krlu7cyc71g)txpte0ya=o$z0(icpeq)a*!5p8@",
        "DATABASE_URL=postgresql://postgres:AuKnRSxpuRvZbrYgREpwwEadaNnABoVh@hopper.proxy.rlwy.net:18031/railway",
        "DJANGO_SETTINGS_MODULE=bece_platform.settings",
        "PYTHONPATH=/var/task/backend"
    ]
    
    print("Setting environment variables...")
    for env_var in env_vars:
        key, value = env_var.split('=', 1)
        cmd = f'vercel env add {key} production'
        print(f"Setting {key}...")
        
        # Note: This requires manual input in the terminal
        print(f"Run this command and enter the value when prompted:")
        print(f"vercel env add {key} production")
        print(f"Value to enter: {value}")
        print("-" * 50)
    
    print("\nAfter setting all environment variables, run:")
    print("vercel --prod")

if __name__ == '__main__':
    deploy_with_env()