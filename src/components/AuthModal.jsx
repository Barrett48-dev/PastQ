import React, { useState } from 'react';
// Modal authentication surface for login and signup modes; storage and credential rules remain in utils/auth.js.
// Modify mode-specific fields and callbacks here, then keep App.jsx responsible for session-level state.
import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { loginUser } from '../utils/auth';

export default function AuthModal({ 
  isOpen, 
  mode = 'login', 
  isDarkMode = true, 
  onClose, 
  onSuccess, 
  onStartSignup 
}) {
  // The modal keeps transient credentials and errors local; App receives only a successful user object.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Avoid mounting the overlay at all when the parent has closed it.
  if (!isOpen) return null;

  // Validate the two required fields, delegate credential lookup, and report failures inline.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const result = loginUser(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    onSuccess(result.user);
  };

  // The overlay uses the shared theme flag to keep the modal readable over either dashboard theme.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#141519] border-[#26272E] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal heading and close control. */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Welcome Back to PastQ</h3>
            <p className="text-xs text-slate-400 mt-1">Sign in to access your saved questions & lab history</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Credential form: browser-required fields provide a second validation layer. */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-400">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDarkMode ? 'bg-[#1A1B20] border-[#26272E] focus:border-[#2F66F6]' : 'bg-slate-50 border-slate-200 focus:border-[#2F66F6]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-400">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDarkMode ? 'bg-[#1A1B20] border-[#26272E] focus:border-[#2F66F6]' : 'bg-slate-50 border-slate-200 focus:border-[#2F66F6]'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#2F66F6] hover:bg-[#1E52E0] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#2F66F6]/20"
          >
            Sign In
          </button>
        </form>

        {/* Registration link returns control to the parent onboarding flow. */}
        <div className="mt-6 pt-4 border-t border-slate-800/50 text-center text-xs text-slate-400">
          <p>
            Don't have an account?{' '}
            <button 
              onClick={onStartSignup} 
              className="text-[#2F66F6] font-semibold hover:underline ml-1"
            >
              Start 7-Step Setup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}