import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, ShieldCheck, Target } from 'lucide-react';

export default function OwnerAnalyticsHUD() {
  const maintenanceItems = [
    { name: 'A/C Unit Suite 04', wear: 85, color: 'text-orange-400', barColor: 'bg-orange-500' },
    { name: 'Water Heater Node 02', wear: 40, color: 'text-green-400', barColor: 'bg-green-500' },
  ];

  const trustHeatmap = [
    { city: 'Sector V', score: 94, color: 'text-neon-blue' },
    { city: 'New Town', score: 88, color: 'text-purple-400' },
    { city: 'Ballygunge', score: 96, color: 'text-green-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Yield Optimizer */}
      <div className="bg-neon-blue rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group min-h-[300px]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all duration-700" />
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Target size={16} className="text-[#0B0E14]" />
            <p className="text-[#0B0E14] text-[10px] font-black uppercase tracking-[0.3em]">AI Intelligence</p>
          </div>
          <h3 className="text-[#0B0E14] text-3xl font-black leading-tight mb-4">Yield Optimization</h3>
          <div className="bg-[#0B0E14]/10 backdrop-blur-md rounded-2xl p-4 border border-[#0B0E14]/10">
            <p className="text-[#0B0E14] text-xs font-bold leading-relaxed italic">
              "Market surge detected in Salt Lake Sector V. AI suggests increasing rent by <span className="font-black">4.2%</span> for Node #08."
            </p>
          </div>
        </div>
        <button className="w-full py-4 bg-[#0B0E14] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all">
          Apply Optimization
        </button>
      </div>

      {/* Predictive Health Forecast */}
      <div className="bg-obsidian-surface/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Preventative Care</p>
            <h3 className="text-white text-xl font-black">Appliance Health</h3>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
            <Activity size={20} />
          </div>
        </div>

        <div className="space-y-6">
          {maintenanceItems.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-white/80 text-[11px] font-bold">{item.name}</p>
                <p className={`${item.color} text-[10px] font-black`}>{item.wear}% WEAR</p>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.wear}%` }}
                  className={`h-full ${item.barColor} shadow-glow`}
                />
              </div>
            </div>
          ))}
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed pt-2">
            Schedule preventative fix to save ₹2,000 in emergency repair costs.
          </p>
        </div>
      </div>

      {/* Resident Trust Radar */}
      <div className="bg-obsidian-surface/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Sync Integrity</p>
            <h3 className="text-white text-xl font-black">Trust Heatmap</h3>
          </div>
          <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-2xl">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="space-y-4">
          {trustHeatmap.map((node, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
              <span className="text-white/80 text-xs font-bold">{node.city}</span>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${node.score > 90 ? 'bg-neon-blue' : 'bg-purple-500'} shadow-glow`} />
                <span className="text-white text-sm font-black">{node.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
