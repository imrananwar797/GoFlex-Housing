import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Layers, BarChart3, Eye, Zap, Droplets, CreditCard } from 'lucide-react';

export default function TrustProtocol() {
  const [viewMode, setViewMode] = useState<'escrow' | 'transparency'>('escrow');

  return (
    <div className="py-40 bg-[#080A0E] relative overflow-hidden noise-texture">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="section-eyebrow mb-6">Phase 3 Security</span>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-10">
              Trust & <br /> <span className="text-purple-500 italic font-normal">Settlement</span>.
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-lg">
              We leverage the Polygon network to ensure your deposits and utility payments are handled with absolute cryptographic transparency.
            </p>

            <div className="flex gap-4 p-2 bg-white/5 rounded-2xl w-fit border border-white/5">
               <button 
                 onClick={() => setViewMode('escrow')}
                 className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'escrow' ? 'bg-white text-obsidian shadow-2xl' : 'text-slate-400 hover:text-white'}`}
               >
                 Escrow Visualizer
               </button>
               <button 
                 onClick={() => setViewMode('transparency')}
                 className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'transparency' ? 'bg-white text-obsidian shadow-2xl' : 'text-slate-400 hover:text-white'}`}
               >
                 Transparency Toggle
               </button>
            </div>
          </div>

          <div className="relative aspect-square">
            <AnimatePresence mode="wait">
              {viewMode === 'escrow' ? (
                <motion.div
                  key="escrow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="w-full h-full glass-beauty rounded-[60px] p-12 flex flex-col items-center justify-center gap-10 border-purple-500/20 border-beam"
                >
                  <div className="relative">
                     <div className="absolute inset-0 bg-purple-500 opacity-20 animate-pulse" />
                     <Lock className="text-purple-500 relative z-10" size={80} />
                  </div>
                  <div className="text-center space-y-4">
                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Smart Escrow Layer</h4>
                     <p className="text-sm text-slate-500 font-medium">Security deposit locked in a non-custodial Polygon smart contract.</p>
                  </div>
                  <div className="flex gap-4 w-full">
                     <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xs font-bold text-emerald-400">ENCRYPTED</p>
                     </div>
                     <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network</p>
                        <p className="text-xs font-bold text-white">POLYGON MAINNET</p>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="transparency"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="w-full h-full glass-beauty rounded-[60px] p-12 border-neon-blue/20 noise-texture"
                >
                  <div className="flex items-center justify-between mb-10">
                     <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Utility Simulation</h4>
                     <Eye className="text-neon-blue" size={20} />
                  </div>
                  
                  <div className="space-y-6">
                     {[
                       { icon: <Zap size={16} />, label: 'Electricity', value: '42.5 kWh', cost: '₲ 340', color: 'text-amber-400' },
                       { icon: <Droplets size={16} />, label: 'Water Usage', value: '1,200 L', cost: '₲ 120', color: 'text-blue-400' },
                       { icon: <CreditCard size={16} />, label: 'Monthly Sync', value: 'Base Unit', cost: '₲ 15,000', color: 'text-neon-blue' }
                     ].map((item, i) => (
                       <motion.div 
                         key={item.label}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.1 }}
                         className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5"
                       >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 bg-white/5 rounded-xl ${item.color}`}>{item.icon}</div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</p>
                               <p className="text-[9px] font-bold text-slate-500">{item.value}</p>
                            </div>
                         </div>
                         <p className="text-sm font-black text-white">{item.cost}</p>
                       </motion.div>
                     ))}
                  </div>

                  <div className="mt-8 p-6 bg-neon-blue/10 rounded-3xl border border-neon-blue/20 flex items-center justify-between">
                     <span className="text-xs font-black text-neon-blue uppercase tracking-widest">Total Projected Settlement</span>
                     <span className="text-xl font-black text-white">₲ 15,460</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
