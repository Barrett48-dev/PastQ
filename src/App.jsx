// Application shell and the authenticated dashboard's inline page views.
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Play, Flame, CheckCircle2, 
  BarChart2, ChevronRight, FileText, Target, Award, LogOut,
  Sun, Moon, FlaskConical, Bot, Cpu, Atom, Calculator, MessageSquare, X, Code, 
  ArrowLeft, Download, Filter, HelpCircle, TrendingUp, Clock, AlertTriangle, RefreshCw, Bookmark, Menu
} from 'lucide-react';
import OnboardingWizard from './components/OnboardingWizard';
import LoginModal from './components/LoginModal';
import { SavedQuestionsPage } from './components/SavedQuestions';
import { getCurrentUser, logoutUser } from './utils/auth';

// Past-paper archive view with the current placeholder download action.

function PastQuestionsPage({ level = 'O-Level', subject = 'General', isDarkMode, onBack }) {
  const years = Array.from({ length: 11 }, (_, i) => 2026 - i);

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
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
              isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
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
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
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

// Interactive subject drills with local sample questions and explanations.

function TopicDrillsPage({ selectedSubject, isDarkMode, onBack, onAskAi }) {
  const [activeCategory, setActiveCategory] = useState(selectedSubject || 'All');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const sampleDrills = [
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Quadratic Equations & Polynomials',
      difficulty: 'Medium',
      question: 'Find the roots of the equation x² - 5x + 6 = 0.',
      options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = 6', 'x = 0, x = 5'],
      correctIndex: 0,
      explanation: 'Factor the quadratic expression: (x - 2)(x - 3) = 0. Solving for x yields x = 2 and x = 3.'
    },
    {
      id: 2,
      subject: 'Physics',
      topic: 'Electric Circuits & Ohm\'s Law',
      difficulty: 'Easy',
      question: 'A 12V battery is connected across a 4Ω resistor. What is the current flowing through the circuit?',
      options: ['48 A', '3 A', '0.33 A', '16 A'],
      correctIndex: 1,
      explanation: 'Using Ohm\'s Law (I = V / R): I = 12V / 4Ω = 3 A.'
    },
    {
      id: 3,
      subject: 'Chemistry',
      topic: 'Stoichiometry & Reaction Kinetics',
      difficulty: 'Hard',
      question: 'How many moles of O₂ are required to react completely with 4 moles of Al to form Al₂O₃?',
      options: ['2 moles', '3 moles', '4 moles', '6 moles'],
      correctIndex: 1,
      explanation: 'Balanced equation: 4Al + 3O₂ → 2Al₂O₃. The stoichiometric ratio of Al to O₂ is 4:3, requiring 3 moles of O₂.'
    },
    {
      id: 4,
      subject: 'Computer Science',
      topic: 'Algorithms & Complexity Analysis',
      difficulty: 'Medium',
      question: 'What is the worst-case time complexity of Binary Search on a sorted array of size n?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'Binary Search halves the search space at each step, resulting in logarithmic time complexity O(log n).'
    }
  ];

  const filteredDrills = activeCategory === 'All' 
    ? sampleDrills 
    : sampleDrills.filter(d => d.subject.toLowerCase().includes(activeCategory.toLowerCase()));

  const currentDrill = selectedTopic || filteredDrills[0];

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">
            Interactive Practice
          </span>
          <h2 className="text-2xl font-black mt-2">Topic Drills & Quizzes</h2>
          <p className="text-xs text-slate-400">Master specific subject areas through targeted question sets.</p>
        </div>

        <div className={`flex flex-wrap items-center gap-1.5 p-1 border rounded-xl text-xs font-semibold ${
          isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedTopic(null);
                setUserAnswer(null);
                setShowExplanation(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider opacity-60">Select Topic Drill</h3>
          {filteredDrills.map((drill) => {
            const isSelected = currentDrill.id === drill.id;
            return (
              <div
                key={drill.id}
                onClick={() => {
                  setSelectedTopic(drill);
                  setUserAnswer(null);
                  setShowExplanation(false);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-600/10' 
                    : isDarkMode 
                      ? 'bg-[#141519] border-[#26272E] hover:border-slate-700' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase">{drill.subject}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    drill.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                    drill.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {drill.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-bold">{drill.topic}</h4>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/20 mb-4">
              <span className="text-xs font-bold text-indigo-500">{currentDrill.subject} • {currentDrill.topic}</span>
              <button
                onClick={() => onAskAi(`Help me solve this ${currentDrill.subject} question: "${currentDrill.question}"`)}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-lg cursor-pointer"
              >
                <Bot size={14} />
                <span>Ask AI Tutor</span>
              </button>
            </div>

            <p className="text-sm font-semibold mb-6">{currentDrill.question}</p>

            <div className="space-y-2.5 mb-6">
              {currentDrill.options.map((option, idx) => {
                let btnStyle = isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-white hover:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-500';
                
                if (userAnswer !== null) {
                  if (idx === currentDrill.correctIndex) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-500 font-bold';
                  } else if (userAnswer === idx) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-500 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserAnswer(idx);
                      setShowExplanation(true);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {userAnswer !== null && idx === currentDrill.correctIndex && (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-200 ${
                isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Solution Explanation
                  </span>
                  <button 
                    onClick={() => onAskAi(`Explain this drill solution in detail step-by-step: ${currentDrill.question}`)}
                    className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Bot size={12} /> Get AI Explanation
                  </button>
                </div>
                <p className="text-xs text-slate-400">{currentDrill.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics view for the current prototype metrics.

function AnalyticsPage({ isDarkMode, onBack }) {
  const stats = [
    { label: 'Overall Accuracy', value: '78%', sub: '+4% this week', icon: Target, color: 'text-emerald-500' },
    { label: 'Questions Solved', value: '142', sub: '32 this month', icon: FileText, color: 'text-blue-500' },
    { label: 'Study Hours', value: '18.5 hrs', sub: 'Target: 20 hrs/wk', icon: Clock, color: 'text-purple-500' },
    { label: 'Active Streak', value: '5 Days', sub: 'Personal record', icon: Flame, color: 'text-orange-500' },
  ];

  const subjectProgress = [
    { subject: 'Mathematics', accuracy: 82, completed: 45, color: 'bg-purple-500' },
    { subject: 'Physics', accuracy: 74, completed: 38, color: 'bg-cyan-500' },
    { subject: 'Chemistry', accuracy: 68, completed: 30, color: 'bg-pink-500' },
    { subject: 'Computer Science', accuracy: 88, completed: 29, color: 'bg-emerald-500' },
  ];

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-md">
          Performance Tracking
        </span>
        <h2 className="text-2xl font-black mt-2">Study Analytics & Mastery</h2>
        <p className="text-xs text-slate-400">Track your exam readiness, accuracy trends, and subject performance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold opacity-70">{stat.label}</span>
                <Icon size={18} className={stat.color} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-medium">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`md:col-span-2 p-6 rounded-3xl border space-y-6 ${
          isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              <span>Subject Mastery Breakdown</span>
            </h3>
            <span className="text-[10px] text-slate-400">Based on past questions & drills</span>
          </div>

          <div className="space-y-4">
            {subjectProgress.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>{item.subject}</span>
                  <span className="font-bold font-mono">{item.accuracy}% Accuracy</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#1A1B20]' : 'bg-slate-100'}`}>
                  <div 
                    className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right">{item.completed} Questions Completed</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-3xl border space-y-4 flex flex-col justify-between ${
          isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold">
              <AlertTriangle size={16} />
              <span>Focus Areas Needed</span>
            </div>
            <h4 className="text-sm font-bold">Chemistry Kinetics & Equilibrium</h4>
            <p className="text-xs text-slate-400">
              Your accuracy in Chemistry is currently 68%. Reviewing reaction kinetics past paper questions can boost your score by up to 12%.
            </p>
          </div>

          <button 
            onClick={() => alert("Launching targeted Chemistry drill...")}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <RefreshCw size={14} />
            <span>Practice Recommended Drill</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Full-page practical lab views selected from the navigation menu.

function ChemistryLabPage({ isDarkMode, onBack }) {
  const [addedMl, setAddedMl] = useState(0);
  const ph = Math.min(14, Math.max(1, 1 + (addedMl / 25) * 6));
  const isEquivalence = addedMl >= 24.5 && addedMl <= 25.5;

  const cardBg = isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-pink-500/10 text-pink-500 rounded-md">
            Interactive Practical Lab
          </span>
          <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
            <FlaskConical className="text-pink-500" /> Chemistry Titration Lab
          </h2>
          <p className="text-xs text-slate-400">Simulate Acid-Base titration (0.1M HCl vs 0.1M NaOH) with real-time pH tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border space-y-6 ${cardBg}`}>
          <h3 className="text-sm font-bold">Burette Volume Controls</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Added NaOH Volume:</span>
              <span className="font-mono text-pink-500 text-sm">{addedMl.toFixed(1)} mL</span>
            </div>
            <input 
              type="range" min="0" max="50" step="0.5" 
              value={addedMl} 
              onChange={(e) => setAddedMl(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-200 rounded-lg" 
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setAddedMl((v) => Math.min(50, v + 1))} 
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 transition-colors cursor-pointer"
            >
              + 1.0 mL
            </button>
            <button 
              onClick={() => setAddedMl((v) => Math.min(50, v + 5))} 
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 transition-colors cursor-pointer"
            >
              + 5.0 mL
            </button>
            <button 
              onClick={() => setAddedMl(0)} 
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 text-xs rounded-xl font-bold transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border flex flex-col justify-center items-center text-center space-y-6 ${cardBg}`}>
          <div className="space-y-2">
            <p className="text-xs text-slate-400 uppercase font-bold">Current Solution pH</p>
            <p className={`text-4xl font-black font-mono ${ph > 8 ? 'text-pink-500' : 'text-blue-500'}`}>
              {ph.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400 uppercase font-bold">Indicator Color</p>
            <div 
              className="w-16 h-16 rounded-full mx-auto border-2 border-slate-400/40 transition-colors duration-300 shadow-inner"
              style={{ backgroundColor: ph > 8.2 ? '#EC4899' : 'transparent' }}
            />
          </div>

          {isEquivalence && (
            <p className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 animate-pulse">
              Equivalence Point Reached (~25.0 mL)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PhysicsLabPage({ isDarkMode, onBack }) {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(10);
  const current = (voltage / resistance).toFixed(2);
  const power = (voltage * current).toFixed(1);

  const cardBg = isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-cyan-500/10 text-cyan-500 rounded-md">
          Interactive Practical Lab
        </span>
        <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
          <Atom className="text-cyan-500" /> DC Circuit Simulator (Ohm's Law)
        </h2>
        <p className="text-xs text-slate-400">Adjust circuit voltage and resistance to observe electrical current and power draw.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Voltage (V):</span>
              <span className="font-mono text-cyan-500 text-sm">{voltage} V</span>
            </div>
            <input type="range" min="1" max="24" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Resistance (R):</span>
              <span className="font-mono text-cyan-500 text-sm">{resistance} Ω</span>
            </div>
            <input type="range" min="1" max="100" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 rounded-lg" />
          </div>
        </div>

        <div className={`p-6 rounded-3xl border flex flex-col justify-center items-center text-center space-y-4 ${cardBg}`}>
          <span className="text-xs text-slate-400 font-bold uppercase">Calculated Current (I = V / R)</span>
          <span className="text-5xl font-black font-mono text-cyan-500">{current} A</span>
          <p className="text-xs text-slate-400 pt-2">
            Power Dissipation (P = V × I): <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{power} W</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function CsLabPage({ isDarkMode, onBack }) {
  const [code, setCode] = useState("def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n    return -1\n\nprint(binary_search([1, 3, 5, 7, 9], 7))");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput("Executing Python script...\n>>> Target found at index 3\n>>> Memory used: 12.4 MB\n>>> Execution time: 0.002s");
  };

  const cardBg = isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">
            Interactive Practical Lab
          </span>
          <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
            <Code className="text-emerald-500" /> CS Algorithm Sandbox
          </h2>
          <p className="text-xs text-slate-400">Test algorithm logic, review code structures, and run simulations.</p>
        </div>

        <button onClick={runCode} className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md">
          <Play size={14} />
          <span>Execute Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-3xl border ${cardBg}`}>
          <h3 className="text-xs font-bold mb-2 text-slate-400 uppercase">Code Editor</h3>
          <textarea 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            rows={10} 
            className={`w-full p-4 border rounded-2xl text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none ${
              isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`} 
          />
        </div>

        <div className={`p-4 rounded-3xl border ${cardBg}`}>
          <h3 className="text-xs font-bold mb-2 text-slate-400 uppercase">Console Output</h3>
          <div className={`p-4 border rounded-2xl font-mono text-xs whitespace-pre-line min-h-[220px] ${
            isDarkMode ? 'bg-black/50 border-[#26272E] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            {output || "Click 'Execute Code' to run script output..."}
          </div>
        </div>
      </div>
    </div>
  );
}

function MathLabPage({ isDarkMode, onBack }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);

  const cardBg = isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`min-h-screen p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-md">
          Interactive Practical Lab
        </span>
        <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
          <Calculator className="text-purple-500" /> Quadratic Function Visualizer
        </h2>
        <p className="text-xs text-slate-400">Explore polynomial curves by modifying equation coefficients in y = ax² + bx.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Coefficient (a):</span>
              <span className="font-mono text-purple-500 text-sm">{a}</span>
            </div>
            <input type="range" min="-5" max="5" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Linear Term (b):</span>
              <span className="font-mono text-purple-500 text-sm">{b}</span>
            </div>
            <input type="range" min="-10" max="10" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 rounded-lg" />
          </div>
        </div>

        <div className={`p-6 rounded-3xl border flex flex-col justify-center items-center text-center space-y-4 ${cardBg}`}>
          <span className="text-xs text-slate-400 font-bold uppercase">Calculated Vertex Coordinates</span>
          <span className="text-3xl font-black font-mono text-purple-500">
            ({(-b / (2 * (a || 1))).toFixed(2)}, {(-(b * b) / (4 * (a || 1))).toFixed(2)})
          </span>
          <p className="text-xs text-slate-400 pt-2">
            Parabola Direction: <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{a > 0 ? 'Upward (Minimum)' : a < 0 ? 'Downward (Maximum)' : 'Linear Line'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APPLICATION COMPONENT ---
// Top-level session, theme, navigation, and page composition.

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('pastq_theme') || 'light');
  const isDarkMode = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pastq_theme', theme);
  }, [theme]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getSubjectIcon = (subjectName) => {
    const name = subjectName.toLowerCase();
    if (name.includes('math')) return <Calculator className="w-5 h-5 text-purple-500" />;
    if (name.includes('physic')) return <Atom className="w-5 h-5 text-cyan-500" />;
    if (name.includes('chemist')) return <FlaskConical className="w-5 h-5 text-pink-500" />;
    if (name.includes('computer')) return <Code className="w-5 h-5 text-emerald-500" />;
    return <BookOpen className="w-5 h-5 text-indigo-500" />;
  };

  const getSubjectLabTab = (subjectName) => {
    const name = subjectName.toLowerCase();
    if (name.includes('chemist')) return 'lab-chemistry';
    if (name.includes('physic')) return 'lab-physics';
    if (name.includes('computer')) return 'lab-cs';
    if (name.includes('math')) return 'lab-math';
    return null;
  };

  const navTabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'papers', label: 'Past Papers' },
    { id: 'drills', label: 'Topic Drills' },
    { id: 'saved', label: 'Saved Questions' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const labTabs = [
    { id: 'lab-chemistry', label: 'Chemistry Lab', icon: FlaskConical },
    { id: 'lab-physics', label: 'Physics Lab', icon: Atom },
    { id: 'lab-cs', label: 'CS Sandbox', icon: Code },
    { id: 'lab-math', label: 'Math Visualizer', icon: Calculator },
  ];

  if (currentUser) {
    return (
      <div className={`min-h-screen transition-colors duration-200 pb-12 font-sans ${
        isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Navigation Bar */}
        <header className={`border-b px-4 sm:px-6 py-4 sticky top-0 z-40 transition-colors ${
          isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-600">
                <BookOpen size={22} />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight">PastQ</span>
                <span className="ml-2 text-[10px] bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase border border-blue-500/20">
                  {currentUser.departmentTrack}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center space-x-1 p-1 border rounded-xl text-xs font-semibold ${
              isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'
            }`}>
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Practical Labs Dropdown Menu */}
              <div className="relative group px-1">
                <button 
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab.startsWith('lab-') 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-emerald-500 hover:bg-emerald-500/10'
                  }`}
                >
                  <FlaskConical size={14} />
                  <span>Practical Labs</span>
                </button>

                <div className={`absolute left-0 mt-1 w-48 border rounded-2xl p-2 shadow-xl hidden group-hover:block z-50 animate-in fade-in duration-150 ${
                  isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'
                }`}>
                  {labTabs.map((lab) => {
                    const Icon = lab.icon;
                    return (
                      <button
                        key={lab.id}
                        onClick={() => setActiveTab(lab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                          activeTab === lab.id 
                            ? 'bg-emerald-500/20 text-emerald-500 font-bold' 
                            : isDarkMode ? 'hover:bg-[#1A1B20] text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon size={14} className="text-emerald-500" />
                        <span>{lab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Actions & Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#1A1B20] border-[#26272E] text-amber-400 hover:bg-[#26272E]' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md hover:opacity-90 transition-all cursor-pointer"
              >
                <Bot size={16} />
                <span className="hidden sm:inline">AI Tutor</span>
              </button>

              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2.5 text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden mt-4 pt-4 border-t space-y-2 animate-in slide-in-from-top duration-200 ${
              isDarkMode ? 'border-[#26272E]' : 'border-slate-200'
            }`}>
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode ? 'text-slate-300 hover:bg-[#1A1B20]' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Mobile Practical Labs Section */}
              <div className="pt-2 border-t border-slate-200/20 space-y-1">
                <div className="px-4 py-1 text-[10px] font-extrabold uppercase text-emerald-500 tracking-wider">
                  Practical Labs
                </div>
                {labTabs.map((lab) => {
                  const Icon = lab.icon;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => {
                        setActiveTab(lab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        activeTab === lab.id 
                          ? 'bg-emerald-600 text-white' 
                          : isDarkMode ? 'text-slate-300 hover:bg-[#1A1B20]' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{lab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200/20 flex items-center justify-between px-2">
                <span className="text-xs font-bold opacity-70">{currentUser.nickname} ({currentUser.schoolName})</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-red-500 font-bold py-1 px-3 bg-red-500/10 rounded-lg cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Navigation Routing */}
        {activeTab === 'papers' && (
          <PastQuestionsPage 
            level={currentUser.level || 'O-Level'} 
            subject={selectedSubject} 
            isDarkMode={isDarkMode} 
            onBack={() => setActiveTab('overview')} 
          />
        )}

        {activeTab === 'drills' && (
          <TopicDrillsPage
            selectedSubject={selectedSubject}
            isDarkMode={isDarkMode}
            onBack={() => setActiveTab('overview')}
            onAskAi={(prompt) => {
              setAiPromptInput(prompt);
              setIsAiAssistantOpen(true);
            }}
          />
        )}

        {activeTab === 'saved' && (
          <SavedQuestionsPage
            isDarkMode={isDarkMode}
            onBack={() => setActiveTab('overview')}
            onAskAi={(prompt) => {
              setAiPromptInput(prompt);
              setIsAiAssistantOpen(true);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            isDarkMode={isDarkMode}
            onBack={() => setActiveTab('overview')}
          />
        )}

        {/* Dedicated Lab Pages */}
        {activeTab === 'lab-chemistry' && (
          <ChemistryLabPage isDarkMode={isDarkMode} onBack={() => setActiveTab('overview')} />
        )}

        {activeTab === 'lab-physics' && (
          <PhysicsLabPage isDarkMode={isDarkMode} onBack={() => setActiveTab('overview')} />
        )}

        {activeTab === 'lab-cs' && (
          <CsLabPage isDarkMode={isDarkMode} onBack={() => setActiveTab('overview')} />
        )}

        {activeTab === 'lab-math' && (
          <MathLabPage isDarkMode={isDarkMode} onBack={() => setActiveTab('overview')} />
        )}

        {activeTab === 'overview' && (
          <main className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-200">
            
            <div className={`border rounded-3xl p-6 md:p-8 relative overflow-hidden transition-colors ${
              isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600/10 border border-blue-500/30 text-blue-600 rounded-full text-xs font-semibold">
                    <Sparkles size={14} />
                    <span>Personalized Study Plan Active</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, {currentUser.nickname}!</h1>
                  <p className={`text-xs md:text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Goal: <span className="font-semibold">{currentUser.goal}</span> • Target: <span className="font-semibold">{currentUser.sessionDuration}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsAiAssistantOpen(true)}
                    className="px-5 py-3 bg-indigo-600/10 border border-indigo-500/30 text-indigo-600 hover:bg-indigo-600/20 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Bot size={16} />
                    <span>Ask AI Explanation</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('papers')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    <Play size={16} />
                    <span>Start Mock Exam</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`border p-5 rounded-2xl space-y-1 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center text-xs font-semibold opacity-70">
                  <span>Daily Streak</span>
                  <Flame size={16} className="text-orange-500" />
                </div>
                <div className="text-2xl font-bold">1 Day</div>
                <div className="text-[10px] text-emerald-500 font-medium">Target: {currentUser.sessionDuration}/day</div>
              </div>

              <div className={`border p-5 rounded-2xl space-y-1 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center text-xs font-semibold opacity-70">
                  <span>Active Subjects</span>
                  <BookOpen size={16} className="text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{currentUser.selectedSubjects ? currentUser.selectedSubjects.length : 0}</div>
                <div className="text-[10px] opacity-70">{currentUser.specialty} Specialty</div>
              </div>

              <div className={`border p-5 rounded-2xl space-y-1 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center text-xs font-semibold opacity-70">
                  <span>Practical Labs</span>
                  <FlaskConical size={16} className="text-emerald-500" />
                </div>
                <div className="text-2xl font-bold">4 Pages</div>
                <div className="text-[10px] text-emerald-500 font-medium">Chemistry, Phys, CS, Math</div>
              </div>

              <div className={`border p-5 rounded-2xl space-y-1 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center text-xs font-semibold opacity-70">
                  <span>AI Explanations</span>
                  <Bot size={16} className="text-purple-500" />
                </div>
                <div className="text-2xl font-bold">Active</div>
                <div className="text-[10px] opacity-70">Ready to assist</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider opacity-60">Your Registered Subjects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUser.selectedSubjects && currentUser.selectedSubjects.map((subject) => {
                  const labTab = getSubjectLabTab(subject);
                  return (
                    <div 
                      key={subject}
                      className={`border p-6 rounded-2xl transition-all flex flex-col justify-between space-y-4 ${
                        isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                            isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'
                          }`}>
                            {getSubjectIcon(subject)}
                          </div>
                          {labTab && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                              <FlaskConical size={10} />
                              <span>Lab Supported</span>
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold">{subject}</h3>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                            Past questions, AI explanations, and interactive practical simulations.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/20 flex items-center gap-2">
                        {labTab && (
                          <button
                            onClick={() => setActiveTab(labTab)}
                            className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                          >
                            <FlaskConical size={14} />
                            <span>Open Lab Page</span>
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedSubject(subject);
                            setActiveTab('papers');
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 border cursor-pointer ${
                            isDarkMode 
                              ? 'bg-[#1A1B20] border-[#26272E] hover:bg-blue-600 hover:text-white' 
                              : 'bg-slate-100 border-slate-200 hover:bg-blue-600 hover:text-white text-slate-700'
                          }`}
                        >
                          <span>Explore Papers</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </main>
        )}

        {/* AI Drawer Side Panel */}
        {isAiAssistantOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
            <div className={`w-full max-w-md h-full border-l flex flex-col justify-between p-6 shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#141519] border-[#26272E] text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex justify-between items-center border-b pb-4 border-slate-200/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">PastQ AI Assistant</h3>
                    <p className="text-xs opacity-60">Instant past paper & lab explanations</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiAssistantOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-500/10 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
                <div className={`p-4 rounded-2xl space-y-2 border ${
                  isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'
                }`}>
                  <p className="font-bold text-blue-600 flex items-center space-x-1">
                    <Sparkles size={14} />
                    <span>PastQ AI:</span>
                  </p>
                  <p>
                    {aiPromptInput ? (
                      <>Analyzing your request: <strong className="text-indigo-400">{aiPromptInput}</strong></>
                    ) : (
                      `Hello ${currentUser.nickname}! I can explain past exam solutions or answer questions about your Chemistry, Physics, CS, and Math practical labs.`
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200/20">
                <div className="relative">
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    placeholder="Ask AI a question or formula explanation..."
                    className={`w-full py-3 pl-4 pr-10 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-[#0B0C0E] border-[#26272E] text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button 
                    onClick={() => {
                      if (aiPromptInput.trim()) setAiPromptInput('');
                    }}
                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  if (authMode === 'register') {
    return (
      <OnboardingWizard
        onComplete={(user) => {
          setCurrentUser(user);
          setAuthMode(null);
        }}
        onCancel={() => setAuthMode(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight">PastQ Platform</h1>
        <p className="text-sm text-slate-400">
          Prepare for your exams with past papers, interactive practical labs, custom tracking, and AI study explanations.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => setAuthMode('login')}
            className="px-6 py-2.5 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>

      {authMode === 'login' && (
        <LoginModal
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAuthMode(null);
          }}
          onSwitchToRegister={() => setAuthMode('register')}
          onClose={() => setAuthMode(null)}
        />
      )}
    </div>
  );
}