import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import { useBundles, useUserPurchases, useAuth, useTeachers } from "@/hooks/useApi";
import {
  BookOpen,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  Shield,
  Smartphone,
  Loader2,
  ShoppingCart,
} from "lucide-react";

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const { data: bundlesData, loading: bundlesLoading, error: bundlesError } = useBundles();
  const { data: purchasesData } = useUserPurchases(isAuthenticated);
  const { data: teachersData, loading: teachersLoading, error: teachersError } = useTeachers(true); // Get featured teachers

  // Get user's purchased bundle IDs
  const purchasedBundleIds = purchasesData?.results?.map(p => p.bundle.id) || [];

  // Check if user owns a bundle
  const isOwned = (bundleId: number) => purchasedBundleIds.includes(bundleId);

  const bundles = bundlesData?.results || [];
  const teachers = teachersData?.results || [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blush via-white to-white px-4 sm:px-6 lg:px-8 py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  🇬🇭 Ghana's Premier JHS Learning Platform
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Excel in JHS with{" "}
                  <span className="text-primary">StudyMate</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Comprehensive online learning platform designed for Junior
                  High School students in Ghana. Perfectly aligned with the
                  Ghana Education Service curriculum for JHS 1, 2, and 3.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group"
                  asChild
                >
                  <Link to="/bundles">
                    Explore Courses
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-10 py-4 h-auto font-semibold transition-all duration-300"
                  asChild
                >
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-gray-600 font-medium">
                    GES Curriculum Aligned
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-gray-600 font-medium">
                    Mobile Optimized
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-gray-600 font-medium">
                    5000+ Students
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
              ✨ Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Why StudyMate Leads
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Designed specifically for Ghanaian JHS students with cutting-edge
              features that make quality education accessible, engaging, and
              effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center space-y-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="bg-gradient-to-br from-primary to-secondary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                GES Curriculum Aligned
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All content meticulously follows the official Ghana Education
                Service curriculum standards for JHS 1, 2, and 3 students.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center space-y-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="bg-gradient-to-br from-primary to-secondary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Mobile-First Learning
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly optimized for smartphones and tablets, enabling
                effective learning anytime, anywhere across Ghana.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center space-y-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="bg-gradient-to-br from-primary to-secondary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Affordable Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Premium education at just $15 per bundle, with convenient Mobile
                Money payment options tailored for Ghanaians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
              📚 Our Courses
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Comprehensive Learning Bundles
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect bundle for your JHS level. Each comprehensive
              package includes English, Mathematics, and Integrated Science.
            </p>
          </div>

          {bundlesLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-gray-600">Loading course bundles...</p>
              </div>
            </div>
          ) : bundlesError ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">Error loading bundles: {bundlesError}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bundles.slice(0, 3).map((bundle) => {
                const owned = isAuthenticated && isOwned(bundle.id);
                const subjects = bundle.courses?.map(course => course.subject.name) || ['English Language', 'Mathematics', 'Integrated Science'];
                
                return (
                  <div
                    key={bundle.id}
                    className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2 ${
                      owned ? 'ring-2 ring-green-500' : ''
                    } ${bundle.is_featured ? 'border-blue-500' : ''}`}
                  >
                    <div className="space-y-6">
                      {/* Header with badge */}
                      <div className="relative">
                        {bundle.is_featured && (
                          <div className="absolute -top-4 -right-4">
                            <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Popular
                            </div>
                          </div>
                        )}
                        {owned && (
                          <div className="absolute -top-4 -left-4">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              ✓ Owned
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {bundle.title}
                          </h3>
                          <div className="text-right">
                            {bundle.discount_percentage > 0 && (
                              <div className="text-sm text-gray-500 line-through">
                                GH₵{bundle.original_price}
                              </div>
                            )}
                            <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-lg font-bold shadow-md">
                              GH₵{bundle.discounted_price}
                            </div>
                            {bundle.discount_percentage > 0 && (
                              <div className="text-xs text-green-600 font-semibold mt-1">
                                Save {bundle.discount_percentage}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {bundle.description}
                      </p>

                      {/* Subjects */}
                      <div className="space-y-2">
                        {subjects.slice(0, 3).map((subject, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-gray-600">{subject}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{bundle.course_count} courses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>3 months access</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      {owned ? (
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 font-semibold py-3"
                          asChild
                        >
                          <Link to="/bece-preparation">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Access Your Courses
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          className={`w-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 font-semibold py-3 ${
                            bundle.is_featured
                              ? 'bg-secondary hover:bg-secondary/90 text-white'
                              : 'bg-primary hover:bg-primary/90 text-white'
                          }`}
                          asChild
                        >
                          <Link to={isAuthenticated ? `/checkout?bundle=${bundle.slug}` : '/login'}>
                            {isAuthenticated ? (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Purchase Bundle
                              </>
                            ) : (
                              'Sign in to Purchase'
                            )}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Bundles Link */}
          {bundles.length > 3 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
                asChild
              >
                <Link to="/bundles">
                  View All Course Bundles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">
                5,000+
              </div>
              <div className="text-white/80 font-medium">Active Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">
                98%
              </div>
              <div className="text-white/80 font-medium">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">
                50+
              </div>
              <div className="text-white/80 font-medium">Expert Teachers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">
                24/7
              </div>
              <div className="text-white/80 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Profiles Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blush via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
              👨‍🏫 Meet Our Teachers
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Expert Educators from Ghana
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn from qualified teachers with years of experience in the Ghanaian education system, 
              dedicated to helping JHS students excel in their studies.
            </p>
          </div>

          {teachersLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-gray-600">Loading teacher profiles...</p>
              </div>
            </div>
          ) : teachersError ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">Error loading teachers: {teachersError}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600">No featured teachers available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.slice(0, 6).map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative">
                    {/* Teacher Image */}
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={teacher.profile_image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`}
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`;
                        }}
                      />
                    </div>
                    {/* Subject Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {teacher.primary_subject?.name || teacher.subjects_list || 'Teacher'}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Name and Title */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {teacher.name}
                      </h3>
                      <p className="text-primary font-semibold">
                        {teacher.primary_subject?.name || teacher.subjects_list || 'Subject'} Teacher
                      </p>
                    </div>

                    {/* Qualifications */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{teacher.qualification}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{teacher.experience_text}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{teacher.specialization}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {teacher.bio}
                    </p>

                    {/* Achievements */}
                    {teacher.achievements && teacher.achievements.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Achievements:</h4>
                        <div className="space-y-1">
                          {teacher.achievements.slice(0, 3).map((achievement, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Star className="h-3 w-3 text-gold fill-gold" />
                              <span className="text-xs text-gray-600">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Learn from the Best
              </h3>
              <p className="text-gray-600 mb-6">
                Our teachers are carefully selected based on their expertise, teaching experience, 
                and commitment to student success. Join thousands of students who are already 
                benefiting from their guidance.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                asChild
              >
                <Link to="/bundles">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20">
              🚀 Ready to Transform Your Education?
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Excel in Your JHS Studies with
              <span className="block text-white/90">StudyMate</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join over 5,000 Ghanaian students who are already improving their
              grades and securing their academic future with our proven learning
              platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-4 h-auto shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold group"
              asChild
            >
              <Link to="/bundles">
                Explore All Courses
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-10 py-4 h-auto font-bold transition-all duration-300 backdrop-blur-sm"
              asChild
            >
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>

          <div className="pt-8">
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
