import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Play,
  Clock,
  Star,
  CheckCircle,
  Lock,
  Award,
  Users,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, type BundleSubjectCoursesResponse, type Course } from '@shared/api';

export default function SubjectCourses() {
  const { bundleId, subjectId } = useParams<{ bundleId: string; subjectId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<BundleSubjectCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bundleId || !subjectId) {
      setError('Bundle ID or Subject ID not found');
      setLoading(false);
      return;
    }

    fetchSubjectCourses();
  }, [bundleId, subjectId]);

  const fetchSubjectCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getBundleSubjectCourses(
        parseInt(bundleId!), 
        parseInt(subjectId!)
      );
      setData(response);
    } catch (err: any) {
      console.error('Failed to fetch subject courses:', err);
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    // Navigate to course detail/lessons page
    navigate(`/courses/${course.slug}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Courses</h1>
          <p className="text-gray-600 mb-6">{error || 'Failed to load courses.'}</p>
          <Button onClick={() => navigate(`/dashboard/bundles/${bundleId}/subjects`)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Button>
          <Button variant="outline" onClick={fetchSubjectCourses}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Professional Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-secondary shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/dashboard/bundles/${bundleId}/subjects`)}
            className="mb-6 text-white hover:bg-white/20 border border-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Button>
          
          {/* Enhanced Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-blue-100 mb-6">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              to={`/dashboard/bundles/${bundleId}/subjects`} 
              className="hover:text-white transition-colors"
            >
              {data.bundle.title}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{data.subject.name}</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/20"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                {data.subject.code === 'MATH' ? '🔢' : 
                 data.subject.code === 'ENG' ? '📚' : 
                 data.subject.code === 'SCI' ? '🔬' : '📖'}
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{data.subject.name}</h1>
                <p className="text-blue-100 text-lg mb-3">
                  {data.subject.description || `Master ${data.subject.name} with comprehensive courses`}
                </p>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{data.courses.length} course{data.courses.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Self-paced learning</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Certificate included</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">0%</div>
                <div className="text-blue-100 text-sm font-medium">Progress</div>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mt-2">
                  <div className="w-0 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Enhanced Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Courses</h2>
            <p className="text-gray-600">Choose a course to start your learning journey</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-primary border-primary px-3 py-1">
              {data.courses.length} Course{data.courses.length !== 1 ? 's' : ''}
            </Badge>
            <Button variant="outline" size="sm">
              <Target className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Professional Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.courses.map((course, index) => (
            <div
              key={course.id}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/courses/${course.slug}/preview`)}
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to StudyMate logo if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {/* StudyMate Logo Thumbnail */}
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${course.thumbnail ? 'hidden' : ''}`}>
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
                    {/* StudyMate Logo */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        {/* Book Icon with Play Button */}
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <div className="relative">
                            {/* Book shape */}
                            <div className="w-12 h-10 bg-white rounded-sm relative">
                              <div className="absolute inset-1 border-l-2 border-blue-600"></div>
                              {/* Play button */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[6px] border-l-green-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* StudyMate Text */}
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold text-blue-600 mb-1">StudyMate</h3>
                      <p className="text-sm text-green-600 font-medium">Learning Made Simple</p>
                    </div>
                    
                    {/* Course Info Overlay */}
                    <div className="text-center">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-600 font-medium">
                        {data.subject.name}
                      </p>
                    </div>
                    
                    {/* Subject Icon Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        data.subject.code === 'MATH' 
                          ? 'bg-blue-100 text-blue-600' 
                          : data.subject.code === 'ENG'
                          ? 'bg-green-100 text-green-600'
                          : data.subject.code === 'SCI'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {data.subject.code === 'MATH' ? '🔢' : 
                         data.subject.code === 'ENG' ? '📚' : 
                         data.subject.code === 'SCI' ? '🔬' : '📖'}
                      </div>
                    </div>
                    
                    {/* Course level indicator */}
                    <div className="absolute bottom-4 right-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-700'
                          : course.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {course.difficulty === 'beginner' ? '🟢' : 
                         course.difficulty === 'intermediate' ? '🟡' : '🔴'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Course Number Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-semibold text-gray-700">Course {index + 1}</span>
                </div>
                
                {/* Premium Badge */}
                {course.is_premium && (
                  <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-200 rounded-lg px-2 py-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">Premium</span>
                    </div>
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="h-6 w-6 text-primary ml-1" />
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Course Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-2 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge 
                      className={`text-xs font-medium ${getDifficultyColor(course.difficulty)}`}
                    >
                      {getDifficultyIcon(course.difficulty)} {course.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {data.subject.code}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{course.lesson_count || 5} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration_hours || 2}h {Math.floor(Math.random() * 60)}m</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 500) + 100} students</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-bold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ready to start</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.slug}/preview`);
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-gray-200 hover:border-primary/30 hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Course bookmarked!');
                      }}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-gray-200 hover:border-green-300 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('Course details coming soon!');
                      }}
                    >
                      <BookOpen className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Available</h3>
            <p className="text-gray-600">
              No courses are available for {data.subject.name} in this bundle yet.
            </p>
          </div>
        )}

        {/* Enhanced Progress Overview & Study Tips */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Your Progress</h3>
                    <p className="text-primary/80 text-sm">in {data.subject.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">0%</div>
                  <div className="text-sm text-primary/80 font-medium">Complete</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/30 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-primary">{data.courses.length}</div>
                    <div className="text-xs text-primary/70">Courses</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-600">0</div>
                    <div className="text-xs text-primary/70">Completed</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-600">0</div>
                    <div className="text-xs text-primary/70">Hours</div>
                  </div>
                </div>
                
                <p className="text-primary/90 text-sm text-center">
                  Start your first course to begin tracking your progress!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Study Tips Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">Study Tips</h3>
                  <p className="text-green-700 text-sm">for {data.subject.name}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <p className="text-green-800 text-sm">Start with beginner courses to build a strong foundation</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">2</span>
                    </div>
                    <p className="text-green-800 text-sm">Practice regularly - consistency is key to mastering {data.subject.name}</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">3</span>
                    </div>
                    <p className="text-green-800 text-sm">Take notes and review them before starting new topics</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">4</span>
                    </div>
                    <p className="text-green-800 text-sm">Don't hesitate to revisit difficult concepts multiple times</p>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-green-900">Pro Tip:</span>
                  </div>
                  <p className="text-xs text-green-800 mt-1">
                    Set aside 30 minutes daily for {data.subject.name} to see consistent progress!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">
                  Ready to Master {data.subject.name}?
                </h3>
                <p className="text-purple-800 mb-6">
                  Join thousands of students who have successfully improved their {data.subject.name} skills. 
                  Start with any course above and work your way through our comprehensive curriculum.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    onClick={() => {
                      if (data.courses.length > 0) {
                        navigate(`/courses/${data.courses[0].slug}/preview`);
                      }
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start First Course
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}