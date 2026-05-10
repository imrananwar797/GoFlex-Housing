import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Zap, Star, Activity, Heart } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const ACTIVITIES = [
  { id: 1, user: 'Elara V.', action: 'booked the Sky-Deck', time: '2m ago', impact: '+12 Network Score' },
  { id: 2, user: 'Marcus T.', action: 'completed AI-KYC', time: '14m ago', impact: 'Verified Status' },
  { id: 3, user: 'Sia K.', action: 'shared a deep-work ritual', time: '1h ago', impact: '24 Likes' },
  { id: 4, user: 'Jaxon R.', action: 'synced with Mumbai Node', time: '3h ago', impact: 'Migration Success' }
];

export default function Community() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian pt-32 pb-20 px-8 noise-texture">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <span className="text-neon-blue text-[10px] font-black uppercase tracking-[1em] mb-6 block">Human Trace</span>
                <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-none mb-12">
                   Live <br /> <span className="italic font-normal text-slate-500">Pulse</span>.
                </h1>
              </div>

              <div className="space-y-6">
                {ACTIVITIES.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold mb-1">
                          <span className="text-neon-blue">{item.user}</span> {item.action}
                        </p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.time}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.impact}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 space-y-8">
                 <div className="flex items-center gap-4 text-neon-blue">
                    <Activity size={24} />
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Network Health</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Global Sync</span>
                          <span className="text-white">94%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-[94%] bg-neon-blue shadow-[0_0_15px_#00D1FF]" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Resource Efficiency</span>
                          <span className="text-white">88%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-[88%] bg-emerald-400 shadow-[0_0_15px_#39FF14]" />
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                      The Human Trace is a live aggregate of all resident interactions. High-performers contribute to the network's efficiency by optimizing their nodes.
                    </p>
                    <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                       Join The Discussion
                    </button>
                 </div>
              </div>

              <div className="p-10 rounded-[40px] bg-gradient-to-br from-neon-blue/10 to-purple-600/10 border border-white/5 text-center space-y-6">
                 <Heart className="text-pink-500 mx-auto" size={32} />
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Founder Perks</h4>
                 <p className="text-xs text-slate-400 font-medium">Founders receive early access to new nodes and exclusive community event invitations.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
