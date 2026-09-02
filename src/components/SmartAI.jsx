// Dashboard entry/placeholder for the Smart AI experience.
// Modify the launcher here; message generation and conversation state belong in AskAIPage.jsx.
import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, Bot, User } from 'lucide-react';

export default function SmartAI({ isDarkMode = false, onBack }) {
  // Conversation state is local and intentionally simulates a response until an AI service is connected.
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am Smart AI. Ask me to break down any past paper question, explain a complex topic, or solve a formula step-by-step.' }
  ]);

  // Append the user's message immediately, then append a delayed deterministic demo response.
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `Here is the explanation for: "${input}". To solve this, identify the core formula, substitute the given variables, and evaluate step-by-step.` 
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  // The page keeps the transcript above a persistent composer so the latest question is always actionable.
  return (
    <div className={`min-h-screen font-sans flex flex-col ${isDarkMode ? 'bg-[#0B0C0E] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Sticky header preserves route context while the transcript scrolls. */}
      <header className={`px-6 py-4 flex items-center space-x-3 border-b sticky top-0 z-20 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200'}`}>
        <button onClick={onBack} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-100 border-slate-200'}`}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-sm font-black flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" /> Ask Smart AI
          </h1>
          <p className="text-[10px] text-slate-400">Instant explanations & study assistance</p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col justify-between">
        {/* Messages are rendered in chronological order and aligned by sender. */}
        <div className="space-y-4 mb-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-xs sm:max-w-md text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : isDarkMode ? 'bg-[#141519] border border-[#26272E] text-slate-200' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Controlled composer prevents empty submissions and clears after a message is queued. */}
        <form onSubmit={handleSend} className={`p-2 rounded-2xl border flex items-center gap-2 ${isDarkMode ? 'bg-[#141519] border-[#26272E]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <input
            type="text"
            placeholder="Type your question or past paper doubt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 p-3 bg-transparent text-xs focus:outline-none ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'}`}
          />
          <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
            <Send size={16} />
          </button>
        </form>
      </main>
    </div>
  );
}