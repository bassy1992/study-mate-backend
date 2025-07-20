import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiClient, BECEPaper, BECEPaperList, BECEYear } from "../../shared/api";
import BECEResultsModal from "@/components/BECEResultsModal";
import {
  Star,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Microscope,
  Loader2,
} from "lucide-react";

export default function BECEPracticeScience() {
  const navigate = useNavigate();
  const [availableYears, setAvailableYears] = useState<BECEYear[]>([]);
  const [availablePapers, setAvailablePapers] = useState<BECEPaperList[]>([]);
  const [currentPaper, setCurrentPaper] = useState<BECEPaper | null>(null);
  const [currentYear, setCurrentYear] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        console.log('Loading BECE Science practice data...');
        
        // First try to load years (this should work for everyone)
        console.log('Loading years...');
        const years = await apiClient.getBECEYears();
        console.log('Years loaded:', years ? years.length : 'undefined');
        console.log('Years data:', years);
        
        if (years && Array.isArray(years)) {
          setAvailableYears(years);
        } else {
          console.error('Years data is not an array:', years);
          setAvailableYears([]);
        }
        
        // Then try to load papers (this requires premium access)
        console.log('Loading papers for integrated_science...');
        try {
          const papers = await apiClient.getBECEPracticeBySubject('integrated_science');
          console.log('Papers loaded:', papers ? papers.length : 'undefined');
          console.log('Papers data:', papers);
          
          if (papers && Array.isArray(papers)) {
            setAvailablePapers(papers);
            
            // Set default year to the most recent paper's year
            if (papers.length > 0) {
              const defaultYear = papers[0].year.year.toString();
              console.log('Setting default year from papers:', defaultYear);
              setCurrentYear(defaultYear);
            }
          } else {
            console.error('Papers data is not an array:', papers);
            setAvailablePapers([]);
          }
        } catch (paperErr) {
          // If papers fail to load, it's likely a premium access issue
          console.error('Papers failed to load:', paperErr);
          setError(paperErr instanceof Error ? paperErr.message : 'Premium subscription required');
        }
        
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load practice data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load paper when year changes
  useEffect(() => {
    const loadPaper = async () => {
      console.log('Loading paper for year:', currentYear, 'Available papers:', availablePapers.length);
      
      if (!currentYear || availablePapers.length === 0) {
        console.log('No year selected or no papers available');
        return;
      }
      
      try {
        // Find paper for the selected year
        const yearPaper = availablePapers.find(
          paper => paper.year.year.toString() === currentYear
        );
        
        console.log('Found paper for year:', yearPaper ? yearPaper.title : 'None');
        
        if (yearPaper) {
          console.log('Loading paper with questions:', yearPaper.id);
          const paperWithQuestions = await apiClient.getBECEPaper(yearPaper.id);
          console.log('Paper loaded with questions:', paperWithQuestions.questions.length);
          setCurrentPaper(paperWithQuestions);
          setTimeLeft(1800); // 30 minutes
          
          // Start practice session
          console.log('Starting practice session...');
          const practiceSession = await apiClient.startBECEPractice(yearPaper.id);
          console.log('Practice session started:', practiceSession.attempt_id);
          setAttemptId(practiceSession.attempt_id);
        } else {
          console.log('No paper found for year:', currentYear);
        }
      } catch (err) {
        console.error('Failed to load paper:', err);
        setError(err instanceof Error ? err.message : 'Failed to load paper');
      }
    };

    loadPaper();
  }, [currentYear, availablePapers]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && currentPaper && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, currentPaper, showResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async () => {
    if (!currentPaper || !attemptId) return;

    try {
      setSubmitting(true);

      // Prepare answers for submission
      const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        question_id: questionId,
        answer_id: answerId.toString(),
      }));

      const result = await apiClient.submitBECEPractice({
        paper_id: currentPaper.id,
        answers,
      });

      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit practice');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScore = () => {
    if (!currentPaper) return 0;

    let correct = 0;
    currentPaper.questions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.answers.find(a => a.is_correct);
      if (selectedAnswerId === correctAnswer?.id) {
        correct++;
      }
    });
    return Math.round((correct / currentPaper.questions.length) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading practice questions...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    const isPremiumError = error.includes('Premium subscription required');

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className={`border rounded-lg p-8 max-w-md ${isPremiumError
              ? 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-200'
              }`}>
              {isPremiumError ? (
                <>
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Premium Access Required</h3>
                  <p className="text-blue-600 mb-6">
                    Unlock BECE practice questions and get access to comprehensive past papers, detailed solutions, and performance tracking.
                  </p>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      asChild
                    >
                      <Link to="/checkout?bundle=JHS3&redirect=/bece-subject-selection">
                        <Award className="mr-2 h-4 w-4" />
                        Get BECE Bundle - $15
                      </Link>
                    </Button>
                    <Button
                      onClick={() => navigate('/bece-preparation')}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Back to BECE Preparation
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={() => navigate('/bece-preparation')}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Back to BECE Preparation
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No paper loaded (only show this if there's no error - errors are handled above)
  if (!currentPaper && !error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No practice paper available for the selected year.</p>
            <Button onClick={() => navigate('/bece-preparation')} variant="outline">
              Back to BECE Preparation
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQ = currentPaper.questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    BECE Integrated Science Practice
                  </h1>
                  <p className="text-gray-600">
                    Practice with past questions from {currentYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Clock className="h-5 w-5" />
                    <span className="font-mono text-lg">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Time Remaining</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/bece-preparation">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Year Selection */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Year
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableYears.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => setCurrentYear(year.year.toString())}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${currentYear === year.year.toString()
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                        }`}
                    >
                      {year.year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Navigator */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Questions
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {currentPaper.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${index === currentQuestion
                        ? "border-blue-600 bg-blue-600 text-white"
                        : selectedAnswers[currentPaper.questions[index].id]
                          ? "border-blue-400 bg-blue-400 text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span>Answered</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Answered</span>
                      <span className="font-medium">
                        {Object.keys(selectedAnswers).length}/
                        {currentPaper.questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(Object.keys(selectedAnswers).length / currentPaper.questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border p-8">
                <div className="space-y-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600/10 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Microscope className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Question {currentQuestion + 1} of{" "}
                          {currentPaper.questions.length}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {currentQ.topic} • {currentPaper.year.year} BECE
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">
                        {currentQ.question_text}
                      </h3>

                      <RadioGroup
                        value={selectedAnswers[currentQ.id]?.toString() || ""}
                        onValueChange={(value) =>
                          handleAnswerSelect(currentQ.id, parseInt(value))
                        }
                      >
                        <div className="space-y-3">
                          {currentQ.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-white cursor-pointer transition-colors"
                            >
                              <RadioGroupItem
                                value={answer.id.toString()}
                                id={`answer-${answer.id}`}
                              />
                              <Label
                                htmlFor={`answer-${answer.id}`}
                                className="flex-1 cursor-pointer font-medium"
                              >
                                {answer.option_letter}. {answer.answer_text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <div>
                        {currentQuestion > 0 && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              setCurrentQuestion(currentQuestion - 1)
                            }
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setSelectedAnswers((prev) => {
                              const newAnswers = { ...prev };
                              delete newAnswers[currentQ.id];
                              return newAnswers;
                            })
                          }
                          disabled={!isAnswered}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Clear Answer
                        </Button>
                        {currentQuestion < currentPaper.questions.length - 1 ? (
                          <Button
                            onClick={() =>
                              setCurrentQuestion(currentQuestion + 1)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={
                              Object.keys(selectedAnswers).length <
                              currentPaper.questions.length || submitting
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {submitting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Award className="mr-2 h-4 w-4" />
                            )}
                            {submitting ? 'Submitting...' : 'Submit Test'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentPaper.questions.length}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {Object.keys(selectedAnswers).length}
                  </div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {currentYear}
                  </div>
                  <div className="text-sm text-gray-600">BECE Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {/* Results Modal */}
      <BECEResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        currentPaper={currentPaper}
        selectedAnswers={selectedAnswers}
        onReviewQuestions={() => {
          setShowResults(false);
          setCurrentQuestion(0);
        }}
        subjectName="Integrated Science"
      />

      <Footer />
    </div>
  );
}
