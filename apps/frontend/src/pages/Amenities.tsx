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
  Sparkles,
  Timer
} from 'lucide-react';

const AMENITIES_LIST = [
  { id: 'wifi', group: 'Tech', title: 'Gigabit Fiber', icon: <Wifi size={24} />, desc: 'Hyper-fast symmetric connection with dedicated 1:1 bandwidth.', size: 'large', status: 'Optimal' },
  { id: 'smart', group: 'Tech', title: 'Smart Ecosystem', icon: <Zap size={24} />, desc: 'Voice-controlled lighting, climate, and automated security.', size: 'small', status: 'Online' },
  { id: 'meals', group: 'Wellness', title: 'Biometric Nutrition', icon: <Utensils size={24} />, desc: 'Chef-curated meals personalized to your health data.', size: 'medium', status: 'Kitchen Active' },
  { id: 'gym', group: 'Wellness', title: 'Cyber-Fitness', icon: <Dumbbell size={24} />, desc: 'Peloton equipment, AI-powered form correction, and 24/7 access.', size: 'large', status: '8 Residents Active' },
  { id: 'game', group: 'Social', title: 'VR Lounge', icon: <Gamepad2 size={24} />, desc: 'Immersive gaming pods with latest VR tech.', size: 'small', status: '2 Pods Free' },
  { id: 'study', group: 'Tech', title: 'Deep Work Pods', icon: <BookOpen size={24} />, desc: 'Sound-proofed, ergonomic zones optimized for performance.', size: 'medium', status: 'Available' },
  { id: 'coffee', group: 'Social', title: 'Artisan Brew Bar', icon: <Coffee size={24} />, desc: 'Unlimited specialty coffee and adaptogenic tonics.', size: 'medium', status: 'Serving Now' },
  { id: 'security', group: 'Safety', title: 'Military-Grade Security', icon: <ShieldCheck size={24} />, desc: 'Multi-factor biometric access and AI-driven detection.', size: 'large', status: 'Sentinel Active' },
  { id: 'cinema', group: 'Social', title: '8K Cinema Studio', icon: <Tv size={24} />, desc: 'Dolby Atmos equipped screening room for private viewings.', size: 'medium', status: 'Bookable' },
  { id: 'concierge', group: 'Services', title: 'AI Concierge', icon: <Sparkles size={24} />, desc: '24/7 digital assistant for everything from laundry to events.', size: 'small', status: 'Live' },
  { id: 'health', group: 'Wellness', title: 'Bio-Sync Spa', icon: <HeartPulse size={24} />, desc: 'Infrared saunas and recovery zones for mental clarity.', size: 'medium', status: '4 slots free' },
  { id: 'community', group: 'Social', title: 'Founder Circles', icon: <Users size={24} />, desc: 'Curated networking events and mastermind groups.', size: 'large', status: 'Event at 8PM' }
];

const GROUPS = ['All', 'Tech', 'Wellness', 'Social', 'Safety', 'Services'] as const;

export default function Amenities() {
  const [activeGroup, setActiveGroup] = useState<typeof GROUPS[number]>('All');
  
  const filteredList = useMemo(() => 
    activeGroup === 'All' ? AMENITIES_LIST : AMENITIES_LIST.filter(a => a.group === activeGroup), 
  [activeGroup]);

  return (
    <PageTransition>
      <div className="bg-obsidian min-h-screen pb-32">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12 bg-neon-blue/40" />
              <span className="text-neon-blue text-[10px] font-black uppercase tracking-[0.6em]">The Artisan Standard</span>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-none"
                >
                  Beyond <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Comfort</span>.
                </motion.h1>
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 max-w-xl leading-relaxed mb-4 font-medium"
              >
                We've engineered every square inch of our sanctuaries to optimize your performance, wellness, and neural connectivity.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mb-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-wrap gap-4 mb-12">
              {GROUPS.map(g => (
                <motion.button 
                  key={g} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                    activeGroup === g 
                    ? 'bg-neon-blue border-neon-blue text-obsidian shadow-[0_0_20px_rgba(0,209,255,0.3)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                  onClick={() => setActiveGroup(g)}
                >
                  {g}
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] gap-6">
              <AnimatePresence mode="popLayout">
                {filteredList.map((a, i) => (
                  <motion.article 
                    layout
                    key={a.id} 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`
                      relative group overflow-hidden bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 flex flex-col justify-between transition-all duration-700
                      ${a.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : ''}
                      ${a.size === 'medium' ? 'lg:col-span-2' : ''}
                      hover:border-neon-blue/30 hover:bg-[#0B0E14]
                    `}
                  >
                    <div className="absolute top-0 right-0 p-8 text-neon-blue/5 group-hover:text-neon-blue/10 transition-colors transform scale-[4] rotate-[-15deg]">
                      {a.icon}
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-neon-blue border border-white/10 group-hover:bg-neon-blue group-hover:text-obsidian transition-all duration-500">
                        {a.icon}
                      </div>
                      <div className="flex items-center gap-2 bg-neon-green/10 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_#39FF14]" />
                        <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">{a.status}</span>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2 block">{a.group}</span>
                      <h3 className={`font-black text-white tracking-tight uppercase ${a.size === 'large' ? 'text-4xl mb-4' : 'text-xl mb-2'}`}>
                        {a.title}
                      </h3>
                      <p className={`text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors ${a.size === 'large' ? 'text-lg max-w-md' : 'text-xs'}`}>
                        {a.desc}
                      </p>
                    </div>

                    {/* Booking indicator */}
                    <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <span className="text-[9px] font-black text-neon-blue uppercase tracking-widest">Reserve Sync</span>
                      <div className="p-2 bg-neon-blue/20 text-neon-blue rounded-lg">
                        <Timer size={14} />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Global Concierge CTA */}
        <section className="max-w-7xl mx-auto px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-neon-blue/20 via-purple-500/10 to-transparent border border-white/10 rounded-[48px] p-16 lg:p-24 text-center">
             <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full -mr-48 -mt-48" />
             <div className="relative z-10">
                <Sparkles className="mx-auto text-neon-blue mb-8 animate-pulse" size={48} />
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic">Always-On Sanctuary</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">Our AI Concierge is syncing across all destinations. 24/7 support for the modern visionary.</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-6 bg-white text-obsidian font-black rounded-2xl shadow-2xl uppercase tracking-widest text-xs flex items-center gap-3 mx-auto transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Sync with Concierge
                </motion.button>
             </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
