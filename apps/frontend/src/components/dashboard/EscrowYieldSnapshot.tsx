import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Link } from 'lucide-react';

export default function EscrowYieldSnapshot() {
  return (
    <div className="bg-obsidian-surface/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Web3 Settlement</p>
          <h3 className="text-white text-xl font-black">Polygon Escrow</h3>
        </div>
        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
          <Link size={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Held</p>
          <p className="text-white text-3xl font-black tracking-tight">₹4.2L</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-neon-blue text-[10px] font-bold uppercase tracking-widest">Locked on Chain</span>
          </div>
        </div>
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Avg. Yield</p>
          <p className="text-emerald-400 text-3xl font-black tracking-tight">5.8%</p>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Generating APY</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Smart Contract Status</span>
          <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Verified</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: [-100, 100] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-neon-blue to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
