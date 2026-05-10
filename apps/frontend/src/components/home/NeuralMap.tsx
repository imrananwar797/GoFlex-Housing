import React from 'react';
import { motion } from 'framer-motion';

const NODES = [
  { id: 1, x: '45%', y: '40%', name: 'Salt Lake Node', active: true },
  { id: 2, x: '60%', y: '55%', name: 'New Town Node', active: true },
  { id: 3, x: '35%', y: '65%', name: 'Park Street Node', active: false },
  { id: 4, x: '50%', y: '75%', name: 'Gariahat Node', active: true },
  { id: 5, x: '25%', y: '30%', name: 'Howrah Terminal', active: false }
];

export default function NeuralMap() {
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto bg-white/5 rounded-[60px] border border-white/5 overflow-hidden p-8 noise-texture">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20% 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M 20 0 L 0 0 0 20%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%220.5%22/%3E%3C/svg%3E')] opacity-50" />
      
      {/* Simulated City SVG */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
        <defs>
           <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00D1FF" stopOpacity="0" />
           </radialGradient>
        </defs>

        {/* Abstract Kolkata Path */}
        <path 
          d="M60 40 Q80 20 100 40 T140 60 Q160 80 140 100 T100 140 Q80 160 60 140 T20 100 Q0 80 20 60 T60 40" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {NODES.map((node, i) => (
          <g key={node.id}>
             <motion.circle
               cx={node.x}
               cy={node.y}
               r="12"
               fill="url(#nodeGlow)"
               initial={{ opacity: 0 }}
               animate={{ opacity: node.active ? [0.2, 0.5, 0.2] : 0.1 }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
             />
             <motion.circle
               cx={node.x}
               cy={node.y}
               r="3"
               fill={node.active ? "#00D1FF" : "#444"}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: i * 0.2 }}
             />
             {node.active && (
               <motion.circle
                 cx={node.x}
                 cy={node.y}
                 r="3"
                 fill="none"
                 stroke="#00D1FF"
                 strokeWidth="0.5"
                 initial={{ scale: 1, opacity: 1 }}
                 animate={{ scale: 4, opacity: 0 }}
                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
               />
             )}
          </g>
        ))}
      </svg>

      {/* Map UI Elements */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link: Active</span>
         </div>
         <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Kolkata Metropolitan Grid</div>
      </div>

      <div className="absolute bottom-8 right-8 text-right">
         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Grid Coordinates</p>
         <p className="text-[10px] font-mono text-white">22.5726° N, 88.3639° E</p>
      </div>
    </div>
  );
}
