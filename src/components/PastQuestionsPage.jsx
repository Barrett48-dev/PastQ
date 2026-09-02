import React from 'react';
// Past-paper year catalogue with a placeholder PDF download/view action.
// Modify the year range and paper metadata here; replace the alert when real document URLs are available.
import React from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';

export default function PastQuestionsPage({ level = 'O-Level', subject = 'General', isDarkMode, onBack }) {
  const years = Array.from({ length: 11 }, (_, i) => 2026 - i); // 2026 down to 2016

  return (
    <div className={`min-h-screen p-6 max-w-4xl mx-auto ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md">
          {level}
        </span>
        <h2 className="text-2xl font-black mt-2">{subject} Past Questions</h2>
        <p className="text-xs text-slate-400">Download or view official past papers from 2016 to 2026.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {years.map((year) => (
          <div 
            key={year}
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold">{subject} Paper 1 & 2</h4>
                <p className="text-[10px] text-slate-400">June Session • {year}</p>
              </div>
            </div>

            <button 
              onClick={() => alert(`Downloading ${subject} ${year} PDF...`)}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              <Download size={14} />
              <span>PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}