import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowLeft,
  Shield
} from "lucide-react";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid || !token) {
      setError("Invalid reset link");
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/password-reset/confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30">
        <Navigation />

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
          <div className="w-full max-w-lg">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Password Reset Successful
                    </h1>
                    <p className="text-gray-600">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button asChild className="w-full h-11">
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go to Login
                      </Link>
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Redirecting to login page in 3 seconds...
                  </p>
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
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse opacity-75"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                  <KeyRound className="h-8 w-8 text-white" />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                Set New Password
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Enter your new password below
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10 pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading || !uid || !token}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting...</span>
                    </div>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </Button>
              </form>

              <Alert className="bg-gray-50 border-gray-200">
                <Shield className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-700">
                  <strong>Security Notice:</strong> After resetting your password, you'll need to log in again on all devices.
                </AlertDescription>
              </Alert>

              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}