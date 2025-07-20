import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@shared/api";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data for Django backend
      const registrationData = {
        email: formData.email.trim(),
        username: formData.email.trim(), // Using email as username
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        password: formData.password,
        password_confirm: formData.confirmPassword,
        phone_number: formData.phone.trim(),
      };

      console.log("Registering user:", registrationData);

      const response = await apiClient.register(registrationData);
      
      // Store the token
      localStorage.setItem('authToken', response.token);
      
      // Show success message
      toast.success("Account created successfully! Welcome to BECE Platform!");
      
      // Redirect to dashboard
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.message.includes('400')) {
        // Handle validation errors from backend
        try {
          const errorData = JSON.parse(error.message.split('API Error: 400 ')[1] || '{}');
          if (typeof errorData === 'object') {
            setErrors(errorData);
            toast.error("Please fix the errors in the form");
          } else {
            toast.error("Registration failed. Please check your information.");
          }
        } catch {
          toast.error("Registration failed. Please check your information.");
        }
      } else if (error.message.includes('email')) {
        setErrors({ email: "This email is already registered" });
        toast.error("This email is already registered. Try logging in instead.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Access to all JHS levels (1, 2, 3)",
    "GES curriculum-aligned content",
    "Mobile-friendly learning",
    "Progress tracking & certificates",
    "Affordable $15 per bundle pricing",
    "Mobile Money payment support",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Join StudyMate
                  </h1>
                </div>
                <p className="text-lg text-gray-600">
                  Start your journey to academic excellence with Ghana's premier
                  JHS learning platform and BECE preparation.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  What you'll get:
                </h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    🎯 Perfect for JHS Students
                  </h4>
                  <p className="text-gray-600">
                    Whether you're in JHS 1, 2, or 3, our content is
                    specifically designed to help you excel in English, Math,
                    and Science with comprehensive BECE preparation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600">
                    Fill in your details to get started
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className={`h-12 ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && (
                        <div className="flex items-center space-x-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.firstName}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className={`h-12 ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && (
                        <div className="flex items-center space-x-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <div className="flex items-center space-x-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        className={`h-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center space-x-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.password}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={`h-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center space-x-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.confirmPassword}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +233 XX XXX XXXX"
                      className="h-12"
                    />
                    <p className="text-xs text-gray-500">
                      For Mobile Money payments and notifications
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeToTerms: !!checked,
                        }))
                      }
                      className="mt-1"
                    />
                    <div className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline font-medium"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </div>
                    {errors.agreeToTerms && (
                      <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.agreeToTerms}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white h-12 text-lg font-medium"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
