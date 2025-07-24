import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VideoPlayer from '@/components/VideoPlayer';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
  ChevronRight,
  Download,
  Share2,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, type Course, type UserPurchase } from '@shared/api';
import { useAuth } from '@/hooks/useApi';

export default function CoursePreview() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userPurchases, setUserPurchases] = useState<UserPurchase[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!courseSlug) {
      setError('Course not found');
      setLoading(false);
      return;
    }

    fetchCourse();
    if (isAuthenticated) {
      fetchUserPurchases();
    }
  }, [courseSlug, isAuthenticated]);

  // Auto-load first video when component mounts
  useEffect(() => {
    if (videoRef && courseSlug) {
      const firstVideoUrl = getVideoUrl(courseSlug, 0);
      videoRef.src = firstVideoUrl;
      videoRef.load();
      
      // Add video event listeners
      const handleTimeUpdate = () => {
        if (videoRef) {
          setVideoProgress((videoRef.currentTime / videoRef.duration) * 100);
        }
      };
      
      const handleLoadedMetadata = () => {
        if (videoRef) {
          setVideoDuration(videoRef.duration);
        }
      };
      
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      
      videoRef.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.addEventListener('loadedmetadata', handleLoadedMetadata);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      
      return () => {
        if (videoRef) {
          videoRef.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, [videoRef, courseSlug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (!videoRef) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          e.stopPropagation();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation();
          if (videoRef.duration) {
            videoRef.currentTime = Math.max(0, videoRef.currentTime - 10);
            toast.info('⏪ Rewound 10 seconds');
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation();
          if (videoRef.duration) {
            videoRef.currentTime = Math.min(videoRef.duration, videoRef.currentTime + 10);
            toast.info('⏩ Fast forwarded 10 seconds');
          }
          break;
        case 'KeyF':
          e.preventDefault();
          e.stopPropagation();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          e.stopPropagation();
          videoRef.muted = !videoRef.muted;
          toast.info(videoRef.muted ? '🔇 Video muted' : '🔊 Video unmuted');
          break;
      }
    };

    // Add event listener with capture to ensure we get the events first
    document.addEventListener('keydown', handleKeyPress, true);
    return () => document.removeEventListener('keydown', handleKeyPress, true);
  }, [videoRef, isPlaying]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real course data from the backend
      try {
        const courseData = await apiClient.getCourseBySlug(courseSlug!);
        setCourse(courseData);
        return;
      } catch (apiError) {
        console.warn('Failed to fetch from API, using mock data:', apiError);
      }
      
      // Fallback to mock course data if API fails
      const mockCourse: Course = {
        id: 1,
        title: getCourseTitleFromSlug(courseSlug!),
        slug: courseSlug!,
        description: getCourseDescriptionFromSlug(courseSlug!),
        subject: {
          id: 1,
          name: getSubjectFromSlug(courseSlug!),
          code: getSubjectCodeFromSlug(courseSlug!),
          description: '',
          icon: '',
          color: '#3B82F6'
        },
        level: {
          id: 1,
          name: 'JHS 1',
          code: 'JHS1',
          description: '',
          order: 1,
          is_active: true
        },
        thumbnail: null,
        duration_hours: 2,
        difficulty: 'beginner',
        is_premium: false,
        is_published: true,
        lesson_count: 5,
        created_at: new Date().toISOString()
      };
      
      setCourse(mockCourse);
    } catch (err: any) {
      console.error('Failed to fetch course:', err);
      setError(err.message || 'Failed to load course');
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPurchases = async () => {
    try {
      const response = await apiClient.getUserPurchases();
      
      // Safely handle the response
      if (response && response.results && Array.isArray(response.results)) {
        setUserPurchases(response.results);
      } else {
        console.warn('Invalid response format from getUserPurchases:', response);
        setUserPurchases([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch user purchases:', err);
      setUserPurchases([]);
    }
  };

  // Check enrollment status when course data is loaded
  useEffect(() => {
    if (course && userPurchases.length > 0) {
      const isUserEnrolled = userPurchases.some((purchase: UserPurchase) => {
        const hasValidBundle = purchase.bundle && 
                              purchase.bundle.courses && 
                              Array.isArray(purchase.bundle.courses);
        
        if (!hasValidBundle) {
          return false;
        }
        
        return purchase.bundle.courses.some(bundleCourse => 
          bundleCourse.slug === course.slug
        );
      });
      
      setIsEnrolled(isUserEnrolled);
    }
  }, [course, userPurchases, isAuthenticated]);

  const getCourseTitleFromSlug = (slug: string): string => {
    const titleMap: { [key: string]: string } = {
      'fractions-decimals-and-percentages': 'Fractions, Decimals and Percentages',
      'english-sounds': 'English sounds',
      'features-of-a-non-literary-text': 'Features of a non-literary text',
      'vowel-sounds': 'Vowel sounds',
      'introduction-to-science-and-scientific-methods': 'Introduction to Science and Scientific Methods',
      'physical-and-chemical-changes': 'Physical and Chemical Changes',
      'states-of-matter-solid-liquid-gas': 'States of Matter (Solid, Liquid, Gas)',
      'number-operations': 'Number Operations',
      'number-and-numeration-systems': 'Number and Numeration Systems',
    };
    return titleMap[slug] || 'Course Preview';
  };

  const getCourseDescriptionFromSlug = (slug: string): string => {
    const descMap: { [key: string]: string } = {
      'fractions-decimals-and-percentages': 'Master the concepts of fractions, decimals, and percentages with practical applications and problem-solving techniques.',
      'english-sounds': 'Master the pronunciation and recognition of English sounds to improve your speaking and listening skills.',
      'features-of-a-non-literary-text': 'Learn to identify and analyze the key features of non-literary texts including reports, articles, and informational writing.',
      'vowel-sounds': 'Develop proper pronunciation of English vowel sounds through systematic practice and audio exercises.',
      'introduction-to-science-and-scientific-methods': 'Explore the fundamentals of scientific inquiry, observation, hypothesis formation, and the scientific method.',
      'physical-and-chemical-changes': 'Understand the difference between physical and chemical changes in matter with practical examples and experiments.',
      'states-of-matter-solid-liquid-gas': 'Learn about the three states of matter - solid, liquid, and gas - and how matter transitions between these states.',
      'number-operations': 'Develop proficiency in basic mathematical operations including addition, subtraction, multiplication, and division.',
      'number-and-numeration-systems': 'Understand different number systems, place value, and numeration concepts essential for mathematical literacy.',
    };
    return descMap[slug] || 'Comprehensive course content designed for effective learning.';
  };

  const getSubjectFromSlug = (slug: string): string => {
    if (slug.includes('english-sounds') || slug.includes('features-of-a-non-literary-text') || slug.includes('vowel-sounds')) {
      return 'English Language';
    } else if (slug.includes('introduction-to-science') || slug.includes('physical-and-chemical-changes') || slug.includes('states-of-matter')) {
      return 'Integrated Science';
    } else if (slug.includes('fractions-decimals-and-percentages') || slug.includes('number-operations') || slug.includes('number-and-numeration-systems')) {
      return 'Mathematics';
    }
    return 'General Studies';
  };

  const getSubjectCodeFromSlug = (slug: string): string => {
    if (slug.includes('fractions') || slug.includes('number')) {
      return 'MATH';
    } else if (slug.includes('english') || slug.includes('vowel')) {
      return 'ENG';
    } else if (slug.includes('science') || slug.includes('matter')) {
      return 'SCI';
    }
    return 'GEN';
  };

  // Get video URL based on course and lesson
  const getVideoUrl = (courseSlug: string, lessonIndex: number): string => {
    // Priority 1: Use lesson-specific video if available
    const lesson = lessons[lessonIndex];
    if (lesson) {
      // Use lesson's video file if available
      if (lesson.video_file) {
        return lesson.video_file;
      }
      
      // Use lesson's video URL if available
      if (lesson.video_url) {
        // Convert YouTube URL to embeddable format if needed
        if (lesson.video_url.includes('youtube.com/watch')) {
          const videoId = lesson.video_url.split('v=')[1]?.split('&')[0];
          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }
        }
        // Convert Vimeo URL to embeddable format if needed
        else if (lesson.video_url.includes('vimeo.com/')) {
          const videoId = lesson.video_url.split('vimeo.com/')[1]?.split('?')[0];
          if (videoId) {
            return `https://player.vimeo.com/video/${videoId}?dnt=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=0&transparent=0`;
          }
        }
        return lesson.video_url;
      }
    }

    // Priority 2: Use course preview video for first lesson if no lesson-specific video
    if (course && lessonIndex === 0) {
      // Use uploaded video file if available
      if (course.preview_video_file) {
        return course.preview_video_file;
      }
      
      // Use video URL if available
      if (course.preview_video_url) {
        // Convert YouTube URL to embeddable format if needed
        if (course.preview_video_url.includes('youtube.com/watch')) {
          const videoId = course.preview_video_url.split('v=')[1]?.split('&')[0];
          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }
        }
        // Convert Vimeo URL to embeddable format if needed
        else if (course.preview_video_url.includes('vimeo.com/')) {
          const videoId = course.preview_video_url.split('vimeo.com/')[1]?.split('?')[0];
          if (videoId) {
            return `https://player.vimeo.com/video/${videoId}?dnt=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=0&transparent=0`;
          }
        }
        return course.preview_video_url;
      }
    }

    // Fallback to sample educational videos
    const videoMap: { [key: string]: string[] } = {
      'fractions-decimals-and-percentages': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
      ]
    };

    const videos = videoMap[courseSlug] || videoMap['fractions-decimals-and-percentages'];
    return videos[lessonIndex] || videos[0];
  };

  // Get lessons from course data or use fallback
  const lessons = course?.lessons?.filter(lesson => lesson.is_published) || [
    { id: 1, title: 'Lesson 1: Introduction to Fractions', duration_minutes: 25, is_free: true, video_url: '', has_video: true },
    { id: 2, title: 'Lesson 2: Understanding Decimals', duration_minutes: 30, is_free: true, video_url: '', has_video: true },
    { id: 3, title: 'Lesson 3: Introduction to Percentages', duration_minutes: 28, is_free: true, video_url: '', has_video: true },
    { id: 4, title: 'Lesson 4: Converting Between Forms', duration_minutes: 35, is_free: false, video_url: '', has_video: true },
    { id: 5, title: 'Lesson 5: Operations with Fractions', duration_minutes: 40, is_free: false, video_url: '', has_video: true },
    { id: 6, title: 'Lesson 6: Decimal Operations', duration_minutes: 32, is_free: false, video_url: '', has_video: true },
    { id: 7, title: 'Lesson 7: Percentage Calculations', duration_minutes: 38, is_free: false, video_url: '', has_video: true },
    { id: 8, title: 'Lesson 8: Real-World Applications', duration_minutes: 45, is_free: false, video_url: '', has_video: true }
  ];

  // Format duration from minutes to MM:SS format
  const formatDuration = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
        setIsPlaying(false);
        toast.info('Video paused');
      } else {
        videoRef.play();
        setIsPlaying(true);
        toast.info('Video playing');
      }
    }
  };

  const handleLessonClick = (lessonIndex: number, isPreview: boolean) => {
    if (!isPreview) {
      toast.info('This lesson requires enrollment. Please purchase the course to access all content.');
      return;
    }
    
    setCurrentLesson(lessonIndex);
    setIsPlaying(false); // Reset playing state
    
    // Force re-render of video player by updating the key
    const newVideoUrl = getVideoUrl(courseSlug!, lessonIndex);
    
    // For YouTube/Vimeo videos, the iframe will handle the URL change automatically
    // For direct video files, update the video element
    if (videoRef && !newVideoUrl.includes('youtube.com') && !newVideoUrl.includes('vimeo.com')) {
      videoRef.src = newVideoUrl;
      videoRef.load();
      
      videoRef.addEventListener('canplay', () => {
        videoRef.play();
        setIsPlaying(true);
      }, { once: true });
    }
    
    toast.success(`Now playing: ${lessons[lessonIndex]?.title || 'Lesson'}`);
  };

  const toggleFullscreen = () => {
    if (!videoRef) return;
    
    if (!document.fullscreenElement) {
      videoRef.requestFullscreen().catch(err => {
        toast.error('Error attempting to enable fullscreen');
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleEnrollNow = () => {
    navigate('/bundles');
    toast.info('Redirecting to course bundles...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course preview...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested course could not be found.'}</p>
          <Button onClick={() => navigate('/dashboard')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{course.subject.name}</Badge>
                <Badge variant="outline">{course.level.name}</Badge>
                <Badge className="bg-green-100 text-green-800">Preview Available</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video Player */}
                {(() => {
                  let videoSrc = getVideoUrl(courseSlug!, currentLesson);
                  let videoTitle = `${lessons[currentLesson]?.title || 'Course Preview'} - Lesson ${currentLesson + 1} of ${lessons.length}`;
                  
                  // Check if it's a YouTube or Vimeo URL that needs iframe
                  const isEmbedVideo = videoSrc.includes('youtube.com/embed') || videoSrc.includes('player.vimeo.com');
                  
                  if (isEmbedVideo) {
                    return (
                      <div className="relative bg-black rounded-t-lg aspect-video">
                        <iframe
                          key={videoSrc}
                          className="w-full h-full rounded-t-lg"
                          src={videoSrc}
                          frameBorder="0"
                          allow="autoplay; picture-in-picture; encrypted-media"
                          allowFullScreen={true}
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          title={videoTitle}
                        />
                        
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                          <h3 className="font-semibold text-sm">{videoTitle}</h3>
                          <p className="text-xs text-gray-300">Lesson {currentLesson + 1} of {lessons.length}</p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <VideoPlayer
                        key={videoSrc}
                        src={videoSrc}
                        title={videoTitle}
                        className="rounded-t-lg"
                        onPlay={() => {
                          setIsPlaying(true);
                          toast.info('Video playing');
                        }}
                        onPause={() => {
                          setIsPlaying(false);
                          toast.info('Video paused');
                        }}
                        onError={(error) => {
                          toast.error(`Video error: ${error}`);
                          console.error('Video error:', error);
                        }}
                      />
                    );
                  }
                })()}
                
                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration_hours}h total</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>1,234 students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>4.8 (156 reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    {isAuthenticated && isEnrolled ? (
                      <Badge className="bg-green-100 text-green-800 px-4 py-2">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enrolled
                      </Badge>
                    ) : (
                      <Button onClick={handleEnrollNow} className="bg-blue-600 hover:bg-blue-700">
                        Enroll Now
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-gray-700">{course.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What You'll Learn</h4>
                    {course.learning_objectives && course.learning_objectives.length > 0 ? (
                      <ul className="space-y-2">
                        {course.learning_objectives.map((objective, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">Master fundamental concepts and principles</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">Apply knowledge through practical exercises</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">Build confidence for exams and assessments</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">Develop problem-solving skills</span>
                        </li>
                      </ul>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prerequisites</h4>
                    <p className="text-gray-700">
                      {course.prerequisites || `Basic understanding of ${course.subject.name} concepts. No prior advanced knowledge required.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment CTA */}
            {isAuthenticated && isEnrolled ? (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-900 mb-2">You're Enrolled!</h3>
                  <p className="text-green-800 text-sm mb-4">
                    You have full access to all lessons, exercises, and resources.
                  </p>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Go to Dashboard
                  </Button>
                  <p className="text-xs text-green-700 mt-2">Continue your learning journey</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-900 mb-2">Ready to Start Learning?</h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Get full access to all lessons, exercises, and resources.
                  </p>
                  <Button 
                    onClick={handleEnrollNow}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Enroll in Course Bundle
                  </Button>
                  <p className="text-xs text-blue-700 mt-2">30-day money-back guarantee</p>
                </CardContent>
              </Card>
            )}

            {/* Course Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Lessons</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                        currentLesson === index
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      } ${!lesson.is_free && !isEnrolled ? 'opacity-60' : ''}`}
                      onClick={() => handleLessonClick(index, lesson.is_free || isEnrolled)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          currentLesson === index
                            ? 'bg-blue-600 text-white'
                            : lesson.is_free || isEnrolled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lesson.is_free || isEnrolled ? (
                            currentLesson === index ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              index + 1
                            )
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(lesson.duration_minutes)}</span>
                            {lesson.is_free && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                Free
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                        currentLesson === index ? 'rotate-90' : ''
                      }`} />
                    </div>
                  ))}
                </div>
                
                {!isEnrolled && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-800">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Premium Content</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      {lessons.filter(l => !l.is_free).length} lessons require enrollment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Play/Pause:</span>
                    <Badge variant="outline" className="text-xs">Space</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rewind 10s:</span>
                    <Badge variant="outline" className="text-xs">← Left</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forward 10s:</span>
                    <Badge variant="outline" className="text-xs">→ Right</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fullscreen:</span>
                    <Badge variant="outline" className="text-xs">F</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mute/Unmute:</span>
                    <Badge variant="outline" className="text-xs">M</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <Badge variant="secondary">{course.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.duration_hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-medium">{lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificate:</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}