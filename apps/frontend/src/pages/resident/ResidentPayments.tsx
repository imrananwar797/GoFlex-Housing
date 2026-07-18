import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { CreditCard, Download, CheckCircle, Clock, XCircle, IndianRupee } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-400/20 text-emerald-400',
  pending: 'bg-amber-400/20 text-amber-400',
  failed: 'bg-rose-400/20 text-rose-400',
  refunded: 'bg-sky-400/20 text-sky-400',
};

const STATUS_ICONS: Record<string, any> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  refunded: CreditCard,
};

export default function ResidentPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPaid, setTotalPaid] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const limit = 15;

  useEffect(() => {
    api.get(`/api/payments?page=${page}&limit=${limit}`)
      .then(r => {
        const data = r.data;
        const list: any[] = Array.isArray(data) ? data : (data.payments || []);
        setPayments(list);
        setTotal(data.total || list.length);
        setTotalPaid(list.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0));
        setPendingAmount(list.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleDownloadReceipt = async (paymentId: number) => {
    try {
      const res = await api.get(`/api/payments/receipt/${paymentId}`);
      const receipt = res.data.receipt;
      // Create printable receipt
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <html><head><title>GoFlex Payment Receipt</title>
        <style>
          body { font-family: 'Inter', sans-serif; max-width: 600px; margin: 40px auto; color: #1a1a2e; }
          h1 { color: #00D1FF; } hr { border-color: #e5e7eb; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; }
          .label { color: #64748b; font-size: 14px; } .value { font-weight: 700; }
          .total { background: #f0f9ff; padding: 16px; border-radius: 12px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px; }
        </style></head><body>
        <h1>🏠 GoFlex Housing</h1>
        <p>Official Payment Receipt</p><hr>
        <div class="row"><span class="label">Receipt No.</span><span class="value">${receipt.receipt_no}</span></div>
        <div class="row"><span class="label">Resident</span><span class="value">${receipt.resident_name || '--'}</span></div>
        <div class="row"><span class="label">Property</span><span class="value">${receipt.property_name || '--'}</span></div>
        <div class="row"><span class="label">Room</span><span class="value">${receipt.room_name || '--'}</span></div>
        <div class="row"><span class="label">Payment Date</span><span class="value">${new Date(receipt.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
        <hr>
        <div class="row"><span class="label">Rent Amount</span><span class="value">₹${receipt.rent_amount?.toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Convenience Fee (1%)</span><span class="value">₹${receipt.convenience_fee?.toFixed(2)}</span></div>
        <div class="total">
          <div class="row"><span class="label" style="font-weight:700">Total Paid</span><span class="value" style="color:#059669;font-size:20px">₹${receipt.total_paid?.toLocaleString('en-IN')}</span></div>
        </div>
        <div class="footer">GoFlex Housing — Transparent. Trustworthy. Tech-Forward.<br>This is a computer-generated receipt and does not require a signature.</div>
        </body></html>
      `);
      win.print();
    } catch { alert('Could not generate receipt.'); }
  };

  return (
    <DashboardLayout title="Payment History">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-white">Payment History</h2>
          <p className="text-slate-500 text-sm mt-0.5">All your rent and service payments</p>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-[20px] p-5 flex items-center gap-4">
              <div className="p-3 bg-emerald-400/20 rounded-xl">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Paid</p>
                <p className="text-white font-black text-xl mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-[20px] p-5 flex items-center gap-4">
              <div className="p-3 bg-amber-400/20 rounded-xl">
                <Clock size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pending</p>
                <p className="text-white font-black text-xl mt-1">₹{pendingAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-neon-blue/10 border border-neon-blue/20 rounded-[20px] p-5 flex items-center gap-4">
              <div className="p-3 bg-neon-blue/20 rounded-xl">
                <CreditCard size={20} className="text-neon-blue" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Transactions</p>
                <p className="text-white font-black text-xl mt-1">{total}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Table */}
        <div className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-6 py-4">Payment</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Property</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Date</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Amount</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Status</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-4">Receipt</th>
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
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-600 font-semibold">No payments found</td>
                  </tr>
                ) : (
                  payments.map(p => {
                    const Icon = STATUS_ICONS[p.status] || CreditCard;
                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${STATUS_STYLES[p.status] || 'bg-white/10 text-white'}`}>
                              <Icon size={14} />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">Monthly Rent</p>
                              <p className="text-slate-600 text-[10px] font-mono">{p.stripe_payment_id?.substring(0, 16)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white text-sm font-semibold">{p.booking?.property?.name || '--'}</p>
                          <p className="text-slate-500 text-xs">{p.booking?.room?.name || ''}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white text-sm">{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white font-black text-sm">₹{p.amount.toLocaleString('en-IN')}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[p.status] || 'bg-white/10 text-white'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {p.status === 'completed' && (
                            <button
                              onClick={() => handleDownloadReceipt(p.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                              <Download size={10} /> Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-slate-500 text-xs">Page {page} of {Math.ceil(total / limit)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/10 transition-colors"
                >Previous</button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= total}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/10 transition-colors"
                >Next</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
