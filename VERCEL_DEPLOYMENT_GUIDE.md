# 🚀 BECE Platform - Vercel Deployment Guide

## ✅ **Pre-configured Files**

Your project is now ready for Vercel deployment with these configurations:

- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `requirements.txt` - Python dependencies
- ✅ `backend/bece_platform/settings.py` - Production-ready Django settings
- ✅ Admin tools fully functional

## 🛠️ **Deployment Steps**

### **1. Prepare Your Repository**

```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### **2. Deploy to Vercel**

#### **Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project root
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up environment variables
# - Deploy
```

#### **Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### **3. Environment Variables**

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

#### **Required Variables:**
```bash
DEBUG=False
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/database
```

#### **Optional Variables:**
```bash
BREVO_API_KEY=your-brevo-api-key
DEFAULT_FROM_EMAIL=your-email@domain.com
FRONTEND_URL=https://your-frontend-domain.vercel.app
MTN_MOMO_ENVIRONMENT=production
```

### **4. Database Setup**

#### **Option A: Vercel Postgres (Recommended)**
```bash
# Add Vercel Postgres to your project
vercel postgres create

# This automatically sets DATABASE_URL
```

#### **Option B: External PostgreSQL**
- Use services like Neon, Supabase, or Railway
- Set the `DATABASE_URL` environment variable

### **5. Post-Deployment Setup**

After successful deployment, run these commands:

```bash
# Run migrations
vercel env pull .env.local
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python manage.py quick_setup --type=all
```

## 🎯 **Vercel Configuration Explained**

### **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/bece_platform/wsgi.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/bece_platform/wsgi.py"
    },
    {
      "src": "/admin/(.*)",
      "dest": "/backend/bece_platform/wsgi.py"
    }
  ]
}
```

### **Key Features:**
- ✅ **Django Admin** accessible at `/admin/`
- ✅ **API endpoints** at `/api/`
- ✅ **Admin tools** at `/admin/tools/`
- ✅ **Static files** served via WhiteNoise
- ✅ **Database** auto-configured for production

## 📊 **Your Admin Tools on Vercel**

Once deployed, your admin tools will be available at:

- **Admin Dashboard**: `https://your-app.vercel.app/admin/`
- **Quick Setup**: `https://your-app.vercel.app/admin/tools/quick-setup/`
- **Bulk Import**: `https://your-app.vercel.app/admin/tools/bulk-import/`
- **Data Export**: `https://your-app.vercel.app/admin/tools/data-export/`
- **Fix Data Issues**: `https://your-app.vercel.app/admin/tools/fix-data/`

## 🔧 **Production Management Commands**

Use these commands for production management:

```bash
# Quick setup (run after deployment)
python manage.py quick_setup --type=all

# Populate comprehensive data
python manage.py populate_sample_data --type=all

# Check system health
python check_admin_tools.py

# Create admin user
python manage.py createsuperuser
```

## 🛡️ **Security Considerations**

### **Environment Variables (CRITICAL)**
```bash
# Generate a new secret key for production
SECRET_KEY=your-new-super-secret-key

# Disable debug in production
DEBUG=False

# Set allowed hosts
ALLOWED_HOSTS=your-domain.vercel.app
```

### **CORS Configuration**
Update `CORS_ALLOWED_ORIGINS` in settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.vercel.app",
    "https://your-custom-domain.com",
]
```

## 📱 **Mobile Money Integration**

For production MTN Mobile Money:
```bash
MTN_MOMO_ENVIRONMENT=production
MTN_MOMO_BASE_URL=https://momodeveloper.mtn.com
# Update with production keys
```

## 🎉 **Deployment Checklist**

- [ ] Repository pushed to GitHub
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Vercel project deployed
- [ ] Migrations run
- [ ] Superuser created
- [ ] Sample data populated
- [ ] Admin tools tested
- [ ] CORS configured for frontend
- [ ] Custom domain configured (optional)

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Build Fails**
```bash
# Check Python version in vercel.json
"runtime": "python3.9"

# Verify requirements.txt
pip freeze > requirements.txt
```

#### **Database Connection**
```bash
# Verify DATABASE_URL format
postgresql://user:password@host:port/database

# Test connection locally
python manage.py dbshell
```

#### **Static Files Not Loading**
```bash
# Collect static files
python manage.py collectstatic --noinput

# Verify WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

## 🎯 **Next Steps**

1. **Deploy your project** using the steps above
2. **Test admin tools** functionality
3. **Configure your frontend** to use the deployed API
4. **Set up custom domain** (optional)
5. **Monitor performance** and logs

## 📞 **Support**

Your BECE platform is production-ready with:
- ✅ **Comprehensive admin tools**
- ✅ **Database management**
- ✅ **Bulk import/export**
- ✅ **Health monitoring**
- ✅ **Sample data generation**

The deployment configuration is optimized for Vercel's serverless environment while maintaining all admin functionality.

**Happy Deploying! 🚀**