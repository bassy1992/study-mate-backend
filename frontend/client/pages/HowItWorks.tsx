import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  UserPlus,
  CreditCard,
  BookOpen,
  TrendingUp,
  Award,
  PlayCircle,
  FileText,
  Smartphone,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description:
        "Create your free account with just your name, email, and password. It takes less than 2 minutes!",
      icon: UserPlus,
      details: [
        "Quick registration process",
        "Email verification",
        "Secure account setup",
      ],
    },
    {
      step: 2,
      title: "Choose Bundle",
      description:
        "Select your JHS level (1, 2, or 3) and pay just $15 for full access to English, Math, and Science.",
      icon: CreditCard,
      details: [
        "JHS 1, 2, or 3 options",
        "Mobile Money accepted",
        "Instant access after payment",
      ],
    },
    {
      step: 3,
      title: "Learn",
      description:
        "Access video lessons, interactive content, and practice exercises designed for mobile learning.",
      icon: BookOpen,
      details: [
        "HD video lessons",
        "Interactive quizzes",
        "Downloadable resources",
      ],
    },
    {
      step: 4,
      title: "Track Progress",
      description:
        "Monitor your learning with detailed progress reports and performance analytics.",
      icon: TrendingUp,
      details: [
        "Visual progress bars",
        "Quiz score tracking",
        "Performance insights",
      ],
    },
    {
      step: 5,
      title: "Earn Certificate",
      description:
        "Complete your course and receive a certificate of completion to showcase your achievement.",
      icon: Award,
      details: [
        "Digital certificates",
        "Shareable achievements",
        "Portfolio building",
      ],
    },
  ];

  const features = [
    {
      icon: PlayCircle,
      title: "Video Lessons",
      description:
        "High-quality video content taught by experienced Ghanaian teachers",
    },
    {
      icon: FileText,
      title: "Interactive Quizzes",
      description:
        "Practice questions and assessments that provide instant feedback",
    },
    {
      icon: BookOpen,
      title: "Bundled Subjects",
      description:
        "Complete coverage of English, Math, and Science in one package",
    },
    {
      icon: Smartphone,
      title: "Mobile-Friendly",
      description: "Learn anywhere, anytime on your smartphone or tablet",
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Connect with other JHS students across Ghana",
    },
    {
      icon: Clock,
      title: "Self-Paced Learning",
      description: "Study at your own pace with 24/7 access to all content",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Get started with GhanaLearn in 5 simple steps and transform your JHS
            learning experience.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                <div
                  className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div
                        key={detailIndex}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
                >
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 text-center">
                    <step.icon className="h-24 w-24 text-primary mx-auto mb-4" />
                    <div className="text-lg font-semibold text-gray-900">
                      Step {step.step}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for successful JHS learning, designed
              specifically for Ghanaian students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Learning Journey
            </h2>
            <p className="text-lg text-gray-600">
              From enrollment to mastery, here's what your experience looks like
              on GhanaLearn.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  📚 Study Materials
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Video lessons by certified teachers</li>
                  <li>• Interactive practice exercises</li>
                  <li>• Downloadable study guides</li>
                  <li>• Past exam questions and solutions</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  📱 Mobile Learning
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Works on any smartphone or tablet</li>
                  <li>• Offline content downloads</li>
                  <li>• Progress syncing across devices</li>
                  <li>• Data-friendly video streaming</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  🎯 Assessment & Feedback
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Regular quizzes and tests</li>
                  <li>• Instant feedback on answers</li>
                  <li>• Performance analytics</li>
                  <li>• Areas for improvement insights</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  🏆 Recognition
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Completion certificates</li>
                  <li>• Achievement badges</li>
                  <li>• Progress milestones</li>
                  <li>• Leaderboard participation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-white/90">
            Join thousands of Ghanaian JHS students who are already improving
            their grades with GhanaLearn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3 h-auto"
              asChild
            >
              <Link to="/signup">Get Started Now</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3 h-auto"
              asChild
            >
              <Link to="/bundles">View Course Bundles</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
