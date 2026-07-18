import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import {
  Users, Building2, CreditCard, AlertCircle, ShieldCheck,
  TrendingUp, Home, BadgeCheck, ChevronRight, Clock, Activity
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers?.toLocaleString(), icon: Users, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20', sub: `${stats.totalResidents} residents · ${stats.totalOwners} owners` },
    { label: 'Properties', value: stats.totalProperties?.toLocaleString(), icon: Building2, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', sub: `${stats.occupancyRate}% avg occupancy` },
    { label: 'Platform Revenue', value: `₹${((stats.totalRevenue || 0) / 100000).toFixed(1)}L`, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', sub: `${stats.totalPayments} transactions` },
    { label: 'Open Complaints', value: stats.openComplaints?.toLocaleString(), icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', sub: 'Needs attention' },
    { label: 'Active Bookings', value: stats.activeBookings?.toLocaleString(), icon: Home, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', sub: `of ${stats.totalBookings} total` },
    { label: 'Pending KYC', value: stats.pendingKYC?.toLocaleString(), icon: BadgeCheck, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', sub: 'Awaiting review' },
  ] : [];

  return (
    <DashboardLayout title="Admin Command Center">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Platform Overview</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time GoFlex Housing metrics</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-400/20 rounded-xl">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">System Online</span>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-[24px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <div key={card.label} className={`bg-[#080A0E]/60 border ${card.border} rounded-[24px] p-6 flex items-start gap-4`}>
                <div className={`p-3 rounded-xl ${card.bg} flex-shrink-0`}>
                  <card.icon size={22} className={card.color} />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{card.value ?? '--'}</p>
                  <p className="text-slate-500 text-xs mt-1">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Row */}
        {!loading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Revenue Chart */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
              <p className="text-white font-black text-sm mb-1">Monthly Revenue</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Last 6 months · INR</p>
              {stats.monthlyRevenue?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.monthlyRevenue}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00D1FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#0B0E14', border: '1px solid #ffffff15', borderRadius: 12, color: '#fff' }}
                      formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#00D1FF" fill="url(#rev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No revenue data yet</div>
              )}
            </div>

            {/* User Growth Chart */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
              <p className="text-white font-black text-sm mb-1">User Growth</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">New registrations per month</p>
              {stats.userGrowth?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0B0E14', border: '1px solid #ffffff15', borderRadius: 12, color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No user data yet</div>
              )}
            </div>
          </div>
        )}

        {/* Quick Admin Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/admin/users', label: 'Manage Users', icon: Users, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20' },
            { to: '/admin/properties', label: 'Verify Properties', icon: Building2, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
            { to: '/admin/bookings', label: 'All Bookings', icon: Home, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
            { to: '/admin/complaints', label: 'Complaints', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
          ].map(a => (
            <NavLink
              key={a.to} to={a.to}
              className={`flex items-center justify-between p-5 bg-[#080A0E]/60 border ${a.border} rounded-[20px] hover:scale-[1.02] transition-all group`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${a.bg}`}><a.icon size={16} className={a.color} /></div>
                <span className="text-white font-bold text-sm">{a.label}</span>
              </div>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
            </NavLink>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
