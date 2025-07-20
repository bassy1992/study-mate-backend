import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuth, useUserPurchases, useDashboardStats } from "@/hooks/useApi";
import { SubjectCoursesGrid } from "../components/SubjectCoursesGrid";
import {
  BookOpen,
  PlayCircle,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Users,
  Target,
  Bell,
  Loader2,
  GraduationCap,
  Sparkles,
  Calendar,
  Zap,
  Star,
  ArrowRight,
  BarChart3,
  Trophy,
  Flame,
  Brain,
  Rocket,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "Student";

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    } else {
      // Extract name from email if no first/last name
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
  };

  // Get user's purchased bundles
  const { data: purchasesData, loading: purchasesLoading } = useUserPurchases(isAuthenticated);
  const enrolledBundles = purchasesData?.results || [];

  // Get dashboard stats
  const { data: dashboardStats, loading: statsLoading } = useDashboardStats(isAuthenticated);

  const recentActivity = [
    {
      type: "lesson",
      subject: "Mathematics",
      activity: "Completed: Linear Equations",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-primary",
    },
    {
      type: "quiz",
      subject: "English",
      activity: "Quiz Score: 85% on Grammar",
      time: "1 day ago",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      type: "lesson",
      subject: "Science",
      activity: "Started: States of Matter",
      time: "2 days ago",
      icon: PlayCircle,
      color: "text-purple-600",
    },
  ];

  // Create stats array with real data and progress percentages
  const stats = [
    {
      title: "Lessons Completed",
      value: statsLoading ? "..." : (dashboardStats?.lessons_completed?.toString() || "0"),
      icon: Target,
      color: "text-primary",
      progress: statsLoading ? 0 : Math.min(100, (dashboardStats?.lessons_completed || 0) * 10), // 10% per lesson, max 100%
      target: "10 lessons"
    },
    {
      title: "Quizzes Passed",
      value: statsLoading ? "..." : (dashboardStats?.quizzes_passed?.toString() || "0"),
      icon: Award,
      color: "text-secondary",
      progress: statsLoading ? 0 : Math.min(100, (dashboardStats?.quizzes_passed || 0) * 20), // 20% per quiz, max 100%
      target: "5 quizzes"
    },
    {
      title: "Study Hours",
      value: statsLoading ? "..." : `${dashboardStats?.total_study_hours || 0}h`,
      icon: Clock,
      color: "text-primary",
      progress: statsLoading ? 0 : Math.min(100, ((dashboardStats?.total_study_hours || 0) / 20) * 100), // Target: 20 hours
      target: "20h goal"
    },
    {
      title: "Study Streak",
      value: statsLoading ? "..." : (dashboardStats?.study_streak?.toString() || "0"),
      icon: Users,
      color: "text-primary",
      progress: statsLoading ? 0 : Math.min(100, ((dashboardStats?.study_streak || 0) / 30) * 100), // Target: 30 days
      target: "30 day goal"
    },
  ];

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
          {/* Enhanced Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-secondary rounded-3xl shadow-2xl mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-8 py-16">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  {loading ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                          Loading Dashboard...
                        </h1>
                        <p className="text-blue-100 text-xl">
                          Preparing your personalized learning environment
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <GraduationCap className="h-8 w-8 text-white" />
                          </div>
                          <Sparkles className="h-5 w-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <div>
                          <h1 className="text-4xl md:text-5xl font-bold">
                            Welcome back, {getUserDisplayName()}!
                          </h1>
                          <p className="text-blue-100 text-xl mt-2">
                            Ready to continue your learning adventure?
                          </p>
                        </div>
                      </div>
                      {user && (
                        <div className="flex items-center space-x-4 mt-6">
                          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-blue-100 text-sm font-medium">
                              Online • {user.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <Calendar className="h-4 w-4 text-blue-100" />
                            <p className="text-blue-100 text-sm font-medium">
                              {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Achievement Cards */}
                <div className="hidden lg:flex items-center space-x-4">
                  <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <Flame className="h-6 w-6 text-yellow-300 mr-2" />
                      <div className="text-3xl font-bold text-white">
                        {statsLoading ? "..." : (dashboardStats?.study_streak || 0)}
                      </div>
                    </div>
                    <div className="text-blue-100 text-sm font-medium">Day Streak</div>
                    <div className="w-12 h-1 bg-yellow-400 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="h-6 w-6 text-green-300 mr-2" />
                      <div className="text-3xl font-bold text-white">
                        {statsLoading ? "..." : `${Math.round(dashboardStats?.overall_progress || 0)}%`}
                      </div>
                    </div>
                    <div className="text-blue-100 text-sm font-medium">Progress</div>
                    <div className="w-12 h-1 bg-green-400 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-blue-300 mr-2" />
                      <div className="text-3xl font-bold text-white">
                        {statsLoading ? "..." : (dashboardStats?.lessons_completed || 0)}
                      </div>
                    </div>
                    <div className="text-blue-100 text-sm font-medium">Completed</div>
                    <div className="w-12 h-1 bg-blue-400 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-40 translate-x-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <Sparkles className="h-4 w-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">{stat.title}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out relative group-hover:animate-pulse"
                      style={{ width: `${stat.progress}%` }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-500 font-medium">
                      Target: {stat.target}
                    </div>
                    <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {Math.round(stat.progress)}%
                    </div>
                  </div>
                </div>

                {/* Enhanced Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Courses */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Courses
                  </h2>
                  <Button variant="outline" asChild>
                    <Link to="/bundles">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Courses
                    </Link>
                  </Button>
                </div>

                <div className="space-y-6">
                  {purchasesLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-gray-600">Loading your courses...</p>
                    </div>
                  ) : (
                    <SubjectCoursesGrid purchases={enrolledBundles} />
                  )}

                  {enrolledBundles.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Video Courses Enrolled
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start your learning journey by enrolling in a video-based course bundle.
                      </p>
                      {enrolledBundles.some(bundle => bundle.bundle.bundle_type === 'bece_prep') && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-blue-800 text-sm">
                            <strong>📚 BECE Materials Available:</strong> Your BECE preparation materials are available in the{' '}
                            <Link to="/bece-dashboard" className="text-blue-600 hover:underline font-medium">
                              BECE Dashboard
                            </Link>.
                          </p>
                        </div>
                      )}
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white"
                        asChild
                      >
                        <Link to="/bundles">Browse Course Bundles</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <activity.icon
                          className={`h-4 w-4 ${activity.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.activity}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.subject} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Learning Progress Card */}
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-sm border border-primary/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Learning Progress
                  </h3>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold text-primary">
                        {statsLoading ? "..." : `${Math.round(dashboardStats?.overall_progress || 0)}%`}
                      </span>
                    </div>
                    <div className="w-full bg-primary/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${dashboardStats?.overall_progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-lg font-bold text-primary">
                        {statsLoading ? "..." : (dashboardStats?.lessons_completed || 0)}
                      </div>
                      <div className="text-xs text-gray-600">Lessons</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">
                        {statsLoading ? "..." : (dashboardStats?.quizzes_passed || 0)}
                      </div>
                      <div className="text-xs text-gray-600">Quizzes</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600">
                        {statsLoading ? "..." : (dashboardStats?.study_streak || 0)}
                      </div>
                      <div className="text-xs text-gray-600">Streak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Tasks
                  </h3>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        Math Quiz - Chapter 5
                      </p>
                      <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                        Due Soon
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Linear Equations & Inequalities</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-orange-600 font-medium">Due: Jan 25, 2024</p>
                      <Button variant="outline" className="text-xs h-6 px-2">
                        Start
                      </Button>
                    </div>
                  </div>

                  <div className="group p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        English Essay Assignment
                      </p>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        3 days
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Narrative Writing Techniques</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-green-600 font-medium">Due: Jan 28, 2024</p>
                      <Button variant="outline" className="text-xs h-6 px-2">
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Latest Updates
                    </h3>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          New Practice Tests Available
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          We've added comprehensive BECE-style practice tests for all JHS 3 subjects with detailed explanations.
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-primary font-medium">Jan 20, 2024</p>
                          <Button variant="outline" className="text-xs h-6 px-2">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Achievement System Launch
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Earn badges and certificates as you complete lessons and achieve milestones.
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-purple-600 font-medium">Jan 18, 2024</p>
                          <Button variant="outline" className="text-xs h-6 px-2">
                            Explore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                    asChild
                  >
                    <Link to="/quiz">
                      <Target className="mr-2 h-4 w-4" />
                      Take Practice Quiz
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link to="/progress">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Progress Report
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link to="/profile">
                      <Users className="mr-2 h-4 w-4" />
                      Update Profile
                    </Link>
                  </Button>
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
