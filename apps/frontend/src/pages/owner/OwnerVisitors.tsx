import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Clock, CheckCircle, Plus, X, LogIn, LogOut } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const MOCK_VISITORS: any[] = [
  { id: 1, visitor_name: 'Suresh Mehta', visitor_phone: '9876543210', purpose: 'Family visit', check_in: new Date().toISOString(), check_out: null, approved: true, resident: { full_name: 'Arjun Mehta' } },
  { id: 2, visitor_name: 'Delivery Agent — Swiggy', visitor_phone: null, purpose: 'Food delivery', check_in: new Date(Date.now() - 3600000).toISOString(), check_out: new Date(Date.now() - 3300000).toISOString(), approved: true, resident: { full_name: 'Priya Kumar' } },
  { id: 3, visitor_name: 'Neha Sharma', visitor_phone: '9988776655', purpose: 'Friend visit', check_in: new Date(Date.now() - 86400000).toISOString(), check_out: new Date(Date.now() - 79200000).toISOString(), approved: true, resident: { full_name: 'Rahul Singh' } },
];

export default function OwnerVisitors() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingOut, setCheckingOut] = useState<number | null>(null);
  const [form, setForm] = useState({ visitor_name: '', visitor_phone: '', purpose: '', resident_id: '1' });

  useEffect(() => {
    (async () => {
      try {
        // GET /api/visitors/property/:id
        setVisitors(MOCK_VISITORS);
      } catch { setVisitors(MOCK_VISITORS); }
      finally { setLoading(false); }
    })();
  }, []);

  const checkout = async (id: number) => {
    setCheckingOut(id);
    try {
      await apiClient.patch(`/visitors/${id}/checkout`, {});
    } catch { /* graceful */ }
    finally {
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, check_out: new Date().toISOString() } : v));
      setCheckingOut(null);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.post('/visitors', { ...form, property_id: 1, check_in: new Date().toISOString() });
    } catch { /* graceful */ }
    finally {
      setVisitors(prev => [{
        id: Date.now(), ...form,
        check_in: new Date().toISOString(), check_out: null, approved: true,
        resident: { full_name: 'Unknown Resident' }
      }, ...prev]);
      setShowForm(false);
      setSaving(false);
    }
  };

  const activeVisitors = visitors.filter(v => !v.check_out);

  return (
    <DashboardLayout title="Visitor Register">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Visitor Register</h2>
            <p className="text-slate-500 text-sm mt-1">Track everyone entering and leaving your property.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all">
            <Plus size={16} /> Log Visitor
          </button>
        </div>

        {/* Live badge */}
        {activeVisitors.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl w-fit">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-black">{activeVisitors.length} visitor{activeVisitors.length > 1 ? 's' : ''} currently inside</span>
          </motion.div>
        )}

        {/* Visitor Log Table */}
        <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
            <p className="text-white font-black">Today's Log</p>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{visitors.length} entries</p>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : visitors.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <Users size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-black text-white/20">No visitors logged today</p>
            </div>
          ) : (
            <AnimatePresence>
              {visitors.map((v, i) => {
                const isInside = !v.check_out;
                const duration = v.check_out
                  ? Math.round((new Date(v.check_out).getTime() - new Date(v.check_in).getTime()) / 60000)
                  : Math.round((Date.now() - new Date(v.check_in).getTime()) / 60000);
                return (
                  <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-5 px-8 py-6 border-b border-white/5 hover:bg-white/[0.015] transition-colors group">
                    {/* Status icon */}
                    <div className={`mt-1 p-2.5 rounded-xl shrink-0 ${isInside ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-400/10 text-slate-500'}`}>
                      {isInside ? <LogIn size={15} /> : <LogOut size={15} />}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold">{v.visitor_name}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{v.purpose || 'No purpose stated'}</span>
                        {v.visitor_phone && <><span className="w-1 h-1 bg-slate-700 rounded-full" /><span className="text-slate-500 text-[10px]">{v.visitor_phone}</span></>}
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-600 text-[10px]">Visiting: {v.resident?.full_name}</span>
                      </div>
                    </div>
                    {/* Time info */}
                    <div className="text-right shrink-0">
                      <p className="text-white text-sm font-bold flex items-center gap-1 justify-end">
                        <Clock size={12} className="text-slate-500" />
                        {new Date(v.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                        {isInside ? `${duration}m inside` : `${duration}m stay`}
                      </p>
                    </div>
                    {/* Checkout button */}
                    {isInside && (
                      <button onClick={() => checkout(v.id)} disabled={checkingOut === v.id}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 border border-rose-400/30 text-rose-400 bg-rose-400/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-400/15 transition-all disabled:opacity-40">
                        {checkingOut === v.id ? '...' : <><LogOut size={12} /> Check Out</>}
                      </button>
                    )}
                    {!isInside && (
                      <div className="shrink-0 flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle size={12} /> Checked Out
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Log Visitor Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white">Log Visitor</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Visitor Name *</label>
                  <input value={form.visitor_name} onChange={e => setForm(f => ({ ...f, visitor_name: e.target.value }))}
                    placeholder="Full name" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Phone</label>
                  <input value={form.visitor_phone} onChange={e => setForm(f => ({ ...f, visitor_phone: e.target.value }))}
                    placeholder="10-digit mobile" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Purpose</label>
                  <input value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                    placeholder="e.g. Family visit, delivery, interview" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={save} disabled={saving || !form.visitor_name}
                  className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                  {saving ? 'Logging...' : 'Check In'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
