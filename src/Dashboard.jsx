// Student home screen: summarize the profile and expose the subjects selected during onboarding.
import React from 'react';
import { 
  User, BookOpen, Clock, Target, Award, LogOut, 
  Layers, Sparkles, CheckCircle, ChevronRight, Calendar 
} from 'lucide-react';
import { Button } from './components/Button';
import { ChipTag } from './components/ChipTag';

export default function Dashboard({ userData, onLogout }) {
  // Extract user values with safe fallbacks
  const name = userData?.name || userData?.fullName || 'Student';
  const nickname = userData?.nickname || name.split(' ')[0];
  const track = userData?.departmentTrack || 'General';
  const specialty = userData?.specialty || 'General Studies';
  const goal = userData?.goal || 'Solve Past Papers';
  const targetTime = userData?.sessionDuration || '20 min';
  const subjects = userData?.selectedSubjects || [];
  const school = userData?.schoolName || 'Cameroon Secondary School';

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-[#26272E] bg-[#141519] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-[#2F66F6]/10 border border-[#2F66F6]/30 rounded-xl flex items-center justify-center text-[#2F66F6]">
            <BookOpen size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wider uppercase block">PastQ</span>
            <span className="text-[10px] text-[#A1A1AA]">{track} Track</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-[#1A1B20] border border-[#26272E] px-3 py-1.5 rounded-xl text-xs">
            <User size={14} className="text-[#2F66F6]" />
            <span className="font-medium text-white">{nickname}</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Profile Hero Header */}
        <div className="bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#2F66F6]/10 border border-[#2F66F6]/30 text-[#2F66F6]">
                {track} Department
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706]">
                {specialty}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Welcome back, {nickname}! 👋
              </h1>
              <p className="text-xs text-[#A1A1AA] mt-1">
                {school} • Goal: <span className="text-white font-semibold">{goal}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141519] border border-[#26272E] p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 bg-[#1A1B20] border border-[#26272E] rounded-xl text-[#2F66F6]">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Session Target</span>
              <p className="text-sm font-bold text-white">{targetTime}</p>
            </div>
          </div>

          <div className="bg-[#141519] border border-[#26272E] p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 bg-[#1A1B20] border border-[#26272E] rounded-xl text-[#D97706]">
              <Target size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Active Goal</span>
              <p className="text-sm font-bold text-white truncate max-w-[150px]">{goal}</p>
            </div>
          </div>

          <div className="bg-[#141519] border border-[#26272E] p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 bg-[#1A1B20] border border-[#26272E] rounded-xl text-emerald-400">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Registered Subjects</span>
              <p className="text-sm font-bold text-white">{subjects.length} Enrolled</p>
            </div>
          </div>
        </div>

        {/* Dynamic Subject Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen size={18} className="text-[#2F66F6]" />
              <span>Your Registered Subjects</span>
            </h2>
            <span className="text-xs text-[#A1A1AA]">{subjects.length} selected</span>
          </div>

          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((subject, idx) => (
                <div 
                  key={idx}
                  className="bg-[#141519] border border-[#26272E] hover:border-[#2F66F6]/50 p-5 rounded-2xl transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-[#1A1B20] border border-[#26272E] rounded-xl text-[#2F66F6] group-hover:scale-105 transition-transform">
                      <Sparkles size={16} />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      GCE Ready
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#2F66F6] transition-colors">
                      {subject}
                    </h3>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5">Past questions & solutions ready</p>
                  </div>

                  <div className="pt-3 border-t border-[#26272E] flex items-center justify-between text-xs text-[#2F66F6] font-semibold">
                    <span>Start Practice</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-[#141519] border border-[#26272E] rounded-2xl text-center space-y-2">
              <p className="text-xs text-[#A1A1AA]">No subjects selected during registration.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}