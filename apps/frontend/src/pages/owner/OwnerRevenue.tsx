import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ownerService } from '../../services/owner.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function OwnerRevenue() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ownerService.getDashboardStats();
        setStats(res.stats);
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueData = [
    { name: 'Jan', revenue: 45000, bookings: 12 },
    { name: 'Feb', revenue: 52000, bookings: 15 },
    { name: 'Mar', revenue: 48000, bookings: 14 },
    { name: 'Apr', revenue: 61000, bookings: 18 },
    { name: 'May', revenue: 55000, bookings: 16 },
    { name: 'Jun', revenue: 72000, bookings: 22 },
  ];

  return (
    <DashboardLayout title="Revenue Analytics">
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Gross Revenue</p>
              <h3 className="text-white text-3xl font-black">₹{stats?.total_revenue?.toLocaleString()}</h3>
              <p className="text-neon-green text-[10px] font-bold mt-2">+12.5% vs last month</p>
            </div>
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Pending Invoices</p>
              <h3 className="text-white text-3xl font-black">₹{(stats?.total_revenue * 0.15).toLocaleString()}</h3>
              <p className="text-slate-500 text-[10px] font-bold mt-2">8 residents waiting</p>
            </div>
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Occupancy ROI</p>
              <h3 className="text-white text-3xl font-black">{stats?.occupancy_rate?.toFixed(1)}%</h3>
              <p className="text-neon-blue text-[10px] font-bold mt-2">Above market average</p>
            </div>
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Direct Bookings</p>
              <h3 className="text-white text-3xl font-black">{stats?.active_residents}</h3>
              <p className="text-purple-500 text-[10px] font-bold mt-2">Active leases</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
              <h4 className="text-white text-lg font-black mb-8">Revenue Growth</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A7BFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8A7BFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#8A7BFF', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8A7BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
              <h4 className="text-white text-lg font-black mb-8">Booking Volume</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="bookings" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
