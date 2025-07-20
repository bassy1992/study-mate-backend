import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Award,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function Progress() {
  const overallStats = {
    totalLessons: 72,
    completedLessons: 47,
    totalQuizzes: 24,
    passedQuizzes: 18,
    studyHours: 32,
    averageScore: 78,
    streakDays: 15,
    rank: 12,
  };

  const subjectProgress = [
    {
      name: "English Language",
      progress: 75,
      lessonsCompleted: 18,
      totalLessons: 24,
      averageScore: 82,
      recentQuizScore: 85,
      trend: "up",
      color: "text-gold",
      bgColor: "bg-gold",
      lightBg: "bg-gold/10",
    },
    {
      name: "Mathematics",
      progress: 60,
      lessonsCompleted: 15,
      totalLessons: 25,
      averageScore: 74,
      recentQuizScore: 70,
      trend: "down",
      color: "text-emerald",
      bgColor: "bg-emerald",
      lightBg: "bg-emerald/10",
    },
    {
      name: "Integrated Science",
      progress: 45,
      lessonsCompleted: 14,
      totalLessons: 23,
      averageScore: 78,
      recentQuizScore: 90,
      trend: "up",
      color: "text-earth",
      bgColor: "bg-earth",
      lightBg: "bg-earth/10",
    },
  ];

  const weeklyActivity = [
    { day: "Mon", lessons: 3, quizzes: 1, hours: 2.5 },
    { day: "Tue", lessons: 2, quizzes: 0, hours: 1.8 },
    { day: "Wed", lessons: 4, quizzes: 2, hours: 3.2 },
    { day: "Thu", lessons: 1, quizzes: 1, hours: 1.5 },
    { day: "Fri", lessons: 3, quizzes: 0, hours: 2.1 },
    { day: "Sat", lessons: 5, quizzes: 2, hours: 4.0 },
    { day: "Sun", lessons: 2, quizzes: 1, hours: 2.2 },
  ];

  const recentAchievements = [
    {
      title: "Quiz Master",
      description: "Scored 90% or higher on 3 consecutive quizzes",
      date: "2024-01-20",
      icon: Award,
      color: "text-gold",
    },
    {
      title: "Consistent Learner",
      description: "15-day study streak",
      date: "2024-01-19",
      icon: Target,
      color: "text-emerald",
    },
    {
      title: "Science Star",
      description: "Completed all Science Module 1 lessons",
      date: "2024-01-17",
      icon: BookOpen,
      color: "text-earth",
    },
  ];

  const monthlyGoals = [
    {
      title: "Complete 60 lessons",
      progress: 78,
      current: 47,
      target: 60,
    },
    {
      title: "Pass 20 quizzes",
      progress: 90,
      current: 18,
      target: 20,
    },
    {
      title: "Study 40 hours",
      progress: 80,
      current: 32,
      target: 40,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-gold to-emerald rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Your Learning Progress</h1>
                <p className="text-lg opacity-90">
                  Track your journey and celebrate your achievements
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">#{overallStats.rank}</div>
                  <div className="text-sm opacity-90">Class Rank</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-gold" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {overallStats.completedLessons}
              </div>
              <div className="text-sm text-gray-600">
                of {overallStats.totalLessons} lessons
              </div>
              <div className="text-xs text-emerald font-medium mt-1">
                {Math.round(
                  (overallStats.completedLessons / overallStats.totalLessons) *
                    100,
                )}
                % complete
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="bg-emerald/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-emerald" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {overallStats.passedQuizzes}
              </div>
              <div className="text-sm text-gray-600">
                of {overallStats.totalQuizzes} quizzes
              </div>
              <div className="text-xs text-emerald font-medium mt-1">
                {Math.round(
                  (overallStats.passedQuizzes / overallStats.totalQuizzes) *
                    100,
                )}
                % passed
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="bg-earth/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-earth" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {overallStats.studyHours}h
              </div>
              <div className="text-sm text-gray-600">study time</div>
              <div className="text-xs text-emerald font-medium mt-1">
                This month
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-gold" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {overallStats.averageScore}%
              </div>
              <div className="text-sm text-gray-600">average score</div>
              <div className="text-xs text-emerald font-medium mt-1">
                All subjects
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Subject Breakdown */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Subject Progress
                </h2>
                <div className="space-y-6">
                  {subjectProgress.map((subject, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${subject.lightBg} flex items-center justify-center`}
                          >
                            <BookOpen className={`h-5 w-5 ${subject.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {subject.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {subject.lessonsCompleted} of{" "}
                              {subject.totalLessons} lessons
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              {subject.progress}%
                            </span>
                            {subject.trend === "up" ? (
                              <ArrowUp className="h-4 w-4 text-emerald" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Avg: {subject.averageScore}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${subject.bgColor} h-3 rounded-full transition-all duration-300`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Recent quiz: {subject.recentQuizScore}%</span>
                          <span>
                            {subject.totalLessons - subject.lessonsCompleted}{" "}
                            lessons remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Weekly Activity
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4" />
                    <span>This Week</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4">
                  {weeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-600 mb-2">
                        {day.day}
                      </div>
                      <div className="space-y-1">
                        <div
                          className="bg-gold rounded w-full"
                          style={{
                            height: `${Math.max(day.lessons * 8, 4)}px`,
                          }}
                          title={`${day.lessons} lessons`}
                        ></div>
                        <div
                          className="bg-emerald rounded w-full"
                          style={{
                            height: `${Math.max(day.quizzes * 12, 4)}px`,
                          }}
                          title={`${day.quizzes} quizzes`}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {day.hours}h
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gold rounded"></div>
                    <span>Lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald rounded"></div>
                    <span>Quizzes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Monthly Goals */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="h-5 w-5 text-gold" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monthly Goals
                  </h3>
                </div>
                <div className="space-y-4">
                  {monthlyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{goal.title}</span>
                        <span className="font-medium">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gold h-2 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {goal.progress}% complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="h-5 w-5 text-emerald" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Achievements
                  </h3>
                </div>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}
                      >
                        <achievement.icon
                          className={`h-4 w-4 ${achievement.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{achievement.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Streak */}
              <div className="bg-gradient-to-br from-gold/10 to-emerald/10 rounded-2xl p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {overallStats.streakDays}
                    </div>
                    <div className="text-sm text-gray-600">
                      Day Study Streak
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Keep it up! You're doing great 🔥
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link to="/dashboard">Back to Dashboard</Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/quiz">Take Practice Quiz</Link>
                  </Button>
                  <Button className="w-full" variant="outline">
                    Download Report
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
