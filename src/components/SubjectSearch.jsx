import React, { useState, useEffect } from 'react';
// Active paper catalogue and exam workflow: filtering, PDF viewing, timing, grading, and missed-question review.
// Modify paper records for content, filter state for search behavior, and submit/timer handlers for exam rules.
import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, Clock, ArrowLeft, X, 
  ChevronRight, Sparkles, FlaskConical, Atom, Code, Calculator
} from 'lucide-react';

const ALL_SUBJECT_PAPERS = [
  { 
    id: 1, 
    title: 'Financial Accounting Paper 1 (MCQ)', 
    year: '2025 GCE AL', 
    subject: 'Financial Accounting', 
    level: 'A-Level',
    durationMinutes: 10,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  },
  { 
    id: 2, 
    title: 'Chemistry Paper 3 (Practical Lab)', 
    year: '2025 GCE AL', 
    subject: 'Chemistry', 
    level: 'A-Level',
    durationMinutes: 45,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  },
  { 
    id: 3, 
    title: 'Physics Paper 3 (Practical Electricity)', 
    year: '2025 GCE AL', 
    subject: 'Physics', 
    level: 'A-Level',
    durationMinutes: 45,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  },
  { 
    id: 4, 
    title: 'Computer Science Paper 3 (Practical Coding)', 
    year: '2025 GCE AL', 
    subject: 'Computer Science', 
    level: 'A-Level',
    durationMinutes: 60,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  },
  { 
    id: 5, 
    title: 'Mathematics Paper 2 (Calculus & Functions)', 
    year: '2025 GCE AL', 
    subject: 'Mathematics', 
    level: 'A-Level',
    durationMinutes: 60,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  }
];

export default function SubjectSearch({ userData, activeLevel = null, onBackToDashboard }) {
  const userSubjects = userData?.selectedSubjects?.length > 0 
    ? userData.selectedSubjects 
    : ['Financial Accounting', 'Chemistry', 'Physics', 'Computer Science', 'Mathematics'];

  const [selectedLevel, setSelectedLevel] = useState(activeLevel);
  const [selectedSubject, setSelectedSubject] = useState(userSubjects[0]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedLevel(activeLevel);
  }, [activeLevel]);

  const handleBack = () => {
    setSelectedLevel(null);
    if (typeof onBackToDashboard === 'function') {
      onBackToDashboard();
    }
  };

  const subjectPapers = ALL_SUBJECT_PAPERS.filter((paper) => {
    const matchesLevel = selectedLevel ? paper.level === selectedLevel : true;
    const matchesSubject = paper.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white p-4 md:p-8 font-sans pb-32">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center space-x-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-[#141519] border border-transparent hover:border-[#26272E]"
          >
            <ArrowLeft size={16} />
            <span className="font-semibold">Back to Dashboard</span>
          </button>

          {selectedLevel && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#A1A1AA]">Active Filter:</span>
              <span className="text-xs font-bold bg-[#2F66F6]/20 border border-[#2F66F6]/40 text-[#2F66F6] px-3 py-1 rounded-lg flex items-center space-x-1.5">
                <span>{selectedLevel}</span>
                <button 
                  type="button"
                  onClick={() => setSelectedLevel(null)} 
                  className="hover:text-white cursor-pointer ml-1 text-[#A1A1AA]"
                >
                  <X size={14} />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Level Cards (Only rendered when no level filter active) */}
        {!selectedLevel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedLevel('O-Level')}
              className="p-4 rounded-2xl bg-[#141519] border border-[#26272E] hover:border-[#3F404A] transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">O-Level</h3>
                  <p className="text-[11px] text-[#A1A1AA]">Independent Syllabus</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#A1A1AA]" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedLevel('A-Level')}
              className="p-4 rounded-2xl bg-[#141519] border border-[#26272E] hover:border-[#3F404A] transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-400">A-Level</h3>
                  <p className="text-[10px] text-emerald-600">Advanced Syllabus</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#A1A1AA]" />
            </button>
          </div>
        )}

        {/* Subject Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {userSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center space-x-1.5 ${
                selectedSubject === subject
                  ? 'bg-[#2F66F6] border-[#2F66F6] text-white'
                  : 'bg-[#141519] border-[#26272E] text-[#A1A1AA] hover:text-white'
              }`}
            >
              {subject === 'Chemistry' && <FlaskConical size={14} />}
              {subject === 'Physics' && <Atom size={14} />}
              {subject === 'Computer Science' && <Code size={14} />}
              {subject === 'Mathematics' && <Calculator size={14} />}
              <span>{subject}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder={`Search ${selectedSubject} past papers...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141519] border border-[#26272E] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#2F66F6]"
          />
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectPapers.length > 0 ? (
            subjectPapers.map((paper) => (
              <div key={paper.id} className="bg-[#141519] border border-[#26272E] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span className="text-[10px] font-bold uppercase text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded-full border border-[#D97706]/20">
                    {paper.year}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{paper.durationMinutes} mins</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{paper.title}</h3>

                <div className="flex items-center justify-between pt-3 border-t border-[#26272E]">
                  <button
                    type="button"
                    className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#2F66F6] hover:bg-[#1E52E0] px-4 py-2 rounded-xl transition-all shadow-md shadow-[#2F66F6]/20 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Start Exam</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-[#A1A1AA] text-xs">
              No papers found for {selectedSubject} under {selectedLevel || 'all levels'}.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}