import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Bell, Package, Star, Megaphone, Plus, X } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const POST_TYPE_META: Record<string, { icon: any; color: string; label: string }> = {
  announcement: { icon: Megaphone, color: 'text-sky-400', label: 'Announcement' },
  lost_found:   { icon: Package,  color: 'text-amber-400', label: 'Lost & Found' },
  event:        { icon: Star,     color: 'text-violet-400', label: 'Event' },
  marketplace:  { icon: Users,    color: 'text-emerald-400', label: 'Marketplace' },
  notice:       { icon: Bell,     color: 'text-rose-400', label: 'Notice' },
};

export default function ResidentCommunity() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'announcement', title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const load = async () => {
    try {
      const res = await apiClient.get('/community');
      setPosts(res.data.data || []);
    } catch {
      setPosts([
        { id: 1, type: 'notice', title: 'Water supply off Sunday 7am–12pm', content: 'Due to maintenance work.', is_pinned: true, created_at: new Date().toISOString(), author: { full_name: 'Management' } },
        { id: 2, type: 'lost_found', title: 'Found: Black umbrella near entrance', content: 'Please collect from front desk.', is_pinned: false, created_at: new Date(Date.now() - 86400000).toISOString(), author: { full_name: 'Riya Sharma' } },
        { id: 3, type: 'event', title: 'Building BBQ Night — this Saturday!', content: 'Rooftop 7pm onwards. All residents welcome.', is_pinned: false, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), author: { full_name: 'Arjun Mehta' } },
        { id: 4, type: 'marketplace', title: 'Selling: Study table (good condition) ₹800', content: 'Contact Room 304.', is_pinned: false, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), author: { full_name: 'Priya Kumar' } },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.post('/community', { ...form, property_id: 1 });
      setShowForm(false);
      setForm({ type: 'announcement', title: '', content: '' });
      load();
    } catch { /* graceful */ }
    finally { setSubmitting(false); }
  };

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.type === activeFilter);

  return (
    <DashboardLayout title="Community">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Community</h2>
            <p className="text-slate-500 text-sm mt-1">Stay connected with your building community.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all">
            <Plus size={16} /> Post
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', ...Object.keys(POST_TYPE_META)].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === f ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-white/5 text-slate-500 border border-white/10 hover:text-white'}`}>
              {POST_TYPE_META[f]?.label || 'All'}
            </button>
          ))}
        </div>

        {/* New Post Modal */}
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white">New Community Post</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(POST_TYPE_META).map(([k, v]) => (
                      <button key={k} onClick={() => setForm(f => ({ ...f, type: k }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${form.type === k ? `${v.color} border-current bg-current/10` : 'text-slate-500 border-white/10 hover:border-white/20'}`}>
                        <v.icon size={16} />
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="What's happening?" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Details</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={3} placeholder="Add more details..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600 resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={submit} disabled={submitting || !form.title.trim()}
                  className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? [1,2,3].map(i => <div key={i} className="h-28 bg-white/5 rounded-[24px] animate-pulse" />) :
            filtered.map((post, i) => {
              const meta = POST_TYPE_META[post.type] || POST_TYPE_META.announcement;
              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`bg-[#080A0E]/60 border ${post.is_pinned ? 'border-neon-blue/20' : 'border-white/10'} rounded-[24px] p-6 group hover:border-white/20 transition-all`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${meta.color} shrink-0`}>
                      <meta.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {post.is_pinned && <span className="text-[9px] font-black uppercase tracking-widest text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                        <span className={`text-[9px] font-black uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
                      </div>
                      <h4 className="text-white font-bold">{post.title}</h4>
                      {post.content && <p className="text-slate-400 text-sm mt-1">{post.content}</p>}
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-3">
                        {post.author?.full_name} · {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          }
        </div>
      </div>
    </DashboardLayout>
  );
}
