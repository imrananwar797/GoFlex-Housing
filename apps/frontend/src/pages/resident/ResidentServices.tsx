import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ShoppingBag, Clock, CheckCircle, Calendar, ChevronRight, X } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const STATUS_STYLES: Record<string, string> = {
  pending:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  confirmed: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

interface Service { id: string; label: string; icon: string; price_from: number; turnaround: string; }

export default function ResidentServices() {
  const [catalogue, setCatalogue] = useState<Service[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Service | null>(null);
  const [description, setDescription] = useState('');
  const [booking, setBooking] = useState(false);

  const load = async () => {
    try {
      const [catRes, reqRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get('/services/requests'),
      ]);
      setCatalogue(catRes.data.data || []);
      setRequests(reqRes.data.data || []);
    } catch {
      setCatalogue([
        { id: 'cleaning',    label: 'House Cleaning',         icon: '🧹', price_from: 299,  turnaround: '2-4 hrs' },
        { id: 'laundry',     label: 'Laundry',                icon: '👕', price_from: 150,  turnaround: 'Next day' },
        { id: 'repairs',     label: 'Repairs & Maintenance',  icon: '🔧', price_from: 200,  turnaround: 'Same day' },
        { id: 'internet',    label: 'Internet Installation',  icon: '📶', price_from: 499,  turnaround: '1-2 days' },
        { id: 'groceries',   label: 'Grocery Delivery',       icon: '🛒', price_from: 0,    turnaround: '2 hrs' },
        { id: 'shifting',    label: 'House Shifting',         icon: '📦', price_from: 1999, turnaround: '1 day' },
        { id: 'painting',    label: 'Painting',               icon: '🎨', price_from: 5000, turnaround: '2-3 days' },
        { id: 'pest_control',label: 'Pest Control',           icon: '🪲', price_from: 799,  turnaround: '1 day' },
      ]);
      setRequests([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const bookService = async () => {
    if (!selected) return;
    setBooking(true);
    try {
      await apiClient.post('/services/request', {
        property_id: 1,
        service_type: selected.id,
        description,
        cost_estimate: selected.price_from,
      });
      setSelected(null);
      setDescription('');
      load();
    } catch { /* handle */ }
    finally { setBooking(false); }
  };

  return (
    <DashboardLayout title="Services">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white">Services Marketplace</h2>
          <p className="text-slate-500 text-sm mt-1">Book on-demand services for your stay — delivered to your door.</p>
        </div>

        {/* Service Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-36 bg-white/5 rounded-[24px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {catalogue.map((s, i) => (
              <motion.button key={s.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(s)}
                className="flex flex-col items-start gap-4 p-6 bg-[#080A0E]/60 border border-white/10 rounded-[24px] hover:border-neon-blue/30 hover:bg-neon-blue/5 transition-all group text-left">
                <span className="text-4xl">{s.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm group-hover:text-neon-blue transition-colors">{s.label}</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    {s.price_from > 0 ? `From ₹${s.price_from}` : 'Free delivery'} · {s.turnaround}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-neon-blue text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Book Now <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selected.icon}</span>
                  <div>
                    <h3 className="text-white font-black">{selected.label}</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{selected.turnaround}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-2xl">
                  <p className="text-neon-blue text-[10px] font-black uppercase tracking-widest mb-1">Estimated Cost</p>
                  <p className="text-white font-black text-xl">{selected.price_from > 0 ? `₹${selected.price_from}+` : 'Free'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Additional Notes</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    rows={3} placeholder="Any specific requirements or instructions?"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600 resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setSelected(null)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={bookService} disabled={booking}
                  className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* My Bookings */}
        {requests.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">My Service Bookings</p>
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] overflow-hidden">
              {requests.map((r, i) => (
                <div key={r.id} className="flex items-center gap-4 px-8 py-5 border-b border-white/5">
                  <ShoppingBag size={18} className="text-slate-400" />
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm capitalize">{r.service_type.replace('_', ' ')}</p>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[r.status] || ''}`}>
                    {r.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
