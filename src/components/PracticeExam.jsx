import React from 'react';
import { ArrowLeft, FileText, Clock, AlertCircle, Play } from 'lucide-react';

export default function PracticeExam({ isDarkMode = false, onBack, onStartExam }) {
  // Local mock metadata lets this route render independently while the runner integration is developed.
  const mockExams = [
    { id: 'math-mock', title: 'Mathematics Paper 1 (MCQ)', duration: '1h 30m', questions: 50, level: 'O-Level' },
    { id: 'phy-mock', title: 'Physics Paper 2 (Structured)', duration: '2h 00m', questions: 8, level: 'A-Level' },
    { id: 'cs-mock', title: 'Computer Science Practical Test', duration: '1h 45m', questions: 4, level: 'A-Level' },
  ];

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Header anchors the mock-exam list to the dashboard navigation. */}
      <header className={`px-6 py-4 flex items-center space-x-3 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <button onClick={onBack} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'}`}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-sm font-black flex items-center gap-2">
            <FileText size={18} className="text-orange-500" /> Practice Exams
          </h1>
          <p className="text-[10px] text-slate-400">Timed mock test simulations</p>
        </div>
      </header>

      {/* Each metadata record becomes one launchable exam row. */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {mockExams.map((exam) => (
          <div key={exam.id} className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-500">{exam.level}</span>
              <h3 className="text-sm font-bold">{exam.title}</h3>
              <div className="flex items-center space-x-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration}</span>
                <span className="flex items-center gap-1"><AlertCircle size={12} /> {exam.questions} Questions</span>
              </div>
            </div>
            <button onClick={() => onStartExam(exam.id)} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl flex items-center space-x-1">
              <Play size={14} /> <span>Start Test</span>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}