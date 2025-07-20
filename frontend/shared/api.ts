/**
 * Shared code between client and server
 * API configuration and types for Django backend
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Custom API Error class for better error handling
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly data: any;
  public readonly url: string;
  public readonly timestamp: string;

  constructor(
    message: string,
    status: number,
    code: string,
    data: any = null,
    url: string = ''
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
    this.url = url;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Helper methods for common error types
  static isNetworkError(error: any): boolean {
    return error instanceof ApiError && error.code === 'NETWORK_ERROR';
  }

  static isAuthError(error: any): boolean {
    return error instanceof ApiError && 
           (error.code === 'UNAUTHORIZED' || error.code === 'SESSION_EXPIRED');
  }

  static isPremiumError(error: any): boolean {
    return error instanceof ApiError && error.code === 'PREMIUM_REQUIRED';
  }

  static isValidationError(error: any): boolean {
    return error instanceof ApiError && error.code === 'VALIDATION_ERROR';
  }

  static isServerError(error: any): boolean {
    return error instanceof ApiError && error.code === 'SERVER_ERROR';
  }

  // Get user-friendly error message
  getUserMessage(): string {
    switch (this.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'UNAUTHORIZED':
      case 'SESSION_EXPIRED':
        return 'Your session has expired. Please log in again.';
      case 'PREMIUM_REQUIRED':
        return 'This feature requires a premium subscription.';
      case 'VALIDATION_ERROR':
        return this.message; // Validation errors are already user-friendly
      case 'SERVER_ERROR':
        return 'Server error occurred. Please try again later.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait before trying again.';
      default:
        return this.message;
    }
  }

  // Convert to plain object for logging/serialization
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      data: this.data,
      url: this.url,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = Math.random().toString(36).substr(2, 9);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session auth
      ...options,
    };

    // Add token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Token ${token}`,
      };
    }

    // Enhanced request logging
    this.logRequest(requestId, url, config, options);

    try {
      const startTime = Date.now();
      const response = await fetch(url, config);
      const duration = Date.now() - startTime;
      
      // Log response details
      this.logResponse(requestId, response, duration);
      
      if (!response.ok) {
        return this.handleErrorResponse(requestId, response, url, config);
      }

      // Parse and return successful response
      const data = await response.json();
      console.log(`[API-${requestId}] ✅ Success:`, {
        status: response.status,
        data: this.truncateForLogging(data)
      });
      
      return data;
    } catch (error) {
      return this.handleRequestError(requestId, error, url, config);
    }
  }

  private logRequest(requestId: string, url: string, config: RequestInit, originalOptions: RequestInit) {
    console.group(`[API-${requestId}] 🚀 Request: ${config.method || 'GET'} ${url}`);
    console.log('Headers:', this.sanitizeHeaders(config.headers as Record<string, string>));
    
    if (config.body) {
      try {
        const body = typeof config.body === 'string' ? JSON.parse(config.body) : config.body;
        console.log('Body:', this.truncateForLogging(body));
      } catch {
        console.log('Body:', '[Unable to parse]');
      }
    }
    
    console.log('Config:', {
      credentials: config.credentials,
      method: config.method || 'GET',
      timestamp: new Date().toISOString()
    });
    console.groupEnd();
  }

  private logResponse(requestId: string, response: Response, duration: number) {
    const statusColor = response.ok ? '✅' : '❌';
    console.log(`[API-${requestId}] ${statusColor} Response:`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });
  }

  private async handleErrorResponse<T>(
    requestId: string, 
    response: Response, 
    url: string, 
    config: RequestInit
  ): Promise<T> {
    let errorData: any = null;
    let rawErrorText = '';
    
    try {
      rawErrorText = await response.text();
      errorData = rawErrorText ? JSON.parse(rawErrorText) : null;
    } catch (parseError) {
      console.warn(`[API-${requestId}] ⚠️ Could not parse error response:`, rawErrorText);
    }

    // Enhanced error logging
    console.group(`[API-${requestId}] ❌ Error Response Details`);
    console.error('Status:', response.status, response.statusText);
    console.error('URL:', url);
    console.error('Method:', config.method || 'GET');
    console.error('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.error('Raw Response:', rawErrorText);
    console.error('Parsed Error Data:', errorData);
    console.error('Request Headers:', this.sanitizeHeaders(config.headers as Record<string, string>));
    console.groupEnd();

    // Handle specific error types
    switch (response.status) {
      case 401:
        return this.handleUnauthorizedError(requestId, errorData, url);
      
      case 403:
        return this.handleForbiddenError(requestId, errorData, url, config);
      
      case 404:
        return this.handleNotFoundError(requestId, errorData, url);
      
      case 422:
        return this.handleValidationError(requestId, errorData, url);
      
      case 429:
        return this.handleRateLimitError(requestId, errorData, response);
      
      case 500:
      case 502:
      case 503:
      case 504:
        return this.handleServerError(requestId, response.status, errorData, url);
      
      default:
        return this.handleGenericError(requestId, response, errorData, rawErrorText);
    }
  }

  private handleUnauthorizedError<T>(requestId: string, errorData: any, url: string): Promise<T> {
    console.error(`[API-${requestId}] 🔐 Unauthorized - Token invalid or expired`);
    
    // Clear invalid token
    localStorage.removeItem('authToken');
    
    // Redirect to login if not already there
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      console.log(`[API-${requestId}] 🔄 Redirecting to login`);
      window.location.href = '/login';
    }
    
    const message = errorData?.detail || errorData?.message || 'Authentication required. Please log in again.';
    throw new ApiError(message, 401, 'UNAUTHORIZED', errorData, url);
  }

  private handleForbiddenError<T>(requestId: string, errorData: any, url: string, config: RequestInit): Promise<T> {
    console.group(`[API-${requestId}] 🚫 Forbidden Access Details`);
    console.error('URL:', url);
    console.error('Token Present:', localStorage.getItem('authToken') ? 'Yes' : 'No');
    console.error('Error Data:', errorData);
    console.groupEnd();
    
    // Check if it's a premium subscription error
    const errorMessage = errorData?.error || errorData?.detail || errorData?.message || '';
    
    if (errorMessage.includes('Premium subscription required') || 
        errorMessage.includes('premium') || 
        errorMessage.includes('subscription')) {
      console.log(`[API-${requestId}] 💎 Premium subscription required`);
      throw new ApiError(errorMessage, 403, 'PREMIUM_REQUIRED', errorData, url);
    }
    
    // Check if it's a permission error (user has valid auth but lacks permission)
    if (errorMessage.includes('permission') || errorMessage.includes('access denied')) {
      console.log(`[API-${requestId}] 🔒 Insufficient permissions`);
      throw new ApiError(errorMessage, 403, 'INSUFFICIENT_PERMISSIONS', errorData, url);
    }
    
    // If we have a token but still get 403, it might be invalid
    const token = localStorage.getItem('authToken');
    if (token && !errorMessage.includes('premium') && !errorMessage.includes('permission')) {
      console.warn(`[API-${requestId}] 🔑 Token present but access forbidden - may be invalid`);
      localStorage.removeItem('authToken');
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      throw new ApiError('Session expired. Please log in again.', 403, 'SESSION_EXPIRED', errorData, url);
    }
    
    throw new ApiError(errorMessage || 'Access forbidden', 403, 'FORBIDDEN', errorData, url);
  }

  private handleNotFoundError<T>(requestId: string, errorData: any, url: string): Promise<T> {
    console.error(`[API-${requestId}] 🔍 Resource not found: ${url}`);
    
    const message = errorData?.detail || errorData?.message || 'The requested resource was not found';
    throw new ApiError(message, 404, 'NOT_FOUND', errorData, url);
  }

  private handleValidationError<T>(requestId: string, errorData: any, url: string): Promise<T> {
    console.group(`[API-${requestId}] ⚠️ Validation Error Details`);
    console.error('URL:', url);
    console.error('Validation Errors:', errorData);
    console.groupEnd();
    
    // Format validation errors for better UX
    let message = 'Validation failed';
    if (errorData && typeof errorData === 'object') {
      const errors = this.formatValidationErrors(errorData);
      message = errors.length > 0 ? errors.join('; ') : message;
    }
    
    throw new ApiError(message, 422, 'VALIDATION_ERROR', errorData, url);
  }

  private handleRateLimitError<T>(requestId: string, errorData: any, response: Response): Promise<T> {
    const retryAfter = response.headers.get('Retry-After');
    console.error(`[API-${requestId}] 🚦 Rate limit exceeded. Retry after: ${retryAfter}s`);
    
    const message = errorData?.detail || `Too many requests. Please try again in ${retryAfter || 60} seconds.`;
    throw new ApiError(message, 429, 'RATE_LIMITED', { ...errorData, retryAfter }, response.url);
  }

  private handleServerError<T>(requestId: string, status: number, errorData: any, url: string): Promise<T> {
    console.error(`[API-${requestId}] 🔥 Server Error ${status}:`, {
      url,
      errorData,
      timestamp: new Date().toISOString()
    });
    
    const errorMessages = {
      500: 'Internal server error. Please try again later.',
      502: 'Bad gateway. The server is temporarily unavailable.',
      503: 'Service unavailable. Please try again later.',
      504: 'Gateway timeout. The request took too long to process.'
    };
    
    const message = errorData?.detail || errorMessages[status as keyof typeof errorMessages] || 'Server error occurred';
    throw new ApiError(message, status, 'SERVER_ERROR', errorData, url);
  }

  private handleGenericError<T>(requestId: string, response: Response, errorData: any, rawErrorText: string): Promise<T> {
    console.error(`[API-${requestId}] ❓ Unexpected Error:`, {
      status: response.status,
      statusText: response.statusText,
      errorData,
      rawErrorText
    });
    
    let message = `HTTP ${response.status}: ${response.statusText}`;
    
    if (errorData?.detail) {
      message = errorData.detail;
    } else if (errorData?.message) {
      message = errorData.message;
    } else if (typeof errorData === 'object' && errorData !== null) {
      message = JSON.stringify(errorData);
    }
    
    throw new ApiError(message, response.status, 'GENERIC_ERROR', errorData, response.url);
  }

  private handleRequestError<T>(requestId: string, error: any, url: string, config: RequestInit): Promise<T> {
    console.group(`[API-${requestId}] 💥 Request Failed`);
    console.error('URL:', url);
    console.error('Method:', config.method || 'GET');
    console.error('Error:', error);
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.groupEnd();

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const networkError = new ApiError(
        'Network error: Unable to connect to the server. Please check your internet connection and ensure the backend is running.',
        0,
        'NETWORK_ERROR',
        { originalError: error.message, url, timestamp: new Date().toISOString() },
        url
      );
      throw networkError;
    }

    // Handle timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw new ApiError(
        'Request timeout: The server took too long to respond. Please try again.',
        0,
        'TIMEOUT_ERROR',
        { originalError: error.message, url },
        url
      );
    }

    // Handle CORS errors
    if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
      throw new ApiError(
        'CORS error: Cross-origin request blocked. Please check server CORS configuration.',
        0,
        'CORS_ERROR',
        { originalError: error.message, url },
        url
      );
    }

    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unknown errors
    throw new ApiError(
      `Unexpected error: ${error.message}`,
      0,
      'UNKNOWN_ERROR',
      { originalError: error.message, errorType: error.constructor.name, url },
      url
    );
  }

  private formatValidationErrors(errorData: any): string[] {
    const errors: string[] = [];
    
    if (Array.isArray(errorData)) {
      return errorData.map(err => typeof err === 'string' ? err : JSON.stringify(err));
    }
    
    if (typeof errorData === 'object' && errorData !== null) {
      for (const [field, fieldErrors] of Object.entries(errorData)) {
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(error => {
            errors.push(`${field}: ${error}`);
          });
        } else if (typeof fieldErrors === 'string') {
          errors.push(`${field}: ${fieldErrors}`);
        }
      }
    }
    
    return errors;
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };
    
    // Hide sensitive information
    if (sanitized.Authorization) {
      sanitized.Authorization = sanitized.Authorization.replace(/Token .+/, 'Token [HIDDEN]');
    }
    
    return sanitized;
  }

  private truncateForLogging(data: any, maxLength: number = 1000): any {
    const str = JSON.stringify(data);
    if (str.length <= maxLength) {
      return data;
    }
    
    return {
      ...data,
      _truncated: true,
      _originalLength: str.length,
      _preview: str.substring(0, maxLength) + '...'
    };
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<AuthResponse>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: RegisterData) {
    return this.request<AuthResponse>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/api/auth/logout/', { method: 'POST' });
  }

  async getProfile() {
    return this.request<UserProfile>('/api/auth/profile/');
  }

  // Teacher endpoints
  async getTeachers(featured?: boolean, subject?: string) {
    let url = '/api/courses/teachers/';
    const params = new URLSearchParams();
    
    if (featured !== undefined) {
      params.append('featured', featured.toString());
    }
    if (subject) {
      params.append('subject', subject);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.request<TeachersResponse>(url);
  }

  async getTeacher(id: number) {
    return this.request<Teacher>(`/api/courses/teachers/${id}/`);
  }

  // Courses endpoints
  async getCourses() {
    return this.request<CoursesResponse>('/api/courses/');
  }

  async getCourse(id: number) {
    return this.request<Course>(`/api/courses/courses/${id}/`);
  }

  async getCourseBySlug(slug: string) {
    return this.request<Course>(`/api/courses/courses/${slug}/`);
  }

  // BECE endpoints
  async getBECETests() {
    return this.request<BECETestsResponse>('/api/bece/tests/');
  }

  async getBECETest(id: number) {
    return this.request<BECETest>(`/api/bece/tests/${id}/`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string }>('/api/health/');
  }

  // Bundle endpoints
  async getBundles() {
    return this.request<BundlesResponse>('/api/ecommerce/bundles/');
  }

  async getBundle(slug: string) {
    return this.request<Bundle>(`/api/ecommerce/bundles/${slug}/`);
  }

  // Purchase endpoints
  async getUserPurchases() {
    return this.request<UserPurchasesResponse>('/api/ecommerce/purchases/');
  }

  async getBundleSubjects(bundleId: number) {
    return this.request<BundleSubjectsResponse>(`/api/ecommerce/bundles/${bundleId}/subjects/`);
  }

  async getBundleSubjectCourses(bundleId: number, subjectId: number) {
    return this.request<BundleSubjectCoursesResponse>(`/api/ecommerce/bundles/${bundleId}/subjects/${subjectId}/courses/`);
  }

  async createOrder(bundleIds: number[], couponCode?: string) {
    return this.request<OrderResponse>('/api/ecommerce/orders/', {
      method: 'POST',
      body: JSON.stringify({
        bundle_ids: bundleIds,
        coupon_code: couponCode || '',
      }),
    });
  }

  async checkout(bundleIds: number[], paymentMethod: string, couponCode?: string) {
    return this.request<CheckoutResponse>('/api/ecommerce/checkout/', {
      method: 'POST',
      body: JSON.stringify({
        bundle_ids: bundleIds,
        payment_method: paymentMethod,
        coupon_code: couponCode || '',
      }),
    });
  }

  async validateCoupon(code: string, totalAmount: number) {
    return this.request<CouponValidationResponse>('/api/ecommerce/coupons/validate/', {
      method: 'POST',
      body: JSON.stringify({
        code,
        total_amount: totalAmount,
      }),
    });
  }

  // MTN Mobile Money endpoints
  async initiateMtnMomo(phoneNumber: string, amount: number, bundleId: number) {
    return this.request<MtnMomoInitiateResponse>('/api/ecommerce/mtn-momo/initiate/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        amount: amount,
        bundle_id: bundleId,
      }),
    });
  }

  async checkMtnMomoStatus(transactionId: string) {
    return this.request<MtnMomoStatusResponse>(`/api/ecommerce/mtn-momo/status/${transactionId}/`);
  }

  async cancelMtnMomoPayment(transactionId: string) {
    return this.request<{ success: boolean; message: string }>('/api/ecommerce/mtn-momo/cancel/', {
      method: 'POST',
      body: JSON.stringify({
        transaction_id: transactionId,
      }),
    });
  }

  // Dashboard stats endpoint
  async getDashboardStats() {
    return this.request<DashboardStats>('/api/auth/dashboard/stats/');
  }

  // Bundle progress endpoint
  async getBundleProgress(bundleId: number) {
    return this.request<BundleProgressData>(`/api/ecommerce/bundles/${bundleId}/progress/`);
  }

  // Upcoming tasks endpoint
  async getUpcomingTasks() {
    return this.request<UpcomingTasksResponse>('/api/auth/upcoming-tasks/');
  }

  // Quiz endpoints
  async getUserQuizzes() {
    return this.request<UserQuizzesResponse>('/api/courses/quizzes/user/');
  }

  async getQuiz(slug: string) {
    return this.request<QuizDetail>(`/api/courses/quizzes/${slug}/`);
  }

  async startQuiz(quizId: number) {
    return this.request<StartQuizResponse>(`/api/courses/quizzes/${quizId}/start/`, {
      method: 'POST',
    });
  }

  async submitQuiz(quizId: number, answers: QuizAnswer[]) {
    return this.request<SubmitQuizResponse>('/api/courses/quizzes/submit/', {
      method: 'POST',
      body: JSON.stringify({
        quiz_id: quizId,
        answers: answers,
      }),
    });
  }

  async getQuizResults(attemptId: number) {
    return this.request<QuizResultsResponse>(`/api/courses/quizzes/results/${attemptId}/`);
  }

  // BECE Practice endpoints
  async getBECESubjects() {
    return this.request<BECESubject[]>('/api/bece/subjects/');
  }

  async getBECEYears() {
    const response = await this.request<{ results: BECEYear[] }>('/api/bece/years/');
    return response.results || [];
  }

  async getBECEPapers(params?: {
    subject?: string;
    year?: number;
    paper_type?: string;
  }) {
    let url = '/api/bece/papers/';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.subject) searchParams.append('subject', params.subject);
      if (params.year) searchParams.append('year', params.year.toString());
      if (params.paper_type) searchParams.append('paper_type', params.paper_type);
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    return this.request<BECEPaperList[]>(url);
  }

  async getBECEPaper(paperId: number) {
    return this.request<BECEPaper>(`/api/bece/papers/${paperId}/`);
  }

  async getBECEPracticeBySubject(subject: string) {
    return this.request<BECEPaperList[]>(`/api/bece/practice/${subject}/`);
  }

  async startBECEPractice(paperId: number) {
    return this.request<StartBECEPracticeResponse>(`/api/bece/practice/${paperId}/start/`, {
      method: 'POST',
    });
  }

  async submitBECEPractice(submission: BECESubmission) {
    return this.request<BECESubmissionResponse>('/api/bece/practice/submit/', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  async getBECEAttempts(subject?: string) {
    let url = '/api/bece/attempts/';
    if (subject) {
      url += `?subject=${encodeURIComponent(subject)}`;
    }
    return this.request<BECEPracticeAttempt[]>(url);
  }

  async getBECEStatistics() {
    return this.request<BECEStatistics[]>('/api/bece/statistics/');
  }

  async getBECEDashboard() {
    return this.request<BECEDashboard>('/api/bece/dashboard/');
  }

  async getBECESubjectPerformance(subject: string) {
    return this.request(`/api/bece/performance/${subject}/`);
  }

  // Bundle navigation endpoints
  async getBundleSubjects(bundleId: number) {
    return this.request<BundleSubjectsResponse>(`/api/ecommerce/bundles/${bundleId}/subjects/`);
  }

  async getBundleSubjectCourses(bundleId: number, subjectId: number) {
    return this.request<BundleSubjectCoursesResponse>(`/api/ecommerce/bundles/${bundleId}/subjects/${subjectId}/courses/`);
  }
}

export const apiClient = new ApiClient();

// Type definitions for Django backend
export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_student: boolean;
  is_teacher: boolean;
  date_joined: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string;
  lesson_type: 'video' | 'text' | 'interactive' | 'quiz';
  order: number;
  duration_minutes: number;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  contents?: LessonContent[];
}

export interface LessonContent {
  id: number;
  content_type: 'text' | 'video' | 'image' | 'audio' | 'pdf';
  title: string;
  text_content: string;
  video_url?: string;
  video_file?: string;
  image_file?: string;
  audio_file?: string;
  pdf_file?: string;
  order: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  subject: {
    id: number;
    name: string;
    code: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  level: {
    id: number;
    name: string;
    code: string;
    description?: string;
    order?: number;
    is_active?: boolean;
  };
  thumbnail: string | null;
  // Preview video fields
  preview_video_url?: string;
  preview_video_file?: string;
  preview_video_duration?: number;
  preview_video_thumbnail?: string;
  has_preview_video?: boolean;
  // Course content fields
  learning_objectives?: string[];
  prerequisites?: string;
  duration_hours: number;
  difficulty: string;
  is_premium: boolean;
  is_published: boolean;
  lesson_count?: number;
  lessons?: Lesson[];
  created_at: string;
  updated_at?: string;
}

export interface CoursesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

export interface BECETest {
  id: number;
  title: string;
  description: string;
  subject: string;
  duration_minutes: number;
  total_questions: number;
  created_at: string;
}

export interface BECETestsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BECETest[];
}

// Bundle and E-commerce types
export interface Bundle {
  id: number;
  title: string;
  slug: string;
  description: string;
  bundle_type: 'subject' | 'level' | 'bece_prep' | 'custom';
  courses: Course[];
  original_price: string;
  discounted_price: string;
  discount_percentage: number;
  thumbnail: string | null;
  is_featured: boolean;
  is_active: boolean;
  course_count: number;
  created_at: string;
}

export interface BundlesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Bundle[];
}

export interface UserPurchase {
  id: number;
  bundle: Bundle;
  purchased_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface UserPurchasesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserPurchase[];
}

export interface OrderItem {
  id: number;
  bundle: Bundle;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Order {
  id: number;
  order_number: string;
  items: OrderItem[];
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
}

export interface OrderResponse {
  order: Order;
  message: string;
}

export interface Payment {
  id: number;
  order: Order;
  payment_method: string;
  amount: string;
  currency: string;
  transaction_id: string;
  status: string;
  processed_at: string | null;
  created_at: string;
}

export interface CheckoutResponse {
  payment: Payment;
  message: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  discount_amount: number;
  final_amount: number;
  coupon: {
    code: string;
    description: string;
    type: string;
    value: number;
  };
}

// MTN Mobile Money types
export interface MtnMomoInitiateResponse {
  success: boolean;
  transaction_id: string;
  order_id: number;
  payment_id: number;
  message: string;
}

export interface MtnMomoStatusResponse {
  success: boolean;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'UNKNOWN';
  transaction_id: string;
  order_id: number;
  financial_transaction_id?: string;
  payment_status: string;
}

// Teacher types
export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  qualification: string;
  experience_years: number;
  experience_text: string;
  specialization: string;
  profile_image: string | null;
  subjects: Subject[];
  primary_subject: Subject | null;
  subjects_list: string;
  achievements: string[];
  linkedin_url: string;
  twitter_url: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeachersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Teacher[];
}

// Bundle Subject Navigation types
export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
}

export interface BundleSubject extends Subject {
  courses: Course[];
  course_count: number;
}

export interface BundleSubjectsResponse {
  bundle: {
    id: number;
    title: string;
    slug: string;
  };
  subjects: BundleSubject[];
}

export interface BundleSubjectCoursesResponse {
  bundle: {
    id: number;
    title: string;
    slug: string;
  };
  subject: Subject;
  courses: Course[];
}

// Dashboard Stats types
export interface DashboardStats {
  lessons_completed: number;
  quizzes_passed: number;
  total_study_hours: number;
  study_streak: number;
  overall_progress: number;
  achievements_count: number;
  total_study_time_minutes: number;
  recent_lessons_count: number;
  recent_quizzes_count: number;
  is_premium: boolean;
}

// Bundle Progress types
export interface BundleProgressData {
  bundle_id: number;
  overall_progress: number;
  lessons_completed: number;
  total_lessons: number;
  subjects: {
    [subjectId: number]: {
      progress: number;
      lessons_completed: number;
      total_lessons: number;
    };
  };
}

// Upcoming Tasks types
export interface UpcomingTask {
  id: number;
  title: string;
  description: string;
  task_type: string;
  subject: string;
  due_date: string;
  priority: number;
  days_until_due: number;
  urgency_label: string;
  urgency_color: string;
  course_id: number | null;
  lesson_id: number | null;
  quiz_id: number | null;
}

export interface UpcomingTasksResponse {
  tasks: UpcomingTask[];
  count: number;
}

// Quiz types
export interface QuizAnswer {
  question_id: number;
  answer_id?: number;
  text_answer?: string;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  image?: string;
  points: number;
  order: number;
  explanation: string;
  answers: QuizAnswerOption[];
}

export interface QuizAnswerOption {
  id: number;
  answer_text: string;
  is_correct: boolean;
  order: number;
}

export interface QuizDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  subject: Subject;
  course?: {
    id: number;
    title: string;
    slug: string;
  };
  quiz_type: 'practice' | 'assessment' | 'bece_practice' | 'mock_exam';
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  question_count: number;
  questions: QuizQuestion[];
}

export interface UserQuizStats {
  attempts_count: number;
  best_score: number;
  can_attempt: boolean;
  last_attempt_date: string | null;
  passed: boolean;
}

export interface UserQuiz {
  id: number;
  title: string;
  slug: string;
  description: string;
  quiz_type: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  question_count: number;
  course?: {
    id: number;
    title: string;
    slug: string;
  };
  user_stats: UserQuizStats;
}

export interface QuizSubject {
  subject: Subject;
  quizzes: UserQuiz[];
}

export interface UserQuizzesResponse {
  quizzes_by_subject: { [key: string]: QuizSubject };
  total_quizzes: number;
  purchased_bundles: {
    id: number;
    title: string;
    bundle_type: string;
  }[];
}

export interface StartQuizResponse {
  attempt_id: number;
  quiz: UserQuiz;
  message: string;
}

export interface SubmitQuizResponse {
  attempt_id: number;
  score: number;
  total_points: number;
  percentage_score: number;
  passed: boolean;
  passing_score: number;
  time_taken_minutes: number;
  total_questions: number;
  correct_answers: number;
  message: string;
}

export interface QuizResultQuestion {
  id: number;
  question_text: string;
  question_type: string;
  points: number;
  order: number;
  explanation: string;
  answers: QuizAnswerOption[];
  user_answer: {
    selected_answer_id: number | null;
    selected_answer_text: string | null;
    text_answer: string | null;
    is_correct: boolean;
    points_earned: number;
  };
  correct_answer: QuizAnswerOption | null;
}

export interface QuizResultsResponse {
  attempt_id: number;
  quiz: {
    id: number;
    title: string;
    description: string;
    quiz_type: string;
    passing_score: number;
    time_limit_minutes: number;
    subject: Subject;
  };
  results: {
    score: number;
    total_points: number;
    percentage_score: number;
    passed: boolean;
    time_taken_minutes: number;
    total_questions: number;
    correct_answers: number;
    started_at: string;
    completed_at: string;
  };
  questions: QuizResultQuestion[];
  can_retake: boolean;
}

// BECE Practice types
export interface BECESubject {
  id: number;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  is_core: boolean;
  is_active: boolean;
}

export interface BECEYear {
  id: number;
  year: number;
  is_available: boolean;
  created_at: string;
}

export interface BECEAnswer {
  id: number;
  option_letter: string;
  answer_text: string;
  is_correct: boolean;
  question: number;
}

export interface BECEQuestion {
  id: number;
  question_number: number;
  question_text: string;
  image?: string;
  marks: number;
  difficulty_level: string;
  topic: string;
  paper: number;
  answers: BECEAnswer[];
}

export interface BECEPaper {
  id: number;
  year: BECEYear;
  subject: BECESubject;
  paper_type: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  instructions: string;
  is_published: boolean;
  created_at: string;
  questions: BECEQuestion[];
  question_count: number;
}

export interface BECEPaperList {
  id: number;
  year: BECEYear;
  subject: BECESubject;
  paper_type: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  question_count: number;
  created_at: string;
}

export interface BECEUserAnswer {
  id: number;
  question: number;
  selected_answer: number;
  is_correct: boolean;
  marks_earned: number;
}

export interface BECEPracticeAttempt {
  id: number;
  paper: BECEPaperList;
  started_at: string;
  completed_at?: string;
  score: number;
  total_marks: number;
  percentage: number;
  time_taken_minutes: number;
  is_completed: boolean;
  user_answers: BECEUserAnswer[];
}

export interface BECEStatistics {
  id: number;
  subject: BECESubject;
  total_attempts: number;
  best_score: number;
  average_score: number;
  total_time_minutes: number;
  last_attempt?: string;
}

export interface BECEDashboard {
  subjects: BECESubject[];
  recent_attempts: BECEPracticeAttempt[];
  statistics: BECEStatistics[];
  available_years: BECEYear[];
  total_attempts: number;
  subjects_practiced: number;
}

export interface BECESubmission {
  paper_id: number;
  answers: Array<{
    question_id: string;
    answer_id: string;
  }>;
}

export interface BECESubmissionResponse {
  attempt: BECEPracticeAttempt;
  statistics: BECEStatistics;
  message: string;
}

export interface StartBECEPracticeResponse {
  attempt_id: number;
  paper: BECEPaperList;
  message: string;
}

/**
 * Example response type for /api/demo (keeping for compatibility)
 */
export interface DemoResponse {
  message: string;
}
