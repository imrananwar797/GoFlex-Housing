import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingDown, Info } from 'lucide-react';

export default function CarbonTrace() {
  const score = 92; // Simulated resident score
  
  return (
    <div className="bg-obsidian-surface/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden h-full group">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Impact Analysis</p>
          <h3 className="text-white text-xl font-black">Carbon Trace</h3>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
          <Leaf size={20} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(16, 185, 129, 0.2)", "0 0 40px rgba(16, 185, 129, 0.4)", "0 0 20px rgba(16, 185, 129, 0.2)"] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/5"
          >
            <span className="text-4xl font-black text-emerald-400">{score}</span>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-obsidian border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <TrendingDown size={12} className="text-emerald-400" />
            <span className="text-[10px] font-black text-white">-12%</span>
          </div>
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-8 text-center px-4">
          Optimized habit: You are in the top 5% of energy-savers across Kolkata nodes.
        </p>
      </div>

      <button className="absolute bottom-6 right-6 text-slate-500 hover:text-white transition-colors">
        <Info size={16} />
      </button>
    </div>
  );
}
