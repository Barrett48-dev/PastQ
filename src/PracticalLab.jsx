import React, { useState } from 'react';
import { Play, RotateCcw, ArrowLeft, Code, Atom, CheckCircle, Terminal } from 'lucide-react';

export default function PracticalLab({ labType, subject, onBack }) {
  // The route passes labType from the dashboard; it selects the appropriate practical simulator below.
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Shared header keeps exit navigation and the selected subject visible in both lab modes. */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2">
              {labType === 'code-editor-lab' ? <Code className="text-cyan-400" size={18} /> : <Atom className="text-purple-400" size={18} />}
              {subject} Virtual Lab
            </h1>
            <p className="text-[10px] text-slate-400">Interactive Practical Module</p>
          </div>
        </div>
      </header>

      {/* Only the specialized workspace changes; the surrounding page remains stable. */}
      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        {labType === 'code-editor-lab' ? (
          <ComputerScienceLab />
        ) : (
          <PhysicsLab />
        )}
      </main>
    </div>
  );
}

/* ====================================================================
   1. COMPUTER SCIENCE PRACTICAL ENVIRONMENT (Code Editor & Runner)
   ==================================================================== */
function ComputerScienceLab() {
  // The editor stores source text, while output and running status describe the latest simulated execution.
  const [code, setCode] = useState(
`// Practical Question: Write a program to calculate the average of 3 numbers
function calculateAverage(a, b, c) {
    let sum = a + b + c;
    let avg = sum / 3;
    return avg;
}

console.log("Average of 10, 20, 30 is:", calculateAverage(10, 20, 30));`
  );

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Execute user-entered JavaScript against a deliberately narrow console shim for this prototype.
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Compiling and executing...\n');

    setTimeout(() => {
      try {
        // Safe evaluation simulation for console logging
        let logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.join(' '))
        };

        const runFn = new Function('console', code);
        runFn(customConsole);

        setOutput(logs.join('\n') || 'Program executed successfully with no output.');
      } catch (err) {
        setOutput(`Execution Error: ${err.message}`);
      }
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Code input panel is a controlled textarea, so edits immediately update executable source. */}
      <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">main.js</span>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <Play size={14} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full flex-1 min-h-[350px] p-4 bg-slate-950 font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
          spellCheck="false"
        />
      </div>

      {/* Output console shows captured logs or a syntax/runtime error from the simulated run. */}
      <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center space-x-2">
          <Terminal size={14} className="text-emerald-400" />
          <span className="text-xs font-mono text-slate-400">Console Output</span>
        </div>
        <pre className="p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap flex-1 bg-[#07080A]">
          {output || '// Click "Run Code" to view the practical execution output here.'}
        </pre>
      </div>
    </div>
  );
}

/* ====================================================================
   2. PHYSICS PRACTICAL ENVIRONMENT (Interactive Motion Simulator)
   ==================================================================== */
function PhysicsLab() {
  // Slider/select state is the experiment input; all three readouts are derived from those values.
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);

  // Standard projectile-motion equations convert the controls into range, height, and flight duration.
  const radians = (angle * Math.PI) / 180;
  const maxRange = ((velocity ** 2) * Math.sin(2 * radians)) / gravity;
  const maxHeight = ((velocity ** 2) * (Math.sin(radians) ** 2)) / (2 * gravity);
  const flightTime = (2 * velocity * Math.sin(radians)) / gravity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Controls are the experiment workbench and rerender the readout whenever a value changes. */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
          Experiment: Projectile Motion
        </h2>

        {/* Velocity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Initial Velocity ($v$)</span>
            <span className="font-mono text-purple-300">{velocity} m/s</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800"
          />
        </div>

        {/* Launch Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Launch Angle ($\theta$)</span>
            <span className="font-mono text-purple-300">{angle}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800"
          />
        </div>

        {/* Gravity Selector */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Gravity ($g$)</span>
            <span className="font-mono text-purple-300">{gravity} m/s²</span>
          </div>
          <select
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value={9.8}>Earth (9.8 m/s²)</option>
            <option value={1.62}>Moon (1.62 m/s²)</option>
            <option value={24.79}>Jupiter (24.79 m/s²)</option>
          </select>
        </div>
      </div>

      {/* The readout pairs exact calculated values with a lightweight trajectory illustration. */}
      <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Real-Time Mathematical Output
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Max Range</span>
              <span className="text-lg font-mono font-bold text-cyan-400">{maxRange.toFixed(1)} m</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Max Height</span>
              <span className="text-lg font-mono font-bold text-purple-400">{maxHeight.toFixed(1)} m</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Flight Time</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{flightTime.toFixed(1)} s</span>
            </div>
          </div>
        </div>

        {/* SVG path scales the parabola from the calculated range and height for quick visual feedback. */}
        <div className="h-44 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex items-end p-4">
          <svg className="w-full h-full overflow-visible">
            <path
              d={`M 10 140 Q ${Math.min(maxRange / 2, 250)} ${140 - Math.min(maxHeight * 1.5, 120)} ${Math.min(maxRange, 500)} 140`}
              fill="none"
              stroke="#A855F7"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
          </svg>
          <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono">Cannon</div>
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">Impact Zone</div>
        </div>
      </div>
    </div>
  );
}