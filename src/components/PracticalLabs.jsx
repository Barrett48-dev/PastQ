import React, { useState } from 'react';
// Practical learning experiments: code execution feedback and projectile-motion calculation.
// Modify lab choices and calculation handlers here; Dashboard.jsx owns entry placement.
import React, { useState } from 'react';
import { FlaskConical, Atom, Code, Calculator, Play, X } from 'lucide-react';

function ChemistryLab({ isDarkMode }) {
  const [addedMl, setAddedMl] = useState(0);
  const ph = Math.min(14, Math.max(1, 1 + (addedMl / 25) * 6));
  const isEquivalence = addedMl >= 24.5 && addedMl <= 25.5;

  const bgSubCard = isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-50 border-slate-200';
  const textSub = isDarkMode ? 'text-[#A1A1AA]' : 'text-slate-500';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-800';

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-[#26272E]' : 'border-slate-200'}`}>
        <span className="text-xs font-bold text-pink-500 flex items-center space-x-2">
          <FlaskConical size={16} />
          <span>Acid-Base Titration Lab</span>
        </span>
        <span className={`text-xs font-mono ${textSub}`}>0.1M HCl vs 0.1M NaOH</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`space-y-3 p-4 rounded-xl border ${bgSubCard}`}>
          <div className="flex justify-between text-xs">
            <span className={textSub}>Burette Volume Added:</span>
            <span className={`font-bold font-mono ${textMain}`}>{addedMl.toFixed(1)} mL</span>
          </div>
          <input 
            type="range" min="0" max="50" step="0.5" 
            value={addedMl} 
            onChange={(e) => setAddedMl(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer" 
          />
          <div className="flex space-x-2 pt-2">
            <button 
              onClick={() => setAddedMl((v) => Math.min(50, v + 1))} 
              className={`flex-1 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
                isDarkMode ? 'bg-[#26272E] hover:bg-[#3F404A] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              +1.0 mL
            </button>
            <button onClick={() => setAddedMl(0)} className="py-1.5 px-3 bg-red-500/20 text-red-500 text-xs rounded-lg cursor-pointer font-semibold">
              Reset
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-center space-y-3 text-center ${bgSubCard}`}>
          <div className="flex justify-around text-xs">
            <div>
              <p className={textSub}>Current pH</p>
              <p className={`text-xl font-bold font-mono ${ph > 8 ? 'text-pink-500' : 'text-blue-500'}`}>
                {ph.toFixed(2)}
              </p>
            </div>
            <div>
              <p className={textSub}>Flask Color</p>
              <div 
                className="w-6 h-6 rounded-full mx-auto mt-1 border border-slate-400/40 transition-colors duration-300"
                style={{ backgroundColor: ph > 8.2 ? '#EC4899' : 'transparent' }}
              />
            </div>
          </div>
          {isEquivalence && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20">
              Equivalence Point Reached (~25.0 mL)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PhysicsCircuit({ isDarkMode }) {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(10);
  const current = (voltage / resistance).toFixed(2);

  const bgSubCard = isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-50 border-slate-200';
  const textSub = isDarkMode ? 'text-[#A1A1AA]' : 'text-slate-500';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-800';

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-[#26272E]' : 'border-slate-200'}`}>
        <span className="text-xs font-bold text-cyan-500 flex items-center space-x-2">
          <Atom size={16} />
          <span>DC Circuit Simulator (Ohm's Law)</span>
        </span>
        <span className={`text-xs font-mono ${textSub}`}>I = V / R</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`space-y-4 p-4 rounded-xl border ${bgSubCard}`}>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={textSub}>Voltage (V):</span>
              <span className={`font-bold font-mono ${textMain}`}>{voltage} V</span>
            </div>
            <input type="range" min="1" max="24" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={textSub}>Resistance (R):</span>
              <span className={`font-bold font-mono ${textMain}`}>{resistance} Ω</span>
            </div>
            <input type="range" min="1" max="100" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center space-y-2 ${bgSubCard}`}>
          <span className={`text-xs ${textSub}`}>Calculated Circuit Current</span>
          <span className="text-3xl font-black font-mono text-cyan-500">{current} A</span>
          <p className={`text-[10px] ${textSub} pt-1`}>
            Power Dissipation: <strong className={textMain}>{(voltage * current).toFixed(1)} W</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function ComputerSciencePlayground({ isDarkMode }) {
  const [code, setCode] = useState("def binary_search(arr, target):\n    # Interactive sandbox\n    return 'Target found'");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput("Executing Process...\n>>> Target found\n>>> Memory used: 12.4 MB\n>>> Time: 0.002s");
  };

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-[#26272E]' : 'border-slate-200'}`}>
        <span className="text-xs font-bold text-emerald-500 flex items-center space-x-2">
          <Code size={16} />
          <span>Interactive Code Sandbox</span>
        </span>
        <button onClick={runCode} className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold rounded-lg border border-emerald-500/30 cursor-pointer">
          <Play size={12} />
          <span>Run Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          rows={5} 
          className={`w-full p-3 border rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none ${
            isDarkMode ? 'bg-[#1A1B20] border-[#26272E] text-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`} 
        />
        <div className={`border p-3 rounded-xl font-mono text-xs whitespace-pre-line ${
          isDarkMode ? 'bg-black/40 border-[#26272E] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          {output || "Console Output will appear here..."}
        </div>
      </div>
    </div>
  );
}

function MathPlotter({ isDarkMode }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);

  const bgSubCard = isDarkMode ? 'bg-[#1A1B20] border-[#26272E]' : 'bg-slate-50 border-slate-200';
  const textSub = isDarkMode ? 'text-[#A1A1AA]' : 'text-slate-500';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-800';

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-[#26272E]' : 'border-slate-200'}`}>
        <span className="text-xs font-bold text-purple-500 flex items-center space-x-2">
          <Calculator size={16} />
          <span>Quadratic Function Visualizer</span>
        </span>
        <span className={`text-xs font-mono ${textSub}`}>y = {a}x² {b >= 0 ? `+ ${b}` : b}x</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`space-y-4 p-4 rounded-xl border ${bgSubCard}`}>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={textSub}>Coefficient (a):</span>
              <span className={`font-bold font-mono ${textMain}`}>{a}</span>
            </div>
            <input type="range" min="-5" max="5" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={textSub}>Linear Term (b):</span>
              <span className={`font-bold font-mono ${textMain}`}>{b}</span>
            </div>
            <input type="range" min="-10" max="10" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center space-y-2 ${bgSubCard}`}>
          <span className={`text-xs ${textSub}`}>Parabola Vertex Location</span>
          <span className="text-xl font-bold font-mono text-purple-500">
            ({(-b / (2 * (a || 1))).toFixed(2)}, {(-(b * b) / (4 * (a || 1))).toFixed(2)})
          </span>
          <p className={`text-[10px] ${textSub}`}>
            Curve direction: <strong className={textMain}>{a > 0 ? 'Upward (Min)' : a < 0 ? 'Downward (Max)' : 'Flat Line'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PracticalLabs({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    { id: 'Chemistry', label: 'Chemistry Lab', icon: FlaskConical, color: 'text-pink-500' },
    { id: 'Physics', label: 'Physics Circuit', icon: Atom, color: 'text-cyan-500' },
    { id: 'Computer Science', label: 'CS Sandbox', icon: Code, color: 'text-emerald-500' },
    { id: 'Mathematics', label: 'Math Visualizer', icon: Calculator, color: 'text-purple-500' },
  ];

  return (
    <>
      {/* Expanded Active Practical Drawer */}
      {activeTab && (
        <div className="fixed inset-x-0 bottom-16 z-30 max-w-4xl mx-auto px-4 animate-in slide-in-from-bottom duration-200">
          <div className={`p-5 rounded-2xl border shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#141519] border-[#26272E] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className={`flex items-center justify-between pb-3 mb-4 border-b ${isDarkMode ? 'border-[#26272E]' : 'border-slate-200'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Practical Simulation Active
              </span>
              <button 
                onClick={() => setActiveTab(null)}
                className={`p-1 rounded-lg cursor-pointer ${
                  isDarkMode ? 'hover:bg-[#26272E] text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {activeTab === 'Chemistry' && <ChemistryLab isDarkMode={isDarkMode} />}
            {activeTab === 'Physics' && <PhysicsCircuit isDarkMode={isDarkMode} />}
            {activeTab === 'Computer Science' && <ComputerSciencePlayground isDarkMode={isDarkMode} />}
            {activeTab === 'Mathematics' && <MathPlotter isDarkMode={isDarkMode} />}
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-md transition-colors ${
        isDarkMode ? 'bg-[#0B0C0E]/90 border-[#26272E]' : 'bg-white/90 border-slate-200 shadow-lg'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(isActive ? null : tab.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : tab.color} />
                <span className="text-[10px] font-medium mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}