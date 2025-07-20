import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Shield,
  KeyRound,
  Send,
  Clock,
  HelpCircle,
  Sparkles,
  Lock
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/password-reset/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Password reset requested for:", email);
        setIsSubmitted(true);
      } else {
        console.error("Password reset failed:", data);
        // Still show success message for security (don't reveal if email exists)
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Network error:", error);
      // Still show success message for better UX
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Success State - Email Sent
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30">
        <Navigation />

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
          <div className="w-full max-w-lg">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Success Icon */}
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Check Your Email
                    </h1>
                    <p className="text-gray-600">
                      We've sent a password reset link to:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <p className="font-semibold text-gray-900">{email}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <Alert className="text-left bg-blue-50 border-blue-200">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Next steps:</strong> Click the link in your email to reset your password.
                      The link will expire in 24 hours for security.
                    </AlertDescription>
                  </Alert>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button asChild className="w-full h-11">
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full h-11"
                    >
                      Try Different Email
                    </Button>
                  </div>

                  {/* Help Text */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Didn't receive the email? Check your spam folder or{" "}
                      <a
                        href="mailto:support@ghanalearn.com"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        contact support
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main Form State
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30">
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-lg">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              {/* Icon */}
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse opacity-75"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                  <KeyRound className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Enter your email address and we'll send you a secure link to reset your password
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10 h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    We'll send reset instructions to this email address
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Send Reset Link</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <Separator className="my-6" />

                <Button
                  variant="outline"
                  className="w-full h-11 border-gray-200 hover:bg-gray-50"
                  asChild
                >
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
              </div>

              {/* Security Info */}
              <Alert className="bg-gray-50 border-gray-200">
                <Lock className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-700">
                  <strong>Security Notice:</strong> Reset links expire after 24 hours and can only be used once.
                </AlertDescription>
              </Alert>

              {/* Help Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900">Need Help?</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Make sure you enter the email used to create your account</p>
                      <p>• Check your spam/junk folder if you don't see the email</p>
                      <p>• Contact support if you continue having issues</p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="mailto:support@ghanalearn.com"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        support@ghanalearn.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>24hr expiry</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure process</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
