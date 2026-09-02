// Seven-step profile setup that collects the information used to personalize the dashboard.
// Seven-step profile setup that collects the information used to personalize the dashboard.
// Modify step definitions and validation here; submit profile persistence through utils/auth.js.
import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, BookOpen, 
  GraduationCap, Target, Clock, AlertCircle, X 
} from 'lucide-react';
import { registerUser } from '../utils/auth';

const TOTAL_STEPS = 7;

export default function OnboardingWizard({ onComplete, onCancel }) {
  // The wizard retains all fields while moving between screens, allowing users to revise earlier answers.
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  // 7-Step Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    departmentTrack: 'Science', // 'Science' | 'Arts' | 'Commercial'
    specialty: '',
    selectedSubjects: [],
    goal: 'Solve Past Papers',
    sessionDuration: '20 min',
  });

  // Generic field updater keeps every controlled input synchronized with the single profile draft.
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  // Subject selection is set-like: clicking an existing subject removes it, otherwise it is appended.
  const toggleSubject = (subject) => {
    setFormData((prev) => {
      const exists = prev.selectedSubjects.includes(subject);
      return {
        ...prev,
        selectedSubjects: exists
          ? prev.selectedSubjects.filter((s) => s !== subject)
          : [...prev.selectedSubjects, subject],
      };
    });
    setErrorMessage('');
  };

  // Validate only the fields required by the current screen before advancing or registering.
  const handleNext = () => {
    setErrorMessage('');

    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim()) {
        setErrorMessage('Please provide your full name and email address.');
        return;
      }
    }

    if (step === 2) {
      if (!formData.password) {
        setErrorMessage('Please enter a password.');
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    if (step === 3) {
      if (!formData.schoolName.trim()) {
        setErrorMessage('Please enter your school name.');
        return;
      }
    }

    if (step === 4) {
      if (!formData.specialty.trim()) {
        setErrorMessage('Please specify your specialty (e.g. S1, Upper Sixth, etc.).');
        return;
      }
    }

    if (step === 5) {
      if (formData.selectedSubjects.length === 0) {
        setErrorMessage('Please select at least one subject to continue.');
        return;
      }
    }

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    } else {
      // Final Submission: Step 7
      const result = registerUser({
        name: formData.fullName,
        nickname: formData.nickname || formData.fullName.split(' ')[0],
        email: formData.email,
        password: formData.password,
        schoolName: formData.schoolName,
        departmentTrack: formData.departmentTrack,
        specialty: formData.specialty,
        selectedSubjects: formData.selectedSubjects,
        goal: formData.goal,
        sessionDuration: formData.sessionDuration,
      });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      onComplete(result.user);
    }
  };

  // Back navigation changes only the step and clears an old validation message.
  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Track-specific options make the subject screen responsive to the earlier academic choice.
  const subjectOptions = {
    Science: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Further Math'],
    Arts: ['English Language', 'Literature in English', 'History', 'Geography', 'French', 'Philosophy'],
    Commercial: ['Accounting', 'Economics', 'Commerce', 'Management', 'Costing', 'Business Law'],
  };

  // The render contains stable chrome plus one conditional step body at a time.
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl bg-[#141519] border border-[#26272E] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative">
        
        {/* Header identifies the flow and exposes cancellation without losing the dashboard session. */}
        <div className="flex items-center justify-between pb-4 border-b border-[#26272E]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2F66F6]/10 border border-[#2F66F6]/30 rounded-xl flex items-center justify-center text-[#2F66F6]">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Student Registration
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1B20] border border-[#26272E] rounded-xl transition-all"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress reflects the one-based step number as both text and a proportional bar. */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#A1A1AA]">Step {step} of {TOTAL_STEPS}</span>
            <span className="font-semibold text-[#2F66F6]">
              {Math.round((step / TOTAL_STEPS) * 100)}% Completed
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1A1B20] rounded-full overflow-hidden border border-[#26272E]">
            <div
              className="h-full bg-[#2F66F6] transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Validation errors are rendered above the step so they remain visible after any failed advance. */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2 text-red-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Exactly one of the seven step panels is mounted according to `step`. */}
        <div className="space-y-4 py-2">
          
          {/* STEP 1 collects the identity fields used for the profile and greeting. */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Let's get to know you</h2>
                <p className="text-xs text-[#A1A1AA]">Enter your basic contact information.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Nkem"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Preferred Nickname (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Johnny"
                    value={formData.nickname}
                    onChange={(e) => updateField('nickname', e.target.value)}
                    className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 collects and confirms the prototype password before account creation. */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Set your password</h2>
                <p className="text-xs text-[#A1A1AA]">Secure your PastQ account and progress.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 captures school context for future paper personalization. */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Where do you study?</h2>
                <p className="text-xs text-[#A1A1AA]">We customize past paper suggestions based on your school.</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">School Name</label>
                <input
                  type="text"
                  placeholder="e.g. GBHS Yaoundé, CCAST Bambili"
                  value={formData.schoolName}
                  onChange={(e) => updateField('schoolName', e.target.value)}
                  className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                />
              </div>
            </div>
          )}

          {/* STEP 4 chooses a department and records the student's class or specialty. */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Academic Track & Specialty</h2>
                <p className="text-xs text-[#A1A1AA]">Choose your department focus.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Department Track</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {['Science', 'Arts', 'Commercial'].map((track) => (
                      <button
                        key={track}
                        type="button"
                        onClick={() => updateField('departmentTrack', track)}
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          formData.departmentTrack === track
                            ? 'bg-[#2F66F6]/10 border-[#2F66F6] text-[#2F66F6]'
                            : 'bg-[#1A1B20] border-[#26272E] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Specialty / Class Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Upper Sixth Science (S1)"
                    value={formData.specialty}
                    onChange={(e) => updateField('specialty', e.target.value)}
                    className="w-full px-4 py-2.5 mt-1 bg-[#1A1B20] border border-[#26272E] rounded-xl text-xs text-white focus:outline-none focus:border-[#2F66F6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 toggles the track's subject list and requires at least one selection. */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Select Your Registered Subjects</h2>
                <p className="text-xs text-[#A1A1AA]">Pick the subjects you are preparing for in the GCE/exams.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(subjectOptions[formData.departmentTrack] || subjectOptions.Science).map((subj) => {
                  const isSelected = formData.selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#2F66F6]/10 border-[#2F66F6] text-white'
                          : 'bg-[#1A1B20] border-[#26272E] text-[#A1A1AA] hover:border-[#26272E]/80'
                      }`}
                    >
                      <span className="truncate mr-1">{subj}</span>
                      {isSelected && <Check size={14} className="text-[#2F66F6] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6 records the learning outcome the dashboard should emphasize. */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">What is your main target?</h2>
                <p className="text-xs text-[#A1A1AA]">Select your primary goal on PastQ.</p>
              </div>
              <div className="space-y-2">
                {[
                  'Solve Past Papers',
                  'Topic-by-Topic Revision',
                  'Timed Exam Mock Simulations',
                  'Identify Weak Points'
                ].map((targetGoal) => (
                  <button
                    key={targetGoal}
                    type="button"
                    onClick={() => updateField('goal', targetGoal)}
                    className={`w-full p-3.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                      formData.goal === targetGoal
                        ? 'bg-[#2F66F6]/10 border-[#2F66F6] text-white'
                        : 'bg-[#1A1B20] border-[#26272E] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <span>{targetGoal}</span>
                    {formData.goal === targetGoal && <Sparkles size={16} className="text-[#2F66F6]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7 records a daily commitment and provides the final registration action. */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Daily Study Commitment</h2>
                <p className="text-xs text-[#A1A1AA]">How long do you plan to practice each day?</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['15 min', '20 min', '45 min', '1 hour', '2 hours', '3+ hours'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => updateField('sessionDuration', dur)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all ${
                      formData.sessionDuration === dur
                        ? 'bg-[#2F66F6]/10 border-[#2F66F6] text-[#2F66F6]'
                        : 'bg-[#1A1B20] border-[#26272E] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Navigation controls are shared by every step; Continue becomes submission on step seven. */}
        <div className="pt-4 border-t border-[#26272E] flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 bg-[#1A1B20] border border-[#26272E] disabled:opacity-30 rounded-xl text-xs font-semibold text-white hover:border-[#2F66F6]/50 transition-all flex items-center space-x-1"
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 bg-[#2F66F6] hover:bg-[#1E52E0] text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1 shadow-lg shadow-[#2F66F6]/20"
          >
            <span>{step === TOTAL_STEPS ? 'Complete & Launch' : 'Continue'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}