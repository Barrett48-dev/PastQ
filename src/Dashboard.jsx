import React from 'react';
import { 
  BookOpen, Sparkles, FileText, TrendingUp, 
  Bookmark, Calendar, Award, ChevronRight, Bell, 
  Code, Atom, Leaf, FlaskConical, Sun, Moon, LogOut, User
} from 'lucide-react';

export default function Dashboard({ 
  isDarkMode, 
  toggleTheme, 
  userData, 
  onNavigate, 
  onLogout,
  onOpenAuth 
}) {
  // Derive display-friendly values from the optional profile, with demo defaults for guests.
  const name = userData?.nickname || userData?.name || 'Student';
  const recentSubject = userData?.lastStudied || {
    title: 'Mathematics',
    paper: '2021 – Paper 2',
    progress: 65,
    id: 'math-2021-p2'
  };

  // These identifiers are translated into routes by App; each item also carries its own icon and accent.
  const quickActions = [
    { id: 'past-questions', label: 'Past Questions', sub: 'Browse by subject, year & paper', icon: BookOpen, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { id: 'smart-ai', label: 'Ask Smart AI', sub: 'Explain questions & get help instantly', icon: Sparkles, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: 'practice-exam', label: 'Practice Exam', sub: 'Test yourself with mock exams', icon: FileText, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
    { id: 'my-progress', label: 'My Progress', sub: 'Track your statistics & improvement', icon: TrendingUp, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400' },
    { id: 'saved', label: 'Saved', sub: 'View your saved questions', icon: Bookmark, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' },
    { id: 'study-plan', label: 'Study Plan', sub: 'Your personalized study schedule', icon: Calendar, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { id: 'achievements', label: 'Achievements', sub: 'Badges & milestones you earned', icon: Award, color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400' },
  ];

  // Practical subjects include a labType so the shared lab route can select its specialized workspace.
  const recentSubjectsList = [
    { id: 'math', name: 'Mathematics', icon: BookOpen, isPractical: false, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { id: 'bio', name: 'Biology', icon: Leaf, isPractical: true, labType: 'virtual-bio-lab', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'phy', name: 'Physics', icon: Atom, isPractical: true, labType: 'virtual-physics-lab', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { id: 'chem', name: 'Chemistry', icon: FlaskConical, isPractical: true, labType: 'virtual-chem-lab', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { id: 'cs', name: 'Computer Sci.', icon: Code, isPractical: true, labType: 'code-editor-lab', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
  ];

  // The dashboard is intentionally presentational: interaction is delegated through the callback props.
  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* Header: brand, theme switch, notification affordance, and auth action. */}
      <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            🎓
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">PastQ</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Learn Smarter. Score Higher.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className={`p-2 rounded-xl border relative ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {userData ? (
            <button 
              onClick={onLogout} 
              className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <button 
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all"
            >
              <User size={14} />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Main container: all dashboard sections share the same responsive width and spacing. */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-24">
        
        {/* Welcome banner personalizes the otherwise reusable dashboard shell. */}
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            👋 Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{name}!</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">What are we studying today?</p>
        </div>

        {/* Level cards communicate supported tracks but currently have no navigation handler. */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`p-4 rounded-2xl border flex items-center justify-between select-none ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                <BookOpen size={20} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold">O-Level</span>
                <span className="text-[10px] text-slate-400">Exam Prep</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-500 opacity-60" />
          </div>

          <div 
            className={`p-4 rounded-2xl border flex items-center justify-between select-none ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-emerald-50/50 border-emerald-200 shadow-sm'}`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white">
                <BookOpen size={20} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-emerald-900 dark:text-emerald-300">A-Level</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Exam Prep</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-emerald-600 opacity-60" />
          </div>
        </div>

        {/* Action grid sends enabled tiles through the route callback; Past Questions remains a placeholder. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            const isDisabled = action.id === 'past-questions';

            if (isDisabled) {
              return (
                <div
                  key={action.id}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 select-none ${
                    isDarkMode 
                      ? 'bg-[#141519] border-[#26272E]' 
                      : 'bg-white border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{action.label}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{action.sub}</p>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all transform hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-[#141519] border-[#26272E] hover:border-slate-700' 
                    : 'bg-white border-slate-200/80 shadow-sm hover:shadow'
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

        {/* Continue studying uses the profile's lastStudied record to resume a practice context. */}
        <div className={`p-5 rounded-3xl border space-y-3 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Continue Studying</h3>
          </div>

          <div 
            onClick={() => onNavigate('practice-exam', { paperId: recentSubject.id })}
            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              isDarkMode ? 'bg-[#1A1B20] border-[#26272E] hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center space-x-3 w-full max-w-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                f(x)
              </div>
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{recentSubject.title}</span>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">{recentSubject.progress}%</span>
                </div>
                <p className="text-[10px] text-slate-400">{recentSubject.paper}</p>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${recentSubject.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practical subject buttons pass lab metadata to the lab route; Mathematics is display-only for now. */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Subjects & Practical Labs</h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {recentSubjectsList.map((subject) => {
              const IconComp = subject.icon;
              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    if (subject.isPractical) {
                      onNavigate('practical-lab', { labType: subject.labType, subject: subject.name });
                    }
                  }}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center space-y-2 text-center transition-all transform hover:scale-105 ${
                    isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${subject.color}`}>
                    <IconComp size={20} />
                  </div>
                  <span className="text-xs font-bold truncate w-full">{subject.name}</span>
                  {subject.isPractical && (
                    <span className="text-[9px] bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                      LAB
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}