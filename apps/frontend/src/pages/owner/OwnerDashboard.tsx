import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { NavLink } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Building2, Users, CreditCard, Home, TrendingUp,
  AlertCircle, ChevronRight, Star, PlusCircle, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function OwnerDashboard() {
  const [dash, setDash] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/owner/dashboard')
      .then(r => setDash(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = dash ? [
    { label: 'Total Properties', value: dash.totalProperties, icon: Building2, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20' },
    { label: 'Total Rooms', value: dash.totalRooms, icon: Home, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
    { label: 'Active Residents', value: dash.activeBookings, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Monthly Revenue', value: `₹${(dash.totalRevenue || 0).toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    { label: 'Occupancy Rate', value: `${dash.occupancyRate}%`, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
    { label: 'Open Complaints', value: dash.openComplaints, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  ] : [];

  return (
    <DashboardLayout title="Owner Command Center">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Property Portfolio</h2>
            <p className="text-slate-500 text-sm mt-1">Live performance across all your properties</p>
          </div>
          <NavLink
            to="/owner/properties"
            className="flex items-center gap-2 px-5 py-3 bg-neon-blue text-[#0b0e14] font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all"
          >
            <PlusCircle size={14} /> Add Property
          </NavLink>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/5 rounded-[24px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {statCards.map(card => (
              <div key={card.label} className={`bg-[#080A0E]/60 border ${card.border} rounded-[24px] p-6 flex items-center gap-4`}>
                <div className={`p-3 rounded-xl ${card.bg} flex-shrink-0`}>
                  <card.icon size={22} className={card.color} />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{card.value ?? '--'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {!loading && dash && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Revenue Chart */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
              <p className="text-white font-black text-sm mb-1">Revenue History</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Month-over-month collections</p>
              {dash.monthlyRevenue?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dash.monthlyRevenue}>
                    <defs>
                      <linearGradient id="ownerRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#0B0E14', border: '1px solid #ffffff15', borderRadius: 12, color: '#fff' }}
                      formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#ownerRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No revenue data yet. Add bookings to see trends.</div>
              )}
            </div>

            {/* Occupancy Donut */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
              <p className="text-white font-black text-sm mb-1">Room Occupancy</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Current availability status</p>
              <div className="flex flex-col gap-4 justify-center h-48">
                <div className="flex justify-between items-center p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl">
                  <div>
                    <p className="text-emerald-400 font-black text-2xl">{dash.occupiedRooms}</p>
                    <p className="text-slate-400 text-xs font-semibold">Occupied Rooms</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-400/30 flex items-center justify-center">
                    <span className="text-emerald-400 font-black text-sm">{dash.occupancyRate}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-2xl">
                  <div>
                    <p className="text-neon-blue font-black text-2xl">{dash.availableRooms}</p>
                    <p className="text-slate-400 text-xs font-semibold">Available Rooms</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-neon-blue/30 flex items-center justify-center">
                    <span className="text-neon-blue font-black text-sm">{100 - (dash.occupancyRate || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/owner/properties', label: 'My Properties', icon: Building2 },
            { to: '/owner/residents', label: 'My Residents', icon: Users },
            { to: '/owner/revenue', label: 'Revenue', icon: CreditCard },
            { to: '/owner/complaints', label: 'Complaints', icon: AlertCircle },
          ].map(item => (
            <NavLink
              key={item.to} to={item.to}
              className="flex items-center justify-between p-5 bg-[#080A0E]/60 border border-white/10 rounded-[20px] hover:border-white/20 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className="text-neon-blue" />
                <span className="text-white font-bold text-sm">{item.label}</span>
              </div>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
            </NavLink>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
