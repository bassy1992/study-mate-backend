import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentMethodSelector, PaymentMethod } from "@/components/PaymentMethodSelector";
import { MtnMomoPayment } from "@/components/MtnMomoPayment";
import { useAuth, useBundle } from "@/hooks/useApi";
import { apiClient } from "@shared/api";
import {
  ShoppingCart,
  CheckCircle,
  CreditCard,
  Smartphone,
  Shield,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const bundleSlug = searchParams.get("bundle");
  
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'processing'>('details');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "",
    email: user?.email || "",
    phone: "",
    agreeToTerms: false,
  });

  // Load bundle data from API
  const { data: bundle, loading: bundleLoading, error: bundleError } = useBundle(bundleSlug || '');

  // Redirect to login if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      setCurrentStep('processing');
      
      // For MTN MoMo, the payment is already processed and the bundle is activated
      // No need to call checkout API again as the MTN MoMo flow handles everything
      toast.success("Payment successful! Your course bundle has been activated.");
      
      // Get redirect parameter from URL
      const redirectUrl = searchParams.get('redirect');
      
      // Redirect to BECE subject selection or dashboard after payment
      setTimeout(() => {
        if (redirectUrl && redirectUrl.includes('bece-practice')) {
          // Redirect to BECE subject selection page for BECE purchases
          navigate('/bece-subject-selection');
        } else if (redirectUrl) {
          // Direct redirect for other purchases
          navigate(redirectUrl);
        } else {
          // Default to dashboard
          navigate('/dashboard');
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error("Payment processed but there was an error activating your bundle. Please contact support.");
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setCurrentStep('payment');
  };

  const handlePaymentCancel = () => {
    setSelectedPaymentMethod(null);
    setCurrentStep('payment');
  };

  // Loading state
  if (bundleLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-600">Loading bundle details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (bundleError || !bundle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-red-600">Bundle not found or error loading bundle details</p>
            <Button onClick={() => navigate('/bundles')}>
              Back to Bundles
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    "3 months unlimited access",
    "HD video lessons",
    "Interactive quizzes and assessments",
    "Downloadable study materials",
    "Progress tracking dashboard",
    "Mobile-friendly learning",
    "GES curriculum aligned",
    "Certificate of completion",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link to="/bundles" className="hover:text-gold">
              Course Bundles
            </Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-gold/10 w-10 h-10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {currentStep === 'details' ? 'Complete Your Order' : 
                         currentStep === 'payment' ? 'Choose Payment Method' : 
                         'Processing Payment'}
                      </h1>
                      <p className="text-gray-600">
                        {currentStep === 'details' ? "You're one step away from starting your learning journey" :
                         currentStep === 'payment' ? 'Select your preferred payment method' :
                         'Please wait while we process your payment'}
                      </p>
                    </div>
                  </div>

                  {/* Selected Bundle */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bundle.title}
                        </h3>
                        <p className="text-gray-600">
                          {bundle.description}
                        </p>
                        <div className="space-y-1">
                          {bundle.courses?.slice(0, 3).map((course, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald" />
                              <span className="text-gray-600">{course.subject.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        {bundle.discount_percentage > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            GH₵{bundle.original_price}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gold">
                          GH₵{bundle.discounted_price}
                        </div>
                        <div className="text-sm text-gray-500">GHS</div>
                        {bundle.discount_percentage > 0 && (
                          <div className="text-xs text-green-600 font-semibold">
                            Save {bundle.discount_percentage}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-step Content */}
                  {currentStep === 'details' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Contact Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="h-12"
                            />
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
                              placeholder="Enter your email"
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g., +233 XX XXX XXXX"
                            className="h-12"
                          />
                          <p className="text-xs text-gray-500">
                            Required for Mobile Money payments and account verification
                          </p>
                        </div>
                      </div>

                      {/* Terms Agreement */}
                      <div className="space-y-4">
                        <div className="border-t pt-6">
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
                                className="text-gold hover:underline font-medium"
                              >
                                Terms & Conditions
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/privacy"
                                className="text-gold hover:underline font-medium"
                              >
                                Privacy Policy
                              </Link>
                              . I understand that I will receive 3 months access to the selected course bundle.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t">
                        <Button variant="outline" asChild>
                          <Link to="/bundles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Bundles
                          </Link>
                        </Button>
                        <Button
                          type="submit"
                          disabled={!formData.agreeToTerms}
                          className="bg-gold hover:bg-gold/90 text-white"
                        >
                          Proceed to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Payment Method Selection */}
                  {currentStep === 'payment' && !selectedPaymentMethod && (
                    <div className="space-y-6">
                      <PaymentMethodSelector 
                        onSelectMethod={handlePaymentMethodSelect}
                        selectedMethod={selectedPaymentMethod}
                      />
                      
                      {selectedPaymentMethod && (
                        <div className="flex items-center justify-between pt-6 border-t">
                          <Button 
                            variant="outline" 
                            onClick={() => setCurrentStep('details')}
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Details
                          </Button>
                          <Button
                            onClick={() => {
                              if (selectedPaymentMethod === 'mobile_money') {
                                // MTN MoMo will be handled by the MtnMomoPayment component
                              } else {
                                toast.info(`${selectedPaymentMethod} payment coming soon!`);
                              }
                            }}
                            className="bg-gold hover:bg-gold/90 text-white"
                          >
                            Continue with Payment
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MTN MoMo Payment */}
                  {currentStep === 'payment' && selectedPaymentMethod === 'mobile_money' && (
                    <div className="space-y-6">
                      <MtnMomoPayment
                        amount={parseFloat(bundle.discounted_price)}
                        currency="GHS"
                        bundleId={bundle.id}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onCancel={handlePaymentCancel}
                      />
                    </div>
                  )}

                  {/* Processing State */}
                  {currentStep === 'processing' && (
                    <div className="text-center space-y-6 py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Processing Your Purchase</h3>
                        <p className="text-gray-600 mt-2">
                          Please wait while we activate your course bundle...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {bundle.title}
                    </span>
                    <span className="font-medium">
                      GH₵{bundle.discounted_price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{bundle.course_count} courses included</span>
                    <span>3 months access</span>
                  </div>
                  {bundle.discount_percentage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Original Price:</span>
                      <span className="text-gray-500 line-through">GH₵{bundle.original_price}</span>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-gold">
                        GH₵{bundle.discounted_price} GHS
                      </span>
                    </div>
                    {bundle.discount_percentage > 0 && (
                      <div className="text-right">
                        <span className="text-sm text-green-600 font-medium">
                          You save GH₵{(parseFloat(bundle.original_price) - parseFloat(bundle.discounted_price)).toFixed(2)} ({bundle.discount_percentage}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Included
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods Preview */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Accepted Payments
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Smartphone className="h-5 w-5 text-gold" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Mobile Money
                      </div>
                      <div className="text-xs text-gray-500">
                        MTN, Vodafone, AirtelTigo
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <CreditCard className="h-5 w-5 text-emerald" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Credit/Debit Cards
                      </div>
                      <div className="text-xs text-gray-500">
                        Visa, Mastercard
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-emerald" />
                  <h4 className="font-medium text-gray-900">Secure Payment</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We use
                  industry-standard security measures to protect your data.
                </p>
              </div>

              {/* Need Help */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    Having trouble with your order? Our support team is here to
                    help.
                  </p>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      <a
                        href="mailto:support@ghanalearn.com"
                        className="text-gold hover:underline"
                      >
                        support@ghanalearn.com
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      <span className="text-gray-600">+233 XX XXX XXXX</span>
                    </div>
                  </div>
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
