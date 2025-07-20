import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiClient, BECEDashboard as BECEDashboardData } from "../../shared/api";
import {
  BookOpen,
  Target,
  Award,
  Clock,
  TrendingUp,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function BECEDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<BECEDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiClient.getBECEDashboard();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load BECE dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading BECE dashboard...</p>
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
              <h3 className="text-lg font-semibold text-red-800 mb-2">Access Required</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <Link to="/checkout?bundle=JHS3&redirect=/bece-dashboard">
                    <Award className="mr-2 h-4 w-4" />
                    Get BECE Bundle - $15
                  </Link>
                </Button>
                <Button 
                  onClick={() => navigate('/bece-preparation')} 
                  variant="outline"
                  className="w-full"
                >
                  Back to BECE Preparation
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No BECE data available.</p>
            <Button onClick={() => navigate('/bece-preparation')} variant="outline">
              Back to BECE Preparation
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  BECE Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Track your BECE preparation progress and practice performance
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link to="/bece-preparation">
                    <BookOpen className="mr-2 h-4 w-4" />
                    BECE Preparation
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/bece-preparation">
                    <Target className="mr-2 h-4 w-4" />
                    Start Practicing
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {dashboardData.subjects.length}
              </div>
              <div className="text-sm text-gray-600">Active Subjects</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {dashboardData.available_years.length}
              </div>
              <div className="text-sm text-gray-600">Available Years</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {dashboardData.total_attempts}
              </div>
              <div className="text-sm text-gray-600">Practice Attempts</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {dashboardData.subjects_practiced}
              </div>
              <div className="text-sm text-gray-600">Subjects Practiced</div>
            </div>
          </div>

          <div className="space-y-8">

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Practice Activity
              </h3>
              {dashboardData.recent_attempts.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recent_attempts.map((attempt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {attempt.paper.subject.display_name} - {attempt.paper.year.year}
                          </p>
                          <p className="text-sm text-gray-600">
                            Score: {attempt.percentage}% • {new Date(attempt.completed_at || attempt.started_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {attempt.percentage >= 70 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                        <span className="text-sm font-medium">
                          {attempt.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent practice attempts</p>
                  <Button className="mt-4" asChild>
                    <Link to="/bece-preparation">
                      Start Practicing
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Subject Performance */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Subject Performance
              </h3>
              {dashboardData.statistics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.statistics.map((stat, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {stat.subject.display_name}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {stat.total_attempts} attempts
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Best Score:</span>
                          <span className="font-medium">{stat.best_score}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Average:</span>
                          <span className="font-medium">{stat.average_score.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No performance data available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Complete some practice sessions to see your statistics
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}