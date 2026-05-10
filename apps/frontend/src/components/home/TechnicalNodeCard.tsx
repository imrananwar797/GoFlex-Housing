import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Thermometer, Users, Box, ArrowRight } from 'lucide-react';

interface NodeProps {
  id: string;
  name: string;
  location: string;
  image: string;
  stats: {
    latency: string;
    environment: string;
    occupancy: string;
  };
}

export default function TechnicalNodeCard({ id, name, location, image, stats }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group bg-[#080A0E] border border-white/5 rounded-[40px] overflow-hidden transition-all duration-700 hover:border-neon-blue/40"
    >
      {/* Background Media */}
      <div className="relative h-64 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.img
              key="normal"
              src={image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-all duration-1000"
            />
          ) : (
            <motion.div
              key="xray"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-obsidian-surface flex items-center justify-center noise-texture"
            >
              {/* Simulated Floor Plan / X-Ray */}
              <div className="w-4/5 h-4/5 border-2 border-dashed border-neon-blue/20 rounded-2xl flex flex-col items-center justify-center gap-4">
                 <Box className="text-neon-blue/40 animate-pulse" size={64} />
                 <span className="text-[10px] font-black text-neon-blue/40 uppercase tracking-[0.4em]">X-Ray Mode Active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E] via-transparent to-transparent" />
      </div>

      {/* Data Sheet Content */}
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <h4 className="text-2xl font-black text-white tracking-tighter uppercase">{name}</h4>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{location}</p>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
            Node ID: {id}
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-neon-blue">
                 <Wifi size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Latency</span>
              </div>
              <p className="text-xs font-bold text-white">{stats.latency}</p>
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                 <Thermometer size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Env</span>
              </div>
              <p className="text-xs font-bold text-white">{stats.environment}</p>
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-500">
                 <Users size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Uplink</span>
              </div>
              <p className="text-xs font-bold text-white">{stats.occupancy}</p>
           </div>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#080A0E] bg-slate-800 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${id}${i}`} className="w-full h-full object-cover grayscale" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#080A0E] bg-white/10 flex items-center justify-center text-[8px] font-black text-white">
                +12
              </div>
           </div>

           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="px-6 py-3 bg-white text-obsidian font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2"
           >
             Sync Node <ArrowRight size={14} />
           </motion.button>
        </div>
      </div>

      {/* Border Beam Animation (Manual Implementation) */}
      <div className="absolute inset-0 pointer-events-none rounded-[40px] border border-white/5 group-hover:border-neon-blue/20 transition-colors" />
    </motion.div>
  );
}
