import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  PlayCircle,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  CheckCircle,
  Award,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Target,
  Calendar,
  ArrowRight,
  GraduationCap,
  Trophy,
  Flame
} from 'lucide-react';
import { apiClient, type UserPurchase, type BundleSubject } from '@shared/api';
import { useDashboardStats } from '@/hooks/useApi';

interface SubjectCoursesGridProps {
  purchases: UserPurchase[];
}

interface BundleProgressData {
  bundleId: number;
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  subjectProgress: { [subjectId: number]: { progress: number; lessonsCompleted: number; totalLessons: number } };
}

export function SubjectCoursesGrid({ purchases }: SubjectCoursesGridProps) {
  const navigate = useNavigate();
  const [subjectsData, setSubjectsData] = useState<{ [bundleId: number]: BundleSubject[] }>({});
  const [loading, setLoading] = useState(true);
  
  // Filter out BECE bundles (question-based) - only show video-based bundles
  const videoBundles = useMemo(() => {
    return purchases.filter(purchase => purchase.bundle.bundle_type !== 'bece_prep');
  }, [purchases]);
  

  
  // Get real progress data from dashboard stats
  const { data: dashboardStats } = useDashboardStats(true);

  useEffect(() => {
    const fetchAllSubjects = async () => {
      if (videoBundles.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const subjectsPromises = videoBundles.map(async (purchase) => {
          try {
            const response = await apiClient.getBundleSubjects(purchase.bundle.id);
            return { bundleId: purchase.bundle.id, subjects: response.subjects };
          } catch (error) {
            console.error(`Failed to fetch subjects for bundle ${purchase.bundle.id}:`, error);
            return { bundleId: purchase.bundle.id, subjects: [] };
          }
        });

        const results = await Promise.all(subjectsPromises);
        
        const subjectsMap: { [bundleId: number]: BundleSubject[] } = {};
        
        results.forEach(({ bundleId, subjects }) => {
          subjectsMap[bundleId] = subjects;
        });

        setSubjectsData(subjectsMap);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubjects();
  }, [videoBundles]);

  const getSubjectIcon = (subjectCode: string) => {
    const iconMap: { [key: string]: string } = {
      'MATH': '🔢',
      'ENG': '📚',
      'SCI': '🔬',
      'SOC': '🌍',
      'ICT': '💻',
      'RME': '🙏',
      'GHA': '🇬🇭',
      'FRE': '🇫🇷'
    };
    return iconMap[subjectCode] || '📖';
  };

  const handleSubjectClick = (bundleId: number, subjectId: number, subjectName: string) => {
    // Navigate to subject courses page
    navigate(`/dashboard/bundles/${bundleId}/subjects/${subjectId}/courses`);
  };

  const handleCoursePreview = (courseSlug: string, courseName: string) => {
    // Navigate to course preview/lesson page
    navigate(`/courses/${courseSlug}/preview`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <Sparkles className="h-4 w-4 text-yellow-500 absolute top-0 right-1/2 transform translate-x-8 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Your Learning Journey</h3>
        <p className="text-gray-600">Preparing your personalized course experience...</p>
      </div>
    );
  }

  if (videoBundles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-3xl p-8 backdrop-blur-sm">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200/30 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-200/30 rounded-full"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <Sparkles className="h-5 w-5 text-yellow-500 absolute top-0 right-1/2 transform translate-x-10 animate-pulse" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Ready to Start Your Learning Journey?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            You currently have BECE preparation materials. Explore video courses to enhance your learning experience.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-100/50 border border-blue-200/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold text-blue-800">
                  BECE Materials Available
                </p>
              </div>
              <p className="text-xs text-blue-700">
                Access your BECE preparation materials in the dedicated dashboard
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
                asChild
              >
                <Link to="/bece-dashboard">
                  <Award className="mr-2 h-4 w-4" />
                  BECE Dashboard
                </Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/bundles">
                  <Zap className="mr-2 h-4 w-4" />
                  Explore Video Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {videoBundles.map((purchase) => {
        const subjects = subjectsData[purchase.bundle.id] || [];
        
        return (
          <div key={purchase.id} className="space-y-6">
            {/* Enhanced Bundle Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/15 via-primary/10 to-secondary/15 rounded-3xl p-8 border border-primary/30 shadow-lg backdrop-blur-sm">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-xl">
                        <GraduationCap className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {purchase.bundle.title}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2 bg-white/50 rounded-full px-3 py-1">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/50 rounded-full px-3 py-1">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span className="font-medium">Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-green-100/80 text-green-800 border-green-300 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Active Bundle
                    </Badge>
                    <div className="text-right bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div className="text-3xl font-bold text-primary">
                          {dashboardStats ? `${Math.round(dashboardStats.overall_progress)}%` : '0%'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Overall Progress</div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">Learning Progress</span>
                    <span className="text-gray-600">{dashboardStats?.lessons_completed || 0} lessons completed</span>
                  </div>
                  <div className="w-full bg-white/40 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-primary via-secondary to-primary h-3 rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" 
                      style={{ width: `${dashboardStats ? Math.round(dashboardStats.overall_progress) : 0}%` }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Subject Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm border"
                          style={{ 
                            backgroundColor: subject.color + '15',
                            borderColor: subject.color + '30'
                          }}
                        >
                          {getSubjectIcon(subject.code)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">
                            {subject.name}
                          </h4>
                          <p className="text-sm font-medium text-gray-500">{subject.code}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>

                    {/* Subject Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span className="font-medium">{subject.course_count} courses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Self-paced</span>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium"
                        style={{ 
                          backgroundColor: subject.color + '20', 
                          color: subject.color,
                          borderColor: subject.color + '30'
                        }}
                      >
                        {subject.code}
                      </Badge>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-bold text-gray-900">
                          {dashboardStats ? `${Math.round(dashboardStats.overall_progress / subjects.length)}%` : '0%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-1000 shadow-sm"
                          style={{ 
                            width: `${dashboardStats ? Math.round(dashboardStats.overall_progress / subjects.length) : 0}%`,
                            backgroundColor: subject.color 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {dashboardStats && dashboardStats.overall_progress > 0 
                          ? `${dashboardStats.lessons_completed} lessons completed` 
                          : 'Ready to start learning'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Course Preview Section */}
                  {subject.courses && subject.courses.length > 0 && (
                    <div className="px-6 pb-4">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Featured Courses</p>
                        {subject.courses.slice(0, 2).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-primary/10 transition-colors cursor-pointer border border-gray-100 hover:border-primary/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCoursePreview(course.slug, course.title);
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <PlayCircle className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {course.title}
                                </span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {course.difficulty}
                                  </Badge>
                                  <span className="text-xs text-gray-500">• 2h 30m</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {subject.courses.length > 2 && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 font-medium">
                              +{subject.courses.length - 2} more course{subject.courses.length - 2 !== 1 ? 's' : ''} available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="p-6 pt-0 space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (subject.courses && subject.courses.length > 0) {
                          handleCoursePreview(subject.courses[0].slug, subject.courses[0].title);
                        }
                      }}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Learning
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-200 hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubjectClick(purchase.bundle.id, subject.id, subject.name);
                      }}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      View All Courses
                    </Button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Enhanced Empty State */}
            {subjects.length === 0 && (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Available</h3>
                <p className="text-gray-600 mb-4">Courses are being configured for this bundle</p>
                <Button variant="outline" className="mx-auto">
                  <Clock className="mr-2 h-4 w-4" />
                  Check Back Later
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}