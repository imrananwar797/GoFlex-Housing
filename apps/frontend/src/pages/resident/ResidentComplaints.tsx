import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { AlertCircle, Plus, X, ChevronDown } from 'lucide-react';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  high: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
  medium: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  low: 'bg-slate-400/20 text-slate-400 border-slate-400/30',
};

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-rose-400/20 text-rose-400',
  in_progress: 'bg-amber-400/20 text-amber-400',
  resolved: 'bg-emerald-400/20 text-emerald-400',
  closed: 'bg-slate-400/20 text-slate-400',
};

export default function ResidentComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'maintenance',
    priority: 'medium',
    title: '',
    description: '',
  });

  const fetchComplaints = () => {
    api.get('/api/complaints/mine')
      .then(r => {
        const data = r.data;
        setComplaints(Array.isArray(data) ? data : (data.complaints || []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/api/complaints', form);
      setShowForm(false);
      setForm({ category: 'maintenance', priority: 'medium', title: '', description: '' });
      fetchComplaints();
    } catch { alert('Failed to submit complaint. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const openCount = complaints.filter(c => ['open', 'in_progress'].includes(c.status)).length;

  return (
    <DashboardLayout title="Support & Complaints">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">My Complaints</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {openCount > 0 ? (
                <span className="text-amber-400 font-bold">{openCount} active issue{openCount > 1 ? 's' : ''}</span>
              ) : (
                <span className="text-emerald-400 font-bold">All clear — no open issues</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-neon-blue text-[#0b0e14] font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all"
          >
            <Plus size={14} /> File Complaint
          </button>
        </div>

        {/* New Complaint Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0d1117] border border-white/10 rounded-[24px] p-8 w-full max-w-lg space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-black text-lg">File a New Complaint</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-neon-blue/50"
                    >
                      <option value="maintenance">Maintenance</option>
                      <option value="cleanliness">Cleanliness</option>
                      <option value="noise">Noise</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-neon-blue/50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Title</label>
                  <input
                    required
                    type="text"
                    placeholder="Brief summary of the issue..."
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-white/10 text-slate-400 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-neon-blue text-[#0b0e14] font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-[20px] animate-pulse" />
            ))
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center">
                <AlertCircle size={24} className="text-emerald-400" />
              </div>
              <p className="text-white font-bold">No complaints filed</p>
              <p className="text-slate-500 text-sm text-center max-w-xs">Everything is in order! If you encounter any issues, use the "File Complaint" button above.</p>
            </div>
          ) : (
            complaints.map(c => (
              <div key={c.id} className="bg-[#080A0E]/60 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium}`}>
                        {c.priority}
                      </span>
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{c.category}</span>
                    </div>
                    <p className="text-white font-bold">{c.title}</p>
                    {c.description && (
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">{c.description}</p>
                    )}
                    <p className="text-slate-600 text-[10px] mt-2 font-semibold">
                      {c.property?.name && <span className="mr-2">{c.property.name}</span>}
                      Filed {new Date(c.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[c.status] || STATUS_COLORS.open}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                    {c.resolved_at && (
                      <p className="text-slate-600 text-[9px] text-right mt-1">
                        Resolved {new Date(c.resolved_at).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
