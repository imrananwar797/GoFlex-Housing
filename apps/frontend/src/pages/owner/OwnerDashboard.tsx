import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ownerService } from '../../services/owner.service';
import { TrendingUp, Users, ShieldAlert, ChevronRight, Activity, DollarSign, Heart, Award, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

export default function OwnerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, residentsRes] = await Promise.all([
          ownerService.getDashboardStats(),
          ownerService.getResidents()
        ]);
        setStats(statsRes.stats);
        setResidents(residentsRes.data);
      } catch (error) {
        console.error('Error fetching owner dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin shadow-neon-blue" />
      </div>
    );
  }

  // Multi-property data for vacancy heatmap and profit details
  const heatmapData = [
    { room: '101', status: 'occupied' }, { room: '102', status: 'vacant' }, { room: '103', status: 'occupied' },
    { room: '104', status: 'occupied' }, { room: '201', status: 'occupied' }, { room: '202', status: 'occupied' },
    { room: '203', status: 'vacant' }, { room: '204', status: 'occupied' }, { room: '301', status: 'occupied' },
    { room: '302', status: 'occupied' }, { room: '303', status: 'occupied' }, { room: '304', status: 'occupied' }
  ];

  const profitData = [
    { name: 'Indiranagar', profit: 450000, revenue: 520000, cost: 70000 },
    { name: 'Koramangala', profit: 320000, revenue: 380000, cost: 60000 },
    { name: 'HSR Layout', profit: 180000, revenue: 240000, cost: 60000 },
  ];

  return (
    <DashboardLayout title="Portfolio Business Intelligence">
      <div className="space-y-10">
        
        {/* Core Business Metrics Hud */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Monthly Recurring Revenue', value: '₹5,20,000', icon: DollarSign, color: 'text-emerald-400', desc: 'MRR Growth +12%' },
            { label: 'Occupancy Rate', value: '94.2%', icon: Users, color: 'text-neon-blue', desc: 'Avg. 312 Active Days' },
            { label: 'Resident Satisfaction', value: '4.8/5.0', icon: Heart, color: 'text-rose-400', desc: '98% Positive Feedback' },
            { label: 'Complaint SLA Resolution', value: '2.4 hrs', icon: Award, color: 'text-violet-400', desc: 'Target: Under 4 hrs' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#080A0E]/60 border border-white/10 rounded-[28px] p-6 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider max-w-[80%]">{m.label}</p>
                <m.icon size={18} className={m.color} />
              </div>
              <p className="text-3xl font-black text-white">{m.value}</p>
              <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Business Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Vacancy Heatmap */}
          <div className="col-span-12 lg:col-span-4 bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
            <div>
              <h3 className="text-white text-lg font-black">Vacancy Heatmap</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Real-time room occupancy grid</p>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {heatmapData.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border text-center font-bold text-xs transition-all ${item.status === 'occupied' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'}`}>
                  {item.room}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Occupied (10)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Vacant (2)</span>
            </div>
          </div>

          {/* Profitability Per Property */}
          <div className="col-span-12 lg:col-span-8 bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-black">Profitability per Property</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Revenue vs Costs Breakdown</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-neon-blue rounded-md" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-md" /> Cost</span>
              </div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="revenue" fill="#00D1FF" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="cost" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Financial & Stay Dynamics HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Average Stay Duration', value: '14.2 months', change: '+2.1 mo this year', color: 'text-violet-400' },
            { label: 'Contract Renewal Rate', value: '88%', change: 'Target: 90%', color: 'text-emerald-400' },
            { label: 'Resident Churn Rate', value: '4.8%', change: '-1.2% lower', color: 'text-rose-400' },
            { label: 'Avg Utility Cost / Room', value: '₹1,240/mo', change: 'Optimized by solar grids', color: 'text-neon-blue' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#080A0E]/60 border border-white/10 rounded-[28px] p-6">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{item.label}</p>
              <p className={`text-2xl font-black ${item.color} mt-1`}>{item.value}</p>
              <p className="text-slate-600 text-[10px] mt-2 font-bold uppercase tracking-wide">{item.change}</p>
            </div>
          ))}
        </div>

        {/* AI Actionable Intelligence */}
        <div className="bg-neon-blue rounded-[32px] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <p className="text-[#0B0E14] text-[10px] font-black uppercase tracking-[0.2em]">Portfolio AI Advisor</p>
              <h3 className="text-[#0B0E14] text-2xl font-black">Insights & Optimization Panel</h3>
              <p className="text-[#0b0e14]/80 text-sm font-semibold leading-relaxed">
                Rent increases of 4.5% are recommended for GoFlex Koramangala node. Churn prediction flags Room 204 as low renewal likelihood.
              </p>
            </div>
            <button className="px-6 py-4 bg-[#0B0E14] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              Apply AI Actions <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

