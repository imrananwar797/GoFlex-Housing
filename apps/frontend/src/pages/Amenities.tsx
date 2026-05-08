import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { 
  Wifi, 
  Wind, 
  Utensils, 
  Dumbbell, 
  Gamepad2, 
  BookOpen, 
  Coffee, 
  Zap, 
  ShieldCheck, 
  Tv, 
  Truck,
  HeartPulse,
  Users,
  Sparkles
} from 'lucide-react';

const AMENITIES_LIST = [
  { id: 'wifi', group: 'Tech', title: 'Gigabit Fiber', icon: <Wifi size={24} />, desc: 'Hyper-fast symmetric connection with dedicated 1:1 bandwidth and multi-source redundancy.' },
  { id: 'smart', group: 'Tech', title: 'Smart Ecosystem', icon: <Zap size={24} />, desc: 'Voice-controlled lighting, climate, and automated security integrated via GoFlex Hub.' },
  { id: 'meals', group: 'Wellness', title: 'Biometric Nutrition', icon: <Utensils size={24} />, desc: 'Chef-curated meals personalized to your health data and dietary preferences.' },
  { id: 'gym', group: 'Wellness', title: 'Cyber-Fitness', icon: <Dumbbell size={24} />, desc: 'Peloton equipment, AI-powered form correction, and 24/7 access to high-intensity zones.' },
  { id: 'game', group: 'Social', title: 'VR Lounge', icon: <Gamepad2 size={24} />, desc: 'Immersive gaming pods with latest VR tech and high-spec PC stations.' },
  { id: 'study', group: 'Tech', title: 'Deep Work Pods', icon: <BookOpen size={24} />, desc: 'Sound-proofed, ergonomic zones optimized for maximum cognitive performance.' },
  { id: 'coffee', group: 'Social', title: 'Artisan Brew Bar', icon: <Coffee size={24} />, desc: 'Unlimited specialty coffee and adaptogenic tonics curated by local baristas.' },
  { id: 'security', group: 'Safety', title: 'Military-Grade Security', icon: <ShieldCheck size={24} />, desc: 'Multi-factor biometric access and AI-driven anomaly detection for absolute peace of mind.' },
  { id: 'cinema', group: 'Social', title: '8K Cinema Studio', icon: <Tv size={24} />, desc: 'Dolby Atmos equipped screening room for private viewings and collaborative workshops.' },
  { id: 'concierge', group: 'Services', title: 'AI Concierge', icon: <Sparkles size={24} />, desc: '24/7 digital assistant for everything from laundry booking to local event discovery.' },
  { id: 'health', group: 'Wellness', title: 'Bio-Sync Spa', icon: <HeartPulse size={24} />, desc: 'Infrared saunas, cold plunge pools, and recovery zones for optimal mental clarity.' },
  { id: 'community', group: 'Social', title: 'Founder Circles', icon: <Users size={24} />, desc: 'Curated networking events and mastermind groups with fellow residents.' }
];

const GROUPS = ['All', 'Tech', 'Wellness', 'Social', 'Safety', 'Services'] as const;

export default function Amenities() {
  const [activeGroup, setActiveGroup] = useState<typeof GROUPS[number]>('All');
  
  const filteredList = useMemo(() => 
    activeGroup === 'All' ? AMENITIES_LIST : AMENITIES_LIST.filter(a => a.group === activeGroup), 
  [activeGroup]);

  return (
    <PageTransition>
      <div className="bg-obsidian min-h-screen">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-eyebrow mb-6 justify-center"
            >
              The GoFlex Standard
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter"
            >
              Hyper-Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-neon-blue">Living</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              We've engineered every square inch of our spaces to optimize your performance, wellness, and community experience.
            </motion.p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-wrap justify-center gap-4 mb-20">
              {GROUPS.map(g => (
                <motion.button 
                  key={g} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                    activeGroup === g 
                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                  onClick={() => setActiveGroup(g)}
                >
                  {g}
                </motion.button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredList.map((a, i) => (
                  <motion.article 
                    layout
                    key={a.id} 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="glass-morphism rounded-[32px] p-8 border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                      <div className="text-white transform scale-[3] rotate-[-15deg]">
                        {a.icon}
                      </div>
                    </div>

                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-purple-500 mb-8 border border-white/10 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                      {a.icon}
                    </div>
                    
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-2 block">{a.group}</span>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{a.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{a.desc}</p>
                    
                    {/* Decorative element */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/50 transition-all duration-700" />
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="glass-morphism rounded-[40px] p-20 text-center border-purple-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-neon-blue/5" />
              <div className="relative z-10">
                <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">Experience it first-hand.</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">Book a private tour of our flagship locations and discover the future of living.</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-purple-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.4)] uppercase tracking-widest text-sm flex items-center gap-3 mx-auto"
                >
                  Schedule a Tour <Sparkles size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
