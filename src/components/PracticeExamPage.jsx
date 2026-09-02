// Page wrapper for the newer practice-exam route and its handoff into an exam runner.
// Modify page layout here; keep question grading in the runner that owns the exam contract.
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

const sampleMCQs = [
  {
    id: 1,
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctIndex: 1,
    note: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions (ATP)."
  },
  {
    id: 2,
    question: "What is the unit of electrical resistance?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctIndex: 2,
    note: "The Ohm (Ω) is the SI unit of electrical resistance, named after Georg Simon Ohm."
  }
];

export default function PracticeExamPage({ isDarkMode, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQ = sampleMCQs[currentIndex];

  const handleSelect = (index) => {
    if (selectedOption !== null) return; // Lock option once selected
    setSelectedOption(index);
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < sampleMCQs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className={`min-h-screen p-6 max-w-3xl mx-auto ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-indigo-500">Question {currentIndex + 1} of {sampleMCQs.length}</span>
          <span className="text-xs text-slate-400">Mock Exam Mode</span>
        </div>

        <h3 className="text-base font-bold mb-6">{currentQ.question}</h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnStyle = isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800';

            if (selectedOption !== null) {
              if (idx === currentQ.correctIndex) {
                // Correct Answer -> Highlighted Blue
                btnStyle = 'bg-blue-600 text-white border-blue-500 font-bold';
              } else if (idx === selectedOption) {
                // Wrong Selected Answer -> Highlighted Red
                btnStyle = 'bg-red-600 text-white border-red-500 font-bold';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{option}</span>
                {selectedOption !== null && idx === currentQ.correctIndex && <CheckCircle2 size={18} />}
                {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={18} />}
              </button>
            );
          })}
        </div>

        {/* Short Note & Explanation when answered */}
        {selectedOption !== null && (
          <div className="mt-6 p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-400">
              <HelpCircle size={16} /> Explanation Note:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentQ.note}</p>
          </div>
        )}

        {selectedOption !== null && (
          <button 
            onClick={handleNext}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            {currentIndex < sampleMCQs.length - 1 ? 'Next Question' : 'Finish Practice'}
          </button>
        )}
      </div>
    </div>
  );
}