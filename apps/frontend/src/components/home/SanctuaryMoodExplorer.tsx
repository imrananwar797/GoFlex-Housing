import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Wind, Sparkles, ArrowRight } from 'lucide-react';

const MOODS = [
  {
    id: 'cyberpunk',
    name: 'Focus Mode',
    tagline: 'Deep Work Infrastructure',
    icon: <Zap size={20} />,
    color: 'from-neon-blue to-purple-600',
    accent: 'text-neon-blue',
    bg: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg',
    desc: 'High-contrast lighting and high-speed connectivity designed to keep you in flow. Perfect for deep coding, strategy sessions, and peak cognitive performance.'
  },
  {
    id: 'zen',
    name: 'Rest Mode',
    tagline: 'Circadian Wellness',
    icon: <Wind size={20} />,
    color: 'from-emerald-400 to-teal-600',
    accent: 'text-emerald-400',
    bg: 'https://images.pexels.com/photos/3264707/pexels-photo-3264707.jpeg',
    desc: 'A biophilic escape using soft-spectrum lighting that syncs with your natural sleep cycle. Engineered to help you recharge faster and wake up refreshed.'
  },
  {
    id: 'artisan',
    name: 'Creative Mode',
    tagline: 'Organic Inspiration',
    icon: <Sparkles size={20} />,
    color: 'from-amber-400 to-orange-600',
    accent: 'text-amber-400',
    bg: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg',
    desc: 'Bespoke finishes and organic textures that stimulate original thought. A warm, artisanal environment crafted for brainstorming and creative output.'
  }
];

export default function SanctuaryMoodExplorer() {
  const [activeMood, setActiveMood] = useState(MOODS[0]);

  return (
    <div className="relative min-h-[800px] flex items-center py-20 overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMood.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-obsidian/60 z-10" />
          <img 
            src={activeMood.bg} 
            className="w-full h-full object-cover grayscale opacity-50"
            alt={activeMood.name}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian opacity-80`} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              key={activeMood.id + '-text'}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${activeMood.accent} border border-white/10 shadow-2xl`}>
                  {activeMood.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.6em] ${activeMood.accent}`}>
                  {activeMood.tagline}
                </span>
              </div>
              
              <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none">
                Experience <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeMood.color}`}>
                  {activeMood.name}
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-medium">
                {activeMood.desc}
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-12 py-6 rounded-2xl bg-white text-obsidian font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl transition-all`}
            >
              Explore {activeMood.name} Suites <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-col gap-6">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => setActiveMood(mood)}
                whileHover={{ x: 10 }}
                className={`group relative p-8 rounded-[32px] border transition-all duration-700 text-left overflow-hidden ${
                  activeMood.id === mood.id 
                  ? 'bg-white/10 border-white/20 shadow-2xl' 
                  : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'
                }`}
              >
                {activeMood.id === mood.id && (
                  <motion.div 
                    layoutId="mood-active-glow"
                    className={`absolute inset-0 bg-gradient-to-r ${mood.color} opacity-10`}
                  />
                )}
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white tracking-tight uppercase group-hover:tracking-widest transition-all">
                      {mood.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {mood.tagline}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${activeMood.id === mood.id ? mood.accent : 'text-slate-500'}`}>
                    {mood.icon}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
