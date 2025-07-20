#!/usr/bin/env python
"""
BECE Platform - Vercel Deployment Helper
"""
import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None

def check_requirements():
    """Check if all requirements are met"""
    print("🔍 Checking deployment requirements...")
    
    # Check if git is initialized
    if not os.path.exists('.git'):
        print("❌ Git repository not initialized. Run: git init")
        return False
    
    # Check if vercel.json exists
    if not os.path.exists('vercel.json'):
        print("❌ vercel.json not found")
        return False
    
    # Check if requirements.txt exists
    if not os.path.exists('requirements.txt'):
        print("❌ requirements.txt not found")
        return False
    
    print("✅ All requirements met")
    return True

def prepare_deployment():
    """Prepare the project for deployment"""
    print("🛠️ Preparing deployment...")
    
    # Collect static files
    os.chdir('backend')
    run_command('python manage.py collectstatic --noinput', 'Collecting static files')
    
    # Run migrations to ensure database is ready
    run_command('python manage.py migrate', 'Running migrations')
    
    # Go back to root
    os.chdir('..')
    
    # Add and commit changes
    run_command('git add .', 'Adding files to git')
    run_command('git commit -m "Prepare for Vercel deployment"', 'Committing changes')
    
    print("✅ Deployment preparation completed")

def deploy_to_vercel():
    """Deploy to Vercel"""
    print("🚀 Deploying to Vercel...")
    
    # Check if Vercel CLI is installed
    vercel_check = run_command('vercel --version', 'Checking Vercel CLI')
    if not vercel_check:
        print("📦 Installing Vercel CLI...")
        run_command('npm install -g vercel', 'Installing Vercel CLI')
    
    # Deploy
    result = run_command('vercel --prod', 'Deploying to Vercel')
    if result:
        print("🎉 Deployment successful!")
        print("📋 Next steps:")
        print("1. Set environment variables in Vercel dashboard")
        print("2. Configure database (DATABASE_URL)")
        print("3. Run post-deployment setup")
        return True
    else:
        print("❌ Deployment failed")
        return False

def post_deployment_setup():
    """Instructions for post-deployment setup"""
    print("\n📋 POST-DEPLOYMENT SETUP")
    print("=" * 50)
    print("1. Go to your Vercel dashboard")
    print("2. Set these environment variables:")
    print("   - DEBUG=False")
    print("   - SECRET_KEY=your-secret-key")
    print("   - DATABASE_URL=your-database-url")
    print("3. Run these commands after deployment:")
    print("   - python manage.py migrate")
    print("   - python manage.py createsuperuser")
    print("   - python manage.py quick_setup --type=all")
    print("\n🎯 Your admin tools will be available at:")
    print("   - /admin/ (Django admin)")
    print("   - /admin/tools/quick-setup/ (Quick setup)")
    print("   - /admin/tools/bulk-import/ (Bulk import)")
    print("   - /api/docs/ (API documentation)")

def main():
    """Main deployment function"""
    print("🚀 BECE Platform - Vercel Deployment Helper")
    print("=" * 50)
    
    if not check_requirements():
        print("❌ Requirements not met. Please fix the issues above.")
        sys.exit(1)
    
    # Ask user what they want to do
    print("\nWhat would you like to do?")
    print("1. Prepare for deployment (collect static, commit changes)")
    print("2. Deploy to Vercel")
    print("3. Full deployment (prepare + deploy)")
    print("4. Show post-deployment instructions")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == '1':
        prepare_deployment()
    elif choice == '2':
        deploy_to_vercel()
    elif choice == '3':
        prepare_deployment()
        if deploy_to_vercel():
            post_deployment_setup()
    elif choice == '4':
        post_deployment_setup()
    else:
        print("❌ Invalid choice")
        sys.exit(1)
    
    print("\n🎉 Done!")

if __name__ == '__main__':
    main()