# GhanaLearn - BECE Preparation Platform

A comprehensive learning management system for BECE (Basic Education Certificate Examination) preparation in Ghana.

## 🚀 Features

### Authentication & User Management
- ✅ User registration and login
- ✅ Password reset with email verification (Brevo integration)
- ✅ User profiles and dashboard
- ✅ JWT token-based authentication

### Learning Management
- 📚 Course management with lessons and quizzes
- 🎯 BECE practice tests by subject
- 📊 Progress tracking and analytics
- 🏆 Achievement system
- 📈 Study streak tracking

### E-commerce
- 💰 Bundle-based course packages
- 💳 MTN Mobile Money integration
- 🛒 Shopping cart and checkout
- 📦 Purchase management

### Email System
- 📧 Brevo (Sendinblue) integration
- ✉️ Password reset emails
- 📬 Welcome emails
- 🔔 Notification system

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2.4
- **API**: Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: Token-based auth
- **Email**: Brevo API
- **Payments**: MTN Mobile Money
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: TanStack Query
- **Build Tool**: Vite

## 📁 Project Structure

```
kiro-lms/
├── backend/                 # Django backend
│   ├── accounts/           # User management
│   ├── courses/            # Course management
│   ├── bece/              # BECE practice tests
│   ├── ecommerce/         # E-commerce functionality
│   ├── bece_platform/     # Main Django project
│   ├── templates/         # Email templates
│   └── media/             # User uploads
├── frontend/              # React frontend
│   ├── client/            # Main React app
│   ├── shared/            # Shared utilities
│   └── node_modules/      # Dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Brevo Email Configuration
BREVO_API_KEY=your-brevo-api-key
DEFAULT_FROM_EMAIL=your-verified-email@domain.com
DEFAULT_FROM_NAME=GhanaLearn

# Frontend URL
FRONTEND_URL=http://localhost:8080

# MTN Mobile Money (Sandbox)
MTN_MOMO_SUBSCRIPTION_KEY=your-mtn-momo-key
MTN_MOMO_USER_ID=your-user-id
MTN_MOMO_API_KEY=your-api-key
```

### Brevo Email Setup

1. Sign up at [Brevo](https://app.brevo.com/)
2. Get your API key from Settings > SMTP & API
3. Add and verify your sender email address
4. Update the configuration in Django settings

## 📚 API Documentation

- **Swagger UI**: http://127.0.0.1:8000/api/docs/
- **ReDoc**: http://127.0.0.1:8000/api/redoc/
- **API Schema**: http://127.0.0.1:8000/api/schema/

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Key Features

### Password Reset Flow
1. User requests password reset
2. System generates secure token
3. Email sent via Brevo with reset link
4. User clicks link and sets new password
5. Confirmation email sent

### BECE Practice System
- Subject-based practice tests
- Timed examinations
- Detailed performance analytics
- Progress tracking across subjects

### E-commerce Integration
- Bundle-based course packages
- MTN Mobile Money payments
- Purchase history and management
- Coupon system

## 🔒 Security Features

- Token-based authentication
- Password reset with expiring tokens
- CORS configuration
- Input validation and sanitization
- Secure payment processing

## 🚀 Deployment

### Backend Deployment
- Configure production database
- Set up static file serving
- Configure email settings
- Set environment variables
- Run collectstatic

### Frontend Deployment
- Build production bundle
- Configure API endpoints
- Set up CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@ghanalearn.com
- Documentation: [API Docs](http://127.0.0.1:8000/api/docs/)

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode support
- [ ] Advanced payment options
- [ ] Teacher portal
- [ ] Parent dashboard

---

Built with ❤️ for Ghanaian students preparing for BECE examinations.