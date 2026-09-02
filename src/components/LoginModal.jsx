// src/components/LoginModal.jsx
import React, { useState } from 'react';
// Compact login modal used by the newer shell; it owns form feedback and delegates credential lookup to auth.js.
// Modify controls and validation here, not the shared browser-storage implementation.
import { BookOpen, AlertCircle, X, LogIn } from 'lucide-react';
import { loginUser } from '../utils/auth';

export default function LoginModal({ onLoginSuccess, onSwitchToRegister, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const result = loginUser(email, password);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    onLoginSuccess(result.user);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#26272E]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2F66F6]/10 border border-[#2F66F6]/30 rounded-xl flex items-center justify-center text-[#2F66F6]">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Welcome Back
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1B20] border border-[#26272E] rounded-xl transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-white">Log in to PastQ</h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Access your personalized dashboard and revision materials.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2 text-red-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#2F66F6] hover:bg-[#1E52E0] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#2F66F6]/20"
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-4 border-t border-[#26272E] text-center text-xs text-[#A1A1AA]">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#2F66F6] hover:underline font-semibold"
          >
            Create one here
          </button>
        </div>

      </div>
    </div>
  );
}