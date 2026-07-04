import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Plus, X, CheckCircle, Clock, AlertCircle, Shield, Download, Send, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const STATUS_META: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  draft:   { label: 'Draft',   icon: Clock,        color: 'text-slate-400',   bg: 'bg-slate-400/10',  border: 'border-slate-400/20'  },
  sent:    { label: 'Sent',    icon: Send,         color: 'text-amber-400',   bg: 'bg-amber-400/10',  border: 'border-amber-400/20'  },
  signed:  { label: 'Signed',  icon: CheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-400/10',border: 'border-emerald-400/20'},
  expired: { label: 'Expired', icon: AlertCircle,  color: 'text-rose-400',    bg: 'bg-rose-400/10',   border: 'border-rose-400/20'   },
};

const MOCK_AGREEMENTS: any[] = [
  { id: 1, status: 'signed',  rent_amount: 8500,  security_deposit: 17000, start_date: '2026-01-01', end_date: '2026-12-31', resident_signed: true,  owner_signed: true,  property: { name: 'GoFlex Indiranagar', city: 'Bengaluru' }, resident: { full_name: 'Arjun Mehta', email: 'arjun@example.com' } },
  { id: 2, status: 'sent',    rent_amount: 12000, security_deposit: 24000, start_date: '2026-03-01', end_date: '2027-02-28', resident_signed: false, owner_signed: true,  property: { name: 'GoFlex Koramangala', city: 'Bengaluru' }, resident: { full_name: 'Priya Kumar', email: 'priya@example.com' } },
  { id: 3, status: 'draft',   rent_amount: 9500,  security_deposit: 19000, start_date: '2026-07-01', end_date: '2027-06-30', resident_signed: false, owner_signed: false, property: { name: 'GoFlex HSR',         city: 'Bengaluru' }, resident: { full_name: 'Rahul Singh',  email: 'rahul@example.com' } },
  { id: 4, status: 'expired', rent_amount: 7000,  security_deposit: 14000, start_date: '2025-07-01', end_date: '2026-06-30', resident_signed: true,  owner_signed: true,  property: { name: 'GoFlex Indiranagar', city: 'Bengaluru' }, resident: { full_name: 'Sneha Patel',  email: 'sneha@example.com' } },
];

export default function OwnerAgreements() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState<number | null>(null);
  const [form, setForm] = useState({
    property_id: '1', resident_id: '', rent_amount: '', security_deposit: '',
    start_date: '', end_date: '', notice_period: '30',
  });

  const load = async () => {
    try {
      const res = await apiClient.get('/agreements');
      setAgreements(res.data.data?.length ? res.data.data : MOCK_AGREEMENTS);
    } catch { setAgreements(MOCK_AGREEMENTS); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      await apiClient.post('/agreements/generate', form);
      load();
      setShowForm(false);
    } catch {
      setAgreements(prev => [{
        id: Date.now(), status: 'draft', ...form,
        rent_amount: Number(form.rent_amount),
        security_deposit: Number(form.security_deposit),
        resident_signed: false, owner_signed: false,
        property: { name: 'GoFlex Indiranagar', city: 'Bengaluru' },
        resident: { full_name: `Resident #${form.resident_id}`, email: '' },
      }, ...prev]);
      setShowForm(false);
    } finally { setGenerating(false); }
  };

  const sendToResident = async (id: number) => {
    setSending(id);
    try {
      await apiClient.post(`/agreements/${id}/sign`, {});
    } catch { /* graceful */ }
    finally {
      setAgreements(prev => prev.map(a => a.id === id ? { ...a, status: 'sent', owner_signed: true } : a));
      setSending(null);
    }
  };

  const filtered = filter === 'all' ? agreements : agreements.filter(a => a.status === filter);

  const daysUntilExpiry = (end: string) => Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <DashboardLayout title="Agreements">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Rental Agreements</h2>
            <p className="text-slate-500 text-sm mt-1">Generate, send, and track all digital rental agreements.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all">
            <Plus size={16} /> Generate Agreement
          </button>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
          {['all', 'draft', 'sent', 'signed', 'expired'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-500 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Renewal Alerts */}
        {agreements.filter(a => a.status === 'signed' && daysUntilExpiry(a.end_date) <= 60 && daysUntilExpiry(a.end_date) > 0).map(a => (
          <motion.div key={`alert-${a.id}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-5 py-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
            <RefreshCw size={18} className="text-amber-400 shrink-0" />
            <p className="text-amber-400 text-sm font-bold flex-1">
              Agreement for <span className="font-black">{a.resident?.full_name}</span> expires in <span className="font-black">{daysUntilExpiry(a.end_date)} days</span>
            </p>
            <button className="px-4 py-2 border border-amber-400/30 text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400/10 transition-all whitespace-nowrap">
              Renew Now
            </button>
          </motion.div>
        ))}

        {/* Agreement Cards */}
        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-44 bg-white/5 rounded-[32px] animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-slate-600">
            <FileText size={48} className="mb-4 opacity-30" />
            <p className="font-black text-white/20 text-lg">No agreements in this category</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((a, i) => {
              const meta = STATUS_META[a.status] || STATUS_META.draft;
              const days = daysUntilExpiry(a.end_date);
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <FileText size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-black">{a.resident?.full_name}</p>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{a.property?.name} · {a.property?.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.status !== 'expired' && (
                        <div className={`text-[10px] font-black uppercase tracking-widest ${days <= 30 ? 'text-rose-400' : days <= 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {days > 0 ? `${days}d left` : 'Expired'}
                        </div>
                      )}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${meta.bg} ${meta.border} ${meta.color}`}>
                        <meta.icon size={12} />
                        {meta.label}
                      </div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border-b border-white/5">
                    {[
                      { label: 'Monthly Rent',     value: `₹${Number(a.rent_amount).toLocaleString('en-IN')}` },
                      { label: 'Security Deposit', value: `₹${Number(a.security_deposit).toLocaleString('en-IN')}` },
                      { label: 'Start Date',       value: new Date(a.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) },
                      { label: 'End Date',         value: new Date(a.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) },
                    ].map((d, di) => (
                      <div key={di} className="px-6 py-4 bg-[#080A0E]/80">
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">{d.label}</p>
                        <p className="text-white font-black text-sm">{d.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Signature status + actions */}
                  <div className="px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {a.owner_signed ? <CheckCircle size={14} className="text-emerald-400" /> : <Clock size={14} className="text-slate-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${a.owner_signed ? 'text-emerald-400' : 'text-slate-500'}`}>
                          You {a.owner_signed ? 'Signed' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.resident_signed ? <CheckCircle size={14} className="text-emerald-400" /> : <Clock size={14} className="text-amber-400" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${a.resident_signed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          Resident {a.resident_signed ? 'Signed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.pdf_url && (
                        <a href={a.pdf_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                          <Download size={12} /> PDF
                        </a>
                      )}
                      {a.status === 'draft' && (
                        <button onClick={() => sendToResident(a.id)} disabled={sending === a.id}
                          className="flex items-center gap-2 px-5 py-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all disabled:opacity-40">
                          <Send size={12} />
                          {sending === a.id ? 'Sending...' : 'Send to Resident'}
                        </button>
                      )}
                      {a.status === 'expired' && (
                        <button className="flex items-center gap-2 px-5 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500/20 transition-all">
                          <RefreshCw size={12} /> Renew Agreement
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Generate Agreement Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white">Generate Agreement</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'resident_id',      label: 'Resident ID',          placeholder: 'e.g. 42', type: 'number' },
                  { key: 'rent_amount',      label: 'Monthly Rent (₹)',     placeholder: '8500', type: 'number' },
                  { key: 'security_deposit', label: 'Security Deposit (₹)', placeholder: '17000', type: 'number' },
                  { key: 'notice_period',    label: 'Notice Period (days)',  placeholder: '30', type: 'number' },
                  { key: 'start_date',       label: 'Start Date',           placeholder: '', type: 'date' },
                  { key: 'end_date',         label: 'End Date',             placeholder: '', type: 'date' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</label>
                    <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600 [color-scheme:dark]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={generate} disabled={generating || !form.resident_id || !form.rent_amount || !form.start_date || !form.end_date}
                  className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
