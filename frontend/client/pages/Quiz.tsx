import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, useUserQuizzes, useQuiz } from "@/hooks/useApi";
import { apiClient, UserQuizzesResponse, QuizDetail, UserQuiz } from "@shared/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Award,
  Target,
  BookOpen,
  Users,
  Trophy,
  Play,
  RotateCcw,
  Star,
  TrendingUp,
  Brain,
  Zap,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";

export default function Quiz() {
  const { isAuthenticated } = useAuth();
  const { data: quizzesData, loading, error } = useUserQuizzes(isAuthenticated);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your quizzes...</p>
            </div>
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
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Quizzes</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please log in to access your quizzes.</p>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quizzesData || quizzesData.total_quizzes === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Quizzes Available</h2>
              <p className="text-gray-600 mb-6">
                Purchase a bundle to access quizzes for your subjects.
              </p>
              <Button asChild>
                <Link to="/bundles">Browse Bundles</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'bg-blue-100 text-blue-800';
      case 'assessment':
        return 'bg-purple-100 text-purple-800';
      case 'bece_practice':
        return 'bg-green-100 text-green-800';
      case 'mock_exam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuizTypeIcon = (type: string) => {
    switch (type) {
      case 'practice':
        return <Play className="h-4 w-4" />;
      case 'assessment':
        return <Award className="h-4 w-4" />;
      case 'bece_practice':
        return <Target className="h-4 w-4" />;
      case 'mock_exam':
        return <Trophy className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary via-brand-primary to-brand-secondary shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-full mb-6">
              <Brain className="mr-2 h-4 w-4" />
              🧠 Test Your Knowledge
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Quiz Dashboard
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Challenge yourself with interactive quizzes designed to reinforce your learning and track your progress
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{quizzesData.total_quizzes}</div>
                <div className="text-blue-100 text-sm font-medium">Available Quizzes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{Object.values(quizzesData.quizzes_by_subject).length}</div>
                <div className="text-blue-100 text-sm font-medium">Subjects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{quizzesData.purchased_bundles.length}</div>
                <div className="text-blue-100 text-sm font-medium">Active Bundles</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-900">{quizzesData.total_quizzes}</p>
                  <p className="text-sm text-blue-700 font-medium">Total Quizzes</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-900">
                    {Object.values(quizzesData.quizzes_by_subject).reduce((acc, subject) => 
                      acc + subject.quizzes.filter(q => q.user_stats.passed).length, 0
                    )}
                  </p>
                  <p className="text-sm text-green-700 font-medium">Completed</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(Object.values(quizzesData.quizzes_by_subject).reduce((acc, subject) => 
                      acc + subject.quizzes.reduce((sum, q) => sum + q.user_stats.best_score, 0), 0
                    ) / quizzesData.total_quizzes) || 0}%
                  </p>
                  <p className="text-sm text-purple-700 font-medium">Avg Score</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-900">
                    {Object.values(quizzesData.quizzes_by_subject).reduce((acc, subject) => 
                      acc + subject.quizzes.reduce((sum, q) => sum + q.user_stats.attempts_count, 0), 0
                    )}
                  </p>
                  <p className="text-sm text-orange-700 font-medium">Total Attempts</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Quizzes</h2>
            <p className="text-gray-600">Practice and master your subjects with interactive quizzes</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-gray-300">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Enhanced Quizzes by Subject */}
        <div className="space-y-8">
          {Object.entries(quizzesData.quizzes_by_subject).map(([subjectName, subjectData]) => (
            <Card key={subjectName} className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                      style={{ backgroundColor: subjectData.subject.color || '#6366f1' }}
                    >
                      {subjectData.subject.icon || subjectName.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{subjectName}</CardTitle>
                      <p className="text-gray-600 mt-1">
                        {subjectData.quizzes.length} quiz{subjectData.quizzes.length !== 1 ? 'es' : ''} • 
                        {subjectData.quizzes.filter(q => q.user_stats.passed).length} completed
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-brand-primary border-brand-primary">
                    {Math.round(subjectData.quizzes.filter(q => q.user_stats.passed).length / subjectData.quizzes.length * 100) || 0}% Complete
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectData.quizzes.map((quiz) => (
                    <div key={quiz.id} className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-primary/30 transition-all duration-300 cursor-pointer">
                      {/* Quiz Type Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${getQuizTypeColor(quiz.quiz_type)} flex items-center gap-1 text-xs`}>
                          {getQuizTypeIcon(quiz.quiz_type)}
                          {quiz.quiz_type.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Quiz Content */}
                      <div className="space-y-4">
                        <div className="pr-16">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {quiz.description}
                          </p>
                        </div>

                        {/* Quiz Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{quiz.time_limit_minutes} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span className="font-medium">{quiz.question_count} questions</span>
                          </div>
                        </div>

                        {quiz.course && (
                          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                            📚 From: {quiz.course.title}
                          </p>
                        )}

                        {/* Performance Stats */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">Best Score</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-bold ${quiz.user_stats.passed ? 'text-green-600' : 'text-gray-900'}`}>
                                {quiz.user_stats.best_score}%
                              </span>
                              {quiz.user_stats.passed && (
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">Attempts</span>
                            <span className="text-sm font-bold text-gray-900">
                              {quiz.user_stats.attempts_count}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Progress</span>
                              <span>{quiz.user_stats.best_score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${quiz.user_stats.best_score}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          asChild
                        >
                          <Link to={`/quiz/${quiz.slug}`}>
                            <Play className="mr-2 h-4 w-4" />
                            {quiz.user_stats.attempts_count > 0 ? 'Retake Quiz' : 'Start Quiz'}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Purchased Bundles Section */}
        <Card className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-indigo-900">Your Active Bundles</CardTitle>
                <p className="text-indigo-700 text-sm">Bundles that give you access to these quizzes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzesData.purchased_bundles.map((bundle) => (
                <div key={bundle.id} className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{bundle.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {bundle.bundle_type.replace('_', ' ')} Bundle
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Call-to-Action */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-3">
                Keep Up the Great Work! 🎉
              </h3>
              <p className="text-green-800 mb-6">
                Regular practice makes perfect. Challenge yourself with more quizzes to master your subjects and boost your confidence.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  onClick={() => {
                    const firstQuiz = Object.values(quizzesData.quizzes_by_subject)[0]?.quizzes[0];
                    if (firstQuiz) {
                      window.location.href = `/quiz/${firstQuiz.slug}`;
                    }
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Take a Quiz Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  asChild
                >
                  <Link to="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
