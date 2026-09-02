// Authenticated home screen: profile greeting, level entry points, quick actions, and practical-lab navigation.
// Modify `quickActions` for dashboard tiles and update App.jsx when an action needs a new destination.
import React from 'react';
import { 
  BookOpen, Sparkles, FileText, TrendingUp, 
  Bookmark, Calendar, Award, ChevronRight, 
  Sun, Moon
} from 'lucide-react';
import PracticalLabs from './components/PracticalLabs';

export default function Dashboard({ isDarkMode, toggleTheme, userData, onNavigate, onLogout }) {
  const name = userData?.nickname || userData?.name || 'Student';

  const quickActions = [
    { id: 'past-questions', label: 'Past Questions', sub: 'Browse 2016–2026 papers', icon: BookOpen, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { id: 'smart-ai', label: 'Ask Smart AI', sub: 'Instant AI assistant & explanation', icon: Sparkles, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: 'practice-exam', label: 'Practice Exam', sub: 'Test yourself with interactive MCQs', icon: FileText, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
    { id: 'my-progress', label: 'My Progress', sub: 'Track your overall performance', icon: TrendingUp, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400' },
    { id: 'saved', label: 'Saved Papers', sub: 'Resume recently studied papers', icon: Bookmark, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' },
    { id: 'study-plan', label: 'Study Plan', sub: 'Your personalized timetable', icon: Calendar, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { id: 'achievements', label: 'Achievements', sub: 'Badges and milestones', icon: Award, color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400' },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* Header */}
      <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">🎓</div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">PastQ</h1>
            <p className="text-[10px] text-slate-400">Learn Smarter. Score Higher.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className={`p-2 rounded-xl border transition-colors ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-24">
        <div>
          <h2 className="text-2xl font-black">👋 Welcome back, <span className="text-indigo-500">{name}!</span></h2>
          <p className="text-xs text-slate-400 mt-0.5">Select a level or section below to begin.</p>
        </div>

        {/* Theme-Aware O-Level & A-Level Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('subjects', { level: 'O-Level' })}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-[#141519] border-[#26272E] hover:border-blue-500 text-white' 
                : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><BookOpen size={20} /></div>
              <div className="text-left">
                <span className="block text-sm font-bold">O-Level</span>
                <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Independent Syllabus</span>
              </div>
            </div>
            <ChevronRight size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
          </button>

          <button 
            onClick={() => onNavigate('subjects', { level: 'A-Level' })}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-[#141519] border-[#26272E] hover:border-emerald-500 text-white' 
                : 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-400 text-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white"><BookOpen size={20} /></div>
              <div className="text-left">
                <span className="block text-sm font-bold text-emerald-600 dark:text-emerald-400">A-Level</span>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-500/80">Advanced Syllabus</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-emerald-600 dark:text-emerald-500" />
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all hover:-translate-y-0.5 ${
                  isDarkMode ? 'bg-[#141519] border-[#26272E] hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm hover:shadow'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold">{action.label}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{action.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fixed Practical Labs Navigation Bar */}
        <PracticalLabs isDarkMode={isDarkMode} />

      </main>
    </div>
  );
}