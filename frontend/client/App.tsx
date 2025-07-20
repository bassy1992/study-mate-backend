import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Bundles from "./pages/Bundles";
import BundleDetail from "./pages/BundleDetail";
import BundleSubjects from "./pages/BundleSubjects";
import SubjectCourses from "./pages/SubjectCourses";
import CoursePreview from "./pages/CoursePreview";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import PaymentMethod from "./pages/PaymentMethod";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import CourseOverview from "./pages/CourseOverview";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import QuizTaking from "./pages/QuizTaking";
import Progress from "./pages/Progress";
import BECEPreparation from "./pages/BECEPreparation";
import BECEDashboard from "./pages/BECEDashboard";
import BECESubjectSelection from "./pages/BECESubjectSelection";
import BECEPracticeMath from "./pages/BECEPracticeMath";
import BECEPracticeScience from "./pages/BECEPracticeScience";
import BECEPracticeEnglish from "./pages/BECEPracticeEnglish";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { ApiTest } from "./components/ApiTest";
import { RegistrationTest } from "./components/RegistrationTest";
import { AuthDebug } from "./components/AuthDebug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bundles" element={<Bundles />} />
          <Route path="/bundles/:slug" element={<BundleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/bundles/:bundleId/subjects" element={<BundleSubjects />} />
          <Route path="/dashboard/bundles/:bundleId/subjects/:subjectId/courses" element={<SubjectCourses />} />
          <Route path="/courses/:courseSlug/preview" element={<CoursePreview />} />
          <Route path="/course/:level/:subject" element={<CourseOverview />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:slug" element={<QuizTaking />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/bece-preparation" element={<BECEPreparation />} />
          <Route path="/bece-dashboard" element={<BECEDashboard />} />
          <Route path="/bece-subject-selection" element={<BECESubjectSelection />} />
          <Route
            path="/bece-practice/mathematics"
            element={<BECEPracticeMath />}
          />
          <Route
            path="/bece-practice/integrated_science"
            element={<BECEPracticeScience />}
          />
          <Route
            path="/bece-practice/english_language"
            element={<BECEPracticeEnglish />}
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/registration-test" element={<RegistrationTest />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
