import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ownerService } from '../../services/owner.service';

export default function OwnerResidents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billModal, setBillModal] = useState<{show: boolean, bookingId?: number, residentName?: string}>({show: false});
  const [billAmount, setBillAmount] = useState('');
  const [billDesc, setBillDesc] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ownerService.getResidents();
        setResidents(res.data);
      } catch (error) {
        console.error('Error fetching residents:', error);
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

  return (
    <DashboardLayout title="Resident Management">
      <div className="bg-[#080A0E]/60 backdrop-blur-xl border border-neon-blue/20 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-white text-xl font-black mb-1">Active Residents</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Global list of all tenants across your properties</p>
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-neon-blue/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">Resident</th>
                  <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">Property</th>
                  <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-slate-500 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
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
                          <div className="text-slate-500 text-[10px]">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="text-white/80 text-sm">{r.property_name}</div>
                      <div className="text-slate-500 text-[10px]">Booking #{r.booking_id}</div>
                    </td>
                    <td className="py-6">
                      <span className="px-2 py-1 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded text-[9px] font-black uppercase tracking-widest">
                        Active
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors" title="Message">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                        </button>
                        <button 
                          onClick={() => setBillModal({show: true, bookingId: Number(r.booking_id), residentName: r.full_name || r.username})}
                          className="px-3 py-1.5 border border-neon-blue/30 text-neon-blue rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-[#0B0E14] transition-all"
                        >
                          Issue Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill Modal (Same as Dashboard) */}
      {billModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-md" onClick={() => setBillModal({show: false})} />
            <div className="bg-[#0B0E14] border border-neon-blue/20 rounded-3xl p-8 w-full max-w-md relative z-10">
                <h3 className="text-white text-2xl font-black mb-2">Issue Bill</h3>
                <p className="text-slate-500 text-xs mb-8 font-bold uppercase tracking-widest">Issuing to: <span className="text-neon-blue">{billModal.residentName}</span></p>
                <div className="space-y-6">
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Amount (₹)</label>
                        <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold outline-none" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Description</label>
                        <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold outline-none h-24" value={billDesc} onChange={(e) => setBillDesc(e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-white/5 text-slate-400 font-black rounded-xl text-[10px] uppercase" onClick={() => setBillModal({show: false})}>Cancel</button>
                        <button className="flex-1 py-4 bg-neon-blue text-[#0B0E14] font-black rounded-xl text-[10px] uppercase" onClick={handleIssueBill}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </DashboardLayout>
  );
}
