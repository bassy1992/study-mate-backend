import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth, useQuiz } from "@/hooks/useApi";
import { apiClient, QuizAnswer } from "@shared/api";
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
  Play,
  AlertCircle,
} from "lucide-react";

export default function QuizTaking() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const { data: quiz, loading, error } = useQuiz(slug!);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Debug when showResults changes
  useEffect(() => {
    console.log('showResults changed to:', showResults);
  }, [showResults]);

  // Debug when results changes
  useEffect(() => {
    console.log('results changed to:', results);
  }, [results]);

  // Debug when quizStarted changes
  useEffect(() => {
    console.log('quizStarted changed to:', quizStarted);
  }, [quizStarted]);

  // Debug logging
  console.log('QuizTaking render:', {
    slug,
    quiz: quiz ? { id: quiz.id, title: quiz.title, questionsCount: quiz.questions?.length } : null,
    loading,
    error,
    showResults,
    quizStarted,
    results: results ? { score: results.score, percentage_score: results.percentage_score } : null
  });

  // Initialize timer when quiz starts
  useEffect(() => {
    if (quiz && quizStarted) {
      setTimeLeft(quiz.time_limit_minutes * 60);
    }
  }, [quiz, quizStarted]);

  // Timer countdown - TEMPORARILY DISABLED TO STOP INFINITE RENDERS
  /*
  useEffect(() => {
    if (timeLeft > 0 && quizStarted && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quizStarted, showResults]);
  */

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = async () => {
    if (!quiz) return;
    
    try {
      console.log('Starting quiz:', quiz.id);
      const response = await apiClient.startQuiz(quiz.id);
      console.log('Start quiz response:', response);
      setQuizStarted(true);
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit called with:', {
      quizId: quiz?.id,
      answersCount: Object.keys(answers).length,
      answers: answers
    });
    
    if (!quiz || submitting) {
      console.log('Early return - quiz or submitting check failed');
      return;
    }
    
    console.log('Setting submitting to true');
    setSubmitting(true);
    
    try {
      // Convert answers to the expected format
      const quizAnswers: QuizAnswer[] = Object.entries(answers).map(([questionId, answer]) => {
        const question = quiz.questions.find(q => q.id === parseInt(questionId));
        
        if (question?.question_type === 'multiple_choice' || question?.question_type === 'true_false') {
          return {
            question_id: parseInt(questionId),
            answer_id: typeof answer === 'number' ? answer : parseInt(answer as string),
          };
        } else {
          return {
            question_id: parseInt(questionId),
            text_answer: answer as string,
          };
        }
      });

      console.log('Submitting quiz with answers:', quizAnswers);
      const response = await apiClient.submitQuiz(quiz.id, quizAnswers);
      console.log('Submit quiz response:', response);
      
      console.log('Setting results and showResults');
      setResults(response);
      setShowResults(true);
      
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      console.log('Setting submitting to false');
      setSubmitting(false);
    }
  }, [quiz, answers, submitting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading quiz...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Found</h2>
              <p className="text-gray-600 mb-6">{error || 'The requested quiz could not be found.'}</p>
              <Button asChild>
                <Link to="/quiz">Back to Quizzes</Link>
              </Button>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please log in to take this quiz.</p>
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

  // Quiz Results View
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
              <div className="text-center space-y-6">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${results.passed ? "bg-green-100" : "bg-red-50"}`}>
                  {results.passed ? (
                    <Award className="h-10 w-10 text-green-600" />
                  ) : (
                    <Target className="h-10 w-10 text-red-500" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
                  <p className="text-lg text-gray-600">{quiz.title}</p>
                  <p className="text-sm text-gray-500">{quiz.subject.name}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {results.percentage_score}%
                    </div>
                    <div className="text-sm text-gray-600">Your Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">{results.correct_answers}</div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{results.total_questions}</div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">{results.time_taken_minutes}</div>
                    <div className="text-sm text-gray-600">Minutes Taken</div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${results.passed ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                  <p className="font-medium">
                    {results.passed
                      ? "🎉 Congratulations! You passed the quiz!"
                      : "🎯 Quiz completed! Review your answers and try again to improve your score."}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>You scored {results.score} out of {results.total_points} points</p>
                </div>
              </div>
            </div>
            
            {/* Detailed Results Section */}
            {results.question_results && results.question_results.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
                <div className="space-y-6">
                  {results.question_results.map((questionResult: any, index: number) => (
                    <div key={questionResult.question_id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Question {index + 1}
                        </h3>
                        <div className={`flex items-center space-x-2 ${questionResult.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                          {questionResult.is_correct ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                          <span className="font-medium">
                            {questionResult.is_correct ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{questionResult.question_text}</p>
                      
                      <div className="space-y-2">
                        {questionResult.your_answer && (
                          <div className="flex items-start space-x-2">
                            <span className="text-sm font-medium text-gray-600 min-w-[100px]">Your Answer:</span>
                            <span className={`text-sm ${questionResult.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                              {questionResult.your_answer}
                            </span>
                          </div>
                        )}
                        
                        {questionResult.correct_answer && (
                          <div className="flex items-start space-x-2">
                            <span className="text-sm font-medium text-gray-600 min-w-[100px]">Correct Answer:</span>
                            <span className="text-sm text-green-700 font-medium">
                              {questionResult.correct_answer}
                            </span>
                          </div>
                        )}
                        
                        {questionResult.explanation && (
                          <div className="flex items-start space-x-2 mt-3">
                            <span className="text-sm font-medium text-gray-600 min-w-[100px]">Explanation:</span>
                            <span className="text-sm text-gray-700">
                              {questionResult.explanation}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span>Points: {questionResult.points_earned || 0} / {questionResult.points_possible || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/quiz">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Quizzes
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-blue-100">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                  <p className="text-lg text-gray-600">{quiz.subject.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{quiz.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Limit:</span>
                      <span className="font-medium">{quiz.time_limit_minutes} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passing Score:</span>
                      <span className="font-medium">{quiz.passing_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quiz Type:</span>
                      <span className="font-medium capitalize">{quiz.quiz_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                    <div className="text-left">
                      <h4 className="font-medium text-yellow-800">Important Notes:</h4>
                      <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                        <li>• Once started, the timer cannot be paused</li>
                        <li>• You can navigate between questions freely</li>
                        <li>• Submit before time runs out to avoid auto-submission</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/quiz">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Quizzes
                    </Link>
                  </Button>
                  <Button onClick={handleStartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Start Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Quiz Taking Interface
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.subject.name}</p>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-2 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <p className="text-sm text-gray-600">Time Remaining</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{currentQ.question_text}</h2>
                  <Badge variant="outline">{currentQ.points} {currentQ.points === 1 ? 'point' : 'points'}</Badge>
                </div>

                {(currentQ.question_type === "multiple_choice" || currentQ.question_type === "true_false") && (
                  <RadioGroup
                    value={answers[currentQ.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, parseInt(value))}
                  >
                    <div className="space-y-3">
                      {currentQ.answers.map((answer) => (
                        <div key={answer.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                          <Label htmlFor={`answer-${answer.id}`} className="flex-1 cursor-pointer">
                            {answer.answer_text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQ.question_type === "short_answer" && (
                  <Input
                    value={answers[currentQ.id]?.toString() || ""}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Enter your answer"
                    className="h-12 text-lg"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  {currentQuestion > 0 && (
                    <Button variant="outline" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white">
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                  )}
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