import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Zap, Globe, Cpu } from 'lucide-react';

const FOUNDERS = [
  {
    id: '1',
    name: 'Elara Vance',
    role: 'Neural Architect',
    bio: 'Pioneered the biometrically-responsive protocols that define our environmental synchronization layers.',
    influence: 98,
    tier: 'Omega',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    size: 'large'
  },
  {
    id: '2',
    name: 'Jaxon Reed',
    role: 'Network Strategist',
    bio: 'Architected the GoToken incentive layer to foster sustainable community growth.',
    influence: 85,
    tier: 'Platinum',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    size: 'small'
  },
  {
    id: '3',
    name: 'Sia K.',
    role: 'Wellness Systems Designer',
    bio: 'Oversees the integration of circadian lighting and organic nutrient filtration.',
    influence: 92,
    tier: 'Elite',
    avatar: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg',
    size: 'medium'
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    role: 'Sentinel Security Lead',
    bio: 'Engineered the multi-factor biometric verification pipeline for the global node network.',
    influence: 96,
    tier: 'Omega',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    size: 'small'
  }
];

export default function FounderSpotlight() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6">
      {FOUNDERS.map((founder, i) => (
        <motion.div
          key={founder.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className={`
            relative group overflow-hidden bg-[#080A0E]/60 border border-white/5 rounded-[40px] p-8 flex flex-col justify-between transition-all duration-700
            ${founder.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : ''}
            ${founder.size === 'medium' ? 'lg:col-span-2' : ''}
            hover:border-neon-blue/40 hover:bg-[#0B0E14]
          `}
        >
          {/* Background Avatar with Mask */}
          <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0 duration-1000">
            <img src={founder.avatar} className="w-full h-full object-cover" alt={founder.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/40 to-transparent" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <Shield className="text-neon-blue" size={14} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{founder.tier} Tier</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue border border-neon-blue/20">
              <Cpu size={18} />
            </div>
          </div>

          <div className="relative z-10">
            <h4 className={`font-black text-white tracking-tighter uppercase mb-1 ${founder.size === 'large' ? 'text-4xl' : 'text-xl'}`}>
              {founder.name}
            </h4>
            <p className="text-neon-blue text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              {founder.role}
            </p>
            {founder.size !== 'small' && (
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mb-6 group-hover:text-slate-200 transition-colors">
                {founder.bio}
              </p>
            )}
            
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Influence</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${founder.influence}%` }}
                      className="h-full bg-neon-blue shadow-[0_0_10px_#00D1FF]" 
                    />
                  </div>
                  <span className="text-[10px] font-black text-white">{founder.influence}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Glow */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-neon-blue/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>
      ))}
    </div>
  );
}
