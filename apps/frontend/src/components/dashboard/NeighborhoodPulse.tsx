import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Coffee, Rocket } from 'lucide-react';

const PULSE_EVENTS = [
  { id: 1, type: 'Event', message: 'Exclusive Founder meetup at Blue Tokai', dist: '300m away', icon: Users, color: 'text-neon-blue' },
  { id: 2, type: 'Activation', message: 'Resident #04 checked into Salt Lake Node', dist: 'Live', icon: Rocket, color: 'text-purple-400' },
  { id: 3, type: 'Venue', message: 'New High-Performance Cafe opened nearby', dist: '150m away', icon: Coffee, color: 'text-green-400' },
  { id: 4, type: 'Network', message: 'Node #08 uptime stabilized at 99.99%', dist: 'System', icon: MapPin, color: 'text-orange-400' },
];

export default function NeighborhoodPulse() {
  return (
    <div className="bg-obsidian-surface/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Neighborhood Pulse</p>
          <h3 className="text-white text-xl font-black">Local Telemetry</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-neon-blue animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 h-1 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="relative h-[250px] overflow-hidden">
        <motion.div 
          animate={{ y: [0, -400] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="space-y-4"
        >
          {[...PULSE_EVENTS, ...PULSE_EVENTS].map((event, idx) => (
            <div key={`${event.id}-${idx}`} className="group p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] transition-all">
              <div className={`p-2.5 rounded-xl bg-white/5 ${event.color}`}>
                <event.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{event.type}</span>
                  <span className="text-[9px] font-bold text-neon-blue/60">{event.dist}</span>
                </div>
                <p className="text-white text-xs font-bold leading-relaxed">{event.message}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Fades */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-obsidian-surface via-obsidian-surface/0 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-obsidian-surface via-obsidian-surface/0 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
