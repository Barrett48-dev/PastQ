// Subject-focused paper browser with demo paper data, an embedded PDF viewer, grading, and flashcards.
import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Sparkles, BookOpen, Clock, 
  Layers, ArrowLeft, X, ZoomIn, ZoomOut, CheckCircle2, XCircle, AlertCircle, Award,
  RotateCw, RefreshCw
} from 'lucide-react';

// Each paper combines catalogue metadata, a viewer URL, and answer-key explanations for demo grading.
const ALL_SUBJECT_PAPERS = [
  // Demo paper records contain both viewer metadata and grading explanations.
  { 
    id: 1, 
    title: 'Financial Accounting Paper 1 (MCQ)', 
    year: '2025 GCE AL', 
    subject: 'Financial Accounting', 
    durationMinutes: 10,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    questions: [
      { id: 1, questionText: 'What is the accounting equation for determining Owner\'s Equity?', correctAnswer: 'B', explanation: 'Assets = Liabilities + Equity. Rearranging gives Equity = Assets - Liabilities.' },
      { id: 2, questionText: 'Why is depreciation recorded in financial statements?', correctAnswer: 'A', explanation: 'Depreciation is a non-cash expense deducted to reflect asset wear and tear.' },
      { id: 3, questionText: 'What is the primary purpose of preparing a Trial Balance?', correctAnswer: 'C', explanation: 'The Trial Balance tests the mathematical equality of debits and credits.' },
      { id: 4, questionText: 'How are bad debts written off accounted for in the financial statements?', correctAnswer: 'D', explanation: 'Bad debts written off are treated as an expense in the Profit and Loss Account.' },
      { id: 5, questionText: 'Which formula correctly calculates Working Capital?', correctAnswer: 'A', explanation: 'Working Capital is calculated as Current Assets minus Current Liabilities.' },
    ]
  },
  { 
    id: 2, 
    title: 'Economics Paper 1 (MCQ)', 
    year: '2025 GCE AL', 
    subject: 'Economics', 
    durationMinutes: 15,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    questions: [
      { id: 1, questionText: 'What is the fundamental concept behind Opportunity Cost?', correctAnswer: 'C', explanation: 'Opportunity cost refers to the next best alternative foregone when making a choice.' },
      { id: 2, questionText: 'What impact does an increase in overall consumer demand have on the demand curve?', correctAnswer: 'B', explanation: 'An increase in demand shifts the demand curve to the right.' },
      { id: 3, questionText: 'How does inflation affect cash holdings over time?', correctAnswer: 'A', explanation: 'Inflation reduces the purchasing power of money over time.' },
      { id: 4, questionText: 'What measures are included in government Fiscal Policy?', correctAnswer: 'D', explanation: 'Fiscal policy involves government spending and taxation adjustments.' },
      { id: 5, questionText: 'Which market condition defines a Monopoly?', correctAnswer: 'B', explanation: 'Monopoly is a market structure characterized by a single seller.' },
    ]
  }
];

// ----------------- FLASHCARD DECK COMPONENT -----------------
function FlashcardDeck({ incorrectQuestions, subjectTitle, onExit }) {
  // This private copy keeps missed-question review available directly inside the exam workflow.
  // This local modal implementation mirrors the standalone deck used elsewhere in the app.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = incorrectQuestions[currentIndex];

  // Reset the card face, optionally record mastery, and either advance or switch to completion.
  const handleNext = (wasMastered = false) => {
    setIsFlipped(false);
    
    if (wasMastered) {
      setMasteredCount((prev) => prev + 1);
    }

    if (currentIndex + 1 < incorrectQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Restart the same missed-question set without changing the completed exam result.
  const handleRestart = () => {
    setCurrentIndex(0);
    setMasteredCount(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  // Completion replaces the card so totals and the next actions are unambiguous.
  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0C0E]/95 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141519] border border-[#26272E] rounded-3xl p-6 text-center space-y-5">
          <div className="w-16 h-16 bg-[#2F66F6]/10 border border-[#2F66F6]/30 rounded-2xl mx-auto flex items-center justify-center text-[#2F66F6]">
            <Sparkles size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">Deck Completed!</h2>
            <p className="text-xs text-[#A1A1AA]">
              You reviewed all {incorrectQuestions.length} missed concepts from {subjectTitle}.
            </p>
          </div>
          <div className="p-3 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs flex justify-around">
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase font-bold">Total Reviewed</p>
              <p className="text-base font-bold text-white">{incorrectQuestions.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase font-bold">Marked Mastered</p>
              <p className="text-base font-bold text-green-400">{masteredCount}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-[#1A1B20] border border-[#26272E] hover:border-[#3F404A] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1"
            >
              <RefreshCw size={14} />
              <span>Review Again</span>
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 bg-[#2F66F6] hover:bg-[#1E52E0] text-white text-xs font-bold rounded-xl transition-all"
            >
              Back to Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active cards expose the missed prompt first and reveal the correction only after a flip.
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E]/95 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="flex items-center space-x-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Deck</span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#D97706]/10 px-3 py-1 rounded-full border border-[#D97706]/20">
          Card {currentIndex + 1} of {incorrectQuestions.length}
        </span>
      </div>

      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="max-w-xl w-full h-80 bg-[#141519] border border-[#26272E] hover:border-[#2F66F6]/50 rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all shadow-2xl relative select-none"
      >
        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
          <span className="flex items-center space-x-1 font-mono">
            <BookOpen size={14} />
            <span>Question {currentQuestion.id}</span>
          </span>
          <span className="text-[10px] font-bold uppercase text-[#2F66F6]">
            {isFlipped ? 'Answer & Explanation' : 'Click card to flip'}
          </span>
        </div>

        <div className="my-auto text-center px-4 space-y-3">
          {!isFlipped ? (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                Your Answer: {currentQuestion.userAnswer || 'None'}
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentQuestion.questionText || `Review problem statement for Question #${currentQuestion.id} from your PDF sheet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                Correct Answer: {currentQuestion.correctAnswer}
              </span>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center space-x-1 text-[11px] text-[#A1A1AA]">
          <RotateCw size={12} />
          <span>Tap anywhere to toggle side</span>
        </div>
      </div>

      <div className="max-w-xl w-full flex space-x-3 mt-6">
        <button
          onClick={() => handleNext(false)}
          className="flex-1 py-3 bg-[#1A1B20] border border-[#26272E] hover:border-[#3F404A] text-white text-xs font-bold rounded-xl transition-all"
        >
          Still Learning
        </button>
        <button
          onClick={() => handleNext(true)}
          className="flex-1 py-3 bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 text-green-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5"
        >
          <CheckCircle2 size={14} />
          <span>Got It Mastered</span>
        </button>
      </div>
    </div>
  );
}

// ----------------- MAIN SUBJECT SEARCH COMPONENT -----------------
export default function SubjectSearch({ userData, onBackToDashboard }) {
  // Profile subjects drive the filter tabs, with demo subjects ensuring the guest flow is usable.
  // Fall back to demo subjects when a profile has not selected any subjects yet.
  const userSubjects = userData?.selectedSubjects?.length > 0 
    ? userData.selectedSubjects 
    : ['Financial Accounting', 'Economics'];

  const [selectedSubject, setSelectedSubject] = useState(userSubjects[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active exam state includes the selected paper, timer, answers, and result summary.
  const [activePdfPaper, setActivePdfPaper] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);

  // Flashcards are shown as a modal over the graded exam state.
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Keep only papers matching both the selected subject and the title search.
  const subjectPapers = ALL_SUBJECT_PAPERS.filter((paper) => {
    const matchesSubject = paper.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Reset every exam-specific value when a new paper is opened or retaken.
  const handleStartExam = (paper) => {
    setActivePdfPaper(paper);
    setUserAnswers({});
    setIsSubmitted(false);
    setExamResult(null);
    setShowFlashcards(false);
    setTimeLeft(paper.durationMinutes * 60);
  };

  // Decrement once per second and submit automatically when the countdown expires.
  useEffect(() => {
    if (!activePdfPaper || isSubmitted) return;

    if (timeLeft <= 0) {
      handleCalculateScore();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activePdfPaper, timeLeft, isSubmitted]);

  // Convert elapsed seconds into the compact timer format shown in the toolbar.
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Store one answer per question while the exam is still active.
  const handleSelectOption = (questionId, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Grade answers and create the result object used by the explanation panel.
  const handleCalculateScore = () => {
    if (!activePdfPaper) return;

    let correctCount = 0;
    const questions = activePdfPaper.questions;

    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    setExamResult({
      score: correctCount,
      total: questions.length,
      percentage: scorePercentage,
      passed: scorePercentage >= 50
    });

    setIsSubmitted(true);
  };

  // Preserve each missed question's answer so the flashcard can show what was chosen.
  const getIncorrectQuestions = () => {
    if (!activePdfPaper) return [];
    return activePdfPaper.questions
      .filter((q) => userAnswers[q.id] !== q.correctAnswer)
      .map((q) => ({
        ...q,
        userAnswer: userAnswers[q.id]
      }));
  };

  // The page has two top-level modes: catalogue browsing and a modal exam workspace.
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white p-4 md:p-8 font-sans">
      
      {/* ----------------- FLASHCARD OVERLAY MODAL ----------------- */}
      {showFlashcards && (
        <FlashcardDeck
          incorrectQuestions={getIncorrectQuestions()}
          subjectTitle={activePdfPaper.title}
          onExit={() => setShowFlashcards(false)}
        />
      )}

      {/* ----------------- EXAM MODE & PDF VIEWER MODAL ----------------- */}
      {activePdfPaper ? (
        <div className="fixed inset-0 z-40 bg-[#0B0C0E]/95 flex flex-col">
          
          {/* Toolbar closes the exam, identifies the paper, shows time, and controls PDF zoom. */}
          <div className="h-16 bg-[#141519] border-b border-[#26272E] px-4 md:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActivePdfPaper(null)}
                className="p-2 bg-[#1A1B20] border border-[#26272E] rounded-xl text-[#A1A1AA] hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">{activePdfPaper.title}</h2>
                <p className="text-[10px] text-[#A1A1AA]">{activePdfPaper.year} • {activePdfPaper.subject}</p>
              </div>
            </div>

            {/* The timer disappears after grading so the result view has no active deadline. */}
            {!isSubmitted && (
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeLeft < 180 
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse' 
                  : 'bg-[#1A1B20] border-[#26272E] text-white'
              }`}>
                <Clock size={14} className={timeLeft < 180 ? 'text-red-400' : 'text-[#2F66F6]'} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            {/* Zoom changes only the iframe wrapper scale, leaving answer state untouched. */}
            <div className="flex items-center space-x-2 bg-[#1A1B20] border border-[#26272E] p-1 rounded-xl text-xs">
              <button 
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))} 
                className="p-1.5 hover:bg-[#26272E] rounded-lg text-[#A1A1AA] hover:text-white"
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-mono text-[#A1A1AA] px-2">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))} 
                className="p-1.5 hover:bg-[#26272E] rounded-lg text-[#A1A1AA] hover:text-white"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <button
              onClick={() => setActivePdfPaper(null)}
              className="p-2 bg-[#1A1B20] border border-[#26272E] rounded-xl text-[#A1A1AA] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Workspace pairs the external paper with the local answer and grading panel. */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left side embeds the selected paper and applies the current zoom level. */}
            <div className="flex-1 bg-[#1A1B20] p-4 flex justify-center overflow-auto">
              <div 
                className="w-full h-full max-w-4xl transition-all duration-200" 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <iframe
                  src={`${activePdfPaper.pdfUrl}#toolbar=0&navpanes=0`}
                  title="Past Paper Preview"
                  className="w-full h-full rounded-2xl border border-[#26272E] bg-white shadow-2xl"
                />
              </div>
            </div>

            {/* Right side switches between answer collection and graded explanations. */}
            <div className="w-96 bg-[#141519] border-l border-[#26272E] p-4 flex flex-col justify-between overflow-y-auto">
              
              {/* State A: collect one A-D choice for every question until submission. */}
              {!isSubmitted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F66F6] bg-[#2F66F6]/10 px-2.5 py-1 rounded-full border border-[#2F66F6]/20">
                      Exam Mode Active
                    </span>
                    <span className="text-xs text-[#A1A1AA]">
                      {Object.keys(userAnswers).length} / {activePdfPaper.questions.length} Answered
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white">Select Your Answers</h3>

                  {/* Answer bubbles are generated from the paper's question IDs and answer letters. */}
                  <div className="space-y-2.5 pt-1">
                    {activePdfPaper.questions.map((q) => (
                      <div key={q.id} className="p-3 bg-[#1A1B20] rounded-xl border border-[#26272E] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-white font-bold">Question {q.id}</span>
                          {userAnswers[q.id] && (
                            <span className="text-[10px] text-[#2F66F6] font-semibold">Selected: {userAnswers[q.id]}</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {['A', 'B', 'C', 'D'].map((opt) => {
                            const isSelected = userAnswers[q.id] === opt;
                            return (
                              <button 
                                key={opt}
                                onClick={() => handleSelectOption(q.id, opt)}
                                className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                  isSelected 
                                    ? 'bg-[#2F66F6] border-[#2F66F6] text-white shadow-md shadow-[#2F66F6]/20' 
                                    : 'border-[#26272E] text-[#A1A1AA] hover:border-[#3F404A] hover:text-white'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleCalculateScore}
                    className="w-full py-3 bg-[#2F66F6] hover:bg-[#1E52E0] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#2F66F6]/20 mt-4"
                  >
                    Submit & Grade Exam
                  </button>
                </div>
              ) : (
                
                /* State B: freeze choices and explain every correct or incorrect result. */
                <div className="space-y-5">
                  {/* Score card summarizes the percentage and the prototype's 50% pass threshold. */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                    examResult.passed 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <Award size={32} className="mx-auto" />
                    <div>
                      <h2 className="text-2xl font-black">{examResult.percentage}% Score</h2>
                      <p className="text-xs text-white/80 font-medium">
                        {examResult.score} of {examResult.total} Questions Correct
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/20">
                      {examResult.passed ? 'Passed - Great Job!' : 'Needs Improvement'}
                    </span>
                  </div>

                  {/* Missed items are transformed into the local flashcard deck on demand. */}
                  {getIncorrectQuestions().length > 0 && (
                    <button
                      onClick={() => setShowFlashcards(true)}
                      className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#D97706]/20"
                    >
                      <Sparkles size={16} />
                      <span>Practice {getIncorrectQuestions().length} Missed Items as Flashcards</span>
                    </button>
                  )}

                  {/* Each explanation compares the stored user choice with the answer key. */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#A1A1AA]">Detailed Explanations</h3>
                    
                    {activePdfPaper.questions.map((q) => {
                      const userPick = userAnswers[q.id];
                      const isCorrect = userPick === q.correctAnswer;

                      return (
                        <div key={q.id} className="p-3 bg-[#1A1B20] rounded-xl border border-[#26272E] space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Q{q.id}</span>
                            {isCorrect ? (
                              <span className="flex items-center space-x-1 text-green-400 text-[11px]">
                                <CheckCircle2 size={12} />
                                <span>Correct (+1)</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 text-red-400 text-[11px]">
                                <XCircle size={12} />
                                <span>Incorrect</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 text-[11px] bg-[#141519] p-2 rounded-lg border border-[#26272E]">
                            <div>Your Answer: <strong className={isCorrect ? 'text-green-400' : 'text-red-400'}>{userPick || 'None'}</strong></div>
                            <div>Correct Answer: <strong className="text-green-400">{q.correctAnswer}</strong></div>
                          </div>

                          <p className="text-[11px] text-[#A1A1AA] leading-relaxed pt-1">
                            <strong className="text-white">Explanation: </strong>{q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => handleStartExam(activePdfPaper)}
                    className="w-full py-3 bg-[#1A1B20] border border-[#26272E] hover:border-[#3F404A] text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Retake Exam
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      ) : null}

      {/* Catalogue mode: subject tabs, title search, and launch cards for matching papers. */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation returns to the dashboard without changing the selected profile. */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Subject tabs narrow the catalogue before the title query is applied. */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {userSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === subject
                  ? 'bg-[#2F66F6] border-[#2F66F6] text-white'
                  : 'bg-[#141519] border-[#26272E] text-[#A1A1AA] hover:text-white'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Search is controlled input; each keystroke recomputes the filtered paper list. */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search past papers by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.value || e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141519] border border-[#26272E] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#2F66F6]"
          />
        </div>

        {/* Matching records become launch cards that initialize a fresh timed attempt. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectPapers.map((paper) => (
            <div key={paper.id} className="bg-[#141519] border border-[#26272E] p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                <span className="text-[10px] font-bold uppercase text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded-full border border-[#D97706]/20">
                  {paper.year}
                </span>
                <span className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{paper.durationMinutes} mins</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{paper.title}</h3>

              <div className="flex items-center justify-between pt-3 border-t border-[#26272E]">
                <button
                  onClick={() => handleStartExam(paper)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#2F66F6] hover:bg-[#1E52E0] px-4 py-2 rounded-xl transition-all shadow-md shadow-[#2F66F6]/20"
                >
                  <Sparkles size={14} />
                  <span>Start Timed Exam</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}