import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import { FileText, Landmark, Receipt, Calendar, ArrowRight } from 'lucide-react';
import '../Dashboard.css';

export default function SubscriptionCurrent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active lease display for premium visual design
  const lease = {
    propertyName: 'GoFlex Indiranagar Node',
    city: 'Bengaluru',
    room: 'Room 204 (Single Sharing)',
    rent: 20000,
    platformFee: 200, // 1%
    totalRent: 20200,
    securityDepositEscrowed: 40000, // 2 months
    startDate: 'July 1, 2026',
    endDate: 'June 30, 2027',
    nextRentDue: 'August 1, 2026',
    status: 'ACTIVE'
  };

  return (
    <PageTransition>
      <section className="content-wrap dashboard-page space-y-8">
        <div className="dashboard-header flex justify-between items-center">
          <div>
            <h1 className="dashboard-title uppercase font-black text-white">Active Lease Ledger</h1>
            <p className="dashboard-subtitle">Real-time payment schedules, convenience fees, and escrow holdings</p>
          </div>
          <button 
            className="btn-cta text-xs py-2 px-4"
            onClick={() => navigate('/subscriptions/plans')}
          >
            Fee Structure Calculator
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Lease details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {lease.status}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3">{lease.propertyName}</h3>
                  <p className="text-slate-400 text-xs">{lease.room} • {lease.city}</p>
                </div>
                <FileText className="text-neon-blue/40" size={32} />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Lease Term</p>
                  <p className="text-sm font-bold text-slate-200 mt-1">{lease.startDate} - {lease.endDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Next Rent Due</p>
                  <p className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                    <Calendar size={14} className="text-neon-blue" /> {lease.nextRentDue}
                  </p>
                </div>
              </div>
            </div>

            {/* Escrow ledger card */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Digital Escrow Holdings</p>
                <h4 className="text-2xl font-black text-white">₹{lease.securityDepositEscrowed.toLocaleString()}</h4>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Locked in smart-contract escrow ledger</p>
              </div>
              <div className="p-4 bg-neon-blue/5 border border-neon-blue/15 rounded-2xl text-neon-blue">
                <Landmark size={24} />
              </div>
            </div>
          </div>

          {/* Fee breakdown sidebar */}
          <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 flex flex-col justify-between bg-white/[0.01]">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Receipt className="text-neon-blue" size={20} />
                <h4 className="text-lg font-black text-white">Monthly Invoice Split</h4>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Platform transaction fee of 1% convenience charge is appended to the rent value.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Monthly base rent:</span>
                  <span className="font-bold text-slate-300">₹{lease.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Platform fee (1%):</span>
                  <span className="font-bold text-neon-blue">+ ₹{lease.platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-4 border-t border-white/5">
                  <span>Total invoice:</span>
                  <span className="text-lg text-neon-blue font-black">₹{lease.totalRent.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/resident/payments')}
              className="w-full mt-8 py-4 bg-neon-blue text-obsidian rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all border-none bg-transparent"
            >
              Pay Rent Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
