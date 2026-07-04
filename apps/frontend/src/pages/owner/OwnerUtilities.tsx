import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Zap, Droplets, Wifi, TrendingUp, Plus, X } from 'lucide-react';
import { apiClient } from '../../services/api.client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MOCK_DATA: any[] = [
  { id: 1, month: 4, year: 2026, room_id: 1, electricity: 120, water: 800, wifi_usage: 45, electricity_bill: 1440, water_bill: 240, wifi_bill: 399, total_bill: 2079, room: { name: 'Room 101' } },
  { id: 2, month: 4, year: 2026, room_id: 2, electricity: 95, water: 650, wifi_usage: 38, electricity_bill: 1140, water_bill: 195, wifi_bill: 399, total_bill: 1734, room: { name: 'Room 102' } },
  { id: 3, month: 4, year: 2026, room_id: 3, electricity: 140, water: 900, wifi_usage: 72, electricity_bill: 1680, water_bill: 270, wifi_bill: 399, total_bill: 2349, room: { name: 'Room 201' } },
  { id: 4, month: 5, year: 2026, room_id: 1, electricity: 130, water: 820, wifi_usage: 52, electricity_bill: 1560, water_bill: 246, wifi_bill: 399, total_bill: 2205, room: { name: 'Room 101' } },
  { id: 5, month: 5, year: 2026, room_id: 2, electricity: 88, water: 600, wifi_usage: 35, electricity_bill: 1056, water_bill: 180, wifi_bill: 399, total_bill: 1635, room: { name: 'Room 102' } },
  { id: 6, month: 5, year: 2026, room_id: 3, electricity: 155, water: 950, wifi_usage: 80, electricity_bill: 1860, water_bill: 285, wifi_bill: 399, total_bill: 2544, room: { name: 'Room 201' } },
];

const TREND_DATA = [
  { month: 'Feb', electricity: 1200, water: 600, wifi: 399 },
  { month: 'Mar', electricity: 1350, water: 680, wifi: 399 },
  { month: 'Apr', electricity: 1420, water: 710, wifi: 399 },
  { month: 'May', electricity: 1490, water: 740, wifi: 399 },
];

export default function OwnerUtilities() {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ room_id: '', month: '5', year: '2026', electricity: '', water: '', wifi_usage: '', electricity_bill: '', water_bill: '', wifi_bill: '' });

  useEffect(() => {
    (async () => {
      try {
        setReadings(MOCK_DATA);
      } catch { setReadings(MOCK_DATA); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = readings.filter(r => r.month === selectedMonth && r.year === selectedYear);
  const totalElectricity = filtered.reduce((s, r) => s + (r.electricity_bill || 0), 0);
  const totalWater       = filtered.reduce((s, r) => s + (r.water_bill || 0), 0);
  const totalWifi        = filtered.reduce((s, r) => s + (r.wifi_bill || 0), 0);
  const totalBill        = totalElectricity + totalWater + totalWifi;

  const save = async () => {
    setSaving(true);
    const calc = {
      electricity_bill: form.electricity_bill || String(Number(form.electricity) * 12),
      water_bill: form.water_bill || String(Number(form.water) * 0.3),
      wifi_bill: form.wifi_bill || '399',
    };
    const total_bill = Number(calc.electricity_bill) + Number(calc.water_bill) + Number(calc.wifi_bill);
    try {
      await apiClient.post('/utilities', { ...form, ...calc, total_bill, property_id: 1 });
    } catch { /* graceful */ }
    finally {
      setReadings(prev => [...prev, { id: Date.now(), ...form, ...calc, total_bill, room: { name: `Room ${form.room_id}` } }]);
      setShowForm(false);
      setSaving(false);
    }
  };

  const TOOLTIP_STYLE = { backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' };

  return (
    <DashboardLayout title="Utility Tracker">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Utility Tracker</h2>
            <p className="text-slate-500 text-sm mt-1">Monthly electricity, water, and WiFi usage per room.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Month selector */}
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
              className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon-blue/50">
              {MONTHS.map((m, i) => <option key={i} value={i + 1} className="bg-[#0B0E14]">{m}</option>)}
            </select>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all">
              <Plus size={14} /> Add Reading
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Electricity', value: `₹${totalElectricity.toLocaleString('en-IN')}`, icon: Zap,      color: 'text-amber-400', bg: 'bg-amber-400/5 border-amber-400/20' },
            { label: 'Water',       value: `₹${totalWater.toLocaleString('en-IN')}`,       icon: Droplets,  color: 'text-sky-400',   bg: 'bg-sky-400/5 border-sky-400/20' },
            { label: 'WiFi',        value: `₹${totalWifi.toLocaleString('en-IN')}`,        icon: Wifi,      color: 'text-violet-400',bg: 'bg-violet-400/5 border-violet-400/20' },
            { label: 'Total Bill',  value: `₹${totalBill.toLocaleString('en-IN')}`,        icon: TrendingUp,color: 'text-emerald-400',bg: 'bg-emerald-400/5 border-emerald-400/20' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 p-6 rounded-[24px] border ${s.bg}`}>
              <s.icon size={20} className={s.color} />
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart: per room this month */}
          <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8">
            <p className="text-white font-black mb-6">Room-wise Bills — {MONTHS[selectedMonth - 1]}</p>
            {filtered.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-slate-600">
                <p className="text-sm">No data for this month</p>
              </div>
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filtered} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="room.name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`₹${v}`, '']} />
                    <Bar dataKey="electricity_bill" name="Electricity" fill="#FBBF24" radius={[4,4,0,0]} />
                    <Bar dataKey="water_bill"       name="Water"       fill="#38BDF8" radius={[4,4,0,0]} />
                    <Bar dataKey="wifi_bill"        name="WiFi"        fill="#A78BFA" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Trend chart */}
          <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8">
            <p className="text-white font-black mb-6">Monthly Trend</p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`₹${v}`, '']} />
                  <Line type="monotone" dataKey="electricity" stroke="#FBBF24" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="water"       stroke="#38BDF8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="wifi"        stroke="#A78BFA" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detail Table */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] overflow-hidden">
          <div className="px-8 py-5 border-b border-white/5">
            <p className="text-white font-black">Room-wise Breakdown — {MONTHS[selectedMonth - 1]} {selectedYear}</p>
          </div>
          {loading ? (
            <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-600">
              <p className="text-sm">No readings for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Room', 'Electricity (units)', 'Water (L)', 'WiFi (GB)', 'Elec Bill', 'Water Bill', 'WiFi Bill', 'Total'].map(h => (
                      <th key={h} className="px-6 py-4 text-slate-500 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.015] transition-colors">
                      <td className="px-6 py-4 text-white font-bold text-sm whitespace-nowrap">{r.room?.name}</td>
                      <td className="px-6 py-4 text-amber-400 font-bold text-sm">{r.electricity}</td>
                      <td className="px-6 py-4 text-sky-400 font-bold text-sm">{r.water}</td>
                      <td className="px-6 py-4 text-violet-400 font-bold text-sm">{r.wifi_usage}</td>
                      <td className="px-6 py-4 text-slate-300 text-sm">₹{r.electricity_bill}</td>
                      <td className="px-6 py-4 text-slate-300 text-sm">₹{r.water_bill}</td>
                      <td className="px-6 py-4 text-slate-300 text-sm">₹{r.wifi_bill}</td>
                      <td className="px-6 py-4 text-emerald-400 font-black text-sm">₹{r.total_bill}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Reading Modal */}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[32px] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white">Add Utility Reading</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'room_id', label: 'Room ID', placeholder: '1' },
                { key: 'electricity', label: 'Electricity (units)', placeholder: '120' },
                { key: 'water', label: 'Water (litres)', placeholder: '800' },
                { key: 'wifi_usage', label: 'WiFi (GB)', placeholder: '45' },
                { key: 'electricity_bill', label: 'Elec Bill (₹)', placeholder: 'Auto-calc' },
                { key: 'water_bill', label: 'Water Bill (₹)', placeholder: 'Auto-calc' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 placeholder:text-slate-600" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-2xl text-sm font-black hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={save} disabled={saving || !form.room_id}
                className="flex-1 py-3 bg-neon-blue/20 border border-neon-blue/40 text-neon-blue rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neon-blue/30 transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Reading'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
