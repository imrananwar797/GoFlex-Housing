import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AlertCircle, Plus, X, CheckCircle, Clock, Zap, ChevronDown } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const CATEGORIES = ['maintenance', 'cleanliness', 'noise', 'security', 'electricity', 'water', 'internet', 'other'];
const PRIORITIES  = ['low', 'medium', 'high', 'urgent'];
const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-slate-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  urgent: 'text-rose-400',
};
const STATUS_COLORS: Record<string, string> = {
  open: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  in_progress: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  closed: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

export default function ResidentComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: 'maintenance', priority: 'medium', title: '', description: '' });

  const load = async () => {
    try {
      const res = await apiClient.get('/complaints');
      setComplaints(res.data.data || []);
    } catch {
      setComplaints([
        { id: 1, title: 'Fan not working in room', category: 'maintenance', priority: 'high', status: 'in_progress', created_at: new Date().toISOString() },
        { id: 2, title: 'Bathroom cleaning delayed', category: 'cleanliness', priority: 'medium', status: 'open', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.post('/complaints', form);
      setShowForm(false);
      setForm({ category: 'maintenance', priority: 'medium', title: '', description: '' });
      load();
    } catch { /* show toast */ }
    finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Complaints">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">My Complaints</h2>
            <p className="text-slate-500 text-sm mt-1">Raise and track maintenance issues instantly.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all"
          >
            <Plus size={16} /> New Complaint
          </button>
        </div>

        {/* New Complaint Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                className="w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-white">Raise a Complaint</h3>
                  <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-neon-blue/50">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B0E14]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Priority</label>
                      <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-neon-blue/50">
                        {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0B0E14]">{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Title</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Fan not working in Room 204"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3} placeholder="Describe the issue in detail..."
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50 resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
                  <button onClick={submit} disabled={submitting || !form.title.trim()}
                    className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complaints List */}
        <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : complaints.length === 0 ? (
            <div className="p-16 text-center">
              <CheckCircle size={48} className="text-emerald-400/30 mx-auto mb-4" />
              <p className="text-white font-black text-lg">No active complaints</p>
              <p className="text-slate-500 text-sm mt-2">You're all good! Click "New Complaint" if something needs attention.</p>
            </div>
          ) : (
            complaints.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-5 px-8 py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <div className={`mt-1 p-2.5 rounded-xl bg-white/5 ${PRIORITY_COLORS[c.priority]}`}>
                  <AlertCircle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold">{c.title}</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span>{c.category}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className={PRIORITY_COLORS[c.priority]}>{c.priority}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span>{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[c.status] || ''}`}>
                  {c.status}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
