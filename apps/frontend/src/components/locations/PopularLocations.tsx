import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { locationService } from '../../utils/locations';

function withParams(src: string, w: number){
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=compress&cs=tinysrgb&w=${w}&dpr=1`;
}

const cityPhotoMap: Record<string,string> = {
  Mumbai: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg',
  "New Delhi": 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg',
  Delhi: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg',
  Jaipur: 'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg',
  Agra: 'https://images.pexels.com/photos/204354/pexels-photo-204354.jpeg',
  Varanasi: 'https://images.pexels.com/photos/1574677/pexels-photo-1574677.jpeg',
  Kolkata: 'https://images.pexels.com/photos/12313626/pexels-photo-12313626.jpeg',
  Chennai: 'https://images.pexels.com/photos/1007066/pexels-photo-1007066.jpeg',
  Bengaluru: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
  Bangalore: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
  Hyderabad: 'https://images.pexels.com/photos/415640/pexels-photo-415640.jpeg',
  Panaji: 'https://images.pexels.com/photos/2103328/pexels-photo-2103328.jpeg',
  Goa: 'https://images.pexels.com/photos/2103328/pexels-photo-2103328.jpeg',
  Pune: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
  Ahmedabad: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg',
  "Port Blair": 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg'
};

const scenicFallbacks = [
  'https://images.pexels.com/photos/204354/pexels-photo-204354.jpeg',
  'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg',
  'https://images.pexels.com/photos/1574677/pexels-photo-1574677.jpeg',
  'https://images.pexels.com/photos/415640/pexels-photo-415640.jpeg'
];

function photoForCity(name: string){
  const normalized = name.trim();
  if (cityPhotoMap[normalized]) return cityPhotoMap[normalized];
  const match = Object.keys(cityPhotoMap).find(k => k.toLowerCase() === normalized.toLowerCase());
  if (match) return cityPhotoMap[match];
  let h = 0; for (let i=0;i<normalized.length;i++){h = (h*31 + normalized.charCodeAt(i))>>>0;}
  return scenicFallbacks[h % scenicFallbacks.length];
}

export default function PopularLocations() {
  const states = useMemo(() => locationService.getStates(), []);
  const [activeIso, setActiveIso] = useState('KA');
  const [query, setQuery] = useState('');

  const cities = useMemo(() => {
    try {
      const list = locationService.getCitiesOfState(activeIso) || [];
      const q = query.trim().toLowerCase();
      return q ? list.filter(c => c.name.toLowerCase().includes(q)) : list.slice(0, 8);
    } catch { return []; }
  }, [activeIso, query]);

  return (
    <div className="space-y-12">
      {/* Refined State Chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {states.filter(s => ['KA', 'MH', 'DL', 'GA', 'TS', 'TN', 'WB'].includes(s.isoCode)).map((s) => (
          <motion.button
            key={s.isoCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
              activeIso === s.isoCode 
                ? 'bg-white text-obsidian border-white shadow-xl shadow-white/10' 
                : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/30'
            }`}
            onClick={() => setActiveIso(s.isoCode)}
          >
            {s.name}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={18} />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder-slate-600 outline-none focus:border-neon-blue/50 focus:bg-white/[0.08] transition-all"
            placeholder="Search our city collection..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <MapPin size={14} className="text-neon-blue" />
          <span>Curated for {states.find(s => s.isoCode === activeIso)?.name}</span>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {cities.map((c, i) => {
            const src = photoForCity(c.name);
            return (
              <motion.a 
                key={c.name} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="group relative h-80 rounded-[40px] overflow-hidden bg-obsidian-surface border border-white/5"
                href={`/properties?state=${activeIso}&city=${c.name}`}
              >
                <img
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  src={withParams(src, 640)}
                  alt={c.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                  <h4 className="font-beauty text-3xl text-white mb-2 tracking-tight">{c.name}</h4>
                  <div className="flex items-center gap-2 text-neon-blue text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    Explore Suites <ArrowRight size={10} />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
const ArrowRight = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);
