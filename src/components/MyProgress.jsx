import React from 'react';
// Progress summary screen; its current metrics are presentation-only prototype data.
// Replace the fixed records with props or a data service here when attempts become persistent.
import React from 'react';
import { ArrowLeft, TrendingUp, Target, Award, CheckCircle } from 'lucide-react';

export default function MyProgress({ isDarkMode = false, onBack }) {
  // This prototype presents fixed analytics; the back callback returns to the route-owned dashboard.
  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Header provides route context and a consistent escape action. */}
      <header className={`px-6 py-4 flex items-center space-x-3 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <button onClick={onBack} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'}`}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-sm font-black flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-500" /> My Progress & Analytics
          </h1>
          <p className="text-[10px] text-slate-400">Track accuracy, speed, and improvement</p>
        </div>
      </header>

      {/* Summary cards are placeholders for persisted attempt analytics in a future backend. */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border text-center ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-[10px] font-bold uppercase text-slate-400">Overall Accuracy</span>
            <h2 className="text-3xl font-black text-cyan-500 mt-1">78%</h2>
          </div>
          <div className={`p-5 rounded-3xl border text-center ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-[10px] font-bold uppercase text-slate-400">Papers Solved</span>
            <h2 className="text-3xl font-black text-indigo-500 mt-1">42</h2>
          </div>
          <div className={`p-5 rounded-3xl border text-center ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-[10px] font-bold uppercase text-slate-400">Study Hours</span>
            <h2 className="text-3xl font-black text-emerald-500 mt-1">68 hrs</h2>
          </div>
        </div>
      </main>
    </div>
  );
}