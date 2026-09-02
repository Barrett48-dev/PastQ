// Smart AI conversation prototype with local messages and simulated replies.
// Replace the mock response path here with an API client, including loading and error states at this boundary.
import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, AlertCircle } from 'lucide-react';

export default function AskAIPage({ isDarkMode, onBack }) {
  return (
    <div className={`min-h-screen p-6 max-w-3xl mx-auto flex flex-col justify-between ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black">Smart AI Tutor</h2>
            <p className="text-xs text-slate-400">Get step-by-step solutions & concept explanations</p>
          </div>
        </div>

        {/* Inactive Alert Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span><strong>AI Standby:</strong> AI response capabilities will activate as soon as the API key is connected. You can preview the chat interface below.</span>
        </div>
      </div>

      {/* Chat Bar (Disabled) */}
      <div className="mt-8 relative">
        <input 
          disabled 
          type="text" 
          placeholder="AI is currently inactive (API Key Pending)..."
          className={`w-full p-4 pr-12 rounded-2xl text-xs border opacity-60 cursor-not-allowed ${
            isDarkMode ? 'bg-[#141519] border-[#26272E] text-slate-400' : 'bg-slate-200 border-slate-300'
          }`}
        />
        <button disabled className="absolute right-3 top-3 p-2 bg-indigo-600/50 text-white rounded-xl cursor-not-allowed">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}