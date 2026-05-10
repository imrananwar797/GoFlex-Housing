import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OwnerAnalyticsHUD from '../../components/dashboard/OwnerAnalyticsHUD';
import EscrowYieldSnapshot from '../../components/dashboard/EscrowYieldSnapshot';
import { ownerService } from '../../services/owner.service';
import { TrendingUp, Users, Home as HomeIcon, BookOpen, ChevronRight, Zap } from 'lucide-react';

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

  return (
    <DashboardLayout title="Portfolio Intelligence">
      <div className="space-y-12">
        {/* V5 Analytics Layer */}
        <OwnerAnalyticsHUD />

        {/* Main Intelligence Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Revenue Ledger Card */}
          <div className="col-span-12 lg:col-span-8 bg-[#080A0E]/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Border Beam Animation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-border-beam" />
            </div>

            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-white text-3xl font-black mb-2">Revenue Streams</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Real-time portfolio performance tracking</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-emerald-400 text-2xl font-black">+₹48,200</p>
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">This Month</p>
                </div>
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Sync Fees", value: "₹2.4L", icon: Zap },
                { label: "Occupancy", value: "94%", icon: Users },
                { label: "Asset Value", value: "₹1.8Cr", icon: HomeIcon }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/10 transition-all">
                  <item.icon size={18} className="text-neon-blue mb-4" />
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-white text-2xl font-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Web3 Escrow Card */}
          <div className="col-span-12 lg:col-span-4">
            <EscrowYieldSnapshot />
          </div>

          {/* Visionary Collective Module (Resident Management) */}
          <div className="col-span-12 bg-[#080A0E]/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-white text-2xl font-black mb-1">Visionary Collective</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Manage high-performance residents in your nodes</p>
              </div>
              <button className="flex items-center gap-2 text-neon-blue text-[10px] font-black uppercase tracking-[0.2em] hover:gap-4 transition-all">
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residents.slice(0, 3).map((r, idx) => (
                <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-[32px] group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue text-lg font-black uppercase shadow-glow-small">
                      {r.username.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{r.full_name || r.username}</h4>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{r.property_name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-white text-[10px] font-bold">Score: 98</span>
                    </div>
                    <button className="text-neon-blue text-[9px] font-black uppercase tracking-widest hover:underline">
                      Reward Sanctuary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
