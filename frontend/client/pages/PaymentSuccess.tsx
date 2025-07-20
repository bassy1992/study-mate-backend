import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  BookOpen,
  ArrowRight,
  Calendar,
  CreditCard,
  Mail,
  Star,
  Award,
  Clock,
} from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectUrl = searchParams.get('redirect');
  const [countdown, setCountdown] = useState(5);
  
  // Auto-redirect after 5 seconds if redirect URL is provided
  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        navigate(redirectUrl);
      }, 5000);
      
      // Countdown timer
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [redirectUrl, navigate]);

  const orderDetails = {
    orderId: "GHL-2024-001523",
    bundle: "JHS 2 Bundle",
    amount: 15.0,
    currency: "USD",
    paymentMethod: "MTN Mobile Money",
    transactionId: "MP240120-1234567890",
    customerName: "Akosua Mensah",
    email: "akosua.mensah@gmail.com",
    purchaseDate: "January 20, 2024",
    accessExpiry: "April 20, 2024",
  };

  const includedSubjects = [
    "English Language",
    "Mathematics",
    "Integrated Science",
  ];

  // Determine the subject name for display
  const getSubjectName = (url: string) => {
    if (url.includes('mathematics')) return 'Mathematics';
    if (url.includes('integrated_science')) return 'Integrated Science';
    if (url.includes('english_language')) return 'English Language';
    return 'BECE Practice';
  };

  const nextSteps = redirectUrl ? [
    {
      title: `Start ${getSubjectName(redirectUrl)} Practice`,
      description: "Begin practicing with BECE past questions",
      icon: Award,
      action: "Start Practice Now",
      link: redirectUrl,
      primary: true,
    },
    {
      title: "Access Your Dashboard",
      description: "View your enrolled courses and track progress",
      icon: BookOpen,
      action: "Go to Dashboard",
      link: "/dashboard",
      primary: false,
    },
    {
      title: "Download Receipt",
      description: "Save your payment confirmation",
      icon: Download,
      action: "Download PDF",
      link: "#",
      primary: false,
    },
  ] : [
    {
      title: "Access Your Dashboard",
      description: "View your enrolled courses and track progress",
      icon: BookOpen,
      action: "Go to Dashboard",
      link: "/dashboard",
      primary: true,
    },
    {
      title: "Start Learning",
      description: "Begin with your first lesson",
      icon: ArrowRight,
      action: "Start First Lesson",
      link: "/course/jhs2/english",
      primary: false,
    },
    {
      title: "Download Receipt",
      description: "Save your payment confirmation",
      icon: Download,
      action: "Download PDF",
      link: "#",
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8 text-center">
            <div className="space-y-6">
              <div className="bg-emerald/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-emerald" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  🎉 Payment Successful!
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome to GhanaLearn! Your enrollment is now complete.
                </p>
              </div>

              <div className="bg-emerald/5 border border-emerald/20 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald">
                      {orderDetails.bundle}
                    </div>
                    <div className="text-sm text-gray-600">Course Bundle</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gold">
                      ${orderDetails.amount}
                    </div>
                    <div className="text-sm text-gray-600">Amount Paid</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-earth">3</div>
                    <div className="text-sm text-gray-600">Subjects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-redirect notification for BECE practice */}
          {redirectUrl && countdown > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      🎯 Ready to Start Practicing!
                    </h3>
                    <p className="text-blue-600">
                      You'll be automatically redirected to {getSubjectName(redirectUrl)} practice in {countdown} seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-lg font-bold">{countdown}</span>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link to={redirectUrl}>
                      Start Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Details */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-gray-900">
                          {orderDetails.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium text-gray-900">
                          {orderDetails.customerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {orderDetails.email}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-gray-900">
                          {orderDetails.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-gray-900 text-sm">
                          {orderDetails.transactionId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Date:</span>
                        <span className="font-medium text-gray-900">
                          {orderDetails.purchaseDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Course Access Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Bundle:</div>
                          <div className="font-medium">
                            {orderDetails.bundle}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Access Until:
                          </div>
                          <div className="font-medium text-emerald">
                            {orderDetails.accessExpiry}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Included Subjects:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {includedSubjects.map((subject, index) => (
                            <span
                              key={index}
                              className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What's Next?
                </h2>

                <div className="space-y-4">
                  {nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${
                        step.primary
                          ? "border-gold bg-gold/5"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              step.primary
                                ? "bg-gold text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            <step.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        <Button
                          className={
                            step.primary
                              ? "bg-gold hover:bg-gold/90 text-white"
                              : ""
                          }
                          variant={step.primary ? "default" : "outline"}
                          asChild
                        >
                          <Link to={step.link}>{step.action}</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Important Information */}
              <div className="bg-gradient-to-br from-gold/10 to-emerald/10 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  📧 Check Your Email
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    We've sent a confirmation email to{" "}
                    <span className="font-medium text-gray-900">
                      {orderDetails.email}
                    </span>
                  </p>
                  <p>
                    The email contains your receipt, login instructions, and
                    helpful getting started tips.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>Check your spam folder if you don't see it</span>
                  </div>
                </div>
              </div>

              {/* Course Benefits */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Your Course Benefits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span className="text-sm text-gray-600">
                      3 months unlimited access
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span className="text-sm text-gray-600">
                      HD video lessons
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span className="text-sm text-gray-600">
                      Interactive quizzes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span className="text-sm text-gray-600">
                      Progress tracking
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span className="text-sm text-gray-600">
                      Mobile-friendly
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald" />
                    <span className="text-sm text-gray-600">
                      Completion certificate
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Need Support?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    Our support team is here to help you succeed in your
                    learning journey.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gold" />
                      <a
                        href="mailto:support@ghanalearn.com"
                        className="text-gold hover:underline"
                      >
                        support@ghanalearn.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gold" />
                      <span>Payment issues: Instant support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Your Experience */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Rate Your Experience
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  How was your enrollment process?
                </p>
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-6 w-6 text-gold fill-current cursor-pointer hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
                <Button variant="outline" className="w-full text-sm">
                  Submit Feedback
                </Button>
              </div>

              {/* Share Success */}
              <div className="bg-gradient-to-br from-emerald/10 to-gold/10 rounded-2xl p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🎓 Share Your Success!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Let your friends know you're improving your grades with
                  GhanaLearn
                </p>
                <Button variant="outline" className="w-full text-sm">
                  Share on Social Media
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
