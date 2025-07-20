import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiClient, BECEDashboard } from "../../shared/api";
import { useAuth, useUserPurchases } from "@/hooks/useApi";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  Download,
  Play,
  FileText,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";

export default function BECEPreparation() {
  const [dashboardData, setDashboardData] = useState<BECEDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check authentication and BECE bundle ownership
  const { isAuthenticated } = useAuth();
  const { data: purchasesData } = useUserPurchases();
  const hasBECEBundle = purchasesData?.results?.some(
    purchase => purchase.bundle.bundle_type === 'bece_prep' && purchase.is_active
  ) || false;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Try to get dashboard data (requires auth + premium)
        const data = await apiClient.getBECEDashboard();
        setDashboardData(data);
      } catch (err) {
        // If dashboard fails, try to get basic data (subjects and years)
        try {
          const [subjects, years] = await Promise.all([
            apiClient.getBECESubjects(),
            apiClient.getBECEYears()
          ]);
          
          // Create basic dashboard data for non-premium users
          setDashboardData({
            subjects,
            available_years: years,
            recent_attempts: [],
            statistics: [],
            total_attempts: 0,
            subjects_practiced: 0
          });
        } catch (basicErr) {
          setError(basicErr instanceof Error ? basicErr.message : 'Failed to load BECE data');
        }
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
            <p className="text-gray-600">Loading BECE preparation data...</p>
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
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  // Map subjects to display data
  const getSubjectDisplayData = (subject: any) => {
    const subjectMap: Record<string, any> = {
      'english_language': {
        name: "English Language",
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        topics: [
          "Reading Comprehension",
          "Essay Writing",
          "Grammar & Usage",
          "Oral English",
          "Literature",
        ],
      },
      'mathematics': {
        name: "Mathematics",
        icon: Target,
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-300",
        topics: [
          "Number & Numeration",
          "Algebraic Processes",
          "Geometry & Trigonometry",
          "Statistics & Probability",
          "Mensuration",
        ],
      },
      'integrated_science': {
        name: "Integrated Science",
        icon: Star,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        topics: [
          "Physics Concepts",
          "Chemistry Basics",
          "Biology & Life Science",
          "Environmental Science",
          "Scientific Method",
        ],
      },
    };

    return subjectMap[subject.name] || {
      name: subject.display_name,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      topics: ["Various Topics"],
    };
  };

  const subjects = (dashboardData?.subjects && Array.isArray(dashboardData.subjects)) 
    ? dashboardData.subjects
        .filter(s => s.is_core && s.is_active)
        .map(subject => ({
          ...getSubjectDisplayData(subject),
          id: subject.id,
          backendName: subject.name,
          years: `${dashboardData.available_years?.length || 0} years`,
          questions: "1,000+", // This would need to be calculated from actual data
        }))
    : [];

  const yearlyPapers = (dashboardData?.available_years && Array.isArray(dashboardData.available_years))
    ? dashboardData.available_years.map(year => ({
        year: year.year.toString(),
        status: year.is_available ? "Available" : "Coming Soon",
        papers: 3, // This would need to be calculated from actual papers
      }))
    : [];

  const features = [
    {
      icon: FileText,
      title: "Complete Past Papers",
      description:
        "Access 10 years of BECE past questions with detailed solutions",
    },
    {
      icon: Award,
      title: "Marking Schemes",
      description:
        "Official marking schemes and answer explanations for every question",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your progress and identify areas for improvement",
    },
    {
      icon: Clock,
      title: "Timed Practice",
      description: "Practice under exam conditions with built-in timers",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-blue-25 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Award className="h-4 w-4" />
              <span>BECE Preparation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Master the BECE with Past Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive BECE exam preparation with 10 years of past
              questions, detailed solutions, and performance analytics to ensure
              your success.
            </p>
            <div className="flex justify-center">
              {!isAuthenticated || !hasBECEBundle ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    asChild
                  >
                    <Link to="/checkout?bundle=JHS3&redirect=/bece-subject-selection">
                      <Award className="mr-2 h-5 w-5" />
                      Get BECE Bundle - $15
                    </Link>
                  </Button>
                  <Button variant="outline" className="px-8 py-3 text-lg" asChild>
                    <Link to="/preview/bece">
                      <Play className="mr-2 h-5 w-5" />
                      Preview Questions
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="px-8 py-3 text-lg" asChild>
                  <Link to="/bece-dashboard">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-blue-600">
                {dashboardData?.available_years?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Years Covered</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-blue-500">3,700+</div>
              <div className="text-sm text-gray-600">Past Questions</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-blue-700">30</div>
              <div className="text-sm text-gray-600">Complete Papers</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-blue-600">
                {dashboardData?.total_attempts || 0}
              </div>
              <div className="text-sm text-gray-600">Your Attempts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Breakdown */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Subjects Covered
            </h2>
            <p className="text-lg text-gray-600">
              Complete past questions for all three core BECE subjects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-md border-2 ${subject.borderColor} hover:shadow-lg transition-shadow`}
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${subject.bgColor} flex items-center justify-center`}
                    >
                      <subject.icon className={`h-6 w-6 ${subject.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subject.years} • {subject.questions} questions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Topics Covered:
                    </h4>
                    <ul className="space-y-2">
                      {subject.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className={`w-full border-2 hover:${subject.color.replace("text-", "text-")} hover:${subject.borderColor.replace("border-", "border-")}`}
                    asChild
                  >
                    <Link
                      to={isAuthenticated && hasBECEBundle 
                        ? `/bece-practice/${subject.backendName}` 
                        : "/checkout?bundle=JHS3&redirect=/bece-subject-selection"
                      }
                    >
                      {isAuthenticated && hasBECEBundle 
                        ? `Practice ${subject.name}` 
                        : `Get Access to ${subject.name}`
                      }
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Years Available */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Past Papers by Year
            </h2>
            <p className="text-lg text-gray-600">
              Complete collection of BECE papers from 2015 to 2024
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {yearlyPapers.map((paper, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow border"
              >
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {paper.year}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {paper.status}
                  </div>
                  <div className="text-xs text-gray-600">
                    {paper.papers} Papers
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools and resources for BECE preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Excel in Your BECE?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of students who have improved their BECE
              performance with our comprehensive past questions and preparation
              materials.
            </p>
            <div className="flex justify-center">
              {!isAuthenticated || !hasBECEBundle ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                    asChild
                  >
                    <Link to="/checkout?bundle=JHS3&redirect=/bece-subject-selection">
                      <Award className="mr-2 h-5 w-5" />
                      Start BECE Preparation - $15
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                    asChild
                  >
                    <Link to="/bundles">View All Bundles</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                  asChild
                >
                  <Link to="/bece-dashboard">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex items-center justify-center space-x-6 text-white/80 text-sm mt-8">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>1,200+ students enrolled</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>3 months access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
