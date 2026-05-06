import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TickerGrid from '../components/dashboard/TickerCards';
import ConsumptionChart from '../components/dashboard/ConsumptionChart';
import GlassTable from '../components/dashboard/GlassTable';
import { api } from '../services/api';

export function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/analytics/resident')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin shadow-neon-blue" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Resident Overview">
      <div className="space-y-8">
        {/* Top Ticker Section */}
        <section>
          <TickerGrid />
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Chart Section - 8 cols */}
          <div className="col-span-12 lg:col-span-8">
            <ConsumptionChart />
          </div>

          {/* Quick Info / Sidebar in Bento - 4 cols */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-neon-blue/20 rounded-2xl p-6 h-full flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-3xl -mr-16 -mt-16 group-hover:bg-neon-blue/10 transition-colors duration-500" />
              
              <p className="text-neon-blue text-[9px] font-black uppercase tracking-[0.4em] mb-4 relative z-10">Membership Status</p>
              <h4 className="text-white text-2xl font-black mb-1 relative z-10">Premium Resident</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest relative z-10">Expires: 24 May 2024</p>
              
              <div className="mt-8 relative z-10">
                <button className="w-full py-3.5 bg-neon-blue text-[#0B0E14] font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)] hover:shadow-[0_0_30px_rgba(0,209,255,0.4)]">
                  Upgrade Residency
                </button>
              </div>
            </div>
          </div>

          {/* Table Section - 12 cols */}
          <div className="col-span-12">
            <GlassTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
