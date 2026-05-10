import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Zap, Coffee, Train, ArrowRight } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const CITIES = [
  {
    name: 'Kolkata',
    state: 'West Bengal',
    description: 'The cultural soul of India, now synced with high-performance infrastructure.',
    nodes: 14,
    hubs: ['Salt Lake Sector V', 'New Town', 'Park Street'],
    image: 'https://images.pexels.com/photos/14801121/pexels-photo-14801121.jpeg',
    stats: { connectivity: '99.9%', commute: '12m avg', coffee: '42 nodes' }
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    description: 'The maximum city, optimized for the high-performing resident.',
    nodes: 8,
    hubs: ['Bandra East', 'BKC', 'Powai'],
    image: 'https://images.pexels.com/photos/3893288/pexels-photo-3893288.jpeg',
    stats: { connectivity: '99.8%', commute: '15m avg', coffee: '38 nodes' }
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    description: 'The silicon heart of India. Circadian living for the tech elite.',
    nodes: 22,
    hubs: ['Indiranagar', 'HSR Layout', 'Whitefield'],
    image: 'https://images.pexels.com/photos/1031700/pexels-photo-1031700.jpeg',
    stats: { connectivity: '99.9%', commute: '10m avg', coffee: '64 nodes' }
  }
];

export default function Locations() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian pt-32 pb-20 px-8 noise-texture">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-neon-blue text-[10px] font-black uppercase tracking-[1em] mb-6 block">The Global Network</span>
            <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-none">
               Explore <br /> <span className="italic font-normal text-slate-500">The Nodes</span>.
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {CITIES.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[600px] rounded-[40px] overflow-hidden border border-white/5 hover:border-neon-blue/40 transition-all duration-700"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
                   <img src={city.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-60 transition-all" alt={city.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{city.nodes} Nodes Active</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-neon-blue/20 flex items-center justify-center text-neon-blue border border-neon-blue/20">
                       <Navigation size={20} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{city.name}</h3>
                       <p className="text-[10px] font-black text-neon-blue uppercase tracking-widest">{city.state}</p>
                    </div>
                    
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      {city.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                       <div className="text-center">
                          <Zap size={14} className="text-amber-400 mx-auto mb-2" />
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Uptime</p>
                          <p className="text-[10px] font-bold text-white">{city.stats.connectivity}</p>
                       </div>
                       <div className="text-center">
                          <Train size={14} className="text-neon-blue mx-auto mb-2" />
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Transit</p>
                          <p className="text-[10px] font-bold text-white">{city.stats.commute}</p>
                       </div>
                       <div className="text-center">
                          <Coffee size={14} className="text-emerald-400 mx-auto mb-2" />
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Coffee</p>
                          <p className="text-[10px] font-bold text-white">{city.stats.coffee}</p>
                       </div>
                    </div>

                    <button className="w-full py-5 bg-white text-obsidian font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-neon-blue group-hover:shadow-[0_0_30px_#00D1FF] transition-all">
                       Sync with {city.name} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
