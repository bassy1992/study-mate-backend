# BECE Platform API - Swagger Documentation

## 📚 Interactive API Documentation

The BECE Platform API includes comprehensive Swagger/OpenAPI documentation for easy testing and integration.

### 🔗 Documentation URLs

| Documentation Type | URL | Description |
|-------------------|-----|-------------|
| **Swagger UI** | `/api/docs/` | Interactive API documentation with testing capabilities |
| **ReDoc** | `/api/redoc/` | Clean, responsive API documentation |
| **OpenAPI Schema** | `/api/schema/` | Raw OpenAPI 3.0 schema (JSON) |
| **API Overview** | `/api/` | Custom API overview with getting started guide |

### 🚀 Getting Started with Swagger UI

1. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```

2. **Open Swagger UI:**
   ```
   http://127.0.0.1:8000/api/docs/
   ```

3. **Authenticate (for protected endpoints):**
   - Click the "Authorize" button in Swagger UI
   - Get a token by calling `POST /api/auth/login/`
   - Enter: `Token your_token_here`

### 🔐 Authentication in Swagger

The API uses Token-based authentication. To test authenticated endpoints:

1. **Register a new user:**
   ```bash
   POST /api/auth/register/
   {
     "email": "test@example.com",
     "username": "testuser",
     "first_name": "Test",
     "last_name": "User",
     "password": "testpass123",
     "password_confirm": "testpass123"
   }
   ```

2. **Login to get token:**
   ```bash
   POST /api/auth/login/
   {
     "email": "test@example.com",
     "password": "testpass123"
   }
   ```

3. **Use token in Swagger UI:**
   - Click "Authorize" button
   - Enter: `Token your_token_here`
   - Click "Authorize"

### 📋 API Categories

The API is organized into the following categories:

#### 🔐 Authentication
- User registration and login
- Profile management
- Password changes
- Achievement tracking
- Study session management

#### 📚 Courses
- Subject and level management
- Course browsing with filters
- Lesson content and progress
- Quiz system with attempts
- Progress tracking

#### 📝 BECE
- BECE subject management
- Past paper access
- Practice test attempts
- Performance analytics
- Subject-specific statistics

#### 💰 E-commerce
- Pricing tiers and bundles
- Coupon validation
- Order and payment processing
- Subscription management
- FAQ and announcements

### 🛠️ Testing Endpoints

#### Example: Testing Course Endpoints

1. **List all subjects (no auth required):**
   ```
   GET /api/courses/subjects/
   ```

2. **List courses with filters:**
   ```
   GET /api/courses/courses/?subject=MATH&level=JHS3&difficulty=advanced
   ```

3. **Get course details:**
   ```
   GET /api/courses/courses/jhs3-mathematics/
   ```

#### Example: Testing Authentication

1. **Register:**
   ```json
   POST /api/auth/register/
   {
     "email": "student@example.com",
     "username": "student123",
     "first_name": "John",
     "last_name": "Doe",
     "password": "securepass123",
     "password_confirm": "securepass123"
   }
   ```

2. **Login:**
   ```json
   POST /api/auth/login/
   {
     "email": "student@example.com",
     "password": "securepass123"
   }
   ```

3. **Get profile (requires auth):**
   ```
   GET /api/auth/profile/
   Authorization: Token your_token_here
   ```

### 🔍 Advanced Features

#### Query Parameters
Many endpoints support filtering via query parameters:

- **Courses:** `?subject=MATH&level=JHS3&difficulty=advanced&is_premium=true`
- **Quizzes:** `?subject=ENG&type=practice`
- **BECE Papers:** `?subject=mathematics&year=2023&paper_type=paper1`
- **FAQs:** `?category=bece&featured=true`

#### Pagination
List endpoints use pagination:
- Default page size: 20 items
- Use `?page=2` for next page
- Response includes `count`, `next`, `previous`

#### Error Handling
The API returns consistent error responses:
```json
{
  "error": "Error message",
  "details": "Additional details if available"
}
```

### 📊 Schema Information

The OpenAPI schema includes:
- **76+ endpoints** across 4 main categories
- **20+ data models** with full field documentation
- **Request/response examples** for all endpoints
- **Authentication requirements** clearly marked
- **Parameter validation** rules
- **Error response formats**

### 🧪 Testing Tools

#### Built-in Testing
Use the provided test scripts:
```bash
# Test all API endpoints
python test_api.py

# Test Swagger documentation
python test_swagger.py
```

#### External Tools
The OpenAPI schema works with:
- **Postman** - Import schema for collection
- **Insomnia** - Import for API testing
- **curl** - Command line testing
- **HTTPie** - User-friendly HTTP client

### 🔧 Customization

The Swagger configuration is in `settings.py`:
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'BECE Platform API',
    'DESCRIPTION': '...',
    'VERSION': '1.0.0',
    # ... more settings
}
```

### 📝 Documentation Standards

All endpoints include:
- **Clear summaries** and descriptions
- **Request/response schemas**
- **Parameter documentation**
- **Authentication requirements**
- **Example responses**
- **Error scenarios**

### 🚨 Common Issues

1. **CORS Errors:** Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
2. **Auth Errors:** Check token format: `Token your_token_here`
3. **404 Errors:** Verify endpoint URLs match documentation
4. **Permission Errors:** Ensure proper authentication for protected endpoints

### 📞 Support

For API documentation issues:
1. Check the interactive Swagger UI at `/api/docs/`
2. Review the OpenAPI schema at `/api/schema/`
3. Test endpoints using the provided test scripts
4. Refer to the main README.md for setup instructions

---

**Happy API Testing! 🚀**