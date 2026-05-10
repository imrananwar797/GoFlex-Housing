import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Star, Globe, TrendingUp } from 'lucide-react';

interface PulseItem {
  id: string;
  type: 'booking' | 'achievement' | 'new_member' | 'event';
  text: string;
  user: string;
  time: string;
}

const INITIAL_ITEMS: PulseItem[] = [
  { id: '1', type: 'new_member', user: 'Alex V.', text: 'joined the Neo-Kyoto sanctuary', time: 'Just now' },
  { id: '2', type: 'booking', user: 'Sarah M.', text: 'booked the Artisan Loft in Mumbai', time: '2m ago' },
  { id: '3', type: 'achievement', user: 'Kiran R.', text: 'achieved Founder Resident status', time: '5m ago' },
  { id: '4', type: 'event', user: 'Pulse', text: 'Rooftop Networking starts in 30 mins', time: '10m ago' },
];

export default function CommunityPulse() {
  const [items, setItems] = useState<PulseItem[]>(INITIAL_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newItem: PulseItem = {
        id: Date.now().toString(),
        type: ['booking', 'achievement', 'new_member', 'event'][Math.floor(Math.random() * 4)] as any,
        user: ['James K.', 'Priya S.', 'Liam N.', 'Elena G.'][Math.floor(Math.random() * 4)],
        text: [
          'secured a space in Jaipur',
          'unlocked the Platinum tier',
          'just upgraded their residency',
          'is hosting a neural-link workshop',
        ][Math.floor(Math.random() * 4)],
        time: 'Just now',
      };

      setItems(prev => [newItem, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Globe className="text-neon-blue" size={14} />;
      case 'achievement': return <Star className="text-yellow-400" size={14} />;
      case 'new_member': return <User className="text-neon-green" size={14} />;
      default: return <Zap className="text-purple-400" size={14} />;
    }
  };

  return (
    <div className="bg-[#080A0E]/40 border border-white/5 rounded-[32px] p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#39FF14]" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Live Community Pulse</h3>
        </div>
        <TrendingUp size={14} className="text-slate-500" />
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl transition-all hover:bg-white/10"
            >
              <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-white">
                  <span className="text-neon-blue">{item.user}</span> {item.text}
                </p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
