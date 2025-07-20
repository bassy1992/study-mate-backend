import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { apiClient } from "@shared/api";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      console.log("Logging in user:", formData.email);

      const response = await apiClient.login(formData.email, formData.password);
      
      // Store the token
      localStorage.setItem('authToken', response.token);
      
      // Show success message
      toast.success(`Welcome back, ${response.user.first_name || response.user.email}!`);
      
      // Redirect to dashboard
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes('400')) {
        // Handle validation errors from backend
        setErrors({ 
          email: "Invalid email or password",
          password: "Please check your credentials"
        });
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message.includes('401')) {
        setErrors({ 
          email: "Invalid credentials",
          password: "Please check your email and password"
        });
        toast.error("Invalid credentials. Please check your email and password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Back */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Welcome Back!
                  </h1>
                </div>
                <p className="text-lg text-gray-600">
                  Continue your learning journey with GhanaLearn. Login to
                  access your courses and track your progress.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    🎓 Continue Your Studies
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          JHS 2 Mathematics
                        </div>
                        <div className="text-sm text-gray-600">
                          Chapter 5: Algebra
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">75%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          English Language
                        </div>
                        <div className="text-sm text-gray-600">
                          Essay Writing
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-secondary">
                          60%
                        </div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your courses are waiting for you. Pick up where you left
                    off!
                  </p>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    New to GhanaLearn?
                  </h4>
                  <p className="text-gray-600">
                    Join thousands of JHS students improving their grades with
                    our GES-aligned curriculum.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/signup">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Login to Your Account
                  </h2>
                  <p className="text-gray-600">
                    Enter your credentials to continue learning
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
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
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="text-primary hover:underline font-medium"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white h-12 text-lg font-medium"
                  >
                    {isLoading ? "Logging in..." : "Login to Dashboard"}
                  </Button>
                </form>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Don't have an account?
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-medium border-secondary text-secondary hover:bg-secondary hover:text-white"
                    asChild
                  >
                    <Link to="/signup">Create New Account</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By logging in, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
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
