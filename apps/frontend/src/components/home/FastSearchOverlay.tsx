import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Zap, ArrowRight } from 'lucide-react';

export default function FastSearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-obsidian/95 noise-texture"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neon-blue/20 rounded-xl flex items-center justify-center text-neon-blue border border-neon-blue/20">
                     <Search size={20} />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Sentinel Search Active</span>
               </div>
               <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <X size={20} />
               </button>
            </div>

            <div className="relative group">
               <input
                 autoFocus
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search Node coordinates or city name..."
                 className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-10 py-8 text-2xl font-black text-white placeholder:text-slate-600 outline-none focus:border-neon-blue focus:bg-white/10 transition-all"
               />
               <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:block">Press Enter to Sync</span>
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                     <ArrowRight size={20} />
                  </div>
               </div>
            </div>

            {/* Simulated Suggestions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { city: 'Kolkata', node: 'Salt Lake', count: 12 },
                 { city: 'Kolkata', node: 'New Town', count: 8 },
                 { city: 'Bangalore', node: 'Indiranagar', count: 4 },
                 { city: 'Mumbai', node: 'Powai', count: 6 }
               ].map((item, i) => (
                 <motion.button
                   key={item.node}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/20 transition-all text-left"
                 >
                   <div className="flex items-center gap-4">
                      <MapPin className="text-neon-blue" size={20} />
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.city}</p>
                         <p className="text-sm font-bold text-slate-400">{item.node}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Zap className="text-amber-400" size={14} />
                      <span className="text-xs font-black text-white">{item.count} Nodes</span>
                   </div>
                 </motion.button>
               ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
