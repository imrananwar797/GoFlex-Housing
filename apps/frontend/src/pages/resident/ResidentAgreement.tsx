import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Download, CheckCircle, Clock, AlertCircle, Shield, ExternalLink } from 'lucide-react';
import { apiClient } from '../../services/api.client';

const STATUS_META: Record<string, { label: string; icon: any; color: string }> = {
  draft:  { label: 'Draft',   icon: Clock,        color: 'text-slate-400'   },
  sent:   { label: 'Sent',    icon: AlertCircle,  color: 'text-amber-400'   },
  signed: { label: 'Signed',  icon: CheckCircle,  color: 'text-emerald-400' },
  expired:{ label: 'Expired', icon: AlertCircle,  color: 'text-rose-400'    },
};

export default function ResidentAgreement() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await apiClient.get('/agreements');
      setAgreements(res.data.data || []);
    } catch {
      // seed mock data for demo
      setAgreements([{
        id: 1,
        status: 'sent',
        rent_amount: 8500,
        security_deposit: 17000,
        start_date: new Date('2026-07-01').toISOString(),
        end_date: new Date('2027-06-30').toISOString(),
        resident_signed: false,
        owner_signed: true,
        digilocker_ref: null,
        pdf_url: null,
        property: { name: 'GoFlex Indiranagar Node', city: 'Bengaluru' },
        owner: { full_name: 'Rakesh Sharma' },
      }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const sign = async (id: number) => {
    setSigning(id);
    try {
      await apiClient.post(`/agreements/${id}/sign`, {});
      load();
    } catch { /* handle */ }
    finally { setSigning(null); }
  };

  const openDigiLocker = () => {
    // DigiLocker OAuth flow — redirect to DigiLocker authorization endpoint
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: import.meta.env.VITE_DIGILOCKER_CLIENT_ID || 'DEMO_CLIENT_ID',
      redirect_uri: `${window.location.origin}/resident/agreement/digilocker-callback`,
      state: 'goflex-agreement',
      scope: 'openid',
    });
    window.open(`https://api.digitallocker.gov.in/public/oauth2/1/authorize?${params.toString()}`, '_blank');
  };

  return (
    <DashboardLayout title="Agreement">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white">Rental Agreements</h2>
          <p className="text-slate-500 text-sm mt-1">View, sign, and download your digital rental agreements.</p>
        </div>

        {/* DigiLocker Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[24px] bg-violet-500/5 border border-violet-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl">
              <Shield size={24} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-black">DigiLocker Verified Signing</p>
              <p className="text-slate-500 text-sm">Sign your agreement digitally via Aadhaar-backed DigiLocker eSign.</p>
            </div>
          </div>
          <button onClick={openDigiLocker}
            className="flex items-center gap-2 px-6 py-3 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-violet-500/20 transition-all whitespace-nowrap">
            <ExternalLink size={14} /> Connect DigiLocker
          </button>
        </motion.div>

        {/* Agreements List */}
        {loading ? (
          <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-48 bg-white/5 rounded-[24px] animate-pulse" />)}</div>
        ) : agreements.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-slate-600">
            <FileText size={48} className="mb-4 opacity-30" />
            <p className="font-black text-lg text-white/20">No agreements yet</p>
            <p className="text-sm mt-2">Your owner will generate one when your booking is confirmed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agreements.map((a, i) => {
              const meta = STATUS_META[a.status] || STATUS_META.draft;
              const duration = Math.round((new Date(a.end_date).getTime() - new Date(a.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30));
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-[#080A0E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <FileText size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-black">{a.property?.name}</p>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{a.property?.city} · Owner: {a.owner?.full_name}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest bg-current/10 border-current/20 ${meta.color}`}>
                      <meta.icon size={12} />
                      {meta.label}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border-b border-white/5">
                    {[
                      { label: 'Monthly Rent',   value: `₹${a.rent_amount.toLocaleString('en-IN')}` },
                      { label: 'Security Deposit', value: `₹${(a.security_deposit || 0).toLocaleString('en-IN')}` },
                      { label: 'Duration',         value: `${duration} months` },
                      { label: 'Expires',          value: new Date(a.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
                    ].map((d, di) => (
                      <div key={di} className="px-6 py-4 bg-[#080A0E]/80">
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">{d.label}</p>
                        <p className="text-white font-black">{d.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Signature Status & Actions */}
                  <div className="px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {a.owner_signed
                          ? <CheckCircle size={16} className="text-emerald-400" />
                          : <Clock size={16} className="text-slate-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${a.owner_signed ? 'text-emerald-400' : 'text-slate-500'}`}>
                          Owner {a.owner_signed ? 'Signed' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.resident_signed
                          ? <CheckCircle size={16} className="text-emerald-400" />
                          : <Clock size={16} className="text-amber-400" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${a.resident_signed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          You {a.resident_signed ? 'Signed' : '— Action Required'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.pdf_url && (
                        <a href={a.pdf_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                          <Download size={14} /> Download PDF
                        </a>
                      )}
                      {!a.resident_signed && (
                        <button onClick={() => sign(a.id)} disabled={signing === a.id}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400/20 transition-all disabled:opacity-50">
                          <Shield size={14} />
                          {signing === a.id ? 'Signing...' : 'Sign via DigiLocker'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
