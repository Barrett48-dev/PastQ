// Combined sign-in and sign-up modal retained for flows that need one auth surface.
import React, { useState } from 'react';
import { Mail, Lock, User, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { loginUser, registerUser } from '../utils/auth';

export default function AuthModal({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    selectedSubjects: ['Financial Accounting', 'Economics']
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email || !formData.password || (isSignUp && !formData.name)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      const result = registerUser(formData);
      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }
      // Auto login after successful sign up
      const loginRes = loginUser(formData.email, formData.password);
      if (loginRes.success) onAuthSuccess(loginRes.user);
    } else {
      const result = loginUser(formData.email, formData.password);
      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }
      onAuthSuccess(result.user);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        
        {/* Toggle Header */}
        <div className="flex bg-[#1A1B20] p-1 rounded-2xl border border-[#26272E]">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isSignUp ? 'bg-[#2F66F6] text-white' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isSignUp ? 'bg-[#2F66F6] text-white' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-xl font-black text-white">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            {isSignUp ? 'Enter your details to register and save progress.' : 'Sign in to access your saved exams and flashcards.'}
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#A1A1AA]">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#2F66F6]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#A1A1AA]">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#2F66F6]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#A1A1AA]">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#2F66F6]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2F66F6] hover:bg-[#1E52E0] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#2F66F6]/20 mt-2"
          >
            <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}