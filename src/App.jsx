import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import PracticalLab from './PracticalLab';
import PracticeExam from './components/PracticeExam';
import MyProgress from './components/MyProgress';
import { SavedQuestions } from './components/SavedQuestions';
import SmartAI from './components/SmartAI';
import StudyPlan from './components/StudyPlan';
import AuthModal from './components/AuthModal';
import OnboardingWizard from './components/OnboardingWizard';

// MainApp is the application shell: it owns persistent preferences, session state,
// modal visibility, and the route table, while feature screens own their local UI state.
function MainApp() {
  // Initialize the theme from browser storage so a refresh preserves the student's choice.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('pastq_theme');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  // Restore the last authenticated profile; a missing record means the dashboard is guest-mode.
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('pastq_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // These flags decide whether the login overlay or the full-screen registration flow is visible.
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  const navigate = useNavigate();

  // Flip the theme, persist it immediately, and let the effect below synchronize the DOM class.
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      localStorage.setItem('pastq_theme', JSON.stringify(nextTheme));
      return nextTheme;
    });
  };

  // Tailwind's dark/light variants read these classes from the document root.
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Convert dashboard action identifiers into URLs and carry optional context to the destination.
  const handleNavigate = (actionId, state = {}) => {
    const routeMap = {
      'past-questions': '/practice',
      'smart-ai': '/ai-tutor',
      'practice-exam': '/practice',
      'my-progress': '/progress',
      'saved': '/saved',
      'study-plan': '/study-plan',
      'practical-lab': '/lab',
      'achievements': '/progress'
    };
    const targetPath = routeMap[actionId] || actionId;
    navigate(targetPath, { state });
  };

  // Clear both React state and the persisted profile so the next visit starts signed out.
  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('pastq_user');
  };

  // Registration and login share this callback so both flows establish the same session shape.
  const handleAuthSuccess = (user) => {
    setUserData(user);
    localStorage.setItem('pastq_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    setIsOnboarding(false);
  };

  // Render Onboarding Wizard as full screen when registering
  if (isOnboarding) {
    return (
      <OnboardingWizard 
        onComplete={handleAuthSuccess}
        onCancel={() => setIsOnboarding(false)}
      />
    );
  }

  // Routes render the primary screens; the auth modal is mounted alongside them so it can overlay any route.
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme}
              userData={userData}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          } 
        />
        <Route path="/practice" element={<PracticeExam isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />
        <Route path="/lab" element={<PracticalLab isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />
        <Route path="/progress" element={<MyProgress isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />
        <Route path="/saved" element={<SavedQuestions isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />
        <Route path="/study-plan" element={<StudyPlan isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />
        <Route path="/ai-tutor" element={<SmartAI isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />
        <Route path="*" element={<Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} userData={userData} onOpenAuth={() => setIsAuthModalOpen(true)} onLogout={handleLogout} onNavigate={handleNavigate} />} />
      </Routes>

      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          isDarkMode={isDarkMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          onStartSignup={() => {
            setIsAuthModalOpen(false);
            setIsOnboarding(true);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  // BrowserRouter supplies navigation context to MainApp and keeps URL changes client-side.
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}