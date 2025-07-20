import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  Clock,
  Award,
  Lock,
  ArrowLeft,
  Download,
} from "lucide-react";

export default function CourseOverview() {
  const { level, subject } = useParams();

  const courseData = {
    title: "JHS 2 Mathematics",
    description:
      "Comprehensive mathematics course covering algebra, geometry, statistics, and problem-solving techniques aligned with the GES curriculum.",
    totalLessons: 24,
    completedLessons: 18,
    estimatedTime: "12 hours",
    difficulty: "Intermediate",
    instructor: "Mr. Kwame Asante",
    progress: 75,
  };

  const modules = [
    {
      id: 1,
      title: "Number Operations and Fractions",
      lessons: [
        {
          id: 1,
          title: "Introduction to Integers",
          duration: "15 min",
          type: "video",
          completed: true,
        },
        {
          id: 2,
          title: "Operations with Fractions",
          duration: "20 min",
          type: "video",
          completed: true,
        },
        {
          id: 3,
          title: "Practice Quiz: Fractions",
          duration: "10 min",
          type: "quiz",
          completed: true,
        },
      ],
      progress: 100,
    },
    {
      id: 2,
      title: "Algebraic Expressions",
      lessons: [
        {
          id: 4,
          title: "Introduction to Algebra",
          duration: "18 min",
          type: "video",
          completed: true,
        },
        {
          id: 5,
          title: "Simplifying Expressions",
          duration: "22 min",
          type: "video",
          completed: true,
        },
        {
          id: 6,
          title: "Solving Linear Equations",
          duration: "25 min",
          type: "video",
          completed: false,
          current: true,
        },
        {
          id: 7,
          title: "Practice Problems",
          duration: "15 min",
          type: "exercise",
          completed: false,
        },
        {
          id: 8,
          title: "Module Assessment",
          duration: "20 min",
          type: "quiz",
          completed: false,
        },
      ],
      progress: 40,
    },
    {
      id: 3,
      title: "Geometry Fundamentals",
      lessons: [
        {
          id: 9,
          title: "Angles and Triangles",
          duration: "20 min",
          type: "video",
          completed: false,
        },
        {
          id: 10,
          title: "Area and Perimeter",
          duration: "18 min",
          type: "video",
          completed: false,
        },
        {
          id: 11,
          title: "Circle Properties",
          duration: "16 min",
          type: "video",
          completed: false,
        },
        {
          id: 12,
          title: "Geometry Quiz",
          duration: "15 min",
          type: "quiz",
          completed: false,
        },
      ],
      progress: 0,
    },
    {
      id: 4,
      title: "Statistics and Data",
      lessons: [
        {
          id: 13,
          title: "Data Collection",
          duration: "14 min",
          type: "video",
          completed: false,
        },
        {
          id: 14,
          title: "Mean, Median, Mode",
          duration: "20 min",
          type: "video",
          completed: false,
        },
        {
          id: 15,
          title: "Charts and Graphs",
          duration: "22 min",
          type: "video",
          completed: false,
        },
        {
          id: 16,
          title: "Final Assessment",
          duration: "30 min",
          type: "quiz",
          completed: false,
        },
      ],
      progress: 0,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return PlayCircle;
      case "quiz":
        return Award;
      case "exercise":
        return BookOpen;
      default:
        return PlayCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-gold";
      case "quiz":
        return "text-emerald";
      case "exercise":
        return "text-earth";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 mb-8 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-200/50 shadow-sm">
            <Link
              to="/dashboard"
              className="hover:text-gold transition-colors duration-200"
            >
              Dashboard
            </Link>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <Link
              to="/dashboard"
              className="hover:text-gold transition-colors duration-200"
            >
              My Courses
            </Link>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-gray-900 font-semibold">
              {courseData.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald/5"></div>
                <div className="relative space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold to-emerald rounded-2xl flex items-center justify-center shadow-lg">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            {courseData.title}
                          </h1>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm font-medium text-gold bg-gold/10 px-3 py-1 rounded-full">
                              {courseData.difficulty}
                            </span>
                            <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1 rounded-full">
                              {courseData.instructor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                        {courseData.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-professional border-2 border-gray-200 hover:border-gold hover:text-gold"
                      asChild
                    >
                      <Link to="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl border border-gold/20 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-6 w-6 text-gold" />
                      </div>
                      <div className="text-3xl font-bold text-gold mb-1">
                        {courseData.totalLessons}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Total Lessons
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-emerald/10 to-emerald/5 rounded-2xl border border-emerald/20 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-12 h-12 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-6 w-6 text-emerald" />
                      </div>
                      <div className="text-3xl font-bold text-emerald mb-1">
                        {courseData.estimatedTime}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Study Time
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-2xl border border-blue-600/20 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {courseData.progress}%
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Progress
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/20 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Award className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">
                        {courseData.completedLessons}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        Overall Progress
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        {courseData.progress}%
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-4 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-4 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden"
                        style={{ width: `${courseData.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      {courseData.completedLessons} of {courseData.totalLessons}{" "}
                      lessons completed
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Modules */}
              <div className="space-y-8">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {module.id}
                            </span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                              Module {module.id}: {module.title}
                            </h2>
                            <p className="text-gray-600 font-medium mt-1">
                              {module.lessons.length} lessons •{" "}
                              {module.progress}% completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 rounded-xl p-4 border border-blue-600/20">
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                              {module.progress}%
                            </span>
                            <div className="text-sm text-gray-600 font-medium">
                              Complete
                            </div>
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        {module.lessons.map((lesson) => {
                          const Icon = getIcon(lesson.type);
                          const isLocked = !lesson.completed && !lesson.current;
                          const canAccess = lesson.completed || lesson.current;

                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${lesson.current ? "border-blue-500 bg-blue-500/5" : lesson.completed ? "border-blue-600 bg-blue-600/5" : "border-gray-200 hover:border-gray-300"}`}
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.completed ? "bg-blue-600 text-white" : lesson.current ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                                >
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : isLocked ? (
                                    <Lock className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Icon
                                      className={`h-5 w-5 ${getTypeColor(lesson.type)}`}
                                    />
                                  )}
                                </div>
                                <div>
                                  <h3
                                    className={`font-medium ${canAccess ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    {lesson.title}
                                    {lesson.current && (
                                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                        Current
                                      </span>
                                    )}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{lesson.duration}</span>
                                    </div>
                                    <span className="capitalize">
                                      {lesson.type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {canAccess ? (
                                  <Button
                                    size="sm"
                                    className={
                                      lesson.current
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : lesson.completed
                                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                                          : ""
                                    }
                                    asChild
                                  >
                                    <Link
                                      to={`/lesson/${lesson.id}`}
                                      className="flex items-center space-x-1"
                                    >
                                      {lesson.completed ? (
                                        <>
                                          <span>Review</span>
                                        </>
                                      ) : (
                                        <>
                                          <PlayCircle className="h-4 w-4" />
                                          <span>Start</span>
                                        </>
                                      )}
                                    </Link>
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="opacity-50"
                                  >
                                    <Lock className="h-4 w-4 mr-1" />
                                    Locked
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold to-emerald rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Course Details
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gold/5 to-transparent rounded-2xl p-4 border border-gold/20">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Instructor
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {courseData.instructor}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald/5 to-transparent rounded-2xl p-4 border border-emerald/20">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Learning Progress
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {courseData.completedLessons} of {courseData.totalLessons}{" "}
                      lessons
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-emerald to-green-400 h-2 rounded-full"
                        style={{
                          width: `${(courseData.completedLessons / courseData.totalLessons) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-earth/5 to-transparent rounded-2xl p-4 border border-earth/20">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Difficulty Level
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {courseData.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald to-green-500 rounded-xl flex items-center justify-center">
                    <PlayCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-4">
                  <Button
                    className="btn-professional w-full bg-gradient-to-r from-gold to-emerald hover:from-gold/90 hover:to-emerald/90 text-white shadow-lg py-4 text-lg"
                    asChild
                  >
                    <Link to="/lesson/6">
                      <PlayCircle className="mr-3 h-5 w-5" />
                      Continue Learning
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="btn-professional w-full border-2 border-gray-200 hover:border-emerald hover:text-emerald py-4 text-lg"
                    asChild
                  >
                    <Link to="/quiz">
                      <Award className="mr-3 h-5 w-5" />
                      Take Assessment
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="btn-professional w-full border-2 border-gray-200 hover:border-earth hover:text-earth py-4 text-lg"
                  >
                    <Download className="mr-3 h-5 w-5" />
                    Download Materials
                  </Button>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Progress
                </h3>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Module {module.id}
                        </span>
                        <span className="font-medium">{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald h-2 rounded-full"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
