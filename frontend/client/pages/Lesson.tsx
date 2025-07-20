import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  CheckCircle,
  ArrowLeft,
  Clock,
  FileText,
} from "lucide-react";

export default function Lesson() {
  const { lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(900); // 15 minutes in seconds

  const lessonData = {
    id: 6,
    title: "Solving Linear Equations",
    module: "Algebraic Expressions",
    course: "JHS 2 Mathematics",
    duration: "25 min",
    description:
      "Learn how to solve linear equations step by step using various methods including addition, subtraction, multiplication, and division.",
    objectives: [
      "Understand what a linear equation is",
      "Learn the steps to solve simple linear equations",
      "Practice solving equations with variables on both sides",
      "Apply linear equations to real-world problems",
    ],
    videoUrl: "/api/placeholder-video.mp4",
    transcript:
      "Welcome to this lesson on solving linear equations. A linear equation is an equation where the highest power of the variable is 1...",
    resources: [
      {
        name: "Linear Equations Worksheet",
        type: "PDF",
        size: "2.3 MB",
        url: "/resources/linear-equations-worksheet.pdf",
      },
      {
        name: "Practice Problems",
        type: "PDF",
        size: "1.8 MB",
        url: "/resources/practice-problems.pdf",
      },
      {
        name: "Formula Reference Sheet",
        type: "PDF",
        size: "0.9 MB",
        url: "/resources/formula-reference.pdf",
      },
    ],
    nextLesson: {
      id: 7,
      title: "Practice Problems",
      module: "Algebraic Expressions",
    },
    prevLesson: {
      id: 5,
      title: "Simplifying Expressions",
      module: "Algebraic Expressions",
    },
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/dashboard" className="hover:text-gold">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/course/jhs2/mathematics" className="hover:text-gold">
              {lessonData.course}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{lessonData.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <VideoPlayer
                src={lessonData.videoUrl}
                title={lessonData.title}
                className="rounded-2xl shadow-md overflow-hidden"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(error) => console.error('Video error:', error)}
              />

              {/* Lesson Content */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span>{lessonData.module}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{lessonData.duration}</span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {lessonData.title}
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                      {lessonData.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Learning Objectives
                    </h2>
                    <div className="space-y-2">
                      {lessonData.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-emerald mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Lesson Content
                    </h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        In this lesson, we'll explore the fundamental concepts
                        of linear equations and learn systematic approaches to
                        solving them. Linear equations are one of the most
                        important building blocks in algebra and mathematics as
                        a whole.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        We'll start with simple one-step equations and gradually
                        work our way up to more complex multi-step equations
                        that require combining like terms and using the
                        distributive property.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Key Formulas
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="font-mono text-lg">ax + b = c</div>
                        <div className="text-sm text-gray-600">
                          Standard form of a linear equation
                        </div>
                        <div className="font-mono text-lg">x = (c - b) / a</div>
                        <div className="text-sm text-gray-600">
                          Solution when a ≠ 0
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div>
                  {lessonData.prevLesson && (
                    <Button variant="outline" asChild>
                      <Link to={`/lesson/${lessonData.prevLesson.id}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous: {lessonData.prevLesson.title}
                      </Link>
                    </Button>
                  )}
                </div>
                <div>
                  {lessonData.nextLesson && (
                    <Button
                      className="bg-gold hover:bg-gold/90 text-white"
                      asChild
                    >
                      <Link to={`/lesson/${lessonData.nextLesson.id}`}>
                        Next: {lessonData.nextLesson.title}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Navigation */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Course
                  </h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/course/jhs2/mathematics">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Course
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {lessonData.course}
                  </div>
                  <div className="font-medium text-gray-900">
                    {lessonData.module}
                  </div>
                </div>
              </div>

              {/* Downloads */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resources & Downloads
                </h3>
                <div className="space-y-3">
                  {lessonData.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-gold/10 w-8 h-8 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-gold" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {resource.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {resource.type} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lesson Notes */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Take Notes
                </h3>
                <textarea
                  className="w-full h-32 p-3 border rounded-lg resize-none text-sm"
                  placeholder="Write your notes about this lesson..."
                ></textarea>
                <Button size="sm" className="w-full mt-3">
                  Save Notes
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Transcript
                  </Button>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </Button>
                  <Button className="w-full" variant="outline">
                    Report Issue
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
