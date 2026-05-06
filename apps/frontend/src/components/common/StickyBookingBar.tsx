import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

export default function StickyBookingBar() {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[90%] max-w-5xl z-30"
    >
      <div className="bg-[#0B0E14]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 sm:p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Location */}
        <div className="flex-1 w-full group cursor-pointer px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-neon-blue transition-colors">
            <MapPin size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
          </div>
          <p className="text-white font-bold mt-1 ml-7">Select City</p>
        </div>

        <div className="hidden md:block w-px h-10 bg-white/10" />

        {/* Dates */}
        <div className="flex-1 w-full group cursor-pointer px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-neon-blue transition-colors">
            <Calendar size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Check-in</span>
          </div>
          <p className="text-white font-bold mt-1 ml-7">Add Dates</p>
        </div>

        <div className="hidden md:block w-px h-10 bg-white/10" />

        {/* Occupancy */}
        <div className="flex-1 w-full group cursor-pointer px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-neon-blue transition-colors">
            <Users size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Occupancy</span>
          </div>
          <p className="text-white font-bold mt-1 ml-7">1 Guest</p>
        </div>

        {/* Search Button */}
        <button className="w-full md:w-auto px-8 py-4 bg-neon-blue text-obsidian font-black rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-neon-blue">
          <Search size={20} />
          <span className="uppercase tracking-widest text-xs">Search</span>
        </button>
      </div>
    </motion.div>
  );
}
