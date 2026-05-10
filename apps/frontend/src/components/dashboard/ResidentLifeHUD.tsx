import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wind, Zap, Moon, Sun } from 'lucide-react';

export default function ResidentLifeHUD() {
  const [speed, setSpeed] = useState(0);
  const [mode, setMode] = useState<'Cyberpunk' | 'Zen'>('Cyberpunk');
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed(980 + Math.random() * 5);
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Biometric Circadian Widget */}
      <div className="bg-obsidian-surface/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-3xl -mr-16 -mt-16" />
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Sanctuary Mode</p>
            <h3 className="text-white text-2xl font-black">{mode} Mode</h3>
          </div>
          <div className={`p-3 rounded-2xl ${mode === 'Cyberpunk' ? 'bg-neon-blue/10 text-neon-blue' : 'bg-purple-500/10 text-purple-400'} transition-colors`}>
            {mode === 'Cyberpunk' ? <Zap size={20} /> : <Moon size={20} />}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Restorative Shift</p>
              <p className="text-white text-3xl font-mono font-black">{formatTime(timeLeft)}</p>
            </div>
            <button 
              onClick={() => setMode(mode === 'Cyberpunk' ? 'Zen' : 'Cyberpunk')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all"
            >
              Toggle
            </button>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(timeLeft / (45 * 60)) * 100}%` }}
              className={`h-full ${mode === 'Cyberpunk' ? 'bg-neon-blue' : 'bg-purple-500'} shadow-glow`}
            />
          </div>
        </div>
      </div>

      {/* Neural Bandwidth HUD */}
      <div className="bg-obsidian-surface/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Neural Bandwidth</p>
            <h3 className="text-white text-2xl font-black">Dedicated Fiber</h3>
          </div>
          <div className="p-3 bg-green-500/10 text-green-400 rounded-2xl">
            <Cpu size={20} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <motion.circle 
                cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251"
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - (speed / 1000) * 251 }}
                className="text-neon-blue"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={16} className="text-neon-blue animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-white text-4xl font-black tracking-tight">{speed.toFixed(0)} <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Mbps</span></p>
            <p className="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              1:1 Optimized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
