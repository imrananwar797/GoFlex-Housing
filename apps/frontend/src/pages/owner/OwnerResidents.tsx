import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { User, Home, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

const BADGE_COLORS: Record<string, string> = {
  platinum: 'bg-violet-400/20 text-violet-400',
  gold: 'bg-amber-400/20 text-amber-400',
  silver: 'bg-slate-400/20 text-slate-300',
  bronze: 'bg-orange-700/20 text-orange-400',
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'bg-emerald-400/20 text-emerald-400',
  pending: 'bg-amber-400/20 text-amber-400',
  refunded: 'bg-sky-400/20 text-sky-400',
};

export default function OwnerResidents() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/owner/residents')
      .then(r => setBookings(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <DashboardLayout title="My Residents">
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-black text-white">Active Residents</h2>
          <p className="text-slate-500 text-sm mt-0.5">{bookings.length} confirmed bookings across all properties</p>
        </div>

        {/* Table */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-6 py-4">Resident</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Property / Room</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Lease Period</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Rent</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">GoFlex Score</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-600 font-semibold">No confirmed bookings yet</td>
                  </tr>
                ) : (
                  bookings.map(b => {
                    const score = b.resident?.goflex_score;
                    return (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                              <User size={14} className="text-neon-blue" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">{b.resident?.full_name || 'Unknown'}</p>
                              <p className="text-slate-500 text-xs">{b.resident?.email}</p>
                              {b.resident?.phone && <p className="text-slate-600 text-[10px]">{b.resident.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white text-sm font-semibold">{b.property?.name || '--'}</p>
                          <p className="text-slate-500 text-xs">{b.room?.name} · {b.room?.type}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white text-sm">{formatDate(b.check_in_date)}</p>
                          <p className="text-slate-500 text-xs">to {formatDate(b.check_out_date)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white font-black text-sm">₹{b.total_amount?.toLocaleString('en-IN')}</p>
                          <p className="text-slate-500 text-[10px]">per month</p>
                        </td>
                        <td className="px-4 py-4">
                          {score ? (
                            <div>
                              <p className="text-white font-black text-sm">{score.overall_score}/100</p>
                              <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-wider ${BADGE_COLORS[score.verification_badge] || BADGE_COLORS.bronze}`}>
                                {score.verification_badge}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${PAYMENT_COLORS[b.payment_status] || 'bg-white/10 text-white'}`}>
                            {b.payment_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
