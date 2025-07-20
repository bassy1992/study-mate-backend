import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiClient } from "../../shared/api";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Users,
  Clock,
  Award,
  Loader2,
  AlertCircle,
  GraduationCap,
  Target,
  PlayCircle,
  Star,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  course_count: number;
}

interface BundleSubjectsData {
  bundle: {
    id: number;
    title: string;
    slug: string;
  };
  subjects: Subject[];
}

export default function BundleSubjects() {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<BundleSubjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundleSubjects = async () => {
      if (!bundleId) {
        setError("Bundle ID is required");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.getBundleSubjects(parseInt(bundleId));
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bundle subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchBundleSubjects();
  }, [bundleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading bundle subjects...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Subjects</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No bundle data found.</p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <Navigation />

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-secondary rounded-3xl shadow-2xl mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-8 py-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                  <div className="text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                          {data.bundle.title}
                        </h1>
                        <p className="text-blue-100 text-lg mt-1">
                          Choose your subject to start learning
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="hidden lg:flex items-center space-x-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                    <div className="text-2xl font-bold text-white mb-1">
                      {data.subjects.length}
                    </div>
                    <div className="text-blue-100 text-sm font-medium">Subjects</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                    <div className="text-2xl font-bold text-white mb-1">
                      {data.subjects.reduce((total, subject) => total + subject.course_count, 0)}
                    </div>
                    <div className="text-blue-100 text-sm font-medium">Total Courses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          {/* Subject Selection Guide */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Learn?</h3>
                <p className="text-gray-600">Select a subject below to access video lessons, practice exercises, and track your progress.</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All subjects included in your bundle</span>
              </div>
            </div>
          </div>

          {/* Enhanced Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.subjects.map((subject, index) => (
              <div
                key={subject.id}
                className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Subject Card Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{ 
                    background: `linear-gradient(135deg, ${subject.color}20 0%, transparent 50%)` 
                  }}
                ></div>

                <div className="relative z-10 p-8 space-y-6">
                  {/* Subject Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundColor: `${subject.color}15`,
                          borderColor: `${subject.color}30`
                        }}
                      >
                        <BookOpen 
                          className="h-8 w-8" 
                          style={{ color: subject.color }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block mt-1">
                          {subject.code}
                        </p>
                      </div>
                    </div>
                    <Sparkles className="h-5 w-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Subject Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-gray-900">{subject.course_count}</span>
                        <span className="text-gray-600">courses</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Self-paced</span>
                    </div>
                  </div>

                  {/* Progress Preview */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Ready to start</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-700 font-semibold">New</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                        style={{ 
                          width: '0%',
                          background: `linear-gradient(90deg, ${subject.color}, ${subject.color}80)`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <Button
                      className="w-full h-12 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                      style={{ 
                        backgroundColor: subject.color,
                        borderColor: subject.color
                      }}
                      asChild
                    >
                      <Link to={`/dashboard/bundles/${data.bundle.id}/subjects/${subject.id}/courses`}>
                        <div className="flex items-center space-x-2">
                          <PlayCircle className="h-5 w-5" />
                          <span>Start Learning</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Includes video lessons, quizzes & progress tracking
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Empty State */}
          {data.subjects.length === 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Subjects Available
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                This bundle doesn't have any subjects configured yet. Please check back later or contact support.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 text-lg font-medium rounded-2xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Dashboard
              </Button>
            </div>
          )}

          {/* Learning Tips Section */}
          {data.subjects.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 border border-primary/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Learning Tips</h3>
                  <p className="text-gray-600">Make the most of your study time</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 rounded-2xl p-6 border border-white/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-gray-900">Set Goals</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aim to complete 2-3 lessons per week for steady progress.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-2xl p-6 border border-white/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <h4 className="font-semibold text-gray-900">Stay Consistent</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Regular 30-minute study sessions are more effective than cramming.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-2xl p-6 border border-white/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Track Progress</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete quizzes to test your understanding and earn achievements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}