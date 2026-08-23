// Standalone review modal that turns missed questions into a flip-and-rate study deck.
import React, { useState } from 'react';
import { ArrowLeft, RotateCw, CheckCircle2, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

export default function FlashcardDeck({ incorrectQuestions, subjectTitle, onExit }) {
  // Progress is local to this review session and resets when the deck restarts.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = incorrectQuestions[currentIndex];

  // Close the current card, optionally count it as mastered, and advance or finish.
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

  // Restart preserves the same questions while clearing review progress.
  const handleRestart = () => {
    setCurrentIndex(0);
    setMasteredCount(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

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

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E]/95 flex flex-col items-center justify-center p-4">
      
      {/* Top Header */}
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

      {/* Flip Card Area */}
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

        {/* Card Content */}
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

      {/* Action Controls */}
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