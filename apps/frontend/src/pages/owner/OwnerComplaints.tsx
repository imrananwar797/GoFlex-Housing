import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AlertCircle, CheckCircle, Clock, Zap, Filter, ChevronDown, X } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const PRIORITY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  urgent: { text: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/30' },
  high:   { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  medium: { text: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/30' },
  low:    { text: 'text-slate-400',  bg: 'bg-slate-400/10',  border: 'border-slate-400/20' },
};

const STATUS_NEXT: Record<string, string> = {
  open: 'in_progress',
  in_progress: 'resolved',
  resolved: 'closed',
  closed: 'open',
};
const STATUS_LABEL: Record<string, string> = {
  open: 'Mark In Progress',
  in_progress: 'Mark Resolved',
  resolved: 'Close',
  closed: 'Reopen',
};
const STATUS_COLORS: Record<string, string> = {
  open: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  in_progress: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  closed: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

const MOCK: any[] = [
  { id: 1, title: 'AC not cooling in Room 204', category: 'maintenance', priority: 'high', status: 'open', created_at: new Date().toISOString(), resident: { full_name: 'Arjun Mehta' }, property: { name: 'GoFlex Indiranagar' } },
  { id: 2, title: 'Bathroom tiles cracked', category: 'maintenance', priority: 'medium', status: 'in_progress', created_at: new Date(Date.now() - 86400000).toISOString(), resident: { full_name: 'Priya Kumar' }, property: { name: 'GoFlex Koramangala' } },
  { id: 3, title: 'WiFi drops every evening', category: 'internet', priority: 'urgent', status: 'open', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), resident: { full_name: 'Rahul Singh' }, property: { name: 'GoFlex Indiranagar' } },
  { id: 4, title: 'Common area not cleaned', category: 'cleanliness', priority: 'low', status: 'resolved', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), resident: { full_name: 'Sneha Patel' }, property: { name: 'GoFlex HSR' } },
];

export default function OwnerComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await apiClient.get('/complaints');
      setComplaints(res.data.data || []);
    } catch { setComplaints(MOCK); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const advance = async (c: any) => {
    setUpdating(c.id);
    try {
      await apiClient.patch(`/complaints/${c.id}/status`, { status: STATUS_NEXT[c.status] });
      setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: STATUS_NEXT[c.status] } : x));
    } catch {
      setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: STATUS_NEXT[c.status] } : x));
    } finally { setUpdating(null); }
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  const counts = {
    open: complaints.filter(c => c.status === 'open').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <DashboardLayout title="Complaint Management">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white">Complaint Management</h2>
          <p className="text-slate-500 text-sm mt-1">Resolve resident issues to protect your GoFlex Score.</p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Open', count: counts.open,        color: 'text-amber-400', bg: 'bg-amber-400/5 border-amber-400/20', icon: AlertCircle },
            { label: 'In Progress', count: counts.in_progress, color: 'text-sky-400', bg: 'bg-sky-400/5 border-sky-400/20', icon: Clock },
            { label: 'Resolved', count: counts.resolved, color: 'text-emerald-400', bg: 'bg-emerald-400/5 border-emerald-400/20', icon: CheckCircle },
          ].map((s, i) => (
            <motion.button key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => setFilter(s.label.toLowerCase().replace(' ', '_'))}
              className={`flex items-center gap-4 p-6 rounded-[24px] border transition-all ${filter === s.label.toLowerCase().replace(' ', '_') ? s.bg + ' scale-[1.02]' : 'bg-[#080A0E]/60 border-white/10 hover:border-white/20'}`}>
              <s.icon size={24} className={s.color} />
              <div className="text-left">
                <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Filter + Table */}
        <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
            <p className="text-white font-black">
              {filter === 'all' ? 'All Complaints' : `${filter.replace('_', ' ')} (${filtered.length})`}
            </p>
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              {['all', 'open', 'in_progress', 'resolved', 'closed'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-neon-blue/20 text-neon-blue' : 'text-slate-500 hover:text-white'}`}>
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <CheckCircle size={40} className="mx-auto mb-4 text-emerald-400/30" />
              <p className="font-black text-white/20">No complaints in this category</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((c, i) => {
                const pc = PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium;
                return (
                  <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-5 px-8 py-6 border-b border-white/5 hover:bg-white/[0.015] transition-colors group">
                    {/* Priority dot */}
                    <div className={`mt-1.5 p-2.5 rounded-xl ${pc.bg} ${pc.text} shrink-0`}>
                      <AlertCircle size={15} />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold">{c.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{c.category}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${pc.text}`}>{c.priority}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-500 text-[10px]">{c.resident?.full_name}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-600 text-[10px]">{c.property?.name}</span>
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shrink-0 ${STATUS_COLORS[c.status] || ''}`}>
                      {c.status.replace('_', ' ')}
                    </div>
                    {/* Advance button */}
                    {c.status !== 'closed' && (
                      <button onClick={() => advance(c)} disabled={updating === c.id}
                        className="shrink-0 px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all disabled:opacity-40 whitespace-nowrap">
                        {updating === c.id ? '...' : STATUS_LABEL[c.status]}
                      </button>
                    )}
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
