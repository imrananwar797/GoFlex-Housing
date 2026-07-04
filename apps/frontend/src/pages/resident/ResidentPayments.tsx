import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { CreditCard, Download, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const STATUS_STYLES: Record<string, string> = {
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  pending:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  failed:    'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

const STATUS_ICONS: Record<string, any> = {
  completed: CheckCircle,
  pending:   Clock,
  failed:    AlertCircle,
};

export default function ResidentPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get('/payments');
        setPayments(res.data.data || []);
      } catch {
        // seed mock data for demo
        setPayments([
          { id: 1, amount: 8500, status: 'completed', currency: 'INR', created_at: new Date(Date.now() - 2 * 30 * 86400000).toISOString() },
          { id: 2, amount: 8500, status: 'completed', currency: 'INR', created_at: new Date(Date.now() - 30 * 86400000).toISOString() },
          { id: 3, amount: 8500, status: 'pending',   currency: 'INR', created_at: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout title="Payments">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Payment History</h2>
            <p className="text-slate-500 text-sm mt-1">Total paid this year: <span className="text-emerald-400 font-black">₹{totalPaid.toLocaleString('en-IN')}</span></p>
          </div>
          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            {(['all', 'completed', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-500 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: 'text-emerald-400', icon: CheckCircle },
            { label: 'Pending', value: `₹${payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}`, color: 'text-amber-400', icon: Clock },
            { label: 'Transactions', value: payments.length, color: 'text-neon-blue', icon: CreditCard },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6 flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transaction Table */}
        <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
            <p className="font-black text-white">Transactions</p>
            <button className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
              <Download size={14} /> Export CSV
            </button>
          </div>
          {loading ? (
            <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-600">
              <CreditCard size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold">No transactions found</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((p, i) => {
                const StatusIcon = STATUS_ICONS[p.status] || Clock;
                return (
                  <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-8 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <CreditCard size={18} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">Rent Payment</p>
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <p className="text-white font-black text-lg">₹{p.amount.toLocaleString('en-IN')}</p>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[p.status] || ''}`}>
                      <StatusIcon size={12} />
                      {p.status}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white p-2 rounded-xl hover:bg-white/5">
                      <Download size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
