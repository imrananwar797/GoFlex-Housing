import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, AlertCircle, CheckCircle2, Wrench } from 'lucide-react';

export default function InteractiveFloorplan() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [ticketStatus, setTicketStatus] = useState<Record<string, string>>({
    'Living': 'Optimal',
    'Rest': 'Optimal',
    'Tech-Zone': 'Optimal'
  });

  const handleTicket = (room: string) => {
    setActiveRoom(room);
  };

  const submitTicket = (room: string) => {
    setTicketStatus(prev => ({ ...prev, [room]: 'Ticket Raised' }));
    setActiveRoom(null);
  };

  return (
    <div className="bg-obsidian-surface/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 h-full relative overflow-hidden group">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Interactive Node</p>
          <h3 className="text-white text-xl font-black">Spatial Maintenance</h3>
        </div>
        <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-2xl">
          <Box size={20} />
        </div>
      </div>

      <div className="relative aspect-square max-w-[300px] mx-auto perspective-1000">
        <motion.div 
          animate={{ rotateX: 60, rotateZ: -45 }}
          className="w-full h-full relative transform-style-3d"
        >
          {/* Living Area */}
          <motion.div 
            whileHover={{ translateZ: 20 }}
            onClick={() => handleTicket('Living')}
            className={`absolute top-0 left-0 w-1/2 h-full border-2 rounded-tl-2xl transition-all cursor-pointer ${ticketStatus['Living'] === 'Optimal' ? 'bg-white/5 border-white/10 hover:bg-neon-blue/20 hover:border-neon-blue/50' : 'bg-orange-500/10 border-orange-500/50'}`}
          >
            <span className="absolute top-2 left-2 text-[8px] font-black text-white/40 uppercase tracking-widest">Living</span>
          </motion.div>

          {/* Rest Area */}
          <motion.div 
            whileHover={{ translateZ: 20 }}
            onClick={() => handleTicket('Rest')}
            className={`absolute top-0 left-1/2 w-1/2 h-1/2 border-2 rounded-tr-2xl transition-all cursor-pointer ${ticketStatus['Rest'] === 'Optimal' ? 'bg-white/5 border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50' : 'bg-orange-500/10 border-orange-500/50'}`}
          >
            <span className="absolute top-2 left-2 text-[8px] font-black text-white/40 uppercase tracking-widest">Rest</span>
          </motion.div>

          {/* Tech-Zone */}
          <motion.div 
            whileHover={{ translateZ: 20 }}
            onClick={() => handleTicket('Tech-Zone')}
            className={`absolute bottom-0 left-1/2 w-1/2 h-1/2 border-2 rounded-br-2xl transition-all cursor-pointer ${ticketStatus['Tech-Zone'] === 'Optimal' ? 'bg-white/5 border-white/10 hover:bg-green-500/20 hover:border-green-500/50' : 'bg-orange-500/10 border-orange-500/50'}`}
          >
            <span className="absolute top-2 left-2 text-[8px] font-black text-white/40 uppercase tracking-widest">Tech</span>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {activeRoom && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-4"
            >
              <div className="bg-obsidian border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
                <h4 className="text-white text-sm font-black mb-1">Issue in {activeRoom}?</h4>
                <p className="text-slate-500 text-[10px] mb-4">Maintenance team will be notified immediately.</p>
                <div className="flex gap-2">
                  <button onClick={() => setActiveRoom(null)} className="flex-1 py-2 bg-white/5 text-slate-400 text-[9px] font-black uppercase rounded-lg">Cancel</button>
                  <button onClick={() => submitTicket(activeRoom)} className="flex-1 py-2 bg-neon-blue text-obsidian text-[9px] font-black uppercase rounded-lg">Raise Ticket</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 space-y-2">
        {Object.entries(ticketStatus).map(([room, status]) => (
          <div key={room} className="flex justify-between items-center px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[10px] font-bold text-white/60">{room}</span>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'Optimal' ? 'text-green-400' : 'text-orange-400'}`}>{status}</span>
              {status === 'Optimal' ? <CheckCircle2 size={12} className="text-green-400" /> : <AlertCircle size={12} className="text-orange-400 animate-pulse" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
