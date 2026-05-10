import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Fingerprint, Users, ArrowUpRight } from 'lucide-react';

const TILES = [
  {
    title: 'Energy HUD',
    desc: 'Real-time utility tracking for optimized nodes.',
    stat: 'You saved 12% energy this week.',
    icon: <Zap className="text-amber-400" />,
    color: 'border-amber-400/20',
    link: '/dashboard'
  },
  {
    title: 'Biometric Key',
    desc: 'AI-powered identity verification in 60 seconds.',
    stat: 'Sentinel Identity: VERIFIED',
    icon: <Fingerprint className="text-neon-blue" />,
    isPulse: true,
    color: 'border-neon-blue/20',
    link: '/kyc/upload'
  },
  {
    title: 'Community Pulse',
    desc: 'Live activity from high-performers.',
    stat: 'Founder #04 just booked the Sky-Deck.',
    icon: <Users className="text-purple-500" />,
    color: 'border-purple-500/20',
    link: '/community'
  }
];

export default function LogicOverlay() {
  return (
    <div className="max-w-7xl mx-auto px-8 -mt-20 relative z-50">
      <div className="grid md:grid-cols-3 gap-6">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`group glass-beauty p-8 rounded-[40px] border-white/5 hover:border-white/20 transition-all duration-500 noise-texture overflow-hidden ${tile.color}`}
          >
            <div className="flex justify-between items-start mb-8">
               <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 ${tile.isPulse ? 'biometric-pulse' : ''}`}>
                  {tile.icon}
               </div>
               <ArrowUpRight size={20} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">
              {tile.title}
            </h3>
            
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
              {tile.desc}
            </p>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-8">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Human Impact</p>
               <p className="text-xs font-bold text-white group-hover:text-neon-blue transition-colors">{tile.stat}</p>
            </div>

            <motion.a 
              href={tile.link}
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-all"
            >
              Start Your Journey <ArrowRight size={14} />
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helper Arrow component since it's not imported
const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
