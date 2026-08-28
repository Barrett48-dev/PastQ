// Login screen for returning students; account creation is handled by the onboarding wizard.
import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginUser } from './utils/auth';

export default function Auth({ onLoginSuccess, onStartSignUp }) {
  // Form state is local because the parent only needs the authenticated profile after validation succeeds.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Prevent a browser navigation, validate required fields, then perform the storage-backed login asynchronously.
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Field-level check
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Validate credentials against stored registered accounts
    setTimeout(() => {
      const result = loginUser(email, password, rememberMe);

      if (!result.success) {
        setErrorMessage(result.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      // On success, pass the full user profile to App.jsx
      onLoginSuccess(result.user);
    }, 300);
  };

  // The screen is split into brand context, validation feedback, credentials, and the signup handoff.
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Brand header establishes the product context before asking for credentials. */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#2F66F6]/10 border border-[#2F66F6]/30 rounded-2xl mx-auto flex items-center justify-center text-[#2F66F6]">
            <BookOpen size={24} />
          </div>
          <span className="inline-block text-[10px] font-bold tracking-widest text-[#2F66F6] uppercase bg-[#2F66F6]/10 px-2.5 py-1 rounded-full border border-[#2F66F6]/20">
            PastQ Exam Prep
          </span>
          <h1 className="text-2xl font-extrabold text-white">Log In</h1>
          <p className="text-xs text-[#A1A1AA]">
            Enter your credentials to access your saved papers and progress.
          </p>
        </div>

        {/* A single alert region reports either client-side validation or authentication failure. */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2 text-red-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login form controls credentials and disables duplicate submissions while storage is checked. */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-[#1A1B20] border rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none transition-all ${
                  errorMessage ? 'border-red-500/50' : 'border-[#26272E] focus:border-[#2F66F6]'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                className={`w-full pl-10 pr-10 py-2.5 bg-[#1A1B20] border rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none transition-all ${
                  errorMessage ? 'border-red-500/50' : 'border-[#26272E] focus:border-[#2F66F6]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me is retained as form state for the authentication contract. */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-[#A1A1AA] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-[#1A1B20] border-[#26272E] text-[#2F66F6] focus:ring-0 accent-[#2F66F6]"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#2F66F6] hover:bg-[#1E52E0] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#2F66F6]/20 mt-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Signup handoff leaves login state untouched and lets the parent open onboarding. */}
        <div className="pt-4 border-t border-[#26272E] text-center space-y-2">
          <p className="text-xs text-[#A1A1AA]">Don't have an account yet?</p>
          <button
            type="button"
            onClick={onStartSignUp}
            className="w-full py-2.5 bg-[#1A1B20] border border-[#26272E] hover:border-[#2F66F6]/50 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5"
          >
            <Sparkles size={14} className="text-[#D97706]" />
            <span>Create New Account (Sign Up)</span>
          </button>
        </div>

      </div>
    </div>
  );
}