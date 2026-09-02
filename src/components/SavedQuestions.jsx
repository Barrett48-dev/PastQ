import React from 'react';
// Saved-paper presentation using prototype records.
// Replace local placeholder data with props or a persistence service when save/remove actions are implemented.
import React from 'react';
import { ArrowLeft, Bookmark, Award, Star } from 'lucide-react';

export function SavedQuestions({ isDarkMode = false, onBack }) {
  // Saved-question persistence is not implemented yet, so this route documents the intended empty state.
  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Header keeps the placeholder consistent with the other dashboard destinations. */}
      <header className={`px-6 py-4 flex items-center space-x-3 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <button onClick={onBack} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'}`}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-black flex items-center gap-2"><Bookmark size={18} className="text-pink-500" /> Saved Questions</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6 text-xs text-slate-400">Your bookmarked past paper questions will appear here for revision.</main>
    </div>
  );
}

export function Achievements({ isDarkMode = false, onBack }) {
  // Badge records are static demo data until progress events are persisted and evaluated.
  const badges = [
    { title: 'First Paper Completed', desc: 'Finished your first past question set', icon: '🏆' },
    { title: '5-Day Streak', desc: 'Studied continuously for 5 days', icon: '🔥' },
    { title: 'Lab Explorer', desc: 'Completed a computer science or physics lab', icon: '🧪' },
  ];

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Header provides the same back affordance as the saved-questions screen. */}
      <header className={`px-6 py-4 flex items-center space-x-3 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <button onClick={onBack} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'}`}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-black flex items-center gap-2"><Award size={18} className="text-violet-500" /> Achievements</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {badges.map((b, i) => (
          <div key={i} className={`p-5 rounded-3xl border text-center space-y-2 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-3xl">{b.icon}</div>
            <h3 className="text-xs font-bold">{b.title}</h3>
            <p className="text-[10px] text-slate-400">{b.desc}</p>
          </div>
        ))}
      </main>
    </div>
  );
}