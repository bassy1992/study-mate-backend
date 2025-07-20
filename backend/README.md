# BECE Platform Backend API

A comprehensive Django REST Framework API for a BECE (Basic Education Certificate Examination) preparation platform.

## Features

### 🔐 Authentication & User Management
- Custom user model with email authentication
- Token-based authentication
- User profiles and preferences
- Achievement system
- Study session tracking

### 📚 Course Management
- Subjects and levels organization
- Course creation with lessons and content
- Video, text, and interactive content support
- Progress tracking per lesson and course
- Quiz system with multiple question types

### 📝 BECE Preparation
- BECE-specific subjects and past papers
- Practice tests with Paper 1 & Paper 2 support
- Performance analytics and statistics
- Year-wise paper organization
- Detailed progress tracking

### 💰 E-commerce System
- Pricing tiers (Free, Basic, Premium, Pro)
- Course bundles and packages
- Coupon system with validation
- Order management and payment processing
- Subscription management
- User purchase tracking

### 📊 Analytics & Reporting
- User dashboard with statistics
- Performance tracking across subjects
- Study time analytics
- Achievement progress

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /register/` - User registration
- `POST /login/` - User login
- `POST /logout/` - User logout
- `GET /profile/` - Get user profile
- `PUT /profile/` - Update user profile
- `POST /change-password/` - Change password
- `GET /achievements/` - Get user achievements
- `GET /dashboard/stats/` - Get dashboard statistics

### Courses (`/api/courses/`)
- `GET /subjects/` - List all subjects
- `GET /levels/` - List all levels
- `GET /courses/` - List courses (with filters)
- `GET /courses/{slug}/` - Get course details
- `GET /courses/{level}/{subject}/` - Get course by level and subject
- `GET /lessons/{id}/` - Get lesson details
- `POST /lessons/{id}/complete/` - Mark lesson as completed
- `GET /quizzes/` - List quizzes
- `GET /quizzes/{slug}/` - Get quiz details
- `POST /quizzes/{id}/start/` - Start quiz attempt
- `POST /quizzes/submit/` - Submit quiz answers
- `GET /progress/` - Get user progress

### BECE (`/api/bece/`)
- `GET /subjects/` - List BECE subjects
- `GET /years/` - List available years
- `GET /papers/` - List BECE papers (with filters)
- `GET /papers/{id}/` - Get paper details
- `GET /practice/{subject}/` - Get papers by subject
- `POST /practice/{paper_id}/start/` - Start practice attempt
- `POST /practice/submit/` - Submit practice answers
- `GET /dashboard/` - Get BECE dashboard data
- `GET /statistics/` - Get user BECE statistics
- `GET /performance/{subject}/` - Get subject performance

### E-commerce (`/api/ecommerce/`)
- `GET /pricing-tiers/` - List pricing tiers
- `GET /bundles/` - List course bundles
- `GET /bundles/{slug}/` - Get bundle details
- `POST /coupons/validate/` - Validate coupon code
- `POST /checkout/` - Complete purchase
- `GET /orders/` - Get user orders
- `GET /purchases/` - Get user purchases
- `GET /subscriptions/` - Get user subscriptions
- `POST /subscriptions/create/` - Create subscription
- `GET /faqs/` - Get FAQs

## Installation & Setup

### Prerequisites
- Python 3.8+
- Django 5.2+
- Django REST Framework

### Installation
1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers pillow
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Populate sample data:
```bash
python manage.py populate_data
```

6. Start development server:
```bash
python manage.py runserver
```

## API Documentation

### 📚 Interactive Swagger Documentation

The API includes comprehensive Swagger/OpenAPI documentation:

- **Swagger UI**: `http://127.0.0.1:8000/api/docs/` - Interactive API testing
- **ReDoc**: `http://127.0.0.1:8000/api/redoc/` - Clean documentation
- **OpenAPI Schema**: `http://127.0.0.1:8000/api/schema/` - Raw schema (JSON)
- **API Overview**: `http://127.0.0.1:8000/api/` - Getting started guide

### 🧪 API Testing

Run the test scripts to verify all endpoints:
```bash
# Test all API endpoints
python test_api.py

# Test Swagger documentation
python test_swagger.py

# Generate OpenAPI schema file
python manage.py spectacular --file schema.yml
```

## Authentication

The API uses Token-based authentication. Include the token in request headers:
```
Authorization: Token your_token_here
```

Get token by logging in:
```bash
POST /api/auth/login/
{
    "email": "user@example.com",
    "password": "password"
}
```

## Database Models

### Core Models
- **CustomUser** - Extended user model
- **UserProfile** - User preferences and settings
- **Subject** - Course subjects (Math, English, etc.)
- **Level** - Grade levels (JHS 1, 2, 3)
- **Course** - Individual courses
- **Lesson** - Course lessons with content
- **Quiz** - Assessments and practice tests

### BECE Models
- **BECESubject** - BECE-specific subjects
- **BECEPaper** - Past examination papers
- **BECEQuestion** - Examination questions
- **BECEPracticeAttempt** - User practice attempts

### E-commerce Models
- **Bundle** - Course packages
- **Order** - Purchase orders
- **Payment** - Payment records
- **Subscription** - User subscriptions
- **Coupon** - Discount codes

## Configuration

### CORS Settings
Frontend URLs are configured in `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]
```

### Media Files
Media files are served from `/media/` in development.

## Admin Interface

Access the Django admin at `/admin/` to manage:
- Users and profiles
- Courses and lessons
- BECE papers and questions
- Orders and payments
- System settings

## API Documentation

Visit `/api/` for interactive API documentation with all available endpoints.

## Development

### Adding New Features
1. Create models in appropriate app
2. Create serializers for API representation
3. Create views for business logic
4. Add URL patterns
5. Update admin interface
6. Add tests

### Database Migrations
After model changes:
```bash
python manage.py makemigrations
python manage.py migrate
```

## Production Deployment

1. Set `DEBUG = False`
2. Configure proper database (PostgreSQL recommended)
3. Set up static file serving
4. Configure CORS for production domains
5. Set up proper authentication and security settings
6. Configure payment gateway integration

## Support

For issues and questions, refer to the Django and DRF documentation:
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)