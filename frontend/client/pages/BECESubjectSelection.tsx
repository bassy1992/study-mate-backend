import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiClient, BECESubject } from "../../shared/api";
import {
  BookOpen,
  Target,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Loader2,
  Trophy,
  Clock,
  FileText,
} from "lucide-react";

export default function BECESubjectSelection() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<BECESubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await apiClient.getBECESubjects();
        // Filter to show only core subjects
        const coreSubjects = data.filter(s => s.is_core && s.is_active);
        setSubjects(coreSubjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  // Subject display configuration
  const getSubjectConfig = (subject: BECESubject) => {
    const configs: Record<string, any> = {
      'mathematics': {
        icon: Target,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        hoverColor: "hover:bg-blue-100",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        description: "Practice with algebra, geometry, statistics, and more",
        topics: ["Algebra", "Geometry", "Statistics", "Fractions", "Percentages"],
        route: "/bece-practice/mathematics"
      },
      'english_language': {
        icon: BookOpen,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        hoverColor: "hover:bg-green-100",
        buttonColor: "bg-green-600 hover:bg-green-700",
        description: "Master grammar, vocabulary, and comprehension skills",
        topics: ["Grammar", "Vocabulary", "Comprehension", "Writing", "Literature"],
        route: "/bece-practice/english_language"
      },
      'integrated_science': {
        icon: Star,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        hoverColor: "hover:bg-purple-100",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        description: "Explore physics, chemistry, biology, and environmental science",
        topics: ["Physics", "Chemistry", "Biology", "Environment", "Scientific Method"],
        route: "/bece-practice/integrated_science"
      }
    };

    return configs[subject.name] || {
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      hoverColor: "hover:bg-gray-100",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      description: "Practice with past questions and exercises",
      topics: ["Various Topics"],
      route: `/bece-practice/${subject.name}`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading BECE subjects...</p>
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
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Subjects</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => navigate('/bece-preparation')}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Back to BECE Preparation
              </Button>
            </div>
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
        <div className="max-w-6xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <div className="space-y-6">
                <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    🎉 Welcome to BECE Practice!
                  </h1>
                  <p className="text-lg text-gray-600">
                    Your payment was successful. Choose a subject to start practicing with real BECE past questions.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-6 text-sm text-green-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Full Access Unlocked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>3 Months Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>All Past Questions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Choose Your Subject to Practice
              </h2>
              <p className="text-gray-600">
                Select any subject below to start practicing with authentic BECE past questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subjects.map((subject) => {
                const config = getSubjectConfig(subject);
                const IconComponent = config.icon;

                return (
                  <div
                    key={subject.id}
                    className={`bg-white rounded-2xl shadow-md border-2 ${config.borderColor} ${config.hoverColor} transition-all duration-200 hover:shadow-lg hover:scale-105`}
                  >
                    <div className="p-8 space-y-6">
                      {/* Subject Header */}
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 ${config.bgColor} rounded-2xl flex items-center justify-center mx-auto`}>
                          <IconComponent className={`h-8 w-8 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {subject.display_name}
                          </h3>
                          <p className="text-gray-600 text-sm mt-2">
                            {config.description}
                          </p>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Practice Areas:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {config.topics.map((topic: string, index: number) => (
                            <span
                              key={index}
                              className={`px-3 py-1 ${config.bgColor} ${config.color} rounded-full text-xs font-medium`}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Practice Stats */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">15+</div>
                          <div className="text-xs text-gray-600">Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">3</div>
                          <div className="text-xs text-gray-600">Years</div>
                        </div>
                      </div>

                      {/* Start Practice Button */}
                      <Button
                        className={`w-full ${config.buttonColor} text-white py-3 text-base font-semibold`}
                        asChild
                      >
                        <Link to={config.route}>
                          Start {subject.display_name} Practice
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                🎯 Ready to Excel in Your BECE?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                You now have full access to authentic BECE past questions from 2022-2024.
                Practice regularly, track your progress, and build confidence for your examination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button variant="outline" asChild>
                  <Link to="/bece-dashboard">
                    <Award className="mr-2 h-4 w-4" />
                    BECE Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/bece-preparation">
                    <FileText className="mr-2 h-4 w-4" />
                    Back to BECE Preparation
                  </Link>
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