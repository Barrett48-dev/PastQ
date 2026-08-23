// Root component: restores a session and switches between auth, onboarding, and study views.
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './Dashboard';
import { getActiveSession, logoutUser } from './utils/auth';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [viewState, setViewState] = useState('auth'); // 'auth' | 'onboarding' | 'dashboard'
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore session on app startup
  useEffect(() => {
    const activeUser = getActiveSession();
    
    if (activeUser) {
      setCurrentUser(activeUser);
      setViewState('dashboard');
    }

    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setViewState('dashboard');
  };

  const handleStartSignUp = () => {
    setViewState('onboarding');
  };

  const handleOnboardingComplete = (newUser) => {
    setCurrentUser(newUser);
    setViewState('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setViewState('auth');
  };

  // Loading screen while checking session storage
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#2F66F6]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E]">
      {viewState === 'auth' && (
        <Auth 
          onLoginSuccess={handleLoginSuccess} 
          onStartSignUp={handleStartSignUp} 
        />
      )}

      {viewState === 'onboarding' && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onCancel={() => setViewState('auth')} 
        />
      )}

      {viewState === 'dashboard' && (
        <Dashboard 
          userData={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}