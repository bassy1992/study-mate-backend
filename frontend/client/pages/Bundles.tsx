import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBundles, useUserPurchases, useAuth } from "@/hooks/useApi";
import {
  CheckCircle,
  Users,
  Clock,
  BookOpen,
  Star,
  PlayCircle,
  Download,
  Award,
  Loader2,
  ShoppingCart,
} from "lucide-react";

export default function Bundles() {
  const { user, isAuthenticated } = useAuth();
  const { data: bundlesData, loading: bundlesLoading, error: bundlesError } = useBundles();
  const { data: purchasesData, loading: purchasesLoading } = useUserPurchases();

  // Get user's purchased bundle IDs
  const purchasedBundleIds = purchasesData?.results?.map(p => p.bundle.id) || [];

  // Check if user owns a bundle
  const isOwned = (bundleId: number) => purchasedBundleIds.includes(bundleId);

  // Get bundle features based on type
  const getBundleFeatures = (bundle: any) => {
    const baseFeatures = [
      `${bundle.course_count} comprehensive courses`,
      "Video lessons & practice quizzes",
      "Progress tracking dashboard",
      "Mobile Money payment accepted",
      "24/7 mobile access",
      "Downloadable study materials",
    ];

    if (bundle.bundle_type === 'bece_prep') {
      return [
        "🎯 Complete BECE past questions (2015-2024)",
        "📝 BECE-style practice tests & mock exams",
        "🏆 Detailed answer explanations & marking schemes",
        "📊 Performance analytics & progress tracking",
        "📚 Comprehensive study guides & revision notes",
        "🎓 Senior High School entrance preparation",
      ];
    }

    return baseFeatures;
  };

  // Get bundle badge
  const getBundleBadge = (bundle: any) => {
    if (bundle.is_featured) return "Most Popular";
    if (bundle.bundle_type === 'bece_prep') return "BECE Ready";
    return null;
  };

  if (bundlesLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-gray-600">Loading course bundles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (bundlesError) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-red-600">Error loading bundles: {bundlesError}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bundles = bundlesData?.results || [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Choose Your Learning Bundle
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Comprehensive course packages designed for each JHS level. All
            aligned with the Ghana Education Service curriculum.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-600">3 Core Subjects</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-600">3 Months Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-600">Mobile Money Accepted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => {
              const badge = getBundleBadge(bundle);
              const features = getBundleFeatures(bundle);
              const owned = isAuthenticated && isOwned(bundle.id);
              
              return (
                <div
                  key={bundle.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                    bundle.is_featured
                      ? "border-primary scale-105"
                      : bundle.bundle_type === 'bece_prep'
                        ? "border-primary hover:border-primary/80"
                        : "border-gray-200 hover:border-primary/60"
                  } ${owned ? "ring-2 ring-green-500" : ""}`}
                >
                  {badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`text-white px-6 py-2 rounded-full text-sm font-semibold ${
                        bundle.is_featured ? "bg-secondary" : "bg-primary"
                      }`}>
                        {badge}
                      </div>
                    </div>
                  )}

                  {owned && (
                    <div className="absolute -top-4 right-4">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-semibold">
                        ✓ Owned
                      </div>
                    </div>
                  )}

                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {bundle.title}
                      </h3>
                      <p className="text-gray-600">{bundle.description}</p>
                      <div className="space-y-1">
                        {bundle.discount_percentage > 0 && (
                          <div className="text-lg text-gray-500 line-through">
                            GH₵{bundle.original_price}
                          </div>
                        )}
                        <div className="text-4xl font-bold text-primary">
                          GH₵{bundle.discounted_price}
                        </div>
                        {bundle.discount_percentage > 0 && (
                          <div className="text-sm text-green-600 font-semibold">
                            Save {bundle.discount_percentage}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{bundle.course_count} courses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>3 months access</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    {owned ? (
                      <Button
                        className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 text-white"
                        asChild
                      >
                        <Link to={bundle.bundle_type === 'bece_prep' ? "/bece-preparation" : `/dashboard/bundles/${bundle.id}/subjects`}>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Access Your Courses
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        className={`w-full py-3 text-lg ${
                          bundle.is_featured
                            ? "bg-secondary hover:bg-secondary/90 text-white"
                            : bundle.bundle_type === 'bece_prep'
                              ? "bg-primary hover:bg-primary/90 text-white"
                              : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                        asChild
                      >
                        <Link to={`/checkout?bundle=${bundle.slug}`}>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {isAuthenticated ? `Purchase ${bundle.title}` : 'Sign in to Purchase'}
                        </Link>
                      </Button>
                    )}

                    <div className="text-center">
                      <Link
                        to={`/bundles/${bundle.slug}`}
                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BECE Preparation Highlight */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              <Award className="h-4 w-4" />
              <span>BECE Preparation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Master the BECE with Past Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our JHS 3 bundle includes comprehensive BECE preparation with 10
              years of past questions, detailed solutions, and exam strategies
              to help you excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-primary/20">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  10 Years
                </h3>
                <p className="text-sm text-gray-600">
                  Past Questions (2015-2024)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-secondary/20">
              <div className="text-center space-y-3">
                <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  3 Subjects
                </h3>
                <p className="text-sm text-gray-600">English, Math & Science</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-primary/20">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mock Tests
                </h3>
                <p className="text-sm text-gray-600">Full BECE simulations</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-secondary/20">
              <div className="text-center space-y-3">
                <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Solutions
                </h3>
                <p className="text-sm text-gray-600">Detailed explanations</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
              asChild
            >
              <Link to="/bece-preparation">
                <Award className="mr-2 h-5 w-5" />
                Explore BECE Preparation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subject Breakdown */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What's Included in Every Bundle
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each bundle covers three core subjects with comprehensive learning
              materials and interactive content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    English Language
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Grammar & Vocabulary</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Reading Comprehension</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Essay Writing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Oral Communication</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Mathematics
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-secondary" />
                    <span>Algebra & Equations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-secondary" />
                    <span>Geometry & Measurement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-secondary" />
                    <span>Statistics & Data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-secondary" />
                    <span>Problem Solving</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Integrated Science
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Biology & Life Science</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Chemistry Basics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Physics Fundamentals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>Environmental Science</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Flexible Payment Options
            </h2>
            <p className="text-lg text-gray-600">
              We support multiple payment methods convenient for Ghanaian
              students and parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-500/5 rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Mobile Money
              </h3>
              <div className="space-y-2 text-gray-600">
                <div>✓ MTN Mobile Money</div>
                <div>✓ Vodafone Cash</div>
                <div>✓ AirtelTigo Money</div>
              </div>
            </div>

            <div className="bg-blue-600/5 rounded-xl p-6 border border-blue-600/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Card Payments
              </h3>
              <div className="space-y-2 text-gray-600">
                <div>✓ Visa</div>
                <div>✓ Mastercard</div>
                <div>✓ Secure checkout</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-sm text-gray-600">
              All payments are processed securely through trusted payment
              gateways. You'll receive instant access to your chosen bundle
              after successful payment.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
