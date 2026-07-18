import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  CreditCard, FileText, AlertCircle, ShoppingBag,
  Users, Zap, Bell, ChevronRight, CheckCircle2, Clock, ShieldCheck, LogIn, Utensils
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../services/api';

const QUICK_ACTIONS = [
  { to: '/resident/payments', icon: CreditCard, label: 'Pay Rent', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { to: '/resident/complaints', icon: AlertCircle, label: 'Complaint', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  { to: '/resident/agreement', icon: FileText, label: 'Agreement', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
  { to: '/resident/services', icon: ShoppingBag, label: 'Services', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { to: '/resident/community', icon: Users, label: 'Community', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
];

export default function ResidentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Daily food menu mock
  const foodMenu = {
    breakfast: 'Paneer Paratha, Curd & Tea',
    lunch: 'Dal Makhani, Rice, Roti & Salad',
    dinner: 'Kadai Chicken / Kadhai Paneer, Butter Roti & Kheer'
  };

  // Utility usage mock
  const utilities = {
    electricity: 84, // units
    water: 420, // litres
    wifi: 112 // GB used
  };

  // Pending visitor request mock
  const visitorRequest = {
    name: 'Suresh Kumar (Delivery Agent)',
    company: 'Zomato',
    status: 'pending'
  };

  useEffect(() => {
    (async () => {
      try {
        const [meRes, complaintsRes, bookingsRes] = await Promise.allSettled([
          api.get('/api/auth/me'),
          api.get('/api/complaints/mine'),
          api.get('/api/bookings'),
        ]);

        if (meRes.status === 'fulfilled') setProfile(meRes.value.data);
        if (complaintsRes.status === 'fulfilled') {
          const data = complaintsRes.value.data;
          const list = Array.isArray(data) ? data : (data.complaints || []);
          setComplaints(list.filter((c: any) => c.status !== 'resolved').slice(0, 2));
        }
        if (bookingsRes.status === 'fulfilled') {
          const data = bookingsRes.value.data;
          const list = Array.isArray(data) ? data : (data.bookings || []);
          const confirmed = list.find((b: any) => b.status === 'confirmed');
          if (confirmed) setActiveBooking(confirmed);
        }
      } catch { /* offline gracefully */ }
      finally { setLoading(false); }
    })();
  }, []);

  const goFlexScore = profile?.goflex_score?.overall_score ?? user?.goflex_score?.overall_score ?? '--';
  const badge = profile?.goflex_score?.verification_badge ?? 'bronze';
  const rentAmount = activeBooking?.total_amount ? `₹${activeBooking.total_amount.toLocaleString('en-IN')}` : '₹8,500';
  const propertyName = activeBooking?.property?.name ?? 'Your Property';


  return (
    <DashboardLayout title="Home Companion">
      <div className="space-y-8">
        
        {/* Welcome & Reputation Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8">
          <div>
            <h2 className="text-3xl font-black text-white">
              Welcome home, <span className="text-neon-blue">{user?.full_name?.split(' ')[0] || user?.username}</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-semibold uppercase tracking-wider">{propertyName}</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-6 py-3 rounded-2xl">
            <ShieldCheck className="text-emerald-400" size={24} />
            <div>
              <p className="text-white font-black text-sm">Two-Way Verified Resident</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">GoFlex Score: {goFlexScore}/100 · {badge.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Daily Life Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Columns: Rent, Menu, Visitors */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Rent Due Countdown Card */}
            <div className="relative rounded-[32px] border border-rose-400/20 bg-rose-400/5 p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-transparent pointer-events-none opacity-30" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-2">Rent Due</p>
                  <p className="text-4xl font-black text-white">{rentAmount} <span className="text-xs text-slate-500 font-semibold">/ month</span></p>
                  <p className="text-sm font-bold text-slate-400 mt-2">Next payment cycle due in 5 days</p>
                </div>
                <NavLink to="/resident/payments"
                  className="px-6 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap text-center">
                  Pay Rent Now
                </NavLink>
              </div>
            </div>

            {/* Today's Food Menu & Utilities Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily Food Menu */}
              <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-400/10 text-amber-400 rounded-xl"><Utensils size={20} /></div>
                  <div>
                    <h3 className="text-white font-black text-sm">Today's Food Menu</h3>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Meals served at cafeteria</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Breakfast', val: foodMenu.breakfast },
                    { label: 'Lunch', val: foodMenu.lunch },
                    { label: 'Dinner', val: foodMenu.dinner }
                  ].map((meal, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest">{meal.label}</p>
                      <p className="text-slate-300 text-xs mt-1 font-semibold">{meal.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utility Usage Tracker */}
              <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl"><Zap size={20} /></div>
                  <div>
                    <h3 className="text-white font-black text-sm">Utility Usage (MTD)</h3>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Real-time room telemetry</p>
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  {[
                    { label: 'Electricity Meter', val: `${utilities.electricity} units`, icon: Zap, color: 'text-amber-400' },
                    { label: 'Water Consumed', val: `${utilities.water} L`, icon: Users, color: 'text-sky-400' },
                    { label: 'WiFi Telemetry', val: `${utilities.wifi} GB`, icon: Users, color: 'text-violet-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-xs font-semibold">{item.label}</span>
                      <span className="text-white font-black text-sm">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Smart Visitor Gates */}
            {visitorRequest && (
              <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-emerald-400/10 text-emerald-400 rounded-xl"><LogIn size={20} /></div>
                  <div>
                    <p className="text-white font-bold">Visitor Gate Request</p>
                    <p className="text-slate-400 text-xs mt-1">{visitorRequest.name} from <span className="font-black text-neon-blue">{visitorRequest.company}</span> is requesting entry.</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto shrink-0">
                  <button className="flex-1 sm:flex-none px-6 py-3 border border-rose-400/20 text-rose-400 hover:bg-rose-400/10 font-bold rounded-xl text-xs uppercase tracking-widest">Deny</button>
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-emerald-400 text-[#0b0e14] font-black rounded-xl text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(52,211,153,0.3)]">Approve</button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Notices & Complaints */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-4">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map(a => (
                  <NavLink key={a.to} to={a.to} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${a.bg} ${a.border} hover:scale-105 transition-all text-center`}>
                    <a.icon size={18} className={a.color} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${a.color}`}>{a.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Notices / News */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-black text-sm">Notices & Community News</h3>
                <NavLink to="/resident/community" className="text-neon-blue text-[9px] font-black uppercase tracking-widest hover:underline">View Feed</NavLink>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Water grid maintenance on Sunday', desc: 'Water shutoff from 7 AM to 12 PM.', time: '2h ago' },
                  { title: 'Community board game night', desc: 'Friday evening in the common lounge.', time: '1d ago' },
                ].map((news, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-white font-bold text-xs">{news.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{news.desc}</p>
                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest pt-1">{news.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Complaints status */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-black text-sm">Maintenance Status</h3>
                <NavLink to="/resident/complaints" className="text-neon-blue text-[9px] font-black uppercase tracking-widest hover:underline">Track</NavLink>
              </div>
              {loading ? (
                <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
              ) : complaints.length === 0 ? (
                <div className="flex flex-col items-center py-4 text-slate-600">
                  <CheckCircle2 size={24} className="text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-white/50">All systems operational</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white text-xs font-bold truncate max-w-[150px]">{c.title}</p>
                        <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-0.5">{c.category}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

