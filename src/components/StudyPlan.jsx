import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Plus, CheckCircle2, Circle, 
  Clock, BookOpen, Flame, Sparkles, Filter, Trash2
} from 'lucide-react';

export default function StudyPlan({ isDarkMode = false, onBack }) {
  // The selected filter controls which subset of the in-memory task list is rendered.
  const [activeFilter, setActiveFilter] = useState('all');

  // Seed tasks make the planning workflow usable before a persistence layer exists.
  const [tasks, setTasks] = useState([
    { id: 1, subject: 'Mathematics', title: 'Solve 2021 Paper 2 Calculus section', time: '09:00 AM', completed: true, category: 'O-Level' },
    { id: 2, subject: 'Physics', title: 'Complete Projectile Motion Virtual Lab', time: '11:30 AM', completed: true, category: 'A-Level' },
    { id: 3, subject: 'Computer Sci.', title: 'Practice Functions & Algorithms in JS', time: '02:00 PM', completed: false, category: 'A-Level' },
    { id: 4, subject: 'Chemistry', title: 'Review Organic Reaction Mechanisms', time: '04:30 PM', completed: false, category: 'O-Level' },
    { id: 5, subject: 'Biology', title: 'Memorize Genetics vocabulary deck', time: '07:00 PM', completed: false, category: 'A-Level' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Mathematics');

  // Toggle only the matching task so the progress summary recalculates from the new list.
  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Convert the compact form into a task record with a generated client-side identifier.
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      subject: newTaskSubject,
      title: newTaskTitle,
      time: '08:00 PM',
      completed: false,
      category: 'General'
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Remove a task by identity; derived counts and filtered output update on the next render.
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Apply the active tab without mutating the source list, preserving all tasks for later filters.
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'pending') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  // Summary values are derived rather than separately stored, preventing stale progress percentages.
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* Header navigation provides the only route-level action on this focused workspace. */}
      <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight flex items-center gap-2">
              <Calendar className="text-emerald-500" size={18} />
              Personalized Study Plan
            </h1>
            <p className="text-[10px] text-slate-400">Manage your daily targets & exam countdowns</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-24">
        
        {/* These compact metrics summarize streak, current workload, and the demo exam countdown. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border flex items-center space-x-4 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Flame size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Current Streak</span>
              <h3 className="text-xl font-black">5 Days 🔥</h3>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border flex items-center space-x-4 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Today's Progress</span>
              <h3 className="text-xl font-black">{completedCount} of {tasks.length} Completed</h3>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border flex items-center space-x-4 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Next Exam</span>
              <h3 className="text-xl font-black text-indigo-500">24 Days Left</h3>
            </div>
          </div>
        </div>

        {/* Progress visualizes the ratio of completed tasks to the current task collection. */}
        <div className={`p-5 rounded-3xl border space-y-2 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Daily Goal Completion</span>
            <span className="text-emerald-500">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* The controlled form creates a new objective without leaving the study-plan route. */}
        <form onSubmit={handleAddTask} className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-3 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <select
            value={newTaskSubject}
            onChange={(e) => setNewTaskSubject(e.target.value)}
            className={`p-2.5 rounded-xl border text-xs font-bold focus:outline-none ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Sci.">Computer Sci.</option>
          </select>

          <input
            type="text"
            placeholder="Add a new study objective..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className={`flex-1 p-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
          />

          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all"
          >
            <Plus size={16} />
            <span>Add Goal</span>
          </button>
        </form>

        {/* Filter tabs change only the visible task subset. */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Schedule Objectives</h3>
          <div className="flex space-x-2">
            {['all', 'pending', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-emerald-600 text-white'
                    : isDarkMode ? 'bg-[#141519] text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* The list has explicit empty and populated states, with per-task completion and delete actions. */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center text-xs text-slate-400 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
              No tasks found in this section.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  task.completed 
                    ? isDarkMode ? 'bg-[#141519]/50 border-[#26272E] opacity-60' : 'bg-slate-50/70 border-slate-200 opacity-70'
                    : isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="text-emerald-500 hover:scale-110 transition-transform"
                  >
                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-slate-400" />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {task.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {task.time}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}