import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OwnerRevenue() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    api.get(`/api/owner/revenue?year=${year}`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  const totalRevenue = data?.totalRevenue || 0;
  const monthly = data?.monthly || [];
  const payments = data?.payments || [];

  return (
    <DashboardLayout title="Revenue Analytics">
      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Revenue Analytics</h2>
            <p className="text-slate-500 text-sm mt-0.5">Detailed financial performance</p>
          </div>
          <select
            value={year}
            onChange={e => { setYear(Number(e.target.value)); setLoading(true); }}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:outline-none"
          >
            {[2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-[20px] p-6 col-span-1 sm:col-span-2">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Collected ({year})</p>
            <p className="text-white font-black text-4xl mt-2">
              ₹{(totalRevenue / 100000).toFixed(2)}L
            </p>
            <p className="text-emerald-400 text-xs mt-2 font-semibold">₹{totalRevenue.toLocaleString('en-IN')} total</p>
          </div>
          <div className="bg-neon-blue/10 border border-neon-blue/20 rounded-[20px] p-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Transactions</p>
            <p className="text-white font-black text-4xl mt-2">{payments.length}</p>
            <p className="text-neon-blue text-xs mt-2 font-semibold">Completed payments</p>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
          <p className="text-white font-black text-sm mb-1">Monthly Breakdown</p>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">{year} — month-over-month revenue</p>
          {loading ? (
            <div className="h-56 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#0B0E14', border: '1px solid #ffffff15', borderRadius: 12, color: '#fff' }}
                  formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#00D1FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-white font-black text-sm">Recent Transactions</p>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 h-16 flex items-center gap-4">
                  <div className="h-4 bg-white/5 rounded flex-1 animate-pulse" />
                </div>
              ))
            ) : payments.length === 0 ? (
              <p className="text-center py-12 text-slate-600 font-semibold">No transactions for {year}</p>
            ) : (
              payments.slice(0, 15).map((p: any) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-400/10">
                      <CreditCard size={14} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{p.booking?.property?.name || 'Rent Payment'}</p>
                      <p className="text-slate-500 text-xs">{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <p className="text-emerald-400 font-black text-sm">+₹{p.amount?.toLocaleString('en-IN')}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
