// Standalone timed multiple-choice demo with answer navigation and a results review screen.
// Modify the question records for content, the timer effect for timing rules, and the results branch for review behavior.
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, Send, Check, X } from 'lucide-react';

// The standalone runner uses local questions so it can demonstrate the exam lifecycle without a backend.
const SAMPLE_QUESTIONS = [
  // Local sample data keeps the runner functional before papers are loaded from an API.
  {
    id: 1,
    question: "Which of the following financial statements reports a company's financial position at a specific point in time?",
    options: [
      "Income Statement",
      "Balance Sheet",
      "Statement of Cash Flows",
      "Statement of Retained Earnings"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Under double-entry bookkeeping, an increase in an asset account is recorded as a:",
    options: [
      "Credit",
      "Liability",
      "Debit",
      "Revenue"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is the basic accounting equation?",
    options: [
      "Assets = Liabilities + Owner's Equity",
      "Assets = Revenue - Expenses",
      "Liabilities = Assets + Owner's Equity",
      "Assets + Liabilities = Equity"
    ],
    correctAnswer: 0
  }
];

export default function ExamRunner({ paperTitle = "Financial Accounting Paper 1 (2025)", durationMinutes = 15, onExit }) {
  // Each piece of state represents one independent part of the attempt and drives a visible UI region.
  // Answers are keyed by question index so navigation does not lose selections.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Recreate the interval when time or submission state changes, and always clean it up.
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Keep timer formatting pure so it can be reused during every render without state changes.
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  // Submission freezes input and switches the component to its score view.
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Compare each stored option index with the corresponding question's answer index.
  const calculateScore = () => {
    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  // Derived values keep the render readable and ensure navigation/counts always reflect current state.
  const currentQ = SAMPLE_QUESTIONS[currentQuestionIndex];
  const totalQuestions = SAMPLE_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Once submitted, replace answer controls with an immutable score and question-by-question review.
  if (isSubmitted) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-[#0B0C0E] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-[#2F66F6]/10 border border-[#2F66F6]/30 text-[#2F66F6] rounded-2xl mx-auto flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold">Test Completed!</h1>
            <p className="text-xs text-[#A1A1AA]">{paperTitle}</p>
          </div>

          <div className="bg-[#1A1B20] border border-[#26272E] rounded-2xl p-6 flex justify-around items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Score</p>
              <p className="text-3xl font-black text-white">{score} / {totalQuestions}</p>
            </div>
            <div className="h-8 w-px bg-[#26272E]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Accuracy</p>
              <p className={`text-3xl font-black ${percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {percentage}%
              </p>
            </div>
          </div>

          {/* Answer Breakdown */}
          <div className="space-y-3 text-left max-h-60 overflow-y-auto pr-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Review Answers</p>
            {SAMPLE_QUESTIONS.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correctAnswer;
              return (
                <div key={q.id} className="p-3 bg-[#1A1B20] border border-[#26272E] rounded-xl flex items-start space-x-3 text-xs">
                  {isCorrect ? (
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{idx + 1}. {q.question}</p>
                    <p className="text-[#A1A1AA]">Your answer: <span className={isCorrect ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>{q.options[selectedAnswers[idx]] || 'Unanswered'}</span></p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onExit}
            className="w-full py-3.5 bg-[#2F66F6] hover:bg-[#1E52E0] text-white rounded-xl font-semibold text-xs transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Before submission, show one question at a time and preserve answers while the timer runs.
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#26272E]">
          <div>
            <h2 className="text-sm font-bold text-white">{paperTitle}</h2>
            <p className="text-xs text-[#A1A1AA]">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
          </div>

          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold ${
            timeLeft < 180 ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-[#26272E] bg-[#1A1B20] text-[#A1A1AA]'
          }`}>
            <Clock size={14} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold leading-relaxed text-white">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#2F66F6] bg-[#2F66F6]/10 text-white'
                      : 'border-[#26272E] bg-[#1A1B20] text-[#A1A1AA] hover:text-white hover:border-[#3F404A]'
                  }`}
                >
                  <span>{option}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#2F66F6] bg-[#2F66F6]' : 'border-[#71717A]'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#26272E]">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-[#1A1B20] border border-[#26272E] text-xs font-semibold rounded-xl disabled:opacity-40 text-[#A1A1AA] hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
              className="px-5 py-2 bg-[#2F66F6] hover:bg-[#1E52E0] text-white text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <Send size={14} />
              <span>Submit Test</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}