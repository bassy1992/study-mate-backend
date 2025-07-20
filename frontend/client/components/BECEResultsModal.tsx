import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, XCircle } from 'lucide-react';

interface Answer {
  id: number;
  option_letter: string;
  answer_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_text: string;
  topic: string;
  answers: Answer[];
}

interface Paper {
  id: number;
  questions: Question[];
  year: {
    year: number;
  };
  subject: {
    display_name: string;
  };
}

interface BECEResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPaper: Paper;
  selectedAnswers: Record<number, number>;
  onReviewQuestions: () => void;
  subjectName?: string;
}

export default function BECEResultsModal({
  isOpen,
  onClose,
  currentPaper,
  selectedAnswers,
  onReviewQuestions,
  subjectName = 'BECE'
}: BECEResultsModalProps) {
  if (!isOpen || !currentPaper) return null;

  const calculateScore = () => {
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

  const getCorrectAnswersCount = () => {
    return Object.keys(selectedAnswers).filter(
      (id) => {
        const questionId = parseInt(id);
        const question = currentPaper.questions.find(q => q.id === questionId);
        const correctAnswer = question?.answers.find(a => a.is_correct);
        return selectedAnswers[questionId] === correctAnswer?.id;
      }
    ).length;
  };

  const correctCount = getCorrectAnswersCount();
  const totalQuestions = currentPaper.questions.length;
  const scorePercentage = calculateScore();

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Results Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Test Complete!
            </h3>
            <div className="text-4xl font-bold text-blue-600">
              {scorePercentage}%
            </div>
            <p className="text-gray-600">
              You answered <span className="font-semibold text-gray-800">{correctCount}</span> out of{' '}
              <span className="font-semibold text-gray-800">{totalQuestions}</span> questions correctly.
            </p>
            <div className="text-sm text-gray-500">
              {currentPaper.year.year} {currentPaper.subject.display_name} Practice
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Question Review</h4>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Correct ({correctCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Incorrect ({totalQuestions - correctCount})</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentPaper.questions.map((question, index) => {
              const selectedAnswerId = selectedAnswers[question.id];
              const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
              const correctAnswer = question.answers.find(a => a.is_correct);
              const isCorrect = selectedAnswerId === correctAnswer?.id;
              const wasAnswered = selectedAnswerId !== undefined;

              return (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : wasAnswered
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      isCorrect 
                        ? 'bg-green-500' 
                        : wasAnswered 
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : wasAnswered ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-bold">?</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Question {index + 1}
                          </h5>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {question.topic}
                          </span>
                        </div>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          isCorrect 
                            ? 'text-green-700 bg-green-100' 
                            : wasAnswered
                              ? 'text-red-700 bg-red-100'
                              : 'text-gray-700 bg-gray-100'
                        }`}>
                          {isCorrect ? 'Correct' : wasAnswered ? 'Incorrect' : 'Not Answered'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">{question.question_text}</p>
                      
                      <div className="space-y-2">
                        {/* Your Answer */}
                        <div className="flex items-start space-x-2">
                          <span className="text-sm font-medium text-gray-600 min-w-[100px]">Your answer:</span>
                          <span className={`text-sm px-2 py-1 rounded flex-1 ${
                            isCorrect 
                              ? 'bg-green-100 text-green-800' 
                              : wasAnswered
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {selectedAnswer 
                              ? `${selectedAnswer.option_letter}. ${selectedAnswer.answer_text}` 
                              : 'Not answered'
                            }
                          </span>
                        </div>
                        
                        {/* Correct Answer (if wrong or not answered) */}
                        {!isCorrect && (
                          <div className="flex items-start space-x-2">
                            <span className="text-sm font-medium text-gray-600 min-w-[100px]">Correct answer:</span>
                            <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800 flex-1">
                              {correctAnswer?.option_letter}. {correctAnswer?.answer_text}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Performance Summary:</span> {scorePercentage}% 
              <span className="mx-2">•</span>
              <span className="text-green-600 font-medium">{correctCount} correct</span>
              <span className="mx-1">•</span>
              <span className="text-red-600 font-medium">{totalQuestions - correctCount} incorrect</span>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onReviewQuestions}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Review Questions
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link to="/bece-preparation">Finish Practice</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}