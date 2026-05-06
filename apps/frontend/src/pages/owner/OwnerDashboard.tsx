import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TickerGrid from '../../components/dashboard/TickerCards';
import ConsumptionChart from '../../components/dashboard/ConsumptionChart';
import { ownerService } from '../../services/owner.service';
import { TrendingUp, Users, Home as HomeIcon, BookOpen } from 'lucide-react';

export default function OwnerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billModal, setBillModal] = useState<{show: boolean, bookingId?: number, residentName?: string}>({show: false});
  const [billAmount, setBillAmount] = useState('');
  const [billDesc, setBillDesc] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, residentsRes] = await Promise.all([
          ownerService.getDashboardStats(),
          ownerService.getResidents()
        ]);
        setStats(statsRes.stats);
        setResidents(residentsRes.data);
      } catch (error) {
        console.error('Error fetching owner dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleIssueBill = async () => {
    if (!billModal.bookingId || !billAmount) return;
    try {
      await ownerService.issueBill(billModal.bookingId, parseFloat(billAmount), billDesc);
      alert('Bill issued successfully!');
      setBillModal({show: false});
      setBillAmount('');
      setBillDesc('');
    } catch (error) {
      alert('Failed to issue bill');
    }
  };

  const tickerItems = [
    { title: "Total Revenue", value: `₹${stats?.total_revenue?.toLocaleString() || '0'}`, icon: TrendingUp, trend: "+12.5%", statusColor: "green" as const },
    { title: "Active Residents", value: stats?.active_residents?.toString() || '0', icon: Users, trend: "Stable" },
    { title: "Occupancy Rate", value: `${stats?.occupancy_rate?.toFixed(1) || '0'}%`, icon: HomeIcon, statusColor: (stats?.occupancy_rate > 80 ? "green" : "blue") as any },
    { title: "Total Bookings", value: stats?.total_bookings?.toString() || '0', icon: BookOpen },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin shadow-neon-blue" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Owner Management Center">
      <div className="space-y-8">
        {/* Top Ticker Section */}
        <section>
          <TickerGrid items={tickerItems} />
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Chart Section */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-neon-blue/20 rounded-3xl p-4 sm:p-8 relative overflow-hidden h-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-white text-xl font-black mb-1">Portfolio Growth</h4>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Revenue and booking trends across all assets</p>
                    </div>
                </div>
                <ConsumptionChart 
                    title="Revenue Trend" 
                    subtitle="Weekly performance tracking" 
                    color="#8A7BFF" 
                    dataKey="revenue"
                    chartData={[
                        { name: 'Mon', revenue: 4200 },
                        { name: 'Tue', revenue: 3800 },
                        { name: 'Wed', revenue: 5100 },
                        { name: 'Thu', revenue: 4600 },
                        { name: 'Fri', revenue: 6200 },
                        { name: 'Sat', revenue: 5800 },
                        { name: 'Sun', revenue: 7100 },
                    ]}
                />
            </div>
          </div>

          {/* Quick Actions / Stats */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-neon-blue rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[250px] lg:min-h-[300px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all duration-700" />
                
                <div>
                    <p className="text-[#0B0E14] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Management Quick-Link</p>
                    <h4 className="text-[#0B0E14] text-3xl font-black leading-tight">Need to list a new property?</h4>
                </div>

                <button className="w-full py-4 bg-[#0B0E14] text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all">
                    List Property Now
                </button>
            </div>
          </div>

          {/* Residents Table */}
          <div className="col-span-12">
            <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-neon-blue/20 rounded-3xl p-4 sm:p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-white text-xl font-black mb-1">Active Residents</h4>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Manage and bill your tenants directly</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">Resident</th>
                                <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">Property</th>
                                <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">Email</th>
                                <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {residents.map((r) => (
                                <tr key={r.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue font-black text-xs uppercase">
                                                {r.username.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-bold">{r.full_name || r.username}</div>
                                                <div className="text-slate-500 text-[10px]">ID: #{r.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <div className="text-white/80 text-sm">{r.property_name}</div>
                                    </td>
                                    <td className="py-6">
                                        <div className="text-slate-500 text-sm">{r.email}</div>
                                    </td>
                                    <td className="py-6 text-right">
                                        <button 
                                            onClick={() => setBillModal({show: true, bookingId: Number(r.booking_id), residentName: r.full_name || r.username})}
                                            className="px-4 py-2 border border-neon-blue/30 text-neon-blue rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-[#0B0E14] transition-all"
                                        >
                                            Issue Bill
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Modal */}
      {billModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-md" onClick={() => setBillModal({show: false})} />
            <div className="bg-[#0B0E14] border border-neon-blue/20 rounded-3xl p-6 sm:p-8 w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-300">
                <h3 className="text-white text-2xl font-black mb-2">Issue Bill</h3>
                <p className="text-slate-500 text-xs mb-8 font-bold uppercase tracking-widest">Issuing to: <span className="text-neon-blue">{billModal.residentName}</span></p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Amount (₹)</label>
                        <input 
                            type="number" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:border-neon-blue/50 outline-none transition-all"
                            placeholder="Enter amount..."
                            value={billAmount}
                            onChange={(e) => setBillAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Description</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:border-neon-blue/50 outline-none transition-all h-32"
                            placeholder="Utility bill, Maintenance, etc..."
                            value={billDesc}
                            onChange={(e) => setBillDesc(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                        <button 
                            className="flex-1 py-4 bg-white/5 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                            onClick={() => setBillModal({show: false})}
                        >
                            Cancel
                        </button>
                        <button 
                            className="flex-1 py-4 bg-neon-blue text-[#0B0E14] font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-neon-blue/20"
                            onClick={handleIssueBill}
                        >
                            Confirm & Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </DashboardLayout>
  );
}
